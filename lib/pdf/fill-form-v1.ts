import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { drawCheckmarkOnly } from "@/lib/pdf/draw-checkmark-only";
import { drawCheckboxWithLabel } from "@/lib/pdf/draw-checkbox";
import { drawMaxMustermannSignature } from "@/lib/pdf/draw-max-mustermann-signature";
import { drawTextWithTracking } from "@/lib/pdf/draw-text-with-tracking";
import {
  getFormV1DataFieldMeta,
  parseKatalogFieldItemId,
  type FormV1DataFieldId,
} from "@/lib/pdf/form-v1-data-fields";
import { FORM_V1_PLACEMENTS } from "@/lib/pdf/form-v1-placements";
import {
  FORM_V1_VERS_TRACKING_PT,
  formV1NameLineMaxWidthPt,
  formV1StrasseLineMaxWidthPt,
} from "@/lib/pdf/form-v1-layout";
import {
  computeKonfiguratorFieldValue,
  KONFIGURATOR_CATALOG_IDS,
  type KonfiguratorCartLine,
} from "@/lib/pdf/konfigurator-catalog";

export type FormV1FillInput = {
  vorname: string;
  nachname: string;
  /** ISO `YYYY-MM-DD` (wie z. B. aus date-Input) */
  geburtsdatumIso: string;
  versichertennummer: string;
  anschriftStrasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  krankenkasse: string;
  /**
   * Bestell-/Abschlussdatum fürs PDF (lesbar, z. B. DD.MM.YYYY).
   * Weglassen oder leer → beim PDF-Erzeugen: heutiges Datum (Europe/Berlin).
   */
  aktuellesDatumDe?: string;
  kontaktTelefonisch: boolean;
  kontaktVideocall: boolean;
  kontaktGeschaeftsraeume: boolean;
  /** Freie Hakenpositionen (nur Kreuz an fester Koordinate). */
  haken1: boolean;
  haken2: boolean;
  haken3: boolean;
  haken4: boolean;
  haken5: boolean;
  /** Konfigurator-Warenkorb für Katalog-Felder (Mengen/Faktoren). */
  konfiguratorLines?: KonfiguratorCartLine[];
  /** Stilisierte Vektor-Unterschrift „Max Mustermann“ über der Linie. */
  drawMaxMustermannSignature: boolean;
};

function formV1KrankenkasseMaxWidthPtLocal(pageWidth: number, krankenkasseLeftX: number): number {
  const rightMarginPt = 36;
  return Math.max(80, pageWidth - krankenkasseLeftX - rightMarginPt);
}

/**
 * Admin-Vorschau: jeder Katalog-Artikel genau 1×, um die PDF-Zahlen pro Feld zu prüfen.
 * ml-Artikel (9111, 9112): je 1500 ml → Faktor Σml/100 = 15.
 */
const FORM_V1_PREVIEW_KONFIGURATOR_LINES: KonfiguratorCartLine[] = [
  { id: 9102, count: 1 },
  { id: 9109, count: 1 },
  { id: 9111, count: 1, selectedMl: 1500 },
  { id: 9112, count: 1, selectedMl: 1500 },
  { id: 9104, count: 1 },
  { id: 9113, count: 1 },
  { id: 9101, count: 1 },
  { id: 9110, count: 1 },
  { id: 9103, count: 1 },
  { id: 9107, count: 1 },
  { id: 9105, count: 1 },
  { id: 9108, count: 1 },
];

/** Feste Testdaten für Admin-Vorschau (`/partner/admin/pdf-form-preview`). */
export const FORM_V1_PREVIEW_SAMPLE: FormV1FillInput = {
  vorname: "Max",
  nachname: "Mustermann",
  geburtsdatumIso: "1990-03-15",
  versichertennummer: "A123456789",
  anschriftStrasse: "Musterstraße",
  hausnummer: "12 a",
  plz: "87700",
  ort: "Memmingen",
  krankenkasse: "AOK Bayern",
  aktuellesDatumDe: "07.04.2026",
  kontaktTelefonisch: true,
  kontaktVideocall: false,
  kontaktGeschaeftsraeume: false,
  haken1: true,
  haken2: false,
  haken3: true,
  haken4: false,
  haken5: false,
  konfiguratorLines: FORM_V1_PREVIEW_KONFIGURATOR_LINES,
  drawMaxMustermannSignature: true,
};

/** Entfernt Steuerzeichen; Standard-Fonts tolerieren keine beliebigen Unicode-Zeichen. */
function sanitizeFormText(s: string, maxLen: number): string {
  const t = s
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
  return t;
}

function sanitizeVersichertennummer(s: string, maxLen: number): string {
  return sanitizeFormText(s.replace(/\s+/g, ""), maxLen);
}

