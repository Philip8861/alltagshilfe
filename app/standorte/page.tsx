import type { Metadata } from "next";
import Link from "next/link";
import { StandortSuche } from "@/components/standorte/StandortSuche";
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

/** Intro-Text mittig unterhalb der Karte/Suche: Dienstleistungen & Nummer 1. */
const STANDORTE_LEISTUNGEN_INTRO = {
  heading: "Ihre Ansprechpartner für Haushaltshilfe & Pflege in Süddeutschland",
  text: "Wir bieten Ihnen eine Vielzahl an Dienstleistungen an und sind Ihre Nummer 1, wenn es um Haushaltshilfe & Betreuung, Pflegeberatung und kostenfreie Pflegehilfsmittel geht. An unseren Standorten sind wir für Sie da – zuverlässig, persönlich und mit Herz. Nutzen Sie die Standortsuche und entdecken Sie Ihren Ansprechpartner vor Ort.",
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

      {/* Intro-Text zu Leistungen – mittig, unterhalb Karte/Suche */}
      <section className="mt-12 sm:mt-16 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-xl font-bold text-[#0F4F68] sm:text-2xl mb-4">
          {STANDORTE_LEISTUNGEN_INTRO.heading}
        </h2>
        <p className="text-neutral-700 leading-relaxed">
          {STANDORTE_LEISTUNGEN_INTRO.text}
        </p>
      </section>

      {/* Beispiel-Standort: kompakt, gerahmt, Link zur Unterseite */}
      {teaser && (
        <section
          className="mt-12 sm:mt-14 w-full max-w-xl mx-auto px-4 sm:px-6"
          aria-labelledby="standort-teaser-heading"
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#0F4F68]/20 bg-white shadow-[0_12px_40px_-12px_rgba(15,79,104,0.18),0_0_0_1px_rgba(242,249,250,0.9)]">
            <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-[#0F4F68] via-[#0F4F68]/80 to-[#F78F2E]" aria-hidden />
            <div className="p-6 sm:p-8 pt-8">
              <h2
                id="standort-teaser-heading"
                className="text-center text-xl font-bold text-[#0F4F68] sm:text-2xl"
              >
                Haushaltshilfe in {teaser.plz} {teaser.ort}
              </h2>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[#0F4F68]/90">
                Folgende Leistungen bieten wir hier an:
              </h3>
              <ul className="mt-3 space-y-2.5">
                {STANDORT_LEISTUNGEN.map((leistung) => (
                  <li key={leistung} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F78F2E] text-white"
                      aria-hidden
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-neutral-800">{leistung}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA]/90 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/80">
                  Kontakt
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2">
                  <a
                    href={teaser.standort.phoneHref}
                    className="text-lg font-bold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                  >
                    {teaser.standort.phone}
                  </a>
                  <a
                    href={`mailto:${teaser.standort.email}`}
                    className="break-all text-base font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                  >
                    {teaser.standort.email}
                  </a>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Link
                  href={`/standorte/${STANDORT_TEASER_SLUG}`}
                  className="inline-flex w-full max-w-sm items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-3.5 text-center font-semibold text-white shadow-sm transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:w-auto sm:min-w-[200px]"
                >
                  Zum Standort
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
