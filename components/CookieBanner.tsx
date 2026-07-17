"use client";

/**
 * Consent-Banner nach DSGVO/TDDDG-Grundsätzen umgesetzt. Finale rechtliche Prüfung der
 * konkreten Dienste, Anbieter, Speicherdauern und Datenschutztexte muss durch den
 * Websitebetreiber bzw. Datenschutzbeauftragten erfolgen.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  consentNeedsBanner,
  getConsent,
  revokeOptionalConsent,
  setConsent,
  type ConsentState,
} from "@/lib/consent";
import { cn } from "@/lib/utils";
import { GtmMailtoLink, GtmPhoneLink } from "@/components/analytics/GtmContactIntentLink";

type Layer = "main" | "settings";

const DEFAULT_OPTIONAL: Omit<ConsentState, "necessary" | "timestamp"> = {
  analytics: false,
  marketing: false,
  translation: false,
};

function buildState(optional: typeof DEFAULT_OPTIONAL): ConsentState {
  return {
    necessary: true,
    ...optional,
    timestamp: Date.now(),
  };
}

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState<Layer>("main");
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [translation, setTranslation] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const syncTogglesFromConsent = useCallback(() => {
    const s = getConsent();
    if (s) {
      setStatistics(s.analytics);
      setMarketing(s.marketing);
      setTranslation(s.translation);
    } else {
      setStatistics(false);
      setMarketing(false);
      setTranslation(false);
    }
  }, []);

  useEffect(() => {
    if (consentNeedsBanner()) {
      setVisible(true);
      setLayer("main");
      syncTogglesFromConsent();
    }
  }, [syncTogglesFromConsent]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ view?: "main" | "settings" }>;
      syncTogglesFromConsent();
      setLayer(ce.detail?.view === "settings" ? "settings" : "main");
      setVisible(true);
    };
    window.addEventListener("cookie-banner-show", handler);
    return () => window.removeEventListener("cookie-banner-show", handler);
  }, [syncTogglesFromConsent]);

  useEffect(() => {
    if (!visible) return;
    const prev =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (prev && dialogRef.current && !dialogRef.current.contains(prev)) {
      previouslyFocusedRef.current = prev;
    }
    const id = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [visible, layer]);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || !dialogRef.current) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleRejectAllRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const root = dialogRef.current;
      const list = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href]:not([aria-hidden="true"]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [visible, layer]);

  const handleRejectAllRef = useRef<(() => void) | null>(null);

  const persist = useCallback((next: ConsentState) => {
    const prev = getConsent();
    const restricts =
      (prev?.analytics === true && !next.analytics) ||
      (prev?.translation === true && !next.translation) ||
      (prev?.marketing === true && !next.marketing);
    if (restricts || (!prev && !next.analytics && !next.translation && !next.marketing)) {
      revokeOptionalConsent();
    }

    setConsent(next);
    window.dispatchEvent(new CustomEvent("ahs-consent-updated"));
    setVisible(false);
    setLayer("main");

    if (prev?.translation && !next.translation) {
      window.location.reload();
    }
  }, []);

  const handleRejectAll = useCallback(() => {
    persist(buildState({ ...DEFAULT_OPTIONAL }));
  }, [persist]);

  handleRejectAllRef.current = handleRejectAll;

  const handleAcceptAll = useCallback(() => {
    persist(
      buildState({
        analytics: true,
        marketing: true,
        translation: true,
      }),
    );
  }, [persist]);

  const handleSaveSelection = useCallback(() => {
    persist(
      buildState({
        analytics: statistics,
        marketing,
        translation,
      }),
    );
  }, [statistics, marketing, translation, persist]);

  const openSettings = useCallback(() => setLayer("settings"), []);
  const backToMain = useCallback(() => setLayer("main"), []);

  if (!mounted || typeof document === "undefined") return null;
  if (!visible) return null;

  const buttonBase =
    "inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-[#0F4F68] bg-white px-3 text-sm font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-0 sm:px-4";

  /** Gleicher Rahmen wie buttonBase; nur Füllfarbe und Hover leicht orange (Marke). */
  const buttonAccept = cn(
    "inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-[#0F4F68] bg-[#FFF1E0] px-3 text-sm font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#ffe8cf] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-0 sm:px-4",
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-[#0F4F68]/40 p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          "flex max-h-[min(92dvh,720px)] w-full max-w-[min(100vw,760px)] flex-col overflow-hidden rounded-t-2xl border border-[#0F4F68]/12 bg-white shadow-[0_24px_64px_rgba(15,79,104,0.2)] sm:rounded-2xl",
        )}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-7">
          {layer === "main" ? (
            <>
              <h2 id={titleId} className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Datenschutzeinstellungen
              </h2>
              <p id={descId} className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
                Wir verwenden notwendige Technologien, damit unsere Website zuverlässig funktioniert. Mit Ihrer
                Einwilligung nutzen wir außerdem optionale Dienste für Statistik, Übersetzung und Marketing. Sie können
                selbst entscheiden, welchen Kategorien Sie zustimmen. Ihre Auswahl können Sie jederzeit über
                „Cookie-Einstellungen“ im Footer ändern.
              </p>
              <p className="mt-3 text-sm text-neutral-600">
                <Link
                  href="/datenschutz"
                  className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                >
                  Datenschutzerklärung
                </Link>
                {" · "}
                <Link
                  href="/impressum"
                  className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                >
                  Impressum
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 id={titleId} className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                Cookie-Einstellungen anpassen
              </h2>
              <p id={descId} className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
                Hier können Sie festlegen, welche optionalen Dienste wir verwenden dürfen. Notwendige Technologien sind
                für den Betrieb der Website erforderlich und können nicht deaktiviert werden.
              </p>
              <div className="mt-5 space-y-3">
                <CategoryCard
                  title="Notwendig"
                  badge="Immer aktiv"
                  checked
                  disabled
                  onChange={() => undefined}
                  summary="Diese Technologien sind erforderlich, damit die Website funktioniert, Ihre Datenschutzauswahl gespeichert wird und grundlegende Sicherheits- und Komfortfunktionen bereitstehen."
                  details={{
                    services: "Speicherung der Consent-Auswahl (localStorage, technisch notwendiges Cookie), Sitzungs- und Sicherheitsfunktionen der Next.js-Anwendung.",
                    legal: "§ 25 Abs. 2 TDDDG / berechtigtes Interesse Art. 6 Abs. 1 lit. f DSGVO, soweit erforderlich.",
                  }}
                />
                <CategoryCard
                  title="Statistik"
                  checked={statistics}
                  onChange={setStatistics}
                  summary="Hilft uns zu verstehen, wie unsere Website genutzt wird, damit wir Inhalte und Bedienbarkeit verbessern können. Statistik-Dienste werden erst nach Ihrer Zustimmung aktiviert."
                  details={{
                    services: "Google Analytics 4 (page_view, anonymisierte IP); serverseitige aggregierte Seitenstatistik (Supabase, keine personenbezogenen Profile).",
                    provider: "Google Ireland Ltd. / eigene Systeme (Supabase EU).",
                    legal: "Einwilligung Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.",
                    thirdCountry: "Bei Google: Datenübermittlung in die USA möglich (Angemessenheitsbeschluss EU-US Data Privacy Framework).",
                    moreInfo: "https://policies.google.com/privacy",
                  }}
                />
                <CategoryCard
                  title="Übersetzung"
                  checked={translation}
                  onChange={setTranslation}
                  summary='Ermöglicht Übersetzungsfunktionen auf der Website und kann dabei Dienste wie Google Translate bzw. das Cookie „googtrans“ verwenden. Diese Funktion wird erst nach Ihrer Zustimmung aktiviert.'
                  details={{
                    services: "Google Website Translator (Skript translate.google.com), ggf. Cookie „googtrans“; englische Inhalte und lokale Übersetzungs-Hilfen.",
                    provider: "Google Ireland Ltd.",
                    legal: "Einwilligung Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.",
                    thirdCountry: "Übermittlung in die USA möglich.",
                    moreInfo: "https://policies.google.com/privacy",
                  }}
                />
                <CategoryCard
                  title="Marketing"
                  checked={marketing}
                  onChange={setMarketing}
                  summary="Ermöglicht Marketing-, Kampagnenmessungs- oder externe Medienfunktionen. Diese Dienste werden erst nach Ihrer Zustimmung aktiviert."
                  details={{
                    services:
                      "Meta Pixel (Facebook/Instagram, Datensatz-ID für PageView-Kampagnenmessung); Google Consent Mode (ad_storage). Keine Formulardaten oder Advanced Matching.",
                    provider: "Meta Platforms Ireland Ltd.",
                    legal: "Einwilligung Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG.",
                    thirdCountry: "Datenübermittlung in die USA möglich (Meta Data Transfer Framework).",
                    moreInfo: "https://www.facebook.com/privacy/policy/",
                  }}
                />
              </div>
            </>
          )}
        </div>

        <footer className="shrink-0 border-t border-[#0F4F68]/10 bg-[#F8FBFC] px-4 py-4 sm:px-8">
          {layer === "main" ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:justify-stretch sm:gap-3">
              <button type="button" className={buttonBase} onClick={handleRejectAll}>
                Alle ablehnen
              </button>
              <button type="button" className={buttonAccept} onClick={handleAcceptAll}>
                Alle akzeptieren
              </button>
              <button type="button" className={buttonBase} onClick={openSettings}>
                Auswahl anpassen
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-nowrap sm:justify-stretch sm:gap-3">
              <button type="button" className={buttonBase} onClick={handleRejectAll}>
                Alle ablehnen
              </button>
              <button type="button" className={buttonAccept} onClick={handleAcceptAll}>
                Alle akzeptieren
              </button>
              <button type="button" className={buttonBase} onClick={handleSaveSelection}>
                Auswahl speichern
              </button>
            </div>
          )}
          <p className="mt-3 text-center text-[11px] leading-snug text-neutral-500 sm:text-xs">
            Verantwortlich: Valentin Maucher und Philip Sonntag GbR, Alltagshilfe Süd · Hinter den Gärten 10, 87730 Bad
            Grönenbach ·{" "}
            <GtmPhoneLink
              href="tel:+4983349893330"
              sourceComponent="cookie_banner_footer_tel"
              className="underline hover:no-underline"
            >
              08334 / 9893330
            </GtmPhoneLink>
            ·{" "}
            <GtmMailtoLink
              href="mailto:info@alltagshilfe-sued.de"
              sourceComponent="cookie_banner_footer_email"
              className="underline hover:no-underline"
            >
              info@alltagshilfe-sued.de
            </GtmMailtoLink>
          </p>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

