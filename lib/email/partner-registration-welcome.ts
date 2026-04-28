import { sendTransactionalMail } from "@/lib/email/internal-smtp";
import { siteConfig } from "@/config/site";
import { getPublicSiteBaseUrl } from "@/lib/partner/site-origin";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function footerBlock(): {
  kontaktinformationen: string;
  telefon: string;
  email: string;
  website: string;
  websiteHref: string;
} {
  const websiteDisplay =
    process.env.PARTNER_REGISTRATION_MAIL_WEBSITE?.trim() ||
    (getPublicSiteBaseUrl()?.startsWith("http") ? getPublicSiteBaseUrl()! : "https://www.alltagshilfe-sued.de");
  const websiteHref = websiteDisplay.startsWith("http") ? websiteDisplay : `https://${websiteDisplay.replace(/^\/+/, "")}`;

  return {
    kontaktinformationen:
      process.env.PARTNER_REGISTRATION_MAIL_KONTAKT?.trim() ||
      [
        "V. Maucher und Philip Sonntag GbR · Alltagshilfe Süd",
        "Hinter den Gärten 10 · 87730 Bad Grönenbach",
      ].join("\n"),
    telefon: process.env.PARTNER_REGISTRATION_MAIL_TELEFON?.trim() || "08334 / 9893330",
    email: process.env.PARTNER_REGISTRATION_MAIL_TEAM_EMAIL?.trim() || "info@alltagshilfe-sued.de",
    website: websiteDisplay,
    websiteHref,
  };
}

function partnerPortalLoginUrl(): string {
  const base = getPublicSiteBaseUrl() || siteConfig.baseUrl.replace(/\/$/, "");
  return `${base}/partner/login`;
}

/**
 * Bestätigung nach Partner-Anlage in der Verwaltung (TLS wie übriges SMTP).
 */
export async function sendPartnerRegistrationWelcomeMail(params: {
  partnerEmail: string;
  vorname: string;
  nachname: string;
  einmalpasswort: string;
}): Promise<{ ok: true } | { ok: false }> {
  const loginLink = partnerPortalLoginUrl();
  const f = footerBlock();
  const e = escapeHtml;
  const a = escapeAttr;

  const text = [
    `Guten Tag ${params.vorname} ${params.nachname},`,
    "",
    "vielen Dank für Ihre Registrierung als Kooperationspartner bei Alltagshilfe-Süd.",
    "",
    "Wir freuen uns sehr über Ihr Interesse an einer Zusammenarbeit. Über unser Partner-Dashboard können Sie künftig Ihre vermittelten Vorgänge übersichtlich einsehen, den Bearbeitungsstatus verfolgen und Informationen zu Ihren Provisionen abrufen.",
    "",
    "Zu Beginn erwartet Sie ein kurzes Tutorial, das Ihnen die wichtigsten Funktionen und einzelnen Schritte im Partner-Dashboard noch einmal einfach erklärt.",
    "",
    "Ihre Zugangsdaten für den Partner-Login:",
    "",
    `Login-Link: ${loginLink}`,
    `Benutzername / E-Mail: ${params.partnerEmail}`,
    `Einmalpasswort: ${params.einmalpasswort}`,
    "",
    "Bitte melden Sie sich mit dem Einmalpasswort an. Direkt beim ersten Login können Sie das Einmalpasswort in ein persönliches Passwort ändern.",
    "",
    "Bei Fragen zur Anmeldung, zum Partner-Dashboard oder zur weiteren Zusammenarbeit können Sie sich jederzeit gerne bei uns melden.",
    "",
    "Wir freuen uns auf eine erfolgreiche Zusammenarbeit.",
    "",
    "Mit freundlichen Grüßen",
    "Ihr Team von Alltagshilfe-Süd",
    "",
    f.kontaktinformationen,
    `Tel.: ${f.telefon}`,
    `E-Mail: ${f.email}`,
    `Website: ${f.website}`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="de"><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1a1a;font-size:16px;">
<p>Guten Tag ${e(params.vorname)} ${e(params.nachname)},</p>
<p>vielen Dank für Ihre Registrierung als Kooperationspartner bei Alltagshilfe-Süd.</p>
<p>Wir freuen uns sehr über Ihr Interesse an einer Zusammenarbeit. Über unser Partner-Dashboard können Sie künftig Ihre vermittelten Vorgänge übersichtlich einsehen, den Bearbeitungsstatus verfolgen und Informationen zu Ihren Provisionen abrufen.</p>
<p>Zu Beginn erwartet Sie ein kurzes Tutorial, das Ihnen die wichtigsten Funktionen und einzelnen Schritte im Partner-Dashboard noch einmal einfach erklärt.</p>
<p><strong>Ihre Zugangsdaten für den Partner-Login:</strong></p>
<ul style="margin:0 0 1em 1.1em;padding:0;">
<li><strong>Login-Link:</strong> <a href="${a(loginLink)}">${e(loginLink)}</a></li>
<li><strong>Benutzername / E-Mail:</strong> ${e(params.partnerEmail)}</li>
<li><strong>Einmalpasswort:</strong> <code style="font-size:14px">${e(params.einmalpasswort)}</code></li>
</ul>
<p>Bitte melden Sie sich mit dem Einmalpasswort an. Direkt beim ersten Login können Sie das Einmalpasswort in ein persönliches Passwort ändern.</p>
<p>Bei Fragen zur Anmeldung, zum Partner-Dashboard oder zur weiteren Zusammenarbeit können Sie sich jederzeit gerne bei uns melden.</p>
<p>Wir freuen uns auf eine erfolgreiche Zusammenarbeit.</p>
<p>Mit freundlichen Grüßen<br/>Ihr Team von Alltagshilfe-Süd</p>
<hr style="border:none;border-top:1px solid #eee;margin:1.5em 0" />
<p style="font-size:14px;color:#444;white-space:pre-line">${e(f.kontaktinformationen)}</p>
<p style="font-size:14px;color:#444">${e(`Tel.: ${f.telefon}`)}</p>
<p style="font-size:14px;color:#444">${e(`E-Mail: ${f.email}`)}</p>
<p style="font-size:14px;color:#444"><a href="${a(f.websiteHref)}">${e(f.website)}</a></p>
</body></html>`;

  const sent = await sendTransactionalMail({
    to: params.partnerEmail,
    subject: `Ihre Registrierung als Kooperationspartner bei ${siteConfig.name}`,
    text,
    html,
  });

  return sent.ok ? { ok: true } : { ok: false };
}
