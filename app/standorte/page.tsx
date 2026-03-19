import type { Metadata } from "next";
import Image from "next/image";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { StandortTeaserMitBild } from "@/components/standorte/StandortTeaserMitBild";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import {
  getStandortBySlug,
  STANDORT_LEISTUNGEN,
  STANDORT_TEASER_SLUG,
} from "@/config/standorte";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** Ortsbezeichnungen mit X (München, Nürnberg) – aktuell ausgeblendet. */
const ORTSLABELS: { left: number; top: number; label: string; withX?: boolean }[] = [];

/** GPS-Marker – Spitze des Pins auf der Koordinate. labelAbove: Name über Symbol. */
const HAUPTMARKER = [
  { left: 68.3, top: 67, label: "Allgäu", href: "/kontakt", labelAbove: false },
  { left: 72.3, top: 49, label: "Augsburg", href: "/kontakt", labelAbove: true },
  { left: 54.1, top: 62.3, label: "Engen/Konstanz", href: "/kontakt", labelAbove: false },
  { left: 62.7, top: 61.1, label: "Wangen", sublabel: "(Bodenseeregion)", href: "/kontakt", labelAbove: true },
];

/** Orangene Punkte auf der Karte (alte Positionen + 5 ergänzte). */
const PUNKTE = [
  { left: 47.3, top: 76.6 },
  { left: 48.4, top: 73.6 },
  { left: 46, top: 72.6 },
  { left: 43.8, top: 70.4 },
  { left: 48.9, top: 69.5 },
  { left: 46.8, top: 67.7 },
  { left: 51, top: 67.7 },
  { left: 52.7, top: 65.4 },
  { left: 52.6, top: 61.3 },
  { left: 50.6, top: 61.3 },
  { left: 47.2, top: 60.9 },
  { left: 51, top: 58.4 },
  { left: 55.1, top: 59.5 },
  { left: 56, top: 56.1 },
  { left: 53.4, top: 54 },
  { left: 50.1, top: 51.8 },
  { left: 51.7, top: 51.2 },
  { left: 51.3, top: 47.5 },
  { left: 53.9, top: 43.6 },
  { left: 57.3, top: 42.5 },
  { left: 59.7, top: 47.4 },
  { left: 58.3, top: 49.3 },
  { left: 59.3, top: 51.6 },
  { left: 57.7, top: 55 },
  { left: 39.8, top: 66.8 },
  { left: 38.3, top: 64.4 },
  { left: 38.3, top: 60.5 },
  { left: 40.5, top: 58.3 },
  { left: 41.6, top: 56.5 },
  { left: 44.5, top: 58.6 },
  { left: 44.6, top: 62.7 },
  { left: 44.2, top: 66.8 },
  { left: 37.3, top: 63.6 },
  { left: 35.9, top: 61.6 },
  { left: 36.3, top: 58.9 },
  { left: 33.3, top: 57.8 },
  { left: 30.1, top: 57.6 },
  { left: 22.9, top: 64.4 },
  { left: 20.9, top: 63 },
  { left: 23.1, top: 60.9 },
  { left: 20, top: 59.1 },
  { left: 22.2, top: 57.5 },
  { left: 20.9, top: 56.2 },
  { left: 24.5, top: 55.1 },
  { left: 26.2, top: 53.5 },
  { left: 28.8, top: 54.3 },
  { left: 55.5, top: 62.8 },
  { left: 54.3, top: 69.2 },
  { left: 31.8, top: 60.9 },
  { left: 37.9, top: 69.1 },
  { left: 47.7, top: 57.4 },
];

const STANDORTE_INTRO = {
  heading: "An unseren Standorten sind wir für Sie da!",
  text: "Hier finden Sie Ihren passenden Ansprechpartner für eine zuverlässige, liebevolle Unterstützung ganz in Ihrer Nähe. Wir stehen Ihnen im Alltag gerne zur Seite.",
};

/** Intro-Text mittig unterhalb der Karte/Suche: Nummer 1, Herz & Kompetenz. */
const STANDORTE_LEISTUNGEN_INTRO = {
  heading: "Ihre Nummer 1 im Bereich Haushaltshilfe, Betreuung und Pflegeberatung in Süddeutschland.",
  text: "Wir sind mit Herz und Kompetenz für Sie da und bieten Ihnen eine Vielzahl an individuellen Dienstleistungen aus einer Hand. Bei uns finden Sie genau das Angebot, das zu Ihrer persönlichen Situation passt.",
};

