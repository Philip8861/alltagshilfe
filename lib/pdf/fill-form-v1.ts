import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FORM_V1_FONT_SIZE_PT, FORM_V1_LAYOUT } from "@/lib/pdf/form-v1-layout";

export type FormV1FillInput = {
  vorname: string;
  nachname: string;
  /** ISO `YYYY-MM-DD` (wie z. B. aus date-Input) */
  geburtsdatumIso: string;
};

/** Feste Testdaten für Admin-Vorschau (`/partner/admin/pdf-form-preview`). */
export const FORM_V1_PREVIEW_SAMPLE: FormV1FillInput = {
  vorname: "Max",
  nachname: "Mustermann",
  geburtsdatumIso: "1990-03-15",
};

/** Entfernt Steuerzeichen; Standard-Fonts tolerieren keine beliebigen Unicode-Zeichen. */
function sanitizeFormText(s: string, maxLen: number): string {
  const t = s
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLen);
  return t;
}

/** `YYYY-MM-DD` → `DD.MM.YYYY` fürs Formular */
export function formatGeburtsdatumDe(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return sanitizeFormText(iso, 32);
  return `${m[3]}.${m[2]}.${m[1]}`;
}

/**
 * Befüllt die leere Vorlage-PDF (Bytes) mit Name und Geburtsdatum.
 * Die Vorlage muss dieselben Seitenmaße haben wie bei der Koordinaten-Ermittlung.
 */
export async function fillFormV1Pdf(
  templatePdfBytes: Uint8Array,
  data: FormV1FillInput,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(templatePdfBytes, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = FORM_V1_FONT_SIZE_PT;
  const black = rgb(0, 0, 0);

  const vor = sanitizeFormText(data.vorname, 80);
  const nach = sanitizeFormText(data.nachname, 80);
  const nameLine = nach && vor ? `${nach}, ${vor}` : nach || vor;

  const pName = FORM_V1_LAYOUT.nameUndVorname;
  const pBirth = FORM_V1_LAYOUT.geburtsdatum;

  const pages = doc.getPages();
  const page0 = pages[pName.pageIndex];
  const pageBirth = pages[pBirth.pageIndex];

  if (!page0 || !pageBirth) {
    throw new Error("PDF hat nicht genug Seiten für FORM_V1_LAYOUT.");
  }

  page0.drawText(nameLine, {
    x: pName.x,
    y: pName.y,
    size,
    font,
    color: black,
  });

  const birthText = sanitizeFormText(formatGeburtsdatumDe(data.geburtsdatumIso), 32);
  pageBirth.drawText(birthText, {
    x: pBirth.x,
    y: pBirth.y,
    size,
    font,
    color: black,
  });

  return doc.save();
}
