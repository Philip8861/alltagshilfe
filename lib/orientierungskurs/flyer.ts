import { PDFDocument, PDFString, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { COURSE_FORMAT_LABEL, courseTimeLabel } from "./slots";
import type { Booking } from "./store";

function venueText(course: Booking, font: PDFFont, fieldWidth: number): string {
  if (course.format === "online") return "Online (Zugang per E-Mail nach der Anmeldung)";
  const fallback = "Adresse und Raum siehe Teilnahmebestätigung";
  const venue = [course.address, course.room].filter(Boolean).join(" | ").replace(/\s+/g, " ").trim();
  try {
    return font.widthOfTextAtSize(venue, 8) <= fieldWidth - 8 ? venue : fallback;
  } catch {
    return fallback;
  }
}

export async function createCourseFlyer(
  template: ArrayBuffer,
  course: Booking,
  url: string,
  qr: Buffer,
): Promise<Buffer> {
  const pdf = await PDFDocument.load(template, { updateMetadata: false });
  const page = pdf.getPage(0);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const form = pdf.getForm();
  const venueField = form.getTextField("kurs_ort");
  const venueWidth = venueField.acroField.getWidgets()[0].getRectangle().width;
  const fields = [
    ["kurs_datum", formatDateLongDe(course.slot_date)],
    ["kurs_uhrzeit", courseTimeLabel(course.slot_time).replace("–", "-")],
    ["kurs_ort", venueText(course, font, venueWidth)],
    ["kurs_format", COURSE_FORMAT_LABEL[course.format]],
  ] as const;

  for (const [name, value] of fields) {
    const field = form.getTextField(name);
    const { width } = field.acroField.getWidgets()[0].getRectangle();
    field.setFontSize(Math.min(11, (width - 8) / font.widthOfTextAtSize(value, 1)));
    field.setText(value);
  }
  form.updateFieldAppearances(font);
  form.flatten({ updateFieldAppearances: false });

  // Der weiße QR-Platzhalter gehört zum festen Layout dieser Vorlagenversion.
  const qrImage = await pdf.embedPng(qr);
  page.drawImage(qrImage, { x: 430.5, y: 74.5, width: 109, height: 109 });

  const linkLabel = "Anmeldelink öffnen";
  const linkWidth = font.widthOfTextAtSize(linkLabel, 11);
  const linkColor = rgb(0.04, 0.28, 0.38);
  page.drawText(linkLabel, { x: 56, y: 86, font, size: 11, color: linkColor });
  page.drawLine({ start: { x: 56, y: 84 }, end: { x: 56 + linkWidth, y: 84 }, thickness: 0.6, color: linkColor });

  for (const rect of [[36, 168, 271, 205], [53, 82, 59 + linkWidth, 100], [430, 74, 540, 184]]) {
    const annotation = pdf.context.register(pdf.context.obj({
      Type: "Annot", Subtype: "Link", Rect: rect, Border: [0, 0, 0], A: { S: "URI", URI: PDFString.of(url) },
    }));
    page.node.addAnnot(annotation);
  }
  const attachment = await PDFDocument.create();
  const [finishedPage] = await attachment.copyPages(pdf, [0]);
  attachment.addPage(finishedPage);
  attachment.setTitle("Einladung zum Orientierungskurs – Pflege und Beruf");
  attachment.setAuthor("Alltagshilfe-Süd");
  return Buffer.from(await attachment.save());
}
