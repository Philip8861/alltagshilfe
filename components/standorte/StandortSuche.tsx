"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { buildStandortPageHref, findStandortByPlz, getOrtByPlz, type Standort } from "@/config/standorte";

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
      <div className="w-full rounded-2xl border border-[#0F4F68]/15 bg-[#F2F9FA] p-11 sm:p-[3.3rem] lg:p-[2.75rem] xl:p-[3.3rem]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex items-center gap-5 lg:max-w-[min(100%,26rem)] lg:shrink-0">
            <span
              className="flex h-[4.4rem] w-[4.4rem] shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white"
              aria-hidden
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="text-[1.65rem] font-bold leading-snug text-[#0F4F68] sm:text-[1.75rem]">
                Standort suchen
              </h2>
              <p className="mt-1.5 text-[1.125rem] leading-snug text-neutral-600 sm:text-xl">
                Postleitzahl eingeben – wir zeigen Ihren Ansprechpartner.
              </p>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-stretch lg:flex-1">
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
              className="min-h-[3.3rem] w-full flex-1 rounded-xl border border-[#0F4F68]/25 bg-white px-[1.1rem] py-[1.1rem] text-[1.125rem] text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20 sm:px-6 sm:text-lg"
              aria-invalid={!!error}
              aria-describedby={error ? "standort-plz-error" : undefined}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="flex min-h-[3.3rem] w-full shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] px-8 py-[1.1rem] text-[1.125rem] font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA] sm:w-auto sm:px-10 sm:text-lg"
            >
              Suchen
            </button>
          </div>
        </div>
        {error && (
          <p id="standort-plz-error" className="mt-4 text-base text-red-600 lg:mt-5" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Popup wie Kontakt-Seite: gleicher Aufbau und Optik wie StandortFinderPopup */}
      {showPopup &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              aria-hidden
              onClick={closePopup}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="standort-popup-title"
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl sm:p-8"
              onKeyDown={handlePopupKeyDown}
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
                    <h2 id="standort-popup-title" className="text-xl font-bold text-[#0F4F68]">
                      Suchergebnis
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePopup}
                  className="shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]"
                  aria-label="Popup schließen"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 rounded-xl border border-[#0F4F68]/20 bg-[#F2F9FA]/80 p-4">
                {result ? (
                  <>
                    {plz.trim() && (
                      <p className="text-base font-semibold text-neutral-700">
                        {plz.trim()}
                        {getOrtByPlz(plz) ? ` ${getOrtByPlz(plz)}` : ""}
                      </p>
                    )}
                    <p className="mt-2 truncate text-base font-bold text-[#0F4F68] sm:text-lg">
                      {result.name.startsWith("Standort") ? result.name : `Standort ${result.name}`}
                    </p>
                    <p className="mt-2 text-sm text-neutral-700">{result.address}</p>
                    <a
                      href={result.phoneHref}
                      className="mt-3 inline-flex items-center gap-2 text-2xl font-extrabold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                    >
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F78F2E" }} aria-hidden>
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
            </div>
          </>,
          document.body
        )}
    </>
  );
}
