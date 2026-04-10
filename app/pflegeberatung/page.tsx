import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { BetrieblichePflegeberatungSection } from "@/components/pflegeberatung/BetrieblichePflegeberatungSection";
import { siteConfig } from "@/config/site";

/** Natürliche Pixelmaße von public/images/betriebliche_pflegeberatung.webp (Alpha-Kanal) */
const BETRIEBLICH_IMG = { w: 1053, h: 572 } as const;

const IMG_DROP_SHADOW =
  "[filter:drop-shadow(8px_12px_20px_rgba(15,79,104,0.2))_drop-shadow(6px_6px_14px_rgba(15,79,104,0.12))]";

export const metadata: Metadata = {
  title: "Betriebliche Pflegeberatung",
  description: `Betriebliche Pflegeberatung für Unternehmen: Mitarbeitende entlasten, Fehlzeiten reduzieren – ${siteConfig.name}.`,
};

export default function PflegeberatungPage() {
  return (
    <article className="pb-16 sm:pb-24">
      <section id="betriebliche-pflegeberatung" aria-labelledby="betrieblich-heading">
        <div className="border-b border-[#0F4F68]/8 bg-white pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-24">
          <Container>
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10 xl:gap-14">
              <header className="max-w-xl shrink-0 text-left lg:max-w-[min(100%,28rem)] lg:pt-2 xl:max-w-[32rem]">
                <h1
                  id="betrieblich-heading"
                  className="text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0F4F68] sm:text-4xl"
                >
                  <span className="block">Betriebliche</span>
                  <span className="block">Pflegeberatung</span>
                </h1>
                <p className="mt-4 text-lg font-semibold leading-snug text-[#0F4F68] sm:text-xl">
                  Arbeitnehmer entlasten. Fehlzeiten reduzieren.
                </p>
              </header>

              <div className="relative mx-auto w-max max-w-full shrink-0 lg:mx-0 lg:ml-auto lg:self-start">
                <div className="relative inline-block max-w-full">
                  <Image
                    src="/images/betriebliche_pflegeberatung.webp"
                    alt="Beratungsgespräch zur betrieblichen Pflegeberatung"
                    width={BETRIEBLICH_IMG.w}
                    height={BETRIEBLICH_IMG.h}
                    priority
                    sizes="(max-width: 1024px) 100vw, 1053px"
                    className={`relative z-0 h-auto w-[min(100%,1053px)] ${IMG_DROP_SHADOW} motion-reduce:filter-none`}
                  />
                  <p
                    className="absolute bottom-0 left-1/2 z-10 w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#0F4F68] px-4 py-2.5 text-center text-[0.8125rem] font-bold leading-snug text-white shadow-[0_8px_22px_rgba(15,79,104,0.35)] sm:w-max sm:max-w-[calc(100%+1rem)] sm:px-5 sm:text-sm md:text-base"
                    role="note"
                  >
                    Ihre Experten für Pflege seit 12 Jahren!
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container className="pt-12 sm:pt-16">
          <BetrieblichePflegeberatungSection />
        </Container>
      </section>
    </article>
  );
}
