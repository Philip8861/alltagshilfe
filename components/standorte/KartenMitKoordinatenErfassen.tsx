"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Hauptmarker = { left: number; top: number; label: string; href?: string; labelAbove?: boolean };
type Punkt = { left: number; top: number };
type OrtsLabel = { left: number; top: number; label: string; withX?: boolean };

type Props = {
  hauptmarker: Hauptmarker[];
  punkte: Punkt[];
  ortsLabels?: OrtsLabel[];
};

export function KartenMitKoordinatenErfassen({ hauptmarker, punkte, ortsLabels = [] }: Props) {
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
      {/* Karte fixiert: aspect-[3/2] wie Landkarte_sueddeutschland – Positionen in % bleiben auf Desktop und Mobil gleich. */}
      <div
        ref={mapRef}
        className="relative w-full flex-none aspect-[3/2] min-h-[246px] select-none overflow-hidden isolate"
      >
        {/* Karte als unterste Ebene (z-0), Marker-Overlay darüber, aber unter Header/Nav */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            fill
            className="object-contain object-left object-top"
            style={{
              filter: "drop-shadow(0 3px 8px rgba(15, 79, 104, 0.17)) drop-shadow(0 8px 24px rgba(242, 249, 250, 0.98)) drop-shadow(0 12px 32px rgba(225, 240, 242, 0.86))",
            }}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        {/* GPS-Symbole, orangene Punkte, X München/Nürnberg: über der Karte, unter sonstigen Grafiken (Header) */}
        <div
          className="absolute left-0 top-0 w-full h-full z-10"
          aria-hidden
        >
          {punkte.map((p, i) => (
            <span
              key={`dot-${i}`}
              className="pointer-events-none absolute h-[7px] w-[7px] rounded-full bg-[#F78F2E] ring-2 ring-white animate-marker-pop-in"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${Math.min(i * 35, 650)}ms`,
              }}
            />
          ))}
          {ortsLabels.map((o) => (
            <div
              key={o.label}
              className="pointer-events-none absolute flex flex-col items-center gap-0 leading-tight"
              style={{
                left: `${o.left}%`,
                top: `${o.top}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="whitespace-nowrap font-semibold text-[#0F4F68] text-sm sm:text-base">
                {o.label}
              </span>
              {o.withX && (
                <span className="text-[#0F4F68] font-bold text-xl sm:text-2xl leading-none -mt-1" aria-hidden>×</span>
              )}
            </div>
          ))}
          {hauptmarker.map((m) => {
            const labelEl = (
              <span
                className="whitespace-nowrap text-xs font-extrabold text-[#0F4F68]"
                style={{
                  textShadow: [
                    "0 0 2px white",
                    "1px 0 0 white", "-1px 0 0 white", "0 1px 0 white", "0 -1px 0 white",
                    "1px 1px 0 white", "-1px -1px 0 white", "1px -1px 0 white", "-1px 1px 0 white",
                  ].join(", "),
                }}
              >
                {m.label}
              </span>
            );
            const iconEl = (
              <span
                className="flex shrink-0"
                style={{
                  filter: "drop-shadow(0 0 3px white) drop-shadow(0 2px 6px rgba(15,79,104,0.5))",
                }}
              >
                <svg
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  viewBox="0 0 24 24"
                  fill="#F78F2E"
                  stroke="#0F4F68"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </span>
            );
            const content = m.labelAbove ? (
              <>
                <span className="mb-1.5">{labelEl}</span>
                {iconEl}
              </>
            ) : (
              <>
                {iconEl}
                <span className="mt-1.5">{labelEl}</span>
              </>
            );
            const style = {
              left: `${m.left}%`,
              top: `${m.top}%`,
              transform: "translate(-50%, -50%)",
            };
            const animDelay = 400 + (hauptmarker.indexOf(m) * 120);
            const commonStyle = { ...style, animationDelay: `${animDelay}ms` };
            if (m.href) {
              return (
                <Link
                  key={m.label}
                  href={m.href}
                  className="absolute flex flex-col items-center pointer-events-auto rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-transparent animate-marker-slide-in"
                  style={commonStyle}
                  aria-label={`${m.label} – Standort anzeigen`}
                >
                  {content}
                </Link>
              );
            }
            return (
              <div key={m.label} className="absolute flex flex-col items-center pointer-events-none animate-marker-slide-in" style={commonStyle}>
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
