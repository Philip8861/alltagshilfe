"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchHomepageDeviceBreakdownAction,
  fetchHomepagePathSeriesAction,
  fetchHomepageTotalsSeriesAction,
  fetchHomepageYearPathTotalsAction,
  resetHomepageSiteAnalyticsAction,
  type HomepageDeviceBreakdownRow,
  type HomepageSeriesPoint,
  type HomepageTrafficGranularity,
} from "@/lib/actions/admin-homepage-analytics";
import { CHART_AXIS_TICK, CHART_GRID, CHART_TEAL } from "@/components/partner/partner-chart-theme";
import { HomepageStatTileButton } from "@/components/partner/admin/HomepageStatTileButton";
import {
  deviceCategoryLabelDe,
  type SiteTrafficDeviceCategory,
} from "@/lib/site-analytics/device-category";

const DEVICE_ORDER: readonly SiteTrafficDeviceCategory[] = ["mobile", "tablet", "desktop", "unknown"];

function mergeDeviceBreakdown(rows: HomepageDeviceBreakdownRow[]): HomepageDeviceBreakdownRow[] {
  const m = new Map<string, number>();
  for (const r of rows) m.set(r.device_category, r.view_count);
  return DEVICE_ORDER.map((device_category) => ({
    device_category,
    view_count: m.get(device_category) ?? 0,
  }));
}

function deviceLabel(cat: string): string {
  if (cat === "mobile" || cat === "tablet" || cat === "desktop" || cat === "unknown") {
    return deviceCategoryLabelDe(cat);
  }
  return cat;
}

type TrafficTileId = "totals" | "device" | "paths";

type Props = {
  chartYear: number;
};

