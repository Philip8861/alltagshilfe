"use client";

import { useMemo, useState } from "react";
import { PartnerTipModal } from "@/components/partner/PartnerTipModal";
import {
  monthlyStatsForYear,
  statsForMonth,
  statsForYear,
  type DashboardAuftragStats,
} from "@/lib/partner/dashboard-period-stats";
import { orderContactLine } from "@/lib/partner/dashboard-order-utils";
import { PARTNER_TIP_STATUS_PARTNER_LABELS } from "@/lib/partner/partner-tip-admin";
import { PARTNER_TIP_STATUS_BADGE_CLASS } from "@/lib/partner/partner-tip-status-ui";
import { partnerTipPayloadSummary } from "@/lib/partner/partner-tip-summary";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import {
  SERVICE_SLUG_ORDER,
  serviceBadgeClass,
} from "@/lib/partner/service-slug-styles";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

export type PartnerDashboardOrderSerial = {
  id: string;
  external_reference: string | null;
  status: string;
  created_at: string;
  summary_json: Record<string, unknown> | null;
};

type Panel = "statistik" | "status";

type Props = {
  welcomeHeadline: string;
  partnerCode: string | null;
  payoutLabel: string;
  payoutIso: string;
  responsibilityAreaSlugs: string[];
  stats: { total: number; last30: number; last7: number };
  orders: PartnerDashboardOrderSerial[];
  tips: PartnerDashboardTipSerial[];
};

const slugSet = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);

