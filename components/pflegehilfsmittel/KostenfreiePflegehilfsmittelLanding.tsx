import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PFLEGEBOX_KONFIGURATOR_PAGE } from "@/lib/pflegebox-konfigurator-path";

const paketItems = [
  "Einmalhandschuhe",
  "Flächendesinfektion",
  "Händedesinfektion",
  "Bettschutzeinlagen",
  "Mundschutz / Masken",
  "Schutzschürzen",
  "Fingerlinge",
  "Lätzchen zum Einmalgebrauch",
] as const;

function KonfiguratorLink({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={PFLEGEBOX_KONFIGURATOR_PAGE}
      className={className}
    >
      {children}
    </Link>
  );
}

export function KostenfreiePflegehilfsmittelLanding() {
  return (
    <div className="bg-neutral-50 text-neutral-800 antialiased">
      <article id="kostenfreie-hero" className="scroll-mt-24">
        <section className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:flex-row lg:gap-12 lg:px-8 lg:pb-20 lg:pt-6">
          <div className="w-full space-y-6 lg:w-1/2">
            <p className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
              100 % kostenfrei ab Pflegegrad 1
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              Ihre kostenfreien Pflegehilfsmittel im Wert von 42&nbsp;€ monatlich
            </h1>
            <p className="text-lg text-neutral-600">
              Sparen Sie sich Zeit und Geld. Stellen Sie Ihre Wunschbox zusammen – wir rechnen direkt mit Ihrer
              Pflegekasse ab. Ohne Rezept, ohne versteckte Kosten.
            </p>

            <div className="pt-2" id="konfigurator">
              <KonfiguratorLink
                className="flex w-full transform items-center justify-center gap-3 rounded-xl bg-[#22c55e] px-8 py-4 text-xl font-bold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 sm:w-auto"
              >
                <svg className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Pflegebox jetzt konfigurieren
              </KonfiguratorLink>
              <p className="mt-3 text-center text-sm text-neutral-500 sm:text-left">
                Dauert nur 2 Minuten. Keine Vertragsbindung.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-neutral-200 shadow-2xl">
              <svg
                className="mb-4 h-16 w-16 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="px-4 text-center font-medium text-neutral-500">
                Platzhalter Bild
                <br />
                <span className="text-sm font-normal">
                  Empfehlung: Seniorin mit pflegender Angehöriger, lächelnd eine Box öffnend.
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#0F4F68]/[0.06] py-12" aria-labelledby="anspruch-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="anspruch-heading" className="mb-8 text-center text-2xl font-bold text-neutral-900">
              Habe ich Anspruch auf die kostenfreien Pflegehilfsmittel?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68]/15 text-xl font-bold text-[#0F4F68]">
                  1
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">Pflegegrad vorhanden</h3>
                <p className="text-neutral-600">
                  Sie oder Ihr Angehöriger haben einen anerkannten Pflegegrad (1 bis 5).
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68]/15 text-xl font-bold text-[#0F4F68]">
                  2
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">Pflege zu Hause</h3>
                <p className="text-neutral-600">
                  Die pflegebedürftige Person lebt zu Hause oder in einer Wohngemeinschaft.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68]/15 text-xl font-bold text-[#0F4F68]">
                  3
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">Private Pflege</h3>
                <p className="text-neutral-600">
                  Die Pflege wird von Angehörigen, Freunden oder Bekannten durchgeführt.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="schritte-heading">
          <div className="mb-12 text-center">
            <h2 id="schritte-heading" className="text-3xl font-bold text-neutral-900">
              In 3 einfachen Schritten zu Ihrer Lieferung
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Kein Aufwand für Sie. Wir übernehmen die Kommunikation mit der Pflegekasse.
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute left-0 top-1/2 z-0 hidden h-1 w-full -translate-y-1/2 bg-[#0F4F68]/10 md:block"
              aria-hidden
            />
            <div className="relative z-10 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Bedarf konfigurieren",
                  text: "Wählen Sie aus hochwertigen Produkten (z. B. Desinfektion, Handschuhe, Bettschutzeinlagen) genau das, was Sie benötigen.",
                },
                {
                  step: "2",
                  title: "Antrag unterschreiben",
                  text: "Unterschreiben Sie den vorausgefüllten Antrag digital oder per Post. Den Rest erledigen wir mit Ihrer Kasse.",
                },
                {
                  step: "3",
                  title: "Kostenfrei erhalten",
                  text: "Sie erhalten Ihr Paket pünktlich und zuverlässig jeden Monat direkt an die Haustür geliefert. Portofrei.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex transform flex-col items-center rounded-2xl border border-neutral-100 bg-white p-8 text-center shadow-lg transition hover:-translate-y-1"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0F4F68] text-2xl font-bold text-white shadow-md">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-neutral-900">{item.title}</h3>
                  <p className="text-neutral-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <KonfiguratorLink
              className="inline-flex rounded-lg bg-[#0F4F68] px-8 py-3 text-lg font-bold text-white shadow-md transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Jetzt in 2 Minuten starten
            </KonfiguratorLink>
          </div>
        </section>

        <section className="bg-neutral-100 py-16" aria-labelledby="pakete-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 id="pakete-heading" className="text-3xl font-bold text-neutral-900">
                Was ist in den Pflegepaketen enthalten?
              </h2>
              <p className="mt-3 text-neutral-600">
                Qualitätsprodukte, die den Pflegealltag spürbar erleichtern (gemäß gesetzlicher Grundlage, SGB XI).
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              {paketItems.map((label) => (
                <li
                  key={label}
                  className="rounded-lg bg-white p-4 text-sm font-semibold text-neutral-700 shadow-sm sm:text-base"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-white py-12" aria-label="Abschluss">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-neutral-600">
              {siteConfig.name} unterstützt Sie bei der Beantragung und Abrechnung mit Ihrer Pflegekasse. Bei Fragen
              erreichen Sie uns über unsere{" "}
              <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline-offset-2 hover:underline">
                Kontaktseite
              </Link>
              .
            </p>
            <KonfiguratorLink
              className="mt-6 inline-flex rounded-lg bg-[#F78F2E] px-8 py-3 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
            >
              Jetzt konfigurieren
            </KonfiguratorLink>
          </div>
        </section>
      </article>
    </div>
  );
}
