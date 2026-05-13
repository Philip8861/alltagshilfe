"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  fetchContactKindDailyStatsAction,
  fetchContactSourceStatsAction,
  resetContactSourceStatsAction,
  type ContactSourceStatsRow,
} from "@/lib/actions/admin-homepage-analytics";
import {
  CONTACT_SOURCE_OPTIONS,
  getContactSourceLabel,
  KARRIERE_CONTACT_SOURCE_OPTIONS,
} from "@/lib/contact-source";
import {
  CHART_AXIS_TICK,
  CHART_AMBER,
  CHART_EMERALD,
  CHART_GRID,
  CHART_ROSE,
  CHART_SKY,
  CHART_TEAL,
  CHART_VIOLET,
} from "@/components/partner/partner-chart-theme";
import { PartnerExpandableStatSection } from "@/components/partner/PartnerExpandableStatSection";

type Scope = "monat" | "jahr";

const KARRIERE_PAGE_SOURCE_KINDS = ["karriere", "karriere-form", "karriere-wizard"] as const;

const KIND_LABELS: Record<string, string> = {
  contact: "Kontaktformular (/kontakt & eingebunden)",
  ratgeber: "Ratgeber (Beratungsdialog)",
  hilfefinder: "Hilfe-Finder",
  karriere: "Karriere (Legacy)",
  "karriere-form": "Karriere: Formular (Seite)",
  "karriere-wizard": "Karriere: Kurzcheck",
  "betrieblich-angebot": "Betriebliches Angebot",
  pflegebox: "Pflegebox (Konfigurator)",
};

function kindLabel(kind: string): string {
  return KIND_LABELS[kind] ?? kind;
}

const KIND_LINE_COLORS: Record<string, string> = {
  contact: CHART_TEAL,
  ratgeber: CHART_VIOLET,
  hilfefinder: CHART_SKY,
  pflegebox: CHART_EMERALD,
  "betrieblich-angebot": CHART_AMBER,
  karriere: CHART_ROSE,
  "karriere-form": "#f97316",
  "karriere-wizard": "#c2410c",
};

function strokeForKind(kind: string): string {
  return KIND_LINE_COLORS[kind] ?? "#64748b";
}

type Props = {
  /** Wird vom Eltern-Panel übergeben (gleicher Jahres-Filter wie Traffic-Statistik). */
  chartYear: number;
};

