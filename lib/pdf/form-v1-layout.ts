/**
 * Statische Feldpositionen (PDF-Punkte, Ursprung unten links) — z. B. Admin PDF-Formularfelder.
 * Checkboxen/Unterschrift: Platzhalter — bei Bedarf im Layout-Labor nachziehen.
 */
export const FORM_V1_LAYOUT = {
  vornameNachname: { pageIndex: 0, x: 69.65, y: 674.5 },
  strassePlzOrt: { pageIndex: 0, x: 69.65, y: 660.64 },
  geburtsdatum: { pageIndex: 0, x: 210.2, y: 709.81 },
  versichertennummer: { pageIndex: 0, x: 381.1, y: 709.8 },
  krankenkasse: { pageIndex: 0, x: 375.09, y: 661.69 },
  /** Gemeinsame Text-Baseline für die drei Kontakt-Checkboxen. */
  kontaktCheckboxRowY: 638,
  kontaktBoxTelefonischX: 69.65,
  kontaktBoxVideocallX: 230,
  kontaktBoxGeschaeftsraeumeX: 400,
  /** Unterschrift: Hinweistext und Unterschriftenlinie. */
  unterschriftLabel: { pageIndex: 0, x: 69.65, y: 118 },
  unterschriftLinie: { pageIndex: 0, x1: 69.65, x2: 420, y: 102 },
} as const;

/** Abstand Textspalte → Krankenkassen-Spalte (pt). */
export const FORM_V1_ADDRESS_COLUMN_GAP_PT = 10;

function textColumnMaxWidthPt(leftX: number): number {
  return (
    FORM_V1_LAYOUT.krankenkasse.x - leftX - FORM_V1_ADDRESS_COLUMN_GAP_PT
  );
}

export function formV1NameLineMaxWidthPt(): number {
  return textColumnMaxWidthPt(FORM_V1_LAYOUT.vornameNachname.x);
}

export function formV1StrasseLineMaxWidthPt(): number {
  return textColumnMaxWidthPt(FORM_V1_LAYOUT.strassePlzOrt.x);
}

/** Schriftgröße auf dem Formular (pt). */
export const FORM_V1_FONT_SIZE_PT = 11;

/** Festes Tracking (Geburtsdatum DDMMYYYY). */
export const FORM_V1_GEBURT_TRACKING_PT = 9.3;

/** Festes Tracking (Versichertennummer). */
export const FORM_V1_VERS_TRACKING_PT = 10.85;
