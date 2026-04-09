import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PFLEGEBOX_KONFIGURATOR_PAGE } from "@/lib/pflegebox-konfigurator-path";

/** Einziges Hero-Bild dieser Seite (Datei unverändert aus /public/images). */
const KOSTENFREI_HERO_IMG = "/images/kostenfreiepflegehilfsmittel.webp";

/**
 * Wie Startseite unten (`StandortWechselBild` / Hero): `drop-shadow` folgt der Alpha-Maske –
 * transparente „Aussparungen“ im Bild bekommen keinen Schatten (kein `box-shadow` um das Rechteck).
 */
const KOSTENFREI_HERO_GLOW_CLASS =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]";

const KOSTENFREI_HERO_VORTEILE = [
  "Ab Pflegegrad 1 kostenlos",
  "Kostenfreier und schneller Versand",
  "Zugelassen bei allen Krankenkassen",
] as const;

/** Wie Startseiten-Hero: orangener Kreis mit Häkchen. */
function KostenfreiHeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

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

const KOSTENFREI_FAQ = [
  {
    q: "Wer trägt die Kosten für die monatlichen Pflegehilfsmittel?",
    a: `Die gesetzliche Pflegekasse übernimmt den monatlichen Festbetrag (derzeit 42\u00A0€) für anerkannte Hilfsmittel, wenn die gesetzlichen Voraussetzungen erfüllt sind. Sie zahlen bei korrekter Beantragung keine Zuzahlung für diesen Rahmen.`,
  },
  {
    q: "Ab welchem Pflegegrad kann ich die Leistung nutzen?",
    a: `Grundsätzlich besteht Anspruch ab Pflegegrad\u00A01, sofern die pflegebedürftige Person zu Hause betreut wird und die weiteren Voraussetzungen (z.\u00A0B. private Pflege) erfüllt sind. Unsicherheiten klären wir gern mit Ihnen oder bei Bedarf auch über unsere Pflegeberatung.`,
  },
  {
    q: "Wie läuft die Beantragung bei Alltagshilfe-Süd ab?",
    a: "Sie stellen Ihre Wunschprodukte im Konfigurator zusammen. Anschließend erhalten Sie die Unterlagen für Ihre Pflegekasse und unsere Unterstützung bei der Abwicklung – digital oder postalisch, wie es für Sie passt.",
  },
  {
    q: "Kann ich die Zusammenstellung monatlich anpassen?",
    a: "Ja, solange Sie sich innerhalb des monatlichen Budgets bewegen, können Sie Mengen und Artikel wechseln. So bleibt die Box an Alltag und Hygiene-Routine angepasst.",
  },
  {
    q: "Was passiert nach der Bestellung?",
    a: "Nach Einreichung bei der Kasse bearbeiten wir die Lieferung. Das Paket wird zuverlässig nach Hause geliefert – erneut im nächsten Monat, solange der Anspruch besteht und die Mittel zur Verfügung stehen.",
  },
  {
    q: "Gibt es eine Vertragsbindung oder versteckte Kosten?",
    a: "Nein. Sie bestellen ohne langfristige Bindung; die Abrechnung erfolgt über die Pflegekasse im Rahmen der gesetzlichen Regelungen. Kosten für Produkte außerhalb des Budgets oder ohne Anspruch werden transparent gekennzeichnet.",
  },
] as const;

const kostenfreiFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: KOSTENFREI_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

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

