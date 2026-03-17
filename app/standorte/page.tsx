import type { Metadata } from "next";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** GPS-Marker – Position in % (links, oben), href = Link zu Standort/Kontakt. */
const HAUPTMARKER = [
  { left: 48.4, top: 83.3, label: "Allgäu", href: "/kontakt" },
  { left: 56.9, top: 66.3, label: "Augsburg", href: "/kontakt" },
  { left: 27, top: 76.6, label: "Engen/Konstanz", href: "/kontakt" },
  { left: 38.9, top: 82.9, label: "Bodenseeregion", href: "/kontakt" },
];

const PUNKTE = [
  { left: 52.2, top: 84.3 },
  { left: 52.6, top: 79.5 },
  { left: 57.2, top: 71.1 },
  { left: 62.6, top: 65.5 },
  { left: 62.3, top: 57 },
  { left: 57.3, top: 54.7 },
  { left: 52.7, top: 58 },
  { left: 50, top: 61.6 },
  { left: 41.6, top: 83.3 },
  { left: 43.4, top: 75.8 },
  { left: 37.9, top: 74.2 },
  { left: 35.9, top: 78.9 },
  { left: 36, top: 82.3 },
  { left: 28.5, top: 76.8 },
  { left: 25.5, top: 78.6 },
  { left: 22, top: 75.6 },
  { left: 22.4, top: 69.5 },
  { left: 24.3, top: 65.1 },
  { left: 28.9, top: 65.9 },
  { left: 32.6, top: 75.2 },
  { left: 33.7, top: 70.3 },
  { left: 43.5, top: 79.1 },
  { left: 43.8, top: 72.8 },
  { left: 56.4, top: 78 },
  { left: 56.4, top: 82.9 },
  { left: 59.2, top: 88.4 },
];

export default function StandortePage() {
  return (
    <article
      className="min-h-[60vh] w-full pt-8 sm:pt-10 pb-16 sm:pb-24 pl-0 -ml-4 sm:-ml-6 lg:-ml-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-flex-start lg:justify-start lg:gap-10 lg:pl-0">
        <div className="relative w-full shrink-0 bg-transparent pl-0 lg:w-[50%] lg:max-w-3xl lg:flex-shrink-0 lg:min-w-0">
          <KartenMitKoordinatenErfassen hauptmarker={HAUPTMARKER} punkte={PUNKTE} />
        </div>
        <div className="w-full min-w-0 px-4 sm:px-6 lg:max-w-lg lg:flex-1 lg:px-8">
          <StandortSuche />
        </div>
      </div>
    </article>
  );
}
