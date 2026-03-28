import type { PartnerProfile } from "@/lib/partner/types";

/** Zwei Buchstaben + ein Buchstabe für Sidebar-Avatare (Mock: grün „Ab“, blau „T“). */
export function partnerPortalSidebarInitials(
  profile: PartnerProfile,
  email: string | undefined,
): { green: string; blue: string } {
  const fn = profile.first_name?.trim() ?? "";
  const ln = profile.last_name?.trim() ?? "";
  let green = `${fn.slice(0, 1)}${ln.slice(0, 1)}`.toUpperCase();
  if (green.length < 2) {
    green = (fn.slice(0, 2) || ln.slice(0, 2) || email?.slice(0, 2) || "AH").toUpperCase();
  }
  green = green.slice(0, 2);
  const blue = (fn.slice(0, 1) || ln.slice(0, 1) || email?.slice(0, 1) || "T").toUpperCase();
  return { green, blue: blue.slice(0, 1) };
}
