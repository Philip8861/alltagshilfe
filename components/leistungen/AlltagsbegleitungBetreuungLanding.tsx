import type { ReactNode } from "react";
import Link from "next/link";
import { KundenstimmenCarousel } from "@/components/home/KundenstimmenCarousel";
import { siteConfig } from "@/config/site";
import { RevealOnScroll } from "@/components/pflegehilfsmittel/RevealOnScroll";
import { STARTSEITE_VORTEILE } from "@/lib/startseite-vorteile";

const HERO_IMG = "/images/standort_gemeinsam.webp";

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

/** Cache-Buster bei aktualisiertem Asset; Wert bei neuer Grafik erhöhen. */
const JETZT_NEU_IMG = "/images/jetzt_neu.webp?v=4";

const PROMO_ICON_HEAD =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 sm:h-10 sm:w-10 [&_svg]:h-[1.35rem] [&_svg]:w-[1.35rem] sm:[&_svg]:h-6 sm:[&_svg]:w-6";

const PROMO_ICON_SM =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4F68]/10 [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem] sm:[&_svg]:h-[1.3rem] sm:[&_svg]:w-[1.3rem]";

function PromoIconJetztNeu({ className = "" }: { className?: string }) {
  return (
    <span className={`${PROMO_ICON_HEAD} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4l1.8 5.5h5.8l-4.7 3.4 1.8 5.6L12 15.9 6.3 18.5l1.8-5.6L3.4 9.5h5.8L12 4z"
          stroke="#F78F2E"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="2" fill="#0F4F68" />
      </svg>
    </span>
  );
}

function PromoIconCalendar({ className = "" }: { className?: string }) {
  return (
    <span className={`${PROMO_ICON_SM} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="#0F4F68" strokeWidth="1.75" />
        <path d="M3.5 9.5h17M8 2.5v4M16 2.5v4" stroke="#0F4F68" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M8 14h2M12 14h2M8 17.5h2" stroke="#F78F2E" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function PromoIconBudget({ className = "" }: { className?: string }) {
  return (
    <span className={`${PROMO_ICON_SM} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <ellipse cx="12" cy="16" rx="7" ry="3.5" stroke="#0F4F68" strokeWidth="1.75" />
        <path d="M5 16V9.5c0-2 3.15-3.5 7-3.5s7 1.5 7 3.5V16" stroke="#0F4F68" strokeWidth="1.75" />
        <path
          d="M12 6v4.5M10.25 9.75h2.9a1.35 1.35 0 010 2.7h-1.2a1.35 1.35 0 100 2.7H12"
          stroke="#F78F2E"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function PromoIconTransparenz({ className = "" }: { className?: string }) {
  return (
    <span className={`${PROMO_ICON_SM} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="6.25" stroke="#0F4F68" strokeWidth="1.75" />
        <path d="M16.5 16.5L21 21" stroke="#0F4F68" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M8.5 11h5M11 8.5v5" stroke="#F78F2E" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function PromoIconMobile({ className = "" }: { className?: string }) {
  return (
    <span className={`${PROMO_ICON_SM} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="7" y="3.5" width="10" height="17" rx="2.5" stroke="#0F4F68" strokeWidth="1.75" />
        <path d="M10 6.5h4" stroke="#F78F2E" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="12" cy="18" r="0.9" fill="#F78F2E" />
      </svg>
    </span>
  );
}

function PromoIconGeschenk({ className = "" }: { className?: string }) {
  return (
    <span className={`${PROMO_ICON_SM} ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 10h14v11H5V10z" stroke="#0F4F68" strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M5 10h14" stroke="#0F4F68" strokeWidth="1.75" />
        <path
          d="M12 10V6.5M7.5 8.5a4.5 4.5 0 019 0V10"
          stroke="#F78F2E"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path d="M12 12.5v5.5" stroke="#F78F2E" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    </span>
  );
}

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
      "Kontaktieren Sie uns telefonisch oder über das Kontaktformular. Wir klären kurz Ihren Bedarf und die nächsten Schritte, ohne Verpflichtung.",
  },
  {
    step: "Schritt 2",
    title: "Persönliche Abstimmung",
    description:
      "Wir stimmen Termine, Begleitwünsche und Aktivitäten mit Ihnen ab. So passt die Alltagsbegleitung zu Ihrem Alltag und Ihrer Lebenssituation.",
  },
  {
    step: "Schritt 3",
    title: "Zuverlässige Begleitung",
    description:
      "Ihre festen Ansprechpartnerinnen und Ansprechpartner sind für Sie da, regelmäßig und verlässlich, damit Sie sich sicher und gut aufgehoben fühlen.",
  },
] as const;

const LEISTUNGS_TILES = [
  "Gemeinsam einkaufen, kochen oder essen",
  "Spaziergänge, Ausflüge und Bewegung an der frischen Luft",
  "Begleitung zu Arzt, Therapie oder Apotheke",
  "Unterstützung bei Behördengängen und Formalitäten",
  "Gespräch, Beschäftigung und Aktivierung zu Hause",
  "Individuelle Wünsche nach Absprache",
] as const;

const FAQ_INLINE =
  "font-semibold text-[#0F4F68] underline underline-offset-2 decoration-[#0F4F68]/40 hover:decoration-[#F78F2E] hover:text-[#0c3d52]";

type FaqItem = { q: string; answerPlain: string; answer: ReactNode };

const FAQ: FaqItem[] = [
  {
    q: "Welche Aufgaben werden übernommen?",
    answerPlain:
      "Typisch sind Begleitung beim Einkaufen, gemeinsames Kochen oder Essen, Spaziergänge, Begleitung zu Arzt und Apotheke sowie Unterstützung bei Behördengängen. Der Umfang richtet sich nach Ihrem Bedarf.",
    answer: (
      <>
        Typisch gehören dazu <strong>Begleitung beim Einkaufen</strong>, <strong>gemeinsames Kochen oder Essen</strong>,{" "}
        <strong>Spaziergänge</strong>, <strong>Begleitung zu Arzt und Apotheke</strong> sowie{" "}
        <strong>Unterstützung bei Behördengängen</strong>. Wir passen uns Ihrem Bedarf an.
      </>
    ),
  },
  {
    q: "Wo bietet die Alltagshilfe-Süd ihre Leistung an?",
    answerPlain: `${siteConfig.name} unterstützt in Städten und ländlichen Regionen. Ob wir in Ihrer Nähe sind, prüfen Sie über den Standortsucher auf der Seite Standorte.`,
    answer: (
      <>
        Wir unterstützen in <strong>Städten und ländlichen Regionen</strong>. Ob wir in Ihrer Nähe sind, prüfen Sie mit
        unserem{" "}
        <Link href="/standorte" className={FAQ_INLINE}>
          Standortsucher
        </Link>
        .
      </>
    ),
  },
  {
    q: "Werden die Kosten übernommen?",
    answerPlain: `Als zugelassener Partner rechnen wir mit allen Pflege- und Krankenkassen ab.`,
    answer: (
      <>
        Als <strong>zugelassener Partner</strong> rechnen wir mit <strong>allen Pflege- und Krankenkassen</strong> ab.
      </>
    ),
  },
  {
    q: "Wie wird abgerechnet?",
    answerPlain:
      "Die Bezahlung erfolgt über die Pflegekasse, die Krankenkasse oder privat. Im Beratungsgespräch klären wir Ihre Möglichkeiten.",
    answer: (
      <>
        Die Bezahlung erfolgt über die <strong>Pflegekasse</strong>, die <strong>Krankenkasse</strong> oder{" "}
        <strong>privat</strong>. Wir beraten Sie gerne zu Ihren Möglichkeiten, gern auch über unsere{" "}
        <Link href="/kontakt" className={FAQ_INLINE}>
          Kontaktseite
        </Link>
        .
      </>
    ),
  },
  {
    q: "Gilt der Entlastungsbetrag von 131 Euro?",
    answerPlain:
      "Ab Pflegegrad 1 können Sie den monatlichen Entlastungsbetrag von 131 Euro für qualifizierte Leistungen nutzen, sofern die Voraussetzungen erfüllt sind.",
    answer: (
      <>
        Ab <strong>Pflegegrad 1</strong> können Sie diesen monatlichen Betrag für unsere Leistungen nutzen, wenn die
        gesetzlichen Voraussetzungen erfüllt sind. Details zum Entlastungsbetrag finden Sie auch in unserem{" "}
        <Link href="/ratgeber/entlastungsbetrag-131-euro" className={FAQ_INLINE}>
          Ratgeber
        </Link>
        .
      </>
    ),
  },
  {
    q: "Kann ich 3.539 Euro für Ersatzpflege und Verhinderungspflege über Alltagshilfe-Süd nutzen?",
    answerPlain:
      "Ja, ab Pflegegrad 2 können Sie Ersatzpflege und Verhinderungspflege bis zum gesetzlich vorgesehenen Jahresbudget über Alltagshilfe-Süd abrechnen lassen, sofern die Voraussetzungen erfüllt sind.",
    answer: (
      <>
        Ja, ab einem <strong>Pflegegrad 2</strong> ist das unkompliziert möglich, wenn die gesetzlichen und
        vertraglichen Voraussetzungen erfüllt sind. Wir unterstützen Sie bei der Abrechnung.
      </>
    ),
  },
  {
    q: "Brauche ich einen Pflegegrad?",
    answerPlain:
      "Für Leistungen über die Pflegekasse ist in der Regel ein Pflegegrad erforderlich. Über die Krankenkasse oder privat ist Hilfe auch ohne Pflegegrad möglich, je nach Einzelfall.",
    answer: (
      <>
        Für Leistungen der <strong>Pflegekasse</strong> ja. Über die <strong>Krankenkasse</strong> oder{" "}
        <strong>privat</strong> ist Hilfe auch ohne Pflegegrad möglich.
      </>
    ),
  },
  {
    q: "Gibt es eine feste Bezugsperson?",
    answerPlain:
      "Ja, eine persönliche Beziehung ist wichtig; ein Wechsel der Bezugsperson erfolgt nur in dringenden Fällen.",
    answer: (
      <>
        Ja, eine <strong>persönliche Beziehung</strong> ist uns wichtig, daher ist ein Wechsel nur in dringenden Fällen
        notwendig.
      </>
    ),
  },
  {
    q: "Wie schnell startet die Hilfe?",
    answerPlain:
      "Termine werden zeitnah vergeben. Der Start hängt von regionalen Kapazitäten ab; darüber informieren wir Sie umgehend.",
    answer: (
      <>
        Wir vergeben Termine <strong>zeitnah</strong>. Der Start hängt von regionalen Kapazitäten ab, über die wir Sie
        sofort informieren.
      </>
    ),
  },
  {
    q: "Gibt es eine App für Termine?",
    answerPlain:
      "Ja, über die App von Alltagshilfe-Süd sind Termine und Rechnungen jederzeit einsehbar.",
    answer: (
      <>
        Ja, über unsere <strong>App</strong> haben Sie <strong>Termine und Rechnungen</strong> jederzeit transparent im
        Blick.
      </>
    ),
  },
  {
    q: "Wie stelle ich eine Anfrage?",
    answerPlain:
      "Kontaktieren Sie Alltagshilfe-Süd telefonisch oder über das Online-Formular für ein unverbindliches Erstgespräch.",
    answer: (
      <>
        Kontaktieren Sie uns einfach telefonisch oder per{" "}
        <Link href="/kontakt" className={FAQ_INLINE}>
          Online-Formular
        </Link>{" "}
        für ein unverbindliches Erstgespräch.
      </>
    ),
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

export function AlltagsbegleitungBetreuungLanding() {
  return (
    <div className="min-w-0 overflow-x-clip overflow-y-visible bg-[#fafbfc] text-neutral-700 antialiased">
      <article id="alltagsbegleitung-betreuung-hero" className="min-w-0 scroll-mt-24 overflow-x-clip overflow-y-visible">
        <section className="relative z-0 box-border mx-auto w-full min-w-0 max-w-7xl px-4 pb-6 pt-9 sm:px-6 sm:pb-12 sm:pt-10 lg:px-[var(--ahs-page-gutter)] lg:pb-[clamp(2.75rem,6.5vh+1rem,5.25rem)] lg:pt-[clamp(2.25rem,0.95rem+1.75vw,3.35rem)] xl:pb-[clamp(4rem,8.5vh+1.25rem,6.5rem)]">
          <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:items-start lg:justify-items-stretch lg:gap-x-[clamp(1.5rem,3vw,3.25rem)] lg:gap-y-0">
            <div className="box-border w-full min-w-0 max-w-full space-y-[clamp(1.25rem,2vh+0.75rem,1.75rem)] lg:min-w-0 lg:max-w-none lg:justify-self-stretch lg:space-y-[clamp(1.15rem,1.6vh+0.7rem,1.75rem)] lg:-translate-x-[clamp(0.35rem,2.5vw,1.75rem)] lg:pr-0 motion-reduce:lg:translate-x-0">
              <h1
                className="text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] opacity-0 motion-reduce:opacity-100 animate-fade-in-up sm:text-4xl lg:text-[clamp(1.75rem,1.05rem+2.5vw,3rem)]"
                style={{ animationDelay: "0s" }}
              >
                <span className="block">Alltagsbegleitung und Betreuung ganz in Ihrer Nähe</span>
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
              <div className="box-border flex justify-center overflow-x-visible bg-[#fafbfc] px-4 pt-0 pb-8 sm:px-8 sm:pb-10 lg:flex lg:justify-end lg:px-0 lg:pb-[clamp(1.75rem,3.5vh+0.75rem,3.25rem)] lg:pt-0">
                <div
                  className="mx-auto w-full min-w-0 max-w-[min(100%,72rem)] opacity-0 motion-reduce:opacity-100 animate-fade-in-up max-lg:flex max-lg:max-w-full max-lg:justify-center lg:ml-auto lg:w-full lg:max-w-full"
                  style={{ animationDelay: "0.08s" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- statisches Hero-Asset */}
                  <img
                    src={HERO_IMG}
                    alt="Alltagsbegleitung und Betreuung: gemeinsam unterwegs und zu Hause gut versorgt"
                    width={1200}
                    height={800}
                    decoding="async"
                    fetchPriority="high"
                    sizes="(max-width: 1023px) 80vw, (max-width: 1536px) 51vw, 958px"
                    className={`box-border h-auto w-[79.7%] max-w-full object-contain object-center max-lg:mx-auto lg:ml-auto lg:mr-0 lg:w-[79.7%] lg:object-contain lg:object-right ${HERO_GLOW_CLASS}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 overflow-x-clip bg-[#F2F9FA] px-4 pb-16 pt-[clamp(0.5rem,1.1vw,1.35rem)] sm:px-6 sm:pb-20 lg:px-[var(--ahs-page-gutter)] lg:pb-24"
          aria-labelledby="ab-leistungen-heading"
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
                <h2 id="ab-leistungen-heading" className="text-3xl font-bold text-[#0F4F68] sm:text-4xl">
                  Das bieten wir bei Alltagsbegleitung und Betreuung
                </h2>
                <p className="mt-3 text-pretty text-neutral-600 sm:max-w-3xl sm:mx-auto">
                  Typische Leistungen rund um Begleitung und Beschäftigung im Alltag. Im Detail stimmen wir alles mit Ihnen
                  ab.
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
          className="relative z-[10] overflow-x-clip bg-[#fafbfc] px-4 py-12 sm:px-6 sm:py-14 lg:px-[var(--ahs-page-gutter)] lg:py-16"
          aria-labelledby="ab-jetzt-neu-promo"
        >
          <div className="mx-auto max-w-7xl">
            <RevealOnScroll delayMs={80}>
              <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
                <div className="w-full max-w-[min(100%,30.8rem)] shrink-0 leading-none lg:max-w-[min(100%,28.6rem)] lg:pt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element -- statisches Promo-Asset; ohne Karten-Rahmen, Transparenz bis zum Seitenhintergrund */}
                  <img
                    src={JETZT_NEU_IMG}
                    alt="Übersicht über Termine und Rechnungen in der App"
                    width={915}
                    height={704}
                    decoding="async"
                    loading="lazy"
                    className="mx-auto block h-auto w-full object-contain object-center [filter:drop-shadow(0_12px_28px_rgba(15,79,104,0.14))] motion-reduce:filter-none lg:mx-0"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-6 text-center lg:text-left lg:space-y-5">
                  <div className="space-y-3">
                    <h2
                      id="ab-jetzt-neu-promo"
                      className="flex flex-wrap items-center justify-center gap-2 text-balance text-2xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-3xl lg:justify-start"
                    >
                      <PromoIconJetztNeu />
                      <span>Jetzt neu: Ihr persönlicher Überblick</span>
                    </h2>
                    <p className="text-pretty text-base font-medium leading-relaxed text-neutral-700 sm:text-lg">
                      Behalten Sie Ihre Termine, Rechnungen und Ihr Budget jederzeit im Blick – einfach, transparent und
                      übersichtlich.
                    </p>
                  </div>
                  <ul className="list-none space-y-5 text-pretty sm:space-y-6">
                    <li className="space-y-2">
                      <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                        <PromoIconCalendar />
                        <span>Alles auf einen Blick</span>
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                        Alle wichtigen Informationen zu Terminen und Rechnungen sind jederzeit für Sie verfügbar.
                      </p>
                    </li>
                    <li className="space-y-2">
                      <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                        <PromoIconBudget />
                        <span>Volle Kontrolle über Ihr Budget</span>
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                        Sehen Sie jederzeit, wie Ihr aktuelles Budget aussieht – klar und verständlich dargestellt.
                      </p>
                    </li>
                    <li className="space-y-2">
                      <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                        <PromoIconTransparenz />
                        <span>Transparenz, die überzeugt</span>
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                        Transparenz ist uns besonders wichtig:
                        <br />
                        Sie haben jederzeit Zugriff auf alle relevanten Daten.
                      </p>
                    </li>
                    <li className="space-y-2">
                      <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                        <PromoIconMobile />
                        <span>Jederzeit &amp; überall</span>
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                        Ob Laptop oder Smartphone – Ihr Zugang ist jederzeit und von überall aus möglich.
                      </p>
                    </li>
                    <li className="space-y-2">
                      <h3 className="flex flex-wrap items-center justify-center gap-2.5 text-lg font-bold text-[#0F4F68] sm:text-xl lg:justify-start">
                        <PromoIconGeschenk />
                        <span>Kostenloser Service</span>
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                        Diese neue Leistung ist für alle Kunden selbstverständlich kostenlos.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        <section
          className="relative z-[11] overflow-x-clip bg-[#fafbfc] px-4 pb-16 pt-[clamp(2.5rem,4.5vw,4.25rem)] sm:px-6 sm:pb-20 lg:px-[var(--ahs-page-gutter)] lg:pb-24"
          aria-labelledby="ab-schritte-heading"
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
                  id="ab-schritte-heading"
                  className="text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
                >
                  So einfach zur passenden Alltagsbegleitung
                </h2>
                <p className="mt-3 text-pretty text-sm text-[#8a6a55] sm:text-base">
                  Drei Schritte zur verlässlichen Begleitung im Alltag, schnell & unkompliziert
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
          aria-labelledby="ab-vorteile-heading"
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
                  id="ab-vorteile-heading"
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

        <section className="relative bg-[#fafbfc] py-14 sm:py-20" aria-labelledby="ab-faq-heading">
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
            <RevealOnScroll>
              <h2
                id="ab-faq-heading"
                className="text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
              >
                Häufige Fragen
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-medium text-[#0F4F68]/85 sm:text-base">
                Antworten zu Begleitung, Kosten, Krankenkasse, Entlastungsbetrag, Region und Ablauf
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
                {siteConfig.name} unterstützt Sie mit Alltagsbegleitung und Betreuung in Ihrer Region. Fragen? Wir sind für
                Sie da, über{" "}
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
