/**
 * Ab diesem Berlin-Kalendertag (YYYY-MM-DD) zählen Anfragen und Unique Visitors
 * nur im Admin-Bereich „Besucher & Conversion“.
 * Frühere Aggregate in `contact_sources_daily` bleiben für die anderen Kacheln erhalten.
 */
export const CONVERSION_STATS_START_DAY = "2026-07-23";

export function isConversionTrackingDay(dayYmd: string): boolean {
  return dayYmd >= CONVERSION_STATS_START_DAY;
}
