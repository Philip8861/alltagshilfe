import type { PDFFont } from "pdf-lib";

/**
 * Berechnet den zusätzlichen Abstand zwischen Glyphen (pt), sodass die Gesamtbreite
 * gegenüber „`widthOfTextAtSize` + baselineTracking zwischen jedem Paar“ um
 * `widthStretchFactor` gestreckt wird. Passt proportional gesetzte Schrift an
 * feste Kästchenbreiten an.
 */
export function interGlyphTrackingForStretch(
  font: PDFFont,
  text: string,
  sizePt: number,
  baselineTrackingPt: number,
  widthStretchFactor: number,
): number {
  const n = Array.from(text).length;
  if (n <= 1) return Math.max(0, baselineTrackingPt);

  const naturalWidth = font.widthOfTextAtSize(text, sizePt);
  const gaps = n - 1;
  const widthBeforeStretch = naturalWidth + baselineTrackingPt * gaps;
  const widthAfterStretch = widthBeforeStretch * widthStretchFactor;
  return Math.max(0, (widthAfterStretch - naturalWidth) / gaps);
}
