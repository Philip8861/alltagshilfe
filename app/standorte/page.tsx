import type { Metadata } from "next";
import Image from "next/image";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** GPS-Marker – Position in % (links, oben). Serverseitig gerendert, damit sie garantiert sichtbar sind. */
const HAUPTMARKER: { left: number; top: number; label: string }[] = [
  { left: 55, top: 48, label: "Augsburg" },
  { left: 45, top: 68, label: "Allgäu" },
  { left: 22, top: 35, label: "Konstanz/Engen" },
  { left: 18, top: 28, label: "Bodenseeregion" },
];

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

export default function StandortePage() {
  return (
    <article
      className="min-h-[60vh] w-full pt-0 pb-16 sm:pb-24 pl-0 -ml-4 sm:-ml-6 lg:-ml-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-flex-start lg:justify-start lg:gap-10 lg:pl-0">
        {/* Karte ganz links – kein linkes Padding */}
        <div className="relative w-full shrink-0 bg-transparent pl-0 lg:w-[45%] lg:max-w-3xl lg:flex-shrink-0 lg:min-w-0">
          <div className="relative w-full aspect-[3/2] min-h-[224px]">
            <Image
              src="/images/Landkarte_sueddeutschland.webp"
              alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
              fill
              className="object-contain object-left z-0"
              style={{
                filter: "drop-shadow(0 2px 6px rgba(15, 79, 104, 0.13)) drop-shadow(0 6px 17px rgba(242, 249, 250, 0.7)) drop-shadow(0 11px 28px rgba(225, 240, 242, 0.69)) drop-shadow(0 4px 14px rgba(210, 235, 238, 0.67))",
              }}
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            {/* GPS-Marker direkt im Markup – serverseitig, immer sichtbar */}
            <div
              className="pointer-events-none absolute left-0 top-0 w-full h-full z-[100]"
              aria-hidden
            >
              {PUNKTE.map((p, i) => (
                <span
                  key={`dot-${i}`}
                  className="absolute h-2.5 w-2.5 rounded-full bg-[#F78F2E] ring-2 ring-white"
                  style={{
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 1px 4px rgba(15,79,104,0.4)",
                  }}
                />
              ))}
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
                    <svg
                      className="h-8 w-8 sm:h-10 sm:w-10"
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
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 px-4 sm:px-6 lg:max-w-md lg:flex-1 lg:px-8">
          <StandortSuche />
        </div>
      </div>
    </article>
  );
}
