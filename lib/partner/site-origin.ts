/**
 * Basis-URL für Auth-Redirects (E-Mail-Bestätigung). Hosting-portabel über NEXT_PUBLIC_SITE_URL.
 */
export function getPublicSiteBaseUrl(requestOrigin?: string): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (env.startsWith("http")) return env;
  if (requestOrigin?.startsWith("http")) return requestOrigin.replace(/\/$/, "");
  return "";
}
