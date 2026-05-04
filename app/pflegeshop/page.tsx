import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { ProtectedRasterMedia } from "@/components/home/ProtectedRasterMedia";
import { HilfefinderOpenButton, HilfefinderProvider } from "@/components/home/StartEinstiegsHilfe";
import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";
import { siteConfig } from "@/config/site";
import {
  buildStandortStyleFaq,
  standortFaqJsonLd,
  STANDORT_FAQ_LINK_CLASS,
} from "@/lib/standort-faq";
import { STARTSEITE_VORTEILE, STARTSEITE_VORTEILE_INTRO } from "@/lib/startseite-vorteile";

const HAUSHALTSHILFE_FAQ_ANCHOR = "/leistungen/haushaltshilfe#haushalt-faq-heading";
const PLEGEBEDARF_URL = "https://deinPflegebedarf.de";

/** Natürliche Pixelmaße von `public/images/pflegeshop_image.webp` (Originalgröße im Layout) */
const PFLEGESHOP_HERO_IMG = { w: 1901, h: 806 } as const;

const STARTSEITE_FAQ_BG = "#FAFBFC";
const STARTSEITE_FAQ_WELLEN_D =
  "M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z";
const HERO_INTRO = {
  brand: "Pflegeshop",
  taglineLines: [
    "Pflegehilfsmittel und mehr für zu Hause",
    "In Kooperation mit deinPflegebedarf.de",
    "Beratung zu Kostenübernahme und Pflegekasse",
  ],
  partnerLine:
    "Bestellen Sie bequem online – wir stehen Ihnen bei Fragen zu Leistungen und Anträgen weiterhin persönlich zur Seite.",
} as const;

export const metadata: Metadata = {
  title: "Pflegeshop",
  description: `Pflegehilfsmittel und Pflegebedarf online – unser Pflegeshop mit deinPflegebedarf.de. ${siteConfig.name}.`,
};

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

export default function PflegeshopPage() {
  const faqItems = buildStandortStyleFaq(null);
  const faqJsonLd = standortFaqJsonLd(faqItems);

  return (
    <article className="flex min-h-[60vh] w-full max-w-[100vw] flex-col overflow-x-clip bg-white pt-0 pb-0">
      <section className="box-border w-full pt-0 pb-6 sm:pb-8 lg:pb-[clamp(1.5rem,2vw+0.75rem,2.5rem)]">
        <div className="relative w-full px-3 sm:px-4 md:px-[5cm]" aria-label="Einstieg Pflegeshop">
          <HilfefinderProvider>
            <div className="relative isolate flex w-full flex-col overflow-hidden rounded-b-3xl bg-transparent md:relative md:block md:min-h-[28.125rem] lg:min-h-[30.46875rem]">
              <div
                className="pointer-events-none relative z-0 w-full shrink-0 overflow-hidden max-md:px-4 max-md:pt-4 max-md:pb-2 sm:max-md:px-6 md:absolute md:inset-0 md:flex md:min-h-[28.125rem] md:items-center md:justify-center md:px-6 md:py-6 lg:min-h-[30.46875rem] lg:px-[var(--ahs-page-gutter)] lg:py-8"
                aria-hidden
              >
                <ProtectedRasterMedia className="relative mx-auto block w-full max-w-full select-none [-webkit-user-drag:none] md:max-w-[1901px]">
                  <Image
                    src="/images/pflegeshop_image.webp"
                    alt="Pflegeshop: Sortiment an Pflegehilfsmitteln"
                    width={PFLEGESHOP_HERO_IMG.w}
                    height={PFLEGESHOP_HERO_IMG.h}
                    className="h-auto w-full max-w-[1901px] rounded-2xl md:rounded-3xl"
                    sizes="(min-width: 1536px) 1901px, (min-width: 768px) min(1901px, calc(100vw - 10cm - 3rem)), calc(100vw - 2rem)"
                    quality={92}
                    priority
                  />
                </ProtectedRasterMedia>
              </div>
              <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 pb-5 pt-5 max-md:bg-transparent sm:px-6 md:absolute md:inset-0 md:min-h-[28.125rem] md:pb-4 md:pt-7 lg:min-h-[30.46875rem] lg:px-[var(--ahs-page-gutter)] lg:pb-5 lg:pt-8">
                <header className="max-w-lg text-left sm:max-w-xl lg:max-w-[min(42vw,clamp(22rem,32vw+8rem,30rem))] xl:max-w-[min(38vw,clamp(23rem,28vw+9rem,31rem))] 2xl:max-w-[min(34vw,clamp(24rem,26vw+10rem,32rem))]">
                  <h1
                    className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(2rem,1.05rem+2.6vw,3rem)]"
                    style={{ animationDelay: "0s" }}
                  >
                    {HERO_INTRO.brand}
                  </h1>
                  <ul
                    className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5 lg:space-y-[clamp(0.65rem,0.35rem+0.9vw,1rem)]"
                    aria-label="Vorteile Pflegeshop auf einen Blick"
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
                    className="mt-4 max-w-prose text-pretty text-lg font-normal leading-relaxed text-neutral-600 opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:mt-5 sm:text-xl lg:text-[clamp(1.05rem,0.85rem+0.42vw,1.3rem)]"
                    style={{ animationDelay: "1.22s" }}
                  >
                    {HERO_INTRO.partnerLine}
                  </p>
                  <div className="mt-3 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center sm:mt-4">
                    <HilfefinderOpenButton className="w-full min-[420px]:w-auto" />
                    <a
                      href={PLEGEBEDARF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full min-h-[48px] min-[420px]:w-auto items-center justify-center gap-2 rounded-xl border-2 border-[#0F4F68] bg-white px-5 py-3 text-sm font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:text-base"
                    >
                      Zum Sortiment auf deinPflegebedarf.de
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
                </header>
              </div>
            </div>
          </HilfefinderProvider>
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
            {STARTSEITE_VORTEILE.map((item) => (
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
