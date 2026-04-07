"use server";

import { redirect } from "next/navigation";
import { contactSchema, type ContactFormData } from "@/lib/validations/contact";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { sendInternalMail } from "@/lib/email/internal-smtp";

export type ContactResult = { success: boolean; error?: string };

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
  const text = [
    "Neue Kontaktanfrage über die Website",
    "",
    `Name: ${data.vorname} ${data.nachname}`,
    `E-Mail: ${data.email}`,
    data.phone ? `Telefon: ${data.phone}` : null,
    `Thema: ${data.topic}`,
    "",
    data.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const mailed = await sendInternalMail({
    kind: "contact",
    subject: `Kontakt: ${data.topic}`,
    text,
    replyTo: data.email,
  });
  if (!mailed.ok) {
    if (mailed.code === "smtp_not_configured") {
      console.warn(
        "[contact] SMTP oder NOTIFICATION_TO_CONTACT / NOTIFICATION_TO fehlt – keine E-Mail versendet",
      );
    }
  }

  redirect("/kontakt/danke");
}
