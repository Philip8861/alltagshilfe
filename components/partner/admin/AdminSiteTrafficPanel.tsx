"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAdminSiteTrafficAction,
  type AdminSiteTrafficPayload,
} from "@/lib/actions/admin-site-traffic";

type Props = {
  chartYear: number;
};

export function AdminSiteTrafficPanel({ chartYear }: Props) {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminSiteTrafficPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchAdminSiteTrafficAction(chartYear, month);
    if (!res.ok) {
      setError(res.message);
      setData(null);
    } else {
      setData(res.data);
    }
    setLoading(false);
  }, [chartYear, month]);

  useEffect(() => {
    void load();
  }, [load]);

  const monthLabel = new Date(chartYear, month - 1, 1).toLocaleString("de-DE", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6 border-t border-neutral-200/90 pt-8">
      <div>
        <h3 className="text-lg font-bold text-[#0F4F68]">Website: Seitenaufrufe</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Aggregierte Aufrufzahlen nach URL-Pfad (Kalendertag nach Europe/Berlin). Es werden{" "}
          <strong className="font-semibold text-neutral-800">keine</strong> IP-Adressen, keine Cookies und keine
          Geräte-IDs gespeichert — nur Summen je Pfad und Tag (vergleichbar mit Webserver-Statistik, DSGVO-schonend).
          Werte sind <strong className="font-semibold text-neutral-800">Seitenaufrufe</strong>, nicht „eindeutige
          Besucher“. Technische Abrufe (z. B. Prefetch) werden weitgehend ausgeschlossen; geringe Abweichungen sind
          normal.
        </p>
        <p className="mt-2 text-xs text-neutral-500">
          Hinweis: Bitte Migration <code className="rounded bg-neutral-100 px-1">015_site_page_views_daily.sql</code> in
          Supabase ausführen. Danach füllen sich die Werte automatisch bei Website-Besuchen.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="admin-traffic-month" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
            Monat (mit Jahr oben)
          </label>
          <select
            id="admin-traffic-month"
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
          onClick={() => void load()}
          className="min-h-10 rounded-xl border border-[#0F4F68]/30 bg-white px-4 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
        >
          Aktualisieren
        </button>
      </div>

      {loading ? <p className="text-sm text-neutral-500">Lade Auswertung…</p> : null}
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#F2F9FA]/80 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/65">Summe Monat</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F4F68]">{data.monthTotal.toLocaleString("de-DE")}</p>
              <p className="mt-1 text-xs text-neutral-600">{monthLabel}</p>
            </div>
            <div className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#F2F9FA] to-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/65">Summe Jahr {chartYear}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F4F68]">{data.yearTotal.toLocaleString("de-DE")}</p>
              <p className="mt-1 text-xs text-neutral-600">Alle Pfade im Jahr (Top-Listen unten)</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-[#0F4F68]/80">Top Pfade — {monthLabel}</h4>
              <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200/80">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/60 text-xs">
                    <tr>
                      <th className="px-3 py-2">Pfad</th>
                      <th className="px-3 py-2 text-right">Aufrufe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {data.monthPaths.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-3 py-6 text-center text-neutral-500">
                          Noch keine Daten für diesen Monat.
                        </td>
                      </tr>
                    ) : (
                      data.monthPaths.map((row) => (
                        <tr key={row.path} className="hover:bg-neutral-50/80">
                          <td className="max-w-[14rem] break-all px-3 py-2 font-mono text-xs text-neutral-800">{row.path}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-semibold text-[#0F4F68]">
                            {row.view_count.toLocaleString("de-DE")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide text-[#0F4F68]/80">Top Pfade — Jahr {chartYear}</h4>
              <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200/80">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/60 text-xs">
                    <tr>
                      <th className="px-3 py-2">Pfad</th>
                      <th className="px-3 py-2 text-right">Aufrufe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {data.yearPaths.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-3 py-6 text-center text-neutral-500">
                          Noch keine Daten für dieses Jahr.
                        </td>
                      </tr>
                    ) : (
                      data.yearPaths.map((row) => (
                        <tr key={`y-${row.path}`} className="hover:bg-neutral-50/80">
                          <td className="max-w-[14rem] break-all px-3 py-2 font-mono text-xs text-neutral-800">{row.path}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-semibold text-[#0F4F68]">
                            {row.view_count.toLocaleString("de-DE")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
