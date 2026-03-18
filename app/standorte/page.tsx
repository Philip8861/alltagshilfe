import type { Metadata } from "next";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** Dunkle Ortsbezeichnungen auf der Karte (ohne Link). */
const ORTSLABELS = [
  { left: 71.1, top: 73.8, label: "München", withX: true },
  { left: 68.4, top: 33.2, label: "Nürnberg", withX: true },
];

/** GPS-Marker – labelAbove: Name über Symbol (Allgäu, Augsburg), sonst unter dem Symbol. */
const HAUPTMARKER = [
  { left: 48.4, top: 83.3, label: "Allgäu", href: "/kontakt", labelAbove: true },
  { left: 56.9, top: 66.3, label: "Augsburg", href: "/kontakt", labelAbove: true },
  { left: 27, top: 76.6, label: "Engen/Konstanz", href: "/kontakt", labelAbove: false },
  { left: 38.9, top: 82.9, label: "Bodenseeregion", href: "/kontakt", labelAbove: false },
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
      className="min-h-[60vh] w-full pt-0 pb-16 sm:pb-24 pl-0 lg:-ml-4 xl:-ml-6 2xl:-ml-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-flex-start lg:justify-start lg:gap-10 lg:pl-0">
        <div className="relative w-full flex-none shrink-0 bg-transparent pl-0 lg:w-[50%] lg:max-w-3xl lg:min-w-0 order-first">
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
