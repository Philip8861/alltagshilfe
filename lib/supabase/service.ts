import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only: eigener Supabase-Client mit Service-Role-Key (keine Request-Cookies, kein User-JWT).
 * Umgeht RLS für kontrollierte Schreibvorgänge — niemals mit dem Cookie-/Session-Client verwechseln.
 * Niemals im Client oder als NEXT_PUBLIC_* verwenden.
 */
export function createSupabaseServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function resolvePartnerProfileId(
  client: SupabaseClient,
  ref: string | undefined,
): Promise<string | null> {
  const trimmed = (ref ?? "").trim();
  if (!trimmed) return null;
  if (UUID_RE.test(trimmed)) {
    const { data, error } = await client.from("partner_profiles").select("id").eq("id", trimmed).maybeSingle();
    if (error || !data?.id) return null;
    return data.id as string;
  }
  const { data, error } = await client
    .from("partner_profiles")
    .select("id")
    .ilike("partner_referral_code", trimmed)
    .maybeSingle();
  if (error || !data?.id) return null;
  return data.id as string;
}
