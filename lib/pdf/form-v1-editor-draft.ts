import type { FormV1DataFieldId } from "@/lib/pdf/form-v1-data-fields";
import {
  FORM_V1_DATA_FIELDS,
  getFormV1DataFieldMeta,
  isFormV1DataFieldId,
} from "@/lib/pdf/form-v1-data-fields";
import { FORM_V1_PLACEMENTS, type FormV1FieldPlacement } from "@/lib/pdf/form-v1-placements";

export type PdfFormV1FieldDraft =
  | {
      id: string;
      fieldId: FormV1DataFieldId;
      shape: "text";
      pageIndex0: number;
      x: number;
      y: number;
      fontSizePt: number;
      trackingPt?: number;
    }
  | {
      id: string;
      fieldId: FormV1DataFieldId;
      shape: "checkbox";
      pageIndex0: number;
      boxLeftX: number;
      yBaseline: number;
      fontSizePt: number;
    }
  | {
      id: string;
      fieldId: FormV1DataFieldId;
      shape: "checkmarkOnly";
      pageIndex0: number;
      boxLeftX: number;
      yBaseline: number;
      fontSizePt: number;
    }
  | {
      id: string;
      fieldId: FormV1DataFieldId;
      shape: "signatureLabel";
      pageIndex0: number;
      x: number;
      y: number;
      fontSizePt: number;
    }
  | {
      id: string;
      fieldId: FormV1DataFieldId;
      shape: "signatureGraphic";
      pageIndex0: number;
      x: number;
      y: number;
      scale: number;
      rotateDeg: number;
      borderWidth: number;
    }
  | {
      id: string;
      fieldId: FormV1DataFieldId;
      shape: "signatureLine";
      pageIndex0: number;
      x1: number;
      x2: number;
      lineY: number;
      fontSizePt: number;
    };

export function createDraftFromFieldId(fieldId: FormV1DataFieldId, id: string): PdfFormV1FieldDraft {
  const p = FORM_V1_PLACEMENTS[fieldId];
  const m = getFormV1DataFieldMeta(fieldId);

  if (p.kind === "text") {
    return {
      id,
      fieldId,
      shape: "text",
      pageIndex0: p.pageIndex,
      x: p.x,
      y: p.y,
      fontSizePt: p.fontSizePt,
      trackingPt:
        m.kind === "trackedText" ? (p.trackingPt ?? m.defaultTrackingPt ?? undefined) : undefined,
    };
  }
  if (p.kind === "checkbox") {
    return {
      id,
      fieldId,
      shape: "checkbox",
      pageIndex0: p.pageIndex,
      boxLeftX: p.boxLeftX,
      yBaseline: p.yBaseline,
      fontSizePt: p.fontSizePt,
    };
  }
  if (p.kind === "checkmarkOnly") {
    return {
      id,
      fieldId,
      shape: "checkmarkOnly",
      pageIndex0: p.pageIndex,
      boxLeftX: p.boxLeftX,
      yBaseline: p.yBaseline,
      fontSizePt: p.fontSizePt,
    };
  }
  if (p.kind === "signatureLabel") {
    return {
      id,
      fieldId,
      shape: "signatureLabel",
      pageIndex0: p.pageIndex,
      x: p.x,
      y: p.y,
      fontSizePt: p.fontSizePt,
    };
  }
  if (p.kind === "signatureGraphic") {
    return {
      id,
      fieldId,
      shape: "signatureGraphic",
      pageIndex0: p.pageIndex,
      x: p.x,
      y: p.y,
      scale: p.scale,
      rotateDeg: p.rotateDeg,
      borderWidth: p.borderWidth,
    };
  }
  return {
    id,
    fieldId,
    shape: "signatureLine",
    pageIndex0: p.pageIndex,
    x1: p.x1,
    x2: p.x2,
    lineY: p.y,
    fontSizePt: m.defaultFontSizePt,
  };
}

export function allDraftsFromRepoConfig(newId: () => string): PdfFormV1FieldDraft[] {
  return FORM_V1_DATA_FIELDS.map((d) => createDraftFromFieldId(d.id, newId()));
}

