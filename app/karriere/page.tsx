import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { KarriereForm } from "@/components/forms/KarriereForm";
import { KarriereHeadline } from "@/components/karriere/KarriereHeadline";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Karriere",
  description: `Karriere und Stellenangebote – ${siteConfig.name}. Werden Sie Teil unseres Teams.`,
};

const jobs = [
  {
    id: "pflegefachkraft",
    title: "Pflegefachkraft (m/w/d)",
    tagline: "Menschen im Alltag stärken",
    type: "Vollzeit",
    location: "Memmingen & Umgebung",
    highlights: [
      "Sinnstiftende Arbeit mit direktem Kontakt zu Menschen",
      "Feste Teams, faire Dienstplangestaltung",
      "Weiterbildung und fachliche Begleitung",
    ],
    accent: "primary" as const,
    icon: "heart",
  },
  {
    id: "betreuungskraft",
    title: "Betreuungskraft für den Alltag (m/w/d)",
    tagline: "Begleitung, die ankommt",
    type: "Teilzeit / Vollzeit",
    location: "Verschiedene Standorte",
    highlights: [
      "Vielfältige Einsatzmöglichkeiten",
      "Einarbeitung durch erfahrene Kolleg:innen",
      "Attraktive Sozialleistungen",
    ],
    accent: "warm" as const,
    icon: "hand",
  },
  {
    id: "sachbearbeiter-pflegeberatung",
    title: "Sachbearbeiter:in Pflegeberatung (m/w/d)",
    tagline: "Schnittstelle zwischen Mensch und System",
    type: "Vollzeit",
    location: "Büro Memmingen",
    highlights: [
      "Beratung und Koordination von Pflegeleistungen",
      "Moderne Arbeitsmittel, hybrid möglich",
      "Starkes Team im Hintergrund",
    ],
    accent: "soft" as const,
    icon: "desk",
  },
  {
    id: "quereinsteiger-pflegehilfe",
    title: "Quereinsteiger:in Pflegehilfe (m/w/d)",
    tagline: "Ihr Neustart in der Pflege",
    type: "Vollzeit nach Einarbeitung",
    location: "Alle Standorte",
    highlights: [
      "Strukturierte Einarbeitung ohne Druck",
      "Qualifizierung wird gefördert",
      "Sichere Festanstellung",
    ],
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
    <svg
      className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export default function KarrierePage() {
  return (
    <article className="overflow-hidden bg-[#FAFBFC]">
      {/* Hero: Bild mittig, ovaler Rahmen; F2F9FA ab Bildmitte nach unten */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(to bottom, transparent 0%, transparent 50%, #F2F9FA 50%, #F2F9FA 100%)" }}
      >
        <div className="relative flex justify-center px-4 py-6 md:px-8 md:py-10">
          <div className="overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] lg:rounded-[4rem] [box-shadow:0_4px_20px_rgba(15,79,104,0.35)]">
            <Image
              src="/images/karriere/Karriere.webp"
              alt="Karriere bei Alltagshilfe-Süd"
              width={1920}
              height={1080}
              className="block h-auto w-full max-w-6xl object-cover object-center"
              sizes="100vw"
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 flex scale-110 origin-right items-center justify-end pr-[5vw] md:pr-[calc(5vw+2rem)] lg:pr-[calc(5vw+4rem)]">
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 px-6 py-10 md:max-w-sm md:py-12 lg:max-w-md lg:px-10" style={{ transform: "translateY(-5vh)" }}>
            <KarriereHeadline>
              <Link
                href="#bewerbung"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] px-8 py-4 text-lg font-bold text-white shadow-lg transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Jetzt Bewerben
              </Link>
            </KarriereHeadline>
          </div>
        </div>
      </section>

      {/* Daniel-Bereich mit gleichem Abstand wie Kontakt */}
      <section id="bewerbung" className="bg-[#FAFBFC] py-16 sm:py-24">
        <Container className="flex justify-center">
          <div className="mx-auto flex w-full max-w-6xl justify-end">
            <div className="flex flex-col items-center gap-6 text-center scale-100 origin-top lg:scale-[0.84] lg:origin-top lg:w-[50%]">
              <div className="flex w-full flex-col items-center">
                <div className="relative isolate w-[84%] max-w-[84%] overflow-visible rounded-none bg-[#FAFBFC] lg:max-w-[84%]">
                  <Image
                    src="/images/Daniel_Niebauer.webp"
                    alt="Daniel Niebauer – Alltagshilfe-Süd"
                    width={1080}
                    height={1350}
                    className="h-auto w-full object-contain object-center mix-blend-multiply [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]"
                    sizes="(max-width: 1024px) 84vw, 40vw"
                  />
                </div>
                <div
                  className="relative z-10 -mt-10 w-[63%] min-w-[200px] rounded-xl bg-[#F2F9FA] px-6 py-3 text-center sm:-mt-12 sm:py-4"
                  style={{ boxShadow: "0 -2px 12px rgba(15, 79, 104, 0.15)" }}
                >
                  <p className="text-lg font-bold text-[#0F4F68] sm:text-xl">Daniel Niebauer</p>
                  <p className="text-xs font-normal text-neutral-600">Personalreferent</p>
                </div>
              </div>
              <div className="mx-auto w-full max-w-md">
                <a
                  href="tel:+4983349893330"
                  className="inline-flex items-center justify-center gap-2 text-3xl font-bold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded sm:text-4xl"
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
              <div className="w-full max-w-md rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8">
                <KarriereForm />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Warum wir */}
      <section className="border-b border-neutral-200 bg-[#FAFBFC] py-12 sm:py-16">
        <Container>
          <h2 className="text-center text-2xl font-bold text-[#0F4F68] sm:text-3xl">
            Warum zu uns?
          </h2>
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

      {/* Stellenanzeigen */}
      <section className="bg-[#0F4F68] py-16 sm:py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Aktuelle Stellenangebote
          </h2>
          <p className="mt-3 max-w-2xl text-white/90">
            Klicken Sie auf eine Stelle, um mehr zu erfahren – oder bewerben Sie
            sich direkt per E-Mail oder über unser Kontaktformular.
          </p>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {jobs.map((job, index) => (
              <li key={job.id}>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 transition-all hover:shadow-xl ${
                    job.accent === "primary"
                      ? "border-[#0F4F68]/30 bg-white hover:border-[#0F4F68]/50"
                      : job.accent === "warm"
                        ? "border-[#F78F2E]/30 bg-white hover:border-[#F78F2E]/50"
                        : "border-neutral-200 bg-[#F2F9FA]/50 hover:border-[#0F4F68]/30"
                  }`}
                >
                  <div
                    className={`px-6 py-5 sm:px-8 sm:py-6 ${
                      job.accent === "primary"
                        ? "bg-[#0F4F68]/05"
                        : job.accent === "warm"
                          ? "bg-[#F78F2E]/08"
                          : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
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
                        <h3 className="mt-1 text-xl font-bold text-[#0F4F68] sm:text-2xl">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-neutral-600">{job.tagline}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-6 sm:px-8 sm:pb-8">
                    <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                      {job.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]"
                            aria-hidden
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/kontakt?betreff=Bewerbung%20${encodeURIComponent(job.title)}`}
                        className="inline-flex items-center rounded-lg bg-[#0F4F68] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                      >
                        Jetzt bewerben
                      </Link>
                      <span className="inline-flex items-center text-sm text-neutral-500">
                        oder anrufen:{" "}
                        <a
                          href="tel:+4983349893330"
                          className="font-medium text-[#0F4F68] hover:underline"
                        >
                          08334 / 9893330
                        </a>
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          {/* Verknüpfung Indeed – alle offenen Stellen */}
          {siteConfig.indeedJobsUrl && (
            <div className="mt-12 rounded-2xl border-2 border-white/30 bg-white/10 p-6 text-center sm:p-8">
              <p className="text-lg font-semibold text-white sm:text-xl">
                Alle aktuellen Stellenangebote finden Sie auch bei Indeed.
              </p>
              <p className="mt-2 text-white/90">
                Dort können Sie sich direkt bewerben oder die Details zu jeder Stelle einsehen.
              </p>
              <a
                href={siteConfig.indeedJobsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2557a7] px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68]"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Offene Stellen bei Indeed anzeigen
              </a>
            </div>
          )}
        </Container>
      </section>

      {/* Ansprechpartner */}
      <section className="border-t border-neutral-200 bg-[#FAFBFC] py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">
            Ihr Ansprechpartner
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-600">
            Bei Fragen zu unseren Stellen oder für Ihre Bewerbung – wir sind für Sie da.
          </p>
          <div className="mt-10 flex flex-col items-start gap-8 rounded-2xl border-2 border-[#0F4F68]/15 bg-[#F2F9FA]/60 p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
            <div className="relative isolate w-[10.5rem] shrink-0 overflow-visible rounded-none sm:w-[12.6rem]">
              <Image
                src="/images/Daniel_Niebauer.webp"
                alt="Daniel Niebauer – Personalreferent, Alltagshilfe-Süd"
                width={1080}
                height={1350}
                className="h-auto w-full object-contain object-center mix-blend-multiply [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]"
                sizes="(max-width: 640px) 168px, 202px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0F4F68]">
                Personal & Recruiting
              </p>
              <h3 className="mt-1 text-2xl font-bold text-neutral-900">
                Daniel Niebauer
              </h3>
              <p className="mt-2 text-neutral-600">
                Ihr Ansprechpartner für alle Fragen zu Stellenangeboten und Bewerbungen.
              </p>
              <dl className="mt-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="sr-only">Telefon</dt>
                  <dd>
                    <a
                      href="tel:+4983349893330"
                      className="inline-flex items-center gap-2 text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                    >
                      <span className="text-neutral-500" aria-hidden>📞</span>
                      08334 / 9893330
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="sr-only">E-Mail</dt>
                  <dd>
                    <a
                      href="mailto:daniel.niebauer@alltagshilfe-sued.de"
                      className="inline-flex items-center gap-2 text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                    >
                      <span className="text-neutral-500" aria-hidden>✉️</span>
                      daniel.niebauer@alltagshilfe-sued.de
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="sr-only">Erreichbarkeit</dt>
                  <dd className="text-sm text-neutral-600">
                    Mo–Do: 08:30 – 12:00 und 13:00 – 16:00 Uhr · Freitag: 08:30 – 12:00 Uhr
                  </dd>
                </div>
              </dl>
              <Link
                href="/kontakt?betreff=Karriere%20Anfrage"
                className="mt-6 inline-flex rounded-lg bg-[#0F4F68] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
              >
                Nachricht schreiben
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-[#FAFBFC] py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl bg-[#0F4F68] px-8 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Keine passende Stelle dabei?
            </h2>
            <p className="mt-4 text-white/90">
              Initiativbewerbungen sind willkommen. Schicken Sie uns Ihre
              Unterlagen – wir melden uns.
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
  );
}
