"use client";

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
      stroke="white"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export function KartenMarker() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1]"
      aria-hidden
    >
      {/* Kleine orangene Punkte */}
      {PUNKTE.map((p, i) => (
        <span
          key={`dot-${i}`}
          className="absolute h-2 w-2 rounded-full border-2 border-white bg-[#F78F2E] shadow-md"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      {/* Größere GPS-Icons mit Beschriftung */}
      {HAUPTMARKER.map((m) => (
        <div
          key={m.label}
          className="absolute flex flex-col items-center"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            className="flex drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 2px white) drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
            }}
          >
            <GpsIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </span>
          <span className="mt-1.5 whitespace-nowrap rounded bg-white px-2.5 py-1 text-xs font-bold text-[#0F4F68] shadow-md ring-1 ring-[#F78F2E]/30">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
