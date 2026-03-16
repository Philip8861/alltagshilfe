"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getConsent, setConsent, type ConsentState } from "@/lib/consent";
import { cn } from "@/lib/utils";

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getConsent();
    if (!stored) setVisible(true);
  }, []);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("cookie-banner-show", handler);
    return () => window.removeEventListener("cookie-banner-show", handler);
  }, []);

  const save = (state: ConsentState) => {
    setConsent(state);
    setVisible(false);
    setSettingsOpen(false);
  };

  const handleAcceptAll = () => {
    save({
      ...DEFAULT_CONSENT,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    });
  };

  const handleNecessaryOnly = () => {
    save({
      ...DEFAULT_CONSENT,
      timestamp: Date.now(),
    });
  };

  const handleSaveSettings = () => {
    save({
      ...DEFAULT_CONSENT,
      analytics,
      marketing,
      timestamp: Date.now(),
    });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#0F4F68]/15 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:p-5"
      style={{
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#0F4F68]">Cookie-Hinweis</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Wir verwenden Cookies, um die Nutzung der Website zu ermöglichen und – sofern Sie
              zustimmen – anonyme Auswertungen zu verbessern. Notwendige Cookies sind für den
              Betrieb erforderlich. Details finden Sie in unserer{" "}
              <Link
                href="/datenschutz"
                className="font-medium text-[#0F4F68] underline hover:no-underline"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>

            {settingsOpen && (
              <div className="mt-4 space-y-3 rounded-lg border border-[#0F4F68]/20 bg-[#F2F9FA]/50 p-4">
                <p className="text-sm font-semibold text-[#0F4F68]">Einstellungen</p>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
                  />
                  <span className="text-sm text-neutral-700">Statistik / Analytics (z. B. Besucherzahlen)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
                  />
                  <span className="text-sm text-neutral-700">Marketing (optional)</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:flex-col sm:items-end">
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                "border border-[#0F4F68]/40 text-[#0F4F68] hover:bg-[#0F4F68]/10",
                "focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
              )}
            >
              {settingsOpen ? "Einstellungen schließen" : "Einstellungen"}
            </button>
            <button
              type="button"
              onClick={handleNecessaryOnly}
              className={cn(
                "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                "border border-[#0F4F68]/25 text-neutral-700 hover:bg-neutral-50",
                "focus:outline-none focus:ring-1 focus:ring-[#0F4F68] focus:ring-offset-2"
              )}
            >
              Nur notwendige
            </button>
            {settingsOpen ? (
              <button
                type="button"
                onClick={handleSaveSettings}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                  "bg-[#0F4F68] hover:bg-[#0c3d52]",
                  "focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                )}
              >
                Auswahl speichern
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAcceptAll}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                  "bg-[#F78F2E] hover:bg-[#e07d1f]",
                  "focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                )}
              >
                Alle akzeptieren
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
