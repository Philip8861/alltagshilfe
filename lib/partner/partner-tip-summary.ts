/** Kurztext für Admin-Liste aus Tipp-Payload. */
export function partnerTipPayloadSummary(payload: Record<string, unknown>, serviceSlug: string): string {
  const vn = typeof payload.vorname === "string" ? payload.vorname.trim() : "";
  const nn = typeof payload.nachname === "string" ? payload.nachname.trim() : "";
  const namePair = [vn, nn].filter(Boolean).join(" ");
  const ap = typeof payload.ansprechpartner === "string" ? payload.ansprechpartner.trim() : "";
  const displayName = namePair || ap;
  if (serviceSlug === "betriebliche_pflegeberatung") {
    const fn = typeof payload.firmenname === "string" ? payload.firmenname.trim() : "";
    const em = typeof payload.email === "string" ? payload.email.trim() : "";
    return [displayName, fn, em].filter(Boolean).join(" · ") || "—";
  }
  const wo = typeof payload.wohnort === "string" ? payload.wohnort.trim() : "";
  const em = typeof payload.email === "string" ? payload.email.trim() : "";
  return [displayName, wo, em].filter(Boolean).join(" · ") || "—";
}
