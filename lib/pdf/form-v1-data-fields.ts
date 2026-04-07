/**
 * Semantische Datenfelder für Formular-PDF v1.
 * Katalog-Felder: `katalog_<ID>` — synchron zu `konfigurator-catalog.ts`.
 */
import {
  KONFIGURATOR_CATALOG,
  type KonfiguratorCatalogId,
  katalogFieldIdForItem,
} from "@/lib/pdf/konfigurator-catalog";

export const FORM_V1_DATA_FIELD_KINDS = [
  "plainText",
  "trackedText",
  "checkbox",
  "checkmarkOnly",
  "signatureLabel",
  "signatureLine",
  "signatureGraphic",
] as const;

export type FormV1DataFieldKind = (typeof FORM_V1_DATA_FIELD_KINDS)[number];

export type FormV1KatalogFieldId = `katalog_${KonfiguratorCatalogId}`;

export type FormV1DataFieldId =
  | "vornameNachname"
  | "strassePlzOrt"
  | "geburtsdatum"
  | "versichertennummer"
  | "krankenkasse"
  | "aktuellesDatum"
  | "aktuellesDatum2"
  | "kontaktTelefonisch"
  | "kontaktVideocall"
  | "unterschriftMaxMustermann"
  | FormV1KatalogFieldId;

export type FormV1DataFieldMeta = {
  id: FormV1DataFieldId;
  editorLabel: string;
  kind: FormV1DataFieldKind;
  sampleText: string;
  checkboxLabel?: string;
  defaultFontSizePt: number;
  defaultTrackingPt?: number;
};

const BASE_FORM_V1_DATA_FIELDS: readonly FormV1DataFieldMeta[] = [
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
    defaultTrackingPt: 9.35,
  },
  {
    id: "versichertennummer",
    editorLabel: "Daten: Versichertennummer (Tracking)",
    kind: "trackedText",
    sampleText: "A123456789",
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
    id: "aktuellesDatum",
    editorLabel: "Daten: Aktuelles Datum Platz 1 (ohne Punkte, Tracking wie Vers.-Nr.)",
    kind: "trackedText",
    sampleText: "07042026",
    defaultFontSizePt: 10,
    defaultTrackingPt: 9.95,
  },
  {
    id: "aktuellesDatum2",
    editorLabel: "Daten: Aktuelles Datum Platz 2 (gleicher Wert wie Platz 1)",
    kind: "trackedText",
    sampleText: "07042026",
    defaultFontSizePt: 10,
    defaultTrackingPt: 10.1,
  },
  {
    id: "kontaktTelefonisch",
    editorLabel: "Daten: Kontakt ☐ (nur Kästchen, ohne Text)",
    kind: "checkbox",
    sampleText: "",
    defaultFontSizePt: 11,
  },
  {
    id: "kontaktVideocall",
    editorLabel: "Daten: Kontakt ☐ Videocall (nur Kästchen)",
    kind: "checkbox",
    sampleText: "",
    defaultFontSizePt: 11,
  },
  {
    id: "unterschriftMaxMustermann",
    editorLabel: "Vektor-Unterschrift Max Mustermann (stilisiert)",
    kind: "signatureGraphic",
    sampleText: "",
    defaultFontSizePt: 11,
  },
];

const KATALOG_FORM_V1_DATA_FIELDS: FormV1DataFieldMeta[] = KONFIGURATOR_CATALOG.map((row) => {
  const id = katalogFieldIdForItem(row.id);
  const unitHint =
    row.unit === "ml"
      ? "Faktor = Σ(ml×Anz)/100"
      : row.unit === "count"
        ? "Anzahl Zeilen"
        : `Stück = ${row.piecesPerPack ?? "?"} × Anzahl`;
  return {
    id,
    editorLabel: `Konfigurator ${row.name} (${unitHint}, Tracking wie Vers.-Nr.)`,
    kind: "trackedText" as const,
    sampleText: "0",
    defaultFontSizePt: 9,
    defaultTrackingPt: 10.85,
  };
});

export const FORM_V1_DATA_FIELDS: readonly FormV1DataFieldMeta[] = [
  ...BASE_FORM_V1_DATA_FIELDS,
  ...KATALOG_FORM_V1_DATA_FIELDS,
];

const byId = Object.fromEntries(FORM_V1_DATA_FIELDS.map((d) => [d.id, d])) as Record<
  FormV1DataFieldId,
  FormV1DataFieldMeta
>;

export function getFormV1DataFieldMeta(id: FormV1DataFieldId): FormV1DataFieldMeta {
  return byId[id];
}

const KATALOG_ID_SET = new Set<number>(KONFIGURATOR_CATALOG.map((r) => r.id));

export function isFormV1DataFieldId(s: string): s is FormV1DataFieldId {
  if (s in byId) return true;
  if (!s.startsWith("katalog_")) return false;
  const n = Number(s.slice("katalog_".length));
  return Number.isInteger(n) && KATALOG_ID_SET.has(n);
}

export function parseKatalogFieldItemId(fieldId: string): KonfiguratorCatalogId | null {
  if (!fieldId.startsWith("katalog_")) return null;
  const n = Number(fieldId.slice("katalog_".length));
  return KATALOG_ID_SET.has(n) ? (n as KonfiguratorCatalogId) : null;
}
