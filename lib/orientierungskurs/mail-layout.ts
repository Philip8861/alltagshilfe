import { escapeEmailHrefAttr, escapeHtml, type EmailDetailRow } from "@/lib/email/branded-html";

type MailLink = { href: string; label: string };

export function renderCourseLetter(subject: string, content: string): string {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0; background-color:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
    <tr><td align="center" style="padding:24px 20px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
        <tr><td align="left" style="font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:1.6; color:#25343c;">
          ${content}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function renderCourseParagraphs(text: string): string {
  return text.split(/\r?\n\r?\n/).filter(Boolean)
    .map((paragraph) => `<p style="margin:0 0 16px;">${escapeHtml(paragraph).replace(/\r?\n/g, "<br>")}</p>`).join("");
}

export function renderCourseButton({ href, label }: MailLink): string {
  return `<a href="${escapeEmailHrefAttr(href)}" style="display:inline-block; padding:10px 15px; border:1px solid #c5dfe3; border-radius:6px; background-color:#edf6f7; color:#0f4f68; font-weight:bold; text-decoration:none;">${escapeHtml(label)}</a>`;
}

export function renderCourseNotification(options: {
  subject: string;
  headline: string;
  message: string;
  rows: EmailDetailRow[];
  afterRows?: string;
  link?: MailLink;
  qrCodeCid?: string;
  contactEmail: string;
}): string {
  const { subject, headline, message, rows, afterRows, link, qrCodeCid, contactEmail } = options;
  const details = rows.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed; margin:0 0 20px;">
        ${rows.map(({ label, value }) => `<tr>
          <td valign="top" width="35%" style="padding:7px 12px 7px 0; border-bottom:1px solid #e3ecee; color:#193c4a; font-weight:bold;">
            ${escapeHtml(label)}
          </td>
          <td valign="top" style="padding:7px 0; border-bottom:1px solid #e3ecee; overflow-wrap:anywhere; word-wrap:break-word;">
            ${escapeHtml(value).replace(/\r?\n/g, "<br>")}
          </td>
        </tr>`).join("")}
      </table>`
    : "";
  const links = link
    ? `<p style="margin:0 0 8px;">${renderCourseButton(link)}</p>
       <p style="margin:0 0 18px; font-size:13px; color:#546871;">
         Direktlink<br><a href="${escapeEmailHrefAttr(link.href)}" style="color:#0f4f68; word-break:break-all;">${escapeHtml(link.href)}</a>
       </p>`
    : "";
  const qrCode = qrCodeCid
    ? `<img src="cid:${escapeHtml(qrCodeCid)}" width="140" height="140" alt="QR-Code zur Kursanmeldung" style="display:block; margin:0 0 16px; border:0;">`
    : "";

  return renderCourseLetter(subject, `
    <h1 style="margin:0 0 20px; color:#143844; font-size:24px; line-height:1.25;">${escapeHtml(headline)}</h1>
    ${renderCourseParagraphs(message)}
    ${details}
    ${afterRows ? renderCourseParagraphs(afterRows) : ""}
    ${links}
    ${qrCode}
    <p style="margin:20px 0 0; font-size:14px; color:#546871;">
      Weitere Fragen? <a href="${escapeEmailHrefAttr("mailto:" + contactEmail)}" style="color:#0f4f68;">${escapeHtml(contactEmail)}</a>
    </p>`);
}
