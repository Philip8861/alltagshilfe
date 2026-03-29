"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PartnerNoteDetails } from "@/components/partner/PartnerNoteDetails";
import { usePathname, useRouter } from "next/navigation";
import { PartnerAnimatedEuro } from "@/components/partner/PartnerAnimatedEuro";
import { PartnerTipModal } from "@/components/partner/PartnerTipModal";
import { PARTNER_TIP_STATUS_PARTNER_LABELS } from "@/lib/partner/partner-tip-admin";
import { tipTableFields } from "@/lib/partner/partner-tip-table-fields";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  PARTNER_RESPONSIBILITY_LABELS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import { PartnerOwnArchiveTipButton } from "@/components/partner/PartnerOwnArchiveTipButton";
import { formatProvisionEur } from "@/lib/partner/partner-tip-payout";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import type { PartnerDashboardTipSerial, PartnerTipAdminStatus } from "@/lib/partner/types";
import { serviceBadgeClass, serviceTipTableTypCellClass } from "@/lib/partner/service-slug-styles";

type Props = {
  welcomeLine: string;
  partnerCode: string | null;
  payoutLabel: string;
  responsibilityAreaSlugs: string[];
  tips: PartnerDashboardTipSerial[];
  initialTipModalOpen: boolean;
  provisionMonatlichEur: number;
  provisionEinmalEur: number;
};

const slugSet = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);

