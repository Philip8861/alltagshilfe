import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { KarriereForm } from "@/components/forms/KarriereForm";
import { BewerbungTippsFab } from "@/components/karriere/BewerbungTippsDialog";
import { siteConfig } from "@/config/site";

const HERO_IMG = "/images/Karriere1.webp";

/** Drei zentrale Arbeitgeber-Vorteile (einheitlich auf allen Stellenkarten). */
const STELLEN_VORTEILE = [
  "Tarifgerechte Vergütung, planbare Zeiten und klare Strukturen im Alltag",
  "Echte Teamkultur: Einarbeitung, fester Ansprechpartner und Unterstützung vor Ort",
  "Sinnstiftende Arbeit in der Region – dort, wo Hilfe für Menschen ankommt",
] as const;

const jobs = [
  {
    id: "pflegefachkraft",
    title: "Pflegefachkraft (m/w/d)",
    tagline: "Menschen im Alltag stärken",
    type: "Vollzeit",
    location: "Memmingen & Umgebung",
    accent: "primary" as const,
    icon: "heart",
  },
  {
    id: "betreuungskraft",
    title: "Betreuungskraft für den Alltag (m/w/d)",
    tagline: "Begleitung, die ankommt",
    type: "Teilzeit / Vollzeit",
    location: "Verschiedene Standorte",
    accent: "warm" as const,
    icon: "hand",
  },
  {
    id: "sachbearbeiter-pflegeberatung",
    title: "Sachbearbeiter:in Pflegeberatung (m/w/d)",
    tagline: "Schnittstelle zwischen Mensch und System",
    type: "Vollzeit",
    location: "Büro Memmingen",
    accent: "soft" as const,
    icon: "desk",
  },
  {
    id: "quereinsteiger-pflegehilfe",
    title: "Quereinsteiger:in Pflegehilfe (m/w/d)",
    tagline: "Ihr Neustart in der Pflege",
    type: "Vollzeit nach Einarbeitung",
    location: "Alle Standorte",
    accent: "primary" as const,
    icon: "star",
  },
];

/** Sehr leichte Innen-Tönung pro Karte (Markenfarben). */
const JOB_INNEN_TINT: Record<string, string> = {
  pflegefachkraft: "bg-[#0F4F68]/[0.045]",
  betreuungskraft: "bg-[#F78F2E]/[0.065]",
  "sachbearbeiter-pflegeberatung": "bg-[#0F4F68]/[0.028]",
  "quereinsteiger-pflegehilfe": "bg-[#F78F2E]/[0.04]",
};

const iconPaths: Record<string, string> = {
  heart:
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  hand: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  desk: "M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
};

