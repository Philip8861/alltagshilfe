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
 * Ausgangspunkt für die Kästchen-Berechnung: früher 25 % der Schriftgröße zwischen Glyphen.
 * Der sichtbare Abstand wird per Streckfaktor auf die Vorlage kalibriert.
 */
export const FORM_V1_TRACKING_BASELINE_PT = FORM_V1_FONT_SIZE_PT * 0.25;

/**
 * Streckung der Gesamttextbreite relativ zu „natürliche Breite + Baseline-Tracking“,
 * damit die Zeichen auf die gedruckten Kästchen passen (visuell abgeglichen).
 * Geburtsdatum: 10 Stellen wirkten wie ~8 Kästchen breit → Faktor 10/8.
 */
export const FORM_V1_GEBURT_WIDTH_STRETCH = 10 / 8;

/**
 * Versichertennummer: 12 Stellen wirkten wie ~10,5 Kästchen → Faktor 12/10.5.
 */
export const FORM_V1_VERS_WIDTH_STRETCH = 12 / 10.5;
