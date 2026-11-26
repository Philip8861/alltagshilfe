import { readFile } from "node:fs/promises";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFString, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { COURSE_CONTACT_EMAIL } from "./config";
import { courseTimeLabel } from "./slots";
import type { Booking } from "./store";

const labelColor = rgb(8 / 255, 73 / 255, 99 / 255);
const valueColor = rgb(0.07, 0.19, 0.24);
const background = rgb(235 / 255, 244 / 255, 246 / 255);
const fieldBorder = rgb(212 / 255, 229 / 255, 233 / 255);
const fieldFill = rgb(1, 1, 1);

function venueLines(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  let line = "";
  let lastSpace = -1;
  for (const character of text) {
    if (font.widthOfTextAtSize(line + character, size) > width) {
      const length = lastSpace > 0 ? lastSpace : line.length;
      lines.push(line.slice(0, length));
      line = line.slice(length).trimStart();
      lastSpace = line.lastIndexOf(" ");
    }
    if (character === " ") lastSpace = line.length;
    line += character;
  }
  return [...lines, line.trim()];
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
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const form = pdf.getForm();
  const fields = [
    ["kurs_datum", formatDateLongDe(course.slot_date)],
    ["kurs_uhrzeit", courseTimeLabel(course.slot_time).replace("–", "-")],
  ] as const;

  for (const [name, value] of fields) {
    const field = form.getTextField(name);
    const { width } = field.acroField.getWidgets()[0].getRectangle();
    field.setFontSize(Math.min(11, (width - 8) / font.widthOfTextAtSize(value, 1)));
    field.setText(value);
  }
  form.updateFieldAppearances(font);
  form.flatten({ updateFieldAppearances: false });

  function drawField(x: number, y: number, width: number, height: number) {
    page.drawRectangle({ x, y, width, height, color: fieldFill, borderColor: fieldBorder, borderWidth: 0.55 });
  }

  if (course.format === "online") {
    for (const field of [
      { label: "Ort", value: "Online (Zugang per E-Mail nach der Anmeldung)", x: 50, width: 283 },
      { label: "Teilnahmeformat", value: "Online", x: 347, width: 198.3 },
    ]) {
      page.drawText(field.label, { x: field.x, y: 250.6, size: 9.3, font: bold, color: labelColor });
      drawField(field.x, 226.9, field.width, 19);
      page.drawText(field.value, { x: field.x + 3, y: 232.3, size: 11, font, color: valueColor });
    }
  } else {
    pdf.registerFontkit(fontkit);
    const venueFont = await pdf.embedFont(
      await readFile(join(process.cwd(), "node_modules/pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf")), { subset: true },
    );
    const room = course.room && (/^Raum(?:\s|$)/i.test(course.room) ? course.room : "Raum " + course.room);
    const venue = [course.company, course.address, room].filter(Boolean).join(", ").replace(/\s+/g, " ").trim();

    page.drawRectangle({ x: 47, y: 224, width: 501.5, height: 23, color: background });
    const label = "Teilnahmeformat:";
    page.drawText(label, { x: 50, y: 250.6, size: 9.5, font: bold, color: labelColor });
    page.drawText("Im Betrieb", {
      x: 54 + bold.widthOfTextAtSize(label, 9.5), y: 250.6, size: 10.5, font, color: valueColor,
    });

    let size = 11;
    let lines = venueLines(venue, venueFont, size, 486);
    while (lines.length * size * 1.14 + 6 > 33) {
      size -= 0.5;
      lines = venueLines(venue, venueFont, size, 486);
    }
    const lineHeight = size * 1.14;
    const height = Math.max(19, lines.length * lineHeight + 6);
    const top = 244;
    if (top - height < 222) {
      page.drawRectangle({ x: 36, y: top - height - 3, width: 523.3, height: height - 13, color: background });
    }
    drawField(50, top - height, 495.3, height);
    lines.forEach((line, index) => page.drawText(line, {
      x: 54, y: top - size - 3 - index * lineHeight, font: venueFont, size, color: valueColor,
    }));
  }

  // Der weiße QR-Platzhalter gehört zum festen Layout dieser Vorlagenversion.
  const qrImage = await pdf.embedPng(qr);
  page.drawImage(qrImage, { x: 430.5, y: 74.5, width: 109, height: 109 });

  const linkLabel = "Anmeldelink öffnen";
  const linkWidth = font.widthOfTextAtSize(linkLabel, 11);
  const linkColor = rgb(0.04, 0.28, 0.38);
  const contactSize = Math.min(9.2, 154 / font.widthOfTextAtSize(COURSE_CONTACT_EMAIL, 1));
  page.drawText(COURSE_CONTACT_EMAIL, { x: 212.34, y: 24.69, font, size: contactSize, color: labelColor });
  page.drawText(linkLabel, { x: 56, y: 86, font, size: 11, color: linkColor });
  page.drawLine({ start: { x: 56, y: 84 }, end: { x: 56 + linkWidth, y: 84 }, thickness: 0.6, color: linkColor });

  const annotations = [
    { rect: [36, 168, 271, 205], href: url },
    { rect: [53, 82, 59 + linkWidth, 100], href: url },
    { rect: [430, 74, 540, 184], href: url },
    { rect: [212.34, 22.68, 212.34 + font.widthOfTextAtSize(COURSE_CONTACT_EMAIL, contactSize), 34.9],
      href: "mailto:" + COURSE_CONTACT_EMAIL },
  ];
  for (const { rect, href } of annotations) {
    const annotation = pdf.context.register(pdf.context.obj({
      Type: "Annot", Subtype: "Link", Rect: rect, Border: [0, 0, 0], A: { S: "URI", URI: PDFString.of(href) },
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
