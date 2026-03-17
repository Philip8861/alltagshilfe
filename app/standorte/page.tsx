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
        <div
          className="relative overflow-hidden rounded-lg border-2 border-[#0F4F68]/20 bg-white"
          style={{
            boxShadow: "0 8px 24px rgba(245, 250, 250, 0.9), 0 4px 12px rgba(245, 250, 250, 0.7)",
          }}
        >
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            width={1200}
            height={800}
            className="block h-auto w-full object-contain"
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
        </div>
      </div>
    </article>
  );
}
