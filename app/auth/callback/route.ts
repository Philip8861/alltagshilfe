import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPublicSiteBaseUrl } from "@/lib/partner/site-origin";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/partner/dashboard";
  return raw;
}

/**
 * Nach E-Mail-Bestätigung: Supabase leitet mit ?code= hierher.
 * In Supabase: Authentication → URL Configuration → Redirect URLs diese URL erlauben (inkl. Produktions-Domain).
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = safeNextPath(requestUrl.searchParams.get("next"));
  const cfg = getSupabasePublicConfig();
  const base = getPublicSiteBaseUrl(requestUrl.origin) || requestUrl.origin;

  if (!cfg || !code) {
    return NextResponse.redirect(new URL("/partner/login?error=auth", base).toString());
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* Route Handler: set kann je nach Umgebung fehlschlagen */
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/partner/login?error=auth", base).toString());
  }

  return NextResponse.redirect(new URL(nextPath, base).toString());
}
