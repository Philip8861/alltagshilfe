import { sendTransactionalMail } from "@/lib/email/internal-smtp";
import {
  buildBrandedPartnerRegistrationWelcomeHtml,
  partnerRegistrationWelcomeSubject,
  type PartnerRegistrationWelcomeInputs,
} from "@/lib/email/branded-html";
import { siteConfig } from "@/config/site";
import { getPublicSiteBaseUrl } from "@/lib/partner/site-origin";

function footerStrings(): {
  kontaktinformationen: string;
  telefon: string;
  teamEmail: string;
  websiteLabel: string;
  websiteHref: string;
} {
  const websiteDisplay =
    process.env.PARTNER_REGISTRATION_MAIL_WEBSITE?.trim() ||
    (getPublicSiteBaseUrl()?.startsWith("http") ? getPublicSiteBaseUrl()! : "https://alltagshilfe-sued.de");
  const websiteHref = websiteDisplay.startsWith("http") ? websiteDisplay : `https://${websiteDisplay.replace(/^\/+/, "")}`;

  return {
    kontaktinformationen:
      process.env.PARTNER_REGISTRATION_MAIL_KONTAKT?.trim() ||
      [
        "Valentin Maucher und Philip Sonntag GbR · Alltagshilfe Süd",
        "Hinter den Gärten 10 · 87730 Bad Grönenbach",
      ].join("\n"),
    telefon: process.env.PARTNER_REGISTRATION_MAIL_TELEFON?.trim() || "08334 / 9893330",
    teamEmail: process.env.PARTNER_REGISTRATION_MAIL_TEAM_EMAIL?.trim() || "info@alltagshilfe-sued.de",
    websiteLabel: websiteDisplay,
    websiteHref,
  };
}

function partnerPortalLoginUrl(): string {
  const base = getPublicSiteBaseUrl() || siteConfig.baseUrl.replace(/\/$/, "");
  return `${base}/partner/login`;
}

function buildPartnerRegistrationMailPayload(params: {
  partnerEmail: string;
  vorname: string;
  nachname: string;
  einmalpasswort: string;
}): PartnerRegistrationWelcomeInputs {
  const f = footerStrings();
  return {
    vorname: params.vorname,
    nachname: params.nachname,
    partnerEmail: params.partnerEmail,
    einmalpasswort: params.einmalpasswort,
    loginUrl: partnerPortalLoginUrl(),
    kontaktinformationen: f.kontaktinformationen,
    tel: f.telefon,
    teamEmail: f.teamEmail,
    websiteLabel: f.websiteLabel,
    websiteHref: f.websiteHref,
  };
}

function buildPlainTextBody(inp: PartnerRegistrationWelcomeInputs): string {
  return [
    `Guten Tag ${inp.vorname} ${inp.nachname},`,
    "",
    `vielen Dank für Ihre Registrierung als Kooperationspartner bei ${siteConfig.name}.`,
    "",
    "Über unser Partner-Dashboard können Sie künftig Ihre vermittelten Vorgänge übersichtlich einsehen, den Bearbeitungsstatus verfolgen und Informationen zu Ihren Provisionen abrufen.",
    "",
    "Zu Beginn erwartet Sie ein kurzes Tutorial zu den wichtigsten Funktionen.",
    "",
    "Zugang:",
    `Login: ${inp.loginUrl}`,
    `Benutzername / E-Mail: ${inp.partnerEmail}`,
    `Einmalpasswort: ${inp.einmalpasswort}`,
    "",
    "Mit freundlichen Grüßen",
    `Ihr Team von ${siteConfig.name}`,
    "",
    inp.kontaktinformationen,
    `Tel.: ${inp.tel}`,
    `E-Mail: ${inp.teamEmail}`,
    `Website: ${inp.websiteLabel}`,
  ].join("\n");
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
  const inp = buildPartnerRegistrationMailPayload(params);

  const sent = await sendTransactionalMail({
    to: params.partnerEmail,
    subject: partnerRegistrationWelcomeSubject(),
    text: buildPlainTextBody(inp),
    html: buildBrandedPartnerRegistrationWelcomeHtml(inp),
  });

  return sent.ok ? { ok: true } : { ok: false };
}

function buildDemoPreviewPayload(): PartnerRegistrationWelcomeInputs {
  const f = footerStrings();
  const base = getPublicSiteBaseUrl() || siteConfig.baseUrl.replace(/\/$/, "");
  return {
    vorname: "Max",
    nachname: "Mustermann",
    partnerEmail: "beispiel.partner@alltagshilfe-sued.de",
    einmalpasswort: "Aa!7xQy9",
    loginUrl: `${base}/partner/login`,
    kontaktinformationen: f.kontaktinformationen,
    tel: f.telefon,
    teamEmail: f.teamEmail,
    websiteLabel: f.websiteLabel,
    websiteHref: f.websiteHref,
  };
}

/**
 * Vorschau-Mail (Design/Beispieldaten) — z. B. aus der Verwaltung zum Testversand.
 */
export async function sendPartnerRegistrationWelcomePreviewMail(
  to: string,
): Promise<{ ok: true } | { ok: false; code: "invalid_recipient" | "smtp_not_configured" | "send_failed" }> {
  const trimmed = to.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, code: "invalid_recipient" };
  }

  const demo = buildDemoPreviewPayload();

  return sendTransactionalMail({
    to: trimmed,
    subject: `[Vorschau] ${partnerRegistrationWelcomeSubject()}`,
    text: [`[Vorschau / Test – keine echten Zugangsdaten]`, "", buildPlainTextBody(demo)].join("\n"),
    html: buildBrandedPartnerRegistrationWelcomeHtml(demo),
  });
}
