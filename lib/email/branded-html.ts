import { siteConfig } from "@/config/site";

/** Markenfarben (wie auf der Website) – nur Inline-Styles für E-Mail-Clients. */
const C = {
  primary: "#0F4F68",
  primaryDark: "#0c3d52",
  /** Markenfarbe Orange (Buttons, Akzente) – Border etwas dunkler für E-Mail-Kontrast. */
  accent: "#F78F2E",
  accentDark: "#c86a1a",
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
  /**
   * Kompakterer Header + weniger Abstand zur ersten Textzeile (z. B. Partner-Willkommensmail).
   */
  tighterHeaderSpacing?: boolean;
  /** Absolute URL zum Logo: weiße Leiste über dem farbigen Kopf. */
  logoUrl?: string;
  /** Vorschautext (Posteingang) – Standard: Headline. */
  preheader?: string;
  /** Eigener Fußzeilentext (HTML erlaubt, bereits escaped); Standard: automatischer Hinweis. */
  footerHtml?: string;
}): string {
  const { kindBadge, headline, bodyRowsHtml, tighterHeaderSpacing, logoUrl, preheader, footerHtml } = options;
  const brand = escapeHtml(siteConfig.name);
  const year = new Date().getFullYear();
  const logoRow = logoUrl
    ? `
          <tr>
            <td align="center" style="padding:18px 24px 14px 24px;background:#ffffff;">
              <img src="${escapeEmailHrefAttr(logoUrl)}" width="160" height="37" alt="${brand}" style="display:block;width:160px;height:auto;border:0;outline:none;text-decoration:none;">
            </td>
          </tr>`
    : "";
  const tight = Boolean(tighterHeaderSpacing);
  const badgeMb = tight ? "4px" : "12px";
  const headerPad = tight ? "16px 24px 8px 24px" : "24px 24px 22px 24px";
  const subTitleMt = tight ? "4px" : "10px";
  const headlineFontSize = tight ? "18px" : "22px";
  const headlineLineHeight = tight ? "1.2" : "1.25";
  /** Ohne zusätzliche <h1>-Abstände in Outlook/Gmail — Zeilen über Tabellenzeilen abstützen */
  const headerInnerTd =
    tight
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 0 4px 0;vertical-align:top;">
                    <span style="display:inline-block;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.92);background:rgba(255,255,255,0.12);padding:5px 11px;border-radius:999px;">
                      ${escapeHtml(kindBadge)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 2px 0;vertical-align:top;">
                    <div style="margin:0;padding:0;font-family:${FONT};font-size:${headlineFontSize};line-height:${headlineLineHeight};font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                      ${escapeHtml(headline)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0;vertical-align:top;">
                    <div style="margin:${subTitleMt} 0 0 0;padding:0;font-family:${FONT};font-size:13px;line-height:1.4;color:rgba(255,255,255,0.92);">
                      ${brand}
                    </div>
                  </td>
                </tr>
              </table>`
      : `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display:inline-block;font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.92);background:rgba(255,255,255,0.12);padding:6px 12px;border-radius:999px;margin-bottom:${badgeMb};">
                      ${escapeHtml(kindBadge)}
                    </span>
                    <h1 style="margin:0;font-family:${FONT};font-size:${headlineFontSize};line-height:${headlineLineHeight};font-weight:800;color:#ffffff;letter-spacing:-0.02em;">
                      ${escapeHtml(headline)}
                    </h1>
                    <p style="margin:${subTitleMt} 0 0 0;font-family:${FONT};font-size:14px;line-height:1.45;color:rgba(255,255,255,0.88);">
                      ${brand}
                    </p>
                  </td>
                </tr>
              </table>`;

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
    ${escapeHtml(preheader ?? headline)}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.pageBg};">
    <tr>
      <td align="center" style="padding:28px 16px 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:${C.cardBg};border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(15,79,104,0.12);border:1px solid ${C.border};">${logoRow}
          <tr>
            <td style="background:linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%);padding:${headerPad};border-bottom:4px solid ${C.accent};">
${headerInnerTd}
            </td>
          </tr>
          ${bodyRowsHtml}
          <tr>
            <td style="padding:18px 20px 22px 20px;background:#F2F9FA;border-top:1px solid ${C.border};">
              <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};text-align:center;">
                ${footerHtml ?? `Automatische Nachricht der Website ${brand}, © ${year}`}
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
    "Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail. Ihr Zugang bleibt unverändert.",
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
  return `Passwort zurücksetzen bei ${siteConfig.name}`;
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
  /** Optionaler Call-to-Action-Button unter dem Detailblock. */
  ctaHref?: string;
  ctaLabel?: string;
  /** „accent“ = Orange (Marke), „brand“ = Petrol (Standard). */
  ctaButtonVariant?: "brand" | "accent";
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

  const ctaHrefRaw = options.ctaHref?.trim();
  const ctaLabelRaw = options.ctaLabel?.trim();
  let ctaSection = "";
  if (ctaHrefRaw && ctaLabelRaw) {
    const hrefAttr = escapeEmailHrefAttr(ctaHrefRaw);
    const escLabel = escapeHtml(ctaLabelRaw);
    const variant = options.ctaButtonVariant === "accent" ? "accent" : "brand";
    const ctaBg = variant === "accent" ? C.accent : C.primary;
    const ctaBorder = variant === "accent" ? C.accentDark : C.primaryDark;
    ctaSection = `
        <tr>
          <td style="padding:8px 20px 26px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="border-radius:14px;background:${ctaBg};">
                  <a href="${hrefAttr}" style="display:inline-block;font-family:${FONT};font-size:16px;font-weight:700;line-height:1.2;color:#ffffff;text-decoration:none;padding:16px 28px;border-radius:14px;background:${ctaBg};border:1px solid ${ctaBorder};">
                    ${escLabel}
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:16px 0 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${C.muted};">
              Direktlink (falls der Button nicht funktioniert):<br/>
              <span style="word-break:break-all;color:#1a1a1a;">${escapeHtml(ctaHrefRaw)}</span>
            </p>
          </td>
        </tr>`;
  }

  return brandedEmailShell({
    kindBadge,
    headline,
    bodyRowsHtml: `${rowHtml}${detailSection}${ctaSection}`,
  });
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
  /** Freigeschaltete Leistungsbereiche (Anzeige-Labels), z. B. „Betriebliche Pflegeberatung“. */
  leistungen?: string[];
  /** Absolute Basis-URL der Website für Bilder (Logo, Icons). Ohne Angabe: keine Bilder. */
  assetBaseUrl?: string;
};

export function partnerRegistrationWelcomeSubject(): string {
  return `Ihr Zugang zum Partnerportal von ${siteConfig.name}`;
}

/**
 * Willkommens-Mail nach Partner-Anlage mit Zugangsdaten und ersten Schritten.
 *
 * Passwort steht allein in einem Text-Span ohne umgebende Leerzeichen,
 * damit Markieren/Kopieren keine Leerzeichen mitnimmt.
 */
export function buildBrandedPartnerRegistrationWelcomeHtml(inp: PartnerRegistrationWelcomeInputs): string {
  const name = [inp.vorname.trim(), inp.nachname.trim()].filter(Boolean).join(" ");
  const brand = escapeHtml(siteConfig.name);
  const assetBase = inp.assetBaseUrl?.trim().replace(/\/$/, "");
  const logo = assetBase && /^https:\/\//.test(assetBase)
    ? `<img src="${escapeEmailHrefAttr(`${assetBase}/images/site/logo.png`)}" width="168" alt="${brand}" style="display:block;width:168px;max-width:100%;height:auto;border:0;">`
    : `<span style="font-size:19px;font-weight:700;color:#0F4F68;">${brand}</span>`;
  /* Kopier-Symbol neben dem Passwort (eigene Tabellenzelle, damit es beim Markieren nicht mitkopiert wird). */
  const copyIcon = assetBase && /^https:\/\//.test(assetBase)
    ? `<td width="34" valign="middle" style="padding:0 0 0 12px;"><img src="${escapeEmailHrefAttr(`${assetBase}/images/email/kopieren.png`)}" width="22" height="22" alt="Kopieren" title="Passwort markieren und kopieren" style="display:block;width:22px;height:22px;border:0;"></td>`
    : "";
  const loginHref = escapeEmailHrefAttr(inp.loginUrl);
  const loginVisible = escapeHtml(inp.loginUrl.trim().replace(/^https?:\/\//, ""));
  const services = (inp.leistungen ?? []).map((s) => s.trim()).filter(Boolean);
  const teamEmail = inp.teamEmail.trim();
  const phoneHref = escapeEmailHrefAttr(`tel:${inp.tel.replace(/[^+\d]/g, "")}`);
  const footer = inp.kontaktinformationen.split(/\r?\n/).map((line) => escapeHtml(line.trim())).filter(Boolean).join("<br>");

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>Ihr Zugang zum Partnerportal</title></head>
<body style="margin:0;padding:0;background:#f2f5f7;font-family:${FONT};-webkit-text-size-adjust:100%;color:#183a49;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Ihr Partnerzugang ist bereit. Hier finden Sie Ihre Zugangsdaten und die ersten Schritte.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f5f7;">
    <tr><td align="center" style="padding:32px 12px;">
      <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dfe7ec;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:26px 28px;border-bottom:1px solid #e7edf0;">${logo}</td></tr>
        <tr><td bgcolor="#eaf5f8" style="background:#eaf5f8;padding:28px;border-bottom:3px solid #f7c38f;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#5a7c89;">Ihr Partnerportal</p>
          <h1 style="margin:0;font-size:29px;line-height:1.25;font-weight:700;letter-spacing:-0.5px;color:#0F4F68;">Willkommen an Bord.</h1>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#547480;">Gemeinsam mehr möglich machen.</p>
        </td></tr>
        <tr><td style="padding:28px 28px 0;">
          <p style="margin:0 0 12px;font-size:15px;line-height:1.65;">${escapeHtml(name ? `Guten Tag ${name},` : "Guten Tag,")}</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#526b77;">Ihr Partnerzugang ist eingerichtet. Verfolgen Sie Ihre Vermittlungen, sehen Sie Abschlüsse ein und behalten Sie Ihre Provisionen im Blick.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;background:#eff7fa;border:1px solid #dfe7ec;border-radius:12px;">
            <tr><td style="padding:20px 20px 4px;font-size:15px;font-weight:700;color:#183a49;">Ihre persönlichen Zugangsdaten</td></tr>
            <tr><td style="padding:16px 20px 5px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#637b87;">E-Mail / Anmeldename</td></tr>
            <tr><td style="padding:0 20px;font-size:15px;line-height:1.5;font-weight:600;overflow-wrap:anywhere;word-break:break-all;">${escapeHtml(inp.partnerEmail.trim())}</td></tr>
            <tr><td style="padding:18px 20px 6px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#637b87;">Startpasswort</td></tr>
            <tr><td style="padding:0 20px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="padding:0;font-family:Consolas,'Courier New',monospace;font-size:20px;line-height:1.5;font-weight:700;color:#0F4F68;overflow-wrap:anywhere;word-break:break-all;">${escapeHtml(inp.einmalpasswort.trim())}</td>${copyIcon}
              </tr></table>
            </td></tr>
          </table>
          ${services.length ? `<p style="margin:14px 0 0;font-size:12px;line-height:1.65;color:#637b87;"><strong style="color:#315363;">Freigeschaltet:</strong> ${escapeHtml(services.join(" · "))}</p>` : ""}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 12px;"><tr><td align="center" bgcolor="#0F4F68" style="border-radius:8px;background:#0F4F68;mso-padding-alt:16px 24px;">
            <a href="${loginHref}" style="display:block;padding:16px 24px;font-size:15px;line-height:1.4;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;border-radius:8px;">Partnerportal öffnen &nbsp; →</a>
          </td></tr></table>
          <p style="margin:0 0 26px;font-size:11px;line-height:1.6;color:#6b818c;">Alternativ im Browser öffnen:<br><a href="${loginHref}" style="color:#0F4F68;word-break:break-all;">${loginVisible}</a></p>
        </td></tr>
        <tr><td style="padding:0 28px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e5ecef;">
            <tr><td colspan="2" style="padding:22px 0 14px;font-size:15px;font-weight:700;">In drei Schritten startklar</td></tr>
            <tr><td width="30" valign="top" style="padding:5px 0;font-size:13px;font-weight:700;color:#0F4F68;">01</td><td style="padding:5px 0;font-size:13px;line-height:1.6;color:#526b77;">Mit E-Mail und Startpasswort anmelden.</td></tr>
            <tr><td width="30" valign="top" style="padding:5px 0;font-size:13px;font-weight:700;color:#0F4F68;">02</td><td style="padding:5px 0;font-size:13px;line-height:1.6;color:#526b77;">Beim ersten Login ein persönliches Passwort festlegen.</td></tr>
            <tr><td width="30" valign="top" style="padding:5px 0;font-size:13px;font-weight:700;color:#0F4F68;">03</td><td style="padding:5px 0;font-size:13px;line-height:1.6;color:#526b77;">Das Portal kennenlernen und den ersten Tipp abgeben.</td></tr>
          </table>
          <p style="margin:20px 0 0;padding:12px 14px;border-left:3px solid #eab17a;background:#fcf8f2;font-size:12px;line-height:1.6;color:#725a3b;">Bitte behandeln Sie Ihre Zugangsdaten vertraulich und geben Sie diese nicht weiter.</p>
        </td></tr>
        <tr><td bgcolor="#f5f8fa" style="padding:24px 28px;background:#f5f8fa;border-top:1px solid #e5ecef;">
          <p style="margin:0 0 7px;font-size:14px;font-weight:700;">Wir sind für Sie da.</p>
          <p style="margin:0;font-size:13px;line-height:1.8;color:#526b77;">Bei Fragen zu Ihrem Zugang erreichen Sie uns unter<br><a href="${phoneHref}" style="color:#0F4F68;text-decoration:none;">${escapeHtml(inp.tel.trim())}</a> oder <a href="${escapeEmailHrefAttr(`mailto:${teamEmail}`)}" style="color:#0F4F68;word-break:break-word;">${escapeHtml(teamEmail)}</a>.</p>
          <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#315363;">Auf eine gute Zusammenarbeit!<br><strong>Ihr Team von ${brand}</strong></p>
        </td></tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
      <p style="max-width:550px;margin:20px auto 0;font-size:11px;line-height:1.8;color:#6b818c;text-align:center;">${footer}<br><a href="${escapeEmailHrefAttr(inp.websiteHref)}" style="color:#526b77;text-decoration:none;">${escapeHtml(inp.websiteLabel.trim().replace(/^https?:\/\//, ""))}</a></p>
    </td></tr>
  </table>
</body></html>`;
}
