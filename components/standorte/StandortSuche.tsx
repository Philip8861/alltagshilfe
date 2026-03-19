"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { findStandortByPlz, type Standort } from "@/config/standorte";

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
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

      {result !== "idle" && (
        <div className="mt-8 rounded-xl border border-[#0F4F68]/20 bg-white/80 p-5">
          {result ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]">
                Ihr Standort
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#0F4F68]">
                {result.name}
              </h3>
              <p className="mt-1 text-neutral-700">{result.address}</p>
              <a
                href={result.phoneHref}
                className="mt-3 inline-flex items-center gap-2 font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded focus:ring-offset-[#F2F9FA]"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F78F2E" }} aria-hidden>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                {result.phone}
              </a>
              <p className="mt-2 text-sm text-neutral-600">{result.hours}</p>
              <Link
                href="/kontakt"
                className="mt-4 inline-block rounded-lg border border-[#0F4F68]/30 bg-transparent px-4 py-2.5 text-sm font-semibold text-[#0F4F68] transition-colors hover:bg-[#0F4F68]/10 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA]"
              >
                Kontakt aufnehmen
              </Link>
            </>
          ) : (
            <p className="text-neutral-700" role="status">
              Kein passender Ansprechpartner gefunden? Versuchen Sie es mit der nächstgrößeren Stadt. Gerne helfen wir Ihnen auch direkt weiter. Rufen Sie uns unter{" "}
              <a href="tel:+4983349893330" className="font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded">
                08334 / 9893330
              </a>{" "}
              an.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
