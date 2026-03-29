"use client";

import { useMemo, useState } from "react";
import { PartnerPortalStatisticsCharts } from "@/components/partner/PartnerPortalStatisticsCharts";
import {
  countOrdersInLocalMonth,
  countOrdersInLocalYear,
  filterTipsCreatedInMonth,
  filterTipsCreatedInYear,
  provisionEuroTotalsForTips,
} from "@/lib/partner/analytics-from-tips";
import { periodTipStatusCounts } from "@/lib/partner/dashboard-period-stats";
import { formatProvisionEur } from "@/lib/partner/partner-tip-payout";
import { PARTNER_TIP_STATUS_LABELS, PARTNER_TIP_ADMIN_STATUSES } from "@/lib/partner/partner-tip-admin";
import type { PartnerDashboardTipSerial, PartnerTipAdminStatus } from "@/lib/partner/types";

export type PartnerStatistikOrderSerial = {
  created_at: string;
  status: string;
};

type Props = {
  tips: PartnerDashboardTipSerial[];
  orders: PartnerStatistikOrderSerial[];
};

function currentMonthValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function parseMonthValue(v: string): { year: number; month0: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { year, month0: month - 1 };
}

export function PartnerStatistikView({ tips, orders }: Props) {
  const [periodMode, setPeriodMode] = useState<"month" | "year">("month");
  const [monthInput, setMonthInput] = useState(currentMonthValue);
  const [yearInput, setYearInput] = useState(() => String(new Date().getFullYear()));

  const tipsForStats = useMemo(() => tips, [tips]);

  const periodRange = useMemo(() => {
    if (periodMode === "month") {
      const p = parseMonthValue(monthInput);
      const y = p?.year ?? new Date().getFullYear();
      const m0 = p?.month0 ?? new Date().getMonth();
      return {
        start: new Date(y, m0, 1, 0, 0, 0, 0),
        end: new Date(y, m0 + 1, 1, 0, 0, 0, 0),
      };
    }
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    return {
      start: new Date(year, 0, 1, 0, 0, 0, 0),
      end: new Date(year + 1, 0, 1, 0, 0, 0, 0),
    };
  }, [periodMode, monthInput, yearInput]);

  const statusInPeriod = useMemo(
    () => periodTipStatusCounts(tipsForStats, periodRange.start, periodRange.end),
    [tipsForStats, periodRange],
  );

  const tipsInPeriod = useMemo(() => {
    if (periodMode === "month") {
      const p = parseMonthValue(monthInput);
      if (!p) return filterTipsCreatedInMonth(tipsForStats, new Date().getFullYear(), new Date().getMonth());
      return filterTipsCreatedInMonth(tipsForStats, p.year, p.month0);
    }
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    return filterTipsCreatedInYear(tipsForStats, year);
  }, [periodMode, monthInput, yearInput, tipsForStats]);

  const provisionInPeriod = useMemo(() => provisionEuroTotalsForTips(tipsInPeriod), [tipsInPeriod]);

  const ordersInPeriodCount = useMemo(() => {
    if (periodMode === "month") {
      const p = parseMonthValue(monthInput);
      if (!p) return countOrdersInLocalMonth(orders, new Date().getFullYear(), new Date().getMonth());
      return countOrdersInLocalMonth(orders, p.year, p.month0);
    }
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    return countOrdersInLocalYear(orders, year);
  }, [periodMode, monthInput, yearInput, orders]);

  const tipsInPeriodCount = tipsInPeriod.length;
  const abgeschlossen = statusInPeriod.erledigt + statusInPeriod.bezahlt;
  const inPipeline =
    statusInPeriod.in_bearbeitung + statusInPeriod.termin_vereinbart + statusInPeriod.warten_auf_rueckmeldung;

  const statusAccent: Partial<Record<PartnerTipAdminStatus, string>> = {
    in_bearbeitung: "border-amber-200 bg-amber-50/80",
    termin_vereinbart: "border-sky-200 bg-sky-50/70",
    warten_auf_rueckmeldung: "border-violet-200 bg-violet-50/60",
    bezahlt: "border-teal-200 bg-teal-50/70",
    erledigt: "border-emerald-200 bg-emerald-50/80",
    abgelehnt: "border-rose-200 bg-rose-50/70",
  };

  return (
    <section className="partner-dash-animate rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)] sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[#0F4F68]/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0F4F68] sm:text-2xl">Ihre Statistik</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Nur Ihre Tippgeber und Ihre Pflegebox-Bestellungen — keine fremden Partnerdaten. Provisionswerte wie auf dem
            Dashboard (ohne Admin-Archiv).
          </p>
        </div>
        <div className="partner-dash-animate partner-dash-delay-1 flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-[#0F4F68]/20 p-0.5">
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                periodMode === "month" ? "bg-[#0F4F68] text-white shadow-sm" : "text-[#0F4F68] hover:bg-[#F2F9FA]"
              }`}
              onClick={() => setPeriodMode("month")}
            >
              Monat
            </button>
            <button
              type="button"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                periodMode === "year" ? "bg-[#0F4F68] text-white shadow-sm" : "text-[#0F4F68] hover:bg-[#F2F9FA]"
              }`}
              onClick={() => setPeriodMode("year")}
            >
              Jahr
            </button>
          </div>
          {periodMode === "month" ? (
            <input
              type="month"
              value={monthInput}
              onChange={(e) => setMonthInput(e.target.value)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-[#0F4F68]/30 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/25"
            />
          ) : (
            <input
              type="number"
              min={2000}
              max={2100}
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              className="w-28 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-[#0F4F68]/30 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/25"
            />
          )}
        </div>
      </div>

      <div className="partner-dash-animate partner-dash-delay-2 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-br from-[#F2F9FA] to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/65">Tippgeber im Zeitraum</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[#0F4F68]">{tipsInPeriodCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Nach Eingangsdatum</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-emerald-900/70">Abgeschlossen</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-900">{abgeschlossen}</p>
          <p className="mt-1 text-xs text-neutral-600">
            {PARTNER_TIP_STATUS_LABELS.erledigt}: {statusInPeriod.erledigt} · {PARTNER_TIP_STATUS_LABELS.bezahlt}:{" "}
            {statusInPeriod.bezahlt}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50/70 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-rose-900/70">Abgelehnt</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-rose-900">{statusInPeriod.abgelehnt}</p>
        </div>
        <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/70 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-amber-950/75">In Bearbeitung (gesamt)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-950">{inPipeline}</p>
          <p className="mt-1 text-xs text-neutral-600">
            {PARTNER_TIP_STATUS_LABELS.in_bearbeitung}: {statusInPeriod.in_bearbeitung} ·{" "}
            {PARTNER_TIP_STATUS_LABELS.termin_vereinbart}: {statusInPeriod.termin_vereinbart} ·{" "}
            {PARTNER_TIP_STATUS_LABELS.warten_auf_rueckmeldung}: {statusInPeriod.warten_auf_rueckmeldung}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/50 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-amber-950/75">Provision (geschätzt)</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-amber-950">{formatProvisionEur(provisionInPeriod.total)}</p>
          <p className="mt-1 text-xs text-neutral-600">
            Monatlich {formatProvisionEur(provisionInPeriod.monatlich)} · Einmal {formatProvisionEur(provisionInPeriod.einmal)}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50/60 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-sky-900/70">Ihre Pflegebox</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-sky-900">{ordersInPeriodCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Bestellungen im Zeitraum</p>
        </div>
      </div>

      <div className="partner-dash-animate partner-dash-delay-3 mt-8">
        <h2 className="text-sm font-bold text-[#0F4F68]">Alle Verwaltungsstatus im Zeitraum</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_TIP_ADMIN_STATUSES.map((st) => (
            <div
              key={st}
              className={`rounded-xl border px-3 py-2.5 ${statusAccent[st] ?? "border-neutral-200 bg-neutral-50/80"}`}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-neutral-600">
                {PARTNER_TIP_STATUS_LABELS[st]}
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-neutral-900">{statusInPeriod[st]}</p>
            </div>
          ))}
        </div>
      </div>

      <PartnerPortalStatisticsCharts
        tips={tipsForStats}
        orders={orders}
        periodMode={periodMode}
        monthInput={monthInput}
        yearInput={yearInput}
      />
    </section>
  );
}
