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
import { tipTableFields } from "@/lib/partner/partner-tip-table-fields";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import type { PartnerDashboardTipSerial, PartnerTipAdminStatus } from "@/lib/partner/types";

export type PartnerDashboardOrderSerial = {
  id: string;
  external_reference: string | null;
  status: string;
  created_at: string;
  summary_json: Record<string, unknown> | null;
};

type Panel = "statistik" | "status";
type SortDir = "asc" | "desc";
type TipSortKey = "firma" | "vorname" | "nachname" | "status" | "serviceLabel" | "created_at";

type Props = {
  welcomeHeadline: string;
  partnerCode: string | null;
  payoutLabel: string;
  payoutIso: string;
  responsibilityAreaSlugs: string[];
  orders: PartnerDashboardOrderSerial[];
  tips: PartnerDashboardTipSerial[];
};

type TipTableRow = {
  id: string;
  firma: string;
  vorname: string;
  nachname: string;
  serviceSlug: string;
  serviceLabel: string;
  admin_status: PartnerTipAdminStatus;
  created_at: string;
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
              <div className={`h-full rounded-lg ${r.barClass}`} style={{ width: `${(r.value / max) * 100}%` }} />
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

function TableSortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-left font-bold uppercase tracking-wide hover:text-[#0c3d52] ${
        active ? "text-[#0F4F68]" : "text-[#0F4F68]/75"
      }`}
    >
      {label}
      {active ? (dir === "asc" ? " ↑" : " ↓") : ""}
    </button>
  );
}

export function PartnerDashboardClient({
  welcomeHeadline,
  partnerCode,
  payoutLabel,
  payoutIso,
  responsibilityAreaSlugs,
  orders,
  tips,
}: Props) {
  const [panel, setPanel] = useState<Panel>("status");
  const [tipOpen, setTipOpen] = useState(false);
  const [periodMode, setPeriodMode] = useState<"month" | "year">("month");
  const [monthInput, setMonthInput] = useState(currentMonthValue);
  const [yearInput, setYearInput] = useState(() => String(new Date().getFullYear()));
  const [tipSort, setTipSort] = useState<{ key: TipSortKey; dir: SortDir }>({
    key: "created_at",
    dir: "desc",
  });

  const allowedSlugs = useMemo(() => {
    return responsibilityAreaSlugs.filter((s): s is PartnerResponsibilitySlug => slugSet.has(s));
  }, [responsibilityAreaSlugs]);

  const tipRows: TipTableRow[] = useMemo(() => {
    return tips.map((t) => {
      const f = tipTableFields(t.payload, t.service_slug);
      const slug = t.service_slug as PartnerResponsibilitySlug;
      const serviceLabel = PARTNER_RESPONSIBILITY_LABELS[slug] ?? t.service_slug.replace(/_/g, " ");
      return {
        id: t.id,
        firma: f.firma,
        vorname: f.vorname,
        nachname: f.nachname,
        serviceSlug: t.service_slug,
        serviceLabel,
        admin_status: t.admin_status,
        created_at: t.created_at,
      };
    });
  }, [tips]);

  const sortedTipRows = useMemo(() => {
    const rows = [...tipRows];
    const { key, dir } = tipSort;
    const mul = dir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      if (key === "status") {
        return mul * a.admin_status.localeCompare(b.admin_status, "de");
      }
      if (key === "created_at") {
        return mul * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      const va = a[key];
      const vb = b[key];
      return mul * String(va).localeCompare(String(vb), "de", { sensitivity: "base" });
    });
    return rows;
  }, [tipRows, tipSort]);

  const toggleTipSort = (key: TipSortKey) => {
    setTipSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };

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

  const glowBtn =
    "shrink-0 min-h-14 min-w-[10.5rem] rounded-xl border-2 px-7 py-3.5 text-base font-semibold transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";
  const glowInactive =
    "border-[#0F4F68]/35 bg-white text-[#0F4F68] shadow-[0_0_22px_-8px_rgba(15,79,104,0.38),0_4px_14px_-10px_rgba(15,79,104,0.22)] hover:shadow-[0_0_30px_-6px_rgba(15,79,104,0.48)]";
  const glowActive =
    "border-[#0F4F68] bg-[#0F4F68] text-white shadow-[0_0_32px_-4px_rgba(15,79,104,0.58),0_6px_22px_-8px_rgba(15,79,104,0.35)] hover:shadow-[0_0_36px_-4px_rgba(15,79,104,0.55)]";

  const provisionCard =
    "flex min-h-[7.5rem] min-w-[min(100%,14rem)] flex-1 flex-col justify-center rounded-2xl border border-[#0F4F68]/15 bg-gradient-to-br from-white to-[#F2F9FA]/80 p-5 text-center shadow-sm ring-1 ring-[#0F4F68]/5 sm:max-w-xs";

  return (
    <div className="mx-auto w-full max-w-[min(100%,90rem)] space-y-10">
      <div className="partner-dash-animate text-center">
        <h1 className="text-balance text-3xl font-semibold leading-tight text-[#0F4F68] sm:text-4xl md:text-5xl">
          {welcomeHeadline}
        </h1>
        <hr className="mx-auto mt-6 max-w-lg border-t border-[#0F4F68]/25" />
      </div>

      <div className="partner-dash-animate partner-dash-delay-1 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          className={`${glowBtn} ${panel === "statistik" ? glowActive : glowInactive}`}
          onClick={() => setPanel("statistik")}
        >
          Statistik
        </button>
        <button
          type="button"
          className={`${glowBtn} min-h-16 min-w-[12rem] text-lg font-bold ${glowInactive}`}
          onClick={() => setTipOpen(true)}
        >
          Tipp geben
        </button>
        <button
          type="button"
          className={`${glowBtn} ${panel === "status" ? glowActive : glowInactive}`}
          onClick={() => setPanel("status")}
        >
          Statusliste
        </button>
      </div>

      <div className="partner-dash-animate partner-dash-delay-2 flex flex-wrap items-stretch justify-center gap-4 sm:gap-5">
        <div className={provisionCard}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#0F4F68]/65">Partner-Code</p>
          {partnerCode ? (
            <p className="mt-2 font-mono text-2xl font-black tracking-[0.12em] text-[#0F4F68] sm:text-3xl">{partnerCode}</p>
          ) : (
            <p className="mt-2 text-sm text-neutral-500">Wird vergeben …</p>
          )}
        </div>
        <div className={provisionCard}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Monatliche Tippgeberprovision</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F4F68] sm:text-3xl">128,50 €</p>
          <p className="mt-1 text-xs text-neutral-600">Platzhalter bis Anbindung der Abrechnung.</p>
        </div>
        <div className={provisionCard}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Einmalprovision</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[#0F4F68] sm:text-3xl">420,00 €</p>
          <p className="mt-1 text-xs text-neutral-600">Platzhalter.</p>
        </div>
      </div>

      <p className="partner-dash-animate partner-dash-delay-2 text-center text-sm text-neutral-600">
        <span className="font-semibold text-[#0F4F68]">Auszahlung:</span>{" "}
        <time dateTime={payoutIso}>{payoutLabel}</time>
        <span className="text-neutral-500"> (Hinweis: zum Monatsersten)</span>
      </p>

      <div className="partner-dash-animate partner-dash-delay-3 min-w-0">
        {panel === "statistik" ? (
          <section
            aria-labelledby="statistik-panel"
            className="space-y-8 rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
          >
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
                  year={
                    Number(yearInput) >= 2000 && Number(yearInput) <= 2100
                      ? Number(yearInput)
                      : new Date().getFullYear()
                  }
                />
              </div>
            ) : null}
          </section>
        ) : (
          <section aria-labelledby="status-panel" className="space-y-10">
            <div className="rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
              <h2 id="status-panel" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Statusliste
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Ihre Tippgeber-Meldungen. Spaltenköpfe zum Sortieren anklicken.
              </p>

              <div className="mt-6 overflow-x-auto rounded-xl border border-[#0F4F68]/10 shadow-sm">
                <table className="min-w-[720px] w-full text-left text-sm">
                  <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/70 text-xs">
                    <tr>
                      <th className="px-4 py-3">
                        <TableSortButton
                          label="Firma"
                          active={tipSort.key === "firma"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("firma")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <TableSortButton
                          label="Vorname"
                          active={tipSort.key === "vorname"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("vorname")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <TableSortButton
                          label="Nachname"
                          active={tipSort.key === "nachname"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("nachname")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <TableSortButton
                          label="Leistung"
                          active={tipSort.key === "serviceLabel"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("serviceLabel")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <TableSortButton
                          label="Status"
                          active={tipSort.key === "status"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("status")}
                        />
                      </th>
                      <th className="px-4 py-3">
                        <TableSortButton
                          label="Eingang"
                          active={tipSort.key === "created_at"}
                          dir={tipSort.dir}
                          onClick={() => toggleTipSort("created_at")}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {sortedTipRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-neutral-600">
                          Noch keine Tippgeber-Eingänge. Nutzen Sie „Tipp geben“, um Kontakte zu melden.
                        </td>
                      </tr>
                    ) : (
                      sortedTipRows.map((row) => (
                        <tr key={row.id} className="bg-white hover:bg-[#fafcfb]">
                          <td className="px-4 py-3 font-medium text-neutral-900">{row.firma}</td>
                          <td className="px-4 py-3 text-neutral-800">{row.vorname}</td>
                          <td className="px-4 py-3 text-neutral-800">{row.nachname}</td>
                          <td className="px-4 py-3 text-neutral-700">{row.serviceLabel}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${PARTNER_TIP_STATUS_BADGE_CLASS[row.admin_status]}`}
                            >
                              {PARTNER_TIP_STATUS_PARTNER_LABELS[row.admin_status]}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-neutral-600">
                            {new Date(row.created_at).toLocaleString("de-DE", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
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
