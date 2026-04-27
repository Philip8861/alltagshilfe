/** Relativer Pfad nach Auth-Redirect; verhindert offene Weiterleitungen. */
export function safeAuthNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/partner/dashboard";
  return raw;
}
