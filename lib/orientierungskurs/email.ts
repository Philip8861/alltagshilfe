import QRCode from "qrcode";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { buildBrandedNotificationHtml, type EmailDetailRow } from "@/lib/email/branded-html";
import { sendTransactionalMail, type SendInternalMailAttachment } from "@/lib/email/internal-smtp";
import { createCourseFlyer } from "./flyer";
import {
  COURSE_BROCHURE_FILE, COURSE_BROCHURE_OBJECT, COURSE_FLYER_OBJECT, COURSE_MATERIAL_BUCKET, COURSE_SIGNATURE_LOGO_OBJECT,
} from "./config";
import { buildEmployerInvitation, COURSE_SIGNATURE_LOGO_CID } from "./employer-invitation";
import { COURSE_FORMAT_LABEL, COURSE_PARTICIPANT_LIMIT, courseTimeLabel } from "./slots";
import type { OutreachGreeting } from "./outreach";
import type { Booking } from "./store";

const COURSE_MAIL_FROM = "Alltagshilfe-Süd <info@alltagshilfe-sued.de>";

type CourseMail = {
  to: string;
  subject: string;
  headline: string;
  message: string;
  afterRows?: string;
  rows?: EmailDetailRow[];
  link?: { href: string; label: string };
  qrCodeCid?: string;
  attachments?: SendInternalMailAttachment[];
};

