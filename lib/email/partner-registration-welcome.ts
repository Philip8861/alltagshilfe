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
    (getPublicSiteBaseUrl()?.startsWith("http") ? getPublicSiteBaseUrl()! : "https://www.alltagshilfe-sued.de");
  const websiteHref = websiteDisplay.startsWith("http") ? websiteDisplay : `https://${websiteDisplay.replace(/^\/+/, "")}`;

  return {
    kontaktinformationen:
      process.env.PARTNER_REGISTRATION_MAIL_KONTAKT?.trim() ||
      [
        "Alltagshilfe Süd, Valentin Maucher und Philip Sonntag GbR",
        "Hinter den Gärten 10, 87730 Bad Grönenbach",
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
  leistungen?: string[];
}): PartnerRegistrationWelcomeInputs {
  const f = footerStrings();
  return {
    vorname: params.vorname,
    nachname: params.nachname,
    partnerEmail: params.partnerEmail,
    einmalpasswort: params.einmalpasswort.trim(),
    loginUrl: partnerPortalLoginUrl(),
    kontaktinformationen: f.kontaktinformationen,
    tel: f.telefon,
    teamEmail: f.teamEmail,
    websiteLabel: f.websiteLabel,
    websiteHref: f.websiteHref,
    leistungen: params.leistungen,
    assetBaseUrl: assetBaseUrl(),
  };
}

/** Absolute Basis-URL für Bilder in der Mail (Logo, Icons); nur https-Quellen. */
function assetBaseUrl(): string | undefined {
  const base = (getPublicSiteBaseUrl() || siteConfig.baseUrl).replace(/\/$/, "");
  return /^https:\/\//.test(base) ? base : undefined;
}

/**
 * Klartext-Variante (kurz). Das Passwort steht allein in einer Zeile,
 * damit es ohne Leerzeichen kopiert werden kann.
 */
function buildPlainTextBody(inp: PartnerRegistrationWelcomeInputs): string {
  const leistungen = (inp.leistungen ?? []).map((s) => s.trim()).filter(Boolean);
  return [
    `Guten Tag ${inp.vorname.trim()} ${inp.nachname.trim()},`,
    "",
    "Ihr Zugang zum Partnerportal ist eingerichtet. Dort sehen Sie Ihre Vorgänge, den Bearbeitungsstand und Ihre Provisionen.",
    "",
    ...(leistungen.length > 0 ? [`${leistungen.length === 1 ? "Bereich" : "Bereiche"}: ${leistungen.join(", ")}`] : []),
    `E-Mail: ${inp.partnerEmail.trim()}`,
    "Einmalpasswort (nächste Zeile):",
    inp.einmalpasswort.trim(),
    "",
    `Anmelden: ${inp.loginUrl.trim()}`,
    "Beim ersten Login legen Sie ein eigenes Passwort fest.",
    "",
    `Fragen? Tel. ${inp.tel.trim()} oder ${inp.teamEmail.trim()}`,
    "",
    "Mit freundlichen Grüßen",
    `Ihr Team von ${siteConfig.name}`,
    "",
    inp.kontaktinformationen,
    inp.websiteLabel.trim(),
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
  /** Anzeige-Labels der freigeschalteten Leistungen. */
  leistungen?: string[];
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
    leistungen: ["Betriebliche Pflegeberatung"],
    loginUrl: `${base}/partner/login`,
    kontaktinformationen: f.kontaktinformationen,
    tel: f.telefon,
    teamEmail: f.teamEmail,
    websiteLabel: f.websiteLabel,
    websiteHref: f.websiteHref,
    assetBaseUrl: assetBaseUrl(),
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
    text: [`[Vorschau, keine echten Zugangsdaten]`, "", buildPlainTextBody(demo)].join("\n"),
    html: buildBrandedPartnerRegistrationWelcomeHtml(demo),
  });
}