function currentMonthValue(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function parseMonthValue(v: string): { year: number; month0: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(v.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return { year, month0: month - 1 };
}

function HorizontalStatBars({ stats }: { stats: DashboardAuftragStats }) {
  const max = Math.max(1, stats.abgeschlossen, stats.abgelehnt, stats.inBearbeitung);
  const rows: { label: string; value: number; barClass: string }[] = [
    { label: "Abgeschlossen", value: stats.abgeschlossen, barClass: "bg-emerald-500" },
    { label: "Abgelehnt", value: stats.abgelehnt, barClass: "bg-rose-500" },
    { label: "In Bearbeitung", value: stats.inBearbeitung, barClass: "bg-amber-500" },
  ];
  return (
    <div className="space-y-4" role="img" aria-label="Balkendiagramm Auftragsstatus">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <span className="w-full shrink-0 text-sm font-semibold text-neutral-800 sm:w-40">{r.label}</span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-9 min-w-0 flex-1 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80">
              <div
                className={`h-full rounded-lg ${r.barClass}`}
                style={{ width: `${(r.value / max) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-base font-bold tabular-nums text-neutral-900">{r.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function YearMonthOverviewChart({
  monthly,
  year,
}: {
  monthly: DashboardAuftragStats[];
  year: number;
}) {
  const maxTotal = useMemo(
    () => Math.max(1, ...monthly.map((m) => m.abgeschlossen + m.abgelehnt + m.inBearbeitung)),
    [monthly],
  );
  const monthLabels = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const chartMaxPx = 132;
  return (
    <div>
      <p className="text-sm font-semibold text-[#0F4F68]">Verteilung {year} (nach Eingangsdatum)</p>
      <p className="mt-1 text-xs text-neutral-500">Gestapelte Balken: grün abgeschlossen, rot abgelehnt, gelb in Bearbeitung.</p>
      <div className="mt-4 flex h-44 items-end justify-between gap-1 sm:gap-1.5" role="img" aria-label="Jahresübersicht nach Monaten">
        {monthly.map((st, i) => {
          const total = st.abgeschlossen + st.abgelehnt + st.inBearbeitung;
          const colPx = total === 0 ? 4 : Math.round(10 + (total / maxTotal) * chartMaxPx);
          return (
            <div key={i} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <div
                className="flex w-full max-w-[2.25rem] flex-col justify-end overflow-hidden rounded-t-md border border-neutral-200/90 bg-neutral-100 sm:max-w-[2.75rem]"
                style={{ height: colPx }}
              >
                {total > 0 ? (
                  <div className="flex h-full w-full flex-col overflow-hidden rounded-t-md">
                    {st.abgeschlossen > 0 ? (
                      <div
                        className="min-h-[3px] w-full bg-emerald-500"
                        style={{ flex: st.abgeschlossen }}
                        title={`Abgeschlossen: ${st.abgeschlossen}`}
                      />
                    ) : null}
                    {st.abgelehnt > 0 ? (
                      <div
                        className="min-h-[3px] w-full bg-rose-500"
                        style={{ flex: st.abgelehnt }}
                        title={`Abgelehnt: ${st.abgelehnt}`}
                      />
                    ) : null}
                    {st.inBearbeitung > 0 ? (
                      <div
                        className="min-h-[3px] w-full bg-amber-400"
                        style={{ flex: st.inBearbeitung }}
                        title={`In Bearbeitung: ${st.inBearbeitung}`}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
              <span className="text-[0.65rem] font-semibold text-neutral-500">{monthLabels[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PartnerDashboardClient({
  welcomeHeadline,
  partnerCode,
  payoutLabel,
  payoutIso,
  responsibilityAreaSlugs,
  stats,
  orders,
  tips,
}: Props) {
  const [panel, setPanel] = useState<Panel>("status");
  const [tipOpen, setTipOpen] = useState(false);
  const [periodMode, setPeriodMode] = useState<"month" | "year">("month");
  const [monthInput, setMonthInput] = useState(currentMonthValue);
  const [yearInput, setYearInput] = useState(() => String(new Date().getFullYear()));

  const allowedSlugs = useMemo(() => {
    return responsibilityAreaSlugs.filter((s): s is PartnerResponsibilitySlug => slugSet.has(s));
  }, [responsibilityAreaSlugs]);

  const tipsBySlug = useMemo(() => {
    const map = new Map<string, PartnerDashboardTipSerial[]>();
    for (const t of tips) {
      const list = map.get(t.service_slug) ?? [];
      list.push(t);
      map.set(t.service_slug, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return map;
  }, [tips]);

  const extraSlugs = useMemo(() => {
    const ordered = new Set<string>(SERVICE_SLUG_ORDER);
    return [...tipsBySlug.keys()].filter((k) => !ordered.has(k)).sort();
  }, [tipsBySlug]);

  const periodStats = useMemo(() => {
    const orderLikes = orders.map((o) => ({ created_at: o.created_at, status: o.status }));
    if (periodMode === "month") {
      const p = parseMonthValue(monthInput);
      if (!p) return statsForMonth(tips, orderLikes, new Date().getFullYear(), new Date().getMonth());
      return statsForMonth(tips, orderLikes, p.year, p.month0);
    }
    const y = Number(yearInput);
    if (!Number.isFinite(y) || y < 2000 || y > 2100) return statsForYear(tips, orderLikes, new Date().getFullYear());
    return statsForYear(tips, orderLikes, y);
  }, [periodMode, monthInput, yearInput, tips, orders]);

  const monthlyForYear = useMemo(() => {
    const y = Number(yearInput);
    const year = Number.isFinite(y) && y >= 2000 && y <= 2100 ? y : new Date().getFullYear();
    const orderLikes = orders.map((o) => ({ created_at: o.created_at, status: o.status }));
    return monthlyStatsForYear(tips, orderLikes, year);
  }, [yearInput, tips, orders]);

  const panelBtn =
    "shrink-0 min-h-14 min-w-[11rem] rounded-xl border-2 px-8 py-3.5 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";
  const panelInactive = "border-[#0F4F68]/25 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]";
  const panelActive = "border-[#0F4F68] bg-[#0F4F68] text-white";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-5">
      <div className="text-center lg:col-span-8 lg:col-start-1 lg:row-start-1">
        <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-4xl md:text-5xl">
          {welcomeHeadline}
        </h1>
        <hr className="mx-auto mt-6 max-w-xs border-t-2 border-[#0F4F68]/30 sm:max-w-md lg:mx-0 lg:ml-0" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:justify-start">
        <button
          type="button"
          className={`${panelBtn} ${panel === "statistik" ? panelActive : panelInactive}`}
          onClick={() => setPanel("statistik")}
        >
          Statistik
        </button>
        <button
          type="button"
          className="shrink-0 min-h-16 min-w-[12.5rem] rounded-2xl bg-[#F78F2E] px-10 py-4 text-lg font-bold text-white hover:bg-[#ea8324] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
          onClick={() => setTipOpen(true)}
        >
          Tipp geben
        </button>
        <button
          type="button"
          className={`${panelBtn} ${panel === "status" ? panelActive : panelInactive}`}
          onClick={() => setPanel("status")}
        >
          Statusliste
        </button>
      </div>

      <aside
        className="order-3 space-y-3 lg:order-none lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:self-start"
        aria-labelledby="partner-code-auszahlung"
      >
        <h2 id="partner-code-auszahlung" className="sr-only">
          Partner-Code und Auszahlungen
        </h2>
        {partnerCode ? (
          <div className="rounded-xl border border-[#0F4F68]/20 bg-gradient-to-br from-[#E8F4F7] to-white p-4 shadow-sm ring-1 ring-[#0F4F68]/5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#0F4F68]/65">Ihr Partner-Code</p>
            <p className="mt-1.5 font-mono text-2xl font-black tracking-[0.15em] text-[#0F4F68] sm:text-3xl">{partnerCode}</p>
          </div>
        ) : null}
        <div className="rounded-xl border border-[#0F4F68]/16 bg-gradient-to-br from-[#E8F4F7]/80 via-[#F2F9FA] to-white p-4 shadow-sm ring-1 ring-[#0F4F68]/5">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Monatliche Tippgeberprovision</p>
          <p className="mt-2 text-xl font-bold tabular-nums text-[#0F4F68]">128,50 €</p>
          <p className="mt-1 text-xs leading-snug text-neutral-600">Platzhalter bis Anbindung der Abrechnung.</p>
        </div>
        <div className="rounded-xl border border-[#F78F2E]/30 bg-gradient-to-br from-[#FFF5ED] to-white p-4 shadow-sm ring-1 ring-[#F78F2E]/12">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#C45A0A]">Einmalprovision</p>
          <p className="mt-2 text-xl font-bold tabular-nums text-[#B45309]">420,00 €</p>
          <p className="mt-1 text-xs text-neutral-600">Platzhalter.</p>
        </div>
        <div className="rounded-lg border border-[#0F4F68]/12 bg-white px-4 py-3 shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Auszahlung</p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">
            Nächste am <time dateTime={payoutIso}>{payoutLabel}</time>
          </p>
          <p className="mt-0.5 text-[0.7rem] text-neutral-500">Zum Monatsersten (Hinweis).</p>
        </div>
      </aside>

      <div className="order-4 min-w-0 lg:col-span-8 lg:col-start-1 lg:row-start-3">
        {panel === "statistik" ? (
          <section aria-labelledby="statistik-panel" className="space-y-8 rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-[#0F4F68]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="statistik-panel" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Statistik
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Zeitraum</span>
                <div className="flex rounded-lg border border-[#0F4F68]/20 p-0.5">
                  <button
                    type="button"
                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                      periodMode === "month" ? "bg-[#0F4F68] text-white" : "text-[#0F4F68] hover:bg-[#F2F9FA]"
                    }`}
                    onClick={() => setPeriodMode("month")}
                  >
                    Monat
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                      periodMode === "year" ? "bg-[#0F4F68] text-white" : "text-[#0F4F68] hover:bg-[#F2F9FA]"
                    }`}
                    onClick={() => setPeriodMode("year")}
                  >
                    Jahr
                  </button>
                </div>
                {periodMode === "month" ? (
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <span className="sr-only">Monat wählen</span>
                    <input
                      type="month"
                      value={monthInput}
                      onChange={(e) => setMonthInput(e.target.value)}
                      className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900"
                    />
                  </label>
                ) : (
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <span className="whitespace-nowrap">Jahr</span>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                      className="w-24 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-900"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#0F4F68]">Aufträge nach Status</h3>
              <p className="mt-1 max-w-3xl text-sm text-neutral-600">
                Tippgeber-Eingänge und abgeschlossene Pflegebox-Konfigurationen mit Eingang im gewählten Zeitraum.
              </p>
              <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-[#fafcfb] p-5 sm:p-6">
                <HorizontalStatBars stats={periodStats} />
              </div>
            </div>

            {periodMode === "year" ? (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6">
                <YearMonthOverviewChart
                  monthly={monthlyForYear}
                  year={Number(yearInput) >= 2000 && Number(yearInput) <= 2100 ? Number(yearInput) : new Date().getFullYear()}
                />
              </div>
            ) : null}

            <div>
              <h3 className="text-base font-bold text-[#0F4F68]">Konfigurator (Übersicht)</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                <li className="rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA]/50 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Gesamt</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.total}</p>
                  <p className="mt-1 text-sm text-neutral-600">Abschlüsse</p>
                </li>
                <li className="rounded-2xl border border-[#F78F2E]/25 bg-[#FFF8F0]/70 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#C45A0A]">30 Tage</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-[#B45309]">{stats.last30}</p>
                  <p className="mt-1 text-sm text-neutral-600">Neu</p>
                </li>
                <li className="rounded-2xl border border-[#0F4F68]/12 bg-white p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">7 Tage</p>
                  <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.last7}</p>
                  <p className="mt-1 text-sm text-neutral-600">Neu</p>
                </li>
              </ul>
            </div>
          </section>
        ) : (
          <section aria-labelledby="status-panel" className="space-y-10">
            <div className="rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
              <h2 id="status-panel" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Statusliste
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Ihre Tippgeber-Meldungen nach Leistungsbereich. Statusfarben entsprechen der Bearbeitung durch
                Alltagshilfe-Süd.
              </p>

              <div className="mt-6 space-y-8">
                {SERVICE_SLUG_ORDER.map((slug) => {
                  const rows = tipsBySlug.get(slug) ?? [];
                  if (rows.length === 0) return null;
                  const label = PARTNER_RESPONSIBILITY_LABELS[slug];
                  return (
                    <div key={slug} className="overflow-hidden rounded-2xl border border-neutral-200/90 shadow-sm">
                      <div
                        className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 ${serviceBadgeClass(slug)}`}
                      >
                        <h3 className="text-sm font-bold sm:text-base">{label}</h3>
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold text-neutral-800">
                          {rows.length} {rows.length === 1 ? "Eintrag" : "Einträge"}
                        </span>
                      </div>
                      <ul className="divide-y divide-neutral-100 bg-white">
                        {rows.map((t) => (
                          <li key={t.id} className="px-4 py-4 sm:px-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-neutral-900">
                                  {partnerTipPayloadSummary(t.payload, t.service_slug)}
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">
                                  Eingang:{" "}
                                  {new Date(t.created_at).toLocaleString("de-DE", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </p>
                              </div>
                              <span
                                className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${PARTNER_TIP_STATUS_BADGE_CLASS[t.admin_status]}`}
                              >
                                {PARTNER_TIP_STATUS_PARTNER_LABELS[t.admin_status]}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                {extraSlugs.map((slug) => {
                  const rows = tipsBySlug.get(slug) ?? [];
                  if (rows.length === 0) return null;
                  const label = PARTNER_RESPONSIBILITY_LABELS[slug as PartnerResponsibilitySlug] ?? slug.replace(/_/g, " ");
                  return (
                    <div key={slug} className="overflow-hidden rounded-2xl border border-neutral-200/90 shadow-sm">
                      <div
                        className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 ${serviceBadgeClass(slug)}`}
                      >
                        <h3 className="text-sm font-bold sm:text-base">{label}</h3>
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold text-neutral-800">
                          {rows.length} {rows.length === 1 ? "Eintrag" : "Einträge"}
                        </span>
                      </div>
                      <ul className="divide-y divide-neutral-100 bg-white">
                        {rows.map((t) => (
                          <li key={t.id} className="px-4 py-4 sm:px-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-neutral-900">
                                  {partnerTipPayloadSummary(t.payload, t.service_slug)}
                                </p>
                                <p className="mt-1 text-xs text-neutral-500">
                                  Eingang:{" "}
                                  {new Date(t.created_at).toLocaleString("de-DE", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </p>
                              </div>
                              <span
                                className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${PARTNER_TIP_STATUS_BADGE_CLASS[t.admin_status]}`}
                              >
                                {PARTNER_TIP_STATUS_PARTNER_LABELS[t.admin_status]}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                {tips.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#0F4F68]/25 bg-[#F2F9FA]/30 p-8 text-center text-sm text-neutral-600">
                    Noch keine Tippgeber-Eingänge. Nutzen Sie „Tipp geben“, um Kontakte zu melden.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
              <h3 className="text-lg font-bold text-[#0F4F68]">Pflegebox-Konfigurationen</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Abschlüsse über Ihren Link (<code className="rounded bg-neutral-100 px-1 text-xs">?partner=…</code>).
              </p>
              {orders.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-dashed border-[#0F4F68]/20 bg-[#fafcfb] p-8 text-center text-sm text-neutral-600">
                  Noch keine Einträge.
                </p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {orders.map((row) => {
                    const contact = orderContactLine(row.summary_json);
                    const lines = Array.isArray(row.summary_json?.cartLines)
                      ? (row.summary_json?.cartLines as unknown[]).length
                      : null;
                    const st = (row.status || "").toLowerCase();
                    const done = st === "completed" || st === "erledigt";
                    return (
                      <li
                        key={row.id}
                        className="rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-br from-white to-[#F2F9FA]/40 p-4 shadow-sm sm:p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-neutral-900">
                            {row.external_reference ?? `Konfiguration ${row.id.slice(0, 8)}…`}
                          </span>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${
                              done
                                ? "border-emerald-300/80 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-200/80"
                                : "border-amber-300/80 bg-amber-50 text-amber-950 ring-1 ring-amber-200/80"
                            }`}
                          >
                            {row.status}
                          </span>
                        </div>
                        {contact ? <p className="mt-2 text-sm text-neutral-700">{contact}</p> : null}
                        {lines != null ? (
                          <p className="mt-1 text-xs text-neutral-500">{lines} Position(en) in der Box</p>
                        ) : null}
                        <p className="mt-2 text-xs text-neutral-500">
                          {new Date(row.created_at).toLocaleString("de-DE", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        )}
      </div>

      <PartnerTipModal open={tipOpen} onClose={() => setTipOpen(false)} allowedSlugs={allowedSlugs} />
    </div>
  );
}