const iconWrap =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0F4F68]/10 text-[#0F4F68]";

function statusPill(admin: PartnerTipAdminStatus): { label: string; className: string } {
  const label = PARTNER_TIP_STATUS_PARTNER_LABELS[admin] ?? String(admin);
  switch (admin) {
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
  provisionMonatlichEur,
  provisionEinmalEur,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [tipOpen, setTipOpen] = useState(initialTipModalOpen);

  useEffect(() => {
    setTipOpen(initialTipModalOpen);
  }, [initialTipModalOpen]);

  const allowedSlugs = useMemo(() => {
    return responsibilityAreaSlugs.filter((s): s is PartnerResponsibilitySlug => slugSet.has(s));
  }, [responsibilityAreaSlugs]);

  const visiblePartnerTips = useMemo(
    () => tips.filter((t) => !t.partner_archived_at),
    [tips],
  );
  const partnerArchivedTips = useMemo(
    () => tips.filter((t) => Boolean(t.partner_archived_at)),
    [tips],
  );

  const activeMonatlichTips = useMemo(
    () => visiblePartnerTips.filter((t) => provisionBucketForServiceSlug(t.service_slug) === "monatlich"),
    [visiblePartnerTips],
  );
  const activeEinmalTips = useMemo(
    () => visiblePartnerTips.filter((t) => provisionBucketForServiceSlug(t.service_slug) === "einmal"),
    [visiblePartnerTips],
  );

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
      const paid = t.paid_amount_eur;
      const monatlichBucket = provisionBucketForServiceSlug(t.service_slug) === "monatlich";
      const showPaidMonatlich =
        monatlichBucket &&
        (t.admin_status === "erledigt" || t.admin_status === "bezahlt") &&
        paid != null &&
        Number.isFinite(Number(paid));
      const showPaidEinmal =
        !monatlichBucket && t.admin_status === "bezahlt" && paid != null && Number.isFinite(Number(paid));
      const betrag =
        showPaidMonatlich || showPaidEinmal ? formatProvisionEur(Number(paid)) : "—";
      return {
        id: t.id,
        tipId: t.id,
        isArchived: Boolean(t.partner_archived_at),
        typ,
        typeClass: serviceBadgeClass(t.service_slug),
        typCellClass: serviceTipTableTypCellClass(t.service_slug),
        vorname: f.vorname,
        nachname: f.nachname,
        firma: f.firma,
        datum,
        pill,
        adminNote,
        betrag,
      };
    });
  }, []);

  const monatlichRows = useMemo(() => toRows(activeMonatlichTips), [activeMonatlichTips, toRows]);
  const einmalRows = useMemo(() => toRows(activeEinmalTips), [activeEinmalTips, toRows]);
  const archivedRows = useMemo(() => toRows(partnerArchivedTips), [partnerArchivedTips, toRows]);

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
          <p className="text-xs font-semibold leading-snug text-[#0F4F68] sm:text-[0.8125rem]">
            Monatliche Tippgeberprovision
          </p>
          <p className="mt-1 text-2xl font-semibold text-[#0F4F68] sm:text-3xl">
            <PartnerAnimatedEuro value={provisionMonatlichEur} durationMs={1600} />
          </p>
          <p className="text-xs text-neutral-600">
            {provisionMonatlichEur > 0
              ? "Summe Monatsprovisionen (betriebliche Pflegeberatung, vertraglich erfasst)"
              : "Noch keine Monatsprovision erfasst"}
          </p>
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
                <PartnerAnimatedEuro value={provisionEinmalEur} durationMs={1750} />
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">
                {provisionEinmalEur > 0
                  ? "Summe bezahlter Einmalprovisionen"
                  : "Noch keine Einmalprovision ausgezahlt"}
              </p>
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

      <div
        id="partner-statuslisten"
        className="partner-dash-animate partner-dash-delay-5 scroll-mt-28 space-y-6 sm:space-y-8"
      >
        <div className="rounded-xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-[#0F4F68]">Ihre Tippgeber-Statuslisten</p>
          <p className="mt-1 text-sm text-neutral-600">
            Betriebliche Pflegeberatung unter Monatsprovision, alle anderen Leistungen unter Einmalprovision. Änderungen
            durch die Verwaltung verschieben Ihre Einträge nicht zwischen den Listen — nur „Mein Archiv“ blendet für Sie
            ab.
          </p>
        </div>

        <section
          id="partner-statusliste-monatlich"
          className="scroll-mt-28 overflow-hidden rounded-xl border border-amber-300/90 bg-white shadow-[0_8px_30px_-12px_rgba(202,138,4,0.22)] ring-1 ring-amber-200/60"
          aria-labelledby="partner-statusliste-monatlich-heading"
        >
          <header className="border-b border-amber-300/70 bg-gradient-to-r from-amber-100 via-[#fff8dc] to-amber-50/80 px-4 py-4 sm:px-6 sm:py-5">
            <h2 id="partner-statusliste-monatlich-heading" className="text-lg font-semibold text-amber-950 sm:text-xl">
              Statusliste Monatliche Tippgeberprovision
            </h2>
            <p className="mt-1 text-sm text-amber-950/80">
              Tipps zur <strong className="font-medium text-amber-950">betrieblichen Pflegeberatung</strong>. Über „Mein
              Archiv“ können Sie Einträge bei Bedarf ausblenden oder zurückholen.
            </p>
          </header>
          <div className="p-4 sm:p-6">
            <StatuslisteTable
              variant="monatlich"
              rows={monatlichRows}
              emptyHint="Keine Einträge."
              theadClass="bg-amber-50 text-amber-950"
            />
          </div>
        </section>

        <section
          id="partner-statusliste-einmal"
          className="scroll-mt-28 overflow-hidden rounded-xl border border-emerald-300/80 bg-white shadow-[0_8px_30px_-12px_rgba(16,185,129,0.18)] ring-1 ring-emerald-200/50"
          aria-labelledby="partner-statusliste-einmal-heading"
        >
          <header className="border-b border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-[#ecfdf5] to-green-50/90 px-4 py-4 sm:px-6 sm:py-5">
            <h2 id="partner-statusliste-einmal-heading" className="text-lg font-semibold text-emerald-900 sm:text-xl">
              Statusliste Einmalprovision
            </h2>
            <p className="mt-1 text-sm text-emerald-900/85">
              Tipps zu <strong className="font-medium text-emerald-950">Hauswirtschaft & Betreuung</strong>,{" "}
              <strong className="font-medium text-emerald-950">Pflegehilfsmittel</strong> und{" "}
              <strong className="font-medium text-emerald-950">Pflegeberatung</strong>.
            </p>
          </header>
          <div className="p-4 sm:p-6">
            <StatuslisteTable
              variant="einmal"
              rows={einmalRows}
              emptyHint="Keine Einträge."
              theadClass="bg-emerald-50 text-emerald-900"
            />
          </div>
        </section>

        <section
          id="partner-statusliste-archiv"
          className="scroll-mt-28 overflow-hidden rounded-xl border border-[#0F4F68]/45 bg-white shadow-[0_8px_30px_-12px_rgba(15,79,104,0.25)] ring-1 ring-[#0F4F68]/15"
          aria-labelledby="partner-statusliste-archiv-heading"
        >
          <header className="border-b border-[#0c3d52] bg-[#0F4F68] px-4 py-4 sm:px-6 sm:py-5">
            <h2 id="partner-statusliste-archiv-heading" className="text-lg font-semibold text-white sm:text-xl">
              Statusliste Archiv
            </h2>
            <p className="mt-1 text-sm text-white/85">
              Von Ihnen abgelegte Fälle aus beiden Provisionslisten — ohne Einfluss auf Provision oder Auszahlung.
            </p>
          </header>
          <div className="p-4 sm:p-6">
            <StatuslisteTable
              variant="archiv"
              rows={archivedRows}
              emptyHint="Keine archivierten Einträge."
              theadClass="bg-[#e8f2f6] text-[#0F4F68]"
            />
          </div>
        </section>
      </div>

      <PartnerTipModal open={tipOpen} onClose={closeTipModal} allowedSlugs={allowedSlugs} />
    </div>
  );
}

