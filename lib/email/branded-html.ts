import { siteConfig } from "@/config/site";

/** Markenfarben (wie auf der Website) – nur Inline-Styles für E-Mail-Clients. */
const C = {
  primary: "#0F4F68",
  primaryDark: "#0c3d52",
  accent: "#F78F2E",
  pageBg: "#E8F2F5",
  cardBg: "#ffffff",
  muted: "#5c6b73",
  border: "rgba(15, 79, 104, 0.14)",
  rowLabel: "#0F4F68",
} as const;

const FONT =
  "'Nunito Sans', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export type EmailDetailRow = { label: string; value: string };

function nl2brEscaped(text: string): string {
  return escapeHtml(text).replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");
}

function brandedEmailShell(options: {
  kindBadge: string;
  headline: string;
  /** Tabellenzeilen zwischen Header und Footer (jeweils <tr>…</tr>). */
  bodyRowsHtml: string;
}): string {
  const { kindBadge, headline, bodyRowsHtml } = options;
  const brand = escapeHtml(siteConfig.name);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0;padding:0;background:${C.pageBg};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:transparent;">
    ${escapeHtml(headline)} – ${brand}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.pageBg};">
    <tr>
      <td align="center" style="padding:28px 16px 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:${C.cardBg};border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(15,79,104,0.12);border:1px solid ${C.border};">
          <tr>
            <td style="background:linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%);padding:24px 24px 22px 24px;border-bottom:4px solid ${C.accent};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.92);background:rgba(255,255,255,0.12);padding:6px 12px;border-radius:999px;margin-bottom:12px;">
                      ${escapeHtml(kindBadge)}
                    </span>
                    <h1 style="margin:0;font-family:${FONT};font-size:22px;line-height:1.25;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                      ${escapeHtml(headline)}
                    </h1>
                    <p style="margin:10px 0 0 0;font-family:${FONT};font-size:14px;line-height:1.45;color:rgba(255,255,255,0.88);">
                      ${brand}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${bodyRowsHtml}
          <tr>
            <td style="padding:18px 20px 22px 20px;background:#F2F9FA;border-top:1px solid ${C.border};">
              <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.5;color:${C.muted};text-align:center;">
                Automatische Benachrichtigung von der Website · ${brand} · © ${year}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildPartnerPasswordResetEmailBodyRows(ctaHrefAttr: string, ctaHrefPlainText: string): string {
  const intro = [
    "Sie haben angefordert, Ihr Passwort für den Partnerbereich neu zu setzen.",
    "Klicken Sie auf den Button unten. Anschließend können Sie auf unserer Website ein neues Passwort festlegen.",
    "Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail — Ihr Zugang bleibt unverändert.",
  ];

  const introHtml = intro
    .map(
      (p) =>
        `<p style="margin:0 0 14px 0;font-family:${FONT};font-size:16px;line-height:1.55;color:#1a1a1a;">${nl2brEscaped(p)}</p>`,
    )
    .join("");

  const ctaLabel = escapeHtml("Neues Passwort festlegen");

  return `
          <tr>
            <td style="padding:22px 20px 8px 20px;">
              ${introHtml}
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 8px 0;">
                <tr>
                  <td style="border-radius:14px;background:${C.primary};">
                    <a href="${ctaHrefAttr}" style="display:inline-block;font-family:${FONT};font-size:16px;font-weight:700;line-height:1.2;color:#ffffff;text-decoration:none;padding:16px 28px;border-radius:14px;background:${C.primary};border:1px solid ${C.primaryDark};">
                      ${ctaLabel}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:18px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${C.muted};">
                Alternativ können Sie diesen Link in die Adresszeile Ihres Browsers kopieren:<br/>
                <span style="word-break:break-all;color:#1a1a1a;">${ctaHrefPlainText}</span>
              </p>
            </td>
          </tr>`;
}

/**
 * Partner-Passwort zurücksetzen – gleiche Markenoptik wie Kontakt-/Intern-Mails (serverseitig versandter Link).
 */
export function buildBrandedPartnerPasswordResetEmailHtml(actionUrlHttps: string): string {
  const u = actionUrlHttps.trim();
  if (!/^https:\/\//i.test(u)) {
    throw new Error("[branded-html] Passwort-Reset-Link muss mit https:// beginnen.");
  }
  const safe = escapeHtml(u);
  return brandedEmailShell({
    kindBadge: "Partner",
    headline: "Passwort zurücksetzen",
    bodyRowsHtml: buildPartnerPasswordResetEmailBodyRows(safe, safe),
  });
}

