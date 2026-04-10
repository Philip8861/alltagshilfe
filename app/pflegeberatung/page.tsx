import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { BetrieblichePflegeberatungSection } from "@/components/pflegeberatung/BetrieblichePflegeberatungSection";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Betriebliche Pflegeberatung",
  description: `Betriebliche Pflegeberatung für Unternehmen: Mitarbeitende entlasten, Fehlzeiten reduzieren – ${siteConfig.name}.`,
};

export default function PflegeberatungPage() {
  return (
    <article className="pb-16 sm:pb-24">
      <section id="betriebliche-pflegeberatung" aria-labelledby="betrieblich-heading">
        <div className="border-b border-[#0F4F68]/8 bg-white pb-12 pt-8 sm:pb-16 sm:pt-10">
          <Container>
            <div className="flex justify-center lg:justify-end">
              <div className="flex w-full max-w-xl flex-col items-center text-center lg:max-w-[min(100%,30rem)] lg:items-end lg:text-right xl:max-w-[34rem]">
                <h1
                  id="betrieblich-heading"
                  className="text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0F4F68] sm:text-4xl"
                >
                  <span className="block">Betriebliche</span>
                  <span className="block">Pflegeberatung</span>
                </h1>
                <p className="mt-4 max-w-md text-lg font-semibold leading-snug text-[#0F4F68] sm:text-xl lg:ml-auto lg:max-w-lg">
                  Arbeitnehmer entlasten. Fehlzeiten reduzieren.
                </p>
                <div className="relative mt-10 w-full max-w-[min(100%,28rem)] lg:max-w-none">
                  <p
                    className="absolute left-1/2 top-0 z-20 w-[min(calc(100vw-2rem),22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F78F2E] bg-[#0F4F68] px-3 py-2 text-center text-[0.8125rem] font-bold leading-snug text-white shadow-[0_10px_28px_rgba(15,79,104,0.38)] sm:w-auto sm:max-w-[90%] sm:px-5 sm:py-2.5 sm:text-sm md:text-base md:leading-tight"
                    role="note"
                  >
                    Ihre Experten für Pflege seit 12 Jahren!
                  </p>
                  <Image
                    src="/images/betriebliche_pflegeberatung.webp"
                    alt="Beratungsgespräch zur betrieblichen Pflegeberatung"
                    width={1200}
                    height={900}
                    priority
                    className="relative z-0 h-auto w-full rounded-2xl object-cover object-center shadow-[0_22px_55px_-14px_rgba(15,79,104,0.42),0_12px_28px_-8px_rgba(15,79,104,0.22)] ring-1 ring-[#0F4F68]/12"
                    sizes="(max-width: 1024px) min(100vw - 2rem, 28rem), 34rem"
                  />
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
