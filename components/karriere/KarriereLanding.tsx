import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { KarriereForm } from "@/components/forms/KarriereForm";
import { BewerbungTippsFab } from "@/components/karriere/BewerbungTippsDialog";
import { siteConfig } from "@/config/site";

const HERO_IMG = "/images/standort_hintergrund.webp";

const HERO_GLOW_CLASS =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]";

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
    <svg className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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
  return (
    <div className="min-w-0 w-full">
      <h2 className="text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl">Offene Stellen</h2>
      <p className="mt-2 text-pretty text-sm text-neutral-600 sm:text-base">
        Klicken Sie auf eine Stelle, um mehr zu erfahren – oder bewerben Sie sich direkt per E-Mail oder über unser
        Kontaktformular nebenan.
      </p>
      <ul className="mt-6 grid list-none grid-cols-1 gap-6 md:grid-cols-2">
        {jobs.map((job) => (
          <li key={job.id} className="min-w-0">
            <article
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 transition-all hover:shadow-lg ${
                job.accent === "primary"
                  ? "border-[#0F4F68]/25 bg-white hover:border-[#0F4F68]/45"
                  : job.accent === "warm"
                    ? "border-[#F78F2E]/30 bg-white hover:border-[#F78F2E]/50"
                    : "border-neutral-200 bg-[#F2F9FA]/60 hover:border-[#0F4F68]/30"
              }`}
            >
              <BewerbungTippsFab className="absolute right-2 top-2 z-20 sm:right-3 sm:top-3" />
              <div
                className={`px-5 py-4 pr-14 sm:px-6 sm:py-5 sm:pr-16 ${
                  job.accent === "primary"
                    ? "bg-[#0F4F68]/05"
                    : job.accent === "warm"
                      ? "bg-[#F78F2E]/08"
                      : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                      {job.type} · {job.location}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#0F4F68] sm:text-xl">{job.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{job.tagline}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
                <ul className="mt-3 space-y-2.5 text-sm text-neutral-700">
                  {STELLEN_VORTEILE.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <VorteilHaken />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/kontakt?betreff=Bewerbung%20${encodeURIComponent(job.title)}`}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                  >
                    Jetzt bewerben
                  </Link>
                  <a
                    href={siteConfig.indeedJobsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg border-2 border-[#0F4F68] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4F68] transition-colors hover:bg-[#0F4F68]/05 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
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

function DanielKontaktSpalte() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-full flex-col items-center gap-6 text-center scale-100 origin-top lg:max-w-lg lg:scale-[0.84] lg:origin-top xl:max-w-xl">
        <div className="flex w-[79.8%] max-w-full flex-col gap-6">
          <div className="flex w-full flex-col">
            <div className="relative isolate w-full overflow-visible rounded-none bg-[#FAFBFC]">
              <Image
                src="/images/Daniel_Niebauer.webp"
                alt="Daniel Niebauer – Alltagshilfe-Süd"
                width={1080}
                height={1350}
                className="h-auto w-full object-contain object-center mix-blend-multiply [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]"
                sizes="(max-width: 1024px) 80vw, 38vw"
              />
            </div>
            <div
              className="relative z-10 -mt-10 w-full rounded-xl bg-[#F2F9FA] px-6 py-3 text-center sm:-mt-12 sm:py-4"
              style={{ boxShadow: "0 -2px 12px rgba(15, 79, 104, 0.15)" }}
            >
              <p className="text-[1.341398069rem] font-bold leading-tight text-[#0F4F68] sm:text-[1.490442188rem]">
                Daniel Niebauer
              </p>
              <p className="mt-0.5 text-[0.894265313rem] font-normal text-neutral-600">Personalreferent</p>
            </div>
          </div>
          <div className="w-full">
            <a
              href="tel:+4983349893330"
              className="inline-flex items-center justify-center gap-2 text-3xl font-bold tabular-nums text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded sm:text-4xl"
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
              08334 / 9893330
            </a>
            <p className="mt-4 text-sm font-semibold text-neutral-600">E-Mail</p>
            <a
              href="mailto:daniel.niebauer@alltagshilfe-sued.de"
              className="mt-1 block text-base font-medium text-[#0F4F68] hover:underline break-all"
            >
              daniel.niebauer@alltagshilfe-sued.de
            </a>
          </div>
          <div className="w-full rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
            <KarriereForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export function KarriereLanding() {
  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article id="karriere-landing" className="min-w-0 scroll-mt-24 overflow-x-clip overflow-y-visible">
        <section className="relative z-0 box-border mx-auto w-full min-w-0 max-w-7xl px-4 pb-10 pt-0 sm:px-6 sm:pb-16 lg:px-[var(--ahs-page-gutter)] lg:pb-[clamp(4rem,9vh+1.5rem,7rem)] lg:pt-[clamp(2rem,5vh+1.25rem,4.75rem)] xl:pb-[clamp(5rem,10vh+1.5rem,8rem)]">
          <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-center lg:justify-items-stretch lg:gap-x-[clamp(1.5rem,3vw,3.25rem)] lg:gap-y-0">
            <div className="box-border w-full min-w-0 max-w-full space-y-[clamp(1.25rem,2vh+0.75rem,1.75rem)] lg:min-w-0 lg:justify-self-start lg:space-y-[clamp(1.15rem,1.6vh+0.7rem,1.75rem)] lg:-translate-x-[clamp(0.75rem,4.5vw,3rem)] lg:pr-0 motion-reduce:lg:translate-x-0">
              <h1
                className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(1.75rem,1.05rem+2.5vw,3rem)]"
                style={{ animationDelay: "0s" }}
              >
                <span className="block text-balance">Karriere bei der Alltagshilfe-Süd</span>
              </h1>
              <p
                className="text-lg font-semibold leading-snug text-[#0F4F68]/90 opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-xl lg:text-[clamp(1.05rem,0.85rem+0.55vw,1.35rem)]"
                style={{ animationDelay: "0.2s" }}
              >
                Da wirken, wo Menschen zählen
              </p>
              <div
                className="pt-1 opacity-0 motion-reduce:opacity-100 animate-fade-in-up"
                style={{ animationDelay: "0.45s" }}
              >
                <Link
                  href="#bewerbung"
                  className="inline-flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto lg:px-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] lg:py-[clamp(0.6rem,0.45rem+0.45vw,0.9rem)] lg:text-[clamp(1rem,0.82rem+0.55vw,1.15rem)]"
                >
                  Jetzt Bewerben
                </Link>
              </div>
            </div>

            <div className="box-border w-full min-w-0 max-w-full lg:min-h-0 lg:translate-x-[clamp(0.75rem,5vw,3.5rem)] lg:justify-self-stretch lg:self-center motion-reduce:lg:translate-x-0">
              <div className="box-border flex justify-center overflow-x-visible bg-[#fafbfc] px-4 pt-3 pb-8 sm:px-8 sm:pt-4 sm:pb-10 lg:flex lg:justify-end lg:px-0 lg:pb-[clamp(1.75rem,3.5vh+0.75rem,3.25rem)] lg:pt-0">
                <div
                  className="mx-auto w-full min-w-0 max-w-[min(100%,72rem)] opacity-0 motion-reduce:opacity-100 animate-fade-in-up max-lg:flex max-lg:max-w-full max-lg:justify-center lg:ml-auto lg:w-full lg:max-w-full"
                  style={{ animationDelay: "0.08s" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- statisches Hero-Asset */}
                  <img
                    src={HERO_IMG}
                    alt="Karriere bei Alltagshilfe-Süd – Team und Region"
                    width={1200}
                    height={800}
                    decoding="async"
                    fetchPriority="high"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1536px) 66vw, 1200px"
                    className={`box-border h-auto w-full max-w-full object-contain object-center lg:object-contain lg:object-right max-lg:mx-auto max-lg:origin-center max-lg:-translate-y-2 max-lg:scale-[1.05] max-lg:motion-reduce:scale-[1.05] ${HERO_GLOW_CLASS}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="bewerbung" className="border-t border-[#0F4F68]/10 bg-[#fafbfc] py-12 sm:py-16 lg:py-20">
          <Container className="max-w-[min(100%,88rem)]">
            <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-6 xl:gap-x-8">
              <div className="min-w-0">
                <OffeneStellenSpalte />
              </div>
              <div className="min-w-0 justify-self-center self-start lg:justify-self-end lg:pl-2 lg:translate-x-1 xl:translate-x-3 2xl:translate-x-5">
                <div className="w-full lg:w-[min(100%,26rem)] xl:w-[min(100%,28rem)]">
                  <DanielKontaktSpalte />
                </div>
              </div>
            </div>
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
