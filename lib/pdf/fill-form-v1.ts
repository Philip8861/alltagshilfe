import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { drawTextWithTracking } from "@/lib/pdf/draw-text-with-tracking";
import {
  FORM_V1_FONT_SIZE_PT,
  FORM_V1_GEBURT_TRACKING_PT,
  FORM_V1_LAYOUT,
  FORM_V1_VERS_TRACKING_PT,
  formV1PersonLineMaxWidthPt,
} from "@/lib/pdf/form-v1-layout";

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
};

/** Feste Testdaten für Admin-Vorschau (`/partner/admin/pdf-form-preview`). */
export const FORM_V1_PREVIEW_SAMPLE: FormV1FillInput = {
  vorname: "Max",
  nachname: "Mustermann",
  geburtsdatumIso: "1990-03-15",
  versichertennummer: "123456789012",
  anschriftStrasse: "Musterstraße",
  hausnummer: "12 a",
  plz: "87700",
  ort: "Memmingen",
  krankenkasse: "AOK Bayern",
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

/**
 * Eine Zeile: Vorname, Nachname, Straße, Hausnummer, PLZ, Ort (Leerzeichen).
 */
export function formatFormV1PersonUndAdresse(data: FormV1FillInput): string {
  const vor = sanitizeFormText(data.vorname, 80);
  const nach = sanitizeFormText(data.nachname, 80);
  const str = sanitizeFormText(data.anschriftStrasse, 80);
  const nr = sanitizeFormText(data.hausnummer, 15);
  const plz = sanitizeFormText(data.plz, 10);
  const ort = sanitizeFormText(data.ort, 80);
  return [vor, nach, str, nr, plz, ort].filter(Boolean).join(" ");
}

function maxPageIndex(): number {
  return Math.max(
    FORM_V1_LAYOUT.personUndAdresse.pageIndex,
    FORM_V1_LAYOUT.geburtsdatum.pageIndex,
    FORM_V1_LAYOUT.versichertennummer.pageIndex,
    FORM_V1_LAYOUT.krankenkasse.pageIndex,
  );
}

function formV1KrankenkasseMaxWidthPt(pageWidth: number): number {
  const rightMarginPt = 36;
  return Math.max(80, pageWidth - FORM_V1_LAYOUT.krankenkasse.x - rightMarginPt);
}

/**
 * Befüllt die leere Vorlage-PDF (Bytes).
 */
export async function fillFormV1Pdf(
  templatePdfBytes: Uint8Array,
  data: FormV1FillInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(templatePdfBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = FORM_V1_FONT_SIZE_PT;
  const lineHeight = size * 1.2;
  const black = rgb(0, 0, 0);

  const pPerson = FORM_V1_LAYOUT.personUndAdresse;
  const pBirth = FORM_V1_LAYOUT.geburtsdatum;
  const pVers = FORM_V1_LAYOUT.versichertennummer;
  const pKk = FORM_V1_LAYOUT.krankenkasse;

  const pages = doc.getPages();
  if (pages.length <= maxPageIndex()) {
    throw new Error("PDF hat nicht genug Seiten für FORM_V1_LAYOUT.");
  }

  const pagePerson = pages[pPerson.pageIndex]!;
  const pageBirth = pages[pBirth.pageIndex]!;
  const pageVers = pages[pVers.pageIndex]!;
  const pageKk = pages[pKk.pageIndex]!;

  const pageWidth = pagePerson.getWidth();

  const personLine = formatFormV1PersonUndAdresse(data);
  const personMaxW = formV1PersonLineMaxWidthPt();
  pagePerson.drawText(personLine, {
    x: pPerson.x,
    y: pPerson.y,
    size,
    font,
    color: black,
    maxWidth: personMaxW,
    lineHeight,
  });

  const birthText = sanitizeFormText(formatGeburtsdatumOhnePunkte(data.geburtsdatumIso), 8);
  drawTextWithTracking(pageBirth, birthText, {
    x: pBirth.x,
    y: pBirth.y,
    size,
    font,
    color: black,
    trackingPt: FORM_V1_GEBURT_TRACKING_PT,
  });

  const versText = sanitizeVersichertennummer(data.versichertennummer, 24);
  drawTextWithTracking(pageVers, versText, {
    x: pVers.x,
    y: pVers.y,
    size,
    font,
    color: black,
    trackingPt: FORM_V1_VERS_TRACKING_PT,
  });

  const kkText = sanitizeFormText(data.krankenkasse, 120);
  pageKk.drawText(kkText, {
    x: pKk.x,
    y: pKk.y,
    size,
    font,
    color: black,
    maxWidth: formV1KrankenkasseMaxWidthPt(pageWidth),
    lineHeight,
  });

  return doc.save();
}