export function AdminContactSourcesPanel({ chartYear }: Props) {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [scope, setScope] = useState<Scope>("jahr");
  const [rows, setRows] = useState<ContactSourceStatsRow[]>([]);
  const [dailyKinds, setDailyKinds] = useState<string[]>([]);
  const [dailySeries, setDailySeries] = useState<Record<string, string | number>[]>([]);
  const [dailyErr, setDailyErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const [res, dailyRes] = await Promise.all([
      fetchContactSourceStatsAction(chartYear, month, scope),
      fetchContactKindDailyStatsAction(chartYear, month, scope),
    ]);
    if (!res.ok) {
      setErr(res.message);
      setRows([]);
    } else {
      setRows(res.data);
    }
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

  const totals = useMemo(() => {
    const bySource = new Map<string, number>();
    let gesamt = 0;
    for (const r of rows) {
      bySource.set(r.source, (bySource.get(r.source) ?? 0) + r.view_count);
      gesamt += r.view_count;
    }
    /* Reihenfolge der Optionen aus contact-source.ts beibehalten + unbekannte ans Ende. */
    const ordered: { source: string; label: string; count: number }[] = [];
    for (const opt of CONTACT_SOURCE_OPTIONS) {
      const c = bySource.get(opt.value) ?? 0;
      ordered.push({ source: opt.value, label: opt.label, count: c });
      bySource.delete(opt.value);
    }
    for (const [source, count] of bySource) {
      ordered.push({ source, label: getContactSourceLabel(source), count });
    }
    return { ordered, gesamt };
  }, [rows]);

  const byKind = useMemo(() => {
    const m = new Map<string, Map<string, number>>();
    for (const r of rows) {
      const inner = m.get(r.source) ?? new Map<string, number>();
      inner.set(r.kind, (inner.get(r.kind) ?? 0) + r.view_count);
      m.set(r.source, inner);
    }
    return m;
  }, [rows]);

  const allKinds = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) set.add(r.kind);
    /* Stabile Reihenfolge: bekannte zuerst, restliche alphabetisch. */
    const known = [
      "contact",
      "hilfefinder",
      "ratgeber",
      "pflegebox",
      "karriere",
      "karriere-form",
      "karriere-wizard",
      "betrieblich-angebot",
    ];
    const ordered = known.filter((k) => set.has(k));
    const rest = [...set].filter((k) => !known.includes(k)).sort();
    return [...ordered, ...rest];
  }, [rows]);

  const pflegeboxPage = useMemo(() => {
    const sub = rows.filter((r) => r.kind === "pflegebox");
    const bySource = new Map<string, number>();
    let gesamt = 0;
    for (const r of sub) {
      gesamt += r.view_count;
      bySource.set(r.source, (bySource.get(r.source) ?? 0) + r.view_count);
    }
    const ordered: { source: string; label: string; count: number }[] = [];
    for (const opt of CONTACT_SOURCE_OPTIONS) {
      const c = bySource.get(opt.value) ?? 0;
      ordered.push({ source: opt.value, label: opt.label, count: c });
      bySource.delete(opt.value);
    }
    for (const [source, count] of bySource) {
      ordered.push({ source, label: getContactSourceLabel(source), count });
    }
    return { ordered, gesamt };
  }, [rows]);

  const karrierePage = useMemo(() => {
    const sub = rows.filter((r) =>
      (KARRIERE_PAGE_SOURCE_KINDS as readonly string[]).includes(r.kind),
    );
    const bySource = new Map<string, number>();
    const bySourceKind = new Map<string, Map<string, number>>();
    let gesamt = 0;
    for (const r of sub) {
      gesamt += r.view_count;
      bySource.set(r.source, (bySource.get(r.source) ?? 0) + r.view_count);
      const inner = bySourceKind.get(r.source) ?? new Map<string, number>();
      inner.set(r.kind, (inner.get(r.kind) ?? 0) + r.view_count);
      bySourceKind.set(r.source, inner);
    }
    const ordered: { source: string; label: string; count: number }[] = [];
    for (const opt of KARRIERE_CONTACT_SOURCE_OPTIONS) {
      const c = bySource.get(opt.value) ?? 0;
      ordered.push({ source: opt.value, label: opt.label, count: c });
      bySource.delete(opt.value);
    }
    for (const [source, count] of bySource) {
      ordered.push({ source, label: getContactSourceLabel(source), count });
    }
    const kindsPresent = KARRIERE_PAGE_SOURCE_KINDS.filter((k) => sub.some((r) => r.kind === k));
    return { ordered, gesamt, bySourceKind, kindsPresent };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#0F4F68]">Wie haben uns Kunden gefunden?</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Anonyme Auswertung der Pflichtfrage „Wie sind Sie auf uns aufmerksam geworden?“ – pro Tag, Quelle und
          Kanal (Kontaktseite, Ratgeber, Hilfe-Finder, Pflegebox-Konfigurator, Karriere, …). Es werden nur
          Aggregate gespeichert (kein Personenbezug).
        </p>
        <p className="mt-2 text-sm text-[#0F4F68]/85">
          Tippen Sie auf einen der Bausteine unten – die Detailansicht klappt auf.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="cs-stats-scope"
            className="block text-xs font-bold uppercase text-[#0F4F68]/75"
          >
            Zeitraum
          </label>
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
            <label
              htmlFor="cs-stats-month"
              className="block text-xs font-bold uppercase text-[#0F4F68]/75"
            >
              Monat
            </label>
            <select
              id="cs-stats-month"
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
              "Alle Quellen-Auswertungen unwiderruflich löschen? (Aggregierte Zähler je Tag, Quelle und Formular-Typ – startet bei null.)",
            );
            if (!ok) return;
            setResetBusy(true);
            setResetErr(null);
            const res = await resetContactSourceStatsAction();
            setResetBusy(false);
            if (!res.ok) {
              setResetErr(res.message);
              return;
            }
            void load();
          }}
          className="min-h-10 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
        >
          {resetBusy ? "Wird geleert…" : "Quellen-Statistik zurücksetzen"}
        </button>
      </div>

      {resetErr ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">
          {resetErr}
        </p>
      ) : null}

      <div className="space-y-4">
        <PartnerExpandableStatSection
          title="Diagramm: Anfragen pro Kalendertag und Kanal"
          subtitle="Linien nach Eingangsweg (Formular erfolgreich, mit Herkunftsfrage). Muster über Wochentage erkennen."
          badge={
            !loading && dailyKinds.length > 0 ? `${dailyKinds.length} Linien` : undefined
          }
        >
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
        </PartnerExpandableStatSection>

        <PartnerExpandableStatSection
          title="Listen & Kreuztabellen (Herkunft und Formular)"
          subtitle="Quellenverteilung, Pflegebox, Karriere und Aufschlüsselung nach Kanal."
          badge={!loading && totals.gesamt > 0 ? `${totals.gesamt.toLocaleString("de-DE")}` : undefined}
          defaultOpen
        >
          {loading ? (
            <p className="text-sm text-neutral-500">Lade Quellen-Statistik…</p>
          ) : err ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              {err}
            </p>
          ) : totals.gesamt === 0 ? (
            <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
              Im gewählten Zeitraum sind noch keine Anfragen mit Quellenangabe eingegangen.
            </p>
          ) : (
            <>
              <p className="text-sm text-neutral-700">
                Anfragen gesamt:{" "}
                <strong className="tabular-nums text-[#0F4F68]">
                  {totals.gesamt.toLocaleString("de-DE")}
                </strong>
              </p>

              {/* Hauptliste mit Anteilsbalken (alle Optionen, auch 0). */}
              <ul className="space-y-2">
                {totals.ordered.map((row) => {
                  const pct = totals.gesamt > 0 ? Math.round((row.count / totals.gesamt) * 100) : 0;
                  return (
                    <li
                      key={row.source}
                      className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold text-[#0F4F68]">{row.label}</span>
                        <span className="tabular-nums text-neutral-700">
                          {row.count.toLocaleString("de-DE")}
                          {row.count > 0 ? <span className="ml-2 text-[#0F4F68]/70">({pct}%)</span> : null}
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-[#0F4F68]/85"
                          style={{ width: `${row.count > 0 ? Math.max(2, pct) : 0}%` }}
                          aria-hidden
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              {pflegeboxPage.gesamt > 0 ? (
                <div className="space-y-4 rounded-2xl border border-[#0F4F68]/18 bg-[#F2F9FA]/40 p-5">
                  <div>
                    <h4 className="text-base font-bold text-[#0F4F68]">
                      Pflegebox-Konfigurator – Aufmerksamkeit (Quellen)
                    </h4>
                    <p className="mt-1 text-sm text-neutral-600">
                      Auswahl im Schritt „Adresse &amp; Geburtsdatum“; Zähler nur für abgeschlossene Bestellungen
                      (Kind „pflegebox“), getrennt von Kontaktformular und Hilfe-Finder.
                    </p>
                  </div>
                  <p className="text-sm text-neutral-700">
                    Pflegebox-Bestellungen mit Quelle:{" "}
                    <strong className="tabular-nums text-[#0F4F68]">
                      {pflegeboxPage.gesamt.toLocaleString("de-DE")}
                    </strong>
                  </p>
                  <ul className="space-y-2">
                    {pflegeboxPage.ordered.map((row) => {
                      const pct =
                        pflegeboxPage.gesamt > 0 ? Math.round((row.count / pflegeboxPage.gesamt) * 100) : 0;
                      return (
                        <li
                          key={`pb-${row.source}`}
                          className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-semibold text-[#0F4F68]">{row.label}</span>
                            <span className="tabular-nums text-neutral-700">
                              {row.count.toLocaleString("de-DE")}
                              {row.count > 0 ? (
                                <span className="ml-2 text-[#0F4F68]/70">({pct}%)</span>
                              ) : null}
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full bg-[#25D366]/90"
                              style={{ width: `${row.count > 0 ? Math.max(2, pct) : 0}%` }}
                              aria-hidden
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {/* Nur Einreichungen von der Karriereseite (Bewerbung), ohne allgemeines Kontaktformular. */}
              {karrierePage.gesamt > 0 ? (
                <div className="space-y-4 rounded-2xl border border-[#0F4F68]/18 bg-[#F2F9FA]/40 p-5">
                  <div>
                    <h4 className="text-base font-bold text-[#0F4F68]">Karriereseite – Bewerbungen (Quellen)</h4>
                    <p className="mt-1 text-sm text-neutral-600">
                      Nur Bewerbungen über das Karriere-Formular oder den Kurzcheck („Jetzt bewerben“). Allgemeine
                      Kontaktanfragen zum Thema Karriere über /kontakt sind hier nicht enthalten.
                    </p>
                  </div>
                  <p className="text-sm text-neutral-700">
                    Bewerbungen gesamt:{" "}
                    <strong className="tabular-nums text-[#0F4F68]">
                      {karrierePage.gesamt.toLocaleString("de-DE")}
                    </strong>
                  </p>
                  <ul className="space-y-2">
                    {karrierePage.ordered.map((row) => {
                      const pct =
                        karrierePage.gesamt > 0 ? Math.round((row.count / karrierePage.gesamt) * 100) : 0;
                      return (
                        <li
                          key={`k-${row.source}`}
                          className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-semibold text-[#0F4F68]">{row.label}</span>
                            <span className="tabular-nums text-neutral-700">
                              {row.count.toLocaleString("de-DE")}
                              {row.count > 0 ? (
                                <span className="ml-2 text-[#0F4F68]/70">({pct}%)</span>
                              ) : null}
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full bg-[#F78F2E]/90"
                              style={{ width: `${row.count > 0 ? Math.max(2, pct) : 0}%` }}
                              aria-hidden
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {karrierePage.kindsPresent.length > 1 ? (
                    <div className="overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm">
                      <table className="min-w-full text-sm">
                        <thead className="bg-[#F2F9FA] text-left text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">
                          <tr>
                            <th scope="col" className="px-4 py-3">
                              Quelle
                            </th>
                            {karrierePage.kindsPresent.map((k) => (
                              <th key={k} scope="col" className="px-4 py-3 text-right">
                                {kindLabel(k)}
                              </th>
                            ))}
                            <th scope="col" className="px-4 py-3 text-right">
                              Gesamt
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0F4F68]/10">
                          {karrierePage.ordered.map((row) => {
                            const inner = karrierePage.bySourceKind.get(row.source);
                            return (
                              <tr key={`kt-${row.source}`} className="hover:bg-[#F2F9FA]/50">
                                <th scope="row" className="px-4 py-3 font-medium text-neutral-900">
                                  {row.label}
                                </th>
                                {karrierePage.kindsPresent.map((k) => (
                                  <td key={k} className="px-4 py-3 text-right tabular-nums text-neutral-700">
                                    {(inner?.get(k) ?? 0).toLocaleString("de-DE")}
                                  </td>
                                ))}
                                <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#0F4F68]">
                                  {row.count.toLocaleString("de-DE")}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Aufschlüsselung nach Formular-Typ (nur wenn mehrere Typen vorhanden). */}
              {allKinds.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#F2F9FA] text-left text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">
                      <tr>
                        <th scope="col" className="px-4 py-3">Quelle</th>
                        {allKinds.map((k) => (
                          <th key={k} scope="col" className="px-4 py-3 text-right">
                            {kindLabel(k)}
                          </th>
                        ))}
                        <th scope="col" className="px-4 py-3 text-right">Gesamt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0F4F68]/10">
                      {totals.ordered.map((row) => {
                        const inner = byKind.get(row.source);
                        return (
                          <tr key={row.source} className="hover:bg-[#F2F9FA]/50">
                            <th scope="row" className="px-4 py-3 font-medium text-neutral-900">
                              {row.label}
                            </th>
                            {allKinds.map((k) => (
                              <td key={k} className="px-4 py-3 text-right tabular-nums text-neutral-700">
                                {(inner?.get(k) ?? 0).toLocaleString("de-DE")}
                              </td>
                            ))}
                            <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#0F4F68]">
                              {row.count.toLocaleString("de-DE")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </>
          )}
        </PartnerExpandableStatSection>
      </div>
    </div>
  );
}
