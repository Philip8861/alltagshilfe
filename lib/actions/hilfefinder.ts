"use server";

import { findStandortByPlz } from "@/config/standorte";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
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
import { recordContactSource } from "@/lib/contact-source-tracking";

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
};

export type HilfefinderResult = { success: boolean; error?: string };

/**
 * Anfrage aus dem 60-Sekunden-Hilfefinder versenden.
 * Empfänger:
 *  - Mit gültiger 5-stelliger PLZ und zugeordnetem Standort: zentrale Inbox + Standort-Mail (dedupliziert).
 *  - Ohne (gültige) PLZ: nur `info@alltagshilfe-sued.de` (bzw. NOTIFICATION_TO_CONTACT/NOTIFICATION_TO Override).
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

  const ip = await getClientIp();
  const { success: allowed } = rateLimit(`hilfefinder:${ip}`);
  if (!allowed) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const plzNorm = String(input.plz ?? "").replace(/\D/g, "").slice(0, 5);
  const standort = plzNorm.length === 5 ? findStandortByPlz(plzNorm) : undefined;
  const standortEmail = standort?.email?.trim();

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

  const text = [
    "Neue Anfrage über den Hilfe-Finder",
    "",
    `Kontaktart: ${kontaktLabel}`,
    `Pflegegrad: ${input.pflegegrad?.trim() || "-"}`,
    `Für wen: ${fuerWenLabel}`,
    `PLZ: ${plzNorm || "-"}`,
    standort ? `Standort: ${standort.name}` : null,
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
  if (standort) rows.push({ label: "Standort", value: standort.name });
  rows.push({ label: "Aufmerksam geworden über", value: sourceLabel });
  rows.push({ label: "Leistungen", value: leistungenInline });
  rows.push({ label: "Name", value: `${vorname} ${nachname}` });
  rows.push({ label: "E-Mail", value: email });
  rows.push({ label: "Telefon", value: telefon });
  if (besteZeitText) rows.push({ label: "Passender Tag/Uhrzeit", value: besteZeitText });

  const html = buildBrandedNotificationHtml({
    kindBadge: "Hilfe-Finder",
    headline: "Neue Anfrage über den Hilfe-Finder",
    rows,
    detailTitle: "Nachricht",
    detailText: nachrichtText || "-",
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: finalTo,
    subject: `Hilfe-Finder: ${kontaktLabel}${standort ? ` (${standort.name})` : ""}`,
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
      await recordContactSource(contactSource, "hilfefinder");
      /* In Entwicklungsumgebungen ohne SMTP nicht hart abbrechen, sonst Erfolgseindruck. */
      return { success: true };
    }
    return {
      success: false,
      error: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
    };
  }

  /* Anonyme Aggregat-Statistik (kein Personenbezug). */
  await recordContactSource(contactSource, "hilfefinder");

  return { success: true };
}
