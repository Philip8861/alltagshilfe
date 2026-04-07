import type { PDFPage, PDFFont } from "pdf-lib";
import { rgb } from "pdf-lib";

const black = rgb(0, 0, 0);

/**
 * Kästchen + Beschriftung in einer Zeile (Baseline für den Text).
 */
export function drawCheckboxWithLabel(
  page: PDFPage,
  opts: {
    boxLeftX: number;
    yBaseline: number;
    checked: boolean;
    label: string;
    font: PDFFont;
    fontSizePt: number;
    boxSizePt?: number;
  },
): void {
  const box = opts.boxSizePt ?? 9;
  const { boxLeftX, yBaseline, checked, label, font, fontSizePt } = opts;
  const rectBottomY = yBaseline - fontSizePt * 0.35;

  page.drawRectangle({
    x: boxLeftX,
    y: rectBottomY,
    width: box,
    height: box,
    borderColor: black,
    borderWidth: 0.55,
  });

  if (checked) {
    const p = 1.6;
    page.drawLine({
      start: { x: boxLeftX + p, y: rectBottomY + p * 0.7 },
      end: { x: boxLeftX + box - p, y: rectBottomY + box - p * 0.7 },
      thickness: 0.85,
      color: black,
    });
    page.drawLine({
      start: { x: boxLeftX + p, y: rectBottomY + box - p * 0.7 },
      end: { x: boxLeftX + box - p, y: rectBottomY + p * 0.7 },
      thickness: 0.85,
      color: black,
    });
  }

  page.drawText(label, {
    x: boxLeftX + box + 4,
    y: yBaseline,
    size: fontSizePt,
    font,
    color: black,
  });
}
