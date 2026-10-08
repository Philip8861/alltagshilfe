/**
 * Partnerprogramm (Login, Portal, Verwaltung): Die öffentliche Hauptnavigation
 * (Leistungen, Standorte, Kontakt-CTA …) wird dort nicht angezeigt.
 */
export function isPartnerAreaPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === "/partner" ||
    pathname.startsWith("/partner/") ||
    pathname === "/en/partner" ||
    pathname.startsWith("/en/partner/")
  );
}
