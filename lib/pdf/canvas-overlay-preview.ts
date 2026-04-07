/**
 * Hilfen für die Browser-Vorschau im Admin-Layout-Labor (Canvas, nicht pdf-lib).
 * Annäherung an Helvetica; Abweichungen zum PDF-Druck sind möglich, für Feintuning reicht es.
 */

export function canvasBaselineYFromPdfY(
  pdfY: number,
  pageHeightPt: number,
  canvasHeight: number,
): number {
  return ((pageHeightPt - pdfY) / pageHeightPt) * canvasHeight;
}

export function canvasXFromPdfX(pdfX: number, pageWidthPt: number, canvasWidth: number): number {
  return (pdfX / pageWidthPt) * canvasWidth;
}

export function pdfCoordsFromCanvasPixel(
  cx: number,
  cy: number,
  pageW: number,
  pageH: number,
  canvasW: number,
  canvasH: number,
): { pdfX: number; pdfY: number } {
  const pdfX = (cx / canvasW) * pageW;
  const pdfY = pageH - (cy / canvasH) * pageH;
  return { pdfX, pdfY };
}

export type TrackedOverlayOpts = {
  text: string;
  /** pdf-lib: linker Rand, Baseline-y */
  pdfX: number;
  pdfY: number;
  /** Zusätzlicher Abstand zwischen Glyphen (PDF-Punkt), wie `drawTextWithTracking`. */
  trackingPt: number;
  fontSizePt: number;
  pageW: number;
  pageH: number;
  canvasW: number;
  canvasH: number;
  fillStyle?: string;
};

/** Zeichnet Text mit Tracking auf ein Canvas (Overlay), Koordinaten wie pdf-lib. */
export function drawTrackedTextOverlay(
  ctx: CanvasRenderingContext2D,
  opts: TrackedOverlayOpts,
): void {
  const {
    text,
    pdfX,
    pdfY,
    trackingPt,
    fontSizePt,
    pageW,
    pageH,
    canvasW,
    canvasH,
  } = opts;
  if (!text) return;

  const scaleY = canvasH / pageH;
  const fontPx = Math.max(4, fontSizePt * scaleY);
  const baselineCanvasY = canvasBaselineYFromPdfY(pdfY, pageH, canvasH);

  ctx.save();
  ctx.font = `${fontPx}px Helvetica, Arial, sans-serif`;
  ctx.fillStyle = opts.fillStyle ?? "rgba(37, 99, 235, 0.9)";

  const chars = Array.from(text);
  let cursorPdfX = pdfX;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    const cx = canvasXFromPdfX(cursorPdfX, pageW, canvasW);
    ctx.fillText(ch, cx, baselineCanvasY);
    if (i < chars.length - 1) {
      const wPx = ctx.measureText(ch).width;
      const advancePdf = (wPx / canvasW) * pageW;
      cursorPdfX += advancePdf + trackingPt;
    }
  }
  ctx.restore();
}

/** Einfache einzeilige Vorschau ohne Extra-Tracking (Name, Adresse …). */
export function drawPlainTextOverlay(
  ctx: CanvasRenderingContext2D,
  opts: Omit<TrackedOverlayOpts, "trackingPt"> & { trackingPt?: number },
): void {
  drawTrackedTextOverlay(ctx, { ...opts, trackingPt: 0 });
}
