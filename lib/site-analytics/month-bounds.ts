/** Monatsgrenzen als YYYY-MM-DD (Kalender, für DB-Abfragen; Zeitzone der Auswertung egal bei date-only). */
export function calendarMonthBounds(year: number, month1To12: number): { from: string; to: string } {
  const y = Math.floor(year);
  const m = Math.min(12, Math.max(1, Math.floor(month1To12)));
  const pad = (n: number) => String(n).padStart(2, "0");
  const lastDay = new Date(y, m, 0).getDate();
  return { from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-${pad(lastDay)}` };
}

export function calendarYearBounds(year: number): { from: string; to: string } {
  const y = Math.floor(year);
  return { from: `${y}-01-01`, to: `${y}-12-31` };
}