export function draftToPlacement(d: PdfFormV1FieldDraft): FormV1FieldPlacement {
  if (d.shape === "text") {
    const m = getFormV1DataFieldMeta(d.fieldId);
    return {
      kind: "text",
      pageIndex: d.pageIndex0,
      x: d.x,
      y: d.y,
      fontSizePt: d.fontSizePt,
      ...(m.kind === "trackedText"
        ? { trackingPt: d.trackingPt ?? m.defaultTrackingPt ?? 0 }
        : {}),
    };
  }
  if (d.shape === "checkbox") {
    return {
      kind: "checkbox",
      pageIndex: d.pageIndex0,
      boxLeftX: d.boxLeftX,
      yBaseline: d.yBaseline,
      fontSizePt: d.fontSizePt,
    };
  }
  if (d.shape === "checkmarkOnly") {
    return {
      kind: "checkmarkOnly",
      pageIndex: d.pageIndex0,
      boxLeftX: d.boxLeftX,
      yBaseline: d.yBaseline,
      fontSizePt: d.fontSizePt,
    };
  }
  if (d.shape === "signatureLabel") {
    return {
      kind: "signatureLabel",
      pageIndex: d.pageIndex0,
      x: d.x,
      y: d.y,
      fontSizePt: d.fontSizePt,
    };
  }
  if (d.shape === "signatureGraphic") {
    return {
      kind: "signatureGraphic",
      pageIndex: d.pageIndex0,
      x: d.x,
      y: d.y,
      scale: d.scale,
      rotateDeg: d.rotateDeg,
      borderWidth: d.borderWidth,
    };
  }
  return {
    kind: "signatureLine",
    pageIndex: d.pageIndex0,
    x1: d.x1,
    x2: d.x2,
    y: d.lineY,
  };
}

/** JSON aus dem Editor → Entwürfe (z. B. Import). */
export function draftsFromPlacementsJson(
  raw: unknown,
  newId: () => string,
): { ok: true; drafts: PdfFormV1FieldDraft[] } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Ungültiges JSON (kein Objekt)." };
  }
  const o = raw as Record<string, unknown>;
  const placementsRaw = o.placements ?? o;
  if (!placementsRaw || typeof placementsRaw !== "object") {
    return { ok: false, error: "Erwarte Objekt mit Feld-IDs als Schlüssel oder { placements: { … } }." };
  }
  const placements = placementsRaw as Record<string, unknown>;

  const drafts: PdfFormV1FieldDraft[] = [];
  for (const key of Object.keys(placements)) {
    if (!isFormV1DataFieldId(key)) continue;
    const val = placements[key];
    if (!val || typeof val !== "object") continue;
    const p = val as Record<string, unknown>;
    const kind = p.kind;
    if (kind === "text") {
      drafts.push({
        id: newId(),
        fieldId: key as FormV1DataFieldId,
        shape: "text",
        pageIndex0: Number(p.pageIndex),
        x: Number(p.x),
        y: Number(p.y),
        fontSizePt: Number(p.fontSizePt),
        trackingPt: p.trackingPt != null ? Number(p.trackingPt) : undefined,
      });
    } else if (kind === "checkbox") {
      drafts.push({
        id: newId(),
        fieldId: key as FormV1DataFieldId,
        shape: "checkbox",
        pageIndex0: Number(p.pageIndex),
        boxLeftX: Number(p.boxLeftX),
        yBaseline: Number(p.yBaseline),
        fontSizePt: Number(p.fontSizePt),
      });
    } else if (kind === "checkmarkOnly") {
      drafts.push({
        id: newId(),
        fieldId: key as FormV1DataFieldId,
        shape: "checkmarkOnly",
        pageIndex0: Number(p.pageIndex),
        boxLeftX: Number(p.boxLeftX),
        yBaseline: Number(p.yBaseline),
        fontSizePt: Number(p.fontSizePt),
      });
    } else if (kind === "signatureLabel") {
      drafts.push({
        id: newId(),
        fieldId: key as FormV1DataFieldId,
        shape: "signatureLabel",
        pageIndex0: Number(p.pageIndex),
        x: Number(p.x),
        y: Number(p.y),
        fontSizePt: Number(p.fontSizePt),
      });
    } else if (kind === "signatureGraphic") {
      drafts.push({
        id: newId(),
        fieldId: key as FormV1DataFieldId,
        shape: "signatureGraphic",
        pageIndex0: Number(p.pageIndex),
        x: Number(p.x),
        y: Number(p.y),
        scale: Number(p.scale),
        rotateDeg: Number(p.rotateDeg),
        borderWidth: Number(p.borderWidth),
      });
    } else if (kind === "signatureLine") {
      drafts.push({
        id: newId(),
        fieldId: key as FormV1DataFieldId,
        shape: "signatureLine",
        pageIndex0: Number(p.pageIndex),
        x1: Number(p.x1),
        x2: Number(p.x2),
        lineY: Number(p.y),
        fontSizePt: 11,
      });
    }
  }

  if (drafts.length === 0) {
    return { ok: false, error: "Keine gültigen Platzierungen gefunden." };
  }
  return { ok: true, drafts };
}
