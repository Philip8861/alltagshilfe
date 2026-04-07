"use server";

import { redirect } from "next/navigation";
import { karriereSchema, type KarriereFormData } from "@/lib/validations/karriere";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { buildBrandedNotificationHtml } from "@/lib/email/branded-html";
import { sendInternalMail } from "@/lib/email/internal-smtp";

export type KarriereResult = { success: boolean; error?: string };

export async function submitKarriere(formData: FormData): Promise<KarriereResult> {
  const raw: Record<string, unknown> = {
    vorname: formData.get("vorname") ?? "",
    nachname: formData.get("nachname") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    stellenangebot: formData.get("stellenangebot") ?? "",
    agbs: formData.get("agbs") === "on",
    website: formData.get("website") ?? "",
  };

  const parsed = karriereSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.vorname?.[0] ??
      first.nachname?.[0] ??
      first.email?.[0] ??
      first.phone?.[0] ??
      first.stellenangebot?.[0] ??
      first.agbs?.[0] ??
      "Bitte prüfen Sie Ihre Eingaben.";
    return { success: false, error: message };
  }

  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    return { success: true };
  }

  const ip = await getClientIp();
  const { success: allowed } = rateLimit(`karriere:${ip}`);
  if (!allowed) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const data = parsed.data as KarriereFormData;
  const text = [
    "Neue Karriere-Anfrage über die Website",
    "",
    `Name: ${data.vorname} ${data.nachname}`,
    `E-Mail: ${data.email}`,
    `Telefon: ${data.phone}`,
    `Stellenangebot: ${data.stellenangebot}`,
  ].join("\n");

  const html = buildBrandedNotificationHtml({
    kindBadge: "Karriere",
    headline: "Neue Karriere-Anfrage",
    rows: [
      { label: "Name", value: `${data.vorname} ${data.nachname}` },
      { label: "E-Mail", value: data.email },
      { label: "Telefon", value: data.phone },
      { label: "Stellenangebot", value: data.stellenangebot },
    ],
  });

  const mailed = await sendInternalMail({
    kind: "karriere",
    subject: `Karriere: ${data.stellenangebot} – ${data.nachname}, ${data.vorname}`,
    text,
    html,
    replyTo: data.email,
  });
  if (!mailed.ok && mailed.code === "smtp_not_configured") {
    console.warn(
      "[karriere] SMTP oder NOTIFICATION_TO_KARRIERE / NOTIFICATION_TO fehlt – keine E-Mail versendet",
    );
  }

  redirect("/karriere/danke");
}
