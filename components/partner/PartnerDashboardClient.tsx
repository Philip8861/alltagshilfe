"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PartnerAnimatedEuro } from "@/components/partner/PartnerAnimatedEuro";
import { PartnerTipModal } from "@/components/partner/PartnerTipModal";
import { PARTNER_TIP_STATUS_PARTNER_LABELS } from "@/lib/partner/partner-tip-admin";
import { tipTableFields } from "@/lib/partner/partner-tip-table-fields";
import { serviceBadgeClass } from "@/lib/partner/service-slug-styles";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import type { PartnerDashboardTipSerial, PartnerTipAdminStatus } from "@/lib/partner/types";

type Props = {
  welcomeLine: string;
  partnerCode: string | null;
  payoutLabel: string;
  responsibilityAreaSlugs: string[];
  tips: PartnerDashboardTipSerial[];
  initialTipModalOpen: boolean;
};

const slugSet = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);

const iconWrap =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0F4F68]/10 text-[#0F4F68]";

function statusPill(admin: PartnerTipAdminStatus): { label: string; className: string } {
  const label = PARTNER_TIP_STATUS_PARTNER_LABELS[admin] ?? String(admin);
  switch (admin) {
    case "neu":
      return { label, className: "bg-sky-600 text-white" };
    case "in_bearbeitung":
      return { label, className: "bg-amber-400 text-amber-950" };
    case "termin_vereinbart":
      return { label, className: "bg-indigo-600 text-white" };
    case "warten_auf_rueckmeldung":
      return { label, className: "bg-violet-600 text-white" };
    case "bezahlt":
      return { label, className: "bg-teal-600 text-white" };
    case "erledigt":
      return { label, className: "bg-emerald-600 text-white" };
    case "abgelehnt":
      return { label, className: "bg-red-600 text-white" };
    default:
      return { label, className: "bg-neutral-500 text-white" };
  }
}

export function PartnerDashboardClient({
  welcomeLine,
  partnerCode,
  payoutLabel,
  responsibilityAreaSlugs,
  tips,
  initialTipModalOpen,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [tipOpen, setTipOpen] = useState(initialTipModalOpen);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTipOpen(initialTipModalOpen);
  }, [initialTipModalOpen]);

  const allowedSlugs = useMemo(() => {
    return responsibilityAreaSlugs.filter((s): s is PartnerResponsibilitySlug => slugSet.has(s));
  }, [responsibilityAreaSlugs]);

  const activeTips = useMemo(() => tips.filter((t) => !t.archived_at), [tips]);
  const archivedTips = useMemo(() => tips.filter((t) => t.archived_at), [tips]);

  const toRows = useCallback((list: typeof tips) => {
    return list.map((t) => {
      const slug = t.service_slug as PartnerResponsibilitySlug;
      const typ = PARTNER_RESPONSIBILITY_LABELS[slug] ?? t.service_slug.replace(/_/g, " ");
      const f = tipTableFields(t.payload, t.service_slug);
      const datum = new Date(t.created_at).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const pill = statusPill(t.admin_status);
      const adminNote = t.admin_visible_note?.trim() ?? "";
      return {
        id: t.id,
        typ,
        typeClass: serviceBadgeClass(t.service_slug),
        vorname: f.vorname,
        nachname: f.nachname,
        firma: f.firma,
        datum,
        pill,
        adminNote,
      };
    });
  }, []);

  const activeRows = useMemo(() => toRows(activeTips), [activeTips, toRows]);
  const archivedRows = useMemo(() => toRows(archivedTips), [archivedTips, toRows]);

  const filterRows = useCallback(
    (rows: ReturnType<typeof toRows>) => {
      const q = search.trim().toLowerCase();
      if (!q) return rows;
      return rows.filter((r) => {
        const note = r.adminNote.toLowerCase();
        return (
          r.typ.toLowerCase().includes(q) ||
          r.vorname.toLowerCase().includes(q) ||
          r.nachname.toLowerCase().includes(q) ||
          `${r.vorname} ${r.nachname}`.toLowerCase().includes(q) ||
          r.firma.toLowerCase().includes(q) ||
          r.datum.includes(q) ||
          r.pill.label.toLowerCase().includes(q) ||
          note.includes(q)
        );
      });
    },
    [search],
  );

  const filteredActive = useMemo(() => filterRows(activeRows), [activeRows, filterRows]);
  const filteredArchived = useMemo(() => filterRows(archivedRows), [archivedRows, filterRows]);

  const closeTipModal = () => {
    setTipOpen(false);
    if (typeof window !== "undefined" && window.location.search.includes("tip=1")) {
      router.replace(pathname || "/partner/dashboard");
    }
  };

  const cardBase =
    "partner-metric-card partner-dash-animate flex min-h-[7.5rem] flex-1 flex-col justify-center gap-2 rounded-lg border border-neutral-300 bg-white p-5 sm:min-w-[12rem]";

  return (
    <div className="mx-auto w-full max-w-[min(100%,90rem)] space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA] px-6 py-6 shadow-[0_10px_22px_rgba(15,79,104,0.2),0_4px_12px_rgba(15,79,104,0.12)] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
        <div className="partner-dash-animate min-w-0">
          <h1 className="text-2xl font-semibold leading-snug text-[#0F4F68] sm:text-3xl">
            {welcomeLine},
          </h1>
          <div className="mt-2 h-1 w-full max-w-[10rem] overflow-hidden rounded-full bg-[#0F4F68]/15">
            <div
              className="h-full w-full origin-left scale-x-0 animate-partner-bar-fill rounded-full bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9]"
              style={{ animationDelay: "0.2s" }}
              aria-hidden
            />
          </div>
          <p className="mt-3 text-sm text-neutral-700 sm:text-base">
            Dein persönliches Partnerportal-Dashboard.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTipOpen(true)}
          className="partner-dash-animate partner-dash-delay-2 group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#0F4F68] to-[#0c3d52] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(15,79,104,0.22),0_4px_12px_rgba(15,79,104,0.14)] ring-1 ring-[#0F4F68]/30 transition hover:from-[#0c3d52] hover:to-[#0a3446] hover:shadow-[0_14px_28px_rgba(15,79,104,0.28),0_6px_14px_rgba(15,79,104,0.16)] active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F2F9FA] sm:mt-0 sm:w-auto"
        >
          <svg
            className="h-5 w-5 shrink-0 opacity-95 transition group-hover:scale-105"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tipp geben
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`${cardBase} partner-dash-delay-1 relative z-[1]`}>
          <div className="flex items-start gap-4">
            <div className={iconWrap} aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  d="M15.5 7.5l2.3 2.3a1 1 0 010 1.4l-7.1 7.1H9v-3.1l7.1-7.1a1 1 0 011.4 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M5 21h14" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase text-[#0F4F68]">Ihr Partner-Code</p>
              <p
                className={`mt-1 text-2xl font-semibold tabular-nums text-[#0F4F68] sm:text-3xl ${partnerCode ? "partner-code-settle" : ""}`}
              >
                {partnerCode ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardBase} partner-dash-delay-2 relative z-[1]`}>
          <p className="text-[0.65rem] font-semibold uppercase text-[#0F4F68]">Monatliche Tippgeberpr…</p>
          <p className="mt-1 text-2xl font-semibold text-[#0F4F68] sm:text-3xl">
            <PartnerAnimatedEuro value={128.5} durationMs={1600} />
          </p>
          <p className="text-xs text-neutral-600">Auszahlung in Bearbeitung</p>
        </div>

        <div className={`${cardBase} partner-dash-delay-3 relative z-[1]`}>
          <div className="flex items-start gap-4">
            <div className={`${iconWrap} motion-safe:animate-partner-soft-float`} aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M7 10h4M7 14h10" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase text-[#0F4F68]">Einmalprovision</p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4F68] sm:text-3xl">
                <PartnerAnimatedEuro value={420} durationMs={1750} />
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">Zahlung bereit</p>
            </div>
          </div>
        </div>

        <div className={`${cardBase} partner-dash-delay-4 relative z-[1]`}>
          <div className="flex items-start gap-4">
            <div className={`${iconWrap} motion-safe:animate-partner-icon-nudge`} aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase text-[#0F4F68]">Nächste Auszahlung</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[#0F4F68] sm:text-2xl">
                am {payoutLabel}
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">Zum Monatsende</p>
            </div>
          </div>
        </div>
      </div>

      <section
        id="partner-statusliste"
        className="partner-dash-animate partner-dash-delay-5 scroll-mt-28 rounded-lg border border-neutral-300 bg-white p-4 sm:p-6 lg:p-8"
        aria-labelledby="partner-statusliste-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="partner-statusliste-heading" className="text-lg font-semibold text-[#0F4F68] sm:text-xl">
            Statusliste
          </h2>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Suchen</span>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0F4F68]/40" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suchen"
              className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-500 hover:border-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto rounded-md border border-neutral-200">
          <table className="min-w-[64rem] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F2F9FA] text-xs font-semibold uppercase text-[#0F4F68]">
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Vorname</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Nachname</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Firma</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Datum</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Status</th>
                <th className="min-w-[8rem] px-3 py-3 sm:px-4">Notiz</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Typ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredActive.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-600">
                    Keine aktiven Einträge{search.trim() ? " für diese Suche." : "."}
                  </td>
                </tr>
              ) : (
                filteredActive.map((r) => (
                  <tr key={r.id} className="bg-white hover:bg-neutral-50/80">
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.vorname}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.nachname}</td>
                    <td className="max-w-[12rem] truncate px-3 py-3 text-neutral-800 sm:max-w-[14rem] sm:px-4">
                      {r.firma}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-800 sm:px-4">{r.datum}</td>
                    <td className="px-3 py-3 sm:px-4">
                      <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-medium ${r.pill.className}`}>
                        {r.pill.label}
                      </span>
                    </td>
                    <td className="max-w-[14rem] px-3 py-3 align-top text-neutral-800 sm:px-4">
                      {r.adminNote ? (
                        <details className="text-sm">
                          <summary className="cursor-pointer list-none font-medium text-[#0F4F68] hover:underline [&::-webkit-details-marker]:hidden">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black leading-none text-amber-950 shadow-[0_0_14px_rgba(251,191,36,0.95)] ring-2 ring-amber-200/80 motion-safe:animate-pulse"
                                aria-hidden
                              >
                                !
                              </span>
                              <span>Notiz lesen</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </summary>
                          <p className="mt-2 whitespace-pre-wrap text-neutral-700">{r.adminNote}</p>
                        </details>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${r.typeClass}`}>
                        {r.typ}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section
        id="partner-statusliste-archiv"
        className="partner-dash-animate partner-dash-delay-5 scroll-mt-28 rounded-lg border border-neutral-300 bg-white p-4 sm:p-6 lg:p-8"
        aria-labelledby="partner-statusliste-archiv-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="partner-statusliste-archiv-heading" className="text-lg font-semibold text-[#0F4F68] sm:text-xl">
            Statusliste Archiv
          </h2>
          <p className="text-sm text-neutral-600 sm:max-w-md sm:text-right">
            Hier erscheinen abgelegte Fälle. Die gleiche Suche oben filtert auch dieses Archiv.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-md border border-neutral-200">
          <table className="min-w-[64rem] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F2F9FA] text-xs font-semibold uppercase text-[#0F4F68]">
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Vorname</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Nachname</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Firma</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Datum</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Status</th>
                <th className="min-w-[8rem] px-3 py-3 sm:px-4">Notiz</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Typ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredArchived.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-600">
                    Keine archivierten Einträge{search.trim() ? " für diese Suche." : "."}
                  </td>
                </tr>
              ) : (
                filteredArchived.map((r) => (
                  <tr key={r.id} className="bg-white hover:bg-neutral-50/80">
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.vorname}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.nachname}</td>
                    <td className="max-w-[12rem] truncate px-3 py-3 text-neutral-800 sm:max-w-[14rem] sm:px-4">
                      {r.firma}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-800 sm:px-4">{r.datum}</td>
                    <td className="px-3 py-3 sm:px-4">
                      <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-medium ${r.pill.className}`}>
                        {r.pill.label}
                      </span>
                    </td>
                    <td className="max-w-[14rem] px-3 py-3 align-top text-neutral-800 sm:px-4">
                      {r.adminNote ? (
                        <details className="text-sm">
                          <summary className="cursor-pointer list-none font-medium text-[#0F4F68] hover:underline [&::-webkit-details-marker]:hidden">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black leading-none text-amber-950 shadow-[0_0_14px_rgba(251,191,36,0.95)] ring-2 ring-amber-200/80 motion-safe:animate-pulse"
                                aria-hidden
                              >
                                !
                              </span>
                              <span>Notiz lesen</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </summary>
                          <p className="mt-2 whitespace-pre-wrap text-neutral-700">{r.adminNote}</p>
                        </details>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${r.typeClass}`}>
                        {r.typ}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <PartnerTipModal open={tipOpen} onClose={closeTipModal} allowedSlugs={allowedSlugs} />
    </div>
  );
}
