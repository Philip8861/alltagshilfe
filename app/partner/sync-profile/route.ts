import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ensurePartnerProfileWithUserClient } from "@/lib/partner/ensure-partner-profile";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/** Läuft nur in der Node.js-Runtime (nicht Edge); Route Handler werden nie im Browser ausgeführt. */
export const runtime = "nodejs";

export const dynamic = "force-dynamic";

/**
 * GET /partner/sync-profile — ausschließlich Server-Runtime-Flow
 *
 * 1) Ausführung: App-Router-Route Handler + `runtime = "nodejs"` → garantiert Server (kein Client-Bundle).
 * 2) Admin-Schreiben: `createSupabaseServiceRoleClient()` nutzt `SUPABASE_SERVICE_ROLE_KEY` (separater Client).
 * 3) Session: `createServerClient(anonKey, cookies)` nur für `getUser()` und RLS-SELECTs — nicht für Inserts.
 * 4) Logs: `lib/partner/sync-profile-runtime-log.ts` (JSON, keine Secrets; User-UUID nur Suffix).
 * 5) RLS/Policies: siehe JSDoc in `lib/partner/ensure-partner-profile.ts` und `supabase/migrations/001_partner_portal.sql`.
 * 6) `partner_profiles.id` = `auth.users.id` (JWT `sub` aus `getUser()`).
 * 7) Fehlender Service-Role-Key auf Vercel: Nutzerhinweis + Log-Hinweis auf Redeploy nach Env-Änderung.
 * 8) Idempotenz: Upsert mit `ignoreDuplicates` ≡ `ON CONFLICT (id) DO NOTHING` (siehe ensure-Modul).
 *
 * Request-Cookies lesen und Set-Cookie auf die Redirect-Response legen (Refresh-Cookies).
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
    else if (m.includes("nicht angelegt") || m.includes("profil konnte") || m.includes("upsert")) code = "insert_failed";
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
