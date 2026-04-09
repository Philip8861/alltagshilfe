import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { PflegegradBeratungTable } from "@/components/pflegeberatung/PflegegradBeratungTable";
import { PRIVATE_PFLEGEBERATUNG_FAQ } from "@/lib/private-pflegeberatung-faq";
import { siteConfig } from "@/config/site";

const PAGE_PATH = "/pflegeberatung/private-pflegeberatung";

/** Wie Startseite – Schrift erbt von Root-Layout (Nunito Sans am body) */
const HEADING_CLASS = "text-3xl font-bold text-[#0F4F68] sm:text-4xl w-full max-w-lg self-start";
const INTRO_BODY_CLASS = "text-lg text-neutral-700 leading-relaxed sm:text-xl";
const SECTION_TITLE_CLASS = "text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl";
/* Positiver X-Offset: Schatten weniger nach links (sonst bei html overflow-x:clip am linken Rand abgeschnitten) */
const HERO_IMG_BASE =
  "block h-auto w-full max-w-full object-contain [filter:drop-shadow(8px_12px_20px_rgba(15,79,104,0.18))_drop-shadow(6px_6px_14px_rgba(15,79,104,0.1))] [will-change:filter]";

export const metadata: Metadata = {
  title: "Private Pflegeberatung nach Paragraf 37 Absatz 3 SGB XI",
  description:
    "Private Pflegeberatung nach SGB XI: kostenlos über die Pflegekasse, mit Erinnerungssystem und fester Ansprechperson.",
  alternates: { canonical: PAGE_PATH },
};

const VORTEILE = [
  "Wir erinnern Sie verlässlich an alle bevorstehenden Termine",
  "Wir schicken Ihnen ausschließlich hoch qualifizierte Pflegeberater und Pflegeberaterinnen",
  "Schnelle Terminvergabe ganz ohne lange Wartezeiten",
  "Es entstehen für Sie keinerlei Kosten, die Krankenkasse übernimmt diese komplett",
  "Wir helfen Ihnen tatkräftig bei Formularen, Anträgen und auch bei einem komplexen Widerspruch",
  "Sie profitieren von einem engen Kontakt und behalten stets Ihre gleichbleibende feste Ansprechperson",
  "Maximale Flexibilität: Jede zweite Beratung kann ganz bequem per Videocall stattfinden",
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRIVATE_PFLEGEBERATUNG_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

/** Wellen-Übergang wie auf der Startseite */
function WelleObenF2F9FA() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 h-12 w-full -translate-y-[68%] sm:h-16"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
    </svg>
  );
}

