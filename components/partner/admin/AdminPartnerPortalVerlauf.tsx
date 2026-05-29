"use client";

import { useMemo, useState } from "react";
import {
  PARTNER_PORTAL_AUDIT_EVENT_LABELS,
  type PartnerPortalAuditLogRow,
} from "@/lib/partner/partner-portal-audit-log-shared";

type Props = {
  initialEvents: PartnerPortalAuditLogRow[];
  subjectLabels: Record<string, string>;
  defaultPeriodKey: string;
};

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

export function AdminPartnerPortalVerlauf({ initialEvents, subjectLabels, defaultPeriodKey }: Props) {
  const [periodKey, setPeriodKey] = useState(defaultPeriodKey);

  const pdfHref = useMemo(() => {
    const q = new URLSearchParams({ period: periodKey });
    return `/api/partner/admin/audit-log/pdf?${q.toString()}`;
  }, [periodKey]);

  return (
    <section
      className="partner-dash-animate rounded-3xl border border-[#0F4F68]/10 bg-white p-5 shadow-[0_20px_50px_-24px_rgba(15,79,104,0.25)] sm:p-8"
      aria-labelledby="verlauf-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="verlauf-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
            Partnerportal-Verlauf
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Protokoll aller relevanten Vorgänge: neue Tipps, Statusänderungen, Archiv, Provisionen. Keine
            Seitenaufrufe — nur fachliche Aktionen mit betroffener Person und ausführendem Konto.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="audit-period" className="block text-[0.65rem] font-semibold uppercase text-[#0F4F68]/75">
              Monat (PDF)
            </label>
            <input
              id="audit-period"
              type="month"
              value={periodKey}
              onChange={(e) => setPeriodKey(e.target.value)}
              className="mt-1 rounded-xl border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <a
            href={pdfHref}
            className="inline-flex items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52]"
            download
          >
            PDF herunterladen
          </a>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/80">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F2F9FA] text-[0.65rem] font-bold uppercase text-[#0F4F68]">
            <tr>
              <th className="px-3 py-2.5">Zeit</th>
              <th className="px-3 py-2.5">Art</th>
              <th className="px-3 py-2.5">Betrifft</th>
              <th className="px-3 py-2.5">Durchgeführt von</th>
              <th className="px-3 py-2.5">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {initialEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-neutral-500">
                  Noch keine Einträge — Migration 030 ausführen oder warten auf neue Vorgänge.
                </td>
              </tr>
            ) : (
              initialEvents.map((ev) => {
                const kind =
                  PARTNER_PORTAL_AUDIT_EVENT_LABELS[
                    ev.event_kind as keyof typeof PARTNER_PORTAL_AUDIT_EVENT_LABELS
                  ] ?? ev.event_kind;
                const subject =
                  (ev.subject_partner_id && subjectLabels[ev.subject_partner_id]) ||
                  ev.subject_partner_id?.slice(0, 8) ||
                  "—";
                return (
                  <tr key={ev.id} className="bg-white align-top">
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-neutral-600">{fmtDe(ev.created_at)}</td>
                    <td className="px-3 py-3 font-medium text-neutral-900">{kind}</td>
                    <td className="px-3 py-3 text-neutral-800">{subject}</td>
                    <td className="px-3 py-3 text-neutral-700">{ev.actor_label ?? ev.actor_kind}</td>
                    <td className="max-w-md px-3 py-3 text-neutral-700">{ev.summary}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
