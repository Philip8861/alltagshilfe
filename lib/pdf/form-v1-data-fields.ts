/**
 * Semantische Datenfelder für Formular-PDF v1.
 * Jede ID entspricht genau einer befüllbaren Stelle (Koordinaten in form-v1-placements.ts).
 */
export const FORM_V1_DATA_FIELD_KINDS = [
  "plainText",
  "trackedText",
  "checkbox",
  "signatureLabel",
  "signatureLine",
] as const;

export type FormV1DataFieldKind = (typeof FORM_V1_DATA_FIELD_KINDS)[number];

export type FormV1DataFieldId =
  | "vornameNachname"
  | "strassePlzOrt"
  | "geburtsdatum"
  | "versichertennummer"
  | "krankenkasse"
  | "kontaktTelefonisch"
  | "kontaktVideocall"
  | "kontaktGeschaeftsraeume"
  | "unterschriftLabel"
  | "unterschriftLinie";

export type FormV1DataFieldMeta = {
  id: FormV1DataFieldId;
  /** Anzeige im Admin-Editor (Feld hinzufügen) */
  editorLabel: string;
  kind: FormV1DataFieldKind;
  /** Mustertext nur für die Canvas-Vorschau im Editor */
  sampleText: string;
  /** Checkbox-Beschriftung (nur kind checkbox) */
  checkboxLabel?: string;
  /** Standard für neue Felder im Editor */
  defaultFontSizePt: number;
  defaultTrackingPt?: number;
};

export const FORM_V1_DATA_FIELDS: readonly FormV1DataFieldMeta[] = [
  {
    id: "vornameNachname",
    editorLabel: "Daten: Vorname & Nachname (eine Zeile)",
    kind: "plainText",
    sampleText: "Max Mustermann",
    defaultFontSizePt: 11,
  },
  {
    id: "strassePlzOrt",
    editorLabel: "Daten: Straße, Hausnr., PLZ, Ort (eine Zeile)",
    kind: "plainText",
    sampleText: "Musterstraße 12 a 87700 Memmingen",
    defaultFontSizePt: 11,
  },
  {
    id: "geburtsdatum",
    editorLabel: "Daten: Geburtsdatum (ohne Punkte, Tracking)",
    kind: "trackedText",
    sampleText: "15031990",
    defaultFontSizePt: 11,
    defaultTrackingPt: 9.3,
  },
  {
    id: "versichertennummer",
    editorLabel: "Daten: Versichertennummer (Tracking)",
    kind: "trackedText",
    sampleText: "123456789012",
    defaultFontSizePt: 11,
    defaultTrackingPt: 10.85,
  },
  {
    id: "krankenkasse",
    editorLabel: "Daten: Krankenkasse",
    kind: "plainText",
    sampleText: "AOK Bayern",
    defaultFontSizePt: 11,
  },
  {
    id: "kontaktTelefonisch",
    editorLabel: "Daten: Kontakt ☐ Telefonisch",
    kind: "checkbox",
    sampleText: "",
    checkboxLabel: "Telefonisch",
    defaultFontSizePt: 11,
  },
  {
    id: "kontaktVideocall",
    editorLabel: "Daten: Kontakt ☐ Per Videocall",
    kind: "checkbox",
    sampleText: "",
    checkboxLabel: "Per Videocall",
    defaultFontSizePt: 11,
  },
  {
    id: "kontaktGeschaeftsraeume",
    editorLabel: "Daten: Kontakt ☐ In den Geschäftsräumen",
    kind: "checkbox",
    sampleText: "",
    checkboxLabel: "In den Geschäftsräumen",
    defaultFontSizePt: 11,
  },
  {
    id: "unterschriftLabel",
    editorLabel: "Beschriftung: Unterschrift (Hinweistext)",
    kind: "signatureLabel",
    sampleText: "Unterschrift",
    defaultFontSizePt: 10,
  },
  {
    id: "unterschriftLinie",
    editorLabel: "Linie: Unterschrift",
    kind: "signatureLine",
    sampleText: "",
    defaultFontSizePt: 11,
  },
] as const;

const byId = Object.fromEntries(FORM_V1_DATA_FIELDS.map((d) => [d.id, d])) as Record<
  FormV1DataFieldId,
  FormV1DataFieldMeta
>;

export function getFormV1DataFieldMeta(id: FormV1DataFieldId): FormV1DataFieldMeta {
  return byId[id];
}

export function isFormV1DataFieldId(s: string): s is FormV1DataFieldId {
  return s in byId;
}
