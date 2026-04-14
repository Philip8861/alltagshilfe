import Link from "next/link";
import { BetrieblichAngebotOpenButton } from "@/components/pflegeberatung/BetrieblicheAngebotAnfrage";
import { BetrieblichePflegeberatungFactsIntro } from "@/components/pflegeberatung/BetrieblichePflegeberatungFactsIntro";

const ICON_WRAP =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white shadow-sm sm:h-14 sm:w-14";

/** Welle zwischen hellem Block und Fakten (gleiche Geometrie wie andere Seiten) */
function WelleAnschlussHell({ fill }: { fill: string }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 block h-12 w-full -translate-y-[68%] sm:h-16"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      fill="none"
      overflow="visible"
      aria-hidden
    >
      <rect x="-48" y="0" width="48" height="120" fill={fill} />
      <rect x="1200" y="0" width="48" height="120" fill={fill} />
      <path d="M0,120 C200,32 420,8 600,22 C800,38 1010,90 1200,120 L1200,120 L0,120 Z" fill={fill} />
    </svg>
  );
}

const BETRIEBLICH_HELL_BG = "#F2F9FA" as const;

function IconCalendar() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function IconGift() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M7 8V6a2 2 0 0 1 4 0v2M13 8V6a2 2 0 0 1 4 0v2" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
    </svg>
  );
}

function IconTaxDoc() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" strokeLinecap="round" />
    </svg>
  );
}

function IconTrendUp() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M23 6l-9.5 9.5-5-5L1 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChartDown() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 3v18h18" strokeLinecap="round" />
      <path d="M18 17l-5-5-4 4-3-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUserX() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21l-3-3m0 0l-3-3m3 3l-3 3m3-3l3-3" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendarOff() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18M9 16l6-6m0 6L9 10" strokeLinecap="round" />
    </svg>
  );
}

function IconPhoneQuick() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 2v4M10 4h4" strokeLinecap="round" />
    </svg>
  );
}

function IconUserCheck() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFiles() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M10 12h8M10 16h8" strokeLinecap="round" />
    </svg>
  );
}

function IconHomeLife() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" strokeLinecap="round" />
    </svg>
  );
}

const VORTEILE = [
  {
    title: "Reduktion von Fehlzeiten & Krankheitstagen",
    text: "Durch frühzeitige Entlastung und Begleitung in Pflegesituationen.",
    Icon: IconCalendar,
  },
  {
    title: "Attraktiver Mitarbeiter-Benefit",
    text: "Steigert die Arbeitgeberattraktivität.",
    Icon: IconGift,
  },
  {
    title: "Stärkere Mitarbeiterbindung",
    text: "Beschäftigte erleben echte Unterstützung durch den Arbeitgeber.",
    Icon: IconUsers,
  },
  {
    title: "Steuerlich absetzbar",
    text: "Von Leistungen und Schulungen.",
    Icon: IconTaxDoc,
  },
  {
    title: "Produktivitätssteigerung",
    text: "Durch Reduzierung psychischer Belastung und Verbesserung der Konzentrationsfähigkeit.",
    Icon: IconTrendUp,
  },
  {
    title: "Unterstützung für Personalabteilung & Führungskräfte",
    text: "Durch persönlichen Ansprechpartner im Betrieb.",
    Icon: IconBuilding,
  },
  {
    title: "Imagegewinn durch soziale Verantwortung",
    text: "Sichtbares Engagement für Mitarbeitende in Pflegesituationen.",
    Icon: IconHeart,
  },
] as const;

const FOLGEN = [
  {
    title: "Leistungsabfall im Arbeitsalltag",
    bullets: ["Konzentrations- und Motivationsverlust", "Geringere Produktivität durch Erschöpfung und Dauerstress"],
    Icon: IconChartDown,
  },
  {
    title: "Steigende Fluktuation",
    bullets: [
      "Kurzfristige Ausfälle durch akute Pflegesituationen",
      "Häufigere krankheitsbedingte Abwesenheiten (durch zusätzliche psychische und physische Belastungen)",
    ],
    Icon: IconUserX,
  },
  {
    title: "Zunahme von Fehlzeiten",
    bullets: [
      "Reduktion der Arbeitszeit oder Kündigung aufgrund von Pflegeverpflichtungen",
      "Verlust von qualifizierten Fachkräften",
    ],
    Icon: IconCalendarOff,
  },
] as const;

