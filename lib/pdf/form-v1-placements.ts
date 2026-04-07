import type { FormV1DataFieldId, FormV1KatalogFieldId } from "@/lib/pdf/form-v1-data-fields";
import { KONFIGURATOR_CATALOG_IDS } from "@/lib/pdf/konfigurator-catalog";

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

/** Nur Kreuz, kein Rahmen (Haken 1–5). */
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

function katalogTextPlacement(index: number): FormV1TextPlacement {
  const col = index % 2;
  const row = Math.floor(index / 2);
  return {
    kind: "text",
    pageIndex: 0,
    x: col === 0 ? 48 : 318,
    y: 402 - row * 16,
    fontSizePt: 9,
  };
}

const KATALOG_PLACEMENTS = Object.fromEntries(
  KONFIGURATOR_CATALOG_IDS.map((id, i) => [`katalog_${id}`, katalogTextPlacement(i)]),
) as Record<FormV1KatalogFieldId, FormV1TextPlacement>;

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
  aktuellesDatum: {
    kind: "text",
    pageIndex: 0,
    x: 400,
    y: 730,
    fontSizePt: 10,
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
  haken1: {
    kind: "checkmarkOnly",
    pageIndex: 0,
    boxLeftX: 48,
    yBaseline: 622,
    fontSizePt: 11,
  },
  haken2: {
    kind: "checkmarkOnly",
    pageIndex: 0,
    boxLeftX: 88,
    yBaseline: 622,
    fontSizePt: 11,
  },
  haken3: {
    kind: "checkmarkOnly",
    pageIndex: 0,
    boxLeftX: 128,
    yBaseline: 622,
    fontSizePt: 11,
  },
  haken4: {
    kind: "checkmarkOnly",
    pageIndex: 0,
    boxLeftX: 168,
    yBaseline: 622,
    fontSizePt: 11,
  },
  haken5: {
    kind: "checkmarkOnly",
    pageIndex: 0,
    boxLeftX: 208,
    yBaseline: 622,
    fontSizePt: 11,
  },
  unterschriftLabel: {
    kind: "signatureLabel",
    pageIndex: 0,
    x: 69.65,
    y: 118,
    fontSizePt: 10,
  },
  unterschriftMaxMustermann: {
    kind: "signatureGraphic",
    pageIndex: 0,
    x: 74,
    y: 112,
    scale: 1.35,
    rotateDeg: -7,
    borderWidth: 0.7,
  },
  unterschriftLinie: {
    kind: "signatureLine",
    pageIndex: 0,
    x1: 69.65,
    x2: 420,
    y: 102,
  },
  ...KATALOG_PLACEMENTS,
};
