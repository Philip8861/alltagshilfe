import type { Metadata } from "next";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** Ortsbezeichnungen mit X (München, Nürnberg) – aktuell ausgeblendet. */
const ORTSLABELS: { left: number; top: number; label: string; withX?: boolean }[] = [];

/** GPS-Marker – Spitze des Pins auf der Koordinate. labelAbove: Name über Symbol. */
const HAUPTMARKER = [
  { left: 68.3, top: 63.7, label: "Allgäu", href: "/kontakt", labelAbove: false },
  { left: 72.3, top: 49, label: "Augsburg", href: "/kontakt", labelAbove: true },
  { left: 54.1, top: 62.3, label: "Engen/Konstanz", href: "/kontakt", labelAbove: false },
  { left: 63.9, top: 66.5, label: "Wangen", sublabel: "(Bodenseeregion)", href: "/kontakt", labelAbove: true },
];

/** Orangene Punkte auf der Karte. */
const PUNKTE = [
  { left: 47.3, top: 76.6 },
  { left: 48.4, top: 73.6 },
  { left: 46, top: 72.6 },
  { left: 43.8, top: 70.4 },
  { left: 48.9, top: 69.5 },
  { left: 46.8, top: 67.7 },
  { left: 51, top: 67.7 },
  { left: 52.7, top: 65.4 },
  { left: 52.6, top: 61.3 },
  { left: 50.6, top: 61.3 },
  { left: 47.2, top: 60.9 },
  { left: 51, top: 58.4 },
  { left: 55.1, top: 59.5 },
  { left: 56, top: 56.1 },
  { left: 53.4, top: 54 },
  { left: 50.1, top: 51.8 },
  { left: 51.7, top: 51.2 },
  { left: 51.3, top: 47.5 },
  { left: 53.9, top: 43.6 },
  { left: 57.3, top: 42.5 },
  { left: 59.7, top: 47.4 },
  { left: 58.3, top: 49.3 },
  { left: 59.3, top: 51.6 },
  { left: 57.7, top: 55 },
  { left: 39.8, top: 66.8 },
  { left: 38.3, top: 64.4 },
  { left: 38.3, top: 60.5 },
  { left: 40.5, top: 58.3 },
  { left: 41.6, top: 56.5 },
  { left: 44.5, top: 58.6 },
  { left: 44.6, top: 62.7 },
  { left: 44.2, top: 66.8 },
  { left: 37.3, top: 63.6 },
  { left: 35.9, top: 61.6 },
  { left: 36.3, top: 58.9 },
  { left: 33.3, top: 57.8 },
  { left: 30.1, top: 57.6 },
  { left: 22.9, top: 64.4 },
  { left: 20.9, top: 63 },
  { left: 23.1, top: 60.9 },
  { left: 20, top: 59.1 },
  { left: 22.2, top: 57.5 },
  { left: 20.9, top: 56.2 },
  { left: 24.5, top: 55.1 },
  { left: 26.2, top: 53.5 },
  { left: 28.8, top: 54.3 },
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