export default function StandortePage() {
  const teaser = getStandortBySlug(STANDORT_TEASER_SLUG);

  return (
    <article
      className="min-h-[60vh] w-full max-w-[100vw] pt-0 pb-16 sm:pb-24 overflow-x-hidden -ml-4 sm:-ml-6 lg:-ml-8 pl-4 sm:pl-6 lg:pl-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-flex-start lg:justify-start lg:gap-10">
        {/* Desktop: Karte links (order-1). Mobil: Karte unten (order-2). */}
        <div className="relative w-full flex-none shrink-0 bg-transparent lg:w-[50%] lg:max-w-3xl lg:min-w-0 order-2 lg:order-1">
          <KartenMitKoordinatenErfassen hauptmarker={HAUPTMARKER} punkte={PUNKTE} ortsLabels={ORTSLABELS} />
        </div>
        {/* Desktop: Text + Standortsuche rechts (order-2). Mobil: oben (order-1) – zuerst Text, dann Standortsuche. */}
        <div className="w-full min-w-0 flex flex-col gap-6 lg:gap-8 pt-6 sm:pt-8 px-4 sm:px-6 lg:max-w-lg lg:flex-1 lg:px-8 order-1 lg:order-2">
          <header className="space-y-3">
            <h1 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">
              {STANDORTE_INTRO.heading}
            </h1>
            <p className="text-neutral-700 leading-relaxed">
              {STANDORTE_INTRO.text}
            </p>
          </header>
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <StandortSuche />
          </div>
        </div>
      </div>

      {/* Intro-Text zu Leistungen – Bild links ohne Rahmen, leicht nach rechts gedreht, Text rechts */}
      <section className="mt-12 sm:mt-16 w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8" aria-hidden />
        <div className="flex flex-row items-start gap-4 sm:items-center sm:gap-6 lg:gap-8">
          <div
            className="shrink-0 pt-1 sm:pt-0"
            style={{
              filter:
                "drop-shadow(0 4px 12px rgba(15, 79, 104, 0.16)) drop-shadow(0 2px 4px rgba(15, 79, 104, 0.1))",
            }}
          >
            {/* 315px = nochmals 50 % größer als 210px; #fafbfc + unoptimized = Transparenz bleibt sichtbar (kein Schwarz durch Optimizer) */}
            <div
              className="rotate-[7deg] overflow-hidden rounded-xl bg-[#fafbfc]"
              style={{ transformOrigin: "center center", width: "315px" }}
            >
              <div className="relative aspect-[4/5] w-full bg-[#fafbfc]">
                <Image
                  src="/images/Testbild.webp"
                  alt="Betreuung und Zuwendung: Team Alltagshilfe-Süd mit Seniorin im Freien"
                  fill
                  className="object-contain object-center bg-[#fafbfc]"
                  sizes="315px"
                  priority={false}
                  unoptimized
                />
              </div>
            </div>
          </div>
          <div className="relative min-w-0 flex-1 overflow-visible text-left">
            {/* Dekorativer Bogen (links → rechts) in Hellblau, mittig im Textblock */}
            <svg
              className="pointer-events-none absolute left-[-2%] top-1/2 z-0 h-[5.5rem] w-[104%] max-w-none -translate-y-1/2 sm:h-[6.5rem]"
              viewBox="0 0 1000 140"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <defs>
                <filter id="standort-bogen-weich" x="-5%" y="-40%" width="110%" height="180%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                  <feOffset dx="0" dy="1" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* leichte Kontur für Lesbarkeit auf #fafbfc */}
              <path
                d="M 0 88 Q 500 12 1000 88"
                stroke="rgba(15, 79, 104, 0.07)"
                strokeWidth="32"
                strokeLinecap="round"
              />
              <path
                d="M 0 88 Q 500 12 1000 88"
                stroke="#F2F9FA"
                strokeWidth="26"
                strokeLinecap="round"
                filter="url(#standort-bogen-weich)"
              />
            </svg>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-[#0F4F68] sm:text-2xl mb-4">
                {STANDORTE_LEISTUNGEN_INTRO.heading}
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                {STANDORTE_LEISTUNGEN_INTRO.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beispiel-Standort: gleiche Karten-Optik wie „Standort suchen“, Bild + Scroll-Animation */}
      {teaser && (
        <StandortTeaserMitBild
          plz={teaser.plz}
          ort={teaser.ort}
          phone={teaser.standort.phone}
          phoneHref={teaser.standort.phoneHref}
          email={teaser.standort.email}
          slug={STANDORT_TEASER_SLUG}
          leistungen={STANDORT_LEISTUNGEN}
        />
      )}
    </article>
  );
}
