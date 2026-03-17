import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
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
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-flex-start lg:gap-10">
        <div className="relative w-full shrink-0 bg-transparent lg:w-[56%] lg:max-w-4xl">
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            width={1200}
            height={800}
            className="block h-auto w-full object-contain"
            style={{
              filter: "drop-shadow(0 3px 6px rgba(242, 249, 250, 1)) drop-shadow(0 6px 12px rgba(242, 249, 250, 0.95)) drop-shadow(0 2px 4px rgba(242, 249, 250, 0.9))",
            }}
            priority
            sizes="(max-width: 1024px) 100vw, 56vw"
          />
        </div>
        <div className="w-full min-w-0 lg:max-w-md lg:flex-1">
          <StandortSuche />
        </div>
      </Container>
    </article>
  );
}