/** Heutiges Datum in Europe/Berlin als `de-DE` Kurzdatum (für Bestell-PDF). */
export function formatHeuteDeBerlin(date: Date = new Date()): string {
  return date.toLocaleDateString("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function resolveAktuellesDatumDe(data: FormV1FillInput): string {
  const manual = data.aktuellesDatumDe?.trim();
  if (manual) return sanitizeFormText(manual, 32);
  return formatHeuteDeBerlin();
}

/** `YYYY-MM-DD` → `DD.MM.YYYY` (nur falls noch woanders gebraucht). */
export function formatGeburtsdatumDe(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return sanitizeFormText(iso, 32);
  return `${m[3]}.${m[2]}.${m[1]}`;
}

/** `YYYY-MM-DD` → `DDMMYYYY` ohne Punkte (Kästchenfeld). */
export function formatGeburtsdatumOhnePunkte(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return sanitizeFormText(iso.replace(/\D/g, ""), 8);
  return `${m[3]}${m[2]}${m[1]}`;
}

/** Vorname und Nachname, Leerzeichen getrennt. */
export function formatFormV1VornameNachname(data: Pick<FormV1FillInput, "vorname" | "nachname">): string {
  const vor = sanitizeFormText(data.vorname, 80);
  const nach = sanitizeFormText(data.nachname, 80);
  return [vor, nach].filter(Boolean).join(" ");
}

/** Straße, Hausnummer, PLZ, Ort. */
export function formatFormV1StrassePlzOrt(
  data: Pick<FormV1FillInput, "anschriftStrasse" | "hausnummer" | "plz" | "ort">,
): string {
  const str = sanitizeFormText(data.anschriftStrasse, 80);
  const nr = sanitizeFormText(data.hausnummer, 15);
  const plz = sanitizeFormText(data.plz, 10);
  const ort = sanitizeFormText(data.ort, 80);
  return [str, nr, plz, ort].filter(Boolean).join(" ");
}

const DRAW_ORDER_BASE: FormV1DataFieldId[] = [
  "vornameNachname",
  "strassePlzOrt",
  "geburtsdatum",
  "versichertennummer",
  "krankenkasse",
  "aktuellesDatum",
  "kontaktTelefonisch",
  "kontaktVideocall",
  "kontaktGeschaeftsraeume",
  "haken1",
  "haken2",
  "haken3",
  "haken4",
  "haken5",
];

const DRAW_ORDER_KATALOG: FormV1DataFieldId[] = KONFIGURATOR_CATALOG_IDS.map(
  (id) => `katalog_${id}` as FormV1DataFieldId,
);

const DRAW_ORDER_TAIL: FormV1DataFieldId[] = [
  "unterschriftLabel",
  "unterschriftMaxMustermann",
  "unterschriftLinie",
];

const DRAW_ORDER: FormV1DataFieldId[] = [...DRAW_ORDER_BASE, ...DRAW_ORDER_KATALOG, ...DRAW_ORDER_TAIL];

function maxPageIndex(): number {
  let m = 0;
  for (const p of Object.values(FORM_V1_PLACEMENTS)) {
    m = Math.max(m, p.pageIndex);
  }
  return m;
}

function checkboxOrHakenChecked(fieldId: FormV1DataFieldId, data: FormV1FillInput): boolean {
  switch (fieldId) {
    case "kontaktTelefonisch":
      return data.kontaktTelefonisch;
    case "kontaktVideocall":
      return data.kontaktVideocall;
    case "kontaktGeschaeftsraeume":
      return data.kontaktGeschaeftsraeume;
    case "haken1":
      return data.haken1;
    case "haken2":
      return data.haken2;
    case "haken3":
      return data.haken3;
    case "haken4":
      return data.haken4;
    case "haken5":
      return data.haken5;
    default:
      return false;
  }
}

/**
 * Befüllt die leere Vorlage-PDF (Bytes). Nutzt Koordinaten aus `FORM_V1_PLACEMENTS`.
 */
export async function fillFormV1Pdf(
  templatePdfBytes: Uint8Array,
  data: FormV1FillInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(templatePdfBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const black = rgb(0, 0, 0);

  const pages = doc.getPages();
  if (pages.length <= maxPageIndex()) {
    throw new Error("PDF hat nicht genug Seiten für FORM_V1_PLACEMENTS.");
  }

  const lineHeight = (size: number) => size * 1.2;

  for (const fieldId of DRAW_ORDER) {
    const placement = FORM_V1_PLACEMENTS[fieldId];
    const meta = getFormV1DataFieldMeta(fieldId);
    const page = pages[placement.pageIndex]!;
    const pageWidth = page.getWidth();

    if (placement.kind === "text") {
      const size = placement.fontSizePt;
      const lh = lineHeight(size);
      const kId = parseKatalogFieldItemId(fieldId);

      if (kId != null) {
        const v = computeKonfiguratorFieldValue(kId, data.konfiguratorLines);
        const t = sanitizeFormText(v, 32);
        if (t) {
          const tr = placement.trackingPt ?? FORM_V1_VERS_TRACKING_PT;
          drawTextWithTracking(page, t, {
            x: placement.x,
            y: placement.y,
            size,
            font,
            color: black,
            trackingPt: tr,
          });
        }
        continue;
      }

      if (fieldId === "vornameNachname") {
        const t = formatFormV1VornameNachname(data);
        page.drawText(t, {
          x: placement.x,
          y: placement.y,
          size,
          font,
          color: black,
          maxWidth: formV1NameLineMaxWidthPt(),
          lineHeight: lh,
        });
        continue;
      }
      if (fieldId === "strassePlzOrt") {
        const t = formatFormV1StrassePlzOrt(data);
        page.drawText(t, {
          x: placement.x,
          y: placement.y,
          size,
          font,
          color: black,
          maxWidth: formV1StrasseLineMaxWidthPt(),
          lineHeight: lh,
        });
        continue;
      }
      if (fieldId === "geburtsdatum") {
        const birthText = sanitizeFormText(formatGeburtsdatumOhnePunkte(data.geburtsdatumIso), 8);
        const tr = placement.trackingPt ?? meta.defaultTrackingPt ?? FORM_V1_VERS_TRACKING_PT;
        drawTextWithTracking(page, birthText, {
          x: placement.x,
          y: placement.y,
          size,
          font,
          color: black,
          trackingPt: tr,
        });
        continue;
      }
      if (fieldId === "versichertennummer") {
        const versText = sanitizeVersichertennummer(data.versichertennummer, 24);
        const tr = placement.trackingPt ?? meta.defaultTrackingPt ?? FORM_V1_VERS_TRACKING_PT;
        drawTextWithTracking(page, versText, {
          x: placement.x,
          y: placement.y,
          size,
          font,
          color: black,
          trackingPt: tr,
        });
        continue;
      }
      if (fieldId === "krankenkasse") {
        const kkText = sanitizeFormText(data.krankenkasse, 120);
        const maxW = formV1KrankenkasseMaxWidthPtLocal(pageWidth, placement.x);
        page.drawText(kkText, {
          x: placement.x,
          y: placement.y,
          size,
          font,
          color: black,
          maxWidth: maxW,
          lineHeight: lh,
        });
        continue;
      }
      if (fieldId === "aktuellesDatum") {
        const dText = resolveAktuellesDatumDe(data);
        const tr = placement.trackingPt ?? meta.defaultTrackingPt ?? FORM_V1_VERS_TRACKING_PT;
        drawTextWithTracking(page, dText, {
          x: placement.x,
          y: placement.y,
          size,
          font,
          color: black,
          trackingPt: tr,
        });
        continue;
      }
      continue;
    }

    if (placement.kind === "checkbox") {
      const label = meta.checkboxLabel ?? "";
      drawCheckboxWithLabel(page, {
        boxLeftX: placement.boxLeftX,
        yBaseline: placement.yBaseline,
        checked: checkboxOrHakenChecked(fieldId, data),
        label,
        font,
        fontSizePt: placement.fontSizePt,
      });
      continue;
    }

    if (placement.kind === "checkmarkOnly") {
      if (checkboxOrHakenChecked(fieldId, data)) {
        drawCheckmarkOnly(page, {
          boxLeftX: placement.boxLeftX,
          yBaseline: placement.yBaseline,
          fontSizePt: placement.fontSizePt,
        });
      }
      continue;
    }

    if (placement.kind === "signatureLabel") {
      page.drawText(meta.sampleText || "Unterschrift", {
        x: placement.x,
        y: placement.y,
        size: placement.fontSizePt,
        font,
        color: rgb(0.25, 0.25, 0.25),
      });
      continue;
    }

    if (placement.kind === "signatureGraphic") {
      if (data.drawMaxMustermannSignature) {
        drawMaxMustermannSignature(page, {
          x: placement.x,
          y: placement.y,
          scale: placement.scale,
          rotateDeg: placement.rotateDeg,
          borderWidth: placement.borderWidth,
        });
      }
      continue;
    }

    if (placement.kind === "signatureLine") {
      page.drawLine({
        start: { x: placement.x1, y: placement.y },
        end: { x: placement.x2, y: placement.y },
        thickness: 0.6,
        color: black,
      });
    }
  }

  return doc.save();
}
