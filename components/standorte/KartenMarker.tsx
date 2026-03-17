"use client";

import { useEffect, useState } from "react";

const ORANGE = "#F78F2E";

/** Einzelner GPS-Marker mit Label – Position in % (links, oben). */
const HAUPTMARKER: { left: number; top: number; label: string }[] = [
  { left: 58, top: 52, label: "Augsburg" },
  { left: 48, top: 72, label: "Allgäu" },
  { left: 18, top: 38, label: "Konstanz/Engen" },
  { left: 15, top: 32, label: "Bodenseeregion" },
];

/** Kleinere Punkte um die Hauptmarker (in %). */
const PUNKTE: { left: number; top: number }[] = [
  { left: 56, top: 50 },
  { left: 60, top: 54 },
  { left: 54, top: 55 },
  { left: 46, top: 70 },
  { left: 50, top: 74 },
  { left: 48, top: 68 },
  { left: 16, top: 36 },
  { left: 20, top: 40 },
  { left: 22, top: 35 },
  { left: 13, top: 30 },
  { left: 17, top: 34 },
  { left: 19, top: 28 },
  { left: 52, top: 58 },
  { left: 62, top: 48 },
  { left: 44, top: 76 },
  { left: 14, top: 26 },
  { left: 24, top: 42 },
];

function GpsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={ORANGE}
      aria-hidden
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export function KartenMarker() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-stretch justify-stretch"
      aria-hidden
    >
      {/* Kleine orangene Punkte */}
      {PUNKTE.map((p, i) => (
        <span
          key={`dot-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#F78F2E] opacity-90"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            opacity: mounted ? 0.9 : 0,
            animation: mounted ? undefined : "none",
          }}
        />
      ))}
      {/* Größere GPS-Icons mit Beschriftung */}
      {HAUPTMARKER.map((m, i) => (
        <div
          key={m.label}
          className="absolute flex flex-col items-center"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            transform: "translate(-50%, -50%)",
            transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
            opacity: mounted ? 1 : 0,
          }}
        >
          <GpsIcon className="h-5 w-5 sm:h-6 sm:w-6 drop-shadow-sm" />
          <span className="mt-1 whitespace-nowrap rounded bg-white/95 px-2 py-0.5 text-xs font-semibold text-[#0F4F68] shadow-sm">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
