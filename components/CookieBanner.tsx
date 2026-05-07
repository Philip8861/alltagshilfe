"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getConsent, setConsent, type ConsentState } from "@/lib/consent";
import { cn } from "@/lib/utils";

/**
 * DSGVO/TTDSG-konformer Consent-Layer (zentriertes Modal, mit Backdrop).
 *
 * Umsetzung der wichtigsten rechtlichen Vorgaben:
 *  - Vor jeder Einwilligung sind alle nicht-notwendigen Kategorien deaktiviert (kein Pre-Selecting).
 *  - „Alle akzeptieren“ und „Nur notwendige“ sind gleich groß, gleich auffällig, gleichberechtigt.
 *  - Keine versteckte „Schließen“-Schaltfläche, die als versteckte Zustimmung wirken könnte.
 *  - Granulare Einstellungen (Statistik, Übersetzung, Marketing) jederzeit erreichbar.
 *  - Widerruf jederzeit über den Footer-Link „Cookie-Einstellungen“ – wird im Banner kommuniziert.
 *  - Verlinkung zu Datenschutzerklärung und Impressum direkt aus dem Banner.
 *  - Modal sperrt den Hintergrund-Scroll, fängt den Fokus und reagiert nicht auf ESC oder Backdrop-Klick,
 *    damit eine bewusste Entscheidung erfolgen muss (Pflicht aus § 25 TTDSG / Art. 4 Nr. 11 DSGVO).
 */

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  translation: false,
  timestamp: 0,
};

