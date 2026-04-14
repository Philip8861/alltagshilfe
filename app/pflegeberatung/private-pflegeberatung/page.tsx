import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { PflegegradBeratungTable } from "@/components/pflegeberatung/PflegegradBeratungTable";
import { PflegeberatungNaehePlzDialog } from "@/components/pflegeberatung/PflegeberatungNaehePlzDialog";
import { PRIVATE_PFLEGEBERATUNG_FAQ } from "@/lib/private-pflegeberatung-faq";
import { siteConfig } from "@/config/site";

const PAGE_PATH = "/pflegeberatung/private-pflegeberatung";
/** Seiten-Hintergrund (article); Wellen nutzen dieselbe Farbe statt Hellblau #F2F9FA */
const PAGE_SURFACE = "#fafbfc" as const;

const HERO_KURZ_VORTEILE = [
  "Wir erinnern Sie an bevorstehende Termine",
  "Die Kosten übernimmt die Pflegekasse",
  "Wir helfen auch bei Anträgen und Widerspruch",
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

/** Wie Startseite – Schrift erbt von Root-Layout (Nunito Sans am body) */
const HEADING_CLASS = "text-3xl font-bold text-[#0F4F68] sm:text-4xl w-full max-w-lg self-start";
const INTRO_BODY_CLASS = "text-lg text-neutral-700 leading-relaxed sm:text-xl";
const SECTION_TITLE_CLASS = "text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl";
/* Positiver X-Offset: Schatten weniger nach links (sonst bei html overflow-x:clip am linken Rand abgeschnitten) */
const HERO_IMG_BASE =
  "block h-auto w-full max-w-full object-contain [filter:drop-shadow(8px_12px_20px_rgba(15,79,104,0.18))_drop-shadow(6px_6px_14px_rgba(15,79,104,0.1))] [will-change:filter]";

/** Einblendung mit motion-reduce: aus (Barrierefreiheit) */
const ANIM_IN = "opacity-0 animate-fade-in-up motion-reduce:opacity-100 motion-reduce:animate-none";
const ANIM_RISE = "animate-fade-in-rise motion-reduce:animate-none";

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

/** Wellen-Übergang; `fill` = Farbe des aktuellen Abschnitts (wird nach oben in den vorherigen Bereich gezogen) */
function WelleObenMitFuellfarbe({ fill }: { fill: string }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 block h-12 w-full -translate-y-[68%] sm:h-16"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="none"
      overflow="visible"
      aria-hidden
    >
      <rect x="-48" y="0" width="48" height="120" fill={fill} />
      <rect x="1200" y="0" width="48" height="120" fill={fill} />
      <path d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z" fill={fill} />
    </svg>
  );
}

