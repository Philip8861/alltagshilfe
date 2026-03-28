import { NextResponse } from "next/server";
import { ensurePartnerProfileForCurrentSession } from "@/lib/partner/ensure-partner-profile";

/**
 * Voller Browser-GET mit Session-Cookies: Profil nachziehen und zum Dashboard weiterleiten.
 * Zuverlässiger als Server Actions aus useEffect (Vercel/ Cookies).
 */
export async function GET(request: Request) {
  const r = await ensurePartnerProfileForCurrentSession();
  const origin = new URL(request.url).origin;

  if (r.ok) {
    return NextResponse.redirect(new URL("/partner/dashboard", origin));
  }

  return NextResponse.redirect(
    new URL(`/partner/login?reason=no_profile&ensure_failed=1`, origin),
  );
}
