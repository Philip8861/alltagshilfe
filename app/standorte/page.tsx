import type { Metadata } from "next";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** GPS-Marker – Position in % (links, oben). */
const HAUPTMARKER = [
  { left: 55, top: 48, label: "Augsburg" },
  { left: 45, top: 68, label: "Allgäu" },
  { left: 22, top: 35, label: "Konstanz/Engen" },
  { left: 18, top: 28, label: "Bodenseeregion" },
];

const PUNKTE = [
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
        {/* Karte + Koordinaten-Erfassung (10% größer als zuvor: 50%) */}
        <div className="relative w-full shrink-0 bg-transparent pl-0 lg:w-[50%] lg:max-w-3xl lg:flex-shrink-0 lg:min-w-0">
          <KartenMitKoordinatenErfassen hauptmarker={HAUPTMARKER} punkte={PUNKTE} />
        </div>
        <div className="w-full min-w-0 px-4 sm:px-6 lg:max-w-md lg:flex-1 lg:px-8">
          <StandortSuche />
        </div>
      </div>
    </article>
  );
}
