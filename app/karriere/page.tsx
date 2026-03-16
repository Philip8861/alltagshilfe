import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
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
    <article className="overflow-hidden">
      {/* Hero + Rechts: Kontaktbild, Telefon, E-Mail */}
      <section className="relative border-b border-[#0F4F68]/15 bg-gradient-to-br from-[#0F4F68] via-[#0F4F68] to-[#0c3d52] px-4 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-[#F78F2E] blur-3xl" />
        </div>
        <Container className="relative">
          <div className="grid gap-10 lg:grid-cols-[1fr,minmax(280px,380px)] lg:items-start lg:gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#F78F2E]">
                Karriere bei {siteConfig.name}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Karriere
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/90">
                Wir suchen Menschen, die mit uns den Alltag von Pflegebedürftigen und
                Angehörigen einfacher und würdevoll gestalten wollen.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-2xl bg-white/95 p-6 shadow-lg lg:sticky lg:top-24">
              <div className="relative aspect-[4/3] w-full max-w-[280px] overflow-hidden rounded-xl">
                <Image
                  src="/images/Kontakt_Bild.webp"
                  alt="Karriere – Alltagshilfe-Süd"
                  width={560}
                  height={420}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 380px"
                />
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-[#0F4F68]">
                Direkt erreichen
              </p>
              <a
                href="tel:+4983349893330"
                className="mt-2 inline-flex items-center gap-2 text-xl font-bold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                aria-label="Anrufen: 08334 9893330"
              >
                <svg className="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden style={{ color: "#F78F2E" }}>
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                08334 / 9893330
              </a>
              <p className="mt-4 text-sm font-semibold text-neutral-600">E-Mail</p>
              <a
                href="mailto:info@alltagshilfe-sued.de"
                className="mt-1 text-base font-medium text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded break-all"
              >
                info@alltagshilfe-sued.de
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Warum wir */}
      <section className="border-b border-neutral-200 bg-[#F2F9FA] py-12 sm:py-16">
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
      <section className="py-16 sm:py-24">
        <Container>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
            Aktuelle Stellenangebote
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
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
        </Container>
      </section>

      {/* Ansprechpartner */}
      <section className="border-t border-neutral-200 bg-white py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">
            Ihr Ansprechpartner
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-600">
            Bei Fragen zu unseren Stellen oder für Ihre Bewerbung – wir sind für Sie da.
          </p>
          <div className="mt-10 flex flex-col items-start gap-8 rounded-2xl border-2 border-[#0F4F68]/15 bg-[#F2F9FA]/60 p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-[#0F4F68]/10 sm:h-48 sm:w-48">
              <img
                src="https://ui-avatars.com/api/?name=Sarah+Weber&size=256&background=e5e7eb&color=0F4F68&bold=true"
                alt="Sarah Weber"
                className="h-full w-full object-cover"
                width={192}
                height={192}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0F4F68]">
                Personal & Recruiting
              </p>
              <h3 className="mt-1 text-2xl font-bold text-neutral-900">
                Sarah Weber
              </h3>
              <p className="mt-2 text-neutral-600">
                Ihre Ansprechpartnerin für alle Fragen zu Stellenangeboten und Bewerbungen.
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
                      href="mailto:karriere@alltagshilfe-sued.de"
                      className="inline-flex items-center gap-2 text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                    >
                      <span className="text-neutral-500" aria-hidden>✉️</span>
                      karriere@alltagshilfe-sued.de
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <dt className="sr-only">Erreichbarkeit</dt>
                  <dd className="text-sm text-neutral-600">
                    Mo–Do 08:30–16:00 Uhr, Fr 08:30–12:00 Uhr
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
      <section className="border-t border-neutral-200 bg-[#F2F9FA] py-16 sm:py-20">
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
