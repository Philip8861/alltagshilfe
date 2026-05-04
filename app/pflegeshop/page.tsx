import type { Metadata } from "next";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { ProtectedRasterMedia } from "@/components/home/ProtectedRasterMedia";
import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";
import { siteConfig } from "@/config/site";
import {
  buildStandortStyleFaq,
  standortFaqJsonLd,
  STANDORT_FAQ_LINK_CLASS,
} from "@/lib/standort-faq";
import { STARTSEITE_VORTEILE_INTRO } from "@/lib/startseite-vorteile";

const HAUSHALTSHILFE_FAQ_ANCHOR = "/leistungen/haushaltshilfe#haushalt-faq-heading";
const PLEGEBEDARF_URL = "https://deinPflegebedarf.de";
const PFLEGEBOX_KONFIGURATOR_HREF = "/pflegehilfsmittel/pflegebox-konfigurator";

/** Nur auf /pflegeshop – „Ihre Vorteile bei uns“ (Partnershop). */
const PFLEGESHOP_VORTEILE_BEI_UNS = [
  "Geprüfte Markenqualität",
  "Schneller und diskreter Versand",
  "Von Pflegekräften empfohlen",
  "Artikelfinder statt langes Suchen",
  "Versandkostenfrei ab 150 Euro",
  "Abo Modell ohne ständiges Nachbestellen",
] as const;

/** Natürliche Pixelmaße `public/images/pflegeshop_image.webp` (bei neuem Asset anpassen) */
const PFLEGESHOP_HERO_IMG = { w: 1099, h: 645 } as const;

const HERO_GLOW_CLASS =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]";

const STARTSEITE_FAQ_BG = "#FAFBFC";
const STARTSEITE_FAQ_WELLEN_D =
  "M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z";
const HERO_INTRO = {
  brand: "Pflegeshop & Inkontinenzversorgung",
  partnerLine:
    "Vertrauen Sie unserer Erfahrung. Wir helfen Ihnen, passende Pflegeartikel zu finden, und stehen Ihnen bei Fragen persönlich zur Seite.",
} as const;

export const metadata: Metadata = {
  title: "Pflegeshop & Inkontinenzversorgung",
  description: `Pflegehilfsmittel, Pflegebedarf online und Beratung zur Inkontinenzversorgung – mit deinPflegebedarf.de. ${siteConfig.name}.`,
};