/**
 * HTML für Supabase Dashboard → Authentication → E-Mail-Vorlagen → „Passwort zurücksetzen“.
 * Platzhalter `{{ .ConfirmationURL }}` wird von Supabase ersetzt (nicht escapen).
 * Vorgefertigte Datei (regenerierbar): `supabase/email-templates/password-recovery-markenlayout.html`.
 */
export function buildSupabaseDashboardPasswordRecoveryHtml(): string {
  const ph = "{{ .ConfirmationURL }}";
  return brandedEmailShell({
    kindBadge: "Partner",
    headline: "Passwort zurücksetzen",
    bodyRowsHtml: buildPartnerPasswordResetEmailBodyRows(ph, ph),
  });
}

export function partnerPasswordResetOutboundSubject(): string {
  return `Passwort zurücksetzen – ${siteConfig.name}`;
}

/**
 * Responsives, tabellenbasiertes HTML im Erscheinungsbild der Website.
 */
export function buildBrandedNotificationHtml(options: {
  /** Kurz für farbiges Badge, z. B. „Kontakt“, „Pflegebox“. */
  kindBadge: string;
  /** Hauptüberschrift im Header. */
  headline: string;
  /** Key-Value-Zeilen (Name, E-Mail, …). */
  rows: EmailDetailRow[];
  /** Optional: längerer Fließtext / mehrzeilig (Nachricht, Konfigurator-Zusammenfassung). */
  detailTitle?: string;
  detailText?: string;
}): string {
  const { kindBadge, headline, rows, detailTitle, detailText } = options;

  const rowHtml = rows
    .map(
      (r) => `
          <tr>
            <td style="padding:14px 20px;border-bottom:1px solid ${C.border};vertical-align:top;">
              <p style="margin:0 0 4px 0;font-family:${FONT};font-size:13px;font-weight:700;color:${C.rowLabel};letter-spacing:0.02em;text-transform:uppercase;">
                ${escapeHtml(r.label)}
              </p>
              <p style="margin:0;font-family:${FONT};font-size:16px;line-height:1.5;color:#1a1a1a;">
                ${nl2brEscaped(r.value)}
              </p>
            </td>
          </tr>`,
    )
    .join("");

  const detailSection =
    detailText && detailText.trim().length > 0
      ? `
        <tr>
          <td style="padding:20px 20px 24px 20px;">
            ${
              detailTitle
                ? `<p style="margin:0 0 10px 0;font-family:${FONT};font-size:13px;font-weight:700;color:${C.rowLabel};letter-spacing:0.02em;text-transform:uppercase;">${escapeHtml(detailTitle)}</p>`
                : ""
            }
            <div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#1a1a1a;background:#F8FBFC;border-radius:12px;border:1px solid ${C.border};padding:16px 18px;">
              ${nl2brEscaped(detailText.trim())}
            </div>
          </td>
        </tr>`
      : "";

  return brandedEmailShell({
    kindBadge,
    headline,
    bodyRowsHtml: `${rowHtml}${detailSection}`,
  });
}

function nl2EmailLines(s: string): string {
  return escapeHtml(s).replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");
}

