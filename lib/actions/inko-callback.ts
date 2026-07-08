"use server";

import { recordContactSource } from "@/lib/contact-source-tracking";
import {
  buildBrandedNotificationHtml,
  type EmailDetailRow,
} from "@/lib/email/branded-html";
import { parseNotificationEmailList, sendInternalMail } from "@/lib/email/internal-smtp";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { INKO_CALLBACK_TIME_SLOTS, inkoCallbackSchema } from "@/lib/validations/inko-callback";

export type InkoCallbackResult = { success: boolean; error?: string };

const DEFAULT_CONTACT_INBOX = "info@alltagshilfe-sued.de";

function getDefaultContactRecipients(): string[] {
  const contact = parseNotificationEmailList(process.env.NOTIFICATION_TO_CONTACT);
  if (contact.length > 0) return contact;
  const general = parseNotificationEmailList(process.env.NOTIFICATION_TO);
  if (general.length > 0) return general;
  return [DEFAULT_CONTACT_INBOX];
}

function preferredTimeLabel(value: string): string {
  return INKO_CALLBACK_TIME_SLOTS.find((s) => s.value === value)?.label ?? value;
}

export async function submitInkoCallback(formData: FormData): Promise<InkoCallbackResult> {
  const raw = {
    vorname: formData.get("vorname") ?? "",
    nachname: formData.get("nachname") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    preferredTime: formData.get("preferredTime") ?? "",
    sourceCta: formData.get("sourceCta") ?? "",
    datenschutz: formData.get("datenschutz") === "on",
    website: formData.get("website") ?? "",
  };

  const parsed = inkoCallbackSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.vorname?.[0] ??
      first.nachname?.[0] ??
      first.email?.[0] ??
      first.phone?.[0] ??
      first.preferredTime?.[0] ??
      first.datenschutz?.[0] ??
      "Bitte prüfen Sie Ihre Eingaben.";
    return { success: false, error: message };
  }

  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    return { success: true };
  }

  const ip = await getClientIp();
  const { success: allowed } = rateLimit(`inko-callback:${ip}`);
  if (!allowed) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const data = parsed.data;
  const email = data.email?.trim() ?? "";
  const phone = data.phone?.trim() ?? "";
  const timeLabel = preferredTimeLabel(data.preferredTime);
  const sourceCta = data.sourceCta?.trim() || "inko-ratgeber";

  const text = [
    "Neue Rückruf-Anfrage – Inkontinenz-Ratgeber",
    "",
    `Name: ${data.vorname} ${data.nachname}`,
    email ? `E-Mail: ${email}` : null,
    phone ? `Telefon: ${phone}` : null,
    `Erreichbarkeit: ${timeLabel}`,
    `CTA-Quelle: ${sourceCta}`,
    "",
    "Hinweis: Rückmeldung innerhalb von 24 Stunden zugesagt.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const rows: EmailDetailRow[] = [
    { label: "Name", value: `${data.vorname} ${data.nachname}` },
  ];
  if (email) rows.push({ label: "E-Mail", value: email });
  if (phone) rows.push({ label: "Telefon", value: phone });
  rows.push({ label: "Erreichbarkeit", value: timeLabel });
  rows.push({ label: "CTA-Quelle", value: sourceCta });

  const html = buildBrandedNotificationHtml({
    kindBadge: "Inkontinenz",
    headline: "Rückruf-Anfrage Inkontinenz-Ratgeber",
    rows,
    detailTitle: "Hinweis",
    detailText: "Bitte innerhalb von 24 Stunden zurückmelden. Auf Wunsch Testpaket anbieten.",
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: getDefaultContactRecipients(),
    subject: `Inkontinenz-Rückruf: ${data.vorname} ${data.nachname}`,
    text,
    html,
    replyTo: email || undefined,
  });

  if (!mailed.ok && mailed.code === "smtp_not_configured") {
    console.warn("[inko-callback] SMTP nicht konfiguriert – keine E-Mail versendet");
  }

  await recordContactSource("sonstiges", "ratgeber");

  return { success: true };
}