export default function PrivatePflegeberatungPage() {
  return (
    <article className="overflow-x-visible pb-0 sm:pb-0" style={{ backgroundColor: "#fafbfc" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="overflow-visible bg-white">
        <div className="mx-auto max-w-7xl overflow-visible px-4 py-12 sm:px-6 sm:py-16 lg:px-[var(--ahs-page-gutter)] lg:py-20">
          <div className="flex flex-col gap-10 overflow-visible lg:flex-row lg:items-start lg:gap-x-8 lg:gap-y-8 xl:gap-x-12">
            <div className="flex w-full min-w-0 shrink-0 justify-start overflow-visible lg:max-w-[min(100%,33.8rem)] xl:max-w-[min(100%,39rem)]">
              <div className="box-content w-full max-w-full overflow-visible py-6 pr-2 pl-0 sm:py-8 sm:pr-4 lg:py-6 lg:pr-6">
                {/* eslint-disable-next-line @next/next/no-img-element -- natives img vermeidet Next/Image-Wrapper (overflow) */}
                <img
                  src="/images/pflegeberatung_gemeinsam.webp"
                  alt="Pflegeberatung – Gemeinsam im Gespräch mit Zeit und Vertrauen"
                  width={1200}
                  height={900}
                  decoding="async"
                  fetchPriority="high"
                  className={`${HERO_IMG_BASE} h-auto w-full max-w-full object-contain object-left`}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 overflow-visible pt-0 text-left lg:min-w-[min(100%,22rem)] lg:pt-2 xl:min-w-[24rem]">
              <div className="min-w-0 max-w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:thin] lg:overflow-x-visible">
                <h1 className="whitespace-nowrap text-[clamp(0.8125rem,0.65vw+0.55rem,2.5rem)] font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-[clamp(0.875rem,0.85vw+0.5rem,2.5rem)] lg:text-[clamp(1.35rem,0.55rem+1.25vw,2.5rem)] lg:leading-[1.12]">
                  Pflegeberatung nach Paragraf 37 Absatz 3 SGB XI
                </h1>
              </div>
              <p className="mt-5 w-full max-w-none text-pretty text-lg font-medium leading-normal text-[#0F4F68] sm:text-xl md:text-2xl md:leading-snug">
                Gute Pflege beginnt mit einer guten Pflegeberatung.
              </p>
              <div className="mt-8">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#F78F2E] px-7 py-3.5 text-[1.09375rem] font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:min-h-14 sm:px-8 sm:py-4 sm:text-lg"
                >
                  Termin vereinbaren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        className="relative z-10 mt-0 w-full bg-[#F2F9FA] px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-[var(--ahs-page-gutter)] lg:pb-16 lg:pt-14"
        aria-labelledby="versprechen-heading"
      >
        <WelleObenF2F9FA />
        <div className="relative mx-auto w-full max-w-6xl">
          <h2 id="versprechen-heading" className={HEADING_CLASS}>
            Unser Versprechen an Sie
          </h2>
          <p className={`mt-6 max-w-3xl ${INTRO_BODY_CLASS}`}>
            Die Qualität unserer Pflegeberatung liegt uns besonders am Herzen. Sehr viele pflegende Angehörige wissen nicht
            genau, welche gesetzlichen Leistungen ihnen eigentlich zustehen. Oftmals wird man im Internet falsch oder
            unzureichend informiert. Wir machen das anders: Wir nehmen uns die nötige Zeit für Sie. Unser Ziel ist es, Sie
            umfassend und detailliert zu informieren, damit Sie im Alltag optimal entlastet werden.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16" aria-labelledby="vorteile-heading">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
          <h2 id="vorteile-heading" className={SECTION_TITLE_CLASS}>
            Unsere Vorteile
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-600 sm:text-base">
            Verlässlich, transparent und nah bei Ihnen – mit klaren Prozessen und echter Unterstützung im Alltag.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {VORTEILE.map((text) => (
              <li
                key={text}
                className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-[#F2F9FA]/80 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]"
              >
                <Image
                  src="/images/haken.webp"
                  alt=""
                  aria-hidden
                  width={38}
                  height={38}
                  className="mt-0.5 h-[38px] w-[38px] shrink-0 object-contain"
                />
                <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-t border-[#0F4F68]/10 bg-[#fafbfc] py-14 sm:py-16"
        aria-labelledby="pg-table-heading"
      >
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
          <h2 id="pg-table-heading" className={SECTION_TITLE_CLASS}>
            Pflegegrad 1–5: Wann Beratung Pflicht ist – und wann nicht
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
            Die gesetzlichen Regelungen nach Paragraf 37 Absatz 3 SGB XI sind eindeutig. Die Kosten trägt in diesen Fällen
            Ihre Pflegekasse.
          </p>
          <div className="mt-8">
            <PflegegradBeratungTable captionSrOnly />
          </div>
        </div>
      </section>

      <KundenstimmenCarousel />

      <div className="relative z-0 -mt-[9%] min-h-[26vh] flex-1 bg-[#F2F9FA] px-4 pt-16 pb-20 sm:pt-18 sm:pb-24 lg:px-[var(--ahs-page-gutter)]">
        <svg
          className="pointer-events-none absolute left-0 top-0 h-12 w-full -translate-y-[70%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z"
            fill="#F2F9FA"
          />
        </svg>
        <div
          className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-2 bg-gradient-to-b from-[#F2F9FA]/85 to-transparent"
          aria-hidden
        />
      </div>

      {/* FAQ – optisch wie Kostenfreie-Pflegehilfsmittel-Landing (zentriert, details/summary, Verlauf) */}
      <section
        className="relative isolate overflow-x-clip bg-gradient-to-b from-[#e8f4f7]/90 via-[#fafbfc] to-white py-14 sm:py-20"
        aria-labelledby="faq-heading"
      >
        <div
          className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#F78F2E]/10 blur-3xl sm:-right-16"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#0F4F68]/[0.07] blur-3xl"
          aria-hidden
        />
        <div className="relative z-[1] mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
          <h2
            id="faq-heading"
            className="text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
          >
            Häufig gestellte Fragen rund um die Pflegeberatung
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-medium text-[#0F4F68]/85 sm:text-base">
            Antworten zu Ablauf, Kosten, Terminen und Leistungen
          </p>
          <div className="mt-8 space-y-3 sm:mt-10">
            {PRIVATE_PFLEGEBERATUNG_FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-[#0F4F68]/12 bg-white/95 shadow-[0_2px_16px_rgba(15,79,104,0.06)] backdrop-blur-sm transition hover:border-[#F78F2E]/35 hover:shadow-[0_8px_28px_rgba(15,79,104,0.1)] open:border-[#0F4F68]/18 open:shadow-[0_10px_32px_rgba(15,79,104,0.12)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-[#0F4F68] sm:px-5 [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-semibold leading-snug sm:text-[1.05rem]">{item.question}</span>
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
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-600">
            Weitere Fragen? Wir sind für Sie da:{" "}
            <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#F78F2E]">
              Kontakt zu {siteConfig.name}
            </Link>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
