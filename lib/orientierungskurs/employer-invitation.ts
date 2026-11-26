import { escapeEmailHrefAttr, escapeHtml } from "@/lib/email/branded-html";
import { BOOKING_PATH, COURSE_CONTACT_EMAIL, INFO_APPOINTMENT_PATH } from "./config";
import { COURSE_SIGNATURE_TEXT, renderCourseButton, renderCourseLetter, renderCourseParagraphs, renderCourseSignature } from "./mail-layout";

const subject = "Kostenloser Orientierungskurs zur Vereinbarkeit von Beruf und Pflege";
const courseLabel = "Kostenlosen Orientierungskurs buchen";
const infoLabel = "Kostenloses Infogespräch buchen";
const bookingIntro = "Über den folgenden Link buchen Sie die Schulung in drei kurzen Schritten.";
const infoIntro = "Sie möchten erst mehr erfahren? Gerne beantworten wir Ihre Fragen in einem kostenlosen 10-minütigen Infogespräch.";
const followUp = "Bei weiteren Fragen stehen wir gerne zur Verfügung.";
const message = [
  "wir freuen uns über Ihr Interesse an unserem kostenlosen Orientierungskurs zur Vereinbarkeit von Beruf und Pflege. Die Pflegereform und der demografische Wandel verändern das Gesundheitswesen. Gleichzeitig wirkt sich die Pflege von Angehörigen für viele Beschäftigte direkt auf den Arbeitsalltag aus.",
  "Unser Kurs hilft Ihren Mitarbeitenden, sich auf eine Pflegesituation vorzubereiten und im konkreten Fall schnell die ersten Schritte und passenden Hilfen zu finden. Weitere Informationen finden Sie im Anhang.",
];

export function buildEmployerInvitation(salutation: string, origin: string, code: string, reminder: boolean) {
  const booking = new URL(BOOKING_PATH, origin);
  booking.searchParams.set("einladung", code);
  const bookingUrl = booking.href;
  const infoUrl = new URL(INFO_APPOINTMENT_PATH, origin).href;
  const headline = reminder ? "Erinnerung an den kostenlosen Orientierungskurs zu Pflege und Beruf" : subject;
  const paragraphs = reminder ? [
    "wir hatten Ihnen unseren kostenlosen Orientierungskurs zur Vereinbarkeit von Beruf und Pflege vorgestellt. Wenn Sie Ihren Mitarbeitenden die Teilnahme ermöglichen möchten, können Sie über den folgenden Link einen Termin buchen.",
  ] : [...message, bookingIntro];
  const text = [
    salutation, ...paragraphs, courseLabel + ": " + bookingUrl,
    infoIntro, infoLabel + ": " + infoUrl, followUp + " " + COURSE_CONTACT_EMAIL,
    COURSE_SIGNATURE_TEXT,
  ].join("\n\n");
  const html = renderCourseLetter(headline, `
    ${renderCourseParagraphs([salutation, ...paragraphs].join("\n\n"))}
    <p style="margin:0 0 24px;">${renderCourseButton({ href: bookingUrl, label: courseLabel })}</p>
    ${renderCourseParagraphs(infoIntro)}
    <p style="margin:0 0 24px;">
      <a href="${escapeEmailHrefAttr(infoUrl)}" style="color:#0f4f68; font-weight:bold; text-decoration:underline;">${escapeHtml(infoLabel)}</a>
    </p>
    <p style="margin:0 0 16px;">${escapeHtml(followUp)}
      <a href="${escapeEmailHrefAttr("mailto:" + COURSE_CONTACT_EMAIL)}" style="color:#0f4f68;">${escapeHtml(COURSE_CONTACT_EMAIL)}</a>
    </p>
    ${renderCourseSignature(true)}`);
  return { subject: headline, text, html };
}
