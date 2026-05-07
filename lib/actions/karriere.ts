"use server";

import { redirect } from "next/navigation";
import { karriereAnhaengeAusFormData } from "@/lib/karriere-attachments";
import { karriereSchema, type KarriereFormData } from "@/lib/validations/karriere";
import { rateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { buildBrandedNotificationHtml } from "@/lib/email/branded-html";
import { sendInternalMail } from "@/lib/email/internal-smtp";
import { getContactSourceLabel } from "@/lib/contact-source";
import { recordContactSource } from "@/lib/contact-source-tracking";

export type KarriereResult = { success: boolean; error?: string };

export async function submitKarriere(formData: FormData): Promise<KarriereResult> {
  const wizardQuelle = String(formData.get("karriereWizardQuelle") ?? "").trim();
  const datenschutzBewerbung = formData.get("datenschutzBewerbung") === "on";

  if (wizardQuelle === "kurzcheck" && !datenschutzBewerbung) {
    return {
      success: false,
      error: "Bitte bestätigen Sie die Kenntnisnahme der Datenschutzerklärung.",
    };
  }

  const raw: Record<string, unknown> = {
    vorname: formData.get("vorname") ?? "",
    nachname: formData.get("nachname") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    plz: formData.get("plz") ?? "",
    ort: formData.get("ort") ?? "",
    stellenangebot: formData.get("stellenangebot") ?? "",
    agbs: formData.get("agbs") === "on",
    contactSource: formData.get("contactSource") ?? "",
    anmerkung: String(formData.get("anmerkung") ?? ""),
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
      first.plz?.[0] ??
      first.ort?.[0] ??
      first.stellenangebot?.[0] ??
      first.anmerkung?.[0] ??
      first.contactSource?.[0] ??
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

  const anhaenge = await karriereAnhaengeAusFormData(formData);
  if (!anhaenge.ok) {
    return { success: false, error: anhaenge.error };
  }

  const sourceLabel = getContactSourceLabel(data.contactSource);

  const text = [
    "Neue Karriere-Anfrage über die Website",
    "",
    `Name: ${data.vorname} ${data.nachname}`,
    `E-Mail: ${data.email}`,
    `Telefon: ${data.phone}`,
    `PLZ / Ort: ${data.plz} ${data.ort}`,
    `Stellenangebot: ${data.stellenangebot}`,
    `Wie auf uns aufmerksam geworden: ${sourceLabel}`,
    ...(data.anmerkung ? ["", "Zusatzangaben:", data.anmerkung] : []),
    ...(anhaenge.attachments.length > 0
      ? ["", `Anhänge (${anhaenge.attachments.length}):`, ...anhaenge.attachments.map((a) => `– ${a.filename}`)]
      : []),
  ].join("\n");

  const html = buildBrandedNotificationHtml({
    kindBadge: "Karriere",
    headline: "Neue Karriere-Anfrage",
    rows: [
      { label: "Name", value: `${data.vorname} ${data.nachname}` },
      { label: "E-Mail", value: data.email },
      { label: "Telefon", value: data.phone },
      { label: "PLZ / Ort", value: `${data.plz} ${data.ort}` },
      { label: "Stellenangebot", value: data.stellenangebot },
      { label: "Aufmerksam geworden über", value: sourceLabel },
      ...(data.anmerkung ? [{ label: "Zusatzangaben", value: data.anmerkung }] : []),
    ],
  });

  const mailed = await sendInternalMail({
    kind: "karriere",
    subject: `Karriere: ${data.stellenangebot} – ${data.nachname}, ${data.vorname}`,
    text,
    html,
    replyTo: data.email,
    attachments: anhaenge.attachments.length > 0 ? anhaenge.attachments : undefined,
  });
  if (!mailed.ok && mailed.code === "smtp_not_configured") {
    console.warn(
      "[karriere] SMTP oder NOTIFICATION_TO_KARRIERE / NOTIFICATION_TO fehlt – keine E-Mail versendet",
    );
  }

  /* Anonyme Aggregat-Statistik (kein Personenbezug). */
  await recordContactSource(data.contactSource, "karriere");

  if (wizardQuelle === "kurzcheck") {
    return { success: true };
  }

  redirect("/karriere/danke");
}