const ANGEBOT = [
  {
    title: "Schnelle und gezielte Pflegeberatung ohne Wartezeiten",
    lines: [
      "Telefonisch, digital oder vor Ort – individuell abgestimmt",
      "Begleitung vom Klinikaufenthalt bis zur optimal abgestimmten Versorgung zu Hause",
    ],
    Icon: IconPhoneQuick,
  },
  {
    title: "Persönlicher Ansprechpartner im Betrieb",
    lines: [
      "Schulung zu gesetzlichen Ansprüchen, Entlastungsmöglichkeiten und Vereinbarkeit von Beruf und Pflege",
      "Beratung der Personalabteilung und des Betrieblichen Gesundheitsmanagements (BGM)",
    ],
    Icon: IconUserCheck,
  },
  {
    title: "Übernahme von Schriftverkehr & Antragstellungen",
    lines: [
      "Kommunikation mit Krankenkassen, Pflegekassen, Ärzten, Sozialdiensten und Reha-Einrichtungen",
    ],
    Icon: IconFiles,
  },
  {
    title: "Unterstützung im Alltag",
    lines: [
      "Schnelle Unterstützung im Haushalt und bei alltäglichen Erledigungen",
      "Pflegehilfsmittel",
    ],
    Icon: IconHomeLife,
  },
] as const;

