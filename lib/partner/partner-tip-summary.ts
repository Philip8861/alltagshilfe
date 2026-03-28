/** Kurztext für Admin-Liste aus Tipp-Payload. */
export function partnerTipPayloadSummary(payload: Record<string, unknown>, serviceSlug: string): string {
  const ap = typeof payload.ansprechpartner === "string" ? payload.ansprechpartner.trim() : "";
  if (serviceSlug === "betriebliche_pflegeberatung") {
    const fn = typeof payload.firmenname === "string" ? payload.firmenname.trim() : "";
    const em = typeof payload.email === "string" ? payload.email.trim() : "";
    return [ap, fn, em].filter(Boolean).join(" · ") || "—";
  }
  const wo = typeof payload.wohnort === "string" ? payload.wohnort.trim() : "";
  const em = typeof payload.email === "string" ? payload.email.trim() : "";
  return [ap, wo, em].filter(Boolean).join(" · ") || "—";
}
