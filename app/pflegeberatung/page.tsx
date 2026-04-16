import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import {
  BetrieblichePflegeberatungFolgenBand,
  BetrieblichePflegeberatungVorteileVorStatistik,
  BetrieblichePflegeberatungWhiteIntro,
} from "@/components/pflegeberatung/BetrieblichePflegeberatungSection";
import {
  BetrieblichAngebotDialogProvider,
  BetrieblichAngebotOpenButton,
} from "@/components/pflegeberatung/BetrieblicheAngebotAnfrage";
import { siteConfig } from "@/config/site";

const BETRIEBLICH_HERO_BULLETS = [
  "Attraktiver Benefit zum Ausschreiben",
  "Mitarbeiterbindung stärken durch echte Fürsorge",
  "Wenn Pflege zum Thema wird, sind wir da.",
] as const;

function HeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] sm:h-10 sm:w-10 ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.2rem] w-[1.2rem] sm:h-[1.35rem] sm:w-[1.35rem]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

const HERO_BULLET_ANIM =
  "flex items-start gap-3 text-pretty text-lg font-semibold leading-snug text-[#0F4F68] opacity-0 motion-reduce:opacity-100 motion-reduce:animate-none animate-fade-in-up sm:items-center sm:text-xl";

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
  description: `Betriebliche Pflegeberatung für Unternehmen: Team entlasten, Fehlzeiten reduzieren, Mitarbeitende stärken – ${siteConfig.name}.`,
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
          {/* Weißer Streifen: Hero → Vorteile + „Was versteht man …“ (mint) → Statistik (weiß) → Folgen-Band */}
          <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-visible overflow-y-visible bg-white">
            <div className="relative w-full overflow-visible pt-8 sm:pt-10 lg:min-h-[min(100vw,480px)] lg:pt-10">
            <Container className="relative z-10">
              <header className="max-w-xl text-left lg:max-w-[min(100%,28rem)] lg:pr-4 xl:max-w-[32rem]">
                <h1
                  id="betrieblich-heading"
                  className="max-w-[24rem] text-balance text-[1.375rem] font-extrabold leading-snug tracking-tight text-[#0F4F68] sm:max-w-2xl sm:text-[1.65rem] sm:leading-tight lg:max-w-none lg:text-[clamp(1.5rem,0.6rem+1.4vw,2.75rem)] lg:leading-[1.12]"
                >
                  <span className="block">Betriebliche</span>
                  <span className="block">Pflegeberatung</span>
                </h1>
                <p className="mt-4 text-pretty text-lg font-semibold leading-snug text-[#0F4F68] sm:text-xl">
                  Entlasten Sie Ihr Team, reduzieren Sie Fehlzeiten und stärken Sie Ihre Mitarbeitenden.
                </p>
                <ul
                  className="mt-4 max-w-xl space-y-3 sm:mt-5 sm:space-y-3.5"
                  aria-label="Warum betriebliche Pflegeberatung für Ihr Unternehmen"
                >
                  {BETRIEBLICH_HERO_BULLETS.map((line, i) => (
                    <li
                      key={line}
                      className={HERO_BULLET_ANIM}
                      style={{ animationDelay: `${120 + i * 90}ms` }}
                    >
                      <HeroCheckIcon className="mt-0.5 sm:mt-0" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 max-w-md sm:mt-6">
                  <BetrieblichAngebotOpenButton className="w-full sm:w-auto" />
                </div>
              </header>
            </Container>

            {/* Bild: z über der Welle. Außenpadding für Badge-Schatten; innen nur Bildhöhe → bottom-0 = untere Bildkante */}
            <div className="relative z-10 mt-8 max-lg:px-0 overflow-visible px-1 sm:px-2 lg:pointer-events-none lg:absolute lg:right-0 lg:top-0 lg:z-20 lg:mt-0 lg:px-3">
              <div
                className="ml-auto overflow-visible pb-16 pt-1 sm:pb-20 sm:pt-2 lg:ml-0 lg:mr-0 lg:pb-24 lg:pt-2"
                style={imgBlockStyle}
              >
                <div className="relative isolate ml-auto leading-none [&_img]:block [&_img]:max-w-none">
                  <Image
                    src="/images/betriebliche_pflegeberatung.webp"
                    alt="Beratungsgespräch zur betrieblichen Pflegeberatung"
                    width={BETRIEBLICH_IMG.w}
                    height={BETRIEBLICH_IMG.h}
                    priority
                    sizes={`${IMG_W}px`}
                    className="relative z-0 block h-auto w-full max-w-none drop-shadow-[0_22px_48px_rgba(15,79,104,0.22)] drop-shadow-[0_10px_24px_rgba(15,79,104,0.14)]"
                  />
                  <p
                    className="pointer-events-auto absolute bottom-0 left-1/2 z-20 w-[min(calc(100vw-1.75rem),28rem)] -translate-x-1/2 translate-y-1/2 rounded-full border border-white/25 bg-[#0F4F68] px-[1.15rem] py-[0.65rem] text-center text-[1.05rem] font-bold leading-snug text-white shadow-[0_10px_28px_-4px_rgba(15,79,104,0.45),0_4px_12px_-2px_rgba(15,79,104,0.22)] sm:w-max sm:max-w-[min(calc(100vw-1.25rem),32rem)] sm:px-[1.4rem] sm:py-[0.85rem] sm:text-[1.14rem] md:px-[1.6rem] md:py-[1rem] md:text-[1.3rem]"
                    role="note"
                  >
                    Ihre Experten für Pflege seit 12 Jahren!
                  </p>
                </div>
              </div>
            </div>
            </div>

            <BetrieblichePflegeberatungVorteileVorStatistik />

            <Container className="relative z-10 bg-white pb-[calc(1.5rem+3cm)] sm:pb-[calc(2rem+3cm)]">
              <BetrieblichePflegeberatungWhiteIntro />
            </Container>
            <BetrieblichePflegeberatungFolgenBand />
          </div>
        </section>
      </article>
    </BetrieblichAngebotDialogProvider>
  );
}
