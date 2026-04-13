"use server";

import { betrieblichAngebotAnfrageSchema } from "@/lib/validations/betrieblich-angebot-anfrage";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { buildBrandedNotificationHtml, type EmailDetailRow } from "@/lib/email/branded-html";
import { parseNotificationEmailList, sendInternalMail } from "@/lib/email/internal-smtp";

const DEFAULT_BETRIEBLICH_ANGEBOT_TO = "philip.sonntag@alltagshilfe-sued.de";

export type BetrieblichAngebotAnfrageResult = { success: true } | { success: false; error: string };

function resolveBetrieblichAngebotRecipients(): string[] {
  const fromEnv = parseNotificationEmailList(process.env.NOTIFICATION_TO_BETRIEBLICH_ANGEBOT);
  if (fromEnv.length > 0) return fromEnv;
  return [DEFAULT_BETRIEBLICH_ANGEBOT_TO];
}

export async function submitBetrieblichAngebotAnfrage(formData: FormData): Promise<BetrieblichAngebotAnfrageResult> {
  const phoneRaw = formData.get("phone");
  const raw = {
    nachname: formData.get("nachname") ?? "",
    vorname: formData.get("vorname") ?? "",
    email: formData.get("email") ?? "",
    phone: phoneRaw && String(phoneRaw).trim() !== "" ? String(phoneRaw).trim() : undefined,
    mitarbeiteranzahl: formData.get("mitarbeiteranzahl") ?? "",
    bemerkung: formData.get("bemerkung") ?? "",
    datenschutz: formData.get("datenschutz") === "on",
    website: formData.get("website") ?? "",
  };

  const parsed = betrieblichAngebotAnfrageSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.nachname?.[0] ??
      first.vorname?.[0] ??
      first.email?.[0] ??
      first.phone?.[0] ??
      first.mitarbeiteranzahl?.[0] ??
      first.bemerkung?.[0] ??
      first.datenschutz?.[0] ??
      "Bitte prüfen Sie Ihre Eingaben.";
    return { success: false, error: message };
  }

  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    return { success: true };
  }

  const ip = await getClientIp();
  const { success: allowed } = rateLimit(`betrieblich-angebot:${ip}`);
  if (!allowed) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const data = parsed.data;
  const text = [
    "Neue Anfrage: Betriebliche Pflegeberatung (Angebot)",
    "",
    `Name: ${data.vorname} ${data.nachname}`,
    `E-Mail: ${data.email}`,
    ...(data.phone ? [`Telefon: ${data.phone}`] : []),
    `Mitarbeiteranzahl: ${data.mitarbeiteranzahl}`,
    ...(data.bemerkung ? ["", "Bemerkung:", data.bemerkung] : []),
  ].join("\n");

  const rows: EmailDetailRow[] = [
    { label: "Name", value: `${data.vorname} ${data.nachname}` },
    { label: "E-Mail", value: data.email },
  ];
  if (data.phone) rows.push({ label: "Telefon", value: data.phone });
  rows.push({ label: "Mitarbeiteranzahl", value: data.mitarbeiteranzahl });
  if (data.bemerkung) rows.push({ label: "Bemerkung", value: data.bemerkung });

  const html = buildBrandedNotificationHtml({
    kindBadge: "Angebot",
    headline: "Betriebliche Pflegeberatung – Angebotsanfrage",
    rows,
  });

  const toOverride = resolveBetrieblichAngebotRecipients();
  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride,
    subject: "Anfrage: Betriebliche Pflegeberatung (Angebot)",
    text,
    html,
    replyTo: data.email,
  });
  if (!mailed.ok && mailed.code === "smtp_not_configured") {
    console.warn(
      "[betrieblich-angebot] SMTP oder Empfänger fehlt – keine E-Mail versendet (NOTIFICATION_TO_* / SMTP_*)",
    );
  }

  return { success: true };
}
