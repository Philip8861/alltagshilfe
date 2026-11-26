import QRCode from "qrcode";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { buildBrandedNotificationHtml, type EmailDetailRow } from "@/lib/email/branded-html";
import { sendTransactionalMail, type SendInternalMailAttachment } from "@/lib/email/internal-smtp";
import { createCourseFlyer } from "./flyer";
import { COURSE_BROCHURE_FILE, COURSE_BROCHURE_OBJECT, COURSE_MATERIAL_BUCKET, COURSE_SIGNATURE_LOGO_OBJECT } from "./config";
import { buildEmployerInvitation, COURSE_SIGNATURE_LOGO_CID } from "./employer-invitation";
import { COURSE_FORMAT_LABEL, courseTimeLabel } from "./slots";
import type { Booking } from "./store";

const COURSE_MAIL_FROM = "Alltagshilfe-Süd <info@alltagshilfe-sued.de>";

type CourseMail = {
  to: string;
  subject: string;
  headline: string;
  message: string;
  rows?: EmailDetailRow[];
  link?: { href: string; label: string };
  qrCodeCid?: string;
  attachments?: SendInternalMailAttachment[];
};

export async function sendCourseMail({
  to, subject, headline, message, rows = [], link, qrCodeCid, attachments,
}: CourseMail) {
  const text = [message, ...rows.map(({ label, value }) => label + ": " + value),
    link ? link.label + ": " + link.href : ""].filter(Boolean).join("\n\n");
  const result = await sendTransactionalMail({
    to, from: COURSE_MAIL_FROM, subject, text, attachments,
    html: buildBrandedNotificationHtml({
      kindBadge: "Orientierungskurs", headline, rows, detailText: message, qrCodeCid,
      ctaHref: link?.href, ctaLabel: link?.label,
    }),
  });
  return result.ok;
}

function courseRows(course: Booking): EmailDetailRow[] {
  return [
    { label: "Termin", value: formatDateLongDe(course.slot_date) + ", " + courseTimeLabel(course.slot_time) },
    { label: "Kursformat", value: COURSE_FORMAT_LABEL[course.format] },
  ];
}

function venueRows(course: Booking): EmailDetailRow[] {
  if (course.format === "online") return [];
  return [
    { label: "Schulungsort", value: course.address ?? "" },
    { label: "Raum", value: course.room ?? "" },
    ...(course.parking ? [{ label: "Parken", value: course.parking }] : []),
  ];
}

export function sendBookingConfirmation(course: Booking) {
  return sendCourseMail({
    to: course.contact_email,
    subject: "1 von 2 · Ihr Orientierungskurs ist gebucht",
    headline: "Ihr Termin ist gebucht",
    message: "Vielen Dank für Ihre Buchung. In der zweiten E-Mail erhalten Sie den Anmeldelink, den QR-Code und einen druckfertigen Aushang für Ihre Belegschaft." +
      (course.format === "online" ? "\n\nDen Zugang zum Online-Kurs erhalten angemeldete Teilnehmende per E-Mail." : ""),
    rows: [
      ...courseRows(course), ...venueRows(course),
      { label: "Firma", value: course.company },
      { label: "Ansprechperson", value: course.contact_name },
      { label: "E-Mail", value: course.contact_email },
      { label: "Telefon", value: course.contact_phone },
    ],
  });
}

export async function sendShareableInvitation(course: Booking, link: string) {
  const qr = await QRCode.toBuffer(link, { width: 600, margin: 4, errorCorrectionLevel: "M" });
  const flyer = await createCourseFlyer(course, link, qr);
  const cid = "kursanmeldung@alltagshilfe-sued";
  return sendCourseMail({
    to: course.contact_email,
    subject: "2 von 2 · Anmeldung zum Orientierungskurs für Ihre Belegschaft",
    headline: "Einladung zum Orientierungskurs",
    message: "Mitarbeitende können sich über den Link oder QR-Code direkt für diesen Kurs anmelden. Leiten Sie diese E-Mail dafür in Ihrer Firma weiter oder drucken Sie den PDF-Aushang im Anhang aus.",
    rows: courseRows(course),
    link: { href: link, label: "Zur Kursanmeldung" },
    qrCodeCid: cid,
    attachments: [
      { filename: "Kursanmeldung-QR.png", content: qr, contentType: "image/png", cid },
      { filename: "Orientierungskurs-Aushang.pdf", content: flyer, contentType: "application/pdf" },
    ],
  });
}

export function sendParticipantConfirmation(course: Booking, to: string, firstName: string) {
  const online = course.format === "online";
  const greeting = "Hallo " + firstName + ",\n\nIhre Anmeldung zum Orientierungskurs ist bestätigt. ";
  return sendCourseMail({
    to,
    subject: online ? "Ihre Anmeldung zum Online-Orientierungskurs" : "Ihre Anmeldung zum Orientierungskurs vor Ort",
    headline: "Ihre Teilnahme ist bestätigt",
    message: greeting + (online
      ? "Öffnen Sie zum Kursbeginn den Link zum Online-Kurs."
      : "Unten finden Sie die Adresse und den Raum für Ihre Teilnahme vor Ort."),
    rows: [...courseRows(course), ...venueRows(course)],
    link: online && course.meeting_url ? { href: course.meeting_url, label: "Zum Online-Kurs" } : undefined,
  });
}

export async function sendEmployerInvitation(
  client: SupabaseClient,
  to: string,
  origin: string,
  recipient?: { salutation: "frau" | "herr"; lastName: string },
) {
  const storage = client.storage.from(COURSE_MATERIAL_BUCKET);
  const [brochure, logo] = await Promise.all([
    storage.download(COURSE_BROCHURE_OBJECT),
    storage.download(COURSE_SIGNATURE_LOGO_OBJECT),
  ]);
  if (!brochure.data || brochure.error || !logo.data || logo.error) {
    console.error("[orientierungskurs] Kursflyer oder Signaturlogo konnte nicht geladen werden");
    return false;
  }
  const salutation = recipient
    ? (recipient.salutation === "frau" ? "Sehr geehrte Frau " : "Sehr geehrter Herr ") + recipient.lastName + ","
    : "Sehr geehrte Damen und Herren,";
  const result = await sendTransactionalMail({
    to, from: COURSE_MAIL_FROM, ...buildEmployerInvitation(salutation, origin),
    attachments: [
      { filename: COURSE_BROCHURE_FILE, content: Buffer.from(await brochure.data.arrayBuffer()), contentType: "application/pdf" },
      {
        filename: COURSE_SIGNATURE_LOGO_OBJECT, content: Buffer.from(await logo.data.arrayBuffer()),
        contentType: "image/png", cid: COURSE_SIGNATURE_LOGO_CID,
      },
    ],
  });
  return result.ok;
}
