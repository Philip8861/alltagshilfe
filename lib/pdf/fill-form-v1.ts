import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { drawCheckboxWithLabel } from "@/lib/pdf/draw-checkbox";
import { drawTextWithTracking } from "@/lib/pdf/draw-text-with-tracking";
import {
  FORM_V1_FONT_SIZE_PT,
  FORM_V1_GEBURT_TRACKING_PT,
  FORM_V1_LAYOUT,
  FORM_V1_VERS_TRACKING_PT,
  formV1NameLineMaxWidthPt,
  formV1StrasseLineMaxWidthPt,
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
  kontaktTelefonisch: boolean;
  kontaktVideocall: boolean;
  kontaktGeschaeftsraeume: boolean;
};

function formV1KrankenkasseMaxWidthPtLocal(pageWidth: number): number {
  const rightMarginPt = 36;
  return Math.max(80, pageWidth - FORM_V1_LAYOUT.krankenkasse.x - rightMarginPt);
}

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
  kontaktTelefonisch: true,
  kontaktVideocall: false,
  kontaktGeschaeftsraeume: false,
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

function maxPageIndex(): number {
  const idx = [
    FORM_V1_LAYOUT.vornameNachname.pageIndex,
    FORM_V1_LAYOUT.strassePlzOrt.pageIndex,
    FORM_V1_LAYOUT.geburtsdatum.pageIndex,
    FORM_V1_LAYOUT.versichertennummer.pageIndex,
    FORM_V1_LAYOUT.krankenkasse.pageIndex,
    FORM_V1_LAYOUT.unterschriftLabel.pageIndex,
  ];
  return Math.max(...idx);
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

  const pName = FORM_V1_LAYOUT.vornameNachname;
  const pStr = FORM_V1_LAYOUT.strassePlzOrt;
  const pBirth = FORM_V1_LAYOUT.geburtsdatum;
  const pVers = FORM_V1_LAYOUT.versichertennummer;
  const pKk = FORM_V1_LAYOUT.krankenkasse;
  const pSigLabel = FORM_V1_LAYOUT.unterschriftLabel;
  const pSigLine = FORM_V1_LAYOUT.unterschriftLinie;

  const pages = doc.getPages();
  if (pages.length <= maxPageIndex()) {
    throw new Error("PDF hat nicht genug Seiten für FORM_V1_LAYOUT.");
  }

  const pageName = pages[pName.pageIndex]!;
  const pageStr = pages[pStr.pageIndex]!;
  const pageBirth = pages[pBirth.pageIndex]!;
  const pageVers = pages[pVers.pageIndex]!;
  const pageKk = pages[pKk.pageIndex]!;
  const pageSig = pages[pSigLabel.pageIndex]!;

  const pageWidth = pageName.getWidth();

  const nameLine = formatFormV1VornameNachname(data);
  pageName.drawText(nameLine, {
    x: pName.x,
    y: pName.y,
    size,
    font,
    color: black,
    maxWidth: formV1NameLineMaxWidthPt(),
    lineHeight,
  });

  const strLine = formatFormV1StrassePlzOrt(data);
  pageStr.drawText(strLine, {
    x: pStr.x,
    y: pStr.y,
    size,
    font,
    color: black,
    maxWidth: formV1StrasseLineMaxWidthPt(),
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
    maxWidth: formV1KrankenkasseMaxWidthPtLocal(pageWidth),
    lineHeight,
  });

  const rowY = FORM_V1_LAYOUT.kontaktCheckboxRowY;
  drawCheckboxWithLabel(pageSig, {
    boxLeftX: FORM_V1_LAYOUT.kontaktBoxTelefonischX,
    yBaseline: rowY,
    checked: data.kontaktTelefonisch,
    label: "Telefonisch",
    font,
    fontSizePt: size,
  });
  drawCheckboxWithLabel(pageSig, {
    boxLeftX: FORM_V1_LAYOUT.kontaktBoxVideocallX,
    yBaseline: rowY,
    checked: data.kontaktVideocall,
    label: "Per Videocall",
    font,
    fontSizePt: size,
  });
  drawCheckboxWithLabel(pageSig, {
    boxLeftX: FORM_V1_LAYOUT.kontaktBoxGeschaeftsraeumeX,
    yBaseline: rowY,
    checked: data.kontaktGeschaeftsraeume,
    label: "In den Geschäftsräumen",
    font,
    fontSizePt: size,
  });

  pageSig.drawText("Unterschrift", {
    x: pSigLabel.x,
    y: pSigLabel.y,
    size: size - 1,
    font,
    color: rgb(0.25, 0.25, 0.25),
  });
  pageSig.drawLine({
    start: { x: pSigLine.x1, y: pSigLine.y },
    end: { x: pSigLine.x2, y: pSigLine.y },
    thickness: 0.6,
    color: black,
  });

  return doc.save();
}
