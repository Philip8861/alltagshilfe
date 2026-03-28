import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ensurePartnerProfileWithUserClient } from "@/lib/partner/ensure-partner-profile";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/**
 * Route Handler: Request-Cookies lesen und Set-Cookie auf die Redirect-Response legen.
 * Wichtig: In Handlern darf man nicht nur cookies() aus next/headers nutzen — sonst gehen
 * Session-Refresh-Cookies verloren und getUser() sieht „nicht angemeldet“.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const cfg = getSupabasePublicConfig();
  if (!cfg) {
    return NextResponse.redirect(new URL("/partner/login", origin));
  }

  const cookieBag = new Map<string, { value: string; options: CookieOptions }>();

  const supabase = createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieBag.set(name, { value, options });
        });
      },
    },
  });

  const r = await ensurePartnerProfileWithUserClient(supabase);

  const target = r.ok
    ? new URL("/partner/dashboard", origin)
    : new URL("/partner/login?reason=no_profile&ensure_failed=1", origin);

  const res = NextResponse.redirect(target);
  cookieBag.forEach(({ value, options }, name) => {
    res.cookies.set(name, value, options);
  });

  return res;
}