function JobIcon({ name }: { name: string }) {
  const d = iconPaths[name] || iconPaths.heart;
  return (
    <svg className="h-6 w-6 shrink-0 sm:h-7 sm:w-7 lg:h-6 lg:w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function VorteilHaken() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-[#F78F2E]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function OffeneStellenSpalte() {
  /** Gleiche horizontale Führung wie Hero-H1 – wirkt mit Hauptüberschrift „untereinander mittig“. */
  const offeneStellenHeadingWrap =
    "mx-auto max-w-[min(100%,34rem)] -translate-x-2 text-center sm:max-w-[min(100%,38rem)] sm:-translate-x-5 xl:max-w-[40rem] xl:-translate-x-[clamp(1.5rem,6vw,4rem)]";

  return (
    <div className="min-w-0 w-full">
      <div className={offeneStellenHeadingWrap}>
        <h2 className="text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[clamp(2.15rem,1.2rem+2.2vw,3rem)]">
          Offene Stellen
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-sm text-neutral-600 sm:mt-4 sm:text-base">
          Klicken Sie auf eine Stelle, um mehr zu erfahren – oder nutzen Sie das Bewerbungsformular weiter unten.
        </p>
      </div>
      <ul className="mt-8 grid list-none grid-cols-1 items-stretch gap-4 perspective-[1600px] sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {jobs.map((job, index) => (
          <li
            key={job.id}
            className="min-w-0 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-karriere-stelle-flip-in [transform-style:preserve-3d]"
            style={{ animationDelay: `${0.08 + index * 0.11}s` }}
          >
            <article
              className={`group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border-2 transition-all hover:shadow-lg ${
                job.accent === "primary"
                  ? "border-[#0F4F68]/25 bg-white hover:border-[#0F4F68]/45"
                  : job.accent === "warm"
                    ? "border-[#F78F2E]/30 bg-white hover:border-[#F78F2E]/50"
                    : "border-neutral-200 bg-[#F2F9FA]/60 hover:border-[#0F4F68]/30"
              }`}
            >
              <BewerbungTippsFab className="absolute right-1.5 top-1.5 z-20 h-9 w-9 sm:right-2 sm:top-2 sm:h-10 sm:w-10 [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-5 sm:[&_svg]:w-5" />
              <div
                className={`px-3 py-3 pr-11 sm:px-4 sm:py-4 sm:pr-12 ${
                  job.accent === "primary"
                    ? "bg-[#0F4F68]/05"
                    : job.accent === "warm"
                      ? "bg-[#F78F2E]/08"
                      : "bg-[#0F4F68]/04"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
                      job.accent === "primary"
                        ? "bg-[#0F4F68] text-white"
                        : job.accent === "warm"
                          ? "bg-[#F78F2E] text-white"
                          : "bg-[#0F4F68]/15 text-[#0F4F68]"
                    }`}
                  >
                    <JobIcon name={job.icon} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-neutral-500 sm:text-xs">
                      {job.type} · {job.location}
                    </p>
                    <h3 className="mt-1 text-sm font-bold leading-snug text-[#0F4F68] lg:text-base">{job.title}</h3>
                    <p className="mt-0.5 text-xs text-neutral-600 sm:text-sm">{job.tagline}</p>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-1 flex-col px-3 pb-4 pt-1 sm:px-4 sm:pb-4 ${JOB_INNEN_TINT[job.id] ?? "bg-[#0F4F68]/[0.03]"}`}
              >
                <ul className="mt-2 space-y-1.5 text-[11px] leading-snug text-neutral-700 sm:space-y-2 sm:text-xs lg:text-[11px] xl:text-xs">
                  {STELLEN_VORTEILE.map((h) => (
                    <li key={h} className="flex items-start gap-1.5 sm:gap-2">
                      <VorteilHaken />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-1 flex-col gap-2">
                  <Link
                    href={`/kontakt?betreff=Bewerbung%20${encodeURIComponent(job.title)}`}
                    className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-[#0F4F68] px-2 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:min-h-[44px] sm:text-sm"
                  >
                    Jetzt bewerben
                  </Link>
                  <a
                    href={siteConfig.indeedJobsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg border-2 border-[#0F4F68] bg-white/80 px-2 py-2 text-center text-xs font-semibold text-[#0F4F68] transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:min-h-[44px] sm:text-sm"
                  >
                    Stellenbeschreibung ansehen
                  </a>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {siteConfig.indeedJobsUrl ? (
        <div className="mt-8 rounded-2xl border border-[#0F4F68]/15 bg-[#F2F9FA]/80 p-5 text-center sm:p-6">
          <p className="text-base font-semibold text-[#0F4F68] sm:text-lg">Alle Stellenangebote auch bei Indeed</p>
          <p className="mt-1 text-sm text-neutral-600">Dort können Sie sich direkt bewerben oder Details einsehen.</p>
          <a
            href={siteConfig.indeedJobsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2557a7] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Offene Stellen bei Indeed
          </a>
        </div>
      ) : null}
    </div>
  );
}

/** Wie `/kontakt`: Formular links, Kontaktinfos rechts (mit Daniel). */
function KarriereBewerbungWieKontakt() {
  return (
    <div className="mx-auto mt-14 w-full max-w-6xl sm:mt-16 lg:mt-20">
      <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="order-2 flex min-w-0 flex-col lg:order-1">
          <div className="mx-auto w-full max-w-xl rounded-2xl bg-[#F2F9FA] p-6 sm:p-8 lg:mx-0 lg:max-w-none lg:p-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">Bewerbung</h2>
            <p className="mt-4 text-neutral-600">
              Schicken Sie uns Ihre Unterlagen über das Formular – wir melden uns zeitnah bei Ihnen.
            </p>
            <div className="mt-10">
              <KarriereForm />
            </div>
            <p className="mt-8 text-sm text-neutral-500">
              Weitere Informationen zur Datenverarbeitung finden Sie in unserer{" "}
              <Link href="/datenschutz" className="underline hover:text-neutral-700">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="order-1 flex min-w-0 flex-col items-center gap-6 text-center lg:order-2">
          <div className="flex w-full flex-col items-center">
            <div
              className="relative aspect-[3/4] w-full max-w-[280px] overflow-visible opacity-0 animate-fade-in-up sm:max-w-xs lg:max-w-sm"
              style={{ animationDelay: "0.12s" }}
            >
              <div className="relative h-full w-full isolate [transform:translateZ(0)] [backface-visibility:hidden]">
                <Image
                  src="/images/Daniel_Niebauer.webp"
                  alt="Daniel Niebauer – Personalreferent, Alltagshilfe-Süd"
                  fill
                  className="object-contain object-top mix-blend-multiply drop-shadow-[0_4px_20px_rgba(15,79,104,0.18)]"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>
            <div
              className="relative z-10 -mt-10 w-full max-w-sm rounded-xl bg-[#F2F9FA] px-6 py-3 text-center sm:-mt-12 sm:py-4"
              style={{ boxShadow: "0 -2px 12px rgba(15, 79, 104, 0.15)" }}
            >
              <p className="text-lg font-bold text-[#0F4F68] sm:text-xl">Daniel Niebauer</p>
              <p className="mt-0.5 text-sm text-neutral-600 sm:text-base">Personalreferent</p>
            </div>
          </div>
          <div
            className="mx-auto w-full max-w-md opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-base font-semibold text-[#0F4F68] sm:text-lg">Ihr Ansprechpartner</p>
            <a
              href="tel:+4983349893330"
              className="mt-2 flex items-center justify-center gap-2 text-3xl font-bold tabular-nums text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded sm:text-4xl"
              aria-label="Anrufen: 08334 9893330"
            >
              <svg
                className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
                style={{ color: "#F78F2E" }}
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>08334 / 9893330</span>
            </a>
            <ul className="mt-5 space-y-2 text-base text-neutral-700 sm:text-lg">
              <li>
                <span className="font-semibold text-[#0F4F68]">Mo–Do:</span> 08:30 – 12:00 und 13:00 – 16:00
              </li>
              <li>
                <span className="font-semibold text-[#0F4F68]">Freitag:</span> 08:30 – 12:00
              </li>
            </ul>
            <p className="mt-6 text-sm font-semibold text-neutral-600">E-Mail</p>
            <a
              href="mailto:daniel.niebauer@alltagshilfe-sued.de"
              className="mt-1 block break-all text-base font-medium text-[#0F4F68] hover:underline"
            >
              daniel.niebauer@alltagshilfe-sued.de
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function KarriereLanding() {
  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article
        id="karriere-landing"
        className="min-w-0 scroll-mt-[var(--ahs-header-scroll-padding)] overflow-x-clip overflow-y-visible"
      >
        <section
          aria-labelledby="karriere-hero-heading"
          className="relative isolate z-0 min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] pb-8 pt-0 sm:pb-10 lg:pb-[clamp(2.45rem,5.6vh+0.7rem,3.85rem)]"
        >
          {/* Bild ohne fill; +15 % zu vorher: min-h/max-h & Spalte 75vw. Weißer Verlauf eigene Schicht z-[8] über dem Bild, unter Text (z-10). */}
          <div className="relative min-h-[min(60vh,508px)] w-full sm:min-h-[min(56.8vh,478px)] lg:min-h-[min(54vh,448px)]">
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 w-[75%] max-w-[75vw] overflow-x-clip overflow-y-visible">
              <div className="flex h-full justify-end overflow-visible">
                <Image
                  src={HERO_IMG}
                  alt="Karriere bei der Alltagshilfe-Süd – Team und Arbeitgeber"
                  width={970}
                  height={495}
                  priority
                  sizes="75vw"
                  className="h-auto max-h-[min(60vh,508px)] w-auto max-w-full object-contain object-right object-top sm:max-h-[min(56.8vh,478px)] lg:max-h-[min(54vh,448px)]"
                />
              </div>
            </div>
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-[8] w-[75%] max-w-[75vw] bg-gradient-to-r from-[#fafbfc] from-0% via-white/95 via-[40%] to-transparent to-[88%]"
              aria-hidden
            />
            <div className="relative z-10 mx-auto flex min-h-[min(60vh,508px)] w-full max-w-7xl flex-col items-center justify-center px-4 py-5 text-center sm:min-h-[min(56.8vh,478px)] sm:px-6 sm:py-6 lg:min-h-[min(54vh,448px)] lg:px-[var(--ahs-page-gutter)] lg:py-7">
              <div className="box-border w-full max-w-full">
                <div className="mx-auto max-w-[min(100%,34rem)] -translate-x-2 sm:max-w-[min(100%,38rem)] sm:-translate-x-5 xl:max-w-[40rem] xl:-translate-x-[clamp(1.5rem,6vw,4rem)]">
                  <h1
                    id="karriere-hero-heading"
                    className="text-balance text-3xl font-bold leading-snug tracking-tight text-[#0F4F68] opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-karriere-hero-in sm:text-4xl md:text-5xl lg:text-[clamp(2rem,1.05rem+1.85vw,2.85rem)] xl:text-[clamp(2.15rem,1.15rem+1.7vw,3.05rem)]"
                  >
                    <span className="block">Starte jetzt deine neue Karriere</span>
                    <span className="mt-1 block sm:mt-1.5">bei der Alltagshilfe-Süd</span>
                  </h1>
                  <div
                    className="mt-5 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-fade-in-up sm:mt-6"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Link
                      href="#bewerbung"
                      className="inline-flex w-full min-h-[2.75rem] transform items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-2.5 text-center text-sm font-semibold leading-snug text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:min-h-[2.85rem] sm:w-auto sm:max-w-[min(100%,22rem)] sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-3.5 md:text-lg"
                    >
                      Bewirb dich jetzt in 1 Minute
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="bewerbung"
          className="relative z-10 -mt-12 overflow-x-clip bg-[#F2F9FA] pb-12 pt-[5.5rem] sm:-mt-12 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-[6.5rem]"
        >
          {/* Welle weiter oben: stärkerer neg. Margin + höheres SVG + translate = greift ins Hero-Bild; extra pt gleicht aus für Abstand zu „Offene Stellen“. */}
          <svg
            className="pointer-events-none absolute left-0 top-0 z-[1] h-16 w-full -translate-y-[88%] sm:h-[5.25rem] sm:-translate-y-[86%] lg:h-24 lg:-translate-y-[84%]"
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
          <Container className="relative z-[2] w-full">
            <OffeneStellenSpalte />
            <KarriereBewerbungWieKontakt />
          </Container>
        </section>

        <section className="border-t border-neutral-200 bg-[#FAFBFC] py-12 sm:py-16">
          <Container>
            <h2 className="text-center text-2xl font-bold text-[#0F4F68] sm:text-3xl">Warum zu uns?</h2>
            <ul className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Faire Bezahlung", short: "Tariforientiert, transparent" },
                { title: "Starke Teams", short: "Kollegial, wertschätzend" },
                { title: "Weiterbildung", short: "Förderung von Qualifikation" },
                { title: "Sinn stiften", short: "Direkt am Menschen wirken" },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-[#0F4F68]/15 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="font-semibold text-[#0F4F68]">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">{item.short}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section className="border-t border-neutral-200 bg-[#FAFBFC] py-14 sm:py-16">
          <Container>
            <div className="mx-auto max-w-2xl rounded-2xl bg-[#0F4F68] px-8 py-12 text-center sm:px-12 sm:py-16">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Keine passende Stelle dabei?</h2>
              <p className="mt-4 text-white/90">
                Initiativbewerbungen sind willkommen. Schicken Sie uns Ihre Unterlagen – wir melden uns.
              </p>
              <Link
                href="/kontakt?betreff=Initiativbewerbung"
                className="mt-8 inline-flex rounded-lg bg-[#F78F2E] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e07d1f] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68]"
              >
                Initiativbewerbung senden
              </Link>
            </div>
          </Container>
        </section>
      </article>
    </div>
  );
}
