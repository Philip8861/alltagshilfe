"use client";

import { useCallback, useEffect, useState } from "react";
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
import { fetchContactKindDailyStatsAction } from "@/lib/actions/admin-homepage-analytics";
import { CHART_AXIS_TICK, CHART_GRID } from "@/components/partner/partner-chart-theme";
import { kindLabel, strokeForKind } from "@/components/partner/admin/contact-sources-admin-kind-labels";

type Scope = "monat" | "jahr";

type Props = {
  chartYear: number;
};

export function AdminContactKanalTagesverlaufPanel({ chartYear }: Props) {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [scope, setScope] = useState<Scope>("jahr");
  const [dailyKinds, setDailyKinds] = useState<string[]>([]);
  const [dailySeries, setDailySeries] = useState<Record<string, string | number>[]>([]);
  const [dailyErr, setDailyErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setDailyErr(null);
    const dailyRes = await fetchContactKindDailyStatsAction(chartYear, month, scope);
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
  }, [chartYear, month, scope]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#0F4F68]">Anfragen pro Kalendertag nach Kanal</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Liniendiagramm zu anonymen Eingangswegen (alle Formular-Typen im gewählten Monat oder Jahr).
          Für Herkunftslisten und Wochentagsauswertung das andere Kontaktfeld öffnen.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <span className="block text-xs font-bold uppercase text-[#0F4F68]/75">Zeitraum</span>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Zeitraum">
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
              Ganzes Jahr
            </button>
          </div>
        </div>

        {scope === "monat" ? (
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

        <button
          type="button"
          onClick={() => void load()}
          className="min-h-10 rounded-xl border border-[#0F4F68]/30 bg-white px-4 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
        >
          Aktualisieren
        </button>
      </div>

      <section className="space-y-4" aria-labelledby="cs-daily-heading">
        <div>
          <h4 id="cs-daily-heading" className="text-base font-bold text-[#0F4F68]">
            Diagramm: Anfragen pro Kalendertag und Kanal
          </h4>
          <p className="mt-1 text-sm text-neutral-600">
            Linien nach Eingangsweg (Formular erfolgreich, mit Herkunftsfrage). Muster über Wochentage erkennen.
          </p>
        </div>
        {loading ? <p className="text-sm text-neutral-500">Lade Tagesauswertung…</p> : null}
        {dailyErr ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {dailyErr}
          </p>
        ) : null}
        {!dailyErr && !loading && dailyKinds.length > 0 && dailySeries.length > 0 ? (
          <div>
            <p className="text-sm text-neutral-600">
              Tage ohne Einträge stehen bei null – Vergleich ruhiger und aktiver Kalendertage.
            </p>
            <div
              className="mt-4 h-[min(380px,55vh)] w-full min-h-[260px]"
              role="img"
              aria-label="Liniendiagramm Anfragen pro Tag nach Kanal"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySeries} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
                  <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" />
                  <XAxis dataKey="label" tick={{ fill: CHART_AXIS_TICK, fontSize: 10 }} interval="preserveStartEnd" />
                  <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={36} />
                  <Tooltip
                    formatter={(value: number | string, name: string) => [
                      typeof value === "number"
                        ? value.toLocaleString("de-DE")
                        : Number(value || 0).toLocaleString("de-DE"),
                      kindLabel(name),
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
                  <Legend
                    formatter={(value) => <span className="text-xs text-neutral-700">{kindLabel(value)}</span>}
                    wrapperStyle={{ paddingTop: 12 }}
                    className="max-h-[4.5rem] overflow-y-auto text-xs"
                  />
                  {dailyKinds.map((k) => (
                    <Line
                      key={k}
                      type="monotone"
                      dataKey={k}
                      name={k}
                      stroke={strokeForKind(k)}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}
        {!dailyErr && !loading && (dailyKinds.length === 0 || dailySeries.length === 0) ? (
          <p className="text-sm text-neutral-600">
            Im gewählten Zeitraum liegen keine Tages-/Kanaldaten vor (oder die Auswertung ist noch leer).
          </p>
        ) : null}
      </section>
    </div>
  );
}
