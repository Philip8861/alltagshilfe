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

/**
 * Indeed: URL zu euren offenen Stellen (Firmenseite oder Suche).
 * In .env: NEXT_PUBLIC_INDEED_JOBS_URL=https://de.indeed.com/cmp/Alltagshilfe-Süd/jobs
 * oder Suche: https://de.indeed.com/jobs?q=Alltagshilfe+Süd
 */
function getIndeedJobsUrl(): string {
  try {
    const raw = process.env.NEXT_PUBLIC_INDEED_JOBS_URL;
    if (typeof raw === "string" && raw.trim().startsWith("http")) return raw.trim();
    return "https://de.indeed.com/jobs?q=Alltagshilfe+S%C3%BCd";
  } catch {
    return "https://de.indeed.com/jobs?q=Alltagshilfe+S%C3%BCd";
  }
}

export const siteConfig = {
  name: "Alltagshilfe-Süd",
  description: "Alltagshilfe-Süd ihr liebevoller Haushalts & Betreuungsdienst vor Ort.",
  baseUrl,
  locale: "de",
  /** Link zu den Stellen bei Indeed (optional). */
  indeedJobsUrl: getIndeedJobsUrl(),
} as const;
