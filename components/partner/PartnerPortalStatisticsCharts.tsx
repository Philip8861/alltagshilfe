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
import { partnerStatsEpochMonth, provisionEuroTotalsForTips } from "@/lib/partner/analytics-from-tips";
import { PARTNER_TIP_STATUS_LABELS, PARTNER_TIP_ADMIN_STATUSES } from "@/lib/partner/partner-tip-admin";
import {
  ADMIN_STATUS_CHART_COLOR,
  CHART_AXIS_TICK,
  CHART_GRID,
  CHART_TEAL,
} from "@/components/partner/partner-chart-theme";
import type { PartnerDashboardTipSerial, PartnerTipAdminStatus } from "@/lib/partner/types";

type PeriodMode = "day" | "month" | "year" | "range";

type OrderSerial = { created_at: string };

type Props = {
  tips: PartnerDashboardTipSerial[];
  orders: OrderSerial[];
  periodMode: PeriodMode;
  monthInput: string;
  yearInput: string;
  /** Gewählter Zeitraum (lokale Zeit, Ende exklusiv) – maßgeblich für Tag- und Von–Bis-Ansicht. */
  periodStartMs: number;
  periodEndMs: number;
  partnerCreatedAt: string | null | undefined;
};

/** Ein Datenpunkt der Diagramme: Zeitfenster (Ende exklusiv) plus Achsenbeschriftung. */
type ChartBucket = { startMs: number; endMs: number; label: string };

const MONTH_SHORT_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const DAY_MS = 24 * 60 * 60 * 1000;
/** Tagesansicht: so viele Tage bis zum gewählten Tag werden gezeichnet. */
const DAY_MODE_DAYS = 14;
/** Von–Bis: bis zu dieser Länge (Tage) Tagespunkte, darüber Monatspunkte. */
const RANGE_DAILY_MAX_DAYS = 62;

function monthBucket(year: number, month0: number, withYear: boolean): ChartBucket {
  return {
    startMs: new Date(year, month0, 1, 0, 0, 0, 0).getTime(),
    endMs: new Date(year, month0 + 1, 1, 0, 0, 0, 0).getTime(),
    label: withYear ? `${MONTH_SHORT_DE[month0]} ${year}` : MONTH_SHORT_DE[month0],
  };
}

function dayBucket(year: number, month0: number, day: number): ChartBucket {
  const start = new Date(year, month0, day, 0, 0, 0, 0);
  const end = new Date(year, month0, day + 1, 0, 0, 0, 0);
  return {
    startMs: start.getTime(),
    endMs: end.getTime(),
    label: `${String(start.getDate()).padStart(2, "0")}.${String(start.getMonth() + 1).padStart(2, "0")}.`,
  };
}

function countInBucket(items: readonly { created_at: string }[], bucket: ChartBucket): number {
  let n = 0;
  for (const it of items) {
    const t = new Date(it.created_at).getTime();
    if (Number.isFinite(t) && t >= bucket.startMs && t < bucket.endMs) n += 1;
  }
  return n;
}

