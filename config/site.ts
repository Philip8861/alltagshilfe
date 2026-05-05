const DEFAULT_BASE_URL = "http://localhost:3000";

/**
 * Prüft, ob der String eine parsebare http(s)-URL ist (verhindert Crash in metadataBase: new URL(...)).
 */
function normalizeAbsoluteHttpUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

/**
 * Zentrale Site-Konfiguration.
 * Basis-URL aus Umgebungsvariable für Hosting-Portabilität (Server-Umzug).
 * Immer eine gültige URL – verhindert Internal Server Error durch new URL(...) im Root-Layout.
 * Auf Vercel: wenn NEXT_PUBLIC_SITE_URL fehlt, Fallback über https://$VERCEL_URL (ohne trailing slash).
 */
function getBaseUrl(): string {
  try {
    if (typeof process === "undefined" || !process.env) return DEFAULT_BASE_URL;

    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
    if (typeof fromEnv === "string") {
      const ok = normalizeAbsoluteHttpUrl(fromEnv);
      if (ok) return ok;
    }

    const vercel = process.env.VERCEL_URL;
    if (typeof vercel === "string" && vercel.trim()) {
      const host = vercel.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
      if (host) {
        const ok = normalizeAbsoluteHttpUrl(`https://${host}`);
        if (ok) return ok;
      }
    }

    return DEFAULT_BASE_URL;
  } catch {
    return DEFAULT_BASE_URL;
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

/** Standard-Vorschaubild für Open Graph / Twitter (unter `public/`). */
export const DEFAULT_OG_IMAGE_PATH = "/images/Startseite_header.webp" as const;

export const siteConfig = {
  name: "Alltagshilfe-Süd",
  description: "Liebevolle Pflegeberatung, Haushaltshilfe und Betreuung aus einer Hand",
  baseUrl,
  locale: "de",
  /** Link zu den Stellen bei Indeed (optional). */
  indeedJobsUrl: getIndeedJobsUrl(),
} as const;
