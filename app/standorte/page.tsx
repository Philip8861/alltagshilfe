import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StandortSuche } from "@/components/standorte/StandortSuche";
import { StandortAnthrazitRule } from "@/components/standorte/StandortAnthrazitRule";
import { KartenMitKoordinatenErfassen } from "@/components/standorte/KartenMitKoordinatenErfassen";
import { GtmMailtoLink } from "@/components/analytics/GtmContactIntentLink";
import { SERVED_PLZ_TOTAL, getStandortPageImage, standorteByPlz } from "@/config/standorte";
import { getStandortKarteData } from "@/config/standort-karte";
import { siteConfig } from "@/config/site";

const STANDORTE_META_DESCRIPTION = `Fünf regionale Standorte – ${siteConfig.name}: Allgäu, Bodenseeregion, Augsburg, Engen/Konstanz und Ulm/Neu-Ulm. PLZ-Suche für Haushaltshilfe, Pflegeberatung und Betreuung in Ihrer Nähe.`;

export const metadata: Metadata = {
  title: "Standorte",
  description: STANDORTE_META_DESCRIPTION,
  alternates: { canonical: "/standorte" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    title: `Standorte | ${siteConfig.name}`,
    description: STANDORTE_META_DESCRIPTION,
    url: "/standorte",
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
  },
};

/** Ortsbezeichnungen mit X (München, Nürnberg) – aktuell ausgeblendet. */
const { hauptmarker: HAUPTMARKER, punkte: PUNKTE, ortsLabels: ORTSLABELS } = getStandortKarteData();

const STANDORTE_INTRO = {
  heading: "Wir sind ganz in Ihrer Nähe!",
  text: "Hier finden Sie Ihren passenden Ansprechpartner für eine zuverlässige, liebevolle Unterstützung ganz in Ihrer Nähe. Wir stehen Ihnen im Alltag gerne zur Seite.",
};

/** Intro über der PLZ-Suche: mittig über dem Kasten */
const STANDORTE_INTRO_HEADING_CLASS =
  "mx-auto w-full max-w-2xl text-balance text-center text-3xl font-bold text-[#0F4F68] sm:text-4xl";

const STANDORTE_INTRO_BODY_CLASS =
  "mx-auto w-full max-w-2xl text-balance text-center text-lg text-neutral-700 leading-relaxed sm:text-xl";

export default async function StandortePage({
  searchParams,
}: {
  searchParams?: Promise<{ karte?: string }>;
}) {
  const sp = await searchParams;
  const karteBearbeiten =
    process.env.NODE_ENV === "development" && sp?.karte === "bearbeiten";
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
          <div className="relative z-10 w-full flex-none shrink-0 bg-transparent lg:w-[50%] lg:max-w-3xl lg:min-w-0 order-2 lg:order-1 -translate-y-2 sm:-translate-y-4 drop-shadow-[0_14px_28px_rgba(15,79,104,0.2)]">
            <KartenMitKoordinatenErfassen
              hauptmarker={HAUPTMARKER}
              punkte={PUNKTE}
              ortsLabels={ORTSLABELS}
              editMode={karteBearbeiten}
            />
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

      <section
        className="relative z-20 mt-8 w-full px-4 sm:mt-10 sm:px-6 lg:px-[var(--ahs-page-gutter)]"
        aria-labelledby="standorte-karten-heading"
      >
        <div className="mx-auto w-full max-w-5xl rounded-[1.35rem] border border-[#0F4F68]/12 bg-gradient-to-b from-white via-white to-[#F2F9FA]/35 p-6 shadow-[0_12px_40px_rgba(15,79,104,0.08)] sm:p-8 lg:p-10">
          <h2
            id="standorte-karten-heading"
            className="mx-auto max-w-3xl text-balance text-center text-2xl font-bold leading-snug text-[#0F4F68] sm:text-3xl"
          >
            Unsere Hauptstandorte sind an rund {plzAnzahl} Regionen für Sie im Einsatz. Wir helfen gerne weiter!
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {standorteByPlz.map((st) => {
              const imgSrc = getStandortPageImage(st.pageSlug);
              return (
                <li key={st.pageSlug} className="flex min-h-0">
                  <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA]/90 shadow-[0_4px_20px_rgba(15,79,104,0.07)] transition hover:border-[#F78F2E]/35 hover:bg-white hover:shadow-[0_12px_32px_rgba(15,79,104,0.12)]">
                    <Link
                      href={`/standorte/${st.pageSlug}`}
                      className="group flex min-h-0 flex-1 flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#0F4F68]/10">
                        <Image
                          src={imgSrc}
                          alt={`${st.name} – regionaler Ansprechpartner`}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                      <div className="flex w-full flex-1 flex-col items-center px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
                        <span className="text-lg font-bold text-[#0F4F68] sm:text-xl">{st.name}</span>
                        <span className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-neutral-600 sm:text-base">
                          {st.address}
                        </span>
                        <span className="mt-4 text-xl font-bold tabular-nums text-[#0F4F68] sm:text-2xl">
                          {st.phone}
                        </span>
                        <span className="sr-only">Zur Standortseite {st.name}</span>
                      </div>
                    </Link>
                    <div className="border-t border-[#0F4F68]/10 bg-white/70 px-5 py-4 text-center sm:px-6">
                      <GtmMailtoLink
                        href={`mailto:${st.email}`}
                        sourceComponent="standorte_overview_email"
                        service={st.pageSlug}
                        className="inline-block max-w-full break-all text-sm font-semibold text-[#0F4F68] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 rounded"
                      >
                        {st.email}
                      </GtmMailtoLink>
                    </div>
                  </div>
                </li>
              );
            })}
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
