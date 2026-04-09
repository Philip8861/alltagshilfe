import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { Container } from "@/components/layout/Container";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { PRIVATE_PFLEGEBERATUNG_FAQ } from "@/lib/private-pflegeberatung-faq";
import { siteConfig } from "@/config/site";

const PAGE_PATH = "/pflegeberatung/private-pflegeberatung";

/** Wie Startseite (`app/page.tsx`) – einheitliche Überschriften und Fließtext */
const HEADING_CLASS = "text-3xl font-bold text-[#0F4F68] sm:text-4xl w-full max-w-lg self-start";
const INTRO_BODY_CLASS = "text-lg text-neutral-700 leading-relaxed sm:text-xl";
const SECTION_TITLE_CLASS = "text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl";
const HERO_IMG_SHADOW =
  "block h-auto w-full max-w-full object-contain object-left [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]";

export const metadata: Metadata = {
  title: "Private Pflegeberatung nach Paragraf 37 Absatz 3 SGB XI",
  description:
    "Pflegeberatung mit Herz: Angehörige entlasten und Pflegegeld sichern. Kostenlos über die Pflegekasse – mit Erinnerungssystem und fester Ansprechperson.",
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

const pflegegradCards = [
  {
    title: "Pflegegrad 1",
    body: "Der Einsatz ist nicht gesetzlich verpflichtend. Sie dürfen die kostenlose Beratung jedoch bis zu zweimal im Jahr freiwillig in Anspruch nehmen.",
  },
  {
    title: "Pflegegrad 2 und 3",
    body: "Der Beratungseinsatz ist halbjährlich verpflichtend.",
  },
  {
    title: "Pflegegrad 4 und 5",
    body: "Der Beratungseinsatz ist vierteljährlich verpflichtend.",
  },
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

/** Wellen-Übergang wie auf der Startseite (`app/page.tsx` Leistungs-Sektion) */
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
    <article className="pb-0 sm:pb-0" style={{ backgroundColor: "#fafbfc" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Block 1: Hero – Bild links (ca. 50 % größer auf Desktop), Text rechts */}
      <header className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-[var(--ahs-page-gutter)] lg:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
            <div className="flex w-full justify-center lg:w-[min(62%,42rem)] lg:max-w-none lg:shrink-0 lg:justify-start">
              <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl lg:max-w-none">
                <Image
                  src="/images/private_pflegeberatung.webp"
                  alt="Private Pflegeberatung – persönliche Beratung mit Zeit und Vertrauen"
                  width={960}
                  height={960}
                  sizes="(max-width: 1023px) min(100%, 36rem), (max-width: 1536px) 50vw, 42rem"
                  className={HERO_IMG_SHADOW}
                  priority
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 text-left">
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[clamp(2rem,1.05rem+2.2vw,2.75rem)]">
                Pflegeberatung nach Paragraf 37 Absatz 3 SGB XI
              </h1>
              <p className="mt-4 max-w-2xl text-xl font-semibold leading-snug text-neutral-800 sm:text-2xl">
                Gute Pflege beginnt mit einer guten Pflegeberatung.
              </p>
              <p className="mt-3 max-w-2xl text-lg font-semibold leading-snug text-[#0F4F68] sm:text-xl">
                Beratung mit Herz: Angehörige entlasten und Pflegegeld sichern.
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

      {/* Block 2: Welliger Übergang + Philosophie (#F2F9FA wie Startseite) */}
      <section
        className="relative z-10 mt-0 w-full bg-[#F2F9FA] px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-[var(--ahs-page-gutter)] lg:pb-16 lg:pt-14"
        aria-labelledby="philosophie-heading"
      >
        <WelleObenF2F9FA />
        <div className="relative mx-auto w-full max-w-6xl">
          <h2 id="philosophie-heading" className={HEADING_CLASS}>
            Unsere Philosophie und Qualität
          </h2>
          <p className={`mt-6 max-w-3xl ${INTRO_BODY_CLASS}`}>
            Die Qualität unserer Pflegeberatung liegt uns besonders am Herzen. Sehr viele pflegende Angehörige wissen nicht
            genau, welche gesetzlichen Leistungen ihnen eigentlich zustehen. Oftmals wird man im Internet falsch oder
            unzureichend informiert. Wir machen das anders: Wir nehmen uns die nötige Zeit für Sie. Unser Ziel ist es, Sie
            umfassend und detailliert zu informieren, damit Sie im Alltag optimal entlastet werden.
          </p>
        </div>
      </section>

      {/* Block 3 – Unsere Vorteile (weißer Hintergrund, Markenfarben) */}
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

      {/* Block 4 */}
      <section className="py-14 sm:py-16" aria-labelledby="pflicht-heading">
        <Container>
          <h2 id="pflicht-heading" className={SECTION_TITLE_CLASS}>
            Wann ist die Beratung verpflichtend?
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pflegegradCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-[0_4px_20px_rgba(15,79,104,0.06)] sm:p-6"
              >
                <h3 className="text-lg font-bold text-[#0F4F68]">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border-l-4 border-[#F78F2E] bg-[#FFFBF7] p-5 sm:p-6">
            <p className="text-sm font-bold text-[#0F4F68]">Wichtiger Hinweis</p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 sm:text-base">
              Wenn Sie wichtige Fristen versäumen, kann die Kasse Ihr Pflegegeld kürzen oder vorübergehend aussetzen. Damit
              Ihnen das auf keinen Fall passiert, greift unser verlässliches Erinnerungssystem. Gut zu wissen: Damit Sie noch
              flexibler sind, darf jeder zweite Termin ganz unkompliziert digital als Videocall durchgeführt werden.
            </p>
          </div>
        </Container>
      </section>

      {/* Bewertungen 1:1 wie Startseite */}
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

      {/* FAQ */}
      <section className="border-t border-[#0F4F68]/10 bg-[#fafbfc] py-14 sm:py-16" aria-labelledby="faq-heading">
        <Container>
          <h2 id="faq-heading" className={SECTION_TITLE_CLASS}>
            Häufig gestellte Fragen rund um die Pflegeberatung
          </h2>
          <div className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion items={PRIVATE_PFLEGEBERATUNG_FAQ} />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-neutral-600">
            Weitere Fragen? Wir sind für Sie da:{" "}
            <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#F78F2E]">
              Kontakt zu {siteConfig.name}
            </Link>
            .
          </p>
        </Container>
      </section>
    </article>
  );
}
