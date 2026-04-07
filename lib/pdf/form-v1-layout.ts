/**
 * Statische Feldpositionen (PDF-Punkte, Ursprung unten links) — z. B. Admin PDF-Formularfelder.
 */
export const FORM_V1_LAYOUT = {
  /**
   * Vorname, Nachname, Straße, Hausnummer, PLZ, Ort — eine Zeile, bei Bedarf Umbruch bis zur
   * Krankenkassen-Spalte.
   */
  personUndAdresse: { pageIndex: 0, x: 69.65, y: 660.64 },
  geburtsdatum: { pageIndex: 0, x: 210.2, y: 709.81 },
  versichertennummer: { pageIndex: 0, x: 381.1, y: 709.8 },
  krankenkasse: { pageIndex: 0, x: 375.09, y: 661.69 },
} as const;

/** Abstand zwischen Personenzeile und Krankenkassen-Spalte (pt). */
export const FORM_V1_ADDRESS_COLUMN_GAP_PT = 10;

/** Maximale Zeilenbreite für die kombinierte Person-/Adresszeile. */
export function formV1PersonLineMaxWidthPt(): number {
  return (
    FORM_V1_LAYOUT.krankenkasse.x -
    FORM_V1_LAYOUT.personUndAdresse.x -
    FORM_V1_ADDRESS_COLUMN_GAP_PT
  );
}

/** Schriftgröße auf dem Formular (pt). */
export const FORM_V1_FONT_SIZE_PT = 11;

/** Festes Tracking aus Layout-Labor (Geburtsdatum DDMMYYYY). */
export const FORM_V1_GEBURT_TRACKING_PT = 9.3;

/** Festes Tracking aus Layout-Labor (Versichertennummer). */
export const FORM_V1_VERS_TRACKING_PT = 10.85;
