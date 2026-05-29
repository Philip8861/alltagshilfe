/** Europe/Berlin für Abrechnungsmonat und Auszahlungshinweis. */
const BERLIN_TZ = "Europe/Berlin";

export function getBerlinCalendarParts(now = new Date()): { year: number; month: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: BERLIN_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);
  return { year, month, day };
}

export function getBerlinCalendarDay(now = new Date()): number {
  return getBerlinCalendarParts(now).day;
}

/** Vorheriger Kalendermonat als YYYY-MM (Europe/Berlin). */
export function previousMonthPeriodKeyBerlin(now = new Date()): string {
  const { year, month } = getBerlinCalendarParts(now);
  if (month === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(month - 1).padStart(2, "0")}`;
}

/** Aktueller Kalendermonat als YYYY-MM (Europe/Berlin). */
export function currentBerlinPeriodKey(now = new Date()): string {
  const { year, month } = getBerlinCalendarParts(now);
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** Nächster Auszahlungstermin: immer am 3. eines Monats (Europe/Berlin). */
export function nextPayoutDateInfo(now = new Date()): { labelDe: string; isoDate: string } {
  const { year, month, day } = getBerlinCalendarParts(now);
  let ny = year;
  let nm = month;
  if (day >= 3) {
    nm = month + 1;
    if (nm > 12) {
      nm = 1;
      ny += 1;
    }
  }
  const isoDate = `${ny}-${String(nm).padStart(2, "0")}-03`;
  const noonUtc = new Date(Date.UTC(ny, nm - 1, 3, 12, 0, 0));
  const labelDe = noonUtc.toLocaleDateString("de-DE", {
    timeZone: BERLIN_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return { labelDe, isoDate };
}

/** Anzeige z. B. „Februar 2026“ für period_key YYYY-MM. */
export function formatPayoutPeriodLabelDe(periodKey: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(periodKey.trim());
  if (!m) return periodKey;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (!Number.isFinite(y) || mo < 1 || mo > 12) return periodKey;
  const d = new Date(Date.UTC(y, mo - 1, 1, 12, 0, 0));
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric", timeZone: "UTC" });
}