/** Drehendes Zahnrad (langsam); bei „reduced motion“ ohne Animation. */
function KonfiguratorGearIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 motion-safe:animate-[spin_4s_linear_infinite] ${className}`.trim()}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function KostenfreiePflegehilfsmittelLanding() {
  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article
        id="kostenfreie-hero"
        className="min-w-0 scroll-mt-24 overflow-x-clip overflow-y-visible"
      >
        <section className="relative z-0 box-border mx-auto w-full min-w-0 max-w-7xl px-4 pb-16 pt-0 sm:px-6 sm:pb-24 lg:px-[var(--ahs-page-gutter)] lg:pb-[clamp(5.5rem,12vh+2rem,9rem)] lg:pt-[clamp(2rem,5vh+1.25rem,4.75rem)] xl:pb-[clamp(6.5rem,13vh+2.5rem,10rem)]">
          <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,0.395fr)_minmax(0,0.605fr)] lg:items-center lg:justify-items-stretch lg:gap-x-[min(2.5rem,3.5vw)] lg:gap-y-0">
            <div className="box-border w-full min-w-0 max-w-full space-y-[clamp(1.25rem,2vh+0.75rem,1.75rem)] lg:justify-self-start lg:space-y-[clamp(1.1rem,1.5vh+0.65rem,1.65rem)]">
            <h1
              className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(1.75rem,1.05rem+2.5vw,3rem)]"
              style={{ animationDelay: "0s" }}
            >
              Ihre kostenfreien Pflegehilfsmittel im Wert von 42&nbsp;€ monatlich
            </h1>
            <ul
              className="mt-5 space-y-3 sm:mt-6 sm:space-y-3.5 lg:mt-0 lg:space-y-[clamp(0.65rem,0.35rem+0.9vw,1rem)]"
              aria-label="Ihre Vorteile auf einen Blick"
            >
              {KOSTENFREI_HERO_VORTEILE.map((line, i) => (
                <li
                  key={line}
                  className="flex items-center gap-3 text-pretty text-lg font-semibold leading-snug text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-xl lg:text-[clamp(1.05rem,0.82rem+0.5vw,1.35rem)]"
                  style={{
                    animationDelay: `${0.45 + i * 0.22}s`,
                  }}
                >
                  <KostenfreiHeroCheckIcon />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div
              className="pt-2 opacity-0 motion-reduce:opacity-100 animate-fade-in-up"
              style={{ animationDelay: "1.12s" }}
              id="konfigurator"
            >
              <KonfiguratorLink
                className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto lg:w-auto lg:gap-[clamp(0.35rem,0.25rem+0.35vw,0.55rem)] lg:px-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] lg:py-[clamp(0.6rem,0.45rem+0.45vw,0.9rem)] lg:text-[clamp(1rem,0.82rem+0.55vw,1.15rem)]"
              >
                <KonfiguratorGearIcon className="h-5 w-5" />
                Pflegebox jetzt konfigurieren
              </KonfiguratorLink>
              <p className="mt-3 text-center text-sm text-neutral-600 sm:text-left lg:text-[clamp(0.8rem,0.7rem+0.35vw,0.95rem)]">
                Dauert nur 2 Minuten. Keine Vertragsbindung. Jederzeit kündbar.
              </p>
            </div>
          </div>

            <div className="box-border w-full min-w-0 max-w-full lg:min-h-0 lg:justify-self-stretch lg:self-center">
              <div className="box-border flex justify-center overflow-x-visible bg-[#fafbfc] px-4 pt-3 pb-8 sm:px-8 sm:pt-4 sm:pb-10 lg:flex lg:justify-center lg:px-0 lg:pb-[clamp(1.75rem,3.5vh+0.75rem,3.25rem)] lg:pt-0">
                <div
                  className="mx-auto w-full min-w-0 max-w-[min(100%,72rem)] opacity-0 motion-reduce:opacity-100 animate-fade-in-up max-lg:flex max-lg:max-w-full max-lg:justify-center lg:w-full"
                  style={{ animationDelay: "0.08s" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- statische Asset-URL; Datei: kostenfreiepflegehilfsmittel.webp */}
                  <img
                    src={KOSTENFREI_HERO_IMG}
                    alt="Kostenfreie Pflegehilfsmittel – Übersicht"
                    width={1162}
                    height={845}
                    decoding="async"
                    fetchPriority="high"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1536px) 62vw, 900px"
                    className={`box-border h-auto w-full max-w-full object-contain object-center lg:object-contain lg:object-center max-lg:mx-auto max-lg:origin-center max-lg:translate-x-0 max-lg:-translate-y-2 max-lg:scale-[1.05] max-lg:motion-reduce:scale-[1.05] ${KOSTENFREI_HERO_GLOW_CLASS}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 bg-[#F2F9FA] px-4 pb-12 pt-20 sm:px-6 sm:pb-14 sm:pt-24 lg:px-[var(--ahs-page-gutter)] lg:pt-28"
          aria-labelledby="anspruch-heading"
        >
          <svg
            className="pointer-events-none absolute left-0 top-0 z-0 h-[clamp(2.5rem,1.5rem+3.8vw,5rem)] w-full -translate-y-[clamp(0.9rem,0.35rem+2.1vw,3.2rem)]"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path
              d="M0,100 C140,38 300,8 460,36 C620,65 760,95 900,72 C980,58 1080,28 1200,18 L1200,100 L0,100 Z"
              fill="#F2F9FA"
            />
          </svg>
          <div className="relative z-[1] mx-auto max-w-7xl">
            <h2 id="anspruch-heading" className="mb-2 text-center text-2xl font-bold text-[#0F4F68] sm:text-3xl">
              Habe ich Anspruch auf die kostenfreien Pflegehilfsmittel?
            </h2>
            <p className="mb-8 text-center text-sm text-[#8a6a55] sm:text-base">
              Die wichtigsten Voraussetzungen auf einen Blick
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-6 text-center shadow-sm transition hover:shadow-[0_0_24px_rgba(15,79,104,0.12)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68] text-xl font-bold text-white">
                  1
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0F4F68]">Pflegegrad vorhanden</h3>
                <p className="text-neutral-600">
                  Sie oder Ihr Angehöriger haben einen anerkannten Pflegegrad (1 bis 5).
                </p>
              </div>
              <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-6 text-center shadow-sm transition hover:shadow-[0_0_24px_rgba(15,79,104,0.12)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68] text-xl font-bold text-white">
                  2
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0F4F68]">Pflege zu Hause</h3>
                <p className="text-neutral-600">
                  Die pflegebedürftige Person lebt zu Hause oder in einer Wohngemeinschaft.
                </p>
              </div>
              <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-6 text-center shadow-sm transition hover:shadow-[0_0_24px_rgba(15,79,104,0.12)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0F4F68] text-xl font-bold text-white">
                  3
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#0F4F68]">Private Pflege</h3>
                <p className="text-neutral-600">
                  Die Pflege wird von Angehörigen, Freunden oder Bekannten durchgeführt.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-[var(--ahs-page-gutter)]"
          aria-labelledby="schritte-heading"
        >
          <div className="mb-12 text-center">
            <h2 id="schritte-heading" className="text-3xl font-bold text-[#0F4F68] sm:text-4xl">
              In 3 einfachen Schritten zu Ihrer Lieferung
            </h2>
            <p className="mt-3 text-sm text-[#8a6a55] sm:text-base">
              Persönlich, zuverlässig und mit viel Herz im Alltag
            </p>
            <p className="mt-4 text-lg text-neutral-600">
              Kein Aufwand für Sie. Wir übernehmen die Kommunikation mit der Pflegekasse.
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute left-0 top-1/2 z-0 hidden h-1 w-full -translate-y-1/2 bg-[#0F4F68]/15 md:block"
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
                  className="flex transform flex-col items-center rounded-2xl border border-[#0F4F68]/10 bg-white p-8 text-center shadow-md transition hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(15,79,104,0.15)] motion-reduce:transform-none"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0F4F68] text-2xl font-bold text-white shadow-md">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0F4F68]">{item.title}</h3>
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

        <section className="bg-[#F2F9FA] py-16" aria-labelledby="pakete-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
            <div className="mb-10 text-center">
              <h2 id="pakete-heading" className="text-3xl font-bold text-[#0F4F68] sm:text-4xl">
                Was ist in den Pflegepaketen enthalten?
              </h2>
              <p className="mt-2 text-sm text-[#8a6a55] sm:text-base">
                Qualität für den Pflegealltag
              </p>
              <p className="mt-3 text-neutral-600">
                Qualitätsprodukte, die den Pflegealltag spürbar erleichtern (gemäß gesetzlicher Grundlage, SGB XI).
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              {paketItems.map((label) => (
                <li
                  key={label}
                  className="rounded-xl border border-[#0F4F68]/10 bg-white p-4 text-sm font-semibold text-[#0F4F68] shadow-sm sm:text-base"
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="relative isolate overflow-x-clip bg-gradient-to-b from-[#e8f4f7]/90 via-[#fafbfc] to-white py-14 sm:py-20"
          aria-labelledby="kostenfrei-faq-heading"
        >
          <div
            className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#F78F2E]/10 blur-3xl sm:-right-16"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#0F4F68]/[0.07] blur-3xl"
            aria-hidden
          />
          <div className="relative z-[1] mx-auto max-w-3xl px-4 sm:px-6">
            <h2
              id="kostenfrei-faq-heading"
              className="text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
            >
              Häufige Fragen
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-[#8a6a55] sm:text-base">
              Kurz und verständlich – rund um Ihre kostenfreien Pflegehilfsmittel
            </p>
            <div className="mt-10 space-y-3">
              {KOSTENFREI_FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-[#0F4F68]/12 bg-white/95 shadow-[0_2px_16px_rgba(15,79,104,0.06)] backdrop-blur-sm transition hover:border-[#F78F2E]/35 hover:shadow-[0_8px_28px_rgba(15,79,104,0.1)] open:border-[#0F4F68]/18 open:shadow-[0_10px_32px_rgba(15,79,104,0.12)]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-[#0F4F68] sm:px-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-base font-semibold leading-snug sm:text-[1.05rem]">{item.q}</span>
                    <span
                      className="inline-flex shrink-0 rounded-full bg-[#F78F2E]/12 p-1.5 text-[#F78F2E] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="border-t border-[#0F4F68]/8 px-4 pb-4 pt-2 text-pretty text-sm leading-relaxed text-neutral-600 sm:px-5 sm:text-base">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(kostenfreiFaqJsonLd) }}
          />
        </section>

        <section
          className="border-t border-[#0F4F68]/10 bg-white py-12"
          aria-label="Abschluss"
        >
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
