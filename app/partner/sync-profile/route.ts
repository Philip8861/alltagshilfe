import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ensurePartnerProfileWithUserClient } from "@/lib/partner/ensure-partner-profile";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const runtime = "nodejs";

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

  if (!r.ok) {
    let code = "unknown";
    const m = r.message.toLowerCase();
    if (m.includes("nicht angemeldet")) code = "no_session";
    else if (m.includes("service_role") || m.includes("service role")) code = "no_service_role";
    else if (m.includes("nicht bestätigt")) code = "verify_failed";
    else if (m.includes("nicht angelegt") || m.includes("profil konnte")) code = "insert_failed";
    else if (m.includes("nicht lesbar") || m.includes("row level security") || m.includes("rls/api"))
      code = "not_readable";
    target.searchParams.set("sync_reason", code);
  }

  const res = NextResponse.redirect(target);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  cookieBag.forEach(({ value, options }, name) => {
    res.cookies.set(name, value, options);
  });

  return res;
}
