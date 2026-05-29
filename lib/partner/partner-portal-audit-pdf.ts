import "server-only";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  PARTNER_PORTAL_AUDIT_EVENT_LABELS,
  type PartnerPortalAuditLogRow,
} from "@/lib/partner/partner-portal-audit-log-shared";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const LINE = 13;
const FOOTER = 28;

function wrapLines(text: string, maxChars: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

function fmtDe(iso: string): string {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      timeZone: "Europe/Berlin",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export async function buildPartnerPortalAuditPdf(
  periodKey: string,
  events: PartnerPortalAuditLogRow[],
  subjectNames: Map<string, string>,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const draw = (text: string, bold = false, size = 10) => {
    if (y < MARGIN + FOOTER) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
    page.drawText(text, {
      x: MARGIN,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0.08, 0.2, 0.28),
    });
    y -= LINE;
  };

  draw("Partnerportal — Aktivitätsverlauf", true, 14);
  draw(`Zeitraum: ${periodKey}`, false, 11);
  draw(`Erstellt: ${fmtDe(new Date().toISOString())}`, false, 9);
  draw(`Einträge: ${events.length}`, false, 9);
  y -= 6;

  const chronological = [...events].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  for (const ev of chronological) {
    const kind =
      PARTNER_PORTAL_AUDIT_EVENT_LABELS[ev.event_kind as keyof typeof PARTNER_PORTAL_AUDIT_EVENT_LABELS] ??
      ev.event_kind;
    const subject =
      (ev.subject_partner_id && subjectNames.get(ev.subject_partner_id)) || ev.subject_partner_id?.slice(0, 8) || "—";
    const actor = ev.actor_label?.trim() || ev.actor_kind;
    const header = `${fmtDe(ev.created_at)} · ${kind}`;
    draw(header, true, 9);
    for (const line of wrapLines(ev.summary, 92)) {
      draw(line, false, 9);
    }
    draw(`Betrifft: ${subject} · Durchgeführt von: ${actor}`, false, 8);
    if (ev.tip_id) {
      draw(`Tipp-ID: ${ev.tip_id}`, false, 7);
    }
    y -= 4;
  }

  if (chronological.length === 0) {
    draw("Keine Ereignisse in diesem Monat.", false, 10);
  }

  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawText(`Seite ${i + 1} / ${pages.length}`, {
      x: PAGE_W - MARGIN - 60,
      y: 24,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  });

  return doc.save();
}
