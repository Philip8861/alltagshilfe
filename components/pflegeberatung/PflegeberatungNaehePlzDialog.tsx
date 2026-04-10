"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { findStandortByPlz, getOrtByPlz } from "@/config/standorte";

type Ergebnis =
  | { art: "vorOrtUndVideo"; ortAnzeige: string }
  | { art: "nurVideo"; ortAnzeige: string }
  | { art: "nurVideoOhneOrt" };

function plzAuswerten(raw: string): Ergebnis | "ungueltig" {
  const plz = raw.replace(/\D/g, "").slice(0, 5);
  if (plz.length !== 5) return "ungueltig";
  const standort = findStandortByPlz(plz);
  const ort = getOrtByPlz(plz);
  if (standort) {
    const ausName = standort.name.replace(/^Standort\s+/i, "").replace(/\s*\(.*\)\s*$/, "").trim();
    const ortAnzeige = ort ?? (ausName || "Ihrer Region");
    return { art: "vorOrtUndVideo", ortAnzeige };
  }
  if (ort) return { art: "nurVideo", ortAnzeige: ort };
  return { art: "nurVideoOhneOrt" };
}

function GruenerHaken({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm"
        aria-hidden
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
      <span className="text-[0.95rem] font-medium leading-snug text-neutral-800 sm:text-base">{children}</span>
    </li>
  );
}

export function PflegeberatungNaehePlzDialog() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [plz, setPlz] = useState("");
  const [phase, setPhase] = useState<"eingabe" | "ergebnis">("eingabe");
  const [ergebnis, setErgebnis] = useState<Ergebnis | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const titelId = useId();
  const plzInputId = useId();
  const plzInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open || phase !== "eingabe" || !mounted) return;
    const id = window.requestAnimationFrame(() => plzInputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open, phase, mounted]);

  const schliessen = useCallback(() => {
    setOpen(false);
    setPhase("eingabe");
    setPlz("");
    setErgebnis(null);
    setFehler(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") schliessen();
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, schliessen]);

  const pruefen = useCallback(() => {
    setFehler(null);
    const aus = plzAuswerten(plz);
    if (aus === "ungueltig") {
      setFehler("Bitte geben Sie eine gültige fünfstellige Postleitzahl ein.");
      return;
    }
    setErgebnis(aus);
    setPhase("ergebnis");
  }, [plz]);

  const oeffnen = useCallback(() => {
    setOpen(true);
    setPhase("eingabe");
    setPlz("");
    setErgebnis(null);
    setFehler(null);
  }, []);

  const show = open && mounted && typeof document !== "undefined";

  return (
    <>
      <button
        type="button"
        onClick={oeffnen}
        className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#0F4F68] bg-white px-6 py-3 text-base font-semibold text-[#0F4F68] transition-colors hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:min-h-[52px] sm:px-8 sm:text-lg"
      >
        Pflegeberatung in meiner Nähe finden
      </button>

      {show &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" aria-hidden onClick={schliessen} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titelId}
              className="fixed left-1/2 top-1/2 z-[61] max-h-[min(92vh,40rem)] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-2xl sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 id={titelId} className="text-lg font-extrabold text-[#0F4F68] sm:text-xl">
                  {phase === "eingabe" ? "Postleitzahl eingeben" : "Ihre Möglichkeiten"}
                </h2>
                <button
                  type="button"
                  onClick={schliessen}
                  className="shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]"
                  aria-label="Dialog schließen"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {phase === "eingabe" ? (
                <div className="mt-5">
                  <label htmlFor={plzInputId} className="block text-sm font-semibold text-[#0F4F68]">
                    Ihre Postleitzahl
                  </label>
                  <input
                    ref={plzInputRef}
                    id={plzInputId}
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    autoComplete="postal-code"
                    value={plz}
                    onChange={(e) => {
                      setPlz(e.target.value.replace(/\D/g, "").slice(0, 5));
                      setFehler(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        pruefen();
                      }
                    }}
                    className="mt-2 w-full rounded-xl border border-[#0F4F68]/25 bg-[#fafbfc] px-4 py-3 text-lg text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/25"
                    placeholder="z. B. 87700"
                    aria-invalid={!!fehler}
                    aria-describedby={fehler ? `${plzInputId}-err` : undefined}
                  />
                  {fehler ? (
                    <p id={`${plzInputId}-err`} className="mt-2 text-sm font-medium text-red-600" role="alert">
                      {fehler}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={pruefen}
                    className="mt-5 flex w-full min-h-11 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                  >
                    Prüfen
                  </button>
                </div>
              ) : ergebnis ? (
                <div className="mt-5">
                  <ul className="space-y-4" aria-label="Verfügbare Angebote">
                    {ergebnis.art === "vorOrtUndVideo" ? (
                      <>
                        <GruenerHaken>
                          An Ihrem Wohnort in {ergebnis.ortAnzeige} bieten wir eine Pflegeberatung vor Ort an.
                        </GruenerHaken>
                        <GruenerHaken>An Ihrem Wohnort bieten wir eine Pflegeberatung per Videocall an.</GruenerHaken>
                      </>
                    ) : ergebnis.art === "nurVideo" ? (
                      <GruenerHaken>
                        An Ihrem Wohnort in {ergebnis.ortAnzeige} bieten wir Pflegeberatung per Videocall an.
                      </GruenerHaken>
                    ) : (
                      <GruenerHaken>An Ihrem Wohnort bieten wir Pflegeberatung per Videocall an.</GruenerHaken>
                    )}
                  </ul>
                  <Link
                    href="/kontakt"
                    className="mt-8 flex w-full min-h-[52px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3.5 text-center text-base font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                    onClick={() => schliessen()}
                  >
                    {ergebnis.art === "vorOrtUndVideo" ? "Jetzt Termin vereinbaren" : "Gleich Termin vereinbaren"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setPhase("eingabe");
                      setErgebnis(null);
                    }}
                    className="mt-3 w-full text-center text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#F78F2E]"
                  >
                    Andere PLZ eingeben
                  </button>
                </div>
              ) : null}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
