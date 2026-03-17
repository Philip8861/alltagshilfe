import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

export default function StandortePage() {
  return (
    <article
      className="min-h-[60vh] py-16 sm:py-24"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="flex w-full justify-start pl-0 pr-4">
        <div className="relative w-[70%] max-w-4xl bg-transparent">
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            width={1200}
            height={800}
            className="block h-auto w-full object-contain"
            style={{
              filter: "drop-shadow(0 12px 36px rgba(245, 250, 250, 1)) drop-shadow(0 6px 24px rgba(245, 250, 250, 0.98)) drop-shadow(0 4px 16px rgba(245, 250, 250, 0.95)) drop-shadow(0 2px 10px rgba(245, 250, 250, 0.9))",
            }}
            priority
            sizes="(max-width: 1024px) 70vw, 840px"
          />
        </div>
      </div>
    </article>
  );
}
