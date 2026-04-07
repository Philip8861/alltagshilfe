import type { PDFPage } from "pdf-lib";
import { rgb } from "pdf-lib";

const black = rgb(0, 0, 0);

/** Nur das Kreuz/Häkchen (ohne Kästchen und ohne Text), gleiche Geometrie wie bei `drawCheckboxWithLabel` bei checked. */
export function drawCheckmarkOnly(
  page: PDFPage,
  opts: {
    boxLeftX: number;
    yBaseline: number;
    fontSizePt: number;
    boxSizePt?: number;
  },
): void {
  const box = opts.boxSizePt ?? 9;
  const { boxLeftX, yBaseline, fontSizePt } = opts;
  const rectBottomY = yBaseline - fontSizePt * 0.35;
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
