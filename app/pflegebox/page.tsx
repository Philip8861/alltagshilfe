import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { PflegeboxConfiguratorIframe } from "./PflegeboxConfiguratorIframe";

export const metadata: Metadata = {
  title: "Pflegebox-Konfigurator",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

/** Gleicher Drop-Shadow-Effekt wie Hero-Bild auf der Startseite (`startseite_front.webp`). */
const heroImageDropShadowClass =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]";

export default function PflegeboxPage() {
  return (
    <div id="pflegebox-root" className="min-w-0 w-full max-w-full bg-[#f1f9fb]">
      <div className="flex w-full justify-center px-4 pb-1 pt-3 sm:pb-2 sm:pt-4">
        <div className="relative flex h-[min(26vh,200px)] w-full max-w-[min(100%,28rem)] items-end justify-center overflow-hidden bg-[#f1f9fb] sm:h-[min(30vh,240px)]">
          <Image
            src="/images/Pflegebox.webp"
            alt="Pflegebox – Abbildung der Produktbox"
            width={720}
            height={480}
            className={`max-h-full w-auto max-w-full object-contain object-bottom ${heroImageDropShadowClass}`}
            sizes="(max-width: 640px) 100vw, 28rem"
            priority
            unoptimized
          />
        </div>
      </div>
      <PflegeboxConfiguratorIframe />
    </div>
  );
}
