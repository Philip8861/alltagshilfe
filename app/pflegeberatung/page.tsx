import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { BetrieblichePflegeberatungSection } from "@/components/pflegeberatung/BetrieblichePflegeberatungSection";
import {
  BetrieblichAngebotDialogProvider,
  BetrieblichAngebotOpenButton,
} from "@/components/pflegeberatung/BetrieblicheAngebotAnfrage";
import { siteConfig } from "@/config/site";

/** Natürliche Pixelmaße von public/images/betriebliche_pflegeberatung.webp (Quelle: konfigurator/betriebliche.webp, Alpha) */
const BETRIEBLICH_IMG = { w: 1031, h: 549 } as const;
/** 20 % kleiner als Original */
const IMG_SCALE = 0.8;
const IMG_W = Math.round(BETRIEBLICH_IMG.w * IMG_SCALE);

const imgBlockStyle = {
  width: `min(100vw, ${IMG_W}px)` as const,
  maxWidth: `min(100vw, ${IMG_W}px)` as const,
};

export const metadata: Metadata = {
  title: "Betriebliche Pflegeberatung",
  description: `Betriebliche Pflegeberatung für Unternehmen: Mitarbeitende entlasten, Fehlzeiten reduzieren – ${siteConfig.name}.`,
};

export default function PflegeberatungPage() {
  return (
    <BetrieblichAngebotDialogProvider>
      <article className="pb-16 sm:pb-24">
        <section
          id="betriebliche-pflegeberatung"
          aria-labelledby="betrieblich-heading"
          className="scroll-mt-[var(--ahs-header-scroll-padding)]"
        >
          {/* Oberer Bereich inkl. Welle: eine Fläche ohne zusätzliche Kante zwischen Hero und Markenfarbe */}
          <div
            className="relative w-full overflow-visible bg-gradient-to-b from-white from-[20%] via-[#fafcfd] via-[55%] to-[#eef7f9] pt-8 sm:pt-10 lg:min-h-[min(100vw,480px)] lg:pt-10"
          >
            <Container className="relative z-10">
              <header className="max-w-xl text-left lg:max-w-[min(100%,28rem)] lg:pr-4 xl:max-w-[32rem]">
                <h1
                  id="betrieblich-heading"
                  className="max-w-[24rem] text-balance text-[1.375rem] font-extrabold leading-snug tracking-tight text-[#0F4F68] sm:max-w-2xl sm:text-[1.65rem] sm:leading-tight lg:max-w-none lg:text-[clamp(1.5rem,0.6rem+1.4vw,2.75rem)] lg:leading-[1.12]"
                >
                  <span className="block">Betriebliche</span>
                  <span className="block">Pflegeberatung</span>
                </h1>
                <p className="mt-4 text-lg font-semibold leading-snug text-[#0F4F68] sm:text-xl">
                  Arbeitnehmer entlasten. Fehlzeiten reduzieren.
                </p>
                <div className="mt-5 max-w-md">
                  <BetrieblichAngebotOpenButton className="w-full sm:w-auto" />
                </div>
              </header>
            </Container>

            {/* Bild: z über der Welle, sonst verdeckt die gefüllte SVG-Welle das Badge unten */}
            <div className="relative z-10 mt-8 max-lg:px-0 overflow-visible lg:pointer-events-none lg:absolute lg:right-0 lg:top-0 lg:z-20 lg:mt-0">
              <div
                className="relative isolate ml-auto leading-none pb-16 sm:pb-20 lg:ml-0 lg:mr-0 lg:pb-24 [&_img]:block [&_img]:max-w-none [&_img]:shadow-none"
                style={imgBlockStyle}
              >
                <Image
                  src="/images/betriebliche_pflegeberatung.webp"
                  alt="Beratungsgespräch zur betrieblichen Pflegeberatung"
                  width={BETRIEBLICH_IMG.w}
                  height={BETRIEBLICH_IMG.h}
                  priority
                  sizes={`${IMG_W}px`}
                  className="relative z-0 block h-auto w-full max-w-none shadow-none"
                />
                <p
                  className="pointer-events-auto absolute bottom-0 left-1/2 z-20 w-[min(calc(100vw-1rem),28rem)] -translate-x-1/2 translate-y-1/2 rounded-full border border-white/25 bg-[#0F4F68] px-[1.15rem] py-[0.65rem] text-center text-[1.05rem] font-bold leading-snug text-white shadow-[0_10px_28px_-4px_rgba(15,79,104,0.45),0_4px_12px_-2px_rgba(15,79,104,0.22)] sm:w-max sm:max-w-[min(calc(100vw-0.5rem),32rem)] sm:px-[1.4rem] sm:py-[0.85rem] sm:text-[1.14rem] md:px-[1.6rem] md:py-[1rem] md:text-[1.3rem]"
                  role="note"
                >
                  Ihre Experten für Pflege seit 12 Jahren!
                </p>
              </div>
            </div>

            {/* Welle hinten (z-0), damit Badge-Schatten und Pill nicht von der SVG-Fläche übermalt werden */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden overflow-y-visible leading-none">
              <svg
                className="relative z-[1] -mb-px block h-12 w-full shrink-0 text-[#E8F2F5] sm:h-[3.75rem]"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M0,55 C240,18 480,92 720,48 C960,4 1200,78 1440,42 L1440,100 L0,100 Z"
                />
              </svg>
            </div>
          </div>

          <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-hidden bg-gradient-to-b from-[#E8F2F5] via-[#F0F8FA] to-[#E5F2F6] pb-16 sm:pb-20">
            <Container className="pt-10 sm:pt-14">
              <BetrieblichePflegeberatungSection />
            </Container>
          </div>
        </section>
      </article>
    </BetrieblichAngebotDialogProvider>
  );
}
