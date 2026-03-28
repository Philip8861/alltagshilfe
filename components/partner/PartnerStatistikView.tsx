"use client";

import { useMemo, useState } from "react";
import {
  monthlyStatsForYear,
  statsForMonth,
  statsForYear,
  type DashboardAuftragStats,
} from "@/lib/partner/dashboard-period-stats";
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

function HorizontalStatBars({ stats }: { stats: DashboardAuftragStats }) {
  const max = Math.max(1, stats.abgeschlossen, stats.abgelehnt, stats.inBearbeitung);
  const rows: { label: string; value: number; barClass: string }[] = [
    { label: "Abgeschlossen", value: stats.abgeschlossen, barClass: "bg-emerald-500" },
    { label: "Abgelehnt", value: stats.abgelehnt, barClass: "bg-rose-500" },
    { label: "In Bearbeitung", value: stats.inBearbeitung, barClass: "bg-amber-500" },
  ];
  return (
    <div className="space-y-4" role="img" aria-label="Balkendiagramm Auftragsstatus">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-full shrink-0 text-sm font-semibold text-neutral-800 sm:w-40">{r.label}</span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-9 min-w-0 flex-1 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80">
              <div className={`h-full rounded-lg ${r.barClass}`} style={{ width: `${(r.value / max) * 100}%` }} />
            </div>
            <span className="w-10 shrink-0 text-right text-base font-bold tabular-nums text-neutral-900">{r.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function YearMonthOverviewChart({
  monthly,
  year,
}: {
  monthly: DashboardAuftragStats[];
  year: number;
}) {
  const maxTotal = useMemo(
    () => Math.max(1, ...monthly.map((m) => m.abgeschlossen + m.abgelehnt + m.inBearbeitung)),
    [monthly],
  );
  const monthLabels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const chartMaxPx = 132;
  return (
    <div>
      <p className="text-sm font-semibold text-[#134e4a]">Verteilung {year} (nach Eingangsdatum)</p>
      <p className="mt-1 text-xs text-neutral-500">Gestapelte Balken: grün abgeschlossen, rot abgelehnt, gelb in Bearbeitung.</p>
      <div className="mt-4 flex h-44 items-end justify-between gap-1 sm:gap-1.5" role="img" aria-label="Jahresübersicht nach Monaten">
        {monthly.map((st, i) => {
          const total = st.abgeschlossen + st.abgelehnt + st.inBearbeitung;
          const colPx = total === 0 ? 4 : Math.round(10 + (total / maxTotal) * chartMaxPx);
          return (
            <div key={i} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <div
                className="flex w-full max-w-[2.25rem] flex-col justify-end overflow-hidden rounded-t-md border border-neutral-200/90 bg-neutral-100 sm:max-w-[2.75rem]"
                style={{ height: colPx }}
              >
                {total > 0 ? (
                  <div className="flex h-full w-full flex-col overflow-hidden rounded-t-md">
                    {st.abgeschlossen > 0 ? (
                      <div className="min-h-[3px] w-full bg-emerald-500" style={{ flex: st.abgeschlossen }} />
                    ) : null}
                    {st.abgelehnt > 0 ? (
                      <div className="min-h-[3px] w-full bg-rose-500" style={{ flex: st.abgelehnt }} />
                    ) : null}
                    {st.inBearbeitung > 0 ? (
                      <div className="min-h-[3px] w-full bg-amber-400" style={{ flex: st.inBearbeitung }} />
                    ) : null}
                  </div>
                ) : null}
              </div>
              <span className="text-[0.65rem] font-semibold text-neutral-500">{monthLabels[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PartnerStatistikView({ tips, orders }: Props) {
  const [periodMode, setPeriodMode] = useState<"month" | "year">("month");
  const [monthInput, setMonthInput] = useState(currentMonthValue);
  const [yearInput, setYearInput] = useState(() => String(new Date().getFullYear()));

  const orderLikes = useMemo(() => orders.map((o) => ({ created_at: o.created_at, status: o.status })), [orders]);

  const periodStats = useMemo(() => {
    if (periodMode === "month") {
      const p = parseMonthValue(monthInput);
      if (!p) return statsForMonth(tips, orderLikes, new Date().getFullYear(), new Date().getMonth());
      return statsForMonth(tips, orderLikes, p.year, p.month0);
    }
    const y = Number(yearInput);
    if (!Number.isFinite(y) || y < 2000 || y > 2100) return statsForYear(tips, orderLikes, new Date().getFullYear());
    return statsForYear(tips, orderLikes, y);
  }, [periodMode, monthInput, yearInput, tips, orderLikes]);

  const monthlyForYear = useMemo(() => {
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    return monthlyStatsForYear(tips, orderLikes, year);
  }, [yearInput, tips, orderLikes]);

  return (
    <section className="rounded-lg border border-neutral-300 bg-white p-5 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[#134e4a]/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-xl font-semibold text-[#134e4a] sm:text-2xl">Statistik</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-[#134e4a]/20 p-0.5">
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                periodMode === "month" ? "bg-[#134e4a] text-white" : "text-[#134e4a] hover:bg-neutral-50"
              }`}
              onClick={() => setPeriodMode("month")}
            >
              Monat
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                periodMode === "year" ? "bg-[#134e4a] text-white" : "text-[#134e4a] hover:bg-neutral-50"
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
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-[#134e4a]/30 focus:border-[#134e4a] focus:outline-none focus:ring-1 focus:ring-[#134e4a]"
            />
          ) : (
            <input
              type="number"
              min={2000}
              max={2100}
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              className="w-24 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-[#134e4a]/30 focus:border-[#134e4a] focus:outline-none focus:ring-1 focus:ring-[#134e4a]"
            />
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-base font-semibold text-[#134e4a]">Aufträge nach Status</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Tippgeber-Eingänge und abgeschlossene Konfigurationen im gewählten Zeitraum.
        </p>
        <div className="mt-6 rounded-lg border border-neutral-200 bg-[#F2F9FA] p-5 sm:p-6">
          <HorizontalStatBars stats={periodStats} />
        </div>
      </div>
      {periodMode === "year" ? (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-5 sm:p-6">
          <YearMonthOverviewChart
            monthly={monthlyForYear}
            year={
              Number(yearInput) >= 2000 && Number(yearInput) <= 2100 ? Number(yearInput) : new Date().getFullYear()
            }
          />
        </div>
      ) : null}
    </section>
  );
}
