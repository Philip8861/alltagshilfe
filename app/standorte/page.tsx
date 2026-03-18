import type { Metadata } from "next";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** Dunkle Ortsbezeichnungen auf der Karte (ohne Link) – X an dieser Position. */
const ORTSLABELS = [
  { left: 65.2, top: 57.6, label: "München", withX: true },
  { left: 59.3, top: 30.2, label: "Nürnberg", withX: true },
];

/** GPS-Marker – Spitze des Pins auf der Koordinate. labelAbove: Name über Symbol. */
const HAUPTMARKER = [
  { left: 68.3, top: 63.7, label: "Allgäu", href: "/kontakt", labelAbove: true },
  { left: 72.3, top: 49, label: "Augsburg", href: "/kontakt", labelAbove: true },
  { left: 54.1, top: 62.3, label: "Engen/Konstanz", href: "/kontakt", labelAbove: false },
  { left: 63.9, top: 66.5, label: "Wangen", sublabel: "(Bodenseeregion)", href: "/kontakt", labelAbove: false },
];

/** Orangene Punkte auf der Karte. */
const PUNKTE = [
  { left: 47.3, top: 76.4 },
  { left: 48.1, top: 73.3 },
  { left: 45.8, top: 70.7 },
  { left: 48.4, top: 69.6 },
  { left: 47.1, top: 67.4 },
  { left: 46.9, top: 61.9 },
  { left: 50.4, top: 59.8 },
  { left: 52.3, top: 68.7 },
  { left: 52.5, top: 66.2 },
  { left: 55.6, top: 63.8 },
  { left: 52.6, top: 63.2 },
  { left: 54.8, top: 60.2 },
  { left: 51, top: 59.4 },
  { left: 55.2, top: 56.7 },
  { left: 52.7, top: 53.8 },
  { left: 50.9, top: 52.4 },
  { left: 52.2, top: 50.2 },
  { left: 52.7, top: 46.9 },
  { left: 55.6, top: 44.4 },
  { left: 58.9, top: 47.1 },
  { left: 59.4, top: 49.6 },
  { left: 59.3, top: 53.2 },
  { left: 29.5, top: 62.5 },
  { left: 22.9, top: 64.1 },
  { left: 23.1, top: 61.9 },
  { left: 21.4, top: 59.4 },
  { left: 23.1, top: 56.1 },
  { left: 26.6, top: 54.5 },
  { left: 29.5, top: 56.7 },
  { left: 37.7, top: 63.8 },
  { left: 37.2, top: 60.8 },
  { left: 39.1, top: 58.6 },
  { left: 41.6, top: 58.6 },
  { left: 44.5, top: 59.4 },
  { left: 44.3, top: 66.5 },
  { left: 37.2, top: 68.4 },
  { left: 37.7, top: 66.3 },
];

export default function StandortePage() {
  return (
    <article
      className="min-h-[60vh] w-full max-w-[100vw] pt-0 pb-16 sm:pb-24 pl-0 ml-0 overflow-x-hidden"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-flex-start lg:justify-start lg:gap-10 pl-0">
        <div className="relative w-full flex-none shrink-0 bg-transparent pl-0 ml-0 lg:w-[50%] lg:max-w-3xl lg:min-w-0 order-first">
          <KartenMitKoordinatenErfassen hauptmarker={HAUPTMARKER} punkte={PUNKTE} ortsLabels={ORTSLABELS} />
        </div>
        <div className="w-full min-w-0 pt-6 sm:pt-8 px-4 sm:px-6 lg:max-w-lg lg:flex-1 lg:px-8">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <StandortSuche />
          </div>
        </div>
      </div>
    </article>
  );
}
