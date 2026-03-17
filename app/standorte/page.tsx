import type { Metadata } from "next";
import Image from "next/image";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { KartenMarker } from "@/components/standorte/KartenMarker";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

export default function StandortePage() {
  return (
    <article
      className="min-h-[60vh] pt-0 pb-16 sm:pb-24"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-flex-start lg:justify-start lg:gap-10">
        <div className="relative w-full shrink-0 bg-transparent pl-0 lg:w-[56%] lg:max-w-4xl lg:flex-shrink-0">
          <div className="relative aspect-[3/2] w-full min-h-[280px]">
            <Image
              src="/images/Landkarte_sueddeutschland.webp"
              alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
              fill
              className="object-contain object-left"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(15, 79, 104, 0.12)) drop-shadow(0 6px 16px rgba(242, 249, 250, 1)) drop-shadow(0 12px 28px rgba(230, 243, 244, 0.95)) drop-shadow(0 4px 12px rgba(220, 238, 240, 0.9))",
              }}
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
            <div className="absolute inset-0 z-10">
              <KartenMarker />
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 px-4 sm:px-6 lg:max-w-md lg:flex-1 lg:px-8">
          <StandortSuche />
        </div>
      </div>
  );
}
