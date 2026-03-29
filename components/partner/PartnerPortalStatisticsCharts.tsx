"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardAuftragStats } from "@/lib/partner/dashboard-period-stats";
import {
  countTipsByServiceSlug,
  monthlyCreatedCountsForYear,
  rollingMonthlyCreatedCounts,
} from "@/lib/partner/analytics-from-tips";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import {
  CHART_AMBER,
  CHART_AXIS_TICK,
  CHART_EMERALD,
  CHART_GRID,
  CHART_ROSE,
  CHART_TEAL,
} from "@/components/partner/partner-chart-theme";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

type PeriodMode = "month" | "year";

type Props = {
  tips: PartnerDashboardTipSerial[];
  periodMode: PeriodMode;
  monthInput: string;
  yearInput: string;
  periodStats: DashboardAuftragStats;
  tipsInPeriod: PartnerDashboardTipSerial[];
};

function serviceLabel(slug: string): string {
  return PARTNER_RESPONSIBILITY_LABELS[slug as PartnerResponsibilitySlug] ?? slug;
}

export function PartnerPortalStatisticsCharts({
  tips,
  periodMode,
  monthInput,
  yearInput,
  periodStats,
  tipsInPeriod,
}: Props) {
  const statusPie = useMemo(
    () => [
      { name: "Abgeschlossen", value: periodStats.abgeschlossen, color: CHART_EMERALD },
      { name: "Abgelehnt", value: periodStats.abgelehnt, color: CHART_ROSE },
      { name: "In Bearbeitung", value: periodStats.inBearbeitung, color: CHART_AMBER },
    ],
    [periodStats],
  );

  const servicePie = useMemo(() => {
    const rows = countTipsByServiceSlug(tipsInPeriod);
    if (rows.length === 0) return [{ name: "Keine Daten", value: 1, color: "#cbd5e1" }];
    const colors = [CHART_TEAL, CHART_EMERALD, CHART_AMBER, "#7c3aed", "#0284c7", CHART_ROSE, "#64748b"];
    return rows.slice(0, 8).map((r, i) => ({
      name: serviceLabel(r.slug),
      value: r.count,
      color: colors[i % colors.length],
    }));
  }, [tipsInPeriod]);

  const lineData = useMemo(() => {
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    if (periodMode === "year") {
      return monthlyCreatedCountsForYear(tips, year).map((row) => ({
        name: row.label,
        tipps: row.count,
      }));
    }
    const m = /^(\d{4})-(\d{2})$/.exec(monthInput.trim());
    if (!m) {
      const d = new Date();
      return rollingMonthlyCreatedCounts(tips, d.getFullYear(), d.getMonth(), 12).map((row) => ({
        name: row.label,
        tipps: row.count,
      }));
    }
    const yM = Number(m[1]);
    const mo = Number(m[2]) - 1;
    return rollingMonthlyCreatedCounts(tips, yM, mo, 12).map((row) => ({
      name: row.label,
      tipps: row.count,
    }));
  }, [tips, periodMode, monthInput, yearInput]);

  return (
    <div className="mt-10 space-y-10">
      <div>
        <h2 className="text-base font-semibold text-[#0F4F68]">Auswertungen</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Kreisdiagramme für den gewählten Zeitraum; Linie zeigt{" "}
          {periodMode === "year"
            ? `alle Tippgeber-Eingänge im Jahr ${yearInput}.`
            : "die letzten 12 Monate bis zum gewählten Monat."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-b from-[#F2F9FA]/50 to-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#0F4F68]">Aufträge nach Ausgang (Zeitraum)</h3>
          <p className="mt-1 text-xs text-neutral-500">Abgeschlossen = erledigt oder bezahlt (wie Statuslisten).</p>
          <div className="mt-4 h-[260px] w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={88}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {statusPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value, "Anzahl"]}
                  contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-b from-amber-50/40 to-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#0F4F68]">Tippgeber nach Leistung (Zeitraum)</h3>
          <p className="mt-1 text-xs text-neutral-500">Nur Eingänge im gewählten Monat bzw. Jahr.</p>
          <div className="mt-4 h-[260px] w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicePie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={86}
                  paddingAngle={2}
                  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {servicePie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value, "Tipps"]}
                  contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F4F68]">Tippgeber-Eingänge über Monate</h3>
        <p className="mt-1 text-xs text-neutral-500">Anzahl neuer Meldungen nach Eingangsdatum (lokal).</p>
        <div className="mt-4 h-[280px] w-full min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis
                dataKey="name"
                tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }}
                interval={1}
                angle={-30}
                textAnchor="end"
                height={64}
              />
              <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={32} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                formatter={(value: number) => [value, "Tippgeber"]}
              />
              <Legend />
              <Line type="monotone" dataKey="tipps" name="Tippgeber" stroke={CHART_TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
