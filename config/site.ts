/**
 * Zentrale Site-Konfiguration.
 * Basis-URL aus Umgebungsvariable für Hosting-Portabilität (Server-Umzug).
 * Immer eine gültige URL – verhindert Internal Server Error durch new URL("").
 */
function getBaseUrl(): string {
  try {
    if (typeof process === "undefined" || !process.env) return "http://localhost:3000";
    const raw = process.env.NEXT_PUBLIC_SITE_URL;
    if (typeof raw !== "string") return "http://localhost:3000";
    const trimmed = raw.trim();
    if (!trimmed || !trimmed.startsWith("http")) return "http://localhost:3000";
    return trimmed.replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

const baseUrl = getBaseUrl();

export const siteConfig = {
  name: "Alltagshilfe-Süd",
  description: "Alltagshilfe-Süd – modern, sicher, suchmaschinenoptimiert.",
  baseUrl,
  locale: "de",
} as const;
