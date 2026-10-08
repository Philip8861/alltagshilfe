"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PartnerAnimatedEuro } from "@/components/partner/PartnerAnimatedEuro";
import { PartnerAvatar } from "@/components/partner/PartnerAvatar";
import { PartnerStatuslisteTable } from "@/components/partner/PartnerStatuslisteTable";
import { PartnerTipModal } from "@/components/partner/PartnerTipModal";
import {
  mapTipsToStatuslisteRows,
  type PartnerPortalPreferences,
} from "@/lib/partner/portal-preferences";
import {
  partnerHasBetrieblicheProgram,
  partnerHasEinmalProvisionProgram,
} from "@/lib/partner/partner-program-capabilities";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import { formatCentsDe, PARTNER_DIRECT_REFERRAL_RATE_LABEL } from "@/lib/partner/referral-money";
import { formatPayoutPeriodLabelDe } from "@/lib/partner/payout-period";

type Props = {
  welcomeLine: string;
  partnerCode: string | null;
  avatarUrl?: string | null;
  payoutLabel: string;
  responsibilityAreaSlugs: string[];
  tips: PartnerDashboardTipSerial[];
  initialTipModalOpen: boolean;
  provisionEinmalEur: number;
  portalPreferences: PartnerPortalPreferences;
  /** Öffentliche Vorschau: kein Tipp-Modal, Archiv-Buttons deaktiviert. */
  demoMode?: boolean;
  /** Cent-basierte Monatsabrechnung (eigene + geworbene Partner) für die Betriebs-Provision. */
  payoutSummary?: {
    periodKey: string;
    ownCents: number;
    referralCents: number;
    totalCents: number;
  };
};

const slugSet = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);

