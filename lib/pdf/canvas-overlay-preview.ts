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

/** PDF-y (unten links) → Canvas-y (oben links), für Linien und Rechtecke. */
export function canvasYFromPdfY(pdfY: number, pageHeightPt: number, canvasHeight: number): number {
  return ((pageHeightPt - pdfY) / pageHeightPt) * canvasHeight;
}

const CHECKBOX_BOX_PT = 9;

/** Näherung an `draw-checkbox.ts` für die Admin-Vorschau. */
export function drawCheckboxOverlayPreview(
  ctx: CanvasRenderingContext2D,
  opts: {
    pdfBoxLeftX: number;
    pdfYBaseline: number;
    label: string;
    fontSizePt: number;
    pageW: number;
    pageH: number;
    canvasW: number;
    canvasH: number;
    strokeStyle?: string;
    fillStyle?: string;
    checkedPreview?: boolean;
  },
): void {
  const {
    pdfBoxLeftX,
    pdfYBaseline,
    label,
    fontSizePt,
    pageW,
    pageH,
    canvasW,
    canvasH,
  } = opts;
  const scaleX = canvasW / pageW;
  const scaleY = canvasH / pageH;
  const rectBottomPdfY = pdfYBaseline - fontSizePt * 0.35;
  const boxPdf = CHECKBOX_BOX_PT;

  const xCanvas = canvasXFromPdfX(pdfBoxLeftX, pageW, canvasW);
  const bottomCanvasY = canvasYFromPdfY(rectBottomPdfY, pageH, canvasH);
  const w = boxPdf * scaleX;
  const h = boxPdf * scaleY;
  const yTop = bottomCanvasY - h;

  ctx.save();
  ctx.strokeStyle = opts.strokeStyle ?? "rgba(37, 99, 235, 0.9)";
  ctx.lineWidth = 1;
  ctx.strokeRect(xCanvas, yTop, w, h);

  if (opts.checkedPreview) {
    ctx.beginPath();
    const p = 1.6 * scaleX;
    ctx.moveTo(xCanvas + p, yTop + h - p);
    ctx.lineTo(xCanvas + w - p, yTop + p);
    ctx.moveTo(xCanvas + p, yTop + p);
    ctx.lineTo(xCanvas + w - p, yTop + h - p);
    ctx.stroke();
  }

  if (label) {
    const fontPx = Math.max(4, fontSizePt * scaleY);
    ctx.font = `${fontPx}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = opts.fillStyle ?? "rgba(37, 99, 235, 0.9)";
    const textX = xCanvas + w + 4 * scaleX;
    const baselineCanvasY = canvasBaselineYFromPdfY(pdfYBaseline, pageH, canvasH);
    ctx.fillText(label, textX, baselineCanvasY);
  }
  ctx.restore();
}

export function drawPdfHorizontalLineOverlay(
  ctx: CanvasRenderingContext2D,
  opts: {
    pdfX1: number;
    pdfX2: number;
    pdfY: number;
    pageW: number;
    pageH: number;
    canvasW: number;
    canvasH: number;
    strokeStyle?: string;
  },
): void {
  const x1 = canvasXFromPdfX(opts.pdfX1, opts.pageW, opts.canvasW);
  const x2 = canvasXFromPdfX(opts.pdfX2, opts.pageW, opts.canvasW);
  const y = canvasYFromPdfY(opts.pdfY, opts.pageH, opts.canvasH);
  ctx.save();
  ctx.strokeStyle = opts.strokeStyle ?? "rgba(37, 99, 235, 0.9)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

/** Nur Kreuz wie `drawCheckmarkOnly` (ohne Kästchen), für die Admin-Vorschau. */
export function drawCheckmarkXOnlyOverlay(
  ctx: CanvasRenderingContext2D,
  opts: {
    pdfBoxLeftX: number;
    pdfYBaseline: number;
    fontSizePt: number;
    pageW: number;
    pageH: number;
    canvasW: number;
    canvasH: number;
    strokeStyle?: string;
  },
): void {
  const scaleX = opts.canvasW / opts.pageW;
  const scaleY = opts.canvasH / opts.pageH;
  const boxPdf = CHECKBOX_BOX_PT;
  const rectBottomPdfY = opts.pdfYBaseline - opts.fontSizePt * 0.35;
  const xCanvas = canvasXFromPdfX(opts.pdfBoxLeftX, opts.pageW, opts.canvasW);
  const bottomCanvasY = canvasYFromPdfY(rectBottomPdfY, opts.pageH, opts.canvasH);
  const w = boxPdf * scaleX;
  const h = boxPdf * scaleY;
  const yTop = bottomCanvasY - h;
  const p = 1.6 * scaleX;
  ctx.save();
  ctx.strokeStyle = opts.strokeStyle ?? "rgba(37, 99, 235, 0.9)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(xCanvas + p, yTop + h - p * 0.7);
  ctx.lineTo(xCanvas + w - p, yTop + p * 0.7);
  ctx.moveTo(xCanvas + p, yTop + p * 0.7);
  ctx.lineTo(xCanvas + w - p, yTop + h - p * 0.7);
  ctx.stroke();
  ctx.restore();
}
