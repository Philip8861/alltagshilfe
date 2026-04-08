/**
 * Kanonische URL der eingebetteten Pflegebox-Konfigurator-Seite.
 * (Historisch auch `/pflegebox` – Redirect in `app/pflegebox/page.tsx`.)
 */
export const PFLEGEBOX_KONFIGURATOR_PAGE = "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel";

export function isPflegeboxKonfiguratorPagePath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/pflegebox" || pathname.startsWith("/pflegebox/")) return true;
  if (pathname === PFLEGEBOX_KONFIGURATOR_PAGE || pathname.startsWith(`${PFLEGEBOX_KONFIGURATOR_PAGE}/`)) {
    return true;
  }
  return false;
}
