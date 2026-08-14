"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchContactKindDailyStatsAction, type ContactStatsScope } from "@/lib/actions/admin-homepage-analytics";
import {
  AdminDateRangeFields,
  firstOfMonthInputValue,
  formatDayInputDe,
  todayInputValue,
} from "@/components/partner/admin/AdminDateRangeFields";
import { CHART_AXIS_TICK, CHART_GRID } from "@/components/partner/partner-chart-theme";
import {
  CONTACT_CHANNEL_GROUPS,
  kindLabel,
  strokeForChannelGroup,
  type ContactChannelGroupId,
} from "@/components/partner/admin/contact-sources-admin-kind-labels";

type Scope = ContactStatsScope;

type Props = {
  chartYear: number;
};

type ChannelGroupStats = {
  id: ContactChannelGroupId;
  label: string;
  total: number;
  series: { label: string; day: string; value: number }[];
  kindBreakdown: { kind: string; label: string; count: number }[];
  color: string;
  hasData: boolean;
};

function scopeDescription(
  scope: Scope,
  chartYear: number,
  month: number,
  dayClamped: number,
): string {
  if (scope === "tag") {
    return new Date(chartYear, month - 1, dayClamped).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (scope === "monat") {
    return new Date(chartYear, month - 1, 1).toLocaleDateString("de-DE", {
      month: "long",
      year: "numeric",
    });
  }
  return `Kalenderjahr ${chartYear}`;
}

function sumKindValues(
  row: Record<string, string | number>,
  kinds: readonly string[],
): number {
  return kinds.reduce((acc, k) => acc + Number(row[k] ?? 0), 0);
}

export function AdminContactKanalTagesverlaufPanel({ chartYear }: Props) {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [dayOfMonth, setDayOfMonth] = useState(() => new Date().getDate());
  const [rangeFrom, setRangeFrom] = useState(() => firstOfMonthInputValue());
  const [rangeTo, setRangeTo] = useState(() => todayInputValue());
  const [scope, setScope] = useState<Scope>("jahr");
  const [dailyKinds, setDailyKinds] = useState<string[]>([]);
  const [dailySeries, setDailySeries] = useState<Record<string, string | number>[]>([]);
  const [dailyErr, setDailyErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const daysInMonth = useMemo(() => new Date(chartYear, month, 0).getDate(), [chartYear, month]);
  const dayClamped = Math.min(daysInMonth, Math.max(1, dayOfMonth));

  useEffect(() => {
    setDayOfMonth((d) => Math.min(daysInMonth, Math.max(1, d)));
  }, [daysInMonth]);

  const load = useCallback(async () => {
    setLoading(true);
    setDailyErr(null);
    const dailyRes = await fetchContactKindDailyStatsAction(chartYear, month, scope, dayClamped, rangeFrom, rangeTo);
    if (!dailyRes.ok) {
      setDailyErr(dailyRes.message);
      setDailyKinds([]);
      setDailySeries([]);
    } else {
      setDailyErr(null);
      setDailyKinds(dailyRes.kinds);
      setDailySeries(dailyRes.chartSeries);
    }
    setLoading(false);
  }, [chartYear, month, scope, dayClamped, rangeFrom, rangeTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const periodLabel = useMemo(() => {
    if (scope === "zeitraum") return `von ${formatDayInputDe(rangeFrom)} bis ${formatDayInputDe(rangeTo)}`;
    return scopeDescription(scope, chartYear, month, dayClamped);
  }, [scope, chartYear, month, dayClamped, rangeFrom, rangeTo]);

  const channelGroups = useMemo((): ChannelGroupStats[] => {
    return CONTACT_CHANNEL_GROUPS.map((group) => {
      const series = dailySeries.map((row) => ({
        label: String(row.label ?? ""),
        day: String(row.day ?? ""),
        value: sumKindValues(row, group.kinds),
      }));
      const total = series.reduce((acc, p) => acc + p.value, 0);
      const kindBreakdown = group.kinds
        .filter((k) => dailyKinds.includes(k))
        .map((k) => {
          const count =
            scope === "tag" && dailySeries.length === 1
              ? Number(dailySeries[0][k] ?? 0)
              : dailySeries.reduce((acc, row) => acc + Number(row[k] ?? 0), 0);
          return { kind: k, label: kindLabel(k), count };
        })
        .filter((b) => b.count > 0 || group.kinds.length === 1);
      return {
        id: group.id,
        label: group.label,
        total,
        series,
        kindBreakdown,
        color: strokeForChannelGroup(group.id),
        hasData: total > 0,
      };
    });
  }, [dailySeries, dailyKinds, scope]);

  const grandTotal = useMemo(
    () => channelGroups.reduce((acc, g) => acc + g.total, 0),
    [channelGroups],
  );

  const groupsWithData = channelGroups.filter((g) => g.hasData);
  const showCharts = !dailyErr && !loading && scope !== "tag" && dailySeries.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-[#0F4F68]">Anfragen nach Kanal</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Je Eingangsweg getrennt – wie viele Anfragen am gewählten Tag, im Monat, im Jahr {chartYear} oder in einem
          frei wählbaren Zeitraum (von–bis) eingegangen sind. Herkunft und Wochentage stehen im anderen Kontaktfeld.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <span className="block text-xs font-bold uppercase text-[#0F4F68]/75">Zeitraum</span>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Zeitraum">
            <button
              type="button"
              onClick={() => setScope("tag")}
              className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                scope === "tag"
                  ? "bg-[#0F4F68] text-white shadow-sm"
                  : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
              }`}
            >
              Ein Tag
            </button>
            <button
              type="button"
              onClick={() => setScope("monat")}
              className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                scope === "monat"
                  ? "bg-[#0F4F68] text-white shadow-sm"
                  : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
              }`}
            >
              Monat
            </button>
            <button
              type="button"
              onClick={() => setScope("jahr")}
              className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                scope === "jahr"
                  ? "bg-[#0F4F68] text-white shadow-sm"
                  : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
              }`}
            >
              Jahr
            </button>
            <button
              type="button"
              onClick={() => setScope("zeitraum")}
              className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                scope === "zeitraum"
                  ? "bg-[#0F4F68] text-white shadow-sm"
                  : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
              }`}
            >
              Zeitraum
            </button>
          </div>
        </div>

        {scope === "zeitraum" ? (
          <AdminDateRangeFields
            idPrefix="cs-kanal"
            from={rangeFrom}
            to={rangeTo}
            onFromChange={setRangeFrom}
            onToChange={setRangeTo}
          />
        ) : null}

        {scope === "tag" || scope === "monat" ? (
          <div>
            <label htmlFor="cs-kanal-month" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
              Monat
            </label>
            <select
              id="cs-kanal-month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="mt-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(chartYear, m - 1, 1).toLocaleString("de-DE", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {scope === "tag" ? (
          <div>
            <label htmlFor="cs-kanal-day" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
              Kalendertag
            </label>
            <select
              id="cs-kanal-day"
              value={dayClamped}
              onChange={(e) => setDayOfMonth(Number(e.target.value))}
              className="mt-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20"
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {new Date(chartYear, month - 1, d).toLocaleDateString("de-DE", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => void load()}
          className="min-h-10 rounded-xl border border-[#0F4F68]/30 bg-white px-4 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
        >
          Aktualisieren
        </button>
      </div>

      {loading ? <p className="text-sm text-neutral-500">Lade Tagesauswertung…</p> : null}
      {dailyErr ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {dailyErr}
        </p>
      ) : null}

      {!dailyErr && !loading ? (
        <>
          <section aria-labelledby="cs-kanal-overview-heading" className="space-y-4">
            <div>
              <h4 id="cs-kanal-overview-heading" className="text-base font-bold text-[#0F4F68]">
                Übersicht · {periodLabel}
              </h4>
              <p className="mt-1 text-sm text-neutral-600">
                Anfragen gesamt:{" "}
                <span className="font-semibold tabular-nums text-neutral-900">
                  {grandTotal.toLocaleString("de-DE")}
                </span>
                {grandTotal === 0 ? " – im gewählten Zeitraum liegen noch keine Daten vor." : null}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {channelGroups.map((group) => (
                <a
                  key={group.id}
                  href={`#cs-kanal-${group.id}`}
                  className={`rounded-xl border-2 p-3 transition hover:border-[#0F4F68]/35 hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                    group.hasData
                      ? "border-[#0F4F68]/18 bg-white"
                      : "border-neutral-100 bg-neutral-50/80 opacity-70"
                  }`}
                >
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/75">
                    {group.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums leading-none text-[#0F4F68]">
                    {group.total.toLocaleString("de-DE")}
                  </p>
                  {grandTotal > 0 ? (
                    <p className="mt-1 text-[0.65rem] text-neutral-500">
                      {Math.round((group.total / grandTotal) * 100)} % Anteil
                    </p>
                  ) : null}
                </a>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            {CONTACT_CHANNEL_GROUPS.map((groupDef) => {
              const group = channelGroups.find((g) => g.id === groupDef.id);
              if (!group) return null;

              return (
                <section
                  key={group.id}
                  id={`cs-kanal-${group.id}`}
                  className="scroll-mt-6 rounded-2xl border border-[#0F4F68]/12 bg-[#F8FBFC] p-4 sm:p-5"
                  aria-labelledby={`cs-kanal-heading-${group.id}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4
                        id={`cs-kanal-heading-${group.id}`}
                        className="text-base font-bold text-[#0F4F68]"
                      >
                        {group.label}
                      </h4>
                      <p className="mt-1 text-sm text-neutral-600">{periodLabel}</p>
                    </div>
                    <p className="rounded-xl bg-white px-4 py-2 text-right shadow-sm ring-1 ring-[#0F4F68]/10">
                      <span className="block text-[0.65rem] font-bold uppercase text-[#0F4F68]/70">
                        {scope === "tag"
                          ? "An diesem Tag"
                          : scope === "monat"
                            ? "Im Monat"
                            : scope === "jahr"
                              ? "Im Jahr"
                              : "Im Zeitraum"}
                      </span>
                      <span className="text-2xl font-bold tabular-nums text-[#0F4F68]">
                        {group.total.toLocaleString("de-DE")}
                      </span>
                    </p>
                  </div>

                  {group.kindBreakdown.length > 1 ? (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.kindBreakdown.map((b) => (
                        <li
                          key={b.kind}
                          className="rounded-lg bg-white px-2.5 py-1 text-xs text-neutral-700 ring-1 ring-neutral-200"
                        >
                          <span className="font-semibold">{b.label}:</span>{" "}
                          <span className="tabular-nums">{b.count.toLocaleString("de-DE")}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {scope === "tag" ? (
                    <p className="mt-4 text-sm text-neutral-600">
                      {group.total === 0
                        ? "Keine Anfragen an diesem Tag."
                        : `${group.total.toLocaleString("de-DE")} Anfrage${group.total === 1 ? "" : "n"} über diesen Kanal.`}
                    </p>
                  ) : null}

                  {showCharts ? (
                    <div
                      className="mt-4 h-[min(220px,40vh)] w-full min-h-[180px]"
                      role="img"
                      aria-label={`Verlauf ${group.label} pro Kalendertag`}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={group.series} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
                          <defs>
                            <linearGradient id={`fill-${group.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={group.color} stopOpacity={0.35} />
                              <stop offset="100%" stopColor={group.color} stopOpacity={0.04} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
                          <XAxis
                            dataKey="label"
                            tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={36} />
                          <Tooltip
                            formatter={(value: number | string) => [
                              typeof value === "number"
                                ? value.toLocaleString("de-DE")
                                : Number(value || 0).toLocaleString("de-DE"),
                              "Anfragen",
                            ]}
                            labelFormatter={(_, items) => {
                              const datum = items?.[0]?.payload as { day?: string } | undefined;
                              const iso = datum?.day;
                              if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso))
                                return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                });
                              return "";
                            }}
                            contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            name={group.label}
                            stroke={group.color}
                            fill={`url(#fill-${group.id})`}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: group.color }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}

                  {!group.hasData && scope !== "tag" ? (
                    <p className="mt-4 text-sm text-neutral-500">Keine Anfragen im gewählten Zeitraum.</p>
                  ) : null}
                </section>
              );
            })}
          </div>

          {grandTotal === 0 && groupsWithData.length === 0 ? (
            <p className="text-sm text-neutral-600">
              Im gewählten Zeitraum liegen keine Kanaldaten vor (oder die Auswertung ist noch leer).
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