export default function PflegeshopPage() {
  const faqItems = buildStandortStyleFaq(null);
  const faqJsonLd = standortFaqJsonLd(faqItems);

  return (
    <article className="flex min-h-[60vh] w-full max-w-[100vw] flex-col overflow-x-clip overflow-y-visible bg-[#fafbfc] pt-0 pb-0 text-neutral-700 antialiased">
      <div id="pflegeshop-hero" className="min-w-0 scroll-mt-24 overflow-x-clip overflow-y-visible">
        <section
          className="relative z-0 box-border mx-auto w-full min-w-0 max-w-7xl px-4 pb-10 pt-0 sm:px-6 sm:pb-16 lg:px-[var(--ahs-page-gutter)] lg:pb-[clamp(4rem,9vh+1.5rem,7rem)] lg:pt-[clamp(2rem,5vh+1.25rem,4.75rem)] xl:pb-[clamp(5rem,10vh+1.5rem,8rem)]"
          aria-label="Einstieg Pflegeshop und Inkontinenzversorgung"
        >
          <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-center lg:justify-items-stretch lg:gap-x-[clamp(1.5rem,3vw,3.25rem)] lg:gap-y-0">
            <div className="box-border w-full min-w-0 max-w-full space-y-[clamp(1.25rem,2vh+0.75rem,1.75rem)] lg:min-w-0 lg:justify-self-start lg:space-y-[clamp(1.15rem,1.6vh+0.7rem,1.75rem)] lg:-translate-x-[clamp(0.75rem,4.5vw,3rem)] lg:pr-0 motion-reduce:lg:translate-x-0">
              <h1
                className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(1.75rem,1.05rem+2.5vw,3rem)]"
                style={{ animationDelay: "0s" }}
              >
                <span className="block">{HERO_INTRO.brand}</span>
              </h1>
              <p
                className="mt-5 max-w-prose text-pretty text-lg font-normal leading-relaxed text-neutral-600 opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:mt-6 sm:text-xl lg:mt-0 lg:text-[clamp(1.05rem,0.85rem+0.42vw,1.3rem)]"
                style={{ animationDelay: "0.45s" }}
              >
                {HERO_INTRO.partnerLine}
              </p>
              <div
                className="pt-2 opacity-0 motion-reduce:opacity-100 animate-fade-in-up"
                style={{ animationDelay: "0.55s" }}
              >
                <a
                  href={PLEGEBEDARF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto lg:w-auto lg:px-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] lg:py-[clamp(0.6rem,0.45rem+0.45vw,0.9rem)] lg:text-[clamp(1rem,0.82rem+0.55vw,1.15rem)]"
                >
                  Direkt zum Pflegeshop
                  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="box-border w-full min-w-0 max-w-full lg:min-h-0 lg:translate-x-[clamp(0.75rem,5vw,3.5rem)] lg:justify-self-stretch lg:self-center motion-reduce:lg:translate-x-0">
              <div className="box-border flex justify-center overflow-x-visible bg-[#fafbfc] px-4 pt-3 pb-8 sm:px-8 sm:pt-4 sm:pb-10 lg:flex lg:justify-end lg:px-0 lg:pb-[clamp(1.75rem,3.5vh+0.75rem,3.25rem)] lg:pt-0">
                <div
                  className="mx-auto w-full min-w-0 max-w-[min(100%,72rem)] opacity-0 motion-reduce:opacity-100 animate-fade-in-up max-lg:flex max-lg:max-w-full max-lg:justify-center lg:ml-auto lg:w-full lg:max-w-full"
                  style={{ animationDelay: "0.08s" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- statisches Hero-Asset wie Haushaltshilfe-Landing */}
                  <img
                    src="/images/pflegeshop_image.webp"
                    alt="Pflegeshop: Sortiment an Pflegehilfsmitteln"
                    width={PFLEGESHOP_HERO_IMG.w}
                    height={PFLEGESHOP_HERO_IMG.h}
                    decoding="async"
                    fetchPriority="high"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1536px) 66vw, 1200px"
                    className={`box-border h-auto w-full max-w-full object-contain object-center lg:object-contain lg:object-right max-lg:mx-auto max-lg:origin-center max-lg:translate-x-0 max-lg:-translate-y-2 max-lg:scale-[1.05] max-lg:motion-reduce:scale-[1.05] ${HERO_GLOW_CLASS}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        id="qualitaetsversprechen-pflegeshop"
        className="relative z-20 scroll-mt-24 bg-white px-4 pt-[1.35rem] pb-10 sm:px-6 sm:pt-[2rem] sm:pb-12 lg:px-[var(--ahs-page-gutter)] lg:pt-[2rem] lg:pb-14"
        aria-labelledby="pflegeshop-qualitaet-heading"
      >
        <svg
          className="pointer-events-none absolute left-0 top-0 h-12 w-full -translate-y-[68%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M0,120 C320,28 880,28 1200,120 L1200,120 L0,120 Z"
            fill="#ffffff"
          />
        </svg>
        <div className="relative z-[1] mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2
            id="pflegeshop-qualitaet-heading"
            className="text-balance text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
          >
            Unser Qualitätsversprechen im Pflegeshop
          </h2>
          <p className="mt-6 max-w-prose text-pretty text-lg leading-relaxed text-neutral-600">
            Aus eigener Erfahrung wissen wir, worauf es im Pflegealltag wirklich ankommt. Deshalb finden Sie in unserem
            Pflegeshop nur Artikel, von denen wir selbst überzeugt sind und die sich im Alltag bewähren. Wir wählen unsere
            Produkte mit dem Blick aus der Praxis aus, damit Sie sich nicht durch unzählige Angebote kämpfen müssen.
          </p>
          <p className="mt-4 max-w-prose text-pretty text-lg leading-relaxed text-neutral-600">
            Mit unserem Konfigurator finden Sie schnell und einfach die passenden Pflegeartikel für Ihre persönliche
            Situation. So erhalten Sie genau die Produkte, die den Pflegealltag erleichtern, verständlich ausgewählt und mit
            Erfahrung empfohlen.
          </p>
          <div className="mt-8 w-full sm:w-auto">
            <Link
              href={PFLEGEBOX_KONFIGURATOR_HREF}
              className="inline-flex min-h-[44px] w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto"
            >
              Passende Pflegeartikel finden
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-20 mt-0 w-full bg-[#F2F9FA] px-4 pt-[1.35rem] pb-8 sm:px-6 sm:pt-[2rem] sm:pb-[2.4rem] lg:px-[var(--ahs-page-gutter)] lg:pt-[2rem] lg:pb-10">
        <svg
          className="pointer-events-none absolute left-0 top-0 h-12 w-full -translate-y-[68%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M0,120 C320,28 880,28 1200,120 L1200,120 L0,120 Z"
            fill="#F2F9FA"
          />
        </svg>
        <div className="relative z-[1] mx-auto w-full max-w-6xl">
          <h3 className="text-center text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl">
            Ihre Vorteile bei uns
          </h3>
          <p className="mx-auto mt-2 max-w-3xl text-center text-sm text-neutral-600 sm:text-base">
            {STARTSEITE_VORTEILE_INTRO}
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {PFLEGESHOP_VORTEILE_BEI_UNS.map((item) => (
              <li
                className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/75 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]"
                key={item}
              >
                <ProtectedRasterMedia className="inline-flex shrink-0 select-none [-webkit-user-drag:none]">
                  <img
                    src="/images/haken.webp"
                    alt=""
                    aria-hidden
                    width={38}
                    height={38}
                    draggable={false}
                    className="mt-0.5 h-[38px] w-[38px] object-contain"
                  />
                </ProtectedRasterMedia>
                <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <KundenstimmenCarousel protectImages />

      <section
        className="relative z-10 mt-10 overflow-x-clip pb-8 pt-[clamp(4rem,7vw+1.75rem,6.75rem)] sm:mt-12 sm:pb-10 sm:pt-[clamp(4.5rem,8vw+2rem,7.25rem)] lg:mt-14 lg:pb-10"
        style={{ backgroundColor: STARTSEITE_FAQ_BG }}
        aria-labelledby="pflegeshop-faq-heading"
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
              id="pflegeshop-faq-heading"
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
              {faqItems.map((item) => (
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
    </article>
  );
}
