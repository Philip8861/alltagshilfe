/**
 * Statische Feldpositionen (PDF-Punkte, Ursprung unten links) — ermittelt mit dem
 * Admin-Tool `/partner/admin/pdf-coords` für pdf-lib.
 */
export const FORM_V1_LAYOUT = {
  /** Nachname und Vorname in einer Zeile (Darstellung: „Nachname, Vorname“). */
  nameUndVorname: { pageIndex: 0, x: 70.21, y: 703.2 },
  geburtsdatum: { pageIndex: 0, x: 207.48, y: 709.57 },
  versichertennummer: { pageIndex: 0, x: 376.79, y: 709.97 },
} as const;

/** Schriftgröße auf dem Formular (pt). */
export const FORM_V1_FONT_SIZE_PT = 11;

/**
 * Zusätzlicher Buchstabenabstand (pt) für Geburtsdatum und Versichertennummer:
 * 25 % der Schriftgröße gegenüber normalem `drawText` ohne Extra-Tracking.
 */
export const FORM_V1_WIDE_TRACKING_PT = FORM_V1_FONT_SIZE_PT * 0.25;
