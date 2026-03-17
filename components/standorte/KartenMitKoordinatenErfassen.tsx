"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Hauptmarker = { left: number; top: number; label: string; href?: string };
type Punkt = { left: number; top: number };

type Props = {
  hauptmarker: Hauptmarker[];
  punkte: Punkt[];
};

export function KartenMitKoordinatenErfassen({ hauptmarker, punkte }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [erfassenAktiv, setErfassenAktiv] = useState(false);
  const [mouseProzent, setMouseProzent] = useState<{ left: number; top: number } | null>(null);
  const [gespeichert, setGespeichert] = useState<Array<{ left: number; top: number }>>([]);

  const updateMouse = useCallback(
    (e: MouseEvent) => {
      const el = mapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const left = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const top = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setMouseProzent({ left: Math.round(left * 10) / 10, top: Math.round(top * 10) / 10 });
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!erfassenAktiv || e.code !== "Space") return;
      e.preventDefault();
      if (mouseProzent) {
        setGespeichert((prev) => [...prev, { ...mouseProzent }]);
      }
    },
    [erfassenAktiv, mouseProzent]
  );

  useEffect(() => {
    if (!erfassenAktiv) {
      setMouseProzent(null);
      return;
    }
    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [erfassenAktiv, updateMouse, handleKeyDown]);

  return (
    <div className="flex flex-col gap-3">
      {/* Karte zuerst = direkt unter Header, am linken Rand */}
      <div
        ref={mapRef}
        className="relative w-full aspect-[3/2] min-h-[246px] select-none"
      >
        <Image
          src="/images/Landkarte_sueddeutschland.webp"
          alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
          fill
          className="object-contain object-left z-0"
          style={{
            filter: "drop-shadow(0 2px 6px rgba(15, 79, 104, 0.13)) drop-shadow(0 6px 17px rgba(242, 249, 250, 0.7)) drop-shadow(0 11px 28px rgba(225, 240, 242, 0.69)) drop-shadow(0 4px 14px rgba(210, 235, 238, 0.67))",
          }}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* GPS-Marker: Punkte nicht klickbar, Hauptmarker klickbar → Standort/Kontakt */}
        <div
          className="absolute left-0 top-0 w-full h-full z-[100]"
          aria-hidden
        >
          {punkte.map((p, i) => (
            <span
              key={`dot-${i}`}
              className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-[#F78F2E] ring-2 ring-white"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 1px 4px rgba(15,79,104,0.4)",
              }}
            />
          ))}
          {hauptmarker.map((m) => {
            const content = (
              <>
                <span
                  className="flex shrink-0"
                  style={{
                    filter: "drop-shadow(0 0 3px white) drop-shadow(0 2px 6px rgba(15,79,104,0.5))",
                  }}
                >
                  <svg
                    className="h-10 w-10 sm:h-12 sm:w-12"
                    viewBox="0 0 24 24"
                    fill="#F78F2E"
                    stroke="#0F4F68"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                <span className="mt-1.5 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#0F4F68] shadow-lg ring-2 ring-[#F78F2E]">
                  {m.label}
                </span>
              </>
            );
            const style = {
              left: `${m.left}%`,
              top: `${m.top}%`,
              transform: "translate(-50%, -50%)",
            };
            if (m.href) {
              return (
                <Link
                  key={m.label}
                  href={m.href}
                  className="absolute flex flex-col items-center pointer-events-auto rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-transparent"
                  style={style}
                  aria-label={`${m.label} – Standort anzeigen`}
                >
                  {content}
                </Link>
              );
            }
            return (
              <div key={m.label} className="absolute flex flex-col items-center pointer-events-none" style={style}>
                {content}
              </div>
            );
          })}
        </div>

        {/* Overlay: Maus-% Anzeige + Leertaste-Hinweis */}
        {erfassenAktiv && (
          <div className="absolute inset-0 z-[200] cursor-crosshair bg-black/5">
            {mouseProzent && (
              <div className="pointer-events-none absolute left-2 top-2 z-[201] rounded-lg bg-[#0F4F68] px-3 py-2 font-mono text-sm font-bold text-white shadow-lg">
                left: {mouseProzent.left}% · top: {mouseProzent.top}%
              </div>
            )}
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-[201] -translate-x-1/2 rounded bg-black/75 px-3 py-1.5 text-xs font-medium text-white">
              Leertaste = Koordinaten speichern
            </div>
          </div>
        )}
      </div>

      {/* Button unter der Karte */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setErfassenAktiv((a) => !a)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 ${
            erfassenAktiv
              ? "bg-[#F78F2E] text-white hover:bg-[#e07d1f]"
              : "bg-[#0F4F68] text-white hover:bg-[#0c3d52]"
          }`}
        >
          {erfassenAktiv ? "Koordinaten-Erfassung an" : "GPS-Koordinaten erfassen"}
        </button>
        {erfassenAktiv && (
          <span className="text-sm text-neutral-600">
            Maus auf Karte bewegen → Leertaste = Punkt speichern
          </span>
        )}
      </div>

      {/* Gespeicherte Koordinaten zum Kopieren */}
      {gespeichert.length > 0 && (
        <div className="rounded-lg border border-[#0F4F68]/20 bg-[#F2F9FA] p-4">
          <p className="mb-2 text-sm font-semibold text-[#0F4F68]">
            Gespeicherte Koordinaten (zum Kopieren an den Assistenten):
          </p>
          <pre className="max-h-40 overflow-auto rounded bg-white p-3 text-xs text-neutral-800">
            {gespeichert
              .map((p, i) => `  { left: ${p.left}, top: ${p.top} },  // Punkt ${i + 1}`)
              .join("\n")}
          </pre>
          <button
            type="button"
            onClick={() => setGespeichert([])}
            className="mt-2 text-sm text-[#0F4F68] underline hover:no-underline"
          >
            Liste leeren
          </button>
        </div>
      )}
    </div>
  );
}