type StatuslisteVariant = "monatlich" | "einmal" | "archiv";

type StatuslisteRow = {
  id: string;
  tipId: string;
  isArchived: boolean;
  typ: string;
  typeClass: string;
  typCellClass: string;
  vorname: string;
  nachname: string;
  firma: string;
  datum: string;
  pill: { label: string; className: string };
  adminNote: string;
  betrag: string;
};

function StatuslisteTable({
  variant,
  rows,
  emptyHint,
  theadClass,
}: {
  variant: StatuslisteVariant;
  rows: StatuslisteRow[];
  emptyHint: string;
  theadClass: string;
}) {
  const showFirma = variant !== "einmal";
  const colCount = showFirma ? 9 : 8;

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200/90">
      <table className="min-w-[64rem] w-full text-left text-sm">
        <thead>
          <tr className={`border-b border-neutral-200 text-xs font-semibold uppercase ${theadClass}`}>
            <th className="whitespace-nowrap px-3 py-3 sm:px-4">Vorname</th>
            <th className="whitespace-nowrap px-3 py-3 sm:px-4">Nachname</th>
            {showFirma ? <th className="whitespace-nowrap px-3 py-3 sm:px-4">Firma</th> : null}
            <th className="whitespace-nowrap px-3 py-3 sm:px-4">Datum</th>
            <th className="whitespace-nowrap px-3 py-3 sm:px-4">Status</th>
            <th className="whitespace-nowrap px-3 py-3 sm:px-4">Betrag</th>
            <th className="min-w-[8rem] px-3 py-3 sm:px-4">Notiz</th>
            <th className="whitespace-nowrap px-3 py-3 sm:px-4">Mein Archiv</th>
            <th className="whitespace-nowrap px-3 py-3 sm:px-4">Typ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="px-4 py-12 text-center text-neutral-600">
                {emptyHint}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="bg-white hover:bg-neutral-50/80">
                <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.vorname}</td>
                <td className="whitespace-nowrap px-3 py-3 text-neutral-900 sm:px-4">{r.nachname}</td>
                {showFirma ? (
                  <td className="max-w-[12rem] truncate px-3 py-3 text-neutral-800 sm:max-w-[14rem] sm:px-4">
                    {r.firma || "—"}
                  </td>
                ) : null}
                <td className="whitespace-nowrap px-3 py-3 text-neutral-800 sm:px-4">{r.datum}</td>
                <td className="px-3 py-3 sm:px-4">
                  <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-medium ${r.pill.className}`}>
                    {r.pill.label}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-neutral-900 sm:px-4">{r.betrag}</td>
                <td className="max-w-[14rem] px-3 py-3 align-top text-neutral-800 sm:px-4">
                  <PartnerNoteDetails tipId={r.tipId} note={r.adminNote} />
                </td>
                <td className="px-3 py-3 align-top sm:px-4">
                  <PartnerOwnArchiveTipButton tipId={r.tipId} isArchived={r.isArchived} />
                </td>
                <td className={`px-3 py-3 sm:px-4 ${r.typCellClass}`}>
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
  );
}
