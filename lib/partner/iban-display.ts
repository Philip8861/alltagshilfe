/** Maskierte IBAN für Admin-Ansicht (volle IBAN nicht im Klartext in Tabellen). */
export function maskIban(raw: string | null | undefined): string {
  if (raw == null) return "—";
  const compact = String(raw).replace(/\s+/g, "").toUpperCase();
  if (compact.length < 8) return "—";
  const start = compact.slice(0, 4);
  const end = compact.slice(-4);
  return `${start} … ${end}`;
}