export function BetrieblichePflegeberatungSection() {
  return (
    <div className="space-y-14 sm:space-y-16">
      <div className="relative overflow-visible">
        <div className="relative overflow-hidden rounded-2xl border border-[#0F4F68]/10 bg-white px-5 py-8 sm:rounded-3xl sm:px-7 sm:py-10">
          <BetrieblichePflegeberatungFactsIntro />
          <section className="mt-10 sm:mt-12" aria-labelledby="betrieblich-folgen-heading">
            <h3
              id="betrieblich-folgen-heading"
              className="mx-auto max-w-4xl text-center text-pretty text-xl font-extrabold text-[#0F4F68] sm:text-2xl"
            >
              Folgen für Arbeitgeber durch pflegende Beschäftigte
            </h3>
            <ul className="mt-8 grid gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-8">
              {FOLGEN.map(({ title, bullets, Icon }) => (
                <li key={title} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <span className={`${ICON_WRAP} shrink-0 sm:mt-0.5`} aria-hidden>
                    <Icon />
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold leading-snug text-[#0F4F68]">{title}</p>
                    <ul className="mt-2 list-disc space-y-2 pl-4 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">
                      {bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div
          className="relative mt-8 overflow-visible rounded-2xl sm:mt-10 sm:rounded-3xl"
          style={{ backgroundColor: BETRIEBLICH_HELL_BG }}
        >
          <WelleAnschlussHell fill={BETRIEBLICH_HELL_BG} />
          <section
            aria-labelledby="betrieblich-was-ist-heading"
            className="relative px-5 pb-8 pt-10 sm:px-7 sm:pb-10 sm:pt-12"
          >
            <h2 id="betrieblich-was-ist-heading" className="text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
              Was versteht man unter betrieblicher Pflegeberatung?
            </h2>
            <div className="mt-5 max-w-4xl space-y-4 text-pretty text-neutral-700 leading-relaxed sm:text-[1.05rem]">
              <p>
                Betriebliche Pflegeberatung ist ein Unterstützungsangebot für Beschäftigte, die Angehörige pflegen oder
                kurzfristig vor einer Pflegesituation stehen. Sie basiert auf unserer langjährigen Erfahrung und auf dem
                häufigsten Satz, den wir hören:{" "}
                <strong className="font-semibold text-[#0F4F68]">
                  „Hätte ich das eher gewusst, wäre vieles leichter gewesen.“
                </strong>
              </p>
              <p>
                Damit Mitarbeitende nach Feierabend nicht noch „die zweite Schicht“ starten müssen und sich mit Formularen,
                Anträgen, Telefonaten, Haushalt und organisatorischen Aufgaben auseinandersetzen müssen, stehen wir{" "}
                <strong className="font-semibold text-[#0F4F68]">sofort</strong> zur Seite. Wir beraten schnell im Betrieb oder
                zu Hause und kümmern uns um die Organisation, damit Entlastung und finanzielle Leistungen sicher ankommen.
              </p>
              <p>
                Für Unternehmen heißt das eine verlässliche, feste Kooperation mit uns. Gegen einen günstigen monatlichen
                Festbetrag, abhängig von der Unternehmensgröße, erhalten Mitarbeitende und Führungskräfte unbegrenzten Zugang zu
                Beratung und fachlicher Unterstützung ohne Einzelabrechnung, ohne Mehraufwand und ohne Limit.
              </p>
              <p>
                Der Arbeitgeber kann diesen{" "}
                <strong className="font-semibold text-[#0F4F68]">neuen „Arbeitgeber-Benefit“</strong> ausschreiben und aktiv
                kommunizieren und zeigt damit echte Fürsorge. Das entlastet spürbar, reduziert Stress und erhöht die Sicherheit im
                Alltag. Gleichzeitig bleiben Mitarbeitende leistungsfähiger, und Überlastung sowie Fehl- und Ausfallzeiten können
                deutlich sinken.
              </p>
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="betrieblich-vorteile-heading">
        <h3 id="betrieblich-vorteile-heading" className="text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
          Ihre Vorteile auf einen Blick
        </h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {VORTEILE.map(({ title, text, Icon }) => (
            <li
              key={title}
              className="flex gap-4 rounded-2xl border border-[#0F4F68]/12 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              <span className={ICON_WRAP} aria-hidden>
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="font-bold leading-snug text-[#0F4F68]">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm sm:p-8"
        aria-labelledby="betrieblich-demografie-heading"
      >
        <h3 id="betrieblich-demografie-heading" className="text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
          Wenn Arbeit und Pflege kollidieren: Der demografische Wandel und seine Folgen für Arbeitgeber
        </h3>
        <div className="mt-5 space-y-4 text-pretty text-neutral-700 leading-relaxed sm:text-[1.05rem]">
          <p>
            Der demografische Wandel verändert unsere Gesellschaft grundlegend und stellt insbesondere Arbeitgeber vor neue
            Herausforderungen. Bis 2035 wird die Zahl der Menschen über 67 Jahre in Deutschland auf rund 20 Millionen
            steigen. Damit wächst nicht nur die Gruppe der Pflegebedürftigen, sondern auch die Zahl der Erwerbstätigen, die
            ihre Angehörigen zu Hause pflegen.
          </p>
          <p>
            Schon heute sind über 5 Millionen Menschen in Deutschland auf Pflege angewiesen – mehr als 80&nbsp;% davon werden
            zu Hause betreut, meist durch Familienangehörige. Ein großer Teil dieser pflegenden Angehörigen ist berufstätig.
            Studien zeigen: Bereits heute pflegt etwa jeder zehnte Arbeitnehmer regelmäßig ein Familienmitglied – Tendenz stark
            steigend.
          </p>
        </div>
      </section>

      <section aria-labelledby="betrieblich-angebot-heading">
        <h3 id="betrieblich-angebot-heading" className="text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
          Was wir bieten – auf einen Blick
        </h3>
        <ul className="mt-6 space-y-4">
          {ANGEBOT.map(({ title, lines, Icon }) => (
            <li
              key={title}
              className="flex gap-4 rounded-2xl border border-[#0F4F68]/10 bg-[#fafbfc] p-4 sm:gap-5 sm:p-6"
            >
              <span className={`${ICON_WRAP} bg-[#F78F2E]`} aria-hidden>
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="flex items-start gap-2 font-bold text-[#0F4F68] sm:text-lg">
                  <span className="mt-0.5 text-[#F78F2E]" aria-hidden>
                    +
                  </span>
                  <span>{title}</span>
                </p>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#F2F9FA] to-white p-5 sm:p-8"
        aria-labelledby="betrieblich-ahs-heading"
      >
        <h3 id="betrieblich-ahs-heading" className="text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
          Alltagshilfe-Süd – Ihre Experten für Pflege seit über 12 Jahren
        </h3>
        <div className="mt-5 space-y-4 text-pretty text-neutral-700 leading-relaxed sm:text-[1.05rem]">
          <p>
            Die Alltagshilfe-Süd steht seit mehr als zwölf Jahren für professionelle Unterstützung rund um das Thema Pflege.
            Neben unserem etablierten Betreuungsdienst haben wir uns darauf spezialisiert, pflegebedürftige Menschen und deren
            Angehörige individuell und kompetent zu beraten.
          </p>
          <p>
            Seit 2025 bieten wir zusätzlich die betriebliche Pflegeberatung an – ein gezieltes Angebot für Unternehmen, die
            ihre Mitarbeitenden in herausfordernden Pflegesituationen entlasten möchten. Unser Ziel: Arbeitgeber und
            Arbeitnehmer gleichermaßen zu stärken, Ausfallzeiten zu reduzieren und die Vereinbarkeit von Beruf und Pflege
            nachhaltig zu verbessern.
          </p>
          <p>
            Dabei kommen ausschließlich geschulte, persönliche Pflegeberater zum Einsatz, die schnell, vertraulich und
            lösungsorientiert unterstützen – direkt im Betrieb, beim Arbeitnehmer zu Hause oder digital.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <BetrieblichAngebotOpenButton />
          <Link
            href="/leistungen/betriebliche-pflegeberatung"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#0F4F68]/25 bg-white/80 px-6 py-3 text-base font-semibold text-[#0F4F68] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
          >
            Zur Leistungsseite
          </Link>
        </div>
      </section>
    </div>
  );
}
