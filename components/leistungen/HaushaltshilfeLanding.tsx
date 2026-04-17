import type { ReactNode } from "react";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { siteConfig } from "@/config/site";
import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";
import { STARTSEITE_VORTEILE } from "@/lib/startseite-vorteile";

const HERO_IMG = "/images/haushaltshilfe.webp";

const HERO_GLOW_CLASS =
  "[filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]";

const HERO_VORTEILE = [
  "Freie Kapazitäten & kurze Wartezeiten",
  "Zugelassen bei allen Krankenkassen",
  "Feste Bezugsperson statt ständiger Wechsel",
] as const;

const WELLEN_D =
  "M0,100 C200,26 420,6 600,18 C800,32 1010,75 1200,100 L1200,100 L0,100 Z";

const WELLEN_SVG_CLASS =
  "pointer-events-none absolute left-0 top-0 z-0 h-16 w-full -translate-y-7 sm:h-[clamp(2.85rem,1.5rem+3.8vw,5rem)] sm:-translate-y-[clamp(0.9rem,0.35rem+2.1vw,3.2rem)]";

function HeroCheckIcon({ className = "" }: { className?: string }) {
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

const SCHRITTE = [
  {
    step: "Schritt 1",
    title: "Unverbindlich anfragen",
    description:
      "Kontaktieren Sie uns telefonisch oder über das Kontaktformular. Wir klären kurz Ihren Bedarf und die nächsten Schritte – ohne Verpflichtung.",
  },
  {
    step: "Schritt 2",
    title: "Persönliche Abstimmung",
    description:
      "Wir stimmen Umfang, Termine und Details mit Ihnen ab. So passt die Haushaltshilfe zu Ihrem Alltag und Ihrer Lebenssituation.",
  },
  {
    step: "Schritt 3",
    title: "Zuverlässige Unterstützung",
    description:
      "Ihre festen Ansprechpartnerinnen und Ansprechpartner unterstützen Sie regelmäßig und verlässlich – damit Sie entlastet sind.",
  },
] as const;

const LEISTUNGS_TILES = [
  "Saugen und Wischen der Böden",
  "Fenster putzen",
  "Reinigung von Bad und Küche",
  "Mahlzeiten zubereiten",
  "Aufräumen und Ordnung halten",
  "Wäsche waschen und bügeln",
] as const;

const FAQ_INLINE =
  "font-semibold text-[#0F4F68] underline underline-offset-2 decoration-[#0F4F68]/40 hover:decoration-[#F78F2E] hover:text-[#0c3d52]";

type FaqItem = { q: string; answerPlain: string; answer: ReactNode };

const FAQ: FaqItem[] = [
  {
    q: "Was versteht man unter Haushaltshilfe?",
    answerPlain:
      "Haushaltshilfe umfasst haushaltsnahe Tätigkeiten wie Reinigung, kleinere Reparaturen oder Gartenarbeiten – abgestimmt auf Ihre Bedürfnisse.",
    answer: (
      <>
        Haushaltshilfe umfasst haushaltsnahe Tätigkeiten wie Reinigung, kleinere Reparaturen oder Gartenarbeiten –
        immer in Absprache mit Ihnen und passend zu Ihrer Situation.
      </>
    ),
  },
  {
    q: "In welchen Regionen bieten Sie Haushaltshilfe an?",
    answerPlain: `${siteConfig.name} ist in mehreren Regionen in Süddeutschland für Sie da. Details zu Ihrem Ort finden Sie auf unserer Standorte-Seite oder bei der Anfrage.`,
    answer: (
      <>
        {siteConfig.name} ist in mehreren Regionen für Sie da. Eine Übersicht finden Sie unter{" "}
        <Link href="/standorte" className={FAQ_INLINE}>
          Standorte
        </Link>
        ; gern prüfen wir anhand Ihrer Postleitzahl, ob wir Sie direkt unterstützen können.
      </>
    ),
  },
  {
    q: "Wer trägt die Kosten für Haushaltshilfe?",
    answerPlain:
      "Das hängt von Ihrer Situation ab: z. B. Pflegegrad, Entlastungsbetrag oder private Vereinbarung. Wir beraten Sie gern und verweisen auf die zuständigen Stellen.",
    answer: (
      <>
        Das ist individuell – z.&nbsp;B. über den Entlastungsbetrag bei anerkanntem Pflegegrad, andere Leistungen oder
        privat. Wir geben Ihnen bei der{" "}
        <Link href="/kontakt" className={FAQ_INLINE}>
          Kontaktaufnahme
        </Link>{" "}
        eine erste Orientierung.
      </>
    ),
  },
  {
    q: "Wie schnell kann Unterstützung starten?",
    answerPlain:
      "Je nach Region und Personalverfügbarkeit bemühen wir uns um zeitnahe Termine. Nach der Anfrage melden wir uns mit einem konkreten Vorschlag.",
    answer: (
      <>
        Nach Ihrer Anfrage melden wir uns mit den nächsten möglichen Terminen. Die Dauer hängt von Kapazität und Region
        ab – wir halten Sie transparent auf dem Laufenden.
      </>
    ),
  },
  {
    q: "Kann ich die Haushaltshilfe anpassen oder pausieren?",
    answerPlain:
      "Ja, Umfang und Rhythmus werden mit Ihnen vereinbart und können – soweit vertraglich möglich – angepasst werden.",
    answer: <>Umfang und Termine stimmen wir mit Ihnen ab; Änderungen besprechen wir offen mit Blick auf Ihre Entlastung.</>,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.answerPlain },
  })),
};

