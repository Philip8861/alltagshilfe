/** Eingebettete Pflegebox-Konfigurator-Seite (nur Iframe, keine Infoseite). */
export const PFLEGEBOX_KONFIGURATOR_PAGE = "/pflegebox";

export function isPflegeboxKonfiguratorPagePath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === "/pflegebox" || pathname.startsWith("/pflegebox/");
}
