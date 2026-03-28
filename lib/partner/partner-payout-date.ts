/** Nächster Monatserster (lokale Zeitzone) für Auszahlungshinweis. */
export function nextPayoutDateInfo(): { labelDe: string; isoDate: string } {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return {
    labelDe: d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
    isoDate: `${y}-${m}-${day}`,
  };
}
