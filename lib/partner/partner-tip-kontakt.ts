/** E-Mail aus Tipp-Payload für Spalte „Kontakt“. */
export function tipPayloadKontaktEmail(payload: Record<string, unknown>): string {
  const em = typeof payload.email === "string" ? payload.email.trim() : "";
  return em || "—";
}
