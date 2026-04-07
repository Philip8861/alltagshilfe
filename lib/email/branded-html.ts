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
  const brand = escapeHtml(siteConfig.name);
  const year = new Date().getFullYear();

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
          ${rowHtml}
          ${detailSection}
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