type CategoryDetails = {
  services?: string;
  provider?: string;
  legal?: string;
  thirdCountry?: string;
  moreInfo?: string;
};

type CategoryCardProps = {
  title: string;
  summary: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  badge?: string;
  details?: CategoryDetails;
};

function CategoryCard({ title, summary, checked, onChange, disabled, badge, details }: CategoryCardProps) {
  const switchId = useId();
  return (
    <div className="rounded-xl border border-[#0F4F68]/12 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[#0F4F68] sm:text-base">{title}</h3>
            {badge ? (
              <span className="rounded-full bg-[#0F4F68] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 sm:text-sm">{summary}</p>
          {details ? (
            <details className="mt-2 text-xs text-neutral-600 sm:text-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">Details</summary>
              <dl className="mt-2 space-y-1.5 border-t border-neutral-200/80 pt-2">
                {details.services ? (
                  <>
                    <dt className="font-semibold text-neutral-800">Dienste</dt>
                    <dd>{details.services}</dd>
                  </>
                ) : null}
                {details.provider ? (
                  <>
                    <dt className="mt-1 font-semibold text-neutral-800">Anbieter</dt>
                    <dd>{details.provider}</dd>
                  </>
                ) : null}
                {details.legal ? (
                  <>
                    <dt className="mt-1 font-semibold text-neutral-800">Rechtsgrundlage</dt>
                    <dd>{details.legal}</dd>
                  </>
                ) : null}
                {details.thirdCountry ? (
                  <>
                    <dt className="mt-1 font-semibold text-neutral-800">Drittland</dt>
                    <dd>{details.thirdCountry}</dd>
                  </>
                ) : null}
                {details.moreInfo ? (
                  <>
                    <dt className="mt-1 font-semibold text-neutral-800">Datenschutzhinweis</dt>
                    <dd>
                      <a
                        href={details.moreInfo}
                        className="break-all font-medium text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {details.moreInfo}
                      </a>
                    </dd>
                  </>
                ) : null}
              </dl>
            </details>
          ) : null}
        </div>
        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            "relative mt-0.5 inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
            checked ? "bg-[#0F4F68]" : "bg-neutral-300",
            disabled && "cursor-not-allowed opacity-80",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "inline-block h-6 w-6 rounded-full bg-white shadow transition-transform",
              checked ? "translate-x-[1.35rem]" : "translate-x-0.5",
            )}
          />
          <span className="sr-only">
            {disabled ? `${title}, immer aktiv` : `${title}, ${checked ? "aktiviert" : "deaktiviert"}`}
          </span>
        </button>
      </div>
    </div>
  );
}
