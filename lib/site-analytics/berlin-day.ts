/** Kalendertag Europe/Berlin als YYYY-MM-DD (für DB-Zähler). */
export function analyticsDayBerlin(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
