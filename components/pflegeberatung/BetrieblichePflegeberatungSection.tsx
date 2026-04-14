import { BetrieblichAngebotOpenButton } from "@/components/pflegeberatung/BetrieblicheAngebotAnfrage";
import { BetrieblichePflegeberatungFactsIntro } from "@/components/pflegeberatung/BetrieblichePflegeberatungFactsIntro";

const ICON_WRAP =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white shadow-sm sm:h-14 sm:w-14";

const BETRIEBLICH_HELL_BG = "#F2F9FA" as const;
/** Leichter Ton für Folgen-Bereich (Welle + Fläche) */
const FOLGEN_BAND_BG = "#eef6f9" as const;

/** Welle am oberen Rand eines Blocks (z. B. Übergang von Weiß zu Folgen-Fläche) */
function WelleObenBand({ fill }: { fill: string }) {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-0 block h-11 w-screen max-w-[100vw] -translate-x-1/2 -translate-y-[70%] sm:h-14"
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

/** Welle unter dem Was-ist-Block zum Verlauf / „Ihre Vorteile“ (volle Breite) */
function WelleZuVorteileBand() {
  return (
    <div className="pointer-events-none relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 leading-none sm:mt-12">
      <svg
        className="relative -mb-px block h-12 w-full shrink-0 text-[#E8F2F5] sm:h-[3.75rem]"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,55 C240,18 480,92 720,48 C960,4 1200,78 1440,42 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  );
}

const POP_IN =
  "opacity-0 motion-reduce:opacity-100 motion-reduce:animate-none animate-fade-in-up";

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

/** Oberer weißer Streifen: nur Fakten-Sätze */
export function BetrieblichePflegeberatungWhiteIntro() {
  return <BetrieblichePflegeberatungFactsIntro />;
}

/** Direkt unter den Fakten: welliger Übergang von Weiß zum Folgen-Band */
export function BetrieblichePflegeberatungFolgenBand() {
  return (
    <div
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible pb-0"
      style={{ backgroundColor: FOLGEN_BAND_BG }}
    >
      <WelleObenBand fill={FOLGEN_BAND_BG} />
      <section
        className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:px-[var(--ahs-page-gutter)]"
        aria-labelledby="betrieblich-folgen-heading"
      >
        <h2
          id="betrieblich-folgen-heading"
          className="mx-auto max-w-4xl text-center text-pretty text-xl font-extrabold text-[#0F4F68] sm:text-2xl"
        >
          Folgen für Arbeitgeber durch pflegende Beschäftigte
        </h2>
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
  );
}

export function BetrieblichePflegeberatungSection() {
  const wasBodyDelays = [80, 160, 240, 320] as const;
  const vorteilBaseDelay = 520;

  return (
    <div className="space-y-14 sm:space-y-16">
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible pb-0 pt-10 sm:pt-12"
        style={{ backgroundColor: BETRIEBLICH_HELL_BG }}
      >
        <section
          aria-labelledby="betrieblich-was-ist-heading"
          className="relative mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8 lg:px-[var(--ahs-page-gutter)]"
        >
          <h2
            id="betrieblich-was-ist-heading"
            className={`${POP_IN} mx-auto max-w-4xl text-center text-pretty text-xl font-extrabold text-[#0F4F68] sm:text-2xl`}
            style={{ animationDelay: "0ms" }}
          >
            Was versteht man unter betrieblicher Pflegeberatung?
          </h2>
          <div className="mx-auto mt-5 max-w-4xl space-y-4 text-pretty text-neutral-700 leading-relaxed sm:text-[1.05rem]">
            <p className={POP_IN} style={{ animationDelay: `${wasBodyDelays[0]}ms` }}>
              Betriebliche Pflegeberatung ist ein Unterstützungsangebot für Beschäftigte, die Angehörige pflegen oder
              kurzfristig vor einer Pflegesituation stehen. Sie basiert auf unserer langjährigen Erfahrung und auf dem
              häufigsten Satz, den wir hören:{" "}
              <strong className="font-semibold text-[#0F4F68]">
                „Hätte ich das eher gewusst, wäre vieles leichter gewesen.“
              </strong>
            </p>
            <p className={POP_IN} style={{ animationDelay: `${wasBodyDelays[1]}ms` }}>
              Damit Mitarbeitende nach Feierabend nicht noch „die zweite Schicht“ starten müssen und sich mit Formularen,
              Anträgen, Telefonaten, Haushalt und organisatorischen Aufgaben auseinandersetzen müssen, stehen wir{" "}
              <strong className="font-semibold text-[#0F4F68]">sofort</strong> zur Seite. Wir beraten schnell im Betrieb oder zu
              Hause und kümmern uns um die Organisation, damit Entlastung und finanzielle Leistungen sicher ankommen.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${wasBodyDelays[2]}ms` }}>
              Für Unternehmen heißt das eine verlässliche, feste Kooperation mit uns. Gegen einen günstigen monatlichen
              Festbetrag, abhängig von der Unternehmensgröße, erhalten Mitarbeitende und Führungskräfte unbegrenzten Zugang zu
              Beratung und fachlicher Unterstützung ohne Einzelabrechnung, ohne Mehraufwand und ohne Limit.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${wasBodyDelays[3]}ms` }}>
              Der Arbeitgeber kann diesen{" "}
              <strong className="font-semibold text-[#0F4F68]">neuen „Arbeitgeber-Benefit“</strong> ausschreiben und aktiv
              kommunizieren und zeigt damit echte Fürsorge. Das entlastet spürbar, reduziert Stress und erhöht die Sicherheit im
              Alltag. Gleichzeitig bleiben Mitarbeitende leistungsfähiger, und Überlastung sowie Fehl- und Ausfallzeiten können
              deutlich sinken.
            </p>
          </div>
          <div className={`${POP_IN} mt-8 flex justify-center sm:mt-10`} style={{ animationDelay: "400ms" }}>
            <BetrieblichAngebotOpenButton className="min-h-[3rem] px-8 py-3.5 text-base sm:text-lg">
              Jetzt unverbindlich informieren lassen
            </BetrieblichAngebotOpenButton>
          </div>
        </section>

        <WelleZuVorteileBand />
      </div>

      <section aria-labelledby="betrieblich-vorteile-heading">
        <h3
          id="betrieblich-vorteile-heading"
          className={`${POP_IN} text-xl font-extrabold text-[#0F4F68] sm:text-2xl`}
          style={{ animationDelay: `${vorteilBaseDelay}ms` }}
        >
          Ihre Vorteile auf einen Blick
        </h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {VORTEILE.map(({ title, text, Icon }, i) => (
            <li
              key={title}
              className={`${POP_IN} flex gap-4 rounded-2xl border border-[#0F4F68]/12 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5`}
              style={{ animationDelay: `${vorteilBaseDelay + 80 + i * 70}ms` }}
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
        className={`${POP_IN} rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm sm:p-8`}
        style={{ animationDelay: `${vorteilBaseDelay + 80 + VORTEILE.length * 70 + 120}ms` }}
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
    </div>
  );
}
