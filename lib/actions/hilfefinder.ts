"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { after } from "next/server";
import { resolveStandortForPlz } from "@/lib/resolve-standort-plz";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { cookies } from "next/headers";
import { CONSENT_COOKIE_NAME } from "@/lib/consent";
import { hasMarketingConsentFromCookieValue } from "@/lib/consent-server";
import { sendMetaLeadCapiEvent } from "@/lib/meta/capi";
import {
  buildBrandedNotificationHtml,
  type EmailDetailRow,
} from "@/lib/email/branded-html";
import {
  parseNotificationEmailList,
  sendInternalMail,
} from "@/lib/email/internal-smtp";
import {
  getContactSourceLabel,
  isValidContactSource,
} from "@/lib/contact-source";
import { recordContactSource, type ContactSourceKind } from "@/lib/contact-source-tracking";

/** Zentrale Adresse, wenn weder NOTIFICATION_TO_CONTACT noch NOTIFICATION_TO gesetzt sind. */
const DEFAULT_CONTACT_INBOX = "info@alltagshilfe-sued.de";

function dedupeEmails(emails: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of emails) {
    const e = raw.trim();
    if (!e.includes("@")) continue;
    const key = e.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

function getDefaultContactRecipients(): string[] {
  const contact = parseNotificationEmailList(process.env.NOTIFICATION_TO_CONTACT);
  if (contact.length > 0) return contact;
  const general = parseNotificationEmailList(process.env.NOTIFICATION_TO);
  if (general.length > 0) return general;
  return [DEFAULT_CONTACT_INBOX];
}

export type HilfefinderKontaktArt = "rueckruf" | "selbst";

/**
 * Meta-Tracking-Signale der FB-Landingpage (nur technische Browser-Signale,
 * keine Formulardaten). Nur bei Marketing-Consent befüllt.
 */
export type HilfefinderMetaTracking = {
  marketingConsent: boolean;
  fbp?: string;
  fbc?: string;
};

export type HilfefinderInput = {
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  besteZeit?: string;
  nachricht?: string;
  pflegegrad?: string;
  fuerWen?: string;
  /** 5-stellige PLZ (oder leerer String). */
  plz?: string;
  /** Vom Nutzer ausgewählte Leistungen (Anzeigetexte). */
  leistungen?: string[];
  kontaktArt: HilfefinderKontaktArt;
  /** Pflichtangabe „Wie sind Sie auf uns aufmerksam geworden?" (Slug). */
  contactSource?: string;
  datenschutz: boolean;
  /** Honeypot (sollte stets leer bleiben). */
  website?: string;
  /** Aggregat-Kanal für Admin-Statistik (Standard: Hilfe-Finder). */
  statsKind?: ContactSourceKind;
  /** Meta-Lead-Tracking (nur FB-Landingpage, nur Marketing-Consent). */
  meta?: HilfefinderMetaTracking;
};

export type HilfefinderResult = {
  success: boolean;
  error?: string;
  /**
   * Nur gesetzt, wenn die Anfrage erfolgreich verarbeitet wurde und Meta-Lead-Tracking
   * greift (FB-Landingpage + Marketing-Consent). Der Client sendet das Browser-`Lead`
   * mit exakt dieser ID – Meta dedupliziert Browser- und CAPI-Event darüber.
   */
  metaLeadEventId?: string;
};

/**
 * Anfrage aus dem 60-Sekunden-Hilfefinder versenden.
 * Empfänger:
 *  - Mit PLZ: zuständiger Standort (exakt, sonst nächster per Geo-Zuordnung) + zentrale Inbox (dedupliziert).
 *  - Ohne PLZ: Zentrale Allgäu + zentrale Inbox.
 */
export async function submitHilfefinder(input: HilfefinderInput): Promise<HilfefinderResult> {
  if (typeof input?.website === "string" && input.website.length > 0) {
    return { success: true };
  }

  if (!input?.kontaktArt || (input.kontaktArt !== "rueckruf" && input.kontaktArt !== "selbst")) {
    return { success: false, error: "Bitte wählen Sie eine Kontaktart aus." };
  }

  const vorname = String(input.vorname ?? "").trim();
  const nachname = String(input.nachname ?? "").trim();
  const email = String(input.email ?? "").trim();
  const telefon = String(input.telefon ?? "").trim();
  if (!vorname || !nachname || !telefon || !email) {
    return {
      success: false,
      error: "Bitte füllen Sie Vorname, Nachname, Telefonnummer und E-Mail aus.",
    };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { success: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse an." };
  }
  if (!input.datenschutz) {
    return {
      success: false,
      error:
        "Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben und der Verarbeitung Ihrer Daten zustimmen.",
    };
  }
  if (!isValidContactSource(input.contactSource)) {
    return {
      success: false,
      error: "Bitte geben Sie an, wie Sie auf uns aufmerksam geworden sind.",
    };
  }
  const contactSource = input.contactSource;
  const sourceLabel = getContactSourceLabel(contactSource);
  const statsKind: ContactSourceKind = input.statsKind ?? "hilfefinder";
  const isSocialLanding = statsKind === "landingpage-social-media";

  const ip = await getClientIp();
  const { success: allowed } = rateLimit(`hilfefinder:${ip}`);
  if (!allowed) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const plzNorm = String(input.plz ?? "").replace(/\D/g, "").slice(0, 5);
  const { standort, match: standortMatch } = resolveStandortForPlz(plzNorm);
  const standortEmail = standort.email?.trim();

  let finalTo: string[];
  if (standortEmail && standortEmail.includes("@")) {
    finalTo = dedupeEmails([...getDefaultContactRecipients(), standortEmail]);
  } else {
    finalTo = [DEFAULT_CONTACT_INBOX];
  }

  const kontaktLabel =
    input.kontaktArt === "rueckruf"
      ? "Rückruf gewünscht"
      : "Die Person wünscht, dass man mit ihr Kontakt aufnimmt";
  const fuerWenLabel =
    input.fuerWen === "selbst"
      ? "Für mich"
      : input.fuerWen === "andere"
        ? "Für Angehörige/Bekannte"
        : "-";
  const leistungenList = Array.isArray(input.leistungen)
    ? input.leistungen.filter((l): l is string => typeof l === "string" && l.trim().length > 0)
    : [];
  const leistungenInline = leistungenList.length > 0 ? leistungenList.join(", ") : "-";
  const leistungenBlock =
    leistungenList.length > 0 ? leistungenList.map((l) => `- ${l}`).join("\n") : "-";
  const nachrichtText = String(input.nachricht ?? "").trim();
  const besteZeitText = String(input.besteZeit ?? "").trim();

  const formLabel = isSocialLanding ? "Social-Media-Landingpage" : "Hilfe-Finder";

  const text = [
    `Neue Anfrage über ${isSocialLanding ? "die Social-Media-Landingpage" : "den Hilfe-Finder"}`,
    "",
    `Kontaktart: ${kontaktLabel}`,
    `Pflegegrad: ${input.pflegegrad?.trim() || "-"}`,
    `Für wen: ${fuerWenLabel}`,
    `PLZ: ${plzNorm || "-"}`,
    standort ? `Standort: ${standort.name}${standortMatch === "nearest" ? " (nächster Standort zur PLZ)" : ""}` : null,
    `Wie auf uns aufmerksam geworden: ${sourceLabel}`,
    "",
    "Ausgewählte Leistungen:",
    leistungenBlock,
    "",
    `Name: ${vorname} ${nachname}`,
    `E-Mail: ${email}`,
    `Telefon: ${telefon}`,
    besteZeitText ? `Passender Tag/Uhrzeit: ${besteZeitText}` : null,
    "",
    "Nachricht:",
    nachrichtText || "-",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const rows: EmailDetailRow[] = [
    { label: "Kontaktart", value: kontaktLabel },
    { label: "Pflegegrad", value: input.pflegegrad?.trim() || "-" },
    { label: "Für wen", value: fuerWenLabel },
    { label: "PLZ", value: plzNorm || "-" },
  ];
  if (standort) {
    rows.push({
      label: "Standort",
      value:
        standortMatch === "nearest" ? `${standort.name} (nächster Standort zur PLZ)` : standort.name,
    });
  }
  rows.push({ label: "Aufmerksam geworden über", value: sourceLabel });
  rows.push({ label: "Leistungen", value: leistungenInline });
  rows.push({ label: "Name", value: `${vorname} ${nachname}` });
  rows.push({ label: "E-Mail", value: email });
  rows.push({ label: "Telefon", value: telefon });
  if (besteZeitText) rows.push({ label: "Passender Tag/Uhrzeit", value: besteZeitText });

  const html = buildBrandedNotificationHtml({
    kindBadge: formLabel,
    headline: `Neue Anfrage über ${isSocialLanding ? "die Social-Media-Landingpage" : "den Hilfe-Finder"}`,
    rows,
    detailTitle: "Nachricht",
    detailText: nachrichtText || "-",
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: finalTo,
    subject: `${formLabel}: ${kontaktLabel}${standort ? ` (${standort.name})` : ""}`,
    text,
    html,
    replyTo: email,
  });

  if (!mailed.ok) {
    if (mailed.code === "smtp_not_configured") {
      console.warn(
        "[hilfefinder] SMTP nicht konfiguriert (SMTP_*) – keine E-Mail versendet (Ziel wäre " +
          finalTo.join(", ") +
          ")",
      );
      /* Auch ohne SMTP-Konfiguration die Statistik zählen, damit der Admin sieht, dass ein Versuch erfolgte. */
      await recordContactSource(contactSource, statsKind);
      /* In Entwicklungsumgebungen ohne SMTP nicht hart abbrechen, sonst Erfolgseindruck. */
      return { success: true };
    }
    return {
      success: false,
      error: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
    };
  }

  /* Anonyme Aggregat-Statistik (kein Personenbezug). */
  await recordContactSource(contactSource, statsKind);

  /*
   * Meta-Lead: Event-ID entsteht erst hier – gekoppelt an die tatsächlich erfolgreich
   * verarbeitete Anfrage. CAPI läuft nach der Response weiter (after/waitUntil),
   * blockiert den Nutzer nicht und kann den Erfolg nie in einen Fehler verwandeln.
   *
   * Consent: Autorität ist das serverseitig gelesene Consent-Cookie
   * (hasServerMarketingConsent). Der Client-Boolean ist nur ein ergänzendes
   * Signal – beide müssen zustimmen, sonst kein Meta-Event.
   */
  let metaLeadEventId: string | undefined;
  let serverMarketingConsent = false;
  if (isSocialLanding) {
    try {
      const consentCookie = (await cookies()).get(CONSENT_COOKIE_NAME)?.value;
      serverMarketingConsent = hasMarketingConsentFromCookieValue(consentCookie);
    } catch {
      /* cookies() nur im Request-Kontext verfügbar – ohne Cookie kein Consent. */
    }
  }
  if (isSocialLanding && serverMarketingConsent && input.meta?.marketingConsent === true) {
    metaLeadEventId = randomUUID();
    const eventId = metaLeadEventId;
    const fbp = typeof input.meta.fbp === "string" ? input.meta.fbp : undefined;
    const fbc = typeof input.meta.fbc === "string" ? input.meta.fbc : undefined;
    const clientIp = ip !== "unknown" ? ip : undefined;
    let userAgent: string | undefined;
    try {
      userAgent = (await headers()).get("user-agent") ?? undefined;
    } catch {
      /* headers() nur im Request-Kontext verfügbar */
    }
    after(async () => {
      await sendMetaLeadCapiEvent({ eventId, fbp, fbc, clientIp, userAgent });
    });
  }

  /* TEMP-DIAGNOSE (nach erfolgreichem Meta-Test entfernen): keine PII, keine Cookies/Token. */
  if (isSocialLanding) {
    console.info(
      `[meta-lead-diag] socialLanding=true serverConsent=${serverMarketingConsent} clientConsent=${input.meta?.marketingConsent === true} eventIdErzeugt=${metaLeadEventId ? metaLeadEventId : "nein"}`,
    );
  }

  return { success: true, metaLeadEventId };
}