export function HaushaltshilfeLanding() {
  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article id="haushaltshilfe-hero" className="min-w-0 scroll-mt-24 overflow-x-clip overflow-y-visible">
        <section className="relative z-0 box-border mx-auto w-full min-w-0 max-w-7xl px-4 pb-10 pt-0 sm:px-6 sm:pb-16 lg:px-[var(--ahs-page-gutter)] lg:pb-[clamp(4rem,9vh+1.5rem,7rem)] lg:pt-[clamp(2rem,5vh+1.25rem,4.75rem)] xl:pb-[clamp(5rem,10vh+1.5rem,8rem)]">
          <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-center lg:justify-items-stretch lg:gap-x-[clamp(1.5rem,3vw,3.25rem)] lg:gap-y-0">
            <div className="box-border w-full min-w-0 max-w-full space-y-[clamp(1.25rem,2vh+0.75rem,1.75rem)] lg:min-w-0 lg:justify-self-start lg:space-y-[clamp(1.15rem,1.6vh+0.7rem,1.75rem)] lg:-translate-x-[clamp(0.75rem,4.5vw,3rem)] lg:pr-0 motion-reduce:lg:translate-x-0">
              <h1
                className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(1.75rem,1.05rem+2.5vw,3rem)]"
                style={{ animationDelay: "0s" }}
              >
                <span className="block">Haushaltshilfe ganz in Ihrer Nähe</span>
              </h1>
              <ul
                className="mt-5 min-w-0 space-y-3 sm:mt-6 sm:space-y-3.5 lg:mt-0 lg:space-y-[clamp(0.65rem,0.35rem+0.9vw,1rem)]"
                aria-label="Ihre Vorteile auf einen Blick"
              >
                {HERO_VORTEILE.map((line, i) => (
                  <li
                    key={line}
                    className="flex min-w-0 items-start gap-3 text-lg font-semibold leading-snug text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-xl lg:items-center lg:text-[clamp(1.05rem,0.82rem+0.5vw,1.35rem)]"
                    style={{ animationDelay: `${0.45 + i * 0.22}s` }}
                  >
                    <HeroCheckIcon className="mt-0.5 lg:mt-0" />
                    <span className="min-w-0 flex-1 text-pretty">{line}</span>
                  </li>
                ))}
              </ul>

              <div
                className="pt-2 opacity-0 motion-reduce:opacity-100 animate-fade-in-up"
                style={{ animationDelay: "1.12s" }}
              >
                <Link
                  href="/kontakt"
                  className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto lg:w-auto lg:px-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] lg:py-[clamp(0.6rem,0.45rem+0.45vw,0.9rem)] lg:text-[clamp(1rem,0.82rem+0.55vw,1.15rem)]"
                >
                  Jetzt Kontakt aufnehmen
                </Link>
                <p className="mt-3 min-w-0 max-w-full text-pretty text-center text-sm leading-snug text-neutral-600 sm:text-left lg:text-[clamp(0.8rem,0.7rem+0.35vw,0.95rem)]">
                  Unverbindliche Erstberatung – wir melden uns zeitnah bei Ihnen.
                </p>
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
                    alt="Haushaltshilfe – Unterstützung im Alltag bei Ihnen zu Hause"
                    width={1200}
                    height={800}
                    decoding="async"
                    fetchPriority="high"
                    sizes="(max-width: 1023px) 100vw, (max-width: 1536px) 66vw, 1200px"
                    className={`box-border h-auto w-full max-w-full object-contain object-center lg:object-contain lg:object-right max-lg:mx-auto max-lg:origin-center max-lg:translate-x-0 max-lg:-translate-y-2 max-lg:scale-[1.05] max-lg:motion-reduce:scale-[1.05] ${HERO_GLOW_CLASS}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 overflow-x-clip bg-[#F2F9FA] px-4 pb-16 pt-[clamp(2.5rem,4.5vw,4.25rem)] sm:px-6 sm:pb-20 lg:px-[var(--ahs-page-gutter)] lg:pb-24"
          aria-labelledby="haushalt-leistungen-heading"
        >
          <svg
            className={WELLEN_SVG_CLASS}
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d={WELLEN_D} fill="#F2F9FA" />
          </svg>
          <div className="relative z-[1] mx-auto max-w-7xl">
            <RevealOnScroll>
              <div className="mb-10 text-center sm:mb-12">
                <h2 id="haushalt-leistungen-heading" className="text-3xl font-bold text-[#0F4F68] sm:text-4xl">
                  Das übernehmen wir im Haushalt
                </h2>
                <p className="mt-3 text-pretty text-neutral-600 sm:max-w-3xl sm:mx-auto">
                  Typische haushaltsnahe Leistungen – im Detail stimmen wir alles mit Ihnen ab.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120}>
              <ul className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 md:grid-cols-3">
                {LEISTUNGS_TILES.map((label) => (
                  <li
                    key={label}
                    className="rounded-xl border border-[#0F4F68]/10 bg-white p-4 text-sm font-semibold text-[#0F4F68] shadow-sm sm:text-base"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </RevealOnScroll>
          </div>
        </section>

        <section
          className="relative z-[11] overflow-x-clip bg-[#fafbfc] px-4 pb-16 pt-[clamp(2.5rem,4.5vw,4.25rem)] sm:px-6 sm:pb-20 lg:px-[var(--ahs-page-gutter)] lg:pb-24"
          aria-labelledby="haushalt-schritte-heading"
        >
          <svg
            className={WELLEN_SVG_CLASS}
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d={WELLEN_D} fill="#fafbfc" />
          </svg>
          <div className="relative z-[1] mx-auto max-w-7xl">
            <RevealOnScroll>
              <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
                <h2
                  id="haushalt-schritte-heading"
                  className="text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
                >
                  So einfach zur passenden Haushaltshilfe
                </h2>
                <p className="mt-3 text-pretty text-sm text-[#8a6a55] sm:text-base">
                  Drei Schritte zur verlässlichen Haushaltshilfe, schnell & unkompliziert
                </p>
              </div>
            </RevealOnScroll>

            <ol className="grid auto-rows-fr gap-6 md:grid-cols-3 md:gap-8 md:items-stretch">
              {SCHRITTE.map((item, i) => (
                <li key={item.step} className="flex min-h-0 list-none">
                  <RevealOnScroll delayMs={i * 150} className="h-full min-h-0 w-full">
                    <div className="flex h-full min-h-[18rem] flex-col items-center rounded-2xl border border-[#0F4F68]/10 bg-white p-6 text-center shadow-[0_10px_40px_rgba(15,79,104,0.07)] transition-shadow duration-300 hover:shadow-[0_16px_52px_rgba(15,79,104,0.11)] sm:min-h-[19rem] sm:p-7">
                      <div className="mb-4 inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] px-4 text-sm font-bold text-white sm:text-base">
                        {item.step}
                      </div>
                      <h3 className="text-balance text-lg font-bold text-[#0F4F68]">{item.title}</h3>
                      <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-neutral-600 sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </RevealOnScroll>
                </li>
              ))}
            </ol>

            <RevealOnScroll delayMs={200}>
              <div className="mt-10 flex flex-col items-center gap-2 sm:mt-12">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:text-lg"
                >
                  Anfrage stellen
                </Link>
                <p className="text-center text-sm text-neutral-500">Unverbindlich · Wir melden uns bei Ihnen</p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section
          className="relative z-20 w-full overflow-x-clip bg-white px-4 pb-14 pt-[clamp(4.25rem,9vw,6.25rem)] sm:px-6 sm:pb-16 sm:pt-[clamp(4.75rem,10vw,6.75rem)] lg:px-[var(--ahs-page-gutter)] lg:pb-20"
          aria-labelledby="haushalt-vorteile-heading"
        >
          <svg
            className={WELLEN_SVG_CLASS}
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d={WELLEN_D} fill="#ffffff" />
          </svg>
          <RevealOnScroll>
            <div className="relative z-[1] mx-auto w-full max-w-6xl">
              <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                <h2
                  id="haushalt-vorteile-heading"
                  className="text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
                >
                  Ihre Vorteile bei uns
                </h2>
                <p className="mt-2 text-pretty text-sm text-neutral-600 sm:text-base">
                  Verlässlich, transparent und nah bei Ihnen - mit klaren Prozessen und echter Unterstützung im Alltag.
                </p>
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {STARTSEITE_VORTEILE.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-white/75 hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/haken.webp"
                      alt=""
                      aria-hidden
                      width={38}
                      height={38}
                      className="mt-0.5 h-[38px] w-[38px] shrink-0 object-contain"
                    />
                    <span className="text-[1.03rem] font-medium leading-relaxed text-neutral-800 sm:text-[1.08rem]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </section>

        <KundenstimmenCarousel />

        <section className="relative bg-[#fafbfc] py-14 sm:py-20" aria-labelledby="haushalt-faq-heading">
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
            <RevealOnScroll>
              <h2
                id="haushalt-faq-heading"
                className="text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
              >
                Häufige Fragen
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-medium text-[#0F4F68]/85 sm:text-base">
                Rund um Haushaltshilfe, Kosten und Ablauf
              </p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <div className="mt-8 space-y-3 sm:mt-10">
                {FAQ.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-[#0F4F68]/12 bg-white shadow-[0_2px_16px_rgba(15,79,104,0.06)] transition hover:border-[#F78F2E]/35 hover:shadow-[0_8px_28px_rgba(15,79,104,0.1)] open:border-[#0F4F68]/18 open:shadow-[0_10px_32px_rgba(15,79,104,0.12)]"
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
                    <div className="border-t border-[#0F4F68]/8 px-4 pb-4 pt-2 text-pretty text-sm leading-relaxed text-neutral-600 sm:px-5 sm:text-base">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </RevealOnScroll>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        </section>

        <section className="border-t border-[#0F4F68]/10 bg-white py-12" aria-label="Abschluss">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
              <p className="text-neutral-600">
                {siteConfig.name} unterstützt Sie mit Haushaltshilfe in Ihrer Region. Fragen? Wir sind für Sie da – über{" "}
                <Link href="/kontakt" className="font-semibold text-[#0F4F68] underline-offset-2 hover:underline">
                  Kontaktseite
                </Link>
                .
              </p>
              <Link
                href="/kontakt"
                className="mt-6 inline-flex rounded-lg bg-[#F78F2E] px-8 py-3 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
              >
                Jetzt Kontakt aufnehmen
              </Link>
            </div>
          </RevealOnScroll>
        </section>
      </article>
    </div>
  );
}
