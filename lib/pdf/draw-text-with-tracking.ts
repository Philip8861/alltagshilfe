import type { Color, PDFPage, PDFFont } from "pdf-lib";

/**
 * Zeichnet Text mit zusätzlichem horizontalen Abstand zwischen den Glyphen.
 * `trackingPt` entspricht grob „mehr Abstand pro Zeichen“ (in Punkt); für
 * „25 % mehr“ wird typisch `fontSizePt * 0.25` gesetzt.
 */
export function drawTextWithTracking(
  page: PDFPage,
  text: string,
  opts: {
    x: number;
    y: number;
    size: number;
    font: PDFFont;
    color: Color;
    /** Zusätzlicher Abstand zwischen Zeichen (pt). */
    trackingPt: number;
  },
): void {
  const { x, y, size, font, color, trackingPt } = opts;
  if (!text) return;
  const chars = Array.from(text);
  let cursorX = x;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    page.drawText(ch, { x: cursorX, y, size, font, color });
    if (i < chars.length - 1) {
      cursorX += font.widthOfTextAtSize(ch, size) + trackingPt;
    }
  }
}
