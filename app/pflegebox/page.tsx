import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PflegeboxConfiguratorIframe } from "./PflegeboxConfiguratorIframe";

export const metadata: Metadata = {
  title: "Pflegebox-Konfigurator",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

/** Gleicher Drop-Shadow-Effekt wie Hero-Bild auf der Startseite (`startseite_front.webp`). */
const heroImageDropShadowClass =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))]";

/**
 * Öffentliche URL: bewusst kleingeschrieben (Deployment auf Linux/Vercel ist case-sensitiv).
 * Datei liegt als `pflegebox.webp` unter `public/images/`.
 */
const PFLEGEBOX_HERO_SRC = "/images/pflegebox.webp";

export default function PflegeboxPage() {
  return (
    <div id="pflegebox-root" className="min-w-0 w-full max-w-full bg-[#f1f9fb]">
      <div className="flex w-full justify-center px-4 pb-2 pt-4 sm:pb-3 sm:pt-5">
        {/* kein overflow-hidden: sonst wird drop-shadow abgeschnitten; natives img: zuverlässig aus /public */}
        <div className="flex w-full max-w-xl justify-center bg-[#f1f9fb] px-2 pb-6 pt-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- statische Asset-URL wie Startseiten-Hero */}
          <img
            src={PFLEGEBOX_HERO_SRC}
            alt="Pflegebox – Abbildung der Produktbox"
            width={720}
            height={480}
            decoding="async"
            fetchPriority="high"
            className={`h-auto max-h-[min(42vh,320px)] w-auto max-w-full object-contain object-center ${heroImageDropShadowClass}`}
          />
        </div>
      </div>
      <PflegeboxConfiguratorIframe />
    </div>
  );
}