export async function sendCourseMail({
  to, subject, headline, message, afterRows, rows = [], link, qrCodeCid, attachments,
}: CourseMail) {
  const text = [message, ...rows.map(({ label, value }) => label + ": " + value), afterRows,
    link ? link.label + ": " + link.href : ""].filter(Boolean).join("\n\n");
  const result = await sendTransactionalMail({
    to, from: COURSE_MAIL_FROM, subject, text, attachments,
    html: buildBrandedNotificationHtml({
      kindBadge: "Orientierungskurs", headline, rows, qrCodeCid,
      introText: afterRows ? message : undefined, detailText: afterRows ? undefined : message, closingText: afterRows,
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

function formalGreeting(salutation?: "frau" | "herr" | null, lastName?: string | null): string {
  if (!salutation || !lastName) return "Sehr geehrte Damen und Herren,";
  return (salutation === "frau" ? "Sehr geehrte Frau " : "Sehr geehrter Herr ") + lastName + ",";
}

export function sendBookingConfirmation(course: Booking) {
  const greeting = formalGreeting(course.contact_salutation, course.contact_last_name);
  return sendCourseMail({
    to: course.contact_email,
    subject: "Bestätigung Ihrer Buchung zum Orientierungskurs",
    headline: "Ihr Orientierungskurs ist gebucht",
    message: greeting + "\n\nhiermit bestätigen wir Ihnen die Buchung Ihres kostenlosen Orientierungskurses zur Vereinbarkeit von Pflege und Beruf.",
    rows: [
      ...courseRows(course), ...venueRows(course),
      { label: "Firma", value: course.company },
      { label: "Ansprechperson", value: course.contact_name },
      { label: "E-Mail", value: course.contact_email },
      { label: "Telefon", value: course.contact_phone },
    ],
    afterRows: [
      "Wie geht es weiter?",
      "In einer zweiten E-Mail erhalten Sie eine Einladung, die Sie direkt an Ihre Mitarbeitenden weiterleiten können. Die PDF im Anhang können Sie auch ausdrucken und aushängen. Interessierte melden sich über den Link oder QR-Code direkt und kostenlos an.",
      "Pro Termin stehen " + COURSE_PARTICIPANT_LIMIT + " Plätze zur Verfügung. Sobald alle Plätze vergeben sind, benachrichtigen wir Sie per E-Mail. Weitere Interessierte können sich auf die Warteliste setzen lassen.",
      ...(course.format === "online" ? ["Den Zugang zum Online-Kurs erhalten angemeldete Teilnehmende per E-Mail."] : []),
      "Etwa eine Woche vor dem Kurs melden wir uns bei Ihnen, um die letzten Details abzustimmen.",
      "Herzliche Grüße aus Bad Grönenbach\nIhr Team von Alltagshilfe-Süd",
    ].join("\n\n"),
  });
}

export async function sendShareableInvitation(client: SupabaseClient, course: Booking, link: string) {
  const [template, qr] = await Promise.all([
    client.storage.from(COURSE_MATERIAL_BUCKET).download(COURSE_FLYER_OBJECT),
    QRCode.toBuffer(link, { width: 600, margin: 4, errorCorrectionLevel: "M" }),
  ]);
  if (!template.data || template.error) {
    console.error("[orientierungskurs] Vorlage für die Mitarbeitereinladung konnte nicht geladen werden");
    return false;
  }
  const flyer = await createCourseFlyer(await template.data.arrayBuffer(), course, link, qr);
  const cid = "kursanmeldung@alltagshilfe-sued";
  return sendCourseMail({
    to: course.contact_email,
    subject: "Einladung zum kostenlosen Orientierungskurs: Pflege und Beruf",
    headline: "Einladung zum kostenlosen Orientierungskurs",
    message: "Wie lassen sich Beruf und die Pflege eines Angehörigen vereinbaren? In unserem kostenlosen Orientierungskurs erfahren Sie, welche ersten Schritte im Pflegefall helfen und wo Sie Beratung und Entlastung finden.",
    rows: courseRows(course),
    afterRows: "Weitere Informationen finden Sie in der Einladung im PDF-Anhang.",
    link: { href: link, label: "Kostenlos zur Teilnahme anmelden" },
    qrCodeCid: cid,
    attachments: [
      { filename: "Kursanmeldung-QR.png", content: qr, contentType: "image/png", cid },
      { filename: "Einladung-Orientierungskurs-Pflege-und-Beruf.pdf", content: flyer, contentType: "application/pdf" },
    ],
  });
}

export function sendCourseFullNotice(course: Booking) {
  return sendCourseMail({
    to: course.contact_email,
    subject: "Ihr Orientierungskurs ist ausgebucht",
    headline: "Alle Kursplätze sind vergeben",
    message: formalGreeting(course.contact_salutation, course.contact_last_name) +
      "\n\nfür Ihren Orientierungskurs sind alle " + COURSE_PARTICIPANT_LIMIT + " Plätze vergeben. Weitere Interessierte können sich über denselben Link auf die Warteliste setzen lassen.",
    rows: courseRows(course),
    afterRows: "Herzliche Grüße aus Bad Grönenbach\nIhr Team von Alltagshilfe-Süd",
  });
}

export function sendCourseTeamFullNotice(course: Booking, to: string, origin: string) {
  return sendCourseMail({
    to,
    subject: "Orientierungskurs ausgebucht · " + course.company,
    headline: "Zehn Kursplätze sind vergeben",
    message: "Weitere Anmeldungen landen auf der Warteliste. Im Bereich Pflegekurse könnt ihr einen Folgetermin anlegen und Personen von der Warteliste dorthin umbuchen.",
    rows: [...courseRows(course), { label: "Unternehmen", value: course.company }],
    link: {
      href: new URL("/partner/pflegekurse?month=" + course.slot_date.slice(0, 7) + "&day=" + course.slot_date, origin).href,
      label: "Kurs im Dashboard öffnen",
    },
  });
}

export function sendCourseWaitlistConfirmation(course: Booking, to: string, firstName: string) {
  return sendCourseMail({
    to,
    subject: "Ihre Anmeldung auf der Warteliste zum Orientierungskurs",
    headline: "Sie stehen auf der Warteliste",
    message: "Hallo " + firstName + ",\n\nvielen Dank für Ihr Interesse. Für diesen Termin sind alle Plätze vergeben. Wir haben Sie auf die Warteliste gesetzt.",
    rows: courseRows(course),
    afterRows: "Wenn wir Ihnen bei einem weiteren Termin einen Platz anbieten können, erhalten Sie eine E-Mail. Falls Sie kein Interesse mehr haben, können Sie auf diese Nachricht antworten.\n\nHerzliche Grüße aus Bad Grönenbach\nIhr Team von Alltagshilfe-Süd",
  });
}

export function sendParticipantConfirmation(course: Booking, to: string, firstName: string) {
  const online = course.format === "online";
  const courseAccess = online
    ? (course.meeting_url ? "Über den Button unten gelangen Sie zum Online-Kurs. Öffnen Sie den Link bitte zur angegebenen Uhrzeit."
      : "Die Informationen zum Online-Zugang erhalten Sie vor dem Termin per E-Mail.")
    : "Bitte kommen Sie zur angegebenen Uhrzeit zum Schulungsort. Adresse, Raum und gegebenenfalls einen Parkhinweis finden Sie oben.";
  return sendCourseMail({
    to,
    subject: online ? "Ihre Anmeldung zum Online-Orientierungskurs" : "Ihre Anmeldung zum Orientierungskurs vor Ort",
    headline: "Ihre Teilnahme ist bestätigt",
    message: "Hallo " + firstName + ",\n\nwir freuen uns, dass Sie an unserem kostenlosen Orientierungskurs zur Vereinbarkeit von Pflege und Beruf teilnehmen. Ihr Platz ist reserviert.",
    rows: [...courseRows(course), ...venueRows(course)],
    afterRows: [
      courseAccess,
      "Falls Sie verhindert sind, melden Sie sich bitte möglichst frühzeitig ab, indem Sie auf diese E-Mail antworten. So können wir besser planen.",
      "Herzliche Grüße aus Bad Grönenbach\nIhr Team von Alltagshilfe-Süd",
    ].join("\n\n"),
    link: online && course.meeting_url ? { href: course.meeting_url, label: "Zum Online-Kurs" } : undefined,
  });
}

export async function sendEmployerInvitation(
  client: SupabaseClient,
  to: string,
  origin: string,
  code: string,
  recipient?: OutreachGreeting,
  reminder = false,
): Promise<"sent" | "failed" | "unconfirmed"> {
  const storage = client.storage.from(COURSE_MATERIAL_BUCKET);
  const [brochure, logo] = await Promise.all([
    storage.download(COURSE_BROCHURE_OBJECT),
    storage.download(COURSE_SIGNATURE_LOGO_OBJECT),
  ]);
  if (!brochure.data || brochure.error || !logo.data || logo.error) {
    console.error("[orientierungskurs] Kursflyer oder Signaturlogo konnte nicht geladen werden");
    return "failed";
  }
  const salutation = formalGreeting(recipient?.salutation, recipient?.lastName);
  const result = await sendTransactionalMail({
    to, from: COURSE_MAIL_FROM, ...buildEmployerInvitation(salutation, origin, code, reminder),
    attachments: [
      { filename: COURSE_BROCHURE_FILE, content: Buffer.from(await brochure.data.arrayBuffer()), contentType: "application/pdf" },
      {
        filename: COURSE_SIGNATURE_LOGO_OBJECT, content: Buffer.from(await logo.data.arrayBuffer()),
        contentType: "image/png", cid: COURSE_SIGNATURE_LOGO_CID,
      },
    ],
  });
  return result.ok ? "sent" : result.deliveryUncertain ? "unconfirmed" : "failed";
}

export function sendCourseReminderDueNotice(to: string, contact: string, sentAt: string, origin: string) {
  const date = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium" }).format(new Date(sentAt));
  return sendCourseMail({
    to,
    subject: "Pflegekurse · Erinnerung zur Prüfung fällig",
    headline: "Seit 14 Tagen ist keine passende Buchung erfasst",
    message: "Ihr könnt im Versandprotokoll die Zuordnung prüfen und bei Bedarf eine Erinnerung auslösen.",
    rows: [{ label: "Eingeladene Adresse", value: contact }, { label: "Erste Einladung", value: date }],
    link: { href: new URL("/partner/pflegekurse#versandprotokoll", origin).href, label: "Zum Versandprotokoll" },
  });
}
