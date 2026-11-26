import { escapeEmailHrefAttr, escapeHtml } from "@/lib/email/branded-html";
import { BOOKING_PATH, INFO_APPOINTMENT_PATH } from "./config";

export const COURSE_SIGNATURE_LOGO_CID = "signatur-logo@alltagshilfe-sued.de";

const subject = "Kostenloser Orientierungskurs zur Vereinbarkeit von Beruf und Pflege";
const courseLabel = "Kostenlosen Orientierungskurs buchen";
const infoLabel = "Kostenloses Infogespräch buchen";
const bookingIntro = "Über den folgenden Link buchen Sie die Schulung in drei kurzen Schritten.";
const infoIntro = "Sie möchten erst mehr erfahren? Gerne beantworten wir Ihre Fragen in einem kostenlosen 10-minütigen Infogespräch.";
const followUp = "Bei weiteren Fragen stehen wir gerne zur Verfügung.";
const closingGreeting = "Herzliche Grüße aus Bad Grönenbach";
const signatureName = "Franz Dirscherl";
const signatureCompany = "Alltagshilfe-Süd";
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
    infoIntro, infoLabel + ": " + infoUrl, followUp,
    closingGreeting + "\n" + signatureName + "\n" + signatureCompany,
  ].join("\n\n");
  const paragraph = (value: string) => `<p style="margin:0 0 16px;">${escapeHtml(value)}</p>`;
  const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(headline)}</title>
</head>
<body style="margin:0; background-color:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
    <tr>
      <td align="center" style="padding:24px 20px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
          <tr>
            <td align="left" style="font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:1.6; color:#25343c;">
              ${[salutation, ...paragraphs].map(paragraph).join("")}
              <p style="margin:0 0 24px;">
                <a href="${escapeEmailHrefAttr(bookingUrl)}" style="display:inline-block; padding:10px 15px; border:1px solid #c5dfe3; border-radius:6px; background-color:#edf6f7; color:#0f4f68; font-weight:bold; text-decoration:none;">${escapeHtml(courseLabel)}</a>
              </p>
              ${paragraph(infoIntro)}
              <p style="margin:0 0 24px;">
                <a href="${escapeEmailHrefAttr(infoUrl)}" style="color:#0f4f68; font-weight:bold; text-decoration:underline;">${escapeHtml(infoLabel)}</a>
              </p>
              ${paragraph(followUp)}
              <p style="margin:0 0 10px;">${escapeHtml(closingGreeting)}</p>
              <p style="margin:0 0 12px;"><strong>${escapeHtml(signatureName)}</strong><br>${escapeHtml(signatureCompany)}</p>
              <img src="cid:${COURSE_SIGNATURE_LOGO_CID}" alt="${escapeHtml(signatureCompany)}" width="196" height="65" style="display:block; width:196px; height:auto; max-width:100%; border:0;">
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  return { subject: headline, text, html };
}