const euroFmt = (v: number) =>
  `${v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export function PartnerPortalStatisticsCharts({
  tips,
  orders,
  periodMode,
  monthInput,
  yearInput,
  periodStartMs,
  periodEndMs,
  partnerCreatedAt,
}: Props) {
  const buckets = useMemo<ChartBucket[]>(() => {
    const { year: py, month0: pm0 } = partnerStatsEpochMonth(partnerCreatedAt);
    const epochStartMs = new Date(py, pm0, 1, 0, 0, 0, 0).getTime();

    if (periodMode === "year") {
      const y = Number(yearInput);
      const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
      if (year < py) return [];
      const startM = year === py ? pm0 : 0;
      return Array.from({ length: 12 - startM }, (_, i) => monthBucket(year, startM + i, false));
    }

    if (periodMode === "month") {
      const m = /^(\d{4})-(\d{2})$/.exec(monthInput.trim());
      const now = new Date();
      const anchorYear = m ? Number(m[1]) : now.getFullYear();
      const anchorMonth0 = m ? Number(m[2]) - 1 : now.getMonth();
      const span = anchorYear * 12 + anchorMonth0 - (py * 12 + pm0) + 1;
      const months = span < 1 ? 1 : Math.min(12, span);
      const out: ChartBucket[] = [];
      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(anchorYear, anchorMonth0 - i, 1);
        out.push(monthBucket(d.getFullYear(), d.getMonth(), true));
      }
      return out;
    }

    if (periodMode === "day") {
      const day = new Date(periodStartMs);
      const out: ChartBucket[] = [];
      for (let i = DAY_MODE_DAYS - 1; i >= 0; i--) {
        const b = dayBucket(day.getFullYear(), day.getMonth(), day.getDate() - i);
        if (b.endMs <= epochStartMs) continue;
        out.push(b);
      }
      return out;
    }

    /* Zeitraum von–bis: kurze Zeiträume tagesgenau, lange als Monatspunkte (an den Zeitraum geklammert). */
    const spanDays = Math.max(1, Math.round((periodEndMs - periodStartMs) / DAY_MS));
    if (spanDays <= RANGE_DAILY_MAX_DAYS) {
      const out: ChartBucket[] = [];
      let cursor = new Date(periodStartMs);
      while (cursor.getTime() < periodEndMs) {
        out.push(dayBucket(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()));
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1, 0, 0, 0, 0);
      }
      return out;
    }
    const start = new Date(periodStartMs);
    const lastIncluded = new Date(periodEndMs - 1);
    const endIdx = lastIncluded.getFullYear() * 12 + lastIncluded.getMonth();
    const out: ChartBucket[] = [];
    let y = start.getFullYear();
    let m0 = start.getMonth();
    while (y * 12 + m0 <= endIdx) {
      const b = monthBucket(y, m0, true);
      out.push({
        ...b,
        startMs: Math.max(b.startMs, periodStartMs),
        endMs: Math.min(b.endMs, periodEndMs),
      });
      m0 += 1;
      if (m0 === 12) {
        m0 = 0;
        y += 1;
      }
    }
    return out;
  }, [periodMode, monthInput, yearInput, periodStartMs, periodEndMs, partnerCreatedAt]);

  const lineEingaengeOrders = useMemo(
    () =>
      buckets.map((b) => ({
        name: b.label,
        tipps: countInBucket(tips, b),
        pflegebox: countInBucket(orders, b),
      })),
    [buckets, tips, orders],
  );

  const lineStatus = useMemo(
    () =>
      buckets.map((b) => {
        const row = { name: b.label } as { name: string } & Record<PartnerTipAdminStatus, number>;
        for (const s of PARTNER_TIP_ADMIN_STATUSES) row[s] = 0;
        for (const t of tips) {
          const ti = new Date(t.created_at).getTime();
          if (!Number.isFinite(ti) || ti < b.startMs || ti >= b.endMs) continue;
          if (row[t.admin_status] !== undefined) row[t.admin_status] += 1;
        }
        return row;
      }),
    [buckets, tips],
  );

  const lineProvision = useMemo(
    () =>
      buckets.map((b) => {
        const subset = tips.filter((t) => {
          const ti = new Date(t.created_at).getTime();
          return Number.isFinite(ti) && ti >= b.startMs && ti < b.endMs;
        });
        const p = provisionEuroTotalsForTips(subset);
        return { name: b.label, monatlich: p.monatlich, einmal: p.einmal, gesamt: p.total };
      }),
    [buckets, tips],
  );

  return (
    <div className="mt-10 space-y-10">
      <div>
        <h2 className="text-base font-semibold text-[#0F4F68]">Ihre Verläufe (Liniendiagramme)</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Nur Ihre eigenen Tippgeber und Pflegebox-Bestellungen. Zeiten vor Ihrer Partner-Anlage werden nicht angezeigt.
          Tagesansicht: die letzten {DAY_MODE_DAYS} Tage bis zum gewählten Tag. Monatsansicht: bis zu 12 Monate bis zum
          gewählten Monat. Jahresansicht: ab dem Anlagemonat im jeweiligen Jahr. Zeitraum von–bis: bis {RANGE_DAILY_MAX_DAYS}{" "}
          Tage tagesgenau, längere Zeiträume als Monatspunkte.
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
        <h3 className="text-sm font-bold text-[#0F4F68]">Verwaltungsstatus im Zeitverlauf (Ihre Tipps)</h3>
        <p className="mt-1 text-xs text-neutral-500">Eine Linie pro Status — nur Eingänge im jeweiligen Abschnitt.</p>
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
        <h3 className="text-sm font-bold text-[#0F4F68]">Geschätzte Provision (EUR) nach Eingangsdatum</h3>
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
