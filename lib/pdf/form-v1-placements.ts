import type { FormV1DataFieldId } from "@/lib/pdf/form-v1-data-fields";

/** Text / Hinweistext: Baseline (pdf-lib), unten links. */
export type FormV1TextPlacement = {
  kind: "text";
  pageIndex: number;
  x: number;
  y: number;
  fontSizePt: number;
  /** Nur bei trackedText-Feldern */
  trackingPt?: number;
};

export type FormV1CheckboxPlacement = {
  kind: "checkbox";
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

export type FormV1FieldPlacement =
  | FormV1TextPlacement
  | FormV1CheckboxPlacement
  | FormV1SignatureLabelPlacement
  | FormV1SignatureLinePlacement;

/**
 * Koordinaten aller befüllbaren Datenfelder — hier anpassen oder JSON aus dem Admin-Editor übernehmen.
 */
export const FORM_V1_PLACEMENTS: Record<FormV1DataFieldId, FormV1FieldPlacement> = {
  vornameNachname: {
    kind: "text",
    pageIndex: 0,
    x: 69.65,
    y: 674.5,
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
    trackingPt: 9.3,
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
    x: 375.09,
    y: 661.69,
    fontSizePt: 11,
  },
  kontaktTelefonisch: {
    kind: "checkbox",
    pageIndex: 0,
    boxLeftX: 69.65,
    yBaseline: 638,
    fontSizePt: 11,
  },
  kontaktVideocall: {
    kind: "checkbox",
    pageIndex: 0,
    boxLeftX: 230,
    yBaseline: 638,
    fontSizePt: 11,
  },
  kontaktGeschaeftsraeume: {
    kind: "checkbox",
    pageIndex: 0,
    boxLeftX: 400,
    yBaseline: 638,
    fontSizePt: 11,
  },
  unterschriftLabel: {
    kind: "signatureLabel",
    pageIndex: 0,
    x: 69.65,
    y: 118,
    fontSizePt: 10,
  },
  unterschriftLinie: {
    kind: "signatureLine",
    pageIndex: 0,
    x1: 69.65,
    x2: 420,
    y: 102,
  },
};
