import Image from "next/image";
import Link from "next/link";
import { LeistungenKachelGrid } from "@/components/home/LeistungenKachelGrid";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { StartEinstiegsHilfe } from "@/components/home/StartEinstiegsHilfe";
import { StandortNummerEinsReveal } from "@/components/standorte/StandortNummerEinsReveal";
import { StandortWechselBild } from "@/components/standorte/StandortWechselBild";
import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";
import {
  buildStandortStyleFaq,
  standortFaqJsonLd,
  STANDORT_FAQ_LINK_CLASS,
} from "@/lib/standort-faq";
import { STARTSEITE_VORTEILE, STARTSEITE_VORTEILE_INTRO } from "@/lib/startseite-vorteile";

const HAUSHALTSHILFE_FAQ_ANCHOR = "/leistungen/haushaltshilfe#haushalt-faq-heading";

/** Hintergrund FAQ-Bereich (Startseite), inkl. Wellenfüllung */
const STARTSEITE_FAQ_BG = "#f0f9fa";

const STARTSEITE_FAQ_WELLEN_D =
  "M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z";

const HERO_INTRO = {
  brand: "Alltagshilfe-Süd",
  taglineLines: [
    "Kostenübernahme ab Pflegegrad 1 möglich",
    "Zugelassen bei allen Krankenkassen",
    "Freie Kapazitäten, kurze Wartezeit",
  ],
  partnerLine:
    "Ihr verlässlicher Partner für Haushaltshilfe, Alltagsbegleitung, Pflegeberatung und Pflegehilfsmittel.",
} as const;

function HeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5"
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

const STARTSEITE_LEISTUNGEN_INTRO = {
  heading: "Mit viel Herz und Engagement sind wir für Sie da.",
  text: "Was uns besonders wichtig ist: Wir möchten dazu beitragen, dass Sie Ihren Alltag so lange wie möglich selbstbestimmt gestalten und in Ihrem vertrauten Zuhause bleiben können. Unsere Unterstützung orientiert sich dabei an Ihren individuellen Bedürfnissen und Ihrer persönlichen Lebenssituation.",
};

const HEADING_CLASS =
  "text-3xl font-bold text-[#0F4F68] sm:text-4xl w-full max-w-lg self-start";
const INTRO_BODY_CLASS = "text-lg text-neutral-700 leading-relaxed sm:text-xl";

