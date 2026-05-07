"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getConsent, setConsent, type ConsentState } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * DSGVO/TTDSG-konformer Cookie-Hinweis als kompakte Leiste am unteren Bildschirmrand.
 *
 * - Keine Vorauswahl bei optionalen Kategorien (Checkboxen zunächst aus).
 * - „Alle akzeptieren“ und „Nur notwendige“ gleichberechtigt (gleiche Button-Höhe, klare Kontraste).
 * - Granulare Auswahl per Checkbox + „Auswahl speichern“.
 * - Widerruf jederzeit über „Cookie-Einstellungen“ im Footer (CustomEvent).
 */

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  translation: false,
  timestamp: 0,
};

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [translation, setTranslation] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = getConsent();
    if (!stored) {
      setVisible(true);
      return;
    }
    setAnalytics(stored.analytics);
    setMarketing(stored.marketing);
    setTranslation(stored.translation);
  }, []);

  useEffect(() => {
    const handler = () => {
      const s = getConsent();
      if (s) {
        setAnalytics(s.analytics);
        setMarketing(s.marketing);
        setTranslation(s.translation);
      } else {
        setAnalytics(false);
        setMarketing(false);
        setTranslation(false);
      }
      setVisible(true);
    };
    window.addEventListener("cookie-banner-show", handler);
    return () => window.removeEventListener("cookie-banner-show", handler);
  }, []);

  /** Untere Leiste: Seiteninhalt bleibt scrollbar (kein Vollbild-Overlay). */

  const persist = useCallback((state: ConsentState) => {
    const prev = getConsent();
    setConsent(state);
    window.dispatchEvent(new CustomEvent("ahs-consent-updated"));
    setVisible(false);
    if (prev?.translation && !state.translation) {
      window.location.reload();
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    persist({
      necessary: true,
      analytics: true,
      marketing: true,
      translation: true,
      timestamp: Date.now(),
    });
  }, [persist]);

  const handleNecessaryOnly = useCallback(() => {
    persist({
      ...DEFAULT_CONSENT,
      timestamp: Date.now(),
    });
  }, [persist]);

  const handleSaveSelection = useCallback(() => {
    persist({
      necessary: true,
      analytics,
      marketing,
      translation,
      timestamp: Date.now(),
    });
  }, [analytics, marketing, persist, translation]);

  if (!visible || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <section
      role="region"
      aria-labelledby={titleId}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex justify-center px-2 pb-2 pt-1 sm:px-4 sm:pb-3"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Leiste: schmal, volle Breite, Inhalt begrenzt */}
      <div
        className={cn(
          "pointer-events-auto w-full max-w-6xl overflow-hidden rounded-t-2xl border border-[#0F4F68]/12",
          "bg-white shadow-[0_-8px_32px_rgba(15,79,104,0.14)]",
        )}
      >
        <div className="border-b border-[#0F4F68]/8 bg-[#F2F9FA]/90 px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-6">
            {/* Kopfzeile + Kurztext */}
            <div className="flex min-w-0 flex-1 gap-2.5 sm:gap-3">
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] text-white shadow-sm sm:h-10 sm:w-10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10c0-.55-.45-1-1-1a3 3 0 0 1-3-3a3 3 0 0 1 0-6c-1.66 0-6-.34-6 0Z" />
                  <circle cx="9" cy="10" r="1" />
                  <circle cx="14" cy="14" r="1" />
                  <circle cx="9" cy="16" r="1" />
                </svg>
              </span>
              <div className="min-w-0">
                <h2 id={titleId} className="text-sm font-bold leading-tight text-[#0F4F68] sm:text-base">
                  Cookies &amp; Einwilligung
                </h2>
                <p className="mt-1 text-xs leading-snug text-neutral-600 sm:text-sm">
                  Notwendige Speicherungen sind für den Betrieb erforderlich. Statistik, Übersetzung und Marketing sind
                  optional – per Kästchen wählen und speichern.{" "}
                  <Link
                    href="/datenschutz"
                    className="font-medium text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                  >
                    Datenschutz
                  </Link>
                  {" · "}
                  <Link href="/impressum" className="font-medium text-[#0F4F68] underline underline-offset-2 hover:no-underline">
                    Impressum
                  </Link>
                </p>
              </div>
            </div>

            {/* Checkboxen – kompakt, umbrechend */}
            <fieldset className="min-w-0 shrink-0 rounded-xl border border-[#0F4F68]/10 bg-white/80 px-2.5 py-2 sm:px-3 sm:py-2.5 lg:max-w-[min(100%,28rem)]">
              <legend className="sr-only">Cookie-Kategorien</legend>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-4">
                <ConsentCheckbox
                  id="cookie-necessary"
                  label="Notwendig"
                  title="Sitzung, Sicherheit, Speicherung dieser Auswahl – immer aktiv."
                  checked
                  disabled
                />
                <ConsentCheckbox
                  id="cookie-analytics"
                  label="Statistik"
                  title="Google Analytics 4 und anonyme Reichweitenmessung (Google Ireland Ltd.; USA möglich)."
                  checked={analytics}
                  onCheckedChange={setAnalytics}
                />
                <ConsentCheckbox
                  id="cookie-translation"
                  label="Übersetzung"
                  title="Google Website Translator / englische Seitenversion (Google Ireland Ltd.; USA möglich)."
                  checked={translation}
                  onCheckedChange={setTranslation}
                />
                <ConsentCheckbox
                  id="cookie-marketing"
                  label="Marketing"
                  title="Optional; derzeit keine Marketing-Cookies, technisch vorbereitet."
                  checked={marketing}
                  onCheckedChange={setMarketing}
                />
              </div>
            </fieldset>
          </div>
        </div>

        {/* Aktionszeile */}
        <div className="flex flex-col gap-2.5 px-3 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-5 sm:py-3">
          <p className="order-3 text-[10px] leading-snug text-neutral-500 sm:order-1 sm:max-w-[40%] lg:max-w-none">
            Widerruf jederzeit über „Cookie-Einstellungen“ im Seitenfuß. Rechtsgrundlage bei optionalen Kategorien: Art. 6
            Abs. 1 lit. a DSGVO, § 25 Abs. 1 TTDSG.
          </p>
          <div className="order-1 flex flex-wrap items-stretch justify-end gap-2 sm:order-2 sm:justify-end">
            <button
              type="button"
              onClick={handleNecessaryOnly}
              className={cn(
                "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-[#0F4F68]/35 px-3 text-xs font-semibold text-[#0F4F68] transition sm:min-w-[9.5rem] sm:flex-none sm:px-4 sm:text-sm",
                "hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
              )}
            >
              Nur notwendige
            </button>
            <button
              type="button"
              onClick={handleSaveSelection}
              className={cn(
                "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-[#0F4F68] px-3 text-xs font-semibold text-white shadow-sm transition sm:min-w-[9.5rem] sm:flex-none sm:px-4 sm:text-sm",
                "hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
              )}
            >
              Auswahl speichern
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className={cn(
                "inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#F78F2E] px-4 text-xs font-semibold text-white shadow-sm transition sm:min-w-[10rem] sm:w-auto sm:text-sm",
                "hover:bg-[#e07d1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2",
              )}
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </section>,
    document.body,
  );
}

type ConsentCheckboxProps = {
  id: string;
  label: string;
  title?: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange?: (next: boolean) => void;
};

function ConsentCheckbox({ id, label, title, checked, disabled, onCheckedChange }: ConsentCheckboxProps) {
  return (
    <label
      htmlFor={id}
      title={title}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-lg px-1 py-0.5 text-xs font-medium text-neutral-800 transition sm:text-sm",
        disabled && "cursor-default opacity-90",
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={cn(
          "h-4 w-4 shrink-0 rounded border-neutral-300 text-[#0F4F68]",
          "focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-1",
          disabled && "cursor-not-allowed opacity-70",
        )}
      />
      <span className="whitespace-nowrap">{label}</span>
    </label>
  );
}
