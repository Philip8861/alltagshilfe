"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { buildStandortPageHref, findStandortByPlz, getOrtByPlz, type Standort } from "@/config/standorte";

export function StandortFinderPopup() {
  const [widgetVisible, setWidgetVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [plz, setPlz] = useState("");
  const [result, setResult] = useState<Standort | null | "idle">("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setResult("idle");
    setError(null);
    setPlz("");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setResult("idle");
    setError(null);
  }, []);

  const handleSearch = useCallback(() => {
    const trimmed = plz.trim();
    setError(null);
    if (!trimmed) {
      setError("Bitte geben Sie eine Postleitzahl ein.");
      return;
    }
    const standort = findStandortByPlz(trimmed);
    setResult(standort ?? null);
  }, [plz]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleClose, handleSearch]
  );

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!widgetVisible) return null;

  return (
    <>
      {/* Floating Button mit Sprechblase und X zum Schließen */}
      <div
        className="fixed right-6 z-40 flex flex-col items-end"
        style={{
          bottom: "max(1.5rem, env(safe-area-inset-bottom))",
          right: "max(1.5rem, env(safe-area-inset-right))",
        }}
      >
        {/* Sprechblase mit X */}
        <div className="relative mb-2 rounded-xl bg-[#0F4F68] pl-3 pr-8 py-2 shadow-md">
          <p className="whitespace-nowrap text-sm font-medium text-white">
            Kontaktdaten Ihres Standortes
          </p>
          <button
            type="button"
            onClick={() => {
              setWidgetVisible(false);
              setOpen(false);
            }}
            className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68]"
            aria-label="Standort-Hinweis schließen"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <span
            className="absolute -bottom-2 right-6 h-0 w-0 border-l-8 border-r-8 border-t-[10px] border-l-transparent border-r-transparent border-t-[#0F4F68]"
            aria-hidden
          />
        </div>
        <button
          type="button"
          onClick={handleOpen}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F9FA] shadow-lg transition-all hover:bg-[#e5f2f5] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
          aria-label="Standort nach PLZ suchen – Popup öffnen"
        >
          <svg
            className="h-9 w-9"
            viewBox="0 0 24 24"
            fill="#0F4F68"
            aria-hidden
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>
      </div>

      {/* Popup / Modal */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            onKeyDown={handleKeyDown}
            aria-hidden
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="standort-finder-title"
            aria-describedby="standort-finder-desc"
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white"
                  aria-hidden
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                <div>
                  <h2
                    id="standort-finder-title"
                    className="text-xl font-bold text-[#0F4F68]"
                  >
                    Standort finden
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]"
                aria-label="Popup schließen"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="mt-6">
              <label htmlFor="plz-input" className="sr-only">
                Postleitzahl
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="plz-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="PLZ (z. B. 87700)"
                  value={plz}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 5);
                    setPlz(v);
                    setResult("idle");
                    setError(null);
                  }}
                  className="flex-1 rounded-xl border border-[#0F4F68]/25 px-4 py-3 text-lg focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]/20"
                  aria-invalid={!!error}
                  aria-describedby={error ? "plz-error" : undefined}
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="shrink-0 rounded-xl bg-[#0F4F68] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  Suchen
                </button>
              </div>
              {error && (
                <p id="plz-error" className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>

            {/* Ergebnis: Standort oder „nicht gefunden“ */}
            {result !== "idle" && (
              <div className="mt-6 rounded-xl border border-[#0F4F68]/20 bg-[#F2F9FA]/80 p-4">
                {result ? (
                  <>
                    {plz.trim() && (
                      <p className="text-base font-semibold text-neutral-700">
                        {plz.trim()}
                        {getOrtByPlz(plz) ? ` ${getOrtByPlz(plz)}` : ""}
                      </p>
                    )}
                    <p className="mt-2 truncate text-sm font-semibold text-[#0F4F68]">
                      {result.name.startsWith("Standort") ? result.name : `Standort ${result.name}`}
                    </p>
                    <p className="mt-2 text-sm text-neutral-700">{result.address}</p>
                    <a
                      href={result.phoneHref}
                      className="mt-3 inline-flex items-center gap-2 text-2xl font-extrabold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                    >
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F78F2E" }}>
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      {result.phone}
                    </a>
                    <p className="mt-2 text-xs text-neutral-600">{result.hours}</p>
                    <div className="mt-4 flex justify-center">
                      <Link
                        href={
                          (() => {
                            const p = plz.trim();
                            const s = findStandortByPlz(p);
                            const o = getOrtByPlz(p);
                            return s && o ? buildStandortPageHref(s, { plz: p, ort: o }) : "/standorte";
                          })()
                        }
                        className="flex w-full items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                      >
                        Zum Standort
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-neutral-700" role="status">
                    Kein passender Ansprechpartner gefunden? Versuchen Sie es mit der nächstgrößeren Stadt. Gerne helfen wir Ihnen auch direkt weiter. Rufen Sie uns unter{" "}
                    <a href="tel:+4983349893330" className="font-semibold text-[#0F4F68] hover:underline">
                      08334 / 9893330
                    </a>{" "}
                    an.
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
