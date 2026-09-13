"use server";

import { randomBytes } from "crypto";
import { betrieblichInfoTerminSchema } from "@/lib/validations/betrieblich-info-termin";
import {
  BETRIEBLICH_INFO_CONTACT,
  companySizeLabel,
  earliestBookableYmd,
  formatDateLongDe,
  isBookableSlot,
  latestBookableYmd,
} from "@/lib/betrieblich-info-termin/slots";
import {
  insertAppointment,
  listBookedSlots,
  recordInfoTerminConversion,
} from "@/lib/betrieblich-info-termin/store";
import { rateLimitBetrieblichInfoSlots, rateLimitBetrieblichInfoTermin } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { buildBrandedNotificationHtml, type EmailDetailRow } from "@/lib/email/branded-html";
import { parseNotificationEmailList, sendInternalMail, sendTransactionalMail } from "@/lib/email/internal-smtp";

const DEFAULT_BETRIEBLICH_INFO_TO = "philip.sonntag@alltagshilfe-sued.de";

export type BetrieblichInfoAvailability = {
  earliest: string;
  latest: string;
  booked: Record<string, string[]>;
};

export type BetrieblichInfoAvailabilityResult =
  | { success: true; data: BetrieblichInfoAvailability }
  | { success: false; error: string };

export type BetrieblichInfoTerminResult =
  | { success: true }
  | { success: false; error: string; taken?: boolean };

function resolveBetrieblichInfoRecipients(): string[] {
  const fromEnv = parseNotificationEmailList(process.env.NOTIFICATION_TO_BETRIEBLICH_ANGEBOT);
  if (fromEnv.length > 0) return fromEnv;
  return [DEFAULT_BETRIEBLICH_INFO_TO];
}

function createMeetUrl(): string {
  const token = randomBytes(12).toString("hex");
  return `https://meet.jit.si/AHS-Pflegeberatung-${token}`;
}

export async function getBetrieblichInfoAvailability(): Promise<BetrieblichInfoAvailabilityResult> {
  const ip = await getClientIp();
  if (!rateLimitBetrieblichInfoSlots(ip).success) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const earliest = earliestBookableYmd();
  const latest = latestBookableYmd();
  const booked = await listBookedSlots(earliest, latest);
  return { success: true, data: { earliest, latest, booked } };
}

