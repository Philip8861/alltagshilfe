import type { Metadata } from "next";
import Link from "next/link";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { StandortAnthrazitRule } from "@/components/standorte/StandortAnthrazitRule";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import { SERVED_PLZ_TOTAL, standorteByPlz } from "@/config/standorte";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** Ortsbezeichnungen mit X (München, Nürnberg) – aktuell ausgeblendet. */
const ORTSLABELS: { left: number; top: number; label: string; withX?: boolean }[] = [];

/** GPS-Marker – Spitze des Pins auf der Koordinate. labelAbove: Name über Symbol. */
const HAUPTMARKER = [
  { left: 68.3, top: 67, label: "Allgäu", href: "/standorte/allgaeu", labelAbove: false },
  { left: 72.3, top: 49, label: "Augsburg", href: "/standorte/augsburg", labelAbove: true },
  { left: 54.1, top: 62.3, label: "Engen/Konstanz", href: "/standorte/engen", labelAbove: false },
  { left: 62.7, top: 61.1, label: "Wangen", sublabel: "(Bodenseeregion)", href: "/standorte/wangen", labelAbove: true },
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
  heading: "Wir sind ganz in Ihrer Nähe!",
  text: "Hier finden Sie Ihren passenden Ansprechpartner für eine zuverlässige, liebevolle Unterstützung ganz in Ihrer Nähe. Wir stehen Ihnen im Alltag gerne zur Seite.",
};

/** Intro über der PLZ-Suche: mittig über dem Kasten */
const STANDORTE_INTRO_HEADING_CLASS =
  "mx-auto w-full max-w-2xl text-balance text-center text-3xl font-bold text-[#0F4F68] sm:text-4xl";

const STANDORTE_INTRO_BODY_CLASS =
  "mx-auto w-full max-w-2xl text-balance text-center text-lg text-neutral-700 leading-relaxed sm:text-xl";

export default function StandortePage() {
  const leistungen = [
    "Haushaltshilfe",
    "Alltagsbegleitung",
    "Kostenfreie Pflegehilfsmittel",
    "Pflegeberatung",
    "Inkontinenzversorgung",
    "Pflegeshop",
  ] as const;

  const plzAnzahl = SERVED_PLZ_TOTAL;

  return (
    <article
      className="flex min-h-[60vh] w-full max-w-[100vw] flex-col pt-0 pb-0 -ml-4 sm:-ml-6 lg:-ml-8 pl-4 sm:pl-6 lg:pl-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      {/* overflow-x nur hier: Karte/Suche – Schatten beim Intro-Bild darf nicht am article geclippt werden */}
      <div className="w-full overflow-x-hidden">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-start lg:justify-start lg:gap-10">
          {/* Desktop: Karte links (order-1). Mobil: Karte unten (order-2). */}
          <div className="relative w-full flex-none shrink-0 bg-transparent lg:w-[50%] lg:max-w-3xl lg:min-w-0 order-2 lg:order-1">
            <KartenMitKoordinatenErfassen hauptmarker={HAUPTMARKER} punkte={PUNKTE} ortsLabels={ORTSLABELS} />
          </div>
          {/* Desktop: Text + Standortsuche rechts (order-2). Mobil: oben (order-1) – zuerst Text, dann Standortsuche. */}
          <div className="order-1 flex w-full min-w-0 flex-col px-4 pt-6 sm:px-6 sm:pt-8 lg:order-2 lg:flex-1 lg:max-w-none lg:px-[var(--ahs-page-gutter)]">
            <div className="flex w-full flex-col items-center gap-6 sm:mt-[3vh] lg:gap-8 lg:items-center">
              <header className="w-full space-y-3">
                <h1 className={STANDORTE_INTRO_HEADING_CLASS}>
                  {STANDORTE_INTRO.heading}
                </h1>
                <p className={STANDORTE_INTRO_BODY_CLASS}>
                  {STANDORTE_INTRO.text}
                </p>
              </header>
              <div className="w-full max-w-md lg:max-w-none">
                <StandortSuche />
              </div>
            </div>
          </div>
        </div>
      </div>

      <StandortAnthrazitRule className="mt-8 sm:mt-10" />

      <section className="relative z-20 mt-8 w-full px-4 sm:mt-10 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-[#0F4F68]/10 bg-white/55 p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">
            Unsere vier Standorte – ein Team für über {plzAnzahl} Postleitzahlen
          </h2>
          <p className="mt-2 text-base text-neutral-700 sm:text-lg">
            Wählen Sie Ihren regionalen Schwerpunkt. Über die Postleitzahl-Suche oben gelangen Sie mit Ihrer PLZ
            direkt zur passenden Seite inklusive Ortsanzeige.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-neutral-700 sm:grid-cols-2 sm:text-base lg:grid-cols-3">
            {leistungen.map((leistung) => (
              <li key={leistung} className="inline-flex items-center gap-2">
                <span aria-hidden className="text-[#EA580C]">
                  ✓
                </span>
                <span>{leistung}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {standorteByPlz.map((st) => (
              <li key={st.pageSlug}>
                <Link
                  href={`/standorte/${st.pageSlug}`}
                  className="flex h-full flex-col rounded-xl border border-[#0F4F68]/15 bg-[#F2F9FA]/80 p-5 transition hover:border-[#F78F2E]/40 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                >
                  <span className="text-lg font-bold text-[#0F4F68]">{st.name}</span>
                  <span className="mt-1 text-sm text-neutral-600">{st.address}</span>
                  <span className="mt-3 text-sm font-semibold text-[#0F4F68]">{st.phone}</span>
                  <span className="sr-only">Zur Standortseite {st.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Übergang startet etwas höher, mit gebogener Oberkante und weichem Verlauf */}
      <div
        className="relative z-0 -mx-4 -mt-[9%] min-h-[26vh] flex-1 bg-[#F2F9FA] px-4 pt-16 pb-20 sm:-mx-6 sm:pt-18 sm:pb-24 lg:-mx-[var(--ahs-page-gutter)] lg:px-[var(--ahs-page-gutter)]"
      >
        {/* Gebogene Oberkante */}
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
        {/* Weicher Übergang direkt unter der Kante */}
        <div
          className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-2 bg-gradient-to-b from-[#F2F9FA]/85 to-transparent"
          aria-hidden
        />
      </div>
    </article>
  );
}
