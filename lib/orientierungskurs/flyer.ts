import { PDFDocument, PDFName, PDFString, StandardFonts, rgb } from "pdf-lib";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { COURSE_FORMAT_LABEL, courseTimeLabel, type CourseSlot } from "./slots";

export async function createCourseFlyer(course: CourseSlot, url: string, qr: Buffer): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  pdf.setTitle("Orientierungskurs – Einladung zur Teilnahme");
  pdf.setAuthor("Alltagshilfe-Süd");
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const qrImage = await pdf.embedPng(qr);
  const petrol = rgb(0.06, 0.31, 0.41);
  const ink = rgb(0.11, 0.17, 0.19);
  const muted = rgb(0.28, 0.34, 0.37);

  page.drawText("Alltagshilfe-Süd", { x: 56, y: 763, font: bold, size: 16, color: petrol });
  page.drawLine({ start: { x: 56, y: 740 }, end: { x: 539, y: 740 }, color: petrol, thickness: 1 });
  page.drawText("Orientierungskurs", { x: 56, y: 672, font: bold, size: 42, color: ink });
  page.drawText("Einladung für Mitarbeitende", { x: 56, y: 634, font: regular, size: 22, color: muted });
  page.drawRectangle({ x: 56, y: 501, width: 483, height: 98, color: rgb(0.94, 0.97, 0.98) });
  page.drawText(formatDateLongDe(course.slot_date), { x: 76, y: 563, font: bold, size: 20, color: petrol });
  page.drawText(courseTimeLabel(course.slot_time) + "  |  " + COURSE_FORMAT_LABEL[course.format], {
    x: 76, y: 528, font: regular, size: 17, color: ink,
  });

  page.drawText("Jetzt zur Teilnahme anmelden", { x: 56, y: 458, font: bold, size: 25, color: ink });
  page.drawText("QR-Code mit der Handykamera scannen oder den Link öffnen.", {
    x: 56, y: 426, font: regular, size: 15, color: muted,
  });
  page.drawImage(qrImage, { x: 167.5, y: 139, width: 260, height: 260 });

  const linkSize = Math.min(10, (10 * 483) / regular.widthOfTextAtSize(url, 10));
  const linkWidth = regular.widthOfTextAtSize(url, linkSize);
  const linkX = (page.getWidth() - linkWidth) / 2;
  page.drawText(url, { x: linkX, y: 124, font: regular, size: linkSize, color: petrol });
  const link = pdf.context.register(pdf.context.obj({
    Type: "Annot", Subtype: "Link", Rect: [linkX, 119, linkX + linkWidth, 137], Border: [0, 0, 0],
    A: { S: "URI", URI: PDFString.of(url) },
  }));
  page.node.set(PDFName.of("Annots"), pdf.context.obj([link]));
  page.drawText("Die Kursdetails kommen nach Ihrer Anmeldung per E-Mail.", {
    x: 56, y: 65, font: regular, size: 12, color: muted,
  });
  return Buffer.from(await pdf.save());
}
