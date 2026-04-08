import { degrees, PDFDocument, StandardFonts, rgb } from "pdf-lib";
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
  FORM_V1_GEBURT_TRACKING_PT,
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
  /**
   * Nur wenn gesetzt: Kontakt-Kästchen (ohne Beschriftungstext) werden gezeichnet.
   * Weglassen → keine Checkboxen.
   */
  kontakt?: {
    telefonisch: boolean;
    videocall: boolean;
  };
  /**
   * Wenn Telefon- und Video-Kästchen dieselbe PDF-Position haben: ein Kästchen,
   * angehakt wenn persönliche Beratung gewünscht (inkl. Vor-Ort).
   * Ohne Setzen: bei gemeinsamer Position → telefonisch || videocall.
   */
  kontaktMergedChecked?: boolean;
  /** Konfigurator-Warenkorb für Katalog-Felder (Mengen/Faktoren). */
  konfiguratorLines?: KonfiguratorCartLine[];
  /** Stilisierte Vektor-Unterschrift „Max Mustermann“ (Vorschau). */
  drawMaxMustermannSignature: boolean;
  /** Kunden-Unterschrift aus dem Wizard (PNG-Bytes); hat Vorrang vor Max Mustermann. */
  signaturePngBytes?: Uint8Array;
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
  kontakt: { telefonisch: true, videocall: false },
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

/** Aus `DD.MM.YYYY` bzw. manueller Eingabe → `DDMMYYYY` für getrackte Kästchenfelder. */
function resolveAktuellesDatumOhnePunkte(data: FormV1FillInput): string {
  const de = resolveAktuellesDatumDe(data);
  const digits = de.replace(/\D/g, "");
  return sanitizeFormText(digits.slice(0, 8), 8);
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
  "aktuellesDatum2",
  "kontaktTelefonisch",
  "kontaktVideocall",
];

const DRAW_ORDER_KATALOG: FormV1DataFieldId[] = KONFIGURATOR_CATALOG_IDS.map(
  (id) => `katalog_${id}` as FormV1DataFieldId,
);

const DRAW_ORDER_TAIL: FormV1DataFieldId[] = ["unterschriftMaxMustermann"];

const DRAW_ORDER: FormV1DataFieldId[] = [...DRAW_ORDER_BASE, ...DRAW_ORDER_KATALOG, ...DRAW_ORDER_TAIL];

function maxPageIndex(): number {
  let m = 0;
  for (const p of Object.values(FORM_V1_PLACEMENTS)) {
    m = Math.max(m, p.pageIndex);
  }
  return m;
}

function kontaktCheckboxChecked(fieldId: FormV1DataFieldId, data: FormV1FillInput): boolean {
  const k = data.kontakt;
  if (!k) return false;
  switch (fieldId) {
    case "kontaktTelefonisch":
      return k.telefonisch;
    case "kontaktVideocall":
      return k.videocall;
    default:
      return false;
  }
}

function sameCheckboxPlacement(
  a: (typeof FORM_V1_PLACEMENTS)[FormV1DataFieldId],
  b: (typeof FORM_V1_PLACEMENTS)[FormV1DataFieldId],
): boolean {
  if (a.kind !== "checkbox" || b.kind !== "checkbox") return false;
  return (
    a.pageIndex === b.pageIndex &&
    a.boxLeftX === b.boxLeftX &&
    a.yBaseline === b.yBaseline &&
    a.fontSizePt === b.fontSizePt
  );
}

const KONTAKT_CHECKBOX_SAME_SPOT = sameCheckboxPlacement(
  FORM_V1_PLACEMENTS.kontaktTelefonisch,
  FORM_V1_PLACEMENTS.kontaktVideocall,
);

function kontaktMergedCheckboxChecked(data: FormV1FillInput): boolean {
  if (data.kontaktMergedChecked != null) return data.kontaktMergedChecked;
  const k = data.kontakt;
  if (!k) return false;
  return k.telefonisch || k.videocall;
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
        if (!t) continue;
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
        if (!t) continue;
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
        if (!birthText) continue;
        const tr = placement.trackingPt ?? meta.defaultTrackingPt ?? FORM_V1_GEBURT_TRACKING_PT;
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
        if (!versText) continue;
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
        if (!kkText) continue;
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
      if (fieldId === "aktuellesDatum" || fieldId === "aktuellesDatum2") {
        const dText = resolveAktuellesDatumOhnePunkte(data);
        if (!dText) continue;
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
      if (data.kontakt == null) continue;
      if (fieldId === "kontaktVideocall" && KONTAKT_CHECKBOX_SAME_SPOT) continue;
      const label = meta.checkboxLabel ?? "";
      const checked =
        fieldId === "kontaktTelefonisch" && KONTAKT_CHECKBOX_SAME_SPOT
          ? kontaktMergedCheckboxChecked(data)
          : kontaktCheckboxChecked(fieldId, data);
      drawCheckboxWithLabel(page, {
        boxLeftX: placement.boxLeftX,
        yBaseline: placement.yBaseline,
        checked,
        label,
        font,
        fontSizePt: placement.fontSizePt,
      });
      continue;
    }

    if (placement.kind === "signatureGraphic") {
      const png = data.signaturePngBytes;
      if (png && png.length > 0) {
        try {
          const img = await doc.embedPng(png);
          const iw = img.width;
          const ih = img.height;
          const maxWPt = Math.max(36, 72 * placement.scale);
          const s = maxWPt / iw;
          const dw = iw * s;
          const dh = ih * s;
          page.drawImage(img, {
            x: placement.x,
            y: placement.y,
            width: dw,
            height: dh,
            rotate: degrees(placement.rotateDeg),
          });
        } catch {
          /* Ungültige Signatur-Bytes — PDF ohne Bild fortführen */
        }
      } else if (data.drawMaxMustermannSignature) {
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
  }

  return doc.save();
}
