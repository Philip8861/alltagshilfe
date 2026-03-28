/**
 * Partnerportal: Supabase nur aktiv, wenn URL und Anon-Key gesetzt sind.
 * Ohne Konfiguration bleibt die öffentliche Website unverändert nutzbar.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return Boolean(url && key && url.startsWith("http"));
}

export function getSupabasePublicConfig(): { url: string; anonKey: string } | null {
  if (!isSupabaseConfigured()) return null;
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
  };
}
