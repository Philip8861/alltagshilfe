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
  { left: 61, top: 63.6, label: "München", withX: true },
  { left: 57.3, top: 30.2, label: "Nürnberg", withX: true },
];

/** GPS-Marker – Spitze des Pins auf der Koordinate. labelAbove: Name über Symbol. */
const HAUPTMARKER = [
  { left: 49.2, top: 66.9, label: "Allgäu", href: "/kontakt", labelAbove: true },
  { left: 54.6, top: 50.3, label: "Augsburg", href: "/kontakt", labelAbove: true },
  { left: 29.8, top: 65.7, label: "Engen/Konstanz", href: "/kontakt", labelAbove: false },
  { left: 43.4, top: 71.3, label: "Wangen", sublabel: "(Bodenseeregion)", href: "/kontakt", labelAbove: false },
];

/** Orangene Punkte auf der Karte (25% kleiner dargestellt). */
const PUNKTE = [
  { left: 47.9, top: 81.3 },
  { left: 48.4, top: 77.4 },
  { left: 45.6, top: 75.6 },
  { left: 47.7, top: 75 },
  { left: 47.7, top: 72.6 },
  { left: 52.6, top: 73 },
  { left: 51.8, top: 70.9 },
  { left: 53.5, top: 71.1 },
  { left: 53.5, top: 73.8 },
  { left: 55.9, top: 69.7 },
  { left: 55.6, top: 67.1 },
  { left: 53.4, top: 66.7 },
  { left: 52.6, top: 67.9 },
  { left: 51.9, top: 64.5 },
  { left: 47.9, top: 64.3 },
  { left: 57.9, top: 48.8 },
  { left: 58.3, top: 51.7 },
  { left: 56.4, top: 57.4 },
  { left: 56.5, top: 53.7 },
  { left: 51, top: 54.5 },
  { left: 51.3, top: 50.3 },
  { left: 54.7, top: 44.2 },
  { left: 54.4, top: 59.2 },
  { left: 54.1, top: 61 },
  { left: 40, top: 72.6 },
  { left: 39.1, top: 70.1 },
  { left: 41, top: 69.5 },
  { left: 43.7, top: 63 },
  { left: 45.1, top: 60.8 },
  { left: 37.1, top: 70.7 },
  { left: 37.9, top: 67.1 },
  { left: 37.1, top: 62.8 },
  { left: 35.8, top: 66.3 },
  { left: 33.1, top: 67.9 },
  { left: 27.9, top: 67.9 },
  { left: 25, top: 66.3 },
  { left: 26.2, top: 64.7 },
  { left: 26, top: 61 },
  { left: 28.1, top: 58.4 },
  { left: 32.4, top: 58.6 },
  { left: 35.6, top: 61.4 },
  { left: 38, top: 62.6 },
  { left: 38.5, top: 60.6 },
];

export default function StandortePage() {
  return (
    <article
      className="min-h-[60vh] w-full max-w-[100vw] pt-0 pb-16 sm:pb-24 pl-0 -ml-4 sm:-ml-6 lg:-ml-8 overflow-x-hidden"
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