export async function submitBetrieblichInfoTermin(formData: FormData): Promise<BetrieblichInfoTerminResult> {
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    return { success: true };
  }

  const raw = {
    slotDate: String(formData.get("slotDate") ?? ""),
    slotTime: String(formData.get("slotTime") ?? ""),
    fullName: formData.get("fullName") ?? "",
    email: formData.get("email") ?? "",
    companyName: formData.get("companyName") ?? "",
    companyPosition: formData.get("companyPosition") ?? "",
    companySize: formData.get("companySize") ?? "",
    datenschutz: formData.get("datenschutz") === "on",
    website: "",
  };

  const parsed = betrieblichInfoTerminSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.slotDate?.[0] ??
      first.slotTime?.[0] ??
      first.fullName?.[0] ??
      first.email?.[0] ??
      first.companyName?.[0] ??
      first.companyPosition?.[0] ??
      first.companySize?.[0] ??
      first.datenschutz?.[0] ??
      "Bitte prüfen Sie Ihre Eingaben.";
    return { success: false, error: message };
  }

  const ip = await getClientIp();
  if (!rateLimitBetrieblichInfoTermin(ip).success) {
    return { success: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." };
  }

  const data = parsed.data;
  if (!isBookableSlot(data.slotDate, data.slotTime)) {
    return {
      success: false,
      error: "Dieser Termin ist nicht buchbar. Bitte wählen Sie einen Werktag ab dem nächsten Arbeitstag, 09:00–16:30.",
    };
  }

  const meetUrl = createMeetUrl();
  const stored = await insertAppointment({
    slotDate: data.slotDate,
    slotTime: data.slotTime,
    fullName: data.fullName,
    email: data.email,
    companyName: data.companyName,
    companyPosition: data.companyPosition,
    companySize: data.companySize,
    meetUrl,
  });

  if (!stored.ok) {
    if (stored.reason === "taken") {
      return {
        success: false,
        taken: true,
        error: "Dieser Termin ist bereits vergeben. Bitte wählen Sie eine andere Uhrzeit.",
      };
    }
    return { success: false, error: "Die Buchung ist gerade nicht möglich. Bitte versuchen Sie es später erneut." };
  }

  const whenLong = `${formatDateLongDe(data.slotDate)}, ${data.slotTime} Uhr`;
  const sizeLabel = companySizeLabel(data.companySize);

  const internalText = [
    "Neue Buchung: 15-Minuten-Infogespräch (betriebliche Pflegeberatung)",
    "",
    `Termin: ${whenLong}`,
    `Name: ${data.fullName}`,
    `E-Mail: ${data.email}`,
    `Firma: ${data.companyName}`,
    `Position: ${data.companyPosition}`,
    `Firmengröße: ${sizeLabel}`,
    `Einwahllink: ${meetUrl}`,
  ].join("\n");

  const internalRows: EmailDetailRow[] = [
    { label: "Termin", value: whenLong },
    { label: "Name", value: data.fullName },
    { label: "E-Mail", value: data.email },
    { label: "Firma", value: data.companyName },
    { label: "Position", value: data.companyPosition },
    { label: "Firmengröße", value: sizeLabel },
    { label: "Einwahllink", value: meetUrl },
  ];

  const internalHtml = buildBrandedNotificationHtml({
    kindBadge: "Infogespräch",
    headline: "Betriebliche Pflegeberatung – Termin gebucht",
    rows: internalRows,
    ctaHref: meetUrl,
    ctaLabel: "Zum Videogespräch",
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: resolveBetrieblichInfoRecipients(),
    subject: `Termin gebucht: Infogespräch ${data.slotDate} ${data.slotTime} – ${data.companyName}`,
    text: internalText,
    html: internalHtml,
    replyTo: data.email,
  });
  if (!mailed.ok && mailed.code === "smtp_not_configured") {
    console.warn("[betrieblich-info] SMTP oder Empfänger fehlt – interne Mail nicht versendet.");
  }

  const customerText = [
    "Vielen Dank! Ihr Termin ist gebucht.",
    "",
    "Wir freuen uns sehr auf den gemeinsamen Austausch mit Ihnen! Eine Bestätigung mit dem Einwahllink finden Sie hier:",
    "",
    `Termin: ${whenLong}`,
    `Einwahllink: ${meetUrl}`,
    "",
    "Betriebliche Pflegeberatung",
    `Telefon: ${BETRIEBLICH_INFO_CONTACT.phone}`,
    `E-Mail: ${BETRIEBLICH_INFO_CONTACT.email}`,
    "",
    "Falls vorab Fragen entstehen oder Sie den Termin verschieben müssen, erreichen Sie uns jederzeit unter diesen Kontaktdaten.",
  ].join("\n");

  const customerHtml = buildBrandedNotificationHtml({
    kindBadge: "Infogespräch",
    headline: "Vielen Dank! Ihr Termin ist gebucht.",
    rows: [
      { label: "Termin", value: whenLong },
      { label: "Name", value: data.fullName },
      { label: "Unternehmen", value: data.companyName },
      { label: "Position", value: data.companyPosition },
      { label: "Telefon", value: BETRIEBLICH_INFO_CONTACT.phone },
      { label: "E-Mail", value: BETRIEBLICH_INFO_CONTACT.email },
    ],
    detailTitle: "Hinweis",
    detailText:
      "Wir freuen uns sehr auf den gemeinsamen Austausch mit Ihnen. Falls vorab Fragen entstehen oder Sie den Termin verschieben müssen, erreichen Sie uns jederzeit unter den angegebenen Kontaktdaten.",
    ctaHref: meetUrl,
    ctaLabel: "Zum Videogespräch (Einwahllink)",
    ctaButtonVariant: "accent",
  });

  const customerMail = await sendTransactionalMail({
    to: data.email,
    subject: `Terminbestätigung: Infogespräch am ${data.slotDate} um ${data.slotTime} Uhr`,
    text: customerText,
    html: customerHtml,
  });
  if (!customerMail.ok) {
    console.warn("[betrieblich-info] Bestätigungsmail an Kund:in nicht versendet:", customerMail.code);
  }

  await recordInfoTerminConversion();
  return { success: true };
}
