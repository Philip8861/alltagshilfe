import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PflegeboxConfiguratorIframe } from "./PflegeboxConfiguratorIframe";

export const metadata: Metadata = {
  title: "Pflegebox-Konfigurator",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

/** Schatten am Motiv; kein zusätzlicher sichtbarer Rahmen um die Grafik (natives Bild inkl. weißem Innenrand). */
const heroImageShadowWrapperClass =
  "[filter:drop-shadow(0_16px_36px_rgba(15,79,104,0.22))_drop-shadow(0_6px_18px_rgba(15,79,104,0.14))]";

/**
 * Öffentliche URL: bewusst kleingeschrieben (Deployment auf Linux/Vercel ist case-sensitiv).
 * Datei liegt als `pflegebox1.webp` unter `public/images/`.
 */
const PFLEGEBOX_HERO_SRC = "/images/pflegebox1.webp";

export default function PflegeboxPage() {
  return (
    <div id="pflegebox-root" className="min-w-0 w-full max-w-full bg-[#f1f9fb]">
      <div className="flex w-full justify-center px-4 pb-2 pt-4 sm:pb-3 sm:pt-5">
        <div className="flex w-full max-w-2xl justify-center bg-[#f1f9fb] px-2 pb-10 pt-2 sm:pb-12">
          <div className={`mx-auto box-border max-w-full p-4 sm:p-8 ${heroImageShadowWrapperClass}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- statische Asset-URL wie Startseiten-Hero */}
            <img
              src={PFLEGEBOX_HERO_SRC}
              alt="Pflegebox – Abbildung der Produktbox"
              width={877}
              height={536}
              decoding="async"
              fetchPriority="high"
              className="mx-auto block h-auto max-h-[min(52.5vh,400px)] w-auto max-w-full object-contain object-center"
            />
          </div>
        </div>
      </div>
      <PflegeboxConfiguratorIframe />
    </div>
  );
}
