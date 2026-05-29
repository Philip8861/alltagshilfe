"use client";

import { useMemo, useState } from "react";
import { PartnerExpandableStatSection } from "@/components/partner/PartnerExpandableStatSection";
import { PartnerPortalStatisticsCharts } from "@/components/partner/PartnerPortalStatisticsCharts";
import {
  countOrdersInLocalMonth,
  filterTipsCreatedInMonth,
  partnerStatsEpochMonth,
  partnerStatsMinMonthInputValue,
  provisionEuroTotalsForTips,
} from "@/lib/partner/analytics-from-tips";
import { periodTipStatusCounts } from "@/lib/partner/dashboard-period-stats";
import { formatProvisionEur } from "@/lib/partner/partner-tip-payout";
import { PARTNER_TIP_STATUS_LABELS } from "@/lib/partner/partner-tip-admin";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

export type PartnerStatistikOrderSerial = {
  created_at: string;
  status: string;
};

type Props = {
  tips: PartnerDashboardTipSerial[];
  orders: PartnerStatistikOrderSerial[];
  /** Profil `created_at`: Statistik beginnt erst ab diesem Kalendermonat. */
  partnerCreatedAt: string | null | undefined;
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

function initialMonthForPartner(partnerCreatedAt: string | null | undefined): string {
  const cur = currentMonthValue();
  const min = partnerStatsMinMonthInputValue(partnerCreatedAt);
  return cur < min ? min : cur;
}

function initialYearForPartner(partnerCreatedAt: string | null | undefined): string {
  const { year: py } = partnerStatsEpochMonth(partnerCreatedAt);
  return String(Math.max(new Date().getFullYear(), py));
}

export function PartnerStatistikView({ tips, orders, partnerCreatedAt }: Props) {
  const [periodMode, setPeriodMode] = useState<"month" | "year">("month");
  const [monthInput, setMonthInput] = useState(() => initialMonthForPartner(partnerCreatedAt));
  const [yearInput, setYearInput] = useState(() => initialYearForPartner(partnerCreatedAt));

  const minMonthValue = partnerStatsMinMonthInputValue(partnerCreatedAt);
  const { year: partnerYear, month0: partnerMonth0 } = partnerStatsEpochMonth(partnerCreatedAt);

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
    if (year < partnerYear) {
      const s = new Date(year, 0, 1, 0, 0, 0, 0);
      return { start: s, end: s };
    }
    const start =
      year === partnerYear
        ? new Date(year, partnerMonth0, 1, 0, 0, 0, 0)
        : new Date(year, 0, 1, 0, 0, 0, 0);
    return {
      start,
      end: new Date(year + 1, 0, 1, 0, 0, 0, 0),
    };
  }, [periodMode, monthInput, yearInput, partnerYear, partnerMonth0]);

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
    if (year < partnerYear) return [];
    const start =
      year === partnerYear
        ? new Date(year, partnerMonth0, 1, 0, 0, 0, 0).getTime()
        : new Date(year, 0, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year + 1, 0, 1, 0, 0, 0, 0).getTime();
    return tipsForStats.filter((t) => {
      const ti = new Date(t.created_at).getTime();
      return Number.isFinite(ti) && ti >= start && ti < end;
    });
  }, [periodMode, monthInput, yearInput, tipsForStats, partnerYear, partnerMonth0]);

  const provisionInPeriod = useMemo(() => provisionEuroTotalsForTips(tipsInPeriod), [tipsInPeriod]);

  const ordersInPeriodCount = useMemo(() => {
    if (periodMode === "month") {
      const p = parseMonthValue(monthInput);
      if (!p) return countOrdersInLocalMonth(orders, new Date().getFullYear(), new Date().getMonth());
      return countOrdersInLocalMonth(orders, p.year, p.month0);
    }
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    if (year < partnerYear) return 0;
    const start =
      year === partnerYear
        ? new Date(year, partnerMonth0, 1, 0, 0, 0, 0).getTime()
        : new Date(year, 0, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year + 1, 0, 1, 0, 0, 0, 0).getTime();
    let n = 0;
    for (const o of orders) {
      const t = new Date(o.created_at).getTime();
      if (Number.isFinite(t) && t >= start && t < end) n += 1;
    }
    return n;
  }, [periodMode, monthInput, yearInput, orders, partnerYear, partnerMonth0]);

  const tipsInPeriodCount = tipsInPeriod.length;
  const abgeschlossen = statusInPeriod.vertragsabschluss_erfolgreich;
  const inBearbeitung = statusInPeriod.in_bearbeitung;
  const negativ =
    statusInPeriod.nicht_erfolgreich + statusInPeriod.vertrag_gekuendigt;

  return (
    <section className="partner-dash-animate rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)] sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[#0F4F68]/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0F4F68] sm:text-2xl">Ihre Statistik</h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Nur Ihre Tippgeber und Ihre Pflegebox-Bestellungen — keine fremden Partnerdaten. Provisionswerte wie auf dem
            Dashboard (ohne Admin-Archiv). Ausgewertet wird ab dem Monat Ihrer Partner-Anlage; frühere Monate erscheinen
            nicht.
          </p>
          <p className="mt-2 max-w-xl text-sm text-[#0F4F68]/85">
            Tippen Sie auf einen Bereich darunter – der Inhalt klappt auf.
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
              min={minMonthValue}
              onChange={(e) => setMonthInput(e.target.value)}
              className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-[#0F4F68]/30 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/25"
            />
          ) : (
            <input
              type="number"
              min={partnerYear}
              max={2100}
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              className="w-28 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900 hover:border-[#0F4F68]/30 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/25"
            />
          )}
        </div>
      </div>

      <div className="partner-dash-animate partner-dash-delay-2 mt-8 space-y-4">
        <PartnerExpandableStatSection
          title="Karten zum gewählten Zeitraum"
          subtitle="Meldungen, Status, Provisionsschätzung, Pflegebox-Bestellungen."
          badge={
            <>
              Tipps{" "}
              <span className="tabular-nums">{tipsInPeriodCount}</span>
            </>
          }
          defaultOpen
        >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-br from-[#F2F9FA] to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/65">Tippgeber im Zeitraum</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[#0F4F68]">{tipsInPeriodCount}</p>
          <p className="mt-1 text-xs text-neutral-500">Nach Eingangsdatum</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-emerald-900/70">Abgeschlossen</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-900">{abgeschlossen}</p>
          <p className="mt-1 text-xs text-neutral-600">
            {PARTNER_TIP_STATUS_LABELS.vertragsabschluss_erfolgreich}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200/70 bg-gradient-to-br from-rose-50/70 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-rose-900/70">Nicht erfolgreich / Gekündigt</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-rose-900">{negativ}</p>
        </div>
        <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/70 to-white p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-wide text-amber-950/75">In Bearbeitung</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-amber-950">{inBearbeitung}</p>
          <p className="mt-1 text-xs text-neutral-600">{PARTNER_TIP_STATUS_LABELS.in_bearbeitung}</p>
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
        </PartnerExpandableStatSection>

        <PartnerExpandableStatSection
          title="Diagramme und Zeitverläufe"
          subtitle="Eingänge und Bestellungen im Jahres‑ bzw. Monatsraster wie oben eingestellt."
        >
          <PartnerPortalStatisticsCharts
            tips={tipsForStats}
            orders={orders}
            periodMode={periodMode}
            monthInput={monthInput}
            yearInput={yearInput}
            partnerCreatedAt={partnerCreatedAt}
          />
        </PartnerExpandableStatSection>
      </div>
    </section>
  );
}