const iconWrap =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dceff3] shadow-[0_3px_8px_rgba(15,79,104,0.08)] text-[#0F4F68]";

export function PartnerDashboardClient({
  welcomeLine,
  partnerCode,
  avatarUrl,
  payoutLabel,
  responsibilityAreaSlugs,
  tips,
  initialTipModalOpen,
  provisionEinmalEur,
  portalPreferences: prefs,
  demoMode = false,
  payoutSummary,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [tipOpen, setTipOpen] = useState(initialTipModalOpen);
  const [copyFeedback, setCopyFeedback] = useState("");

  useEffect(() => {
    setTipOpen(initialTipModalOpen);
  }, [initialTipModalOpen]);

  const allowedSlugs = useMemo(() => {
    return responsibilityAreaSlugs.filter((s): s is PartnerResponsibilitySlug => slugSet.has(s));
  }, [responsibilityAreaSlugs]);

  const hasBetriebliche = useMemo(
    () => partnerHasBetrieblicheProgram(responsibilityAreaSlugs),
    [responsibilityAreaSlugs],
  );
  const hasEinmal = useMemo(
    () => partnerHasEinmalProvisionProgram(responsibilityAreaSlugs),
    [responsibilityAreaSlugs],
  );

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
    "partner-metric-card partner-dash-animate flex min-h-[7.5rem] flex-1 flex-col justify-center gap-2 rounded-[1.5rem] border border-[#cce1e8] bg-gradient-to-br from-white to-[#f0f8fa] p-5 shadow-[0_7px_20px_-9px_rgba(15,79,104,0.24)] sm:min-w-[12rem]";

  const anyListOnDashboard =
    (hasBetriebliche && prefs.showListMonatlich) ||
    (hasEinmal && prefs.showListEinmal) ||
    prefs.showArchivOnDashboard;

  return (
    <div className="mx-auto w-full max-w-[min(100%,90rem)] space-y-6">
      <header className="flex flex-col gap-5 rounded-[1.75rem] border border-[#c9e5eb] bg-gradient-to-br from-[#e2f3f5] via-[#f0f8f9] to-[#e9f2f7] px-5 py-6 shadow-[0_10px_25px_-10px_rgba(15,79,104,0.25),0_3px_8px_rgba(15,79,104,0.06)] sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-7">
        <div className="partner-dash-animate flex min-w-0 items-start gap-4 sm:items-center">
          <PartnerAvatar
            avatarUrl={avatarUrl}
            partnerCode={partnerCode}
            displayName={welcomeLine}
            size="xl"
            ring
            alt=""
            className="hidden sm:flex"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-3 sm:block">
              <PartnerAvatar
                avatarUrl={avatarUrl}
                partnerCode={partnerCode}
                displayName={welcomeLine}
                size="lg"
                ring
                alt=""
                className="sm:hidden"
              />
              <h1 className="text-2xl font-semibold leading-snug text-[#0F4F68] sm:text-3xl">
                {welcomeLine}
              </h1>
            </div>
          <p className="mt-2 text-sm leading-6 text-[#637782]">
            {demoMode ? "Demoansicht mit Beispieldaten — so sieht Max Mustermann die Übersicht." : "Ihre Vermittlungen und Provisionen auf einen Blick."}
          </p>
          </div>
        </div>
        {demoMode ? (
          <Link
            href="/partner/login"
            data-tutorial="partner-tipp-geben"
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#17647d] to-[#0F4F68] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_15px_rgba(15,79,104,0.22)] transition-colors hover:bg-[#0c3d52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68] sm:w-auto"
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
        ) : allowedSlugs.length > 0 ? (
          <button
            type="button"
            data-tutorial="partner-tipp-geben"
            onClick={() => setTipOpen(true)}
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#17647d] to-[#0F4F68] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_15px_rgba(15,79,104,0.22)] transition-colors hover:bg-[#0c3d52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68] sm:w-auto"
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
            Neuen Tipp geben
          </button>
        ) : (
          <p className="partner-dash-animate partner-dash-delay-2 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-right">
            Für die Tippabgabe sind aktuell keine Leistungsbereiche freigeschaltet. Bitte wenden Sie sich an die
            Geschäftsstelle, wenn sich das ändern soll.
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <p className="text-xs font-semibold text-[#637782]">Ihr Partner-Code</p>
              <p
                className="mt-1 select-all text-2xl font-semibold tabular-nums tracking-wide text-[#0F4F68]"
              >
                {partnerCode ?? "—"}
              </p>
              {partnerCode ? <button type="button" onClick={async () => {
                try { await navigator.clipboard.writeText(partnerCode); setCopyFeedback("Partner-Code kopiert."); }
                catch { setCopyFeedback("Bitte den Code markieren und kopieren."); }
              }} className="-mb-2 inline-flex min-h-11 items-center text-xs font-semibold text-[#0F4F68] underline-offset-4 hover:underline">Code kopieren <span aria-hidden className="ml-2">⧉</span></button> : null}
              {copyFeedback ? <p role="status" className="text-xs text-[#526d79]">{copyFeedback}</p> : null}
            </div>
          </div>
        </div>

        <div className={`${cardBase} partner-dash-delay-2 relative z-[1]`}>
          <div className="flex items-start gap-4">
            <div className={`${iconWrap}`} aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#637782]">Nächste Auszahlung</p>
              <p className="mt-1 text-xl font-semibold tabular-nums text-[#0F4F68] sm:text-2xl">
                am {payoutLabel}
              </p>
              <p className="mt-0.5 text-xs text-neutral-600">Am 3. jedes Monats</p>
            </div>
          </div>
        </div>
      </div>

      {hasBetriebliche || hasEinmal ? (
        <div
          className={`grid grid-cols-1 gap-4 ${hasBetriebliche && hasEinmal ? "lg:grid-cols-2" : ""}`}
        >
          {hasBetriebliche && payoutSummary ? (
            <section
              aria-label="Eigene Abschlussprovision und Provision durch geworbene Partner"
              data-tutorial="partner-provision-betrieblich"
              className="rounded-[1.5rem] border border-[#cfe3e5] bg-white p-5 shadow-[0_8px_22px_-10px_rgba(15,79,104,0.23)] sm:p-6"
            >
              <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold text-[#0F4F68] sm:text-lg">
                  Betriebliche Pflegeberatung
                </h2>
                <span className="text-xs font-medium text-neutral-600">
                  {formatPayoutPeriodLabelDe(payoutSummary.periodKey)}
                </span>
              </header>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <article
                  className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-[#f6fcf8] p-4 shadow-[0_4px_12px_-6px_rgba(16,185,129,0.2)]"
                  aria-label="Eigene Abschlussprovision"
                >
                  <p className="text-xs font-semibold text-[#52736a]">
                    Eigene Abschlussprovision
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-emerald-900 sm:text-3xl">
                    {formatCentsDe(payoutSummary.ownCents)}
                  </p>
                  <p className="mt-1 text-xs text-emerald-900/80">
                    Freigegebene Abschlüsse betrieblicher Pflegeberatung
                  </p>
                </article>
                <article
                  className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 to-[#f4faff] p-4 shadow-[0_4px_12px_-6px_rgba(14,165,233,0.2)]"
                  aria-label="Provision durch geworbene Partner"
                >
                  <p className="text-xs font-semibold text-[#587381]">
                    Provision durch geworbene Partner
                  </p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-sky-900 sm:text-3xl">
                    {formatCentsDe(payoutSummary.referralCents)}
                  </p>
                  <p className="mt-1 text-xs text-sky-900/80">
                    {PARTNER_DIRECT_REFERRAL_RATE_LABEL.replace(" ", "\u00a0")} auf Gesamtumsatz direkt geworbener Partner
                  </p>
                </article>
              </div>
              <p className="mt-3 border-t border-[#0F4F68]/10 pt-3 text-sm text-neutral-700">
                Auszahlungssumme (betrieblich):{" "}
                <span className="font-semibold tabular-nums text-[#0F4F68]">
                  {formatCentsDe(payoutSummary.totalCents)}
                </span>
              </p>
            </section>
          ) : null}

          {hasEinmal ? (
            <div
              className={`${cardBase} partner-dash-delay-3 relative z-[1] min-h-0 !border-emerald-200/80 !bg-gradient-to-br !from-emerald-50 !to-white`}
              data-tutorial="partner-provision-einmal"
            >
              <div className="flex items-start gap-4">
                <div className={`${iconWrap}`} aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <path d="M7 10h4M7 14h10" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#637782]">Einmalprovision</p>
                  <p className="mt-1 text-2xl font-semibold text-[#0F4F68] sm:text-3xl">
                    <PartnerAnimatedEuro value={provisionEinmalEur} durationMs={1750} />
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-600">
                    {provisionEinmalEur > 0
                      ? "Pflegehilfsmittel, Hauswirtschaft & Betreuung, Pflegeberatung"
                      : "Noch keine bestätigte Einmalprovision"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

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
        className="partner-dash-animate partner-dash-delay-5 scroll-mt-28 space-y-6"
      >
        {anyListOnDashboard ? <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 className="text-xl font-semibold tracking-tight text-[#183a49]">Ihre Vermittlungen</h2><p className="mt-1 text-sm text-[#637782]">Bearbeitungsstand und Abschlüsse im Überblick.</p></div>
          <p className="text-xs text-[#637782]"><strong className="font-semibold text-[#315363]">{visiblePartnerTips.length}</strong> in Ihren Listen <span className="mx-2" aria-hidden>·</span><strong className="font-semibold text-[#315363]">{visiblePartnerTips.filter((tip) => tip.admin_status === "vertragsabschluss_erfolgreich").length}</strong> erfolgreich</p>
        </div> : null}
        {hasBetriebliche && prefs.showListMonatlich ? (
          <section
            id="partner-statusliste-monatlich"
            data-tutorial="partner-statusliste-monatlich"
            className="scroll-mt-28 overflow-hidden rounded-[1.5rem] border border-amber-200 bg-white shadow-[0_9px_24px_-11px_rgba(202,138,4,0.25)]"
            aria-labelledby="partner-statusliste-monatlich-heading"
          >
            <header className="border-b border-amber-200 bg-gradient-to-r from-[#fff0c6] via-[#fff6de] to-[#fffaf0] px-5 py-5 shadow-[0_3px_10px_-5px_rgba(202,138,4,0.25)] sm:px-6">
              <h2 id="partner-statusliste-monatlich-heading" className="text-lg font-semibold text-[#725317]">
                Betriebliche Pflegeberatung
              </h2>
            </header>
            <div className="p-4 sm:p-6">
              <PartnerStatuslisteTable
                variant="monatlich"
                rows={monatlichRows}
                emptyHint="Noch keine Vermittlungen in dieser Liste. Sobald Sie einen Tipp abgeben, sehen Sie hier den Bearbeitungsstand."
                theadClass="bg-[#f6f8fa] text-[#637782]"
                columns={prefs.columns}
                demoMode={demoMode}
              />
            </div>
          </section>
        ) : null}

        {hasEinmal && prefs.showListEinmal ? (
          <section
            id="partner-statusliste-einmal"
            data-tutorial="partner-statusliste-einmal"
            className="scroll-mt-28 overflow-hidden rounded-[1.5rem] border border-emerald-200 bg-white shadow-[0_9px_24px_-11px_rgba(16,140,108,0.22)]"
            aria-labelledby="partner-statusliste-einmal-heading"
          >
            <header className="border-b border-emerald-200 bg-gradient-to-r from-[#ddf4e9] via-[#ebf9f2] to-[#f4fcf7] px-5 py-5 shadow-[0_3px_10px_-5px_rgba(16,140,108,0.22)] sm:px-6">
              <h2 id="partner-statusliste-einmal-heading" className="text-lg font-semibold text-[#245b46]">
                Einmalprovisionen
              </h2>
            </header>
            <div className="p-4 sm:p-6">
              <PartnerStatuslisteTable
                variant="einmal"
                rows={einmalRows}
                emptyHint="Noch keine Vermittlungen in dieser Liste. Sobald Sie einen Tipp abgeben, sehen Sie hier den Bearbeitungsstand."
                theadClass="bg-[#f6f8fa] text-[#637782]"
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
            className="scroll-mt-28 overflow-hidden rounded-[1.5rem] border border-[#c7dfe7] bg-white shadow-[0_9px_24px_-11px_rgba(15,79,104,0.24)]"
            aria-labelledby="partner-statusliste-archiv-heading"
          >
            <header className="border-b border-[#c7dfe7] bg-gradient-to-r from-[#dceef3] via-[#eaf5f8] to-[#f3f9fb] px-5 py-5 shadow-[0_3px_10px_-5px_rgba(15,79,104,0.24)] sm:px-6">
              <h2 id="partner-statusliste-archiv-heading" className="text-lg font-semibold text-[#0F4F68]">
                Ihr Archiv
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#637782]">
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
                theadClass="bg-[#f6f8fa] text-[#637782]"
                columns={prefs.columns}
                demoMode={demoMode}
              />
            </div>
          </section>
        ) : null}
      </div>

      {demoMode ? null : allowedSlugs.length > 0 ? (
        <PartnerTipModal open={tipOpen} onClose={closeTipModal} allowedSlugs={allowedSlugs} />
      ) : null}
    </div>
  );
}
