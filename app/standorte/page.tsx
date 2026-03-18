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
  { left: 51.7, top: 62.8, label: "München", withX: true },
  { left: 46.3, top: 31.6, label: "Nürnberg", withX: true },
];

/** GPS-Marker – Spitze des Pins auf der Koordinate. labelAbove: Name über Symbol. */
const HAUPTMARKER = [
  { left: 60.3, top: 66.9, label: "Allgäu", href: "/kontakt", labelAbove: true },
  { left: 64.4, top: 50.9, label: "Augsburg", href: "/kontakt", labelAbove: true },
  { left: 48.4, top: 66.1, label: "Engen/Konstanz", href: "/kontakt", labelAbove: false },
  { left: 56.6, top: 71.1, label: "Wangen", sublabel: "(Bodenseeregion)", href: "/kontakt", labelAbove: false },
];

/** Orangene Punkte auf der Karte (25% kleiner dargestellt). */
const PUNKTE: { left: number; top: number }[] = [];

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
