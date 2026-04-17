import { BetrieblichAngebotOpenButton } from "@/components/pflegeberatung/BetrieblicheAngebotAnfrage";
import { BetrieblichePflegeberatungFactsIntro } from "@/components/pflegeberatung/BetrieblichePflegeberatungFactsIntro";
import {
  BETRIEBLICH_FOLGEN_SURFACE,
  BETRIEBLICH_STATISTIK_FOLGEN_OVERLAP_REM,
} from "@/components/pflegeberatung/betriebliche-statistik-layout";

const ICON_WRAP =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white shadow-sm sm:h-14 sm:w-14";

const BETRIEBLICH_HELL_BG = "#F2F9FA" as const;
/** Einheitliche Fläche: Folgen-Band, Welle und Seitenfuß-Anschluss (keine Zwischenweiß-/Grau-Streifen) */
const FOLGEN_BAND_BG = BETRIEBLICH_FOLGEN_SURFACE;

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

/** Mint (#F2F9FA) → Weiß: gleiche Kurve wie unten, oberhalb der Welle bleibt Mint sichtbar */
function WelleMintZuWeissBand() {
  return (
    <div
      className="pointer-events-none relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 leading-none"
      style={{ backgroundColor: BETRIEBLICH_HELL_BG }}
    >
      <svg
        className="relative -mb-px block h-12 w-full shrink-0 text-white sm:h-[3.75rem]"
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

/** Welle unter hellen Fläche zu weißer Fläche (z. B. vor Statistik-Hub). bg-white verhindert mintfarbenen Streifen oberhalb der Kurve. */
function WelleZuWeissBand() {
  return (
    <div className="pointer-events-none relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-white leading-none">
      <svg
        className="relative -mb-px block h-12 w-full shrink-0 text-white sm:h-[3.75rem]"
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

/** Stern – wirkt klarer als „Geschenk“ für Mitarbeiter-Benefit */
function IconStarBenefit() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M12 2l2.4 6.18L21 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.6-.95L12 2z"
        strokeLinejoin="round"
      />
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

/** Person mit Abgangs-Pfeil – klar lesbar für Fluktuation / Weggang */
function IconFluktuation() {
  return (
    <svg
      className="h-6 w-6 sm:h-7 sm:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="7.5" cy="7" r="3.25" />
      <path d="M2.5 21v-1.75a3.75 3.75 0 0 1 3.75-3.75h2a3.75 3.75 0 0 1 3.75 3.75V21" />
      <path d="M14 12h7" />
      <path d="m18.5 9 3.5 3-3.5 3" />
    </svg>
  );
}

/** Kalender mit steigenden Balken – Zunahme von Abwesenheiten / Fehlzeiten */
function IconFehlzeitenZunahme() {
  return (
    <svg
      className="h-6 w-6 sm:h-7 sm:w-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M7 18v-3M11 18v-5.5M15 18v-8" />
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
    Icon: IconStarBenefit,
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
    Icon: IconFluktuation,
  },
  {
    title: "Zunahme von Fehlzeiten",
    bullets: [
      "Reduktion der Arbeitszeit oder Kündigung aufgrund von Pflegeverpflichtungen",
      "Verlust von qualifizierten Fachkräften",
    ],
    Icon: IconFehlzeitenZunahme,
  },
] as const;

/** Oberer weißer Streifen: nur Fakten-Sätze */
export function BetrieblichePflegeberatungWhiteIntro() {
  return <BetrieblichePflegeberatungFactsIntro />;
}

/**
 * „Ihre Vorteile“ mit welligem Übergang von Weiß (Hero) nach unten und Übergang zu Weiß (Statistik-Hub).
 * Liegt oberhalb von „Statistik zeigt …“.
 */
const WAS_BODY_DELAYS = [80, 160, 240, 320, 400, 480, 560, 640, 720] as const;

export function BetrieblichePflegeberatungVorteileVorStatistik() {
  const vorteilBaseDelay = 80;

  return (
    <div
      className="relative left-1/2 mt-12 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible pb-0 sm:mt-16 lg:mt-20"
      style={{ backgroundColor: BETRIEBLICH_HELL_BG }}
    >
      <WelleObenBand fill={BETRIEBLICH_HELL_BG} />
      <section
        className="relative mx-auto max-w-7xl px-4 pb-2 pt-10 sm:px-6 sm:pb-4 sm:pt-12 lg:px-[var(--ahs-page-gutter)] lg:pt-14"
        aria-labelledby="betrieblich-vorteile-heading"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <h2
            id="betrieblich-vorteile-heading"
            className={`${POP_IN} text-balance text-xl font-extrabold text-[#0F4F68] sm:text-2xl`}
            style={{ animationDelay: `${vorteilBaseDelay}ms` }}
          >
            Ihre Vorteile auf einen Blick
          </h2>
        </div>
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

      {/* Welliger Übergang Mint → Weiß, dann Erklärtext auf Weiß */}
      <div className="mt-6 sm:mt-8">
        <WelleMintZuWeissBand />
      </div>

      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-white">
        <section
          aria-labelledby="betrieblich-was-ist-heading"
          className="relative mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-6 lg:px-[var(--ahs-page-gutter)]"
        >
          <h2
            id="betrieblich-was-ist-heading"
            className={`${POP_IN} mx-auto max-w-4xl text-center text-pretty text-xl font-extrabold text-[#0F4F68] sm:text-2xl`}
            style={{ animationDelay: "0ms" }}
          >
            Was versteht man unter betrieblicher Pflegeberatung?
          </h2>
          <div className="mx-auto mt-5 max-w-4xl space-y-4 text-pretty text-neutral-700 leading-relaxed sm:space-y-5 sm:text-[1.05rem]">
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[0]}ms` }}>
              Die betriebliche Pflegeberatung ist ein Angebot, das Sie als Arbeitgeber aktiv für Ihr Unternehmen abschließen
              können. Sie unterstützen damit Ihre Mitarbeitenden genau in den Momenten, in denen private Pflegesituationen
              plötzlich zur Belastung werden.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[1]}ms` }}>
              Sie basiert auf unserer langjährigen Erfahrung und auf dem häufigsten Satz, den wir hören:{" "}
              <strong className="font-semibold text-[#0F4F68]">
                „Hätte ich das eher gewusst, wäre vieles leichter gewesen.“
              </strong>
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[2]}ms` }}>
              Denn im Alltag entsteht genau hier die größte Herausforderung: Mitarbeitende starten nach Feierabend oft eine
              zweite Schicht und müssen sich mit Formularen, Anträgen, Telefonaten, Haushalt und organisatorischen Aufgaben
              auseinandersetzen. Diese zusätzliche Belastung führt zu Stress, Überforderung und wirkt sich direkt auf
              Konzentration, Leistungsfähigkeit und Fehlzeiten aus.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[3]}ms` }}>
              Unternehmen, die hier gezielt unterstützen, können Fehlzeiten reduzieren und die Leistungsfähigkeit ihrer
              Mitarbeitenden stabilisieren.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[4]}ms` }}>
              Wir stehen genau in diesen Situationen sofort zur Seite.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[5]}ms` }}>
              Wir beraten schnell und unkompliziert im Betrieb oder zu Hause und kümmern uns um die gesamte Organisation,
              damit Entlastung und finanzielle Leistungen sicher ankommen.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[6]}ms` }}>
              Für Sie als Unternehmen bedeutet das eine verlässliche, feste Kooperation mit uns. Gegen einen günstigen
              monatlichen Festbetrag, abhängig von der Unternehmensgröße, erhalten Ihre Mitarbeitenden und Führungskräfte
              unbegrenzten Zugang zu Beratung und fachlicher Unterstützung. Es gibt keine Einzelabrechnung, keinen Mehraufwand
              und keine Begrenzung.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[7]}ms` }}>
              Sie können diesen Benefit aktiv im Unternehmen kommunizieren und als festen Bestandteil Ihrer
              Arbeitgeberleistungen etablieren. Damit zeigen Sie echte Fürsorge und übernehmen Verantwortung für Ihre
              Mitarbeitenden.
            </p>
            <p className={POP_IN} style={{ animationDelay: `${WAS_BODY_DELAYS[8]}ms` }}>
              Das Ergebnis ist spürbar im Alltag: Mitarbeitende werden entlastet, gewinnen Sicherheit und bleiben
              leistungsfähig. Gleichzeitig können Überlastung sowie Fehl- und Ausfallzeiten deutlich sinken und Ihr
              Unternehmen wird als moderner und verantwortungsvoller Arbeitgeber wahrgenommen.
            </p>
          </div>
          <div className={`${POP_IN} mt-8 flex justify-center sm:mt-10`} style={{ animationDelay: "800ms" }}>
            <BetrieblichAngebotOpenButton className="min-h-[3rem] px-8 py-3.5 text-base sm:text-lg">
              Jetzt unverbindlich informieren lassen
            </BetrieblichAngebotOpenButton>
          </div>
        </section>
      </div>

      <WelleZuWeissBand />
    </div>
  );
}

/** Folgen-Inhalt (Überschrift + Liste); Welle Statistik→Folgen liegt in FactsIntro darüber. */
export function BetrieblichePflegeberatungFolgenBand() {
  return (
    <div
      className="relative left-1/2 z-10 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible pb-0"
      style={{ marginTop: `-${BETRIEBLICH_STATISTIK_FOLGEN_OVERLAP_REM}rem` }}
    >
      <div className="pb-0" style={{ backgroundColor: FOLGEN_BAND_BG }}>
        <section
          className="relative mx-auto max-w-7xl px-4 pb-10 pt-1 sm:px-6 sm:pb-12 sm:pt-2 lg:px-[var(--ahs-page-gutter)]"
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
          <div className="mt-10 flex justify-center sm:mt-12">
            <BetrieblichAngebotOpenButton className="w-full max-w-md min-h-[3rem] px-8 py-3.5 text-base sm:w-auto sm:max-w-none sm:text-lg" />
          </div>
        </section>
      </div>
    </div>
  );
}

