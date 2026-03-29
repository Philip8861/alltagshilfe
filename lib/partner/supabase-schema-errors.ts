/** PostgREST / Postgres: fehlende Spalte oder veralteter Schema-Cache */
export function isSupabaseMissingColumnError(err: { code?: string; message?: string } | null | undefined): boolean {
  if (!err?.message) return false;
  const m = err.message.toLowerCase();
  const c = String(err.code ?? "");
  return (
    c === "42703" ||
    c === "PGRST204" ||
    (m.includes("column") && m.includes("does not exist")) ||
    m.includes("could not find") ||
    m.includes("schema cache")
  );
}