function GranularityToggle({
  value,
  onChange,
  idPrefix,
}: {
  value: HomepageTrafficGranularity;
  onChange: (g: HomepageTrafficGranularity) => void;
  idPrefix: string;
}) {
  const opts: { id: HomepageTrafficGranularity; label: string }[] = [
    { id: "tag", label: "Tag" },
    { id: "monat", label: "Monat" },
    { id: "jahr", label: "Jahr" },
  ];
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Zeitraster">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          id={`${idPrefix}-${o.id}`}
          onClick={() => onChange(o.id)}
          className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
            value === o.id
              ? "bg-[#0F4F68] text-white shadow-sm"
              : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function TrafficLineChart({ data, title }: { data: HomepageSeriesPoint[]; title: string }) {
  const chartData = data.map((d) => ({ ...d, name: d.label }));
  return (
    <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-bold text-[#0F4F68]">{title}</h4>
      <div className="mt-4 h-[min(320px,50vh)] w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
            <XAxis dataKey="name" tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={44} />
            <Tooltip
              formatter={(v: number) => [v.toLocaleString("de-DE"), "Aufrufe"]}
              contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
            />
            <Line
              type="monotone"
              dataKey="views"
              name="Aufrufe"
              stroke={CHART_TEAL}
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AdminHomepageTrafficPanel({ chartYear }: Props) {
  const [openTile, setOpenTile] = useState<TrafficTileId>("totals");
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [totalGran, setTotalGran] = useState<HomepageTrafficGranularity>("monat");
  const [totalSeries, setTotalSeries] = useState<HomepageSeriesPoint[]>([]);
  const [totalLoading, setTotalLoading] = useState(true);
  const [totalErr, setTotalErr] = useState<string | null>(null);

  const [paths, setPaths] = useState<{ path: string; view_count: number }[]>([]);
  const [pathsLoading, setPathsLoading] = useState(true);
  const [pathsErr, setPathsErr] = useState<string | null>(null);

  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [pathGran, setPathGran] = useState<HomepageTrafficGranularity>("monat");
  const [pathSeries, setPathSeries] = useState<HomepageSeriesPoint[]>([]);
  const [pathLoading, setPathLoading] = useState(false);
  const [pathErr, setPathErr] = useState<string | null>(null);

  const [deviceScope, setDeviceScope] = useState<"monat" | "jahr">("jahr");
  const [deviceRows, setDeviceRows] = useState<HomepageDeviceBreakdownRow[]>([]);
  const [deviceLoading, setDeviceLoading] = useState(true);
  const [deviceErr, setDeviceErr] = useState<string | null>(null);

  const [resetBusy, setResetBusy] = useState(false);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const loadTotals = useCallback(async () => {
    setTotalLoading(true);
    setTotalErr(null);
    const res = await fetchHomepageTotalsSeriesAction(chartYear, month, totalGran);
    if (!res.ok) {
      setTotalErr(res.message);
      setTotalSeries([]);
    } else {
      setTotalSeries(res.data);
    }
    setTotalLoading(false);
  }, [chartYear, month, totalGran]);

  const loadPaths = useCallback(async () => {
    setPathsLoading(true);
    setPathsErr(null);
    const res = await fetchHomepageYearPathTotalsAction(chartYear);
    if (!res.ok) {
      setPathsErr(res.message);
      setPaths([]);
    } else {
      setPaths(res.data);
    }
    setPathsLoading(false);
  }, [chartYear]);

  const loadDeviceBreakdown = useCallback(async () => {
    setDeviceLoading(true);
    setDeviceErr(null);
    const res = await fetchHomepageDeviceBreakdownAction(chartYear, month, deviceScope);
    if (!res.ok) {
      setDeviceErr(res.message);
      setDeviceRows([]);
    } else {
      setDeviceRows(mergeDeviceBreakdown(res.data));
    }
    setDeviceLoading(false);
  }, [chartYear, month, deviceScope]);

  const loadPathSeries = useCallback(async () => {
    if (!expandedPath) {
      setPathSeries([]);
      return;
    }
    setPathLoading(true);
    setPathErr(null);
    const res = await fetchHomepagePathSeriesAction(expandedPath, chartYear, month, pathGran);
    if (!res.ok) {
      setPathErr(res.message);
      setPathSeries([]);
    } else {
      setPathSeries(res.data);
    }
    setPathLoading(false);
  }, [expandedPath, chartYear, month, pathGran]);

  useEffect(() => {
    void loadTotals();
  }, [loadTotals]);

  useEffect(() => {
    void loadPaths();
  }, [loadPaths]);

  useEffect(() => {
    void loadDeviceBreakdown();
  }, [loadDeviceBreakdown]);

  useEffect(() => {
    void loadPathSeries();
  }, [loadPathSeries]);

  const totalSum = totalSeries.reduce((s, p) => s + p.views, 0);
  const deviceSum = deviceRows.reduce((s, r) => s + r.view_count, 0);
  const pathCount = paths.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="hp-traffic-month" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
            Monat (für Ansicht „Tag“ &amp; Pfad-Detail „Tag“)
          </label>
          <select
            id="hp-traffic-month"
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
        <button
          type="button"
          onClick={() => {
            void loadTotals();
            void loadPaths();
            void loadDeviceBreakdown();
            void loadPathSeries();
          }}
          disabled={resetBusy}
          className="min-h-10 rounded-xl border border-[#0F4F68]/30 bg-white px-4 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA] disabled:opacity-50"
        >
          Aktualisieren
        </button>
        <button
          type="button"
          disabled={resetBusy}
          onClick={async () => {
            const ok = window.confirm(
              "Alle Homepage-Aufrufstatistiken unwiderruflich löschen? (Alle Tage, Pfade und Geräte – Zähler starten bei null. Auch Ratgeber-Live-Zähler basieren auf denselben Daten.)",
            );
            if (!ok) return;
            setResetBusy(true);
            setResetErr(null);
            const res = await resetHomepageSiteAnalyticsAction();
            setResetBusy(false);
            if (!res.ok) {
              setResetErr(res.message);
              return;
            }
            setExpandedPath(null);
            void loadTotals();
            void loadPaths();
            void loadDeviceBreakdown();
            void loadPathSeries();
          }}
          className="min-h-10 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
        >
          {resetBusy ? "Wird geleert…" : "Alle Zähler zurücksetzen"}
        </button>
      </div>
      {resetErr ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">{resetErr}</p>
      ) : null}

      <p className="text-sm text-neutral-600">
        Wählen Sie unten einen Bereich per Kachel – die Details erscheinen darunter. Monat und Aktualisieren gelten für
        alle Blöcke.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <HomepageStatTileButton
          title="Aufrufe gesamt"
          subtitle="Alle Seiten der Website, Verlauf nach Tag, Monat oder Jahr."
          metricPrimary={totalLoading ? "…" : totalErr ? "—" : totalSum.toLocaleString("de-DE")}
          metricHint="Summe der sichtbaren Periode (Diagramm)"
          selected={openTile === "totals"}
          onClick={() => setOpenTile("totals")}
        />
        <HomepageStatTileButton
          title="Aufrufe nach Gerät"
          subtitle="Mobil, Tablet, Desktop – grobe Einordnung per User-Agent."
          metricPrimary={deviceLoading ? "…" : deviceErr ? "—" : deviceSum.toLocaleString("de-DE")}
          metricHint="Summe Aufrufe (gewählter Zeitraum)"
          selected={openTile === "device"}
          onClick={() => setOpenTile("device")}
        />
        <HomepageStatTileButton
          title="Aufrufe je Seite"
          subtitle="Top-URLs im Jahr – Pfad aufklappen für Verlauf."
          metricPrimary={pathsLoading ? "…" : pathsErr ? "—" : pathCount.toLocaleString("de-DE")}
          metricHint={`Pfade mit Daten · Jahr ${chartYear}`}
          selected={openTile === "paths"}
          onClick={() => setOpenTile("paths")}
        />
      </div>

      <div
        className="rounded-2xl border-2 border-[#0F4F68]/14 bg-white p-4 shadow-[0_8px_30px_-18px_rgba(15,79,104,0.28)] sm:p-6"
        role="region"
        aria-label={
          openTile === "totals"
            ? "Detail: Aufrufe gesamt"
            : openTile === "device"
              ? "Detail: Aufrufe nach Gerät"
              : "Detail: Aufrufe je Seite"
        }
      >
        {openTile === "totals" ? (
          <section className="space-y-4" aria-labelledby="hp-total-heading">
            <div>
              <h3 id="hp-total-heading" className="text-base font-bold text-[#0F4F68]">
                Aufrufe gesamt (alle Seiten)
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Liniendiagramm nach Tag, Monat oder Jahr – Summe der erfassten Seitenaufrufe.
              </p>
            </div>
            <p className="text-sm text-neutral-600">
              Jahr: <strong>{chartYear}</strong> (oben im Bereich „Statistik“ einstellbar). Summe sichtbarer Periode:{" "}
              <strong className="tabular-nums text-[#0F4F68]">{totalSum.toLocaleString("de-DE")}</strong>
            </p>
            <GranularityToggle idPrefix="hp-total" value={totalGran} onChange={setTotalGran} />
            {totalLoading ? <p className="text-sm text-neutral-500">Lade Gesamtverlauf…</p> : null}
            {totalErr ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{totalErr}</p>
            ) : null}
            {!totalLoading && !totalErr ? (
              <TrafficLineChart
                data={totalSeries}
                title={
                  totalGran === "tag"
                    ? `Täglich im ${new Date(chartYear, month - 1, 1).toLocaleString("de-DE", { month: "long", year: "numeric" })}`
                    : totalGran === "monat"
                      ? `Pro Monat im Jahr ${chartYear}`
                      : `Pro Jahr (2020–${chartYear})`
                }
              />
            ) : null}
          </section>
        ) : null}

        {openTile === "device" ? (
          <section className="space-y-4" aria-labelledby="hp-device-heading">
            <div>
              <h3 id="hp-device-heading" className="text-base font-bold text-[#0F4F68]">
                Aufrufe nach Gerät
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Mobil, Tablet, Desktop – grobe Einordnung per User-Agent (keine Fingerprints).
              </p>
            </div>
            <p className="text-sm text-neutral-600">
              Einordnung per <strong className="font-semibold text-neutral-800">User-Agent</strong> und optional{" "}
              <code className="rounded bg-neutral-100 px-1">Sec-CH-UA-Mobile</code>. „Unbekannt“ enthält ältere Zähler vor
              der Geräte-Migration.
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Zeitraum Geräte">
              <button
                type="button"
                onClick={() => setDeviceScope("monat")}
                className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                  deviceScope === "monat"
                    ? "bg-[#0F4F68] text-white shadow-sm"
                    : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
                }`}
              >
                Monat ({new Date(chartYear, month - 1, 1).toLocaleString("de-DE", { month: "long", year: "numeric" })})
              </button>
              <button
                type="button"
                onClick={() => setDeviceScope("jahr")}
                className={`min-h-10 rounded-xl px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]/30 ${
                  deviceScope === "jahr"
                    ? "bg-[#0F4F68] text-white shadow-sm"
                    : "border border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
                }`}
              >
                Ganzes Jahr {chartYear}
              </button>
            </div>
            {deviceLoading ? <p className="text-sm text-neutral-500">Lade Geräteverteilung…</p> : null}
            {deviceErr ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{deviceErr}</p>
            ) : null}
            {!deviceLoading && !deviceErr ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {deviceRows.map((r) => (
                  <div
                    key={r.device_category}
                    className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#F2F9FA]/70 p-5"
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/65">{deviceLabel(r.device_category)}</p>
                    <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F4F68]">
                      {r.view_count.toLocaleString("de-DE")}
                    </p>
                    <p className="mt-1 text-xs text-neutral-600">Seitenaufrufe (Summe)</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {openTile === "paths" ? (
          <section className="space-y-4" aria-labelledby="hp-paths-heading">
            <div>
              <h3 id="hp-paths-heading" className="text-base font-bold text-[#0F4F68]">
                Aufrufe je Seite (Pfad)
              </h3>
              <p className="mt-1 text-sm text-neutral-600">
                Top-URLs im gewählten Jahr – Zeile aufklappen für den Verlauf nur dieser Adresse.
              </p>
            </div>
            <p className="text-sm text-neutral-600">
              Sortiert nach Aufrufen im Jahr <strong>{chartYear}</strong>.
            </p>
            {pathsLoading ? <p className="text-sm text-neutral-500">Lade Seitenliste…</p> : null}
            {pathsErr ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{pathsErr}</p>
            ) : null}
            {!pathsLoading && !pathsErr ? (
              <div className="overflow-x-auto rounded-2xl border border-neutral-200/80">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/60 text-xs">
                    <tr>
                      <th className="px-3 py-2">Pfad</th>
                      <th className="px-3 py-2 text-right">Aufrufe {chartYear}</th>
                      <th className="w-32 px-3 py-2">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {paths.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-8 text-center text-neutral-500">
                          Noch keine Daten für dieses Jahr.
                        </td>
                      </tr>
                    ) : (
                      paths.map((row, idx) => {
                        const open = expandedPath === row.path;
                        return (
                          <Fragment key={row.path}>
                            <tr className="hover:bg-neutral-50/80">
                              <td className="max-w-[18rem] break-all px-3 py-2 font-mono text-xs text-neutral-800">
                                {row.path}
                              </td>
                              <td className="whitespace-nowrap px-3 py-2 text-right font-semibold tabular-nums text-[#0F4F68]">
                                {row.view_count.toLocaleString("de-DE")}
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedPath(open ? null : row.path)}
                                  className="rounded-lg border border-[#0F4F68]/30 px-3 py-1.5 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                                  aria-expanded={open}
                                >
                                  {open ? "Schließen" : "Verlauf"}
                                </button>
                              </td>
                            </tr>
                            {open ? (
                              <tr className="bg-[#fafcfd]">
                                <td colSpan={3} className="px-3 py-4">
                                  <p className="text-xs font-semibold text-[#0F4F68]">Verlauf: {row.path}</p>
                                  <div className="mt-3">
                                    <GranularityToggle idPrefix={`hp-path-${idx}`} value={pathGran} onChange={setPathGran} />
                                  </div>
                                  <p className="mt-2 text-xs text-neutral-500">
                                    Monat oben steuert die Tages-Ansicht; Jahr oben steuert Monats- und Jahresansicht.
                                  </p>
                                  {pathLoading ? <p className="mt-3 text-sm text-neutral-500">Lade Verlauf…</p> : null}
                                  {pathErr ? (
                                    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                                      {pathErr}
                                    </p>
                                  ) : null}
                                  {!pathLoading && !pathErr ? (
                                    <div className="mt-4">
                                      <div className="h-[min(260px,45vh)] w-full min-h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                          <LineChart
                                            data={pathSeries.map((d) => ({ ...d, name: d.label }))}
                                            margin={{ top: 8, right: 12, left: 4, bottom: 0 }}
                                          >
                                            <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
                                            <XAxis
                                              dataKey="name"
                                              tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }}
                                              interval="preserveStartEnd"
                                            />
                                            <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={40} />
                                            <Tooltip
                                              formatter={(v: number) => [v.toLocaleString("de-DE"), "Aufrufe"]}
                                              contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                                            />
                                            <Line
                                              type="monotone"
                                              dataKey="views"
                                              stroke={CHART_TEAL}
                                              strokeWidth={2}
                                              dot={{ r: 2.5 }}
                                            />
                                          </LineChart>
                                        </ResponsiveContainer>
                                      </div>
                                    </div>
                                  ) : null}
                                </td>
                              </tr>
                            ) : null}
                          </Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