export default function HomePage() {
  const startseiteFaq = buildStandortStyleFaq(null);
  const startseiteFaqJsonLd = standortFaqJsonLd(startseiteFaq);

  return (
    <article
      className="flex min-h-[60vh] w-full max-w-[100vw] flex-col overflow-x-clip pt-0 pb-0"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <section className="box-border w-full pt-0 pb-6 sm:pb-8 lg:pb-[clamp(1.5rem,2vw+0.75rem,2.5rem)]">
        <div className="box-border mx-auto w-full min-w-0 max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
          {/* Bild rechts bis an den Viewport-Rand (lg:mr calc), Text links (Desktop) */}
          <div className="relative min-w-0">
            <div className="flex min-w-0 justify-end">
              <div
                className="relative ml-auto w-full min-w-0 max-w-full -mr-4 opacity-0 animate-fade-in-up motion-reduce:opacity-100 sm:-mr-6 lg:mr-[calc((100vw-100%)/-2)] lg:max-w-[min(88vw,min(100%,52rem))]"
                style={{ animationDelay: "0.08s" }}
              >
                <div className="w-full">
                  {/* Hero: unoptimized — Next/Image-Wrapper würde die feste horizontale Einordnung verschieben. */}
                  <Image
                    src="/images/startseite_front.webp"
                    alt="Gemeinsam zur passenden Unterstützung im Alltag"
                    width={900}
                    height={700}
                    sizes="(max-width: 1023px) 100vw, (max-width: 1400px) 88vw, 900px"
                    className="box-border block h-auto w-full max-w-full object-contain object-right [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <div
              className="relative z-10 mt-8 max-w-lg text-left sm:max-w-xl lg:absolute lg:left-0 lg:right-auto lg:top-[clamp(34%,calc(33%+0.35vw),40%)] lg:mt-0 lg:w-full lg:max-w-none lg:-translate-y-1/2 lg:-translate-x-[5%]"
            >
              <header className="text-left lg:max-w-[min(42vw,clamp(22rem,32vw+8rem,30rem))] xl:max-w-[min(38vw,clamp(23rem,28vw+9rem,31rem))] 2xl:max-w-[min(34vw,clamp(24rem,26vw+10rem,32rem))]">
                <h1
                  className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(2rem,1.05rem+2.6vw,3rem)]"
                  style={{ animationDelay: "0s" }}
                >
                  {HERO_INTRO.brand}
                </h1>
                <ul
                  className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5 lg:space-y-[clamp(0.65rem,0.35rem+0.9vw,1rem)]"
                  aria-label="Ihre Vorteile auf einen Blick"
                >
                  {HERO_INTRO.taglineLines.map((line, i) => (
                    <li
                      key={line}
                      className="flex items-center gap-3 text-pretty text-lg font-semibold leading-snug text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-xl lg:text-[clamp(1.05rem,0.82rem+0.5vw,1.35rem)]"
                      style={{
                        animationDelay: `${0.68 + i * 0.26}s`,
                      }}
                    >
                      <HeroCheckIcon />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-5 max-w-prose text-pretty text-lg font-normal leading-relaxed text-neutral-600 opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:mt-6 sm:text-xl lg:text-[clamp(1.05rem,0.85rem+0.42vw,1.3rem)]"
                  style={{ animationDelay: "1.22s" }}
                >
                  {HERO_INTRO.partnerLine}
                </p>
              </header>
            </div>
          </div>

          <div className="lg:-mt-[clamp(6%,8vw,10%)] lg:-translate-x-[5%]">
            <StartEinstiegsHilfe />
          </div>
        </div>
      </section>

      <section className="relative z-20 mt-2 w-full bg-[#F2F9FA] px-4 pt-[1.6rem] pb-8 sm:mt-4 sm:px-6 sm:pt-[2.4rem] sm:pb-[2.4rem] lg:px-[var(--ahs-page-gutter)]">
        <svg
          className="pointer-events-none absolute left-0 top-0 h-12 w-full -translate-y-[68%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
        </svg>
        <div className="mx-auto w-full max-w-6xl">
          <LeistungenKachelGrid
            id="unsere-leistungen"
            heading="Unsere Leistungen im Überblick"
            subtitle="Persönlich, zuverlässig und mit viel Herz im Alltag."
            headingClassName="scroll-mt-[calc(2.45rem+var(--ahs-header-white-min-height)+0.75rem)]"
          />
        </div>
      </section>

      <section className="relative z-20 mt-12 w-full px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-[var(--ahs-page-gutter)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:gap-8 lg:gap-10">
          <div className="relative z-20 order-3 flex w-full max-w-full justify-center pb-2 pt-1 sm:order-1 lg:w-[50%] lg:max-w-3xl lg:shrink-0 lg:justify-center lg:px-6 lg:pb-4 lg:pt-2 sm:px-4">
            <div className="w-full max-w-full" style={{ width: "min(491px, calc(100vw - 3rem))" }}>
              <div>
                <StandortWechselBild
                  alt="Betreuung und Zuwendung: Team Alltagshilfe-Süd mit Seniorin im Freien"
                  sizes="(max-width: 640px) min(491px, 88vw), 491px"
                />
              </div>
            </div>
          </div>

          <StandortNummerEinsReveal className="order-1 w-full min-w-0 px-4 sm:order-2 sm:px-6 lg:flex-1 lg:max-w-lg lg:self-start lg:px-[var(--ahs-page-gutter)]">
            <h2 className={HEADING_CLASS}>{STARTSEITE_LEISTUNGEN_INTRO.heading}</h2>
            <p className={INTRO_BODY_CLASS}>{STARTSEITE_LEISTUNGEN_INTRO.text}</p>
          </StandortNummerEinsReveal>
        </div>
      </section>

      <section className="relative z-20 mt-12 w-full px-4 sm:mt-14 sm:px-6 lg:mt-16 lg:px-[var(--ahs-page-gutter)]">
        <div className="mx-auto w-full max-w-6xl">
          <h3 className="text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl">Ihre Vorteile bei uns</h3>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600 sm:text-base">{STARTSEITE_VORTEILE_INTRO}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {STARTSEITE_VORTEILE.map((item) => (
              <li className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/75 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]" key={item}>
                <img src="/images/haken.webp" alt="" aria-hidden width={38} height={38} className="mt-0.5 h-[38px] w-[38px] shrink-0 object-contain" />
                <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <KundenstimmenCarousel />

      <section
        className="relative z-10 mt-10 overflow-x-clip pb-8 pt-[clamp(4rem,7vw+1.75rem,6.75rem)] sm:mt-12 sm:pb-10 sm:pt-[clamp(4.5rem,8vw+2rem,7.25rem)] lg:mt-14 lg:pb-10"
        style={{ backgroundColor: STARTSEITE_FAQ_BG }}
        aria-labelledby="startseite-faq-heading"
      >
        <svg
          className="pointer-events-none absolute left-0 top-0 z-0 h-12 w-full -translate-y-[68%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path d={STARTSEITE_FAQ_WELLEN_D} fill={STARTSEITE_FAQ_BG} />
        </svg>
        <div className="relative z-[1] mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
          <RevealOnScroll>
            <h2
              id="startseite-faq-heading"
              className="text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
            >
              Häufige Fragen
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-medium text-[#0F4F68]/85 sm:text-base">
              Antworten zu Region, Leistungen, Kosten, Kasse, Entlastungsbetrag und Ablauf – ergänzend zur{" "}
              <Link href={HAUSHALTSHILFE_FAQ_ANCHOR} className={STANDORT_FAQ_LINK_CLASS}>
                FAQ Haushaltshilfe
              </Link>
              .
            </p>
          </RevealOnScroll>
          <RevealOnScroll delayMs={100}>
            <div className="mt-8 space-y-3 sm:mt-10">
              {startseiteFaq.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_2px_16px_rgba(15,79,104,0.06)] transition hover:border-[#F78F2E]/35 hover:shadow-[0_8px_28px_rgba(15,79,104,0.1)] open:border-[#0F4F68]/18 open:shadow-[0_10px_32px_rgba(15,79,104,0.12)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-[#0F4F68] sm:px-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-base font-semibold leading-snug sm:text-[1.05rem]">{item.q}</span>
                    <span
                      className="inline-flex shrink-0 rounded-full bg-[#F78F2E]/12 p-1.5 text-[#F78F2E] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="border-t border-[#0F4F68]/8 px-4 pb-4 pt-2 text-pretty text-sm leading-relaxed text-neutral-600 sm:px-5 sm:text-base">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </RevealOnScroll>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(startseiteFaqJsonLd) }}
        />
      </section>
    </article>
  );
}
