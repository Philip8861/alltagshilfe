"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchContactSourceStatsAction,
  fetchContactWeekdayGroupTotalsAction,
  resetContactSourceStatsAction,
  type ContactSourceStatsRow,
  type ContactStatsScope,
  type ContactWeekdayGroupRow,
} from "@/lib/actions/admin-homepage-analytics";
import {
  CONTACT_SOURCE_OPTIONS,
  getContactSourceLabel,
  KARRIERE_CONTACT_SOURCE_OPTIONS,
} from "@/lib/contact-source";
import { CHART_AXIS_TICK, CHART_GRID, CHART_ROSE, CHART_TEAL } from "@/components/partner/partner-chart-theme";
import {
  KARRIERE_PAGE_SOURCE_KINDS,
  kindLabel,
} from "@/components/partner/admin/contact-sources-admin-kind-labels";

const OTHER_BAR = "#94a3b8";

type Scope = ContactStatsScope;

type Props = {
  chartYear: number;
};

export function AdminContactListenWochentagKreuzPanel({ chartYear }: Props) {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [dayOfMonth, setDayOfMonth] = useState(() => new Date().getDate());
  const [scope, setScope] = useState<Scope>("jahr");
  const [rows, setRows] = useState<ContactSourceStatsRow[]>([]);
  const [weekdays, setWeekdays] = useState<ContactWeekdayGroupRow[]>([]);
  const [weekdayErr, setWeekdayErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const daysInMonth = useMemo(() => new Date(chartYear, month, 0).getDate(), [chartYear, month]);
  const dayClamped = Math.min(daysInMonth, Math.max(1, dayOfMonth));

  useEffect(() => {
    setDayOfMonth((d) => Math.min(daysInMonth, Math.max(1, d)));
  }, [daysInMonth]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    setWeekdayErr(null);
    const [res, wk] = await Promise.all([
      fetchContactSourceStatsAction(chartYear, month, scope, dayClamped),
      fetchContactWeekdayGroupTotalsAction(chartYear, month, scope, dayClamped),
    ]);
    if (!res.ok) {
      setErr(res.message);
      setRows([]);
    } else {
      setRows(res.data);
    }
    if (!wk.ok) {
      setWeekdayErr(wk.message);
      setWeekdays([]);
    } else {
      setWeekdays(wk.weekdays);
    }
    setLoading(false);
  }, [chartYear, month, scope, dayClamped]);

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
    const sub = rows.filter((r) => (KARRIERE_PAGE_SOURCE_KINDS as readonly string[]).includes(r.kind));
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

  const weekdayHasData = weekdays.some((w) => w.karriere + w.kern + w.other > 0);

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg font-bold text-[#0F4F68]">Herkunft, Wochentage und Kreuztabellen</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Anonyme Auswertung der Pflichtfrage „Wie sind Sie auf uns aufmerksam geworden?“ – Zeitraum wahlweise ein
          Kalendertag, ein ganzer Monat oder das Jahr {chartYear}. Darunter Listen und Kreuzzahlen für denselben
          Zeitraum; die Wochentags-Tabelle summiert alle gleichnamigen Wochentage (bei einem einzelnen Tag steht nur
          der zutreffende Wochentag).
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
          </div>
        </div>

        {(scope === "tag" || scope === "monat") ? (
          <div>
            <label htmlFor="cs-listen-month" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
              Monat
            </label>
            <select
              id="cs-listen-month"
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
            <label htmlFor="cs-listen-day" className="block text-xs font-bold uppercase text-[#0F4F68]/75">
              Kalendertag
            </label>
            <select
              id="cs-listen-day"
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
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">{resetErr}</p>
      ) : null}

      {/* Wochentage */}
      <section className="space-y-4 rounded-2xl border border-[#0F4F68]/14 bg-[#F2F9FA]/25 p-4 sm:p-6" aria-labelledby="cs-weekday-heading">
        <div>
          <h4 id="cs-weekday-heading" className="text-base font-bold text-[#0F4F68]">
            Nach Wochentag (Montag bis Sonntag)
          </h4>
          <p className="mt-1 text-sm text-neutral-600">
            Summe über alle gleichnamigen Wochentage im gewählten Zeitraum: z. B. alle Sonntage im Mai addieren –
            zum Vergleich mit Werktagen. Karriere-Bewerbungen (alle Karriere-Kanäle) getrennt von Kontaktformular,
            Hilfe-Finder und Ratgeber gemeinsam. Alle übrigen Eingangsarten erscheinen als zusätzliche Balken.
          </p>
        </div>

        {loading ? <p className="text-sm text-neutral-500">Lade Wochentags-Auswertung…</p> : null}
        {!loading && weekdayErr ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {weekdayErr}
          </p>
        ) : null}
        {!loading && !weekdayErr && weekdayHasData ? (
          <>
            <div
              className="h-[min(320px,50vh)] w-full min-h-[220px]"
              role="img"
              aria-label="Balkendiagramm Anfragen nach Wochentag, gruppiert nach Karriere, Kern-Kanälen und weiteren Kanälen"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdays} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
                  <CartesianGrid stroke={CHART_GRID} strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="weekdayLabel"
                    tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={56}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: CHART_AXIS_TICK, fontSize: 11 }} width={36} />
                  <Tooltip
                    formatter={(value: number | string, name: string) => [
                      typeof value === "number" ? value.toLocaleString("de-DE") : String(value ?? 0),
                      name,
                    ]}
                    contentStyle={{ borderRadius: 12, border: `1px solid ${CHART_GRID}` }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 8 }} formatter={(value) => <span className="text-xs">{value}</span>} />
                  <Bar dataKey="karriere" name="Karriere" fill={CHART_ROSE} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="kern" name="Kontakt · Hilfe-Finder · Ratgeber" fill={CHART_TEAL} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="other" name="Weitere Kanäle" fill={OTHER_BAR} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#0F4F68]/12 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <caption className="sr-only">Anfragensummen je ISO-Wochentag</caption>
                <thead className="bg-[#F2F9FA] text-left text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">
                  <tr>
                    <th scope="col" className="px-3 py-2">
                      Wochentag
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      Karriere
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      Kontakt · Finder · Ratgeber
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      Weitere
                    </th>
                    <th scope="col" className="px-3 py-2 text-right">
                      Gesamt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F4F68]/10">
                  {weekdays.map((w) => {
                    const sum = w.karriere + w.kern + w.other;
                    return (
                      <tr key={w.isoWeekday} className="hover:bg-[#F2F9FA]/50">
                        <th scope="row" className="px-3 py-2 font-medium text-neutral-900">
                          {w.weekdayLabel}
                        </th>
                        <td className="px-3 py-2 text-right tabular-nums text-neutral-700">
                          {w.karriere.toLocaleString("de-DE")}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-neutral-700">
                          {w.kern.toLocaleString("de-DE")}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums text-neutral-700">
                          {w.other.toLocaleString("de-DE")}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums text-[#0F4F68]">
                          {sum.toLocaleString("de-DE")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
        {!loading && !weekdayErr && !weekdayHasData ? (
          <p className="text-sm text-neutral-600">
            Für diesen Zeitraum gibt es noch keine Wochentags-Daten oder die Aggregation ist noch leer.
          </p>
        ) : null}
      </section>

      {/* Listen & Kreuz */}
      <section className="space-y-6 border-t border-[#0F4F68]/12 pt-8" aria-labelledby="cs-tables-heading">
        <div>
          <h4 id="cs-tables-heading" className="text-base font-bold text-[#0F4F68]">
            Listen & Kreuztabellen (Herkunft und Formular)
          </h4>
          <p className="mt-1 text-sm text-neutral-600">
            Quellenverteilung, Pflegebox, Karriere und Aufschlüsselung nach Kanal.
          </p>
        </div>
        {loading ? (
          <p className="text-sm text-neutral-500">Lade Quellen-Statistik…</p>
        ) : err ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{err}</p>
        ) : totals.gesamt === 0 ? (
          <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            Im gewählten Zeitraum sind noch keine Anfragen mit Quellenangabe eingegangen.
          </p>
        ) : (
          <>
            <p className="text-sm text-neutral-700">
              Anfragen gesamt:{" "}
              <strong className="tabular-nums text-[#0F4F68]">{totals.gesamt.toLocaleString("de-DE")}</strong>
            </p>

            <ul className="space-y-2">
              {totals.ordered.map((row) => {
                const pct = totals.gesamt > 0 ? Math.round((row.count / totals.gesamt) * 100) : 0;
                return (
                  <li key={row.source} className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 shadow-sm">
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
                  <h4 className="text-base font-bold text-[#0F4F68]">Pflegebox-Konfigurator – Aufmerksamkeit (Quellen)</h4>
                  <p className="mt-1 text-sm text-neutral-600">
                    Auswahl im Schritt „Adresse &amp; Geburtsdatum“; Zähler nur für abgeschlossene Bestellungen (Kind
                    „pflegebox“), getrennt von Kontaktformular und Hilfe-Finder.
                  </p>
                </div>
                <p className="text-sm text-neutral-700">
                  Pflegebox-Bestellungen mit Quelle:{" "}
                  <strong className="tabular-nums text-[#0F4F68]">{pflegeboxPage.gesamt.toLocaleString("de-DE")}</strong>
                </p>
                <ul className="space-y-2">
                  {pflegeboxPage.ordered.map((row) => {
                    const pct = pflegeboxPage.gesamt > 0 ? Math.round((row.count / pflegeboxPage.gesamt) * 100) : 0;
                    return (
                      <li key={`pb-${row.source}`} className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-[#0F4F68]">{row.label}</span>
                          <span className="tabular-nums text-neutral-700">
                            {row.count.toLocaleString("de-DE")}
                            {row.count > 0 ? <span className="ml-2 text-[#0F4F68]/70">({pct}%)</span> : null}
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
                  <strong className="tabular-nums text-[#0F4F68]">{karrierePage.gesamt.toLocaleString("de-DE")}</strong>
                </p>
                <ul className="space-y-2">
                  {karrierePage.ordered.map((row) => {
                    const pct = karrierePage.gesamt > 0 ? Math.round((row.count / karrierePage.gesamt) * 100) : 0;
                    return (
                      <li key={`k-${row.source}`} className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-semibold text-[#0F4F68]">{row.label}</span>
                          <span className="tabular-nums text-neutral-700">
                            {row.count.toLocaleString("de-DE")}
                            {row.count > 0 ? <span className="ml-2 text-[#0F4F68]/70">({pct}%)</span> : null}
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

            {allKinds.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#F2F9FA] text-left text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Quelle
                      </th>
                      {allKinds.map((k) => (
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
      </section>
    </div>
  );
}
