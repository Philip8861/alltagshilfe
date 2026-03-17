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
      <div className="mx-auto flex max-w-5xl justify-center px-4">
        <div className="relative w-[70%] bg-transparent">
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            width={1200}
            height={800}
            className="block h-auto w-full object-contain"
            style={{
              filter: "drop-shadow(0 4px 12px rgba(245, 250, 250, 0.85)) drop-shadow(0 2px 6px rgba(245, 250, 250, 0.7))",
            }}
            priority
            sizes="(max-width: 1024px) 70vw, 840px"
          />
        </div>
      </div>
    </article>
  );
}
