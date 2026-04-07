/**
 * Statische Feldpositionen (PDF-Punkte, Ursprung unten links) — ermittelt mit dem
 * Admin-Tool `/partner/admin/pdf-coords` für pdf-lib.
 *
 * Eine Zeile für „Name und Vorname“; Geburtsdatum separat.
 */
export const FORM_V1_LAYOUT = {
  /** Nachname und Vorname in einer Zeile (Darstellung: „Nachname, Vorname“). */
  nameUndVorname: { pageIndex: 0, x: 70, y: 710.85 },
  geburtsdatum: { pageIndex: 0, x: 205.07, y: 721.03 },
} as const;

/** Schriftgröße auf dem Formular (pt), anpassbar sobald die Vorlage im Druck geprüft ist. */
export const FORM_V1_FONT_SIZE_PT = 11;
