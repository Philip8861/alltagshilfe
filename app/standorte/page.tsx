import type { Metadata } from "next";
import Image from "next/image";
import { StandortSuche } from "@/components/standorte/StandortSuche";
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
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-flex-start lg:gap-10">
        <div className="relative w-full shrink-0 bg-transparent pl-0 lg:w-[56%] lg:max-w-4xl">
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            width={1200}
            height={800}
            className="block h-auto w-full object-contain object-left"
            style={{
              filter: "drop-shadow(0 4px 10px rgba(242, 249, 250, 1)) drop-shadow(0 8px 18px rgba(242, 249, 250, 0.98)) drop-shadow(0 3px 8px rgba(242, 249, 250, 0.95))",
            }}
            priority
            sizes="(max-width: 1024px) 100vw, 56vw"
          />
        </div>
        <div className="w-full min-w-0 px-4 sm:px-6 lg:max-w-md lg:flex-1 lg:px-8">
          <StandortSuche />
        </div>
      </div>
  );
}
