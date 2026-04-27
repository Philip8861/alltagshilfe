"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PartnerAnimatedEuro } from "@/components/partner/PartnerAnimatedEuro";
import { PartnerStatuslisteTable } from "@/components/partner/PartnerStatuslisteTable";
import { PartnerTipModal } from "@/components/partner/PartnerTipModal";
import {
  mapTipsToStatuslisteRows,
  type PartnerPortalPreferences,
} from "@/lib/partner/portal-preferences";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";

type Props = {
  welcomeLine: string;
  partnerCode: string | null;
  payoutLabel: string;
  responsibilityAreaSlugs: string[];
  tips: PartnerDashboardTipSerial[];
  initialTipModalOpen: boolean;
  provisionMonatlichEur: number;
  provisionEinmalEur: number;
  portalPreferences: PartnerPortalPreferences;
  /** Öffentliche Vorschau: kein Tipp-Modal, Archiv-Buttons deaktiviert. */
  demoMode?: boolean;
};

const slugSet = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);

const iconWrap =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0F4F68]/10 text-[#0F4F68]";

export function PartnerDashboardClient({
  welcomeLine,
  partnerCode,
  payoutLabel,
  responsibilityAreaSlugs,
  tips,
  initialTipModalOpen,
  provisionMonatlichEur,
  provisionEinmalEur,
  portalPreferences: prefs,
  demoMode = false,
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

  const monatlichRows = useMemo(() => mapTipsToStatuslisteRows(activeMonatlichTips), [activeMonatlichTips]);
  const einmalRows = useMemo(() => mapTipsToStatuslisteRows(activeEinmalTips), [activeEinmalTips]);
  const archivedRows = useMemo(() => mapTipsToStatuslisteRows(partnerArchivedTips), [partnerArchivedTips]);

  const closeTipModal = () => {
    setTipOpen(false);
    if (demoMode) return;
    if (typeof window !== "undefined" && window.location.search.includes("tip=1")) {
      router.replace(pathname || "/partner/dashboard");
    }
  };

  const cardBase =
    "partner-metric-card partner-dash-animate flex min-h-[7.5rem] flex-1 flex-col justify-center gap-2 rounded-lg border border-neutral-300 bg-white p-5 sm:min-w-[12rem]";

  const anyListOnDashboard =
    prefs.showListMonatlich || prefs.showListEinmal || prefs.showArchivOnDashboard;

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
            {demoMode ? "Demoansicht mit Beispieldaten — so sieht Max Mustermann die Übersicht." : "Dein persönliches Partnerportal-Dashboard."}
          </p>
        </div>
        {demoMode ? (
          <Link
            href="/partner/login"
            data-tutorial="partner-tipp-geben"
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
            Tipp geben (nach Login)
          </Link>
        ) : (
          <button
            type="button"
            data-tutorial="partner-tipp-geben"
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
        )}
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`${cardBase} partner-dash-delay-1 relative z-[1]`} data-tutorial="partner-code">
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

        <div className={`${cardBase} partner-dash-delay-2 relative z-[1]`} data-tutorial="partner-provision-monatlich">
          <div className="flex items-start gap-4">
            <div className={`${iconWrap} motion-safe:animate-partner-soft-float`} aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18V10" strokeLinecap="round" />
                <path d="M12 18V6" strokeLinecap="round" />
                <path d="M18 18v-8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase text-[#0F4F68]">
                Monatliche Tippgeberprovision
              </p>
              <p className="mt-1 text-2xl font-semibold text-[#0F4F68] sm:text-3xl">
                <PartnerAnimatedEuro value={provisionMonatlichEur} durationMs={1600} />
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">
                {provisionMonatlichEur > 0
                  ? "Summe Monatsprovisionen (betriebliche Pflegeberatung, vertraglich erfasst)"
                  : "Noch keine Monatsprovision erfasst"}
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardBase} partner-dash-delay-3 relative z-[1]`} data-tutorial="partner-provision-einmal">
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

      {!anyListOnDashboard ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          Sie haben alle Statuslisten auf der Übersicht ausgeblendet. Ändern Sie das unter{" "}
          <Link href="/partner/einstellungen" className="font-semibold text-[#0F4F68] underline">
            Einstellungen
          </Link>
          . Ihr Archiv finden Sie dort ebenfalls.
        </p>
      ) : null}

      <div
        id="partner-statuslisten"
        className="partner-dash-animate partner-dash-delay-5 scroll-mt-28 space-y-6 sm:space-y-8"
      >
        {prefs.showListMonatlich ? (
          <section
            id="partner-statusliste-monatlich"
            data-tutorial="partner-statusliste-monatlich"
            className="scroll-mt-28 overflow-hidden rounded-xl border border-amber-300/90 bg-white shadow-[0_8px_30px_-12px_rgba(202,138,4,0.22)] ring-1 ring-amber-200/60"
            aria-labelledby="partner-statusliste-monatlich-heading"
          >
            <header className="border-b border-amber-300/70 bg-gradient-to-r from-amber-100 via-[#fff8dc] to-amber-50/80 px-4 py-4 sm:px-6 sm:py-5">
              <h2 id="partner-statusliste-monatlich-heading" className="text-lg font-semibold text-amber-950 sm:text-xl">
                Statusliste Monatliche Tippgeberprovision
              </h2>
            </header>
            <div className="p-4 sm:p-6">
              <PartnerStatuslisteTable
                variant="monatlich"
                rows={monatlichRows}
                emptyHint="Keine Einträge."
                theadClass="bg-amber-50 text-amber-950"
                columns={prefs.columns}
                demoMode={demoMode}
              />
            </div>
          </section>
        ) : null}

        {prefs.showListEinmal ? (
          <section
            id="partner-statusliste-einmal"
            data-tutorial="partner-statusliste-einmal"
            className="scroll-mt-28 overflow-hidden rounded-xl border border-emerald-300/80 bg-white shadow-[0_8px_30px_-12px_rgba(16,185,129,0.18)] ring-1 ring-emerald-200/50"
            aria-labelledby="partner-statusliste-einmal-heading"
          >
            <header className="border-b border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-[#ecfdf5] to-green-50/90 px-4 py-4 sm:px-6 sm:py-5">
              <h2 id="partner-statusliste-einmal-heading" className="text-lg font-semibold text-emerald-900 sm:text-xl">
                Statusliste Einmalprovision
              </h2>
            </header>
            <div className="p-4 sm:p-6">
              <PartnerStatuslisteTable
                variant="einmal"
                rows={einmalRows}
                emptyHint="Keine Einträge."
                theadClass="bg-emerald-50 text-emerald-900"
                columns={prefs.columns}
                demoMode={demoMode}
              />
            </div>
          </section>
        ) : null}

        {prefs.showArchivOnDashboard ? (
          <section
            id="partner-statusliste-archiv"
            data-tutorial="partner-statusliste-archiv"
            className="scroll-mt-28 overflow-hidden rounded-xl border border-[#0F4F68]/45 bg-white shadow-[0_8px_30px_-12px_rgba(15,79,104,0.25)] ring-1 ring-[#0F4F68]/15"
            aria-labelledby="partner-statusliste-archiv-heading"
          >
            <header className="border-b border-[#0c3d52] bg-[#0F4F68] px-4 py-4 sm:px-6 sm:py-5">
              <h2 id="partner-statusliste-archiv-heading" className="text-lg font-semibold text-white sm:text-xl">
                Statusliste Archiv
              </h2>
              <p className="mt-1 text-sm text-white/85">
                Von Ihnen abgelegte Fälle aus beiden Provisionslisten — ohne Einfluss auf Provision oder Auszahlung. Vollständige
                Übersicht auch unter{" "}
                <Link href="/partner/einstellungen/statuslisten#partner-archiv-section" className="font-semibold underline">
                  Einstellungen
                </Link>
                .
              </p>
            </header>
            <div className="p-4 sm:p-6">
              <PartnerStatuslisteTable
                variant="archiv"
                rows={archivedRows}
                emptyHint="Keine archivierten Einträge."
                theadClass="bg-[#e8f2f6] text-[#0F4F68]"
                columns={prefs.columns}
                demoMode={demoMode}
              />
            </div>
          </section>
        ) : null}
      </div>

      {demoMode ? null : <PartnerTipModal open={tipOpen} onClose={closeTipModal} allowedSlugs={allowedSlugs} />}
    </div>
  );
}
