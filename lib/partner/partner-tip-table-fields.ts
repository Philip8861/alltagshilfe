/**
 * Tabellen-Spalten für Partner-Dashboard (Tipp-Payload je nach Leistung).
 */
export function tipTableFields(
  payload: Record<string, unknown>,
  serviceSlug: string,
): { firma: string; vorname: string; nachname: string } {
  const firma =
    serviceSlug === "betriebliche_pflegeberatung"
      ? String(typeof payload.firmenname === "string" ? payload.firmenname.trim() : "")
      : "";
  const ap = typeof payload.ansprechpartner === "string" ? payload.ansprechpartner.trim() : "";
  const parts = ap.split(/\s+/).filter(Boolean);
  const vorname = parts[0] ?? "";
  const nachname = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return {
    firma: firma || "—",
    vorname: vorname || "—",
    nachname: nachname || "—",
  };
}
