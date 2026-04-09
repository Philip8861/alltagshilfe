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

const KOSTENFREI_SCHRITTE = [
  {
    step: "1",
    title: "Pflegebox konfigurieren",
    description:
      "Im Pflegebox-Konfigurator wählen Sie in wenigen Klicks passende Produkte und Mengen für den Pflegealltag – übersichtlich und stets innerhalb Ihres monatlichen Budgets.",
  },
  {
    step: "2",
    title: "Daten eingeben & unterschreiben",
    description:
      "In klaren, kurzen Schritten tragen Sie Ihre Daten ein und unterschreiben den Antrag digital – schnell und papierarm. Wenn Sie es lieber klassisch möchten, geht es auf Wunsch auch per Post.",
  },
  {
    step: "3",
    title: "Zurücklehnen – wir erledigen den Rest",
    description:
      "Wir bereiten alles für Ihre Pflegekasse vor und begleiten Sie durch die Formalitäten. Nach Freigabe erhalten Sie Ihre Lieferung zuverlässig nach Hause – ohne Stress mit Formularen.",
  },
] as const;

/** Wie Startseite „Ihre Vorteile bei uns“: gleiche Haken-Grafik und Raster. */
const KOSTENFREI_USPS = [
  "Von Pflegeprofis geprüfte und empfohlene Qualitätsartikel",
  "Persönliche Erreichbarkeit und besonders schnelle Bearbeitung",
  "Direkter Kontakt ohne zeitraubende Warteschleifen am Telefon",
  "Maximale Freiheit durch jederzeitige Kündbarkeit",
  "Sorgenfreie Nutzung ohne feste Vertragslaufzeiten",
  "Volle Transparenz und höchster Schutz Ihrer Daten",
  "Sorgfältige Konfektionierung und Versand direkt aus Deutschland",
  "Ehrliche Arbeitsbedingungen und faire Entlohnung",
] as const;

const FAQ_INLINE_LINK =
  "font-semibold text-[#0F4F68] underline underline-offset-2 decoration-[#0F4F68]/40 hover:decoration-[#F78F2E] hover:text-[#0c3d52]";

type KostenfreiFaqItem = {
  q: string;
  /** Fließtext für Schema.org FAQPage (ohne JSX) */
  answerPlain: string;
  answer: ReactNode;
};

