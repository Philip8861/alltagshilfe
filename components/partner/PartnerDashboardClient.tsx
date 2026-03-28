"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PartnerTipModal } from "@/components/partner/PartnerTipModal";
import { tipPayloadKontaktEmail } from "@/lib/partner/partner-tip-kontakt";
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

function statusPill(admin: PartnerTipAdminStatus): { label: string; className: string } {
  switch (admin) {
    case "neu":
      return {
        label: "Eingegangen",
        className: "bg-[#134e4a] text-white",
      };
    case "in_bearbeitung":
      return {
        label: "In Bearbeitung",
        className: "bg-[#ea580c] text-white",
      };
    case "erledigt":
      return {
        label: "Abgeschlossen",
        className: "bg-[#dc2626] text-white",
      };
    case "abgelehnt":
      return {
        label: "Abgelehnt",
        className: "bg-neutral-600 text-white",
      };
    default:
      return { label: admin, className: "bg-neutral-500 text-white" };
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

  const rows = useMemo(() => {
    return tips.map((t) => {
      const slug = t.service_slug as PartnerResponsibilitySlug;
      const typ = PARTNER_RESPONSIBILITY_LABELS[slug] ?? t.service_slug.replace(/_/g, " ");
      const kontakt = tipPayloadKontaktEmail(t.payload);
      const datum = new Date(t.created_at).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const pill = statusPill(t.admin_status);
      return { id: t.id, typ, kontakt, datum, pill };
    });
  }, [tips]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.typ.toLowerCase().includes(q) ||
        r.kontakt.toLowerCase().includes(q) ||
        r.datum.includes(q) ||
        r.pill.label.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const closeTipModal = () => {
    setTipOpen(false);
    if (typeof window !== "undefined" && window.location.search.includes("tip=1")) {
      router.replace(pathname || "/partner/dashboard");
    }
  };

  const cardBase =
    "flex min-h-[7.5rem] flex-1 flex-col justify-center gap-2 rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:min-w-[12rem]";

  return (
    <div className="mx-auto w-full max-w-[min(100%,90rem)] space-y-6 sm:space-y-8">
      <header className="rounded-2xl bg-[#134e4a] px-6 py-7 text-white shadow-sm sm:px-10 sm:py-9">
        <h1 className="text-balance text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {welcomeLine},
        </h1>
        <p className="mt-2 text-sm font-normal text-white/90 sm:text-base">Dein persönliches Partnerportal-Dashboard.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={cardBase}>
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700"
              aria-hidden
            >
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
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-teal-700">Ihr Partner-Code</p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-wide text-teal-800 sm:text-3xl">
                {partnerCode ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className={cardBase}>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-neutral-600">
            Monatliche Tippgeberpr…
          </p>
          <p className="text-2xl font-bold tabular-nums text-neutral-900 sm:text-3xl">128,50 €</p>
          <p className="text-xs text-neutral-600">Auszahlung in Bearbeitung</p>
        </div>

        <div className={cardBase}>
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600"
              aria-hidden
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <path d="M7 10h4M7 14h10" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-neutral-600">Einmalprovision</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900 sm:text-3xl">420,00 €</p>
              <p className="mt-0.5 text-xs text-neutral-600">Zahlung bereit</p>
            </div>
          </div>
        </div>

        <div className={cardBase}>
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600"
              aria-hidden
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-neutral-600">Nächste Auszahlung</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-neutral-900 sm:text-2xl">
                am {payoutLabel}
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">Zum Monatsende</p>
            </div>
          </div>
        </div>
      </div>

      <section
        id="partner-statusliste"
        className="scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm sm:p-6 lg:p-8"
        aria-labelledby="partner-statusliste-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="partner-statusliste-heading" className="text-lg font-bold text-neutral-900 sm:text-xl">
            Statusliste
          </h2>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Suchen</span>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
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
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition hover:border-neutral-300 focus:border-[#134e4a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#134e4a]/25"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-100">
          <table className="min-w-[56rem] w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-bold uppercase tracking-wide text-neutral-600">
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Typ</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Kontakt</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Datum</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Priorität</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Status</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Notizen</th>
                <th className="whitespace-nowrap px-3 py-3 sm:px-4">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-600">
                    Keine Einträge{search.trim() ? " für diese Suche." : "."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="bg-white hover:bg-neutral-50/80">
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-neutral-900 sm:px-4">{r.typ}</td>
                    <td className="max-w-[14rem] truncate px-3 py-3 text-neutral-800 sm:max-w-xs sm:px-4">{r.kontakt}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-800 sm:px-4">{r.datum}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-neutral-700 sm:px-4">Priorität</td>
                    <td className="px-3 py-3 sm:px-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${r.pill.className}`}
                      >
                        {r.pill.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-neutral-400 sm:px-4"> </td>
                    <td className="px-3 py-3 sm:px-4">
                      <button
                        type="button"
                        className="rounded-lg border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#134e4a]/40"
                      >
                        Details
                      </button>
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
