"use client";

import { useMemo, useState } from "react";
import { PARTNER_DEMO_CLIENTS } from "@/lib/partner/dashboard-demo-clients";
import { orderContactLine } from "@/lib/partner/dashboard-order-utils";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import { PartnerTipModal } from "@/components/partner/PartnerTipModal";

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
};

const slugSet = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);

export function PartnerDashboardClient({
  welcomeHeadline,
  partnerCode,
  payoutLabel,
  payoutIso,
  responsibilityAreaSlugs,
  stats,
  orders,
}: Props) {
  const [panel, setPanel] = useState<Panel>("statistik");
  const [tipOpen, setTipOpen] = useState(false);

  const allowedSlugs = useMemo(() => {
    const filtered = responsibilityAreaSlugs.filter((s): s is PartnerResponsibilitySlug => slugSet.has(s));
    return filtered;
  }, [responsibilityAreaSlugs]);

  const btnBase =
    "min-h-11 rounded-xl border-2 px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";
  const btnInactive = "border-[#0F4F68]/20 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]";
  const btnActive = "border-[#0F4F68] bg-[#0F4F68] text-white shadow-sm";

  return (
    <div className="space-y-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-4xl md:text-5xl">
          {welcomeHeadline}
        </h1>
        <hr className="mx-auto mt-8 max-w-xs border-t-2 border-[#0F4F68]/30 sm:max-w-md" />
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            className={`${btnBase} ${panel === "statistik" ? btnActive : btnInactive}`}
            onClick={() => setPanel("statistik")}
          >
            Statistik
          </button>
          <button
            type="button"
            className="min-h-[3.25rem] rounded-2xl bg-[#F78F2E] px-8 py-3.5 text-base font-bold text-white shadow-[0_10px_32px_-10px_rgba(15,79,104,0.55)] ring-2 ring-[#0F4F68]/20 transition hover:bg-[#ea8324] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            onClick={() => setTipOpen(true)}
          >
            Tipp geben
          </button>
          <button
            type="button"
            className={`${btnBase} ${panel === "status" ? btnActive : btnInactive}`}
            onClick={() => setPanel("status")}
          >
            Statusliste
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <aside className="mx-auto w-full shrink-0 space-y-4 lg:mx-0 lg:max-w-sm" aria-labelledby="provisionen-aside">
          <h2 id="provisionen-aside" className="sr-only">
            Provisionen und Code
          </h2>
          <div className="rounded-2xl border border-[#0F4F68]/18 bg-gradient-to-br from-[#E8F4F7] via-[#F2F9FA] to-white p-6 shadow-sm ring-1 ring-[#0F4F68]/5">
            {partnerCode ? (
              <div className="mb-6 border-b border-[#0F4F68]/10 pb-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F4F68]/65">Ihr Partner-Code</p>
                <p className="mt-2 font-mono text-4xl font-black tracking-[0.2em] text-[#0F4F68] sm:text-5xl">
                  {partnerCode}
                </p>
              </div>
            ) : null}
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Monatliche Tippgeberprovision</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-[#0F4F68]">128,50 €</p>
            <p className="mt-2 text-sm leading-snug text-neutral-600">
              Fortlaufende Vergütung — Platzhalter bis Anbindung der Abrechnung.
            </p>
          </div>
          <div className="rounded-2xl border border-[#F78F2E]/35 bg-gradient-to-br from-[#FFF5ED] via-[#FFFAF5] to-white p-6 shadow-sm ring-1 ring-[#F78F2E]/15">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#C45A0A]">Einmalprovision</p>
            <p className="mt-3 text-3xl font-bold tabular-nums text-[#B45309]">420,00 €</p>
            <p className="mt-2 text-sm leading-snug text-neutral-600">Einmalige Boni — Platzhalter.</p>
          </div>
          <div className="rounded-xl border border-[#0F4F68]/12 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Auszahlung</p>
            <p className="mt-2 text-base font-semibold text-neutral-900">
              Nächste Auszahlung am <time dateTime={payoutIso}>{payoutLabel}</time>
            </p>
            <p className="mt-1 text-xs text-neutral-500">Zum Monatsersten (Hinweis).</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {panel === "statistik" ? (
            <section aria-labelledby="statistik-panel" className="space-y-6">
              <h2 id="statistik-panel" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                Statistik
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <li className="rounded-2xl border border-dashed border-[#0F4F68]/25 bg-[#F2F9FA]/40 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/60">Vermittlungen (Platzhalter)</p>
                  <p className="mt-3 text-3xl font-bold text-[#0F4F68]">—</p>
                  <p className="mt-1 text-xs text-neutral-500">Wird ergänzt</p>
                </li>
                <li className="rounded-2xl border border-dashed border-[#F78F2E]/30 bg-[#FFF8F0]/60 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#C45A0A]">Offene Tipps (Platzhalter)</p>
                  <p className="mt-3 text-3xl font-bold text-[#B45309]">—</p>
                  <p className="mt-1 text-xs text-neutral-500">Wird ergänzt</p>
                </li>
                <li className="rounded-2xl border border-dashed border-[#0F4F68]/20 bg-white p-5 text-center sm:col-span-2 lg:col-span-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#0F4F68]/60">Umsatzindex (Platzhalter)</p>
                  <p className="mt-3 text-3xl font-bold text-[#0F4F68]">—</p>
                  <p className="mt-1 text-xs text-neutral-500">Wird ergänzt</p>
                </li>
              </ul>
              <div>
                <h3 className="text-base font-bold text-[#0F4F68]">Konfigurator</h3>
                <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                  <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">Gesamt</p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.total}</p>
                    <p className="mt-1 text-sm text-neutral-600">Abschlüsse</p>
                  </li>
                  <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">30 Tage</p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.last30}</p>
                    <p className="mt-1 text-sm text-neutral-600">Neu</p>
                  </li>
                  <li className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0F4F68]/65">7 Tage</p>
                    <p className="mt-2 text-3xl font-bold tabular-nums text-[#0F4F68]">{stats.last7}</p>
                    <p className="mt-1 text-sm text-neutral-600">Neu</p>
                  </li>
                </ul>
              </div>
            </section>
          ) : (
            <section aria-labelledby="status-panel" className="space-y-10">
              <div>
                <h2 id="status-panel" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                  Statusliste
                </h2>
                <p className="mt-1 text-sm text-neutral-600">Beispieldaten — später echte Stammdaten.</p>
                <div
                  className="mt-4 overflow-x-auto rounded-2xl border border-[#0F4F68]/10 bg-white shadow-sm"
                  role="region"
                  aria-label="Klientenliste"
                >
                  <table className="min-w-[640px] w-full text-left text-sm">
                    <thead className="border-b border-[#0F4F68]/10 bg-[#F2F9FA]/60 text-xs font-bold uppercase tracking-wide text-[#0F4F68]">
                      <tr>
                        <th className="px-4 py-3">Vorname</th>
                        <th className="px-4 py-3">Nachname</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Dienstleistung</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {PARTNER_DEMO_CLIENTS.map((row) => (
                        <tr key={`${row.firstName}-${row.lastName}`} className="hover:bg-[#fafcfb]">
                          <td className="px-4 py-3 font-medium text-neutral-900">{row.firstName}</td>
                          <td className="px-4 py-3 text-neutral-800">{row.lastName}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex rounded-full bg-[#0F4F68]/10 px-2.5 py-0.5 text-xs font-semibold text-[#0F4F68]">
                              {row.status}
                            </span>
                          </td>
                          <td className="max-w-[14rem] px-4 py-3 text-neutral-700 sm:max-w-none">{row.service}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-[#0F4F68]/10 pt-8">
                <h3 className="text-base font-bold text-[#0F4F68]">Letzte Konfigurator-Abschlüsse</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Mit Partner-ID im Link (<code className="rounded bg-neutral-100 px-1 text-xs">?partner=…</code>).
                </p>
                {orders.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-[#0F4F68]/20 bg-white p-8 text-center text-sm text-neutral-600">
                    Noch keine Einträge.
                  </p>
                ) : (
                  <ul className="mt-6 space-y-3">
                    {orders.map((row) => {
                      const contact = orderContactLine(row.summary_json);
                      const lines = Array.isArray(row.summary_json?.cartLines)
                        ? (row.summary_json?.cartLines as unknown[]).length
                        : null;
                      return (
                        <li
                          key={row.id}
                          className="rounded-2xl border border-[#0F4F68]/10 bg-white p-4 shadow-sm sm:p-5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold text-neutral-900">
                              {row.external_reference ?? `Konfiguration ${row.id.slice(0, 8)}…`}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
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
      </div>

      <PartnerTipModal open={tipOpen} onClose={() => setTipOpen(false)} allowedSlugs={allowedSlugs} />
    </div>
  );
}
