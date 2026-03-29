"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  countOrdersInMonthKey,
  monthlyCreatedCountsForYearSincePartner,
  monthlyProvisionEuroLinesForPoints,
  monthlyStatusCountLinesForPoints,
  partnerStatsEpochMonth,
  rollingMonthlyCreatedCountsSincePartner,
} from "@/lib/partner/analytics-from-tips";
import { PARTNER_TIP_STATUS_LABELS, PARTNER_TIP_ADMIN_STATUSES } from "@/lib/partner/partner-tip-admin";
import {
  ADMIN_STATUS_CHART_COLOR,
  CHART_AXIS_TICK,
  CHART_GRID,
  CHART_TEAL,
} from "@/components/partner/partner-chart-theme";
import type { PartnerDashboardTipSerial, PartnerTipAdminStatus } from "@/lib/partner/types";

type PeriodMode = "month" | "year";

type OrderSerial = { created_at: string };

type Props = {
  tips: PartnerDashboardTipSerial[];
  orders: OrderSerial[];
  periodMode: PeriodMode;
  monthInput: string;
  yearInput: string;
  partnerCreatedAt: string | null | undefined;
};

const euroFmt = (v: number) =>
  `${v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export function PartnerPortalStatisticsCharts({
  tips,
  orders,
  periodMode,
  monthInput,
  yearInput,
  partnerCreatedAt,
}: Props) {
  const monthPoints = useMemo(() => {
    const { year: py, month0: pm0 } = partnerStatsEpochMonth(partnerCreatedAt);
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    if (periodMode === "year") {
      return monthlyCreatedCountsForYearSincePartner(tips, year, py, pm0);
    }
    const m = /^(\d{4})-(\d{2})$/.exec(monthInput.trim());
    if (!m) {
      const d = new Date();
      return rollingMonthlyCreatedCountsSincePartner(tips, d.getFullYear(), d.getMonth(), py, pm0, 12);
    }
    const yM = Number(m[1]);
    const mo = Number(m[2]) - 1;
    return rollingMonthlyCreatedCountsSincePartner(tips, yM, mo, py, pm0, 12);
  }, [tips, periodMode, monthInput, yearInput, partnerCreatedAt]);

  const lineEingaengeOrders = useMemo(
    () =>
      monthPoints.map((p) => ({
        name: p.label,
        tipps: p.count,
        pflegebox: countOrdersInMonthKey(orders, p.key),
      })),
    [monthPoints, orders],
  );

  const lineStatus = useMemo(() => monthlyStatusCountLinesForPoints(tips, monthPoints), [tips, monthPoints]);

  const lineProvision = useMemo(() => monthlyProvisionEuroLinesForPoints(tips, monthPoints), [tips, monthPoints]);

  return (
    <div className="mt-10 space-y-10">
      <div>
        <h2 className="text-base font-semibold text-[#0F4F68]">Ihre Verläufe (Liniendiagramme)</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Nur Ihre eigenen Tippgeber und Pflegebox-Bestellungen. Monate vor Ihrer Partner-Anlage werden nicht angezeigt. Bei
          Monatsansicht: bis zu 12 Monate bis zum gewählten Monat; bei Jahresansicht: nur ab dem Anlagemonat im jeweiligen
          Jahr.
        </p>
      </div>

      <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F4F68]">Neue Tippgeber &amp; Ihre Pflegebox-Bestellungen</h3>
        <div className="mt-4 h-[280px] w-full min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineEingaengeOrders} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis
                dataKey="name"
                tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }}
                interval={0}
                angle={-28}
                textAnchor="end"
                height={56}
              />
              <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={32} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }} />
              <Legend />
              <Line type="monotone" dataKey="tipps" name="Tippgeber" stroke={CHART_TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pflegebox" name="Pflegebox" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-b from-[#F2F9FA]/50 to-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F4F68]">Verwaltungsstatus je Monat (Ihre Tipps)</h3>
        <p className="mt-1 text-xs text-neutral-500">Eine Linie pro Status — nur Eingänge in dem Monat.</p>
        <div className="mt-4 h-[320px] w-full min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineStatus} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis
                dataKey="name"
                tick={{ fill: CHART_AXIS_TICK, fontSize: 9 }}
                interval={0}
                angle={-28}
                textAnchor="end"
                height={56}
              />
              <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={28} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {PARTNER_TIP_ADMIN_STATUSES.map((st) => (
                <Line
                  key={st}
                  type="monotone"
                  dataKey={st}
                  name={PARTNER_TIP_STATUS_LABELS[st]}
                  stroke={ADMIN_STATUS_CHART_COLOR[st as PartnerTipAdminStatus]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-b from-amber-50/50 to-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#0F4F68]">Geschätzte Provision (EUR) nach Eingangsmonat</h3>
        <p className="mt-1 text-xs text-neutral-500">Wie auf dem Dashboard: ohne Admin-Archiv.</p>
        <div className="mt-4 h-[300px] w-full min-h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineProvision} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis
                dataKey="name"
                tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }}
                interval={0}
                angle={-28}
                textAnchor="end"
                height={56}
              />
              <YAxis tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={44} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                formatter={(value: number) => euroFmt(Number(value))}
              />
              <Legend />
              <Line type="monotone" dataKey="monatlich" name="Monatlich" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="einmal" name="Einmal" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="gesamt" name="Gesamt" stroke={CHART_TEAL} strokeWidth={2} dot={{ r: 2 }} strokeDasharray="4 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
