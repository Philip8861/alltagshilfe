/**
 * Relativer Pfad nach Auth-Redirect; verhindert offene Weiterleitungen.
 * `"/"` gilt als ungültig (Supabase kann fälschlich auf die Site-Root weiterleiten).
 */
export function safeAuthNextPath(raw: string | null, fallback = "/partner/dashboard"): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw === "/") return fallback;
  return raw;
}
