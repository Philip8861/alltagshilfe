"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { findStandortByPlz, getOrtByPlz, type Standort } from "@/config/standorte";

export function StandortSuche() {
  const [plz, setPlz] = useState("");
  const [result, setResult] = useState<Standort | null | "idle">("idle");
  const [error, setError] = useState<string | null>(null);

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

  const closePopup = useCallback(() => {
    setResult("idle");
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handlePopupKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    },
    [closePopup]
  );

  useEffect(() => {
    if (result === "idle") return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [result, closePopup]);

  const showPopup = result !== "idle";

  return (
    <>
      <div className="w-full rounded-2xl border border-[#0F4F68]/15 bg-[#F2F9FA] p-10 sm:p-12">
        <div className="flex items-center gap-5">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white"
            aria-hidden
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </span>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-[2rem]">
              Standort suchen
            </h2>
            <p className="mt-1.5 text-lg text-neutral-600">
              Postleitzahl eingeben – wir zeigen Ihren Ansprechpartner.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <label htmlFor="standort-plz" className="sr-only">
            Postleitzahl
          </label>
          <input
            id="standort-plz"
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
            onKeyDown={handleKeyDown}
            className="w-full rounded-xl border border-[#0F4F68]/25 bg-white px-6 py-4 text-lg text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20"
            aria-invalid={!!error}
            aria-describedby={error ? "standort-plz-error" : undefined}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-4 font-semibold text-lg text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA]"
          >
            Suchen
          </button>
          {error && (
            <p id="standort-plz-error" className="mt-3 text-base text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Popup nach Klick auf Suchen: dunkler Hintergrund, Inhalt mit X */}
      {showPopup &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[60] bg-black/60"
              aria-hidden
              onClick={closePopup}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="standort-popup-title"
              className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#0F4F68]/20 bg-white p-6 shadow-xl sm:p-8"
              onKeyDown={handlePopupKeyDown}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 id="standort-popup-title" className="sr-only">
                  Suchergebnis Standort
                </h2>
                <div className="min-w-0 flex-1">
                  {result ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]">
                        Gesuchte Region
                      </p>
                      {plz.trim() && (
                        <p className="mt-1 text-base text-neutral-700">
                          {plz.trim()}
                          {getOrtByPlz(plz) ? ` ${getOrtByPlz(plz)}` : ""}
                        </p>
                      )}
                      <p className="mt-3 text-sm font-semibold text-[#0F4F68]">
                        Ihr Ansprechpartner: {result.name}
                      </p>
                      <p className="mt-1 text-neutral-700">{result.address}</p>
                      <a
                        href={result.phoneHref}
                        className="mt-4 flex items-center gap-3 rounded-xl bg-[#F2F9FA] px-4 py-3 text-xl font-bold text-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                      >
                        <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F78F2E" }} aria-hidden>
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        <span>{result.phone}</span>
                      </a>
                      <p className="mt-2 text-sm text-neutral-600">{result.hours}</p>
                      <div className="mt-6 flex justify-center">
                        <Link
                          href="/kontakt"
                          className="flex w-full items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-white"
                        >
                          Zum Standort
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#0F4F68]">
                        Kein Standort gefunden
                      </p>
                      <p className="mt-3 text-neutral-700" role="status">
                        Kein passender Ansprechpartner gefunden? Versuchen Sie es mit der nächstgrößeren Stadt. Gerne helfen wir Ihnen auch direkt weiter.
                      </p>
                      <a
                        href="tel:+4983349893330"
                        className="mt-4 flex items-center gap-3 rounded-xl bg-[#F2F9FA] px-4 py-3 text-xl font-bold text-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                      >
                        <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F78F2E" }} aria-hidden>
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                        <span>08334 / 9893330</span>
                      </a>
                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          onClick={closePopup}
                          className="flex w-full items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                        >
                          Schließen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closePopup}
                  className="shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]"
                  aria-label="Popup schließen"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
