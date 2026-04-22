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
  resolveRecipientsForKind,
  sendInternalMail,
} from "@/lib/email/internal-smtp";

export type ContactResult = { success: boolean; error?: string };

function mergeEmailRecipients(...lists: (string[] | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const list of lists) {
    if (!list) continue;
    for (const raw of list) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(trimmed);
    }
  }
  return out;
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
  const routingPlz = verifiedSlug
    ? normalizeRoutingPlzForStandort(verifiedSlug, formData.get("routingPlz"))
    : undefined;
  const standortCtx = verifiedSlug ? findStandortByPageSlug(verifiedSlug) : undefined;

  const text = [
    "Neue Kontaktanfrage über die Website",
    "",
    `Name: ${data.vorname} ${data.nachname}`,
    `E-Mail: ${data.email}`,
    data.phone ? `Telefon: ${data.phone}` : null,
    `Thema: ${data.topic}`,
    standortCtx ? `Standort (Seite): ${standortCtx.name}` : null,
    routingPlz ? `PLZ (Kontext): ${routingPlz}` : null,
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
  if (standortCtx) rows.push({ label: "Standort (Seite)", value: standortCtx.name });
  if (routingPlz) rows.push({ label: "PLZ (Kontext)", value: routingPlz });

  const html = buildBrandedNotificationHtml({
    kindBadge: "Kontakt",
    headline: "Neue Kontaktanfrage",
    rows,
    detailTitle: "Nachricht",
    detailText: data.message,
  });

  /** Thema „Karriere“: eigene Empfänger — explizit hier, damit es nicht mit dem Standard-Kontakt vermischt wird. */
  const isKarriereTopic =
    data.topic === "Karriere" || data.topic.trim().toLowerCase() === "karriere";

  const karriereContactRecipients = isKarriereTopic
    ? (() => {
        const onlyContact = parseNotificationEmailList(
          process.env.NOTIFICATION_TO_CONTACT_TOPIC_KARRIERE,
        );
        if (onlyContact.length > 0) return onlyContact;
        const sameAsKarrierePage = parseNotificationEmailList(process.env.NOTIFICATION_TO_KARRIERE);
        if (sameAsKarrierePage.length > 0) return sameAsKarrierePage;
        return resolveRecipientsForKind("contact");
      })()
    : undefined;

  const baseRecipients =
    karriereContactRecipients !== undefined
      ? karriereContactRecipients
      : resolveRecipientsForKind("contact");
  const standortEmail =
    standortCtx?.email?.trim() && standortCtx.email.includes("@")
      ? standortCtx.email.trim()
      : undefined;
  const finalTo = standortEmail
    ? mergeEmailRecipients(baseRecipients, [standortEmail])
    : baseRecipients;

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
        "[contact] SMTP oder Empfänger fehlt (NOTIFICATION_TO_CONTACT / NOTIFICATION_TO; Thema Karriere: NOTIFICATION_TO_CONTACT_TOPIC_KARRIERE oder NOTIFICATION_TO_KARRIERE) – keine E-Mail versendet",
      );
    }
  }

  redirect("/kontakt/danke");
}
