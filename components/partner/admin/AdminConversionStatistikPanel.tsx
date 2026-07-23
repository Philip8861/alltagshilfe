"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CONVERSION_STATS_START_DAY,
  fetchConversionStatsAction,
  type ContactStatsScope,
  type ConversionStatsResult,
} from "@/lib/actions/admin-homepage-analytics";
import { CHART_AMBER, CHART_AXIS_TICK, CHART_EMERALD, CHART_GRID, CHART_TEAL } from "@/components/partner/partner-chart-theme";
import { strokeForChannelGroup, type ContactChannelGroupId } from "@/components/partner/admin/contact-sources-admin-kind-labels";

const TRACKING_START_LABEL = new Date(`${CONVERSION_STATS_START_DAY}T12:00:00`).toLocaleDateString("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

type Scope = ContactStatsScope;

type Props = {
  chartYear: number;
};

function scopeDescription(scope: Scope, chartYear: number, month: number, dayClamped: number): string {
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

function formatPct(v: number | null | undefined): string {
  if (v == null || Number.isNaN(v)) return "–";
  return `${v.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %`;
}

function formatNum(v: number | null | undefined, digits = 1): string {
  if (v == null || Number.isNaN(v)) return "–";
  return v.toLocaleString("de-DE", { maximumFractionDigits: digits });
}

export function AdminConversionStatistikPanel({ chartYear }: Props) {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [dayOfMonth, setDayOfMonth] = useState(() => new Date().getDate());
  const [scope, setScope] = useState<Scope>("monat");
  const [data, setData] = useState<ConversionStatsResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const daysInMonth = useMemo(() => new Date(chartYear, month, 0).getDate(), [chartYear, month]);
  const dayClamped = Math.min(daysInMonth, Math.max(1, dayOfMonth));

  useEffect(() => {
    setDayOfMonth((d) => Math.min(daysInMonth, Math.max(1, d)));
  }, [daysInMonth]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const res = await fetchConversionStatsAction(chartYear, month, scope, dayClamped);
    if (!res.ok) {
      setErr(res.message);
      setData(null);
    } else {
      setData(res.data);
    }
    setLoading(false);
  }, [chartYear, month, scope, dayClamped]);

  useEffect(() => {
    void load();
  }, [load]);

  const periodLabel = useMemo(
    () => scopeDescription(scope, chartYear, month, dayClamped),
    [scope, chartYear, month, dayClamped],
  );

  const chartData = useMemo(() => {
    if (!data) return [];
    const hist = data.series.map((p) => ({
      ...p,
      cvr: p.conversionPercent ?? 0,
      forecastVisitors: null as number | null,
      forecastCompletions: null as number | null,
    }));
    if (scope === "tag" || data.forecastSeries.length === 0) return hist;
    const forecast = data.forecastSeries.map((p) => ({
      label: p.label,
      day: p.day,
      visitors: null as number | null,
      completions: null as number | null,
      cvr: null as number | null,
      conversionPercent: null,
      forecastVisitors: p.forecastVisitors ?? null,
      forecastCompletions: p.forecastCompletions ?? null,
    }));
    return [...hist, ...forecast];
  }, [data, scope]);

  const showCharts = !loading && !err && data && scope !== "tag" && chartData.length > 0;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[#0F4F68]">Besucher &amp; Conversion</h3>
        <p
          className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950"
          role="note"
        >
          Wichtig: In diesem Bereich werden Besucher und Anfragen erst ab dem {TRACKING_START_LABEL}{" "}
          gewertet. Daten davor fließen hier nicht ein (sonst wäre die Conversion verfälscht). Ältere
          Anfragen bleiben unter „Anfragen nach Kanal“ und den übrigen Statistik-Kacheln sichtbar.
        </p>
        <p className="text-sm text-neutral-600">
          Zählt Unique Visitors mit Statistik-Cookie-Einwilligung (ein Besucher pro Tag, nicht Klicks).
          Daraus entstehen IST-Werte (bisheriger Schnitt) und Voraussichtlich-Werte (Prognose) für
          Anfragen pro Tag, Monat und Jahr – je Formular und gesamt.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <span className="block text-xs font-bold uppercase text-[#0F4F68]/75">Zeitraum</span>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Zeitraum">
            {(
              [
                ["tag", "Ein Tag"],
                ["monat", "Monat"],
                ["jahr", "Jahr"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setScope(id)}
                className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                  scope === id
                    ? "bg-[#0F4F68] text-white shadow-sm"
                    : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {scope === "tag" || scope === "monat" ? (
          <div>
            <label htmlFor="cv-month" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
              Monat
            </label>
            <select
              id="cv-month"
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
            <label htmlFor="cv-day" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
              Kalendertag
            </label>
            <select
              id="cv-day"
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

      {loading ? <p className="text-sm text-neutral-500">Lade Conversion-Statistik…</p> : null}
      {err ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{err}</p>
      ) : null}

      {!loading && !err && data ? (
        <>
          <section aria-labelledby="cv-kpi-heading" className="space-y-3">
            <h4 id="cv-kpi-heading" className="text-base font-bold text-[#0F4F68]">
              Kennzahlen · {periodLabel}
            </h4>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA]/80 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/70">Besucher</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-[#0F4F68]">
                  {data.visitorsTotal.toLocaleString("de-DE")}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">mit Statistik-Consent</p>
              </div>
              <div className="rounded-2xl border border-[#0F4F68]/12 bg-white px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/70">Anfragen gesamt</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                  {data.completionsTotal.toLocaleString("de-DE")}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">abgeschlossene Formulare</p>
              </div>
              <div className="rounded-2xl border border-[#0F4F68]/12 bg-white px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/70">Conversion</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-700">
                  {formatPct(data.conversionPercent)}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">Anfragen ÷ Besucher</p>
              </div>
              <div className="rounded-2xl border border-[#0F4F68]/12 bg-white px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/70">Besucher / Anfrage</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900">
                  {formatNum(data.visitorsPerCompletion, 1)}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">Ø wie viele Besucher bis 1 Anfrage</p>
              </div>
            </div>
            {data.visitorsTotal === 0 && data.completionsTotal === 0 ? (
              <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                Noch keine Daten in diesem Zeitraum. Auswertung erst ab {TRACKING_START_LABEL} (nur mit
                Statistik-Cookie). Frühere Anfragen bleiben unter „Anfragen nach Kanal“ sichtbar.
              </p>
            ) : null}
          </section>

          <section aria-labelledby="cv-ist-prognose-heading" className="space-y-3">
            <div>
              <h4 id="cv-ist-prognose-heading" className="text-base font-bold text-[#0F4F68]">
                IST &amp; Voraussichtlich · Anfragen je Formular
              </h4>
              <p className="mt-1 text-sm text-neutral-600">
                Aus {data.istPrognose.daysObserved.toLocaleString("de-DE")} ausgewerteten Tag
                {data.istPrognose.daysObserved === 1 ? "" : "en"}:{" "}
                <span className="font-semibold text-neutral-800">
                  {formatNum(data.istPrognose.visitorsPerDayIst, 1)} Besucher/Tag (IST)
                </span>
                {" · "}
                <span className="font-semibold text-neutral-800">
                  {formatNum(data.istPrognose.visitorsPerDayPrognose, 1)} Besucher/Tag (Voraussichtlich)
                </span>
                . Beispiel: bei 40 Besuchern/Tag und 1 Kontakt-Anfrage ≈ 1 Anfrage/Tag, ≈ 30/Monat, ≈
                365/Jahr.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#F2F9FA] text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">
                  <tr>
                    <th className="px-3 py-3 sm:px-4" rowSpan={2}>
                      Formular
                    </th>
                    <th className="px-3 py-3 text-right sm:px-4" rowSpan={2}>
                      Anfragen
                      <br />
                      <span className="font-semibold normal-case tracking-normal text-neutral-500">
                        (Zeitraum)
                      </span>
                    </th>
                    <th
                      className="border-l border-[#0F4F68]/15 px-3 py-2 text-center sm:px-4"
                      colSpan={3}
                    >
                      IST (bisheriger Schnitt)
                    </th>
                    <th
                      className="border-l border-[#0F4F68]/15 px-3 py-2 text-center sm:px-4"
                      colSpan={3}
                    >
                      Voraussichtlich (Prognose)
                    </th>
                  </tr>
                  <tr className="bg-[#E8F3F6] text-[11px] text-[#0F4F68]/75">
                    <th className="border-l border-[#0F4F68]/15 px-2 py-2 text-right font-bold">/ Tag</th>
                    <th className="px-2 py-2 text-right font-bold">/ Monat</th>
                    <th className="px-2 py-2 text-right font-bold">/ Jahr</th>
                    <th className="border-l border-[#0F4F68]/15 px-2 py-2 text-right font-bold">/ Tag</th>
                    <th className="px-2 py-2 text-right font-bold">/ Monat</th>
                    <th className="px-2 py-2 text-right font-bold">/ Jahr</th>
                  </tr>
                </thead>
                <tbody>
                  {data.istPrognose.rows.map((row) => {
                    const isTotal = row.id === "gesamt";
                    return (
                      <tr
                        key={row.id}
                        className={`border-t border-neutral-100 ${
                          isTotal ? "bg-[#F2F9FA]/90 font-semibold" : ""
                        }`}
                      >
                        <td className="px-3 py-2.5 text-neutral-900 sm:px-4">
                          {!isTotal ? (
                            <span
                              className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: strokeForChannelGroup(row.id as ContactChannelGroupId),
                              }}
                              aria-hidden
                            />
                          ) : null}
                          {row.label}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums sm:px-4">
                          {row.completionsIst.toLocaleString("de-DE")}
                        </td>
                        <td className="border-l border-neutral-100 px-2 py-2.5 text-right tabular-nums">
                          {formatNum(row.ist.perDay, 2)}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums">
                          {formatNum(row.ist.perMonth, 1)}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums">
                          {formatNum(row.ist.perYear, 1)}
                        </td>
                        <td className="border-l border-neutral-100 px-2 py-2.5 text-right tabular-nums text-emerald-800">
                          {formatNum(row.prognose.perDay, 2)}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums text-emerald-800">
                          {formatNum(row.prognose.perMonth, 1)}
                        </td>
                        <td className="px-2 py-2.5 text-right tabular-nums text-emerald-800">
                          {formatNum(row.prognose.perYear, 1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neutral-500">
              IST = Anfragen im Zeitraum ÷ Tage. Voraussichtlich = Besuchstrend × bisherige Conversion je
              Formular (hochgerechnet auf Tag / Ø-Monat / Jahr). Orientierung, keine Garantie.
            </p>
          </section>

          <section aria-labelledby="cv-channels-heading" className="space-y-3">
            <h4 id="cv-channels-heading" className="text-base font-bold text-[#0F4F68]">
              Conversion je Formular
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#F2F9FA] text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">
                  <tr>
                    <th className="px-4 py-3">Formular</th>
                    <th className="px-4 py-3 text-right">Anfragen</th>
                    <th className="px-4 py-3 text-right">Conversion</th>
                    <th className="px-4 py-3 text-right">Besucher / Anfrage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.channels.map((ch) => (
                    <tr key={ch.id} className="border-t border-neutral-100">
                      <td className="px-4 py-2.5 font-medium text-neutral-900">
                        <span
                          className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: strokeForChannelGroup(ch.id as ContactChannelGroupId),
                          }}
                          aria-hidden
                        />
                        {ch.label}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-semibold">
                        {ch.completions.toLocaleString("de-DE")}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{formatPct(ch.conversionPercent)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {formatNum(ch.visitorsPerCompletion, 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {data.forecast ? (
            <section
              aria-labelledby="cv-forecast-heading"
              className="space-y-3 rounded-2xl border border-[#0F4F68]/14 bg-[#F2F9FA]/60 p-4 sm:p-5"
            >
              <h4 id="cv-forecast-heading" className="text-base font-bold text-[#0F4F68]">
                Trend &amp; Kurzprognose (nächste 30 Tage)
              </h4>
              <p className="text-sm text-neutral-700">{data.forecast.trendLabel}</p>
              <ul className="grid gap-2 text-sm text-neutral-800 sm:grid-cols-2">
                <li>
                  Besucher/Tag (Voraussichtlich):{" "}
                  <strong className="tabular-nums">{formatNum(data.forecast.visitorsPerDay, 1)}</strong>
                </li>
                <li>
                  Ø Conversion:{" "}
                  <strong className="tabular-nums">{formatPct(data.forecast.avgConversionPercent)}</strong>
                </li>
                <li>
                  Anfragen/Tag (Voraussichtlich):{" "}
                  <strong className="tabular-nums">{formatNum(data.forecast.completionsPerDay, 2)}</strong>
                </li>
                <li>
                  Anfragen in den nächsten 30 Tagen:{" "}
                  <strong className="tabular-nums">
                    {formatNum(data.forecast.completionsNext30Days, 1)}
                  </strong>
                </li>
              </ul>
              <p className="text-xs text-neutral-500">
                Kurzprognose folgt dem Besuchstrend und der bisherigen Ø-Conversion. Details je Formular
                stehen in der Tabelle „IST &amp; Voraussichtlich“.
              </p>
            </section>
          ) : null}

          {showCharts ? (
            <section aria-labelledby="cv-chart-heading" className="space-y-4">
              <h4 id="cv-chart-heading" className="text-base font-bold text-[#0F4F68]">
                Verlaufskurve
              </h4>
              <div className="h-72 w-full min-w-0 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} minTickGap={24} />
                    <YAxis
                      yAxisId="count"
                      tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }}
                      allowDecimals={false}
                      width={40}
                    />
                    <YAxis
                      yAxisId="pct"
                      orientation="right"
                      tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }}
                      unit="%"
                      width={44}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, borderColor: "#d4e4ea" }}
                      formatter={(value: number | string, name: string) => {
                        const n = typeof value === "number" ? value : Number(value);
                        if (name === "Conversion %") {
                          return [`${n.toLocaleString("de-DE", { maximumFractionDigits: 2 })} %`, name];
                        }
                        return [n.toLocaleString("de-DE", { maximumFractionDigits: 2 }), name];
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="count"
                      type="monotone"
                      dataKey="visitors"
                      name="Besucher"
                      stroke={CHART_TEAL}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="count"
                      type="monotone"
                      dataKey="completions"
                      name="Anfragen"
                      stroke={CHART_EMERALD}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="pct"
                      type="monotone"
                      dataKey="cvr"
                      name="Conversion %"
                      stroke={CHART_AMBER}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="count"
                      type="monotone"
                      dataKey="forecastVisitors"
                      name="Prognose Besucher"
                      stroke={CHART_TEAL}
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      dot={false}
                      connectNulls
                    />
                    <Line
                      yAxisId="count"
                      type="monotone"
                      dataKey="forecastCompletions"
                      name="Prognose Anfragen"
                      stroke={CHART_EMERALD}
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      dot={false}
                      connectNulls
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
