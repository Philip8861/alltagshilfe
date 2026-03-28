import { getPublicSiteBaseUrl } from "@/lib/partner/site-origin";

/** Vollständige Callback-URL für Supabase signUp (E-Mail-Bestätigung, PKCE). */
export function getAuthCallbackUrl(clientOrigin: string): string {
  const trimmed = clientOrigin.replace(/\/$/, "");
  const base = getPublicSiteBaseUrl(trimmed) || trimmed;
  const q = new URLSearchParams({ next: "/partner/dashboard" });
  return `${base}/auth/callback?${q.toString()}`;
}