/** Attribut-Inhalt für Links (href, sehr eingeschränkt). */
export function escapeEmailHrefAttr(urlOrMailto: string): string {
  return urlOrMailto.trim().replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export type PartnerRegistrationWelcomeInputs = {
  vorname: string;
  nachname: string;
  partnerEmail: string;
  einmalpasswort: string;
  loginUrl: string;
  kontaktinformationen: string;
  tel: string;
  teamEmail: string;
  websiteLabel: string;
  websiteHref: string;
};

export function partnerRegistrationWelcomeSubject(): string {
  return `Ihre Registrierung als Kooperationspartner bei ${siteConfig.name}`;
}

/**
 * Partner-Registrierungsbestätigung (Admin-Anlage) — gleicher Rahmen wie Passwort-Reset.
 */
export function buildBrandedPartnerRegistrationWelcomeHtml(inp: PartnerRegistrationWelcomeInputs): string {
  const kindBadge = "Partner";
  const headline = "Willkommen im Partnerbereich";

  const paragraphs = (
    blocks: string[],
  ) =>
    blocks
      .map(
        (t) =>
          `<p style="margin:0 0 14px 0;font-family:${FONT};font-size:16px;line-height:1.55;color:#1a1a1a;">${nl2EmailLines(t)}</p>`,
      )
      .join("");

  const intro = paragraphs([
    `Guten Tag ${inp.vorname} ${inp.nachname},`,
    "vielen Dank für Ihre Registrierung als Kooperationspartner bei uns. Wir freuen uns über Ihr Interesse an einer gemeinsamen Zusammenarbeit.",
    "Über Ihr Partner-Dashboard sehen Sie künftig vermittelte Vorgänge übersichtlich, verfolgen den Bearbeitungsstand und können Informationen zu Ihren Provisionen einsehen. Zu Beginn führt Sie ein kurzes Tutorial durch die wichtigsten Funktionen.",
  ]);

  const loginTrim = inp.loginUrl.trim();
  const loginHref = escapeEmailHrefAttr(loginTrim);
  const loginVisible = escapeHtml(loginTrim);

  const websiteHref = escapeEmailHrefAttr(inp.websiteHref.trim());
  const websiteLabel = escapeHtml(inp.websiteLabel.trim());
  const mailtoHref = escapeEmailHrefAttr(`mailto:${inp.teamEmail.trim()}`);

  const ctaBlock = `
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px 0;">
            <tr>
              <td style="border-radius:14px;background:${C.primary};">
                <a href="${loginHref}" style="display:inline-block;font-family:${FONT};font-size:16px;font-weight:700;line-height:1.2;color:#ffffff;text-decoration:none;padding:16px 28px;border-radius:14px;background:${C.primary};border:1px solid ${C.primaryDark};">
                  Zum Partner-Login
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 18px 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${C.muted};">
            Direkt-Link (falls der Button nicht klickbar ist):<br/>
            <span style="word-break:break-all;color:#1a1a1a;">${loginVisible}</span>
          </p>`;

  const credentialsCard = `
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:12px 0 18px 0;background:#FFF9F6;border-radius:14px;border:1px solid ${C.border};overflow:hidden;">
            <tr>
              <td style="padding:14px 16px;background:linear-gradient(135deg,rgba(247,143,46,0.12) 0%,rgba(15,79,104,0.06) 100%);border-bottom:1px solid ${C.border};">
                <p style="margin:0;font-family:${FONT};font-size:13px;font-weight:800;color:${C.primary};letter-spacing:0.04em;text-transform:uppercase;">
                  Ihre Zugangsdaten
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 16px 16px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:${FONT};font-size:15px;line-height:1.5;color:#1a1a1a;">
                  <tr>
                    <td style="padding:6px 0 8px 0;color:${C.muted};font-size:13px;font-weight:700;width:170px;vertical-align:top;">Benutzername / E-Mail</td>
                    <td style="padding:6px 0 8px 0;"><strong>${escapeHtml(inp.partnerEmail)}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0 0 0;color:${C.muted};font-size:13px;font-weight:700;width:170px;vertical-align:top;">Einmalpasswort</td>
                    <td style="padding:6px 0 0 0;">
                      <code style="display:inline-block;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:14px;font-weight:700;color:${C.primary};background:#ffffff;border-radius:8px;padding:10px 12px;border:1px solid ${C.border};">${escapeHtml(inp.einmalpasswort)}</code>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`;

  const followUp = paragraphs([
    "Bitte melden Sie sich zuerst mit dem Einmalpasswort an — beim ersten Login können Sie es in ein persönliches Passwort ändern.",
    "Bei Fragen zur Anmeldung oder zum Dashboard erreichen Sie uns unter den angegebenen Kontaktdaten.",
    "Wir freuen uns auf eine erfolgreiche Zusammenarbeit.",
  ]);

  const kontaktBlock = `
          <hr style="border:none;border-top:1px solid ${C.border};margin:22px 0 14px 0;">
          <p style="margin:0 0 8px 0;font-family:${FONT};font-size:13px;line-height:1.45;color:${C.muted};text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">
            Kontakt
          </p>
          <div style="font-family:${FONT};font-size:14px;line-height:1.55;color:#455055;">
            ${nl2EmailLines(inp.kontaktinformationen)}<br/><br/>
            Tel.: ${escapeHtml(inp.tel)}<br/>
            E-Mail: <a href="${mailtoHref}" style="color:${C.primary};font-weight:600;">${escapeHtml(inp.teamEmail)}</a><br/>
            Website: <a href="${websiteHref}" style="color:${C.primary};font-weight:600;">${websiteLabel}</a>
          </div>`;

  const signature = `
          <p style="margin:20px 0 0 0;font-family:${FONT};font-size:16px;line-height:1.5;color:#1a1a1a;">
            Mit freundlichen Grüßen<br/><strong style="color:${C.primary};">Ihr Team von ${escapeHtml(siteConfig.name)}</strong>
          </p>`;

  const bodyRowsHtml = `
          <tr>
            <td style="padding:22px 20px 8px 20px;">
              ${intro}
              ${ctaBlock}
              ${credentialsCard}
              ${followUp}
              ${signature}
              ${kontaktBlock}
            </td>
          </tr>`;

  return brandedEmailShell({
    kindBadge,
    headline,
    bodyRowsHtml,
  });
}
