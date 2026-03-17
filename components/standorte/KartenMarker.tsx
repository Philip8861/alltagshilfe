"use client";

const ORANGE = "#F78F2E";

/** GPS-Marker mit Label – Position in % der Kartenfläche (links, oben). */
const HAUPTMARKER: { left: number; top: number; label: string }[] = [
  { left: 55, top: 48, label: "Augsburg" },
  { left: 45, top: 68, label: "Allgäu" },
  { left: 22, top: 35, label: "Konstanz/Engen" },
  { left: 18, top: 28, label: "Bodenseeregion" },
];

/** Kleine Punkte um die Hauptmarker. */
const PUNKTE: { left: number; top: number }[] = [
  { left: 52, top: 46 },
  { left: 58, top: 50 },
  { left: 42, top: 66 },
  { left: 48, top: 70 },
  { left: 20, top: 33 },
  { left: 25, top: 37 },
  { left: 15, top: 26 },
  { left: 20, top: 30 },
  { left: 50, top: 52 },
  { left: 60, top: 44 },
  { left: 38, top: 72 },
  { left: 28, top: 40 },
];

function GpsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={ORANGE}
      stroke="#0F4F68"
      strokeWidth={1.5}
      aria-hidden
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export function KartenMarker() {
  return (
    <div
      className="pointer-events-none absolute left-0 top-0 w-full h-full min-w-[1px] min-h-[1px]"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    >
      {/* Kleine orangene Punkte */}
      {PUNKTE.map((p, i) => (
        <span
          key={`dot-${i}`}
          className="absolute h-2.5 w-2.5 rounded-full bg-[#F78F2E] ring-2 ring-white ring-offset-1 ring-offset-transparent"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 1px 4px rgba(15,79,104,0.4)",
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
            className="flex shrink-0"
            style={{
              filter: "drop-shadow(0 0 3px white) drop-shadow(0 2px 6px rgba(15,79,104,0.5))",
            }}
          >
            <GpsIcon className="h-8 w-8 sm:h-10 sm:w-10" />
          </span>
          <span className="mt-1.5 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#0F4F68] shadow-lg ring-2 ring-[#F78F2E]">
            {m.label}
          </span>
        </div>
      ))}
    </div>
  );
}
