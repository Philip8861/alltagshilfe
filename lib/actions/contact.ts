"use server";

import { redirect } from "next/navigation";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import {
  findStandortByPageSlug,
  findStandortByPlz,
} from "@/config/standorte";
import { verifyStandortContactProof } from "@/lib/standort-contact-proof";
import {
  buildBrandedNotificationHtml,
  type EmailDetailRow,
} from "@/lib/email/branded-html";
import {
  parseNotificationEmailList,
  sendInternalMail,
} from "@/lib/email/internal-smtp";
import { getContactSourceLabel } from "@/lib/contact-source";
import { recordContactSource, type ContactSourceKind } from "@/lib/contact-source-tracking";

export type ContactResult = { success: boolean; error?: string };

/** Nur explizit erlaubtes Marking für Statistik-Kanal; alles andere ignorieren (kein Vertrauen ins Client-Feld). */
function parseContactStatsKindFromForm(formData: FormData): "ratgeber" | undefined {
  const raw = formData.get("contactStatsChannel");
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  return t === "ratgeber" ? "ratgeber" : undefined;
}

/** Zentrale Adresse, wenn weder NOTIFICATION_TO_CONTACT noch NOTIFICATION_TO gesetzt sind. */
const DEFAULT_CONTACT_INBOX = "info@alltagshilfe-sued.de";

/** Kooperationsanfragen (/kooperation, Modal „Jetzt Kooperationspartner werden“): fester Empfänger. */
const KOOPERATION_PORTAL_INBOX = "philip.sonntag@alltagshilfe-sued.de";

/** Gleiche Adresse kleingeschrieben für Dubletten-Vergleich. */
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

/**
 * E-Mail des zuständigen Standorts — nur wenn das Formular einen gültigen Standort-Proof hat und
 * eine ggf. mitgeschickte PLZ zum Proof-Standort passt (oder keine PLZ mitgeschickt wurde).
 */
function resolveRegionalContactEmail(
  verifiedSlug: string | null,
  routingPlzRaw: unknown,
): string | null {
  if (!verifiedSlug) return null;
  const standort = findStandortByPageSlug(verifiedSlug);
  if (!standort) return null;
  const raw = String(routingPlzRaw ?? "").trim();
  if (raw !== "") {
    if (!/^\d{5}$/.test(raw)) return null;
    const normalized = normalizeRoutingPlzForStandort(verifiedSlug, raw);
    if (!normalized) return null;
  }
  const email = standort.email?.trim();
  if (!email?.includes("@")) return null;
  return email;
}