export default function PrivatePflegeberatungPage() {
  return (
    <article className="overflow-x-visible pb-0 sm:pb-0" style={{ backgroundColor: PAGE_SURFACE }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <header className="overflow-visible bg-white">
        <div className="mx-auto max-w-7xl overflow-visible px-4 pt-2 pb-10 sm:px-6 sm:pt-4 sm:pb-14 lg:px-[var(--ahs-page-gutter)] lg:pt-16 lg:pb-20">
          <div className="mx-auto flex w-full max-w-[min(100%,72rem)] flex-col items-center gap-8 overflow-visible lg:mx-0 lg:mr-auto lg:flex-row lg:justify-start lg:items-center lg:gap-x-11 lg:gap-y-6 xl:gap-x-[3.75rem]">
            <div className="flex w-full min-w-0 shrink-0 justify-center overflow-visible lg:max-w-[min(100%,32rem)] lg:-ml-4 lg:-mr-5 xl:max-w-[min(100%,38.5rem)] xl:-ml-6 xl:-mr-7">
              <div className="box-content w-full max-w-[min(100%,29rem)] overflow-visible px-2 pt-1 pb-2 sm:max-w-[min(100%,34rem)] sm:px-3 sm:pb-4 lg:max-w-full lg:px-1 lg:py-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- natives img vermeidet Next/Image-Wrapper (overflow) */}
                <img
                  src="/images/pflegeberatung_gemeinsam.webp"
                  alt="Pflegeberatung – Gemeinsam im Gespräch mit Zeit und Vertrauen"
                  width={1200}
                  height={900}
                  decoding="async"
                  fetchPriority="high"
                  className={`${HERO_IMG_BASE} ${ANIM_RISE} mx-auto h-auto w-full max-w-full object-contain object-center`}
                  style={{ animationDelay: "40ms" }}
                />
              </div>
            </div>

            <div className="flex w-full min-w-0 max-w-xl shrink-0 flex-col items-center overflow-visible text-center lg:max-w-[min(100%,31rem)] lg:items-start lg:text-left xl:max-w-[33rem]">
              <h1
                className={`${ANIM_IN} max-w-[24rem] text-balance text-[1.375rem] font-extrabold leading-snug tracking-tight text-[#0F4F68] sm:max-w-2xl sm:text-[1.65rem] sm:leading-tight lg:max-w-none lg:whitespace-nowrap lg:text-[clamp(1.5rem,0.6rem+1.4vw,2.75rem)] lg:leading-[1.12]`}
                style={{ animationDelay: "110ms" }}
              >
                Pflegeberatung nach Paragraf 37 Absatz 3 SGB XI
              </h1>
              <p
                className={`${ANIM_IN} mt-4 w-full max-w-xl text-pretty text-[1.05rem] font-medium leading-relaxed text-[#0F4F68] sm:mt-5 sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.375rem]`}
                style={{ animationDelay: "190ms" }}
              >
                Gute Pflege beginnt mit einer guten Pflegeberatung.
              </p>
              <ul
                className={`${ANIM_IN} mt-5 w-full max-w-xl space-y-3 text-left sm:mt-6 sm:space-y-3.5 lg:mx-0`}
                style={{ animationDelay: "240ms" }}
                aria-label="Ihre Vorteile auf einen Blick"
              >
                {HERO_KURZ_VORTEILE.map((line) => (
                  <li key={line} className="flex items-start justify-center gap-3 sm:items-center lg:justify-start">
                    <HeroCheckIcon className="mt-0.5 sm:mt-0" />
                    <span className="text-pretty text-[1.05rem] font-semibold leading-snug text-[#0F4F68] sm:text-[1.125rem]">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
              <div className={`${ANIM_IN} mt-8 flex w-full justify-center lg:justify-start`} style={{ animationDelay: "400ms" }}>
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[3.625rem] min-w-[11.5rem] items-center justify-center rounded-xl bg-[#F78F2E] px-8 py-4 text-[1.2rem] font-semibold text-white hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:min-h-[3.75rem] sm:px-9 sm:py-[1.15rem] sm:text-[1.21875rem]"
                >
                  Termin vereinbaren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section
        className="relative z-10 mt-0 w-full px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-[var(--ahs-page-gutter)] lg:pb-16 lg:pt-14"
        style={{ backgroundColor: PAGE_SURFACE }}
        aria-labelledby="versprechen-heading"
      >
        <WelleObenMitFuellfarbe fill={PAGE_SURFACE} />
        <div className="relative mx-auto w-full max-w-6xl">
          <h2 id="versprechen-heading" className={`${HEADING_CLASS} ${ANIM_IN}`} style={{ animationDelay: "0ms" }}>
            Unser Qualitätsversprechen an Sie
          </h2>
          <p className={`${ANIM_IN} mt-6 max-w-3xl ${INTRO_BODY_CLASS}`} style={{ animationDelay: "90ms" }}>
            Die Qualität unserer Pflegeberatung liegt uns besonders am Herzen. Sehr viele pflegende Angehörige wissen nicht
            genau, welche gesetzlichen Leistungen ihnen eigentlich zustehen. Oftmals wird man im Internet falsch oder
            unzureichend informiert. Wir machen das anders: Wir nehmen uns die nötige Zeit für Sie. Unser Ziel ist es, Sie
            umfassend und detailliert zu informieren, damit Sie im Alltag optimal entlastet werden.
          </p>
          <div className={`${ANIM_IN}`} style={{ animationDelay: "160ms" }}>
            <PflegeberatungNaehePlzDialog />
          </div>
          <p className={`${ANIM_IN} mt-6 max-w-3xl ${INTRO_BODY_CLASS}`} style={{ animationDelay: "200ms" }}>
            Dabei bleiben wir neutral und kümmern uns um die bestmögliche Versorgung zuhause.
          </p>
        </div>
      </section>

      <section
        className="relative z-10 w-full bg-white px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-[var(--ahs-page-gutter)] lg:pb-16"
        aria-labelledby="pg-table-heading"
      >
        <WelleObenMitFuellfarbe fill="#ffffff" />
        <div className="relative mx-auto w-full max-w-4xl">
          <h2 id="pg-table-heading" className={`${SECTION_TITLE_CLASS} ${ANIM_IN}`} style={{ animationDelay: "0ms" }}>
            Pflegegrad 1–5: Wann Beratung Pflicht ist – und wann nicht
          </h2>
          <p
            className={`${ANIM_IN} mt-3 max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base`}
            style={{ animationDelay: "80ms" }}
          >
            Die gesetzlichen Regelungen nach Paragraf 37 Absatz 3 SGB XI sind eindeutig. Die Kosten trägt in diesen Fällen
            Ihre Pflegekasse.
          </p>
          <div className={`${ANIM_IN} mt-8`} style={{ animationDelay: "160ms" }}>
            <PflegegradBeratungTable captionSrOnly />
          </div>
        </div>
      </section>

      <section
        className="relative z-10 w-full bg-white px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-[var(--ahs-page-gutter)] lg:pb-16 lg:pt-14"
        aria-labelledby="vorteile-heading"
      >
        <div className="relative mx-auto w-full max-w-6xl">
          <h2 id="vorteile-heading" className={`${SECTION_TITLE_CLASS} ${ANIM_IN}`} style={{ animationDelay: "0ms" }}>
            Unsere Vorteile
          </h2>
          <p
            className={`${ANIM_IN} mt-2 max-w-3xl text-sm text-neutral-600 sm:text-base`}
            style={{ animationDelay: "70ms" }}
          >
            Verlässlich, transparent und nah bei Ihnen – mit klaren Prozessen und echter Unterstützung im Alltag.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {VORTEILE.map((text, i) => (
              <li
                key={text}
                className={`${ANIM_IN} flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-[#F2F9FA]/80 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]`}
                style={{ animationDelay: `${120 + i * 55}ms` }}
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

      <KundenstimmenCarousel />

      <div className="relative z-0 -mt-[9%] min-h-[26vh] flex-1 bg-[#F2F9FA] px-4 pt-16 pb-20 sm:pt-18 sm:pb-24 lg:px-[var(--ahs-page-gutter)]">
        <svg
          className="pointer-events-none absolute left-0 top-0 block h-12 w-full -translate-y-[70%] sm:h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="none"
          overflow="visible"
          aria-hidden
        >
          <rect x="-48" y="0" width="48" height="120" fill="#F2F9FA" />
          <rect x="1200" y="0" width="48" height="120" fill="#F2F9FA" />
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
            className={`${ANIM_IN} text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl`}
            style={{ animationDelay: "0ms" }}
          >
            Häufig gestellte Fragen rund um die Pflegeberatung
          </h2>
          <p
            className={`${ANIM_IN} mx-auto mt-2 max-w-2xl text-center text-sm font-medium text-[#0F4F68]/85 sm:text-base`}
            style={{ animationDelay: "80ms" }}
          >
            Antworten zu Ablauf, Kosten, Terminen und Leistungen
          </p>
          <div className="mt-8 space-y-3 sm:mt-10">
            {PRIVATE_PFLEGEBERATUNG_FAQ.map((item, i) => (
              <details
                key={item.question}
                className={`${ANIM_IN} group rounded-2xl border border-[#0F4F68]/12 bg-white/95 shadow-[0_2px_16px_rgba(15,79,104,0.06)] backdrop-blur-sm transition hover:border-[#F78F2E]/35 hover:shadow-[0_8px_28px_rgba(15,79,104,0.1)] open:border-[#0F4F68]/18 open:shadow-[0_10px_32px_rgba(15,79,104,0.12)]`}
                style={{ animationDelay: `${140 + i * 45}ms` }}
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
          <p
            className={`${ANIM_IN} mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-600`}
            style={{ animationDelay: `${200 + PRIVATE_PFLEGEBERATUNG_FAQ.length * 45}ms` }}
          >
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
