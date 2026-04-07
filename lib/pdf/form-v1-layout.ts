/**
 * Statische Feldpositionen (PDF-Punkte, Ursprung unten links) — ermittelt mit dem
 * Admin-Tool `/partner/admin/pdf-coords` für pdf-lib.
 */
export const FORM_V1_LAYOUT = {
  /** Nachname und Vorname in einer Zeile (Darstellung: „Nachname, Vorname“). */
  nameUndVorname: { pageIndex: 0, x: 70.21, y: 703.2 },
  geburtsdatum: { pageIndex: 0, x: 212.84, y: 710.88 },
  versichertennummer: { pageIndex: 0, x: 385.08, y: 710.9 },
  /** Straße, Hausnummer, PLZ, Ort — eine logische Zeile, bei Bedarf Umbruch (`maxWidth`). */
  adresse: { pageIndex: 0, x: 70.09, y: 660.9 },
  krankenkasse: { pageIndex: 0, x: 375.09, y: 661.69 },
} as const;

/** Abstand zwischen Adress- und Krankenkassen-Spalte (pt). */
export const FORM_V1_ADDRESS_COLUMN_GAP_PT = 10;

/** Maximale Zeilenbreite Adresse (bis vor die Krankenkassen-Spalte). */
export function formV1AddressMaxWidthPt(): number {
  return (
    FORM_V1_LAYOUT.krankenkasse.x - FORM_V1_LAYOUT.adresse.x - FORM_V1_ADDRESS_COLUMN_GAP_PT
  );
}

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
 * Basis: 10 Stellen ≈ 8 Kästchen → 10/8; zuletzt +25 % mehr Abstand für neues Raster (ohne Punkte).
 */
export const FORM_V1_GEBURT_WIDTH_STRETCH = (10 / 8) * 1.25;

/**
 * Versichertennummer: Basis 12/10,5; +25 % mehr Buchstabenabstand wie beim Datum.
 */
export const FORM_V1_VERS_WIDTH_STRETCH = (12 / 10.5) * 1.25;
