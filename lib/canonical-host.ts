const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

/** Hostname ohne `www.` aus `NEXT_PUBLIC_SITE_URL` (Production). Lokal: `null`. */
export function getCanonicalSiteHostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.toLowerCase();
    if (LOCAL_HOSTS.has(host)) return null;
    return host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Wenn Request über `www.` kommt → Apex-Host für 301-Redirect (Google Search Console).
 * Beispiel: www.alltagshilfe-sued.de/pflegeberatung → alltagshilfe-sued.de/pflegeberatung
 */
export function resolveWwwToApexHostname(requestHost: string): string | null {
  const canonical = getCanonicalSiteHostname();
  if (!canonical) return null;
  const host = requestHost.split(":")[0].toLowerCase();
  if (host === `www.${canonical}`) return canonical;
  return null;
}

/** Basis-URL ohne trailing slash und ohne `www.` (für metadataBase, Sitemap, JSON-LD). */
export function canonicalizePublicSiteUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    u.hostname = u.hostname.replace(/^www\./i, "");
    return u.origin;
  } catch {
    return null;
  }
}
