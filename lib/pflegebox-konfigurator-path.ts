/** Eigenständige Konfigurator-Seite (nicht mehr nur unter /pflegebox). */
export const PFLEGEBOX_KONFIGURATOR_PAGE = "/pflegehilfsmittel/pflegebox-konfigurator";

export function isPflegeboxKonfiguratorPagePath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === PFLEGEBOX_KONFIGURATOR_PAGE || pathname.startsWith(`${PFLEGEBOX_KONFIGURATOR_PAGE}/`)) {
    return true;
  }
  /* Legacy-URL bis Umleitung greift */
  if (pathname === "/pflegebox" || pathname.startsWith("/pflegebox/")) {
    return true;
  }
  return false;
}
