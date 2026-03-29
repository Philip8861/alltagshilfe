"use client";

import { useEffect, useMemo, useState } from "react";
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
  filterTipsByPartnerId,
  monthlyCreatedCountsForYear,
  monthlyOrderCountsForYear,
  monthlyProvisionEuroLinesForYear,
  monthlyStatusCountLinesForYear,
} from "@/lib/partner/analytics-from-tips";
import { PARTNER_TIP_STATUS_LABELS, PARTNER_TIP_ADMIN_STATUSES } from "@/lib/partner/partner-tip-admin";
import {
  ADMIN_STATUS_CHART_COLOR,
  CHART_AXIS_TICK,
  CHART_GRID,
  CHART_TEAL,
} from "@/components/partner/partner-chart-theme";
import type { PartnerProfile, PartnerTipAdminStatus, PartnerTipSubmissionRow } from "@/lib/partner/types";

type OrderRow = { created_at: string };

type Props = {
  tips: PartnerTipSubmissionRow[];
  orders: OrderRow[];
  chartYear: number;
  profiles: PartnerProfile[];
  authById: Record<string, { email: string }>;
};

function partnerOptionLabel(p: PartnerProfile, email: string): string {
  const name =
    [p.first_name?.trim(), p.last_name?.trim()].filter(Boolean).join(" ") ||
    p.display_name?.trim() ||
    email ||
    p.id.slice(0, 8);
  const code = p.partner_referral_code?.trim();
  return code ? `${name} (${code})` : name;
}

const euroFmt = (v: number) =>
  `${v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export function AdminStatisticsCharts({ tips, orders, chartYear, profiles, authById }: Props) {
  const partnerOptions = useMemo(
    () => profiles.filter((p) => p.role === "partner"),
    [profiles],
  );

  const [detailPartnerId, setDetailPartnerId] = useState<string>("");

  useEffect(() => {
    if (detailPartnerId || partnerOptions.length === 0) return;
    setDetailPartnerId(partnerOptions[0].id);
  }, [detailPartnerId, partnerOptions]);

  const lineTipsOrders = useMemo(() => {
    const tM = monthlyCreatedCountsForYear(tips, chartYear);
    const oM = monthlyOrderCountsForYear(orders, chartYear);
    return tM.map((row, i) => ({
      name: row.label,
      tipps: row.count,
      pflegebox: oM[i]?.count ?? 0,
    }));
  }, [tips, orders, chartYear]);

  const lineStatus = useMemo(() => monthlyStatusCountLinesForYear(tips, chartYear), [tips, chartYear]);

  const lineProvision = useMemo(() => monthlyProvisionEuroLinesForYear(tips, chartYear), [tips, chartYear]);

  const tipsForDetail = useMemo(
    () => (detailPartnerId ? filterTipsByPartnerId(tips, detailPartnerId) : []),
    [tips, detailPartnerId],
  );

  const linePartnerTips = useMemo(
    () => monthlyCreatedCountsForYear(tipsForDetail, chartYear),
    [tipsForDetail, chartYear],
  );

  const linePartnerStatus = useMemo(
    () => monthlyStatusCountLinesForYear(tipsForDetail, chartYear),
    [tipsForDetail, chartYear],
  );

  const linePartnerProvision = useMemo(
    () => monthlyProvisionEuroLinesForYear(tipsForDetail, chartYear),
    [tipsForDetail, chartYear],
  );

  return (
    <div className="mt-10 space-y-10">
      <div>
        <h3 className="text-lg font-bold text-[#0F4F68]">Liniendiagramme (Gesamt)</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Kalenderjahr {chartYear}, Zählungen nach Eingangsdatum. Provision: geschätzt aus aktuellem Status und Betrag
          (ohne Admin-Archiv).
        </p>
      </div>

      <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-bold text-[#0F4F68]">Tippgeber &amp; Pflegebox pro Monat</h4>
        <div className="mt-4 h-[300px] w-full min-h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineTipsOrders} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={36} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }} />
              <Legend />
              <Line type="monotone" dataKey="tipps" name="Tippgeber" stroke={CHART_TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pflegebox" name="Pflegebox" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-b from-[#F2F9FA]/40 to-white p-5 shadow-sm">
        <h4 className="text-sm font-bold text-[#0F4F68]">Tippgeber nach Verwaltungsstatus (alle Partner)</h4>
        <p className="mt-1 text-xs text-neutral-500">Eine Linie pro Status.</p>
        <div className="mt-4 h-[340px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineStatus} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={32} />
              <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
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

      <div className="rounded-2xl border border-emerald-200/60 bg-white p-5 shadow-sm">
        <h4 className="text-sm font-bold text-[#0F4F68]">Geschätzte Provision gesamt (EUR / Monat)</h4>
        <p className="mt-1 text-xs text-neutral-500">Summe Monats- und Einmalprovision nach Eingangsmonat.</p>
        <div className="mt-4 h-[300px] w-full min-h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineProvision} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
              <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} />
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

      {partnerOptions.length > 0 ? (
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/30 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-[#0F4F68]">Einzelpartner (nur dessen Tippgeber)</h4>
          <p className="mt-1 text-xs text-neutral-600">
            Auswahl für die folgenden drei Diagramme — ohne Daten anderer Partner.
          </p>
          <label className="mt-3 block text-xs font-bold uppercase text-amber-950/80" htmlFor="admin-stat-partner">
            Partner
          </label>
          <select
            id="admin-stat-partner"
            value={detailPartnerId}
            onChange={(e) => setDetailPartnerId(e.target.value)}
            className="mt-2 w-full max-w-lg rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20"
          >
            {partnerOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {partnerOptionLabel(p, authById[p.id]?.email ?? "")}
              </option>
            ))}
          </select>

          <div className="mt-8 h-[280px] w-full min-h-[240px]">
            <p className="mb-2 text-xs font-semibold text-[#0F4F68]">Neue Tippgeber / Monat</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={linePartnerTips.map((r) => ({ name: r.label, tipps: r.count }))}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={32} />
                <Tooltip contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }} />
                <Line type="monotone" dataKey="tipps" name="Tipps" stroke={CHART_TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-10 h-[300px] w-full min-h-[260px]">
            <p className="mb-2 text-xs font-semibold text-[#0F4F68]">Status je Monat</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={linePartnerStatus} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }} />
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
                    strokeWidth={1.8}
                    dot={{ r: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-10 h-[280px] w-full min-h-[240px]">
            <p className="mb-2 text-xs font-semibold text-[#0F4F68]">Provision (EUR) je Monat</p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={linePartnerProvision} margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
                <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} />
                <YAxis tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={40} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                  formatter={(value: number) => euroFmt(Number(value))}
                />
                <Legend />
                <Line type="monotone" dataKey="monatlich" name="Monatlich" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="einmal" name="Einmal" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
