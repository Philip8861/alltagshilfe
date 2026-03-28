/** Notiz aus Tipp-Payload (Standard: notiz, Betrieb: notizen). */
export function tipPayloadNotiz(payload: Record<string, unknown>): string {
  const n1 = typeof payload.notiz === "string" ? payload.notiz.trim() : "";
  const n2 = typeof payload.notizen === "string" ? payload.notizen.trim() : "";
  return n1 || n2 || "";
}
