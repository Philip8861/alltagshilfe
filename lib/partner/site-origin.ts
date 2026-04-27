import { siteConfig } from "@/config/site";

/**
 * Basis-URL für Auth-Redirects (E-Mail-Bestätigung). Hosting-portabel über NEXT_PUBLIC_SITE_URL.
 */
export function getPublicSiteBaseUrl(requestOrigin?: string): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (env.startsWith("http")) return env;
  if (requestOrigin?.startsWith("http")) return requestOrigin.replace(/\/$/, "");
  return "";
}

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local")
  );
}

/**
 * Kanonische öffentliche URL für Supabase `redirectTo` (Passwort-Reset, E-Mail-Bestätigung).
 * - Optional `AUTH_REDIRECT_BASE_URL` (nur Server): erzwingt die Live-Domain unabhängig vom Request.
 * - Auf Vercel: wenn `NEXT_PUBLIC_SITE_URL` noch auf localhost zeigt, wird stattdessen die Request-URL
 *   bzw. `VERCEL_URL` genutzt — sonst führen E-Mail-Links zu „Website nicht erreichbar“.
 */
export function getAuthRedirectSiteBaseUrl(requestOrigin?: string): string | null {
  const override = process.env.AUTH_REDIRECT_BASE_URL?.trim().replace(/\/$/, "") ?? "";
  if (override.startsWith("http")) {
    try {
      if (!isLocalHostname(new URL(override).hostname)) return override;
    } catch {
      /* ungültig → weiter mit anderen Quellen */
    }
  }

  const envRaw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  const envUrl = envRaw.startsWith("http") ? envRaw : "";
  const reqRaw = requestOrigin?.trim().replace(/\/$/, "") ?? "";
  const reqUrl = reqRaw.startsWith("http") ? reqRaw : "";

  let vercelUrl = "";
  if (process.env.VERCEL === "1") {
    const vu = process.env.VERCEL_URL?.trim() ?? "";
    if (vu) {
      const host = vu.replace(/^https?:\/\//i, "").replace(/\/$/, "");
      if (host) vercelUrl = `https://${host}`;
    }
  }

  /** Build-Zeit-Basis (NEXT_PUBLIC_SITE_URL bzw. https://$VERCEL_URL) — stabil bei Server Actions ohne sinnvolle Headers. */
  const siteBaked = siteConfig.baseUrl?.startsWith("http") ? siteConfig.baseUrl.replace(/\/$/, "") : "";

  const pickNonLocal = (u: string): string | null => {
    if (!u.startsWith("http")) return null;
    try {
      if (!isLocalHostname(new URL(u).hostname)) return u;
    } catch {
      return null;
    }
    return null;
  };

  for (const c of [pickNonLocal(envUrl), pickNonLocal(reqUrl), pickNonLocal(siteBaked), pickNonLocal(vercelUrl)]) {
    if (c) return c;
  }

  if (envUrl.startsWith("http")) return envUrl;
  if (reqUrl.startsWith("http")) return reqUrl;
  return null;
}
