import Link from "next/link";
import type { PlzMapMarker } from "@/lib/standort-region-map";

const BRAND = "#0F4F68";

function GpsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke={BRAND} strokeWidth="1.35" opacity="0.35" />
      <circle cx="12" cy="12" r="2.85" fill={BRAND} />
      <path
        d="M12 2.5v3.2M12 18.3V21.5M2.5 12h3.2M18.3 12H21.5"
        stroke={BRAND}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Props = {
  markers: PlzMapMarker[];
  currentPlz: string;
};

/**
 * Klickbare GPS-Marker über der eingebetteten Karte (Positionen aus Bounding-Box, linear).
 */
export function StandortMapMarkerOverlay({ markers, currentPlz }: Props) {
  return (
    <div className="absolute inset-0 z-[2] overflow-hidden">
      {markers.map((m) => {
        const active = m.plz === currentPlz;
        return (
          <Link
            key={m.plz}
            href={`/standorte/${m.slug}`}
            className={`pointer-events-auto absolute flex min-h-[44px] min-w-[44px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[#0F4F68] transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 ${
              active ? "z-[4]" : "z-[3]"
            }`}
            style={{ left: `${m.leftPct}%`, top: `${m.topPct}%` }}
            aria-label={`Standort ${m.plz} ${m.ort}`}
            title={`${m.plz} ${m.ort}`}
          >
            <GpsIcon className={active ? "h-7 w-7 drop-shadow-sm" : "h-[1.15rem] w-[1.15rem] drop-shadow-sm sm:h-5 sm:w-5"} />
          </Link>
        );
      })}
    </div>
  );
}