type View = "main" | "details";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("main");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [translation, setTranslation] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /** Banner nur einblenden, wenn noch keine Entscheidung vorliegt. */
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

  /** Aufruf aus dem Footer („Cookie-Einstellungen“) öffnet den Banner mit aktuellem Stand. */
  useEffect(() => {
    const handler = () => {
      const s = getConsent();
      if (s) {
        setAnalytics(s.analytics);
        setMarketing(s.marketing);
        setTranslation(s.translation);
        setView("details");
      } else {
        setAnalytics(false);
        setMarketing(false);
        setTranslation(false);
        setView("main");
      }
      setVisible(true);
    };
    window.addEventListener("cookie-banner-show", handler);
    return () => window.removeEventListener("cookie-banner-show", handler);
  }, []);

  /** Hintergrund-Scroll sperren, solange der Banner sichtbar ist. */
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  /** Fokus initial in den Dialog setzen (Barrierefreiheit). */
  useEffect(() => {
    if (!visible || !mounted) return;
    const id = window.requestAnimationFrame(() => {
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      focusable?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [visible, mounted, view]);

  const persist = useCallback((state: ConsentState) => {
    const prev = getConsent();
    setConsent(state);
    window.dispatchEvent(new CustomEvent("ahs-consent-updated"));
    setVisible(false);
    setView("main");
    /* Bei Widerruf der Übersetzungsfunktion sicherheitshalber neu laden,
       damit Google-Translator-Skripte und englische /en-Routen wegfallen. */
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
    >
      {/* Halbtransparenter Hintergrund. Klick darauf schließt den Banner bewusst NICHT. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#0F4F68]/55 backdrop-blur-[3px]"
      />

      <div
        ref={dialogRef}
        className="relative z-[1] flex max-h-[min(92vh,46rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#0F4F68]/15 bg-white shadow-[0_30px_80px_rgba(15,79,104,0.35)] sm:max-w-2xl"
      >
        {/* Markenkopf mit Icon */}
        <header className="flex items-start gap-4 border-b border-[#0F4F68]/10 bg-[#F2F9FA] px-5 py-5 sm:px-7 sm:py-6">
          <span
            aria-hidden
            className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] text-white shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10c0-.55-.45-1-1-1a3 3 0 0 1-3-3a3 3 0 0 1 0-6c-1.66 0-6-.34-6 0Z" />
              <circle cx="9" cy="10" r="1" />
              <circle cx="14" cy="14" r="1" />
              <circle cx="9" cy="16" r="1" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold text-[#0F4F68] sm:text-xl">
              {view === "main" ? "Wir respektieren Ihre Privatsphäre" : "Cookie-Einstellungen"}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              {view === "main"
                ? "Sie entscheiden, welche Cookies wir setzen dürfen."
                : "Aktivieren Sie nur die Kategorien, denen Sie ausdrücklich zustimmen möchten."}
            </p>
          </div>
        </header>

        {/* Hauptinhalt */}
        <div className="flex-1 overflow-y-auto px-5 py-5 text-sm leading-relaxed text-neutral-700 sm:px-7 sm:py-6 sm:text-[0.95rem]">
          {view === "main" ? (
            <div className="space-y-3" id={descriptionId}>
              <p>
                Damit unsere Website zuverlässig funktioniert, setzen wir{" "}
                <strong className="text-neutral-900">technisch notwendige Speicherungen</strong> ein
                (z. B. Speicherung Ihrer Auswahl hier, Sitzungs- und Sicherheits-Cookies). Diese sind
                ohne Ihre Einwilligung möglich (§ 25 Abs. 2 TTDSG).
              </p>
              <p>
                Mit Ihrer Einwilligung verarbeiten wir zusätzlich:
              </p>
              <ul className="ml-5 list-disc space-y-1.5">
                <li>
                  <strong className="text-neutral-900">Statistik</strong> – aggregierte Auswertung
                  über Google Analytics 4 (Google Ireland Ltd., Übermittlung in die USA möglich)
                  sowie unsere eigene anonyme Reichweitenmessung.
                </li>
                <li>
                  <strong className="text-neutral-900">Übersetzung &amp; englische Seitenversion</strong>{" "}
                  – Google Website Translator/Übersetzungs-API (Google Ireland Ltd., Übermittlung
                  in die USA möglich).
                </li>
                <li>
                  <strong className="text-neutral-900">Marketing</strong> – derzeit nicht aktiv,
                  aber technisch vorbereitet (z. B. künftige Kampagnen-Tools).
                </li>
              </ul>
              <p>
                Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO und
                § 25 Abs. 1 TTDSG. Sie können Ihre Auswahl jederzeit über den Link{" "}
                <em>„Cookie-Einstellungen“</em> im Seitenfuß widerrufen oder anpassen – mit Wirkung
                für die Zukunft. Details zu Empfängern, Speicherdauer und Drittland-Übermittlung
                finden Sie in der{" "}
                <Link
                  href="/datenschutz"
                  className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                >
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-4" id={descriptionId}>
              <ConsentRow
                title="Notwendig"
                description="Sicherheits- und Sitzungs-Cookies, Speicherung Ihrer Cookie-Auswahl, Lastverteilung, CSRF-Schutz, Hilfsmittel-Konfigurator. Kein Tracking. Diese Speicherungen sind technisch erforderlich und können nicht deaktiviert werden."
                required
                checked
                onChange={() => undefined}
              />
              <ConsentRow
                title="Statistik"
                description="Anonyme Reichweitenmessung über Google Analytics 4 (mit IP-Anonymisierung, Consent Mode v2) sowie unsere eigene aggregierte Tagesstatistik (kein Personenbezug). Empfänger: Google Ireland Ltd. (USA-Übermittlung möglich), Supabase (EU)."
                checked={analytics}
                onChange={setAnalytics}
              />
              <ConsentRow
                title="Übersetzung & englische Seitenversion"
                description="Google Website Translator und unsere serverseitige Übersetzungs-API. Erst bei Aktivierung werden Skripte und Schnittstellen von Google geladen. Empfänger: Google Ireland Ltd. (USA-Übermittlung möglich)."
                checked={translation}
                onChange={setTranslation}
              />
              <ConsentRow
                title="Marketing"
                description="Vorbereitet für künftige Kampagnen- und Conversion-Tools. Aktuell setzen wir keine Marketing-Cookies."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          )}
        </div>

        {/* Aktionsleiste */}
        <footer className="border-t border-[#0F4F68]/10 bg-white px-5 pb-5 pt-4 sm:px-7 sm:pb-6">
          {view === "main" ? (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center">
              <button
                type="button"
                onClick={() => setView("details")}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
              >
                Einstellungen anpassen
              </button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={handleNecessaryOnly}
                  className={cn(
                    "inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl px-5 text-sm font-semibold transition",
                    "border border-[#0F4F68]/35 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                  )}
                >
                  Nur notwendige
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className={cn(
                    "inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition",
                    "bg-[#F78F2E] hover:bg-[#e07d1f]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2",
                  )}
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setView("main")}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg px-3 text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
              >
                Zurück
              </button>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={handleNecessaryOnly}
                  className={cn(
                    "inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl px-5 text-sm font-semibold transition",
                    "border border-[#0F4F68]/35 bg-white text-[#0F4F68] hover:bg-[#F2F9FA]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                  )}
                >
                  Nur notwendige
                </button>
                <button
                  type="button"
                  onClick={handleSaveSelection}
                  className={cn(
                    "inline-flex min-h-[48px] min-w-[160px] items-center justify-center rounded-xl px-5 text-sm font-semibold text-white shadow-sm transition",
                    "bg-[#0F4F68] hover:bg-[#0c3d52]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                  )}
                >
                  Auswahl speichern
                </button>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs text-neutral-500">
            Verantwortlicher: Alltagshilfe-Süd · Mehr Informationen in{" "}
            <Link href="/datenschutz" className="underline hover:no-underline">
              Datenschutz
            </Link>{" "}
            und{" "}
            <Link href="/impressum" className="underline hover:no-underline">
              Impressum
            </Link>
            . Sie können Ihre Auswahl jederzeit unter „Cookie-Einstellungen“ im Seitenfuß widerrufen.
          </p>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

type ConsentRowProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  required?: boolean;
};

/** Einzelne Kategorie mit Toggle-Switch und Erklärung. */
function ConsentRow({ title, description, checked, onChange, required = false }: ConsentRowProps) {
  const id = useId();
  return (
    <div className="rounded-xl border border-[#0F4F68]/15 bg-[#F8FBFC] p-4">
      <div className="flex items-start justify-between gap-4">
        <label htmlFor={id} className="flex min-w-0 flex-1 cursor-pointer flex-col">
          <span className="flex items-center gap-2 text-sm font-semibold text-[#0F4F68] sm:text-base">
            {title}
            {required ? (
              <span className="rounded-full bg-[#0F4F68] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Immer aktiv
              </span>
            ) : null}
          </span>
          <span className="mt-1 text-xs text-neutral-600 sm:text-sm">{description}</span>
        </label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-disabled={required}
          disabled={required}
          onClick={() => !required && onChange(!checked)}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
            checked ? "bg-[#0F4F68]" : "bg-neutral-300",
            required && "cursor-not-allowed opacity-90",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
              checked ? "translate-x-6" : "translate-x-1",
            )}
          />
          <span className="sr-only">
            {required ? "Notwendig (immer aktiv)" : checked ? "Aktiviert" : "Deaktiviert"}
          </span>
        </button>
      </div>
    </div>
  );
}