/** Vollständige FAQ zur 42-€-Pauschale (pg 54); Reihenfolge wie Redaktionsvorgabe. */
const KOSTENFREI_FAQ: KostenfreiFaqItem[] = [
  {
    q: "Was sind zum Verbrauch bestimmte Pflegehilfsmittel für 42 Euro?",
    answerPlain:
      "Das sind Hygieneartikel, die zur häuslichen Pflege benötigt werden und nur einmal verwendet werden können. Die Pflegekasse übernimmt hierfür die Kosten von bis zu 42 Euro pro Monat.",
    answer: (
      <>
        Das sind Hygieneartikel, die zur häuslichen Pflege benötigt werden und nur einmal verwendet werden können. Die
        Pflegekasse übernimmt hierfür die Kosten von bis zu 42&nbsp;€ pro Monat.
      </>
    ),
  },
  {
    q: "Wer hat Anspruch auf die 42 Euro Pauschale?",
    answerPlain:
      "Anspruch haben alle Pflegebedürftigen, die einen anerkannten Pflegegrad (1 bis 5) haben.",
    answer: <>Anspruch haben alle Pflegebedürftigen, die einen anerkannten Pflegegrad (1 bis 5) haben.</>,
  },
  {
    q: "Reicht Pflegegrad 1 für den Erhalt der Pflegehilfsmittel aus?",
    answerPlain:
      "Ja. Bereits ab Pflegegrad 1 besteht der volle gesetzliche Anspruch auf die monatliche Pauschale von 42 Euro.",
    answer: (
      <>
        Ja. Bereits ab Pflegegrad&nbsp;1 besteht der volle gesetzliche Anspruch auf die monatliche Pauschale von
        42&nbsp;€.
      </>
    ),
  },
  {
    q: "Welche Produkte sind in einer typischen Pflegebox enthalten?",
    answerPlain:
      "Typische Produkte sind: Einmalhandschuhe, Flächendesinfektionsmittel, Händedesinfektion, Bettschutzeinlagen (Einmalgebrauch), Schutzschürzen und Mundschutz (FFP2 oder medizinisch).",
    answer: (
      <>
        Typische Produkte sind: Einmalhandschuhe, Flächendesinfektionsmittel, Händedesinfektion, Bettschutzeinlagen
        (Einmalgebrauch), Schutzschürzen und Mundschutz (FFP2 oder medizinisch).
      </>
    ),
  },
  {
    q: "Wie beantrage ich die 42 Euro bei der Pflegekasse?",
    answerPlain:
      "Sie erstellen im Pflegebox-Konfigurator Ihre Wunschbox, wir übernehmen alle weiteren Formalitäten für Sie.",
    answer: (
      <>
        Sie erstellen im{" "}
        <Link href={PFLEGEBOX_KONFIGURATOR_PAGE} className={FAQ_INLINE_LINK}>
          Pflegebox-Konfigurator
        </Link>{" "}
        Ihre Wunschbox, wir übernehmen alle weiteren Formalitäten für Sie!
      </>
    ),
  },
  {
    q: "Sind die Pflegehilfsmittel wirklich zu 100 % kostenlos?",
    answerPlain:
      "Ja. Wir sind zugelassen bei allen Krankenkassen in Deutschland; diese übernehmen die Kosten ab Pflegegrad 1 im Rahmen der gesetzlichen Regelungen.",
    answer: (
      <>
        Ganz einfach: Ja! Wir sind zugelassen bei allen Krankenkassen in Deutschland, diese übernehmen die Kosten ab
        Pflegegrad&nbsp;1.
      </>
    ),
  },
  {
    q: "Muss ich jeden Monat neue Belege einreichen?",
    answerPlain:
      "Nein. Sobald der Dauerantrag von der Pflegekasse genehmigt wurde, erfolgt die Belieferung und Abrechnung automatisch.",
    answer: (
      <>
        Nein. Sobald der Dauerantrag von der Pflegekasse genehmigt wurde, erfolgt die Belieferung und Abrechnung
        automatisch.
      </>
    ),
  },
  {
    q: "Kann man die 42 Euro Pauschale auch rückwirkend beantragen?",
    answerPlain:
      "Eine rückwirkende Erstattung ist schwierig und meist nur für den Monat der Antragstellung möglich. Es empfiehlt sich daher, den Antrag so früh wie möglich zu stellen.",
    answer: (
      <>
        Eine rückwirkende Erstattung ist schwierig und meist nur für den Monat der Antragstellung möglich. Es empfiehlt
        sich daher, den Antrag so früh wie möglich zu stellen.
      </>
    ),
  },
  {
    q: "Was passiert, wenn ich in einem Monat weniger als 42 Euro verbrauche?",
    answerPlain:
      "Der Betrag ist eine Höchstgrenze. Nicht genutztes Budget verfällt am Ende des Monats und kann nicht in den nächsten Monat übertragen oder bar ausgezahlt werden.",
    answer: (
      <>
        Der Betrag ist eine Höchstgrenze. Nicht genutztes Budget verfällt am Ende des Monats und kann nicht in den
        nächsten Monat übertragen oder bar ausgezahlt werden.
      </>
    ),
  },
  {
    q: "Besteht der Anspruch auch bei einer Unterbringung im Pflegeheim?",
    answerPlain:
      "Nein. Der Anspruch besteht nur für die häusliche Pflege. In stationären Einrichtungen ist das Heim für die Bereitstellung von Hygieneartikeln zuständig.",
    answer: (
      <>
        Nein. Der Anspruch besteht nur für die häusliche Pflege. In stationären Einrichtungen ist das Heim für die
        Bereitstellung von Hygieneartikeln zuständig.
      </>
    ),
  },
  {
    q: "Kann ich die Auswahl der Produkte in meiner Box monatlich ändern?",
    answerPlain:
      "Ja, das ist problemlos möglich. Kontaktieren Sie uns einfach über die Kontaktseite.",
    answer: (
      <>
        Das ist problemlos möglich – kontaktieren Sie uns einfach über die{" "}
        <Link href="/kontakt" className={FAQ_INLINE_LINK}>
          Kontaktseite
        </Link>
        .
      </>
    ),
  },
  {
    q: "Wie lange dauert die Genehmigung durch die Pflegekasse?",
    answerPlain:
      "Das ist unterschiedlich und abhängig von Ihrer Pflegekasse. In der Regel erhalten Sie Ihre Pflegebox jedoch nach etwa 5–7 Werktagen.",
    answer: (
      <>
        Dies ist unterschiedlich und abhängig von Ihrer Pflegekasse. In der Regel erhalten Sie Ihre Pflegebox jedoch
        nach etwa 5–7 Werktagen.
      </>
    ),
  },
  {
    q: "Werden auch FFP2-Masken über die Pauschale finanziert?",
    answerPlain:
      "Ja, seit der Corona-Pandemie sind Masken fester Bestandteil des erstattungsfähigen Hilfsmittelverzeichnisses (Produktgruppe 54).",
    answer: (
      <>
        Ja, seit der Corona-Pandemie sind Masken fester Bestandteil des erstattungsfähigen Hilfsmittelverzeichnisses
        (Produktgruppe&nbsp;54).
      </>
    ),
  },
  {
    q: "Was ist der Unterschied zwischen technischen Hilfsmitteln und Pflegehilfsmitteln zum Verbrauch?",
    answerPlain:
      "Technische Hilfsmittel (PG 50) sind langlebige Dinge wie Pflegebetten oder Rollstühle. Zum Verbrauch bestimmte Hilfsmittel (PG 54) sind Hygieneartikel wie Handschuhe, die täglich entsorgt werden.",
    answer: (
      <>
        Technische Hilfsmittel (PG&nbsp;50) sind langlebige Dinge wie Pflegebetten oder Rollstühle. Zum Verbrauch
        bestimmte Hilfsmittel (PG&nbsp;54) sind Hygieneartikel wie Handschuhe, die täglich entsorgt werden.
      </>
    ),
  },
];

const kostenfreiFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: KOSTENFREI_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answerPlain,
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
          <div className="flex flex-col-reverse items-center gap-10 lg:grid lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-center lg:justify-items-stretch lg:gap-x-[clamp(2rem,3.8vw,4.25rem)] lg:gap-y-0">
            <div className="box-border w-full min-w-0 max-w-full space-y-[clamp(1.25rem,2vh+0.75rem,1.75rem)] lg:min-w-0 lg:justify-self-stretch lg:space-y-[clamp(1.15rem,1.6vh+0.7rem,1.75rem)] lg:pr-[min(0.75rem,1.5vw)]">
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
              <div className="box-border flex justify-center overflow-x-visible bg-[#fafbfc] px-4 pt-3 pb-8 sm:px-8 sm:pt-4 sm:pb-10 lg:flex lg:justify-end lg:px-0 lg:pb-[clamp(1.75rem,3.5vh+0.75rem,3.25rem)] lg:pt-0">
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
                    sizes="(max-width: 1023px) 100vw, (max-width: 1536px) 58vw, 980px"
                    className={`box-border h-auto w-full max-w-full object-contain object-center lg:object-contain lg:object-center max-lg:mx-auto max-lg:origin-center max-lg:translate-x-0 max-lg:-translate-y-2 max-lg:scale-[1.05] max-lg:motion-reduce:scale-[1.05] ${KOSTENFREI_HERO_GLOW_CLASS}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 overflow-x-clip bg-[#F2F9FA] px-4 pb-16 pt-[clamp(4.5rem,10vw,6.5rem)] sm:px-6 sm:pb-20 lg:px-[var(--ahs-page-gutter)] lg:pb-24"
          aria-labelledby="schritte-heading"
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
            <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
              <h2
                id="schritte-heading"
                className="text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
              >
                In 3 einfachen Schritten zu Ihrer Lieferung
              </h2>
              <p className="mt-3 text-pretty text-sm text-[#8a6a55] sm:text-base">
                Konfigurieren, digital unterschreiben – die Pflegekasse-Kommunikation übernehmen wir.
              </p>
            </div>

            <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
              {KOSTENFREI_SCHRITTE.map((item) => (
                <li key={item.step} className="list-none">
                  <div className="flex h-full flex-col rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-7">
                    <div className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] text-lg font-bold text-white">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-[#0F4F68]">{item.title}</h3>
                    <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-neutral-600 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col items-center gap-2 sm:mt-12">
              <KonfiguratorLink
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:text-lg"
              >
                Zur Pflegebox in 2 Minuten
              </KonfiguratorLink>
              <p className="text-center text-sm text-neutral-500">Unverbindlich · Keine Vertragsbindung</p>
            </div>
          </div>
        </section>

        <section
          className="relative z-20 w-full bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-[var(--ahs-page-gutter)]"
          aria-labelledby="kostenfrei-vorteile-heading"
        >
          <div className="mx-auto w-full max-w-6xl">
            <h2
              id="kostenfrei-vorteile-heading"
              className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl"
            >
              Ihre Vorteile bei uns
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-neutral-600 sm:text-base">
              Verlässlich, transparent und nah bei Ihnen – mit klaren Prozessen und echter Unterstützung rund um Ihre
              Pflegehilfsmittel.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {KOSTENFREI_USPS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-[#fafbfc] hover:shadow-[0_0_20px_rgba(15,79,104,0.12)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- wie Startseite: statisches Haken-Asset */}
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
          <div className="relative z-[1] mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-4xl">
            <h2
              id="kostenfrei-faq-heading"
              className="text-center text-2xl font-extrabold tracking-tight text-[#0F4F68] sm:text-3xl"
            >
              Häufige Fragen
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm font-medium text-[#0F4F68]/85 sm:text-base">
              Alles zur 42&nbsp;€ Pauschale für Pflegehilfsmittel
            </p>
            <div className="mt-8 space-y-3 sm:mt-10">
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
                  <div className="border-t border-[#0F4F68]/8 px-4 pb-4 pt-2 text-pretty text-sm leading-relaxed text-neutral-600 sm:px-5 sm:text-base">
                    {item.answer}
                  </div>
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