function normalizeRoutingPlzForStandort(verifiedSlug: string, plzRaw: unknown): string | undefined {
  const plz = String(plzRaw ?? "").trim();
  if (!/^\d{5}$/.test(plz)) return undefined;
  const byPlz = findStandortByPlz(plz);
  if (byPlz?.pageSlug !== verifiedSlug) return undefined;
  return plz;
}

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const phoneRaw = formData.get("phone");
  const raw: Record<string, unknown> = {
    vorname: formData.get("vorname") ?? "",
    nachname: formData.get("nachname") ?? "",
    email: formData.get("email") ?? "",
    phone: phoneRaw && String(phoneRaw).trim() !== "" ? String(phoneRaw).trim() : undefined,
    topic: formData.get("topic") ?? "",
    message: formData.get("message") ?? "",
    contactSource: formData.get("contactSource") ?? "",
    datenschutz: formData.get("datenschutz") === "on",
    website: formData.get("website") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.vorname?.[0] ??
      first.nachname?.[0] ??
      first.email?.[0] ??
      first.phone?.[0] ??
      first.topic?.[0] ??
      first.message?.[0] ??
      first.contactSource?.[0] ??
      first.datenschutz?.[0] ??
      "Bitte prüfen Sie Ihre Eingaben.";
    return { success: false, error: message };
  }

  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    return { success: true };
  }

  const ip = await getClientIp();
  const { success: allowed } = rateLimit(`contact:${ip}`);
  if (!allowed) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const data = parsed.data as ContactFormData;

  const proofRaw = formData.get("standortContactProof");
  const verifiedSlug = verifyStandortContactProof(
    typeof proofRaw === "string" && proofRaw.length > 0 ? proofRaw : null,
  );
  const routingPlzRaw = formData.get("routingPlz");

  /** Thema „Karriere“: eigene Empfänger — explizit hier, damit es nicht mit dem Standard-Kontakt vermischt wird. */
  const isKarriereTopic =
    data.topic === "Karriere" || data.topic.trim().toLowerCase() === "karriere";

  /** Thema „Kooperation“: Anfragen aus dem Kooperationsportal (öffentliche Seite + Modal). */
  const isKooperationTopic = data.topic === "Kooperation";

  const regionalEmail = !isKarriereTopic && !isKooperationTopic
    ? resolveRegionalContactEmail(verifiedSlug, routingPlzRaw)
    : null;
  const standortCtxForEmail =
    regionalEmail && verifiedSlug ? findStandortByPageSlug(verifiedSlug) : undefined;
  const routingPlzNormalized = verifiedSlug
    ? normalizeRoutingPlzForStandort(verifiedSlug, routingPlzRaw)
    : undefined;

  const sourceLabel = getContactSourceLabel(data.contactSource);

  const text = [
    "Neue Kontaktanfrage über die Website",
    "",
    `Name: ${data.vorname} ${data.nachname}`,
    `E-Mail: ${data.email}`,
    data.phone ? `Telefon: ${data.phone}` : null,
    `Thema: ${data.topic}`,
    standortCtxForEmail ? `Standort (Seite): ${standortCtxForEmail.name}` : null,
    routingPlzNormalized ? `PLZ (Kontext): ${routingPlzNormalized}` : null,
    `Wie auf uns aufmerksam geworden: ${sourceLabel}`,
    "",
    data.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const rows: EmailDetailRow[] = [
    { label: "Name", value: `${data.vorname} ${data.nachname}` },
    { label: "E-Mail", value: data.email },
  ];
  if (data.phone) rows.push({ label: "Telefon", value: data.phone });
  rows.push({ label: "Thema", value: data.topic });
  if (standortCtxForEmail) rows.push({ label: "Standort (Seite)", value: standortCtxForEmail.name });
  if (routingPlzNormalized) rows.push({ label: "PLZ (Kontext)", value: routingPlzNormalized });
  rows.push({ label: "Aufmerksam geworden über", value: sourceLabel });

  const html = buildBrandedNotificationHtml({
    kindBadge: "Kontakt",
    headline: "Neue Kontaktanfrage",
    rows,
    detailTitle: "Nachricht",
    detailText: data.message,
  });

  const karriereContactRecipients = isKarriereTopic
    ? (() => {
        const onlyContact = parseNotificationEmailList(
          process.env.NOTIFICATION_TO_CONTACT_TOPIC_KARRIERE,
        );
        if (onlyContact.length > 0) return onlyContact;
        const sameAsKarrierePage = parseNotificationEmailList(process.env.NOTIFICATION_TO_KARRIERE);
        if (sameAsKarrierePage.length > 0) return sameAsKarrierePage;
        return getDefaultContactRecipients();
      })()
    : undefined;

  let finalTo: string[];
  if (isKooperationTopic) {
    finalTo = [KOOPERATION_PORTAL_INBOX];
  } else if (isKarriereTopic && karriereContactRecipients) {
    finalTo = karriereContactRecipients;
  } else if (regionalEmail) {
    /**
     * Standort-Kontakt (signiertes Formular): immer auch die zentrale Inbox — zusätzlich zur
     * regionalen Adresse aus `standorte` (z. B. augsburg@, engen@, wangen@, info@ für Allgäu/Bad Grönenbach).
     * Dubletten entfallen (z. B. Allgäu und Zentralpostfach sind identisch).
     */
    finalTo = dedupeEmails([...getDefaultContactRecipients(), regionalEmail]);
  } else {
    finalTo = getDefaultContactRecipients();
  }

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: finalTo,
    subject: `Kontakt: ${data.topic}`,
    text,
    html,
    replyTo: data.email,
  });
  if (!mailed.ok) {
    if (mailed.code === "smtp_not_configured") {
      console.warn(
        "[contact] SMTP oder Empfänger fehlt (SMTP_* / NOTIFICATION_TO_*; ohne Konfiguration: Ziel wäre " +
          DEFAULT_CONTACT_INBOX +
          " für allgemeine Kontakte) – keine E-Mail versendet",
      );
    }
  }

  /* Anonyme Aggregat-Statistik (kein Personenbezug). */
  const statsKind: ContactSourceKind =
    parseContactStatsKindFromForm(formData) === "ratgeber" ? "ratgeber" : "contact";
  await recordContactSource(data.contactSource, statsKind);

  redirect("/kontakt/danke");
}
