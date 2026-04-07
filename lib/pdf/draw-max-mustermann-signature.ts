import type { PDFPage } from "pdf-lib";
import { degrees, rgb } from "pdf-lib";

/**
 * Stilisierte Vektor-Unterschrift (kein Scan) — nur für Demo/Mustermann-Vorschau.
 * SVG-Pfad in lokaler Einheit; Position über `x`/`y`/`scale`/`rotate`.
 */
const MAX_MUSTERMANN_SIGNATURE_PATH =
  "M 2 22 C 6 6 18 4 28 14 C 36 22 44 8 52 16 C 58 22 64 10 72 18 M 78 20 C 82 6 96 10 104 16 C 112 24 118 12 126 18";

export function drawMaxMustermannSignature(
  page: PDFPage,
  opts: {
    x: number;
    y: number;
    scale?: number;
    rotateDeg?: number;
    borderWidth?: number;
  },
): void {
  const { x, y, scale = 1.35, rotateDeg = -7, borderWidth = 0.7 } = opts;
  page.drawSvgPath(MAX_MUSTERMANN_SIGNATURE_PATH, {
    x,
    y,
    scale,
    rotate: degrees(rotateDeg),
    borderColor: rgb(0.05, 0.08, 0.22),
    borderWidth,
  });
}
