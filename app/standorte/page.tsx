import type { Metadata } from "next";
import Image from "next/image";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { StandortAnthrazitRule } from "@/components/standorte/StandortAnthrazitRule";
import { StandortNummerEinsReveal } from "@/components/standorte/StandortNummerEinsReveal";
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

/** Intro neben standort_gemeinsam */
const STANDORTE_LEISTUNGEN_INTRO = {
  heading: "Mit viel Herz und Engagement sind wir in Süddeutschland für Sie da.",
  text: "Wir begleiten Sie zuverlässig in den Bereichen Haushaltshilfe, Betreuung und Pflegeberatung und stehen Ihnen in jeder Lebenssituation unterstützend zur Seite. Bei uns finden Sie passende Hilfe aus einer Hand, persönlich, vertrauensvoll und mit dem Blick auf das, was Ihnen wirklich wichtig ist.",
};

/** Größere Überschriften (wie früher h1); gleiche Breite für beide Intro-Titel */
const HEADING_CLASS =
  "text-2xl font-bold text-[#0F4F68] sm:text-3xl w-full max-w-lg self-start";

export default function StandortePage() {
  const teaser = getStandortBySlug(STANDORT_TEASER_SLUG);

  return (
    <article
      className="min-h-[60vh] w-full max-w-[100vw] pt-0 pb-16 sm:pb-24 -ml-4 sm:-ml-6 lg:-ml-8 pl-4 sm:pl-6 lg:pl-8"
      style={{ backgroundColor: "#fafbfc" }}
    >
      {/* overflow-x nur hier: Karte/Suche – Schatten beim Intro-Bild darf nicht am article geclippt werden */}
      <div className="w-full overflow-x-hidden">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:flex-nowrap lg:items-flex-start lg:justify-start lg:gap-10">
          {/* Desktop: Karte links (order-1). Mobil: Karte unten (order-2). */}
          <div className="relative w-full flex-none shrink-0 bg-transparent lg:w-[50%] lg:max-w-3xl lg:min-w-0 order-2 lg:order-1">
            <KartenMitKoordinatenErfassen hauptmarker={HAUPTMARKER} punkte={PUNKTE} ortsLabels={ORTSLABELS} />
          </div>
          {/* Desktop: Text + Standortsuche rechts (order-2). Mobil: oben (order-1) – zuerst Text, dann Standortsuche. */}
          <div className="w-full min-w-0 flex flex-col gap-6 lg:gap-8 pt-6 sm:pt-8 px-4 sm:px-6 lg:max-w-lg lg:flex-1 lg:px-8 lg:items-start order-1 lg:order-2">
            <header className="space-y-3 w-full max-w-lg">
              <h1 className={HEADING_CLASS}>
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
      </div>

      {/* Trennlinie zwischen Karte/Standortsuche und Leistungs-Intro */}
      <div
        className="mx-auto mt-10 w-full px-4 sm:mt-14 sm:px-6 lg:px-8"
        role="presentation"
      >
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-[#0F4F68]/28 to-transparent"
          aria-hidden
        />
      </div>

      {/* Strukturlinie Anthrazit (~2/3 Breite), über Bereich mit standort_gemeinsam */}
      <StandortAnthrazitRule className="mt-8 sm:mt-10" />

      {/* Wie Hero: nur 2 Spalten + ein lg:gap-10 → H2 bündig mit H1 (kein extra Flex-Kind dazwischen) */}
      <section className="mt-6 w-full sm:mt-8">
        <div className="flex flex-col sm:flex-row sm:items-stretch sm:gap-8 lg:gap-10">
          {/* Bild links (Desktop); Trennlinie am Text per border-l statt eigener Spalte */}
          <div
            className="order-3 flex w-full max-w-full justify-center pb-5 pt-1 sm:order-1 lg:order-1 lg:w-[50%] lg:max-w-3xl lg:shrink-0 lg:justify-center lg:px-6 lg:pb-10 lg:pt-2 sm:px-4"
          >
            <div style={{ width: "min(546px, calc(100vw - 3rem))" }}>
              <div className="relative aspect-[1301/1535] w-full">
                <Image
                  src="/images/standort_gemeinsam.webp"
                  alt="Betreuung und Zuwendung: Team Alltagshilfe-Süd mit Seniorin im Freien"
                  fill
                  className="rounded-xl object-contain object-center [filter:drop-shadow(0_6px_22px_rgba(15,79,104,0.24))_drop-shadow(0_3px_10px_rgba(15,79,104,0.12))]"
                  sizes="(max-width: 640px) min(546px, 88vw), 546px"
                  priority={false}
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Mobil: Linie zwischen Bild und Text */}
          <div
            className="order-2 my-3 h-px w-full shrink-0 bg-gradient-to-r from-transparent via-[#0F4F68]/22 to-transparent sm:hidden"
            role="presentation"
          />

          <StandortNummerEinsReveal className="order-1 w-full min-w-0 px-4 sm:order-2 sm:px-6 sm:shadow-[inset_1px_0_0_rgba(15,79,104,0.18)] lg:order-2 lg:flex-1 lg:max-w-lg lg:self-start lg:px-8 lg:shadow-[inset_1px_0_0_rgba(15,79,104,0.22)]">
            <h2 className={HEADING_CLASS}>
              {STANDORTE_LEISTUNGEN_INTRO.heading}
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              {STANDORTE_LEISTUNGEN_INTRO.text}
            </p>
          </StandortNummerEinsReveal>
        </div>
      </section>

      {/* Strukturlinie vor dem folgenden Standort-Teaser */}
      {teaser && <StandortAnthrazitRule className="mt-12 sm:mt-14" />}

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
