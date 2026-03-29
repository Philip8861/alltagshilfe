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
import {
  countTipsByAdminStatus,
  countTipsByServiceSlug,
  monthlyCreatedCountsForYear,
  monthlyOrderCountsForYear,
} from "@/lib/partner/analytics-from-tips";
import { PARTNER_TIP_STATUS_LABELS } from "@/lib/partner/partner-tip-admin";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import {
  ADMIN_STATUS_CHART_COLOR,
  CHART_AXIS_TICK,
  CHART_GRID,
  CHART_TEAL,
} from "@/components/partner/partner-chart-theme";
import type { PartnerTipAdminStatus, PartnerTipSubmissionRow } from "@/lib/partner/types";

type OrderRow = { created_at: string };

type Props = {
  tips: PartnerTipSubmissionRow[];
  orders: OrderRow[];
  chartYear: number;
};

function serviceLabel(slug: string): string {
  return PARTNER_RESPONSIBILITY_LABELS[slug as PartnerResponsibilitySlug] ?? slug;
}

export function AdminStatisticsCharts({ tips, orders, chartYear }: Props) {
  const statusPie = useMemo(() => {
    return countTipsByAdminStatus(tips).map(({ status, count }) => ({
      name: PARTNER_TIP_STATUS_LABELS[status],
      status,
      value: count,
    }));
  }, [tips]);

  const servicePie = useMemo(() => {
    const rows = countTipsByServiceSlug(tips);
    const top = rows.slice(0, 7);
    const rest = rows.slice(7).reduce((s, r) => s + r.count, 0);
    const out = top.map((r) => ({ name: serviceLabel(r.slug), value: r.count }));
    if (rest > 0) out.push({ name: "Weitere", value: rest });
    return out;
  }, [tips]);

  const lineData = useMemo(() => {
    const tM = monthlyCreatedCountsForYear(tips, chartYear);
    const oM = monthlyOrderCountsForYear(orders, chartYear);
    return tM.map((row, i) => ({
      name: row.label,
      tipps: row.count,
      pflegebox: oM[i]?.count ?? 0,
    }));
  }, [tips, orders, chartYear]);

  const serviceColors = useMemo(
    () => ["#0F4F68", "#059669", "#d97706", "#7c3aed", "#0284c7", "#e11d48", "#64748b", "#94a3b8"],
    [],
  );

  return (
    <div className="mt-10 space-y-10">
      <div>
        <h3 className="text-lg font-bold text-[#0F4F68]">Diagramme</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Tippgeber nach Verwaltungsstatus und Leistung; Verlauf Tipps vs. Pflegebox-Aufträge (Kalenderjahr {chartYear},
          nach Eingangsdatum).
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-b from-[#F2F9FA]/50 to-white p-5 shadow-sm">
          <h4 className="text-sm font-bold text-[#0F4F68]">Tippgeber nach Status</h4>
          <p className="mt-1 text-xs text-neutral-500">Alle Eingänge in der Datenbank.</p>
          <div className="mt-4 h-[280px] w-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={96}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {statusPie.map((entry) => (
                    <Cell
                      key={`cell-${entry.status}`}
                      fill={ADMIN_STATUS_CHART_COLOR[entry.status as PartnerTipAdminStatus]}
                    />
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

        <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-b from-white to-[#F2F9FA]/40 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-[#0F4F68]">Tippgeber nach Leistung</h4>
          <p className="mt-1 text-xs text-neutral-500">Top-Leistungen; Rest als „Weitere“.</p>
          <div className="mt-4 h-[280px] w-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicePie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={92}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {servicePie.map((entry, index) => (
                    <Cell key={`s-${entry.name}-${index}`} fill={serviceColors[index % serviceColors.length]} />
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
        <h4 className="text-sm font-bold text-[#0F4F68]">Eingänge pro Monat ({chartYear})</h4>
        <p className="mt-1 text-xs text-neutral-500">
          Blau: neue Tippgeber · Türkis: Pflegebox-Bestellungen (alle Status, mit Datum).
        </p>
        <div className="mt-4 h-[300px] w-full min-h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={36} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                  formatter={(value: number, name: string) => [
                    value,
                    name === "tipps" || name === "Tippgeber" ? "Tippgeber" : "Pflegebox",
                  ]}
                />
                <Legend />
              <Line type="monotone" dataKey="tipps" name="Tippgeber" stroke={CHART_TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line
                type="monotone"
                dataKey="pflegebox"
                name="Pflegebox"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
