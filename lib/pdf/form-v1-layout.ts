/**
 * Hilfsgrößen für Formular v1 (Spaltenbreiten). Koordinaten: form-v1-placements.ts.
 */
import { FORM_V1_PLACEMENTS } from "@/lib/pdf/form-v1-placements";

/** Abstand Textspalte → Krankenkassen-Spalte (pt). */
export const FORM_V1_ADDRESS_COLUMN_GAP_PT = 10;

function assertTextPlacement(
  id: "vornameNachname" | "strassePlzOrt" | "krankenkasse",
): { x: number } {
  const p = FORM_V1_PLACEMENTS[id];
  if (p.kind !== "text") throw new Error(`Erwartet Text-Placement für ${id}`);
  return p;
}

export function formV1NameLineMaxWidthPt(): number {
  const k = assertTextPlacement("krankenkasse");
  const n = assertTextPlacement("vornameNachname");
  return k.x - n.x - FORM_V1_ADDRESS_COLUMN_GAP_PT;
}

export function formV1StrasseLineMaxWidthPt(): number {
  const k = assertTextPlacement("krankenkasse");
  const s = assertTextPlacement("strassePlzOrt");
  return k.x - s.x - FORM_V1_ADDRESS_COLUMN_GAP_PT;
}

/** Schriftgröße auf dem Formular (pt) — Fallback; pro Feld oft in Placements. */
export const FORM_V1_FONT_SIZE_PT = 11;

/** Fallback-Tracking (Geburtsdatum) — bevorzugt Placement.trackingPt; gleich wie Vers.-Nr. */
export const FORM_V1_GEBURT_TRACKING_PT = 10.85;

/** Fallback-Tracking (Versichertennummer, Katalog, Aktuelles Datum). */
export const FORM_V1_VERS_TRACKING_PT = 10.85;
