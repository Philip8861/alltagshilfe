import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/**
 * Session-Cookies für den Partnerbereich aktualisieren (JWT-Refresh).
 * createBase liefert rewrite(next) bzw. next() inkl. i18n — Cookies werden auf die finale Response gesetzt.
 */
export async function applyPartnerSupabaseSession(
  request: NextRequest,
  createBase: () => NextResponse,
): Promise<NextResponse> {
  const cfg = getSupabasePublicConfig();
  if (!cfg) {
    return createBase();
  }

  let response = createBase();

  const supabase = createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = createBase();
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}
