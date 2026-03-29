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
import {
  statsForMonth,
  statsForYear,
} from "@/lib/partner/dashboard-period-stats";
import { formatProvisionEur } from "@/lib/partner/partner-tip-payout";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

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

  const orderLikes = useMemo(() => orders.map((o) => ({ created_at: o.created_at, status: o.status })), [orders]);

  const tipsForStats = useMemo(() => tips, [tips]);

  const periodStats = useMemo(() => {
    if (periodMode === "month") {
      const p = parseMonthValue(monthInput);
      if (!p)
        return statsForMonth(tipsForStats, orderLikes, new Date().getFullYear(), new Date().getMonth());
      return statsForMonth(tipsForStats, orderLikes, p.year, p.month0);
    }
    const y = Number(yearInput);
    if (!Number.isFinite(y) || y < 2000 || y > 2100)
      return statsForYear(tipsForStats, orderLikes, new Date().getFullYear());
    return statsForYear(tipsForStats, orderLikes, y);
  }, [periodMode, monthInput, yearInput, tipsForStats, orderLikes]);

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
  const totalAuftraege = periodStats.abgeschlossen + periodStats.abgelehnt + periodStats.inBearbeitung;

  return (
    <section className="partner-dash-animate rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)] sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[#0F4F68]/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0F4F68] sm:text-2xl">Statistik</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Kennzahlen und Diagramme aus Ihren Tippgeber-Eingängen und Pflegebox-Bestellungen. Provisionsbeträge wie auf
            dem Dashboard (ohne Admin-Archiv).
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

      <div className="partner-dash-animate partner-dash-delay-2 mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-br from-[#F2F9FA] to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/65">Tippgeber (Zeitraum)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[#0F4F68]">{tipsInPeriodCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Neue Eingänge nach Datum</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-emerald-900/70">Aufträge gesamt</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-900">{totalAuftraege}</p>
          <p className="mt-1 text-xs text-neutral-600">
            Abg. {periodStats.abgeschlossen} · Abgl. {periodStats.abgelehnt} · Offen {periodStats.inBearbeitung}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/70 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-amber-950/75">Provision (geschätzt)</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-amber-950">{formatProvisionEur(provisionInPeriod.total)}</p>
          <p className="mt-1 text-xs text-neutral-600">
            Monatlich {formatProvisionEur(provisionInPeriod.monatlich)} · Einmal {formatProvisionEur(provisionInPeriod.einmal)}
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200/70 bg-gradient-to-br from-sky-50/60 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-sky-900/70">Pflegebox</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-sky-900">{ordersInPeriodCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Bestellungen im Zeitraum</p>
        </div>
      </div>

      <PartnerPortalStatisticsCharts
        tips={tipsForStats}
        periodMode={periodMode}
        monthInput={monthInput}
        yearInput={yearInput}
        periodStats={periodStats}
        tipsInPeriod={tipsInPeriod}
      />
    </section>
  );
}
