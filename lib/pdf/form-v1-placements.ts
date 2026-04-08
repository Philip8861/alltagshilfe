import type { FormV1DataFieldId } from "@/lib/pdf/form-v1-data-fields";

/** Text / Hinweistext: Baseline (pdf-lib), unten links. */
export type FormV1TextPlacement = {
  kind: "text";
  pageIndex: number;
  x: number;
  y: number;
  fontSizePt: number;
  trackingPt?: number;
};

export type FormV1CheckboxPlacement = {
  kind: "checkbox";
  pageIndex: number;
  boxLeftX: number;
  yBaseline: number;
  fontSizePt: number;
};

/** Nur Kreuz, kein Rahmen (Legacy / Editor-Import). */
export type FormV1CheckmarkOnlyPlacement = {
  kind: "checkmarkOnly";
  pageIndex: number;
  boxLeftX: number;
  yBaseline: number;
  fontSizePt: number;
};

export type FormV1SignatureLabelPlacement = {
  kind: "signatureLabel";
  pageIndex: number;
  x: number;
  y: number;
  fontSizePt: number;
};

export type FormV1SignatureLinePlacement = {
  kind: "signatureLine";
  pageIndex: number;
  x1: number;
  x2: number;
  y: number;
};

export type FormV1SignatureGraphicPlacement = {
  kind: "signatureGraphic";
  pageIndex: number;
  x: number;
  y: number;
  scale: number;
  rotateDeg: number;
  borderWidth: number;
};

export type FormV1FieldPlacement =
  | FormV1TextPlacement
  | FormV1CheckboxPlacement
  | FormV1CheckmarkOnlyPlacement
  | FormV1SignatureLabelPlacement
  | FormV1SignatureLinePlacement
  | FormV1SignatureGraphicPlacement;

/**
 * Koordinaten aller befüllbaren Datenfelder — hier anpassen oder JSON aus dem Admin-Editor übernehmen.
 */
export const FORM_V1_PLACEMENTS: Record<FormV1DataFieldId, FormV1FieldPlacement> = {
  vornameNachname: {
    kind: "text",
    pageIndex: 0,
    x: 68.39,
    y: 702.24,
    fontSizePt: 11,
  },
  strassePlzOrt: {
    kind: "text",
    pageIndex: 0,
    x: 69.65,
    y: 660.64,
    fontSizePt: 11,
  },
  geburtsdatum: {
    kind: "text",
    pageIndex: 0,
    x: 210.2,
    y: 709.81,
    fontSizePt: 11,
    trackingPt: 9.35,
  },
  versichertennummer: {
    kind: "text",
    pageIndex: 0,
    x: 381.1,
    y: 709.8,
    fontSizePt: 11,
    trackingPt: 10.85,
  },
  krankenkasse: {
    kind: "text",
    pageIndex: 0,
    x: 379.99,
    y: 661.69,
    fontSizePt: 11,
  },
  aktuellesDatum: {
    kind: "text",
    pageIndex: 1,
    x: 81.6,
    y: 302.6,
    fontSizePt: 10,
    trackingPt: 9.95,
  },
  aktuellesDatum2: {
    kind: "text",
    pageIndex: 1,
    x: 257.67,
    y: 472.31,
    fontSizePt: 10,
    trackingPt: 10.1,
  },
  kontaktTelefonisch: {
    kind: "checkbox",
    pageIndex: 1,
    boxLeftX: 252.46,
    yBaseline: 576.78,
    fontSizePt: 11,
  },
  kontaktVideocall: {
    kind: "checkbox",
    pageIndex: 1,
    boxLeftX: 252.46,
    yBaseline: 576.78,
    fontSizePt: 11,
  },
  unterschriftMaxMustermann: {
    kind: "signatureGraphic",
    pageIndex: 1,
    x: 350.17,
    y: 303.26,
    scale: 1,
    rotateDeg: -7,
    borderWidth: 3,
  },
  katalog_9102: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 228,
    fontSizePt: 9.3,
    trackingPt: 10.85,
  },
  katalog_9109: {
    kind: "text",
    pageIndex: 0,
    x: 426.81,
    y: 445.1,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9111: {
    kind: "text",
    pageIndex: 0,
    x: 426.81,
    y: 270.4,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9112: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 294.7,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9104: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 397,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9113: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 244.8,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9101: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 420.3,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9110: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 473,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9103: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 346.3,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9107: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 320.5,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9105: {
    kind: "text",
    pageIndex: 0,
    x: 426.91,
    y: 494.1,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
  katalog_9108: {
    kind: "text",
    pageIndex: 0,
    x: 423.4,
    y: 122.98,
    fontSizePt: 9,
    trackingPt: 10.85,
  },
};
