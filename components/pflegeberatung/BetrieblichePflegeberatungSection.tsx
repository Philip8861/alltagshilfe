"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BetrieblichInfoTerminOpenButton } from "@/components/pflegeberatung/BetrieblichInfoTerminDialog";
import {
  BETRIEBLICH_CARE_INDUSTRIES,
  BETRIEBLICH_CARE_MODEL,
  calculateBetrieblichCareCost,
} from "@/components/pflegeberatung/betriebliche-pflegekosten-model";

export const BETRIEBLICH_FOLGEN_SURFACE = "#ffffff" as const;

const evidence = {
  wido:
    "https://www.aok.de/pp/bv/wido-pm/widomonitor-zu-pflegenden-angehoerigen/",
  work:
    "https://www.aok.de/pp/fileadmin/bereiche/unternehmenskommunikation/AOKs_und_ihr_Verband/AOK_Bundesverband/Pressemitteilungen/2024/20240521_Pressemitteilung_WIdOmonitor_Pflegende_Angehoerige.pdf",
  forecast:
    "https://www.pro-pflegereform.de/fileadmin/default/Gutachten/2025-03-11_Gutachten_AAPV_3_END.pdf",
  earnings:
    "https://www.destatis.de/DE/Themen/Arbeit/Verdienste/Verdienste-Branche-Berufe/Tabellen/bruttojahresverdienst.html",
  study:
    "https://berufundpflege-nrw.de/uploads/2024/07/Bericht_BIBBBAuA_20180701_ES_i-1.pdf",
  research:
    "https://link.springer.com/article/10.1007/s00391-024-02387-0",
  contributions:
    "https://www.bundesgesundheitsministerium.de/beitraege/seite",
  contributionRates:
    "https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/die-pflegeversicherung/finanzierung",
  contributionCaps:
    "https://www.bmas.de/DE/Service/Gesetze-und-Gesetzesvorhaben/sozialversicherungs-rechengroessenverordnung-2026.html",
  tax: "https://www.gesetze-im-internet.de/estg/__3.html",
} as const;

type IconName =
  | "arrow"
  | "briefcase"
  | "calendar"
  | "chart"
  | "check"
  | "clock"
  | "file"
  | "heart"
  | "home"
  | "people"
  | "shield"
  | "shuffle";

function Icon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V3h8v4M3 12a22 22 0 0 0 18 0M10 13h4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 11h18m-13 5h3" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5m0 14h17M8 15l4-5 4 2 5-7m-5 0h5v5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    file: (
      <>
        <path d="M14 3H5v18h14V8l-5-5v5h5M8 12h8M8 16h6" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v11H3V10Z" />
        <path d="M9 21v-8h6v8" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    shuffle: (
      <path d="M3 6h4l10 12h4m-4-4 4 4-4 4M3 18h4l4-5m3-4 3-3h4m-4-4 4 4-4 4" />
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

function SourceLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-[#0F4F68] underline decoration-[#F78F2E]/70 decoration-2 underline-offset-4 transition-colors hover:text-[#0b3d50] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2"
    >
      {children}
      <span className="ml-1" aria-hidden>
        ↗
      </span>
    </a>
  );
}

function CountUp({
  value,
  decimals = 0,
}: {
  value: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setShown(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1_000;

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setShown(value * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} aria-hidden>
      {shown.toLocaleString("de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

const euro = (value: number, decimals = 0) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

const number = (value: number, decimals = 1) =>
  new Intl.NumberFormat("de-DE", {
    maximumFractionDigits: decimals,
  }).format(value);

function SectionArc({
  from,
  to,
  reverse = false,
}: {
  from: string;
  to: string;
  reverse?: boolean;
}) {
  return (
    <div
      className="pointer-events-none relative h-14 w-full overflow-hidden sm:h-20 lg:h-24"
      style={{ backgroundColor: from }}
      aria-hidden
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill={to}
          d={
            reverse
              ? "M0 42 C230 108 480 105 720 58 C955 12 1190 8 1440 72 L1440 120 L0 120 Z"
              : "M0 76 C240 12 490 10 720 58 C950 106 1195 104 1440 38 L1440 120 L0 120 Z"
          }
        />
      </svg>
    </div>
  );
}

const CALCULATOR_SHADOW_COSTS = [
  {
    icon: "clock" as const,
    title: "Produktionsstopp und Lieferverzug",
    text: "Abläufe stocken und Aufträge verschieben sich.",
  },
  {
    icon: "people" as const,
    title: "Vertretung und Überstunden",
    text: "Mehrbelastung führt zu Überstunden, Frust und weiteren Krankmeldungen.",
  },
  {
    icon: "shuffle" as const,
    title: "Hoher organisatorischer Aufwand",
    text: "Umplanung bindet Zeit in Teams, Führung und Personalabteilung.",
  },
  {
    icon: "shield" as const,
    title: "Qualitätseinbußen und Fehler",
    text: "Zeitdruck und fehlende Routine erhöhen das Fehlerrisiko.",
  },
] as const;

const EMPLOYEE_BENEFITS = [
  {
    icon: "people" as const,
    title: "Persönlich statt Hotline",
    text: "Ein fester Ansprechpartner kennt die Situation und begleitet sie verlässlich.",
  },
  {
    icon: "calendar" as const,
    title: "Schnelle Terminvergabe",
    text: "Persönliche Termine finden zu Hause oder auf Wunsch im Betrieb statt.",
  },
  {
    icon: "file" as const,
    title: "Anträge und Widerspruch",
    text: "Wir helfen bei Formularen, Höherstufung, Leistungen und Widersprüchen.",
  },
  {
    icon: "home" as const,
    title: "Versorgung planen",
    text: "Wir koordinieren Hauswirtschaft, Betreuung, Pflege, Umbau, Hausnotruf und Wundversorgung.",
  },
  {
    icon: "people" as const,
    title: "Angehörige stärken",
    text: "Angehörigenschulungen geben Sicherheit im Pflegealltag.",
  },
  {
    icon: "shield" as const,
    title: "Vertraulich begleiten",
    text: "Wir bleiben vom ersten Gespräch bis zur umsetzbaren Lösung an der Seite Ihrer Beschäftigten.",
  },
] as const;

const EMPLOYER_BENEFITS = [
  "Fehlzeiten reduzieren",
  "Arbeitgeberimage intern und extern stärken",
  "Vorteile im Recruiting schaffen",
  "Mitarbeiterbindung fördern",
  "Steuerliche Möglichkeiten nutzen",
  "Einen Benefit mit echtem Mehrwert bieten",
] as const;

function Calculator() {
  const [employees, setEmployees] = useState("100");
  const [industry, setIndustry] = useState("average");
  const employeeCount = /^\d+$/.test(employees.trim())
    ? Number(employees)
    : Number.NaN;
  const calculation = calculateBetrieblichCareCost(employeeCount, industry);
  const dailyCalculation = calculateBetrieblichCareCost(1, industry)!;

  return (
    <section
      id="pflege-kosten-rechner"
      aria-labelledby="betrieblich-rechner-heading"
      className="scroll-mt-[var(--ahs-header-scroll-padding)] bg-[#F2F9FA] py-12 sm:py-16 lg:py-20"
    >
      <span
        id="kostenrechner"
        className="pointer-events-none absolute"
        aria-hidden
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <header className="max-w-5xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0F4F68]/70 sm:text-sm">
            Pflegekostenrechner für Arbeitgeber
          </p>
          <h2
            id="betrieblich-rechner-heading"
            className="mt-3 text-balance text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)] lg:leading-[1.28]"
          >
            Schon{" "}
            <span className="text-[#F78F2E]">
              4,5 zusätzliche Krankheitstage
            </span>{" "}
            pro Jahr werden zum echten Kostenfaktor.
          </h2>
          <p className="mt-4 text-xl font-extrabold text-[#0F4F68]/80 sm:text-2xl">
            Was bedeutet das für Ihr Unternehmen?
          </p>
        </header>

        <div className="mt-8 grid overflow-hidden rounded-3xl border border-[#0F4F68]/15 bg-white shadow-[0_22px_60px_-30px_rgba(15,79,104,0.35)] lg:grid-cols-[0.86fr_1.14fr]">
          <div className="flex min-w-0 flex-col p-5 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0F4F68]/8 text-[#0F4F68]">
                <Icon name="briefcase" />
              </span>
              <h3 className="text-xl font-extrabold text-[#0F4F68]">
                Ihre Berechnung
              </h3>
            </div>

            <div className="mt-7 grid gap-5">
              <div>
                <label
                  htmlFor="betrieblich-employees"
                  className="mb-2 block font-bold text-[#0F4F68]"
                >
                  Anzahl Beschäftigte
                </label>
                <div
                  className={`flex min-h-14 items-center rounded-xl border-2 bg-white px-4 transition-colors focus-within:ring-2 focus-within:ring-[#F78F2E] focus-within:ring-offset-2 ${
                    calculation
                      ? "border-[#0F4F68]/30 focus-within:border-[#0F4F68]"
                      : "border-red-600"
                  }`}
                >
                  <input
                    id="betrieblich-employees"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="1000000"
                    step="1"
                    value={employees}
                    onChange={(event) => setEmployees(event.target.value)}
                    aria-invalid={!calculation}
                    aria-describedby={
                      calculation
                        ? "betrieblich-employees-help"
                        : "betrieblich-employees-help betrieblich-employees-error"
                    }
                    className="min-w-0 flex-1 bg-transparent text-2xl font-extrabold tabular-nums text-[#0F4F68] outline-none"
                  />
                  <Icon
                    name="people"
                    className="h-6 w-6 shrink-0 text-[#0F4F68]/55"
                  />
                </div>
                <p
                  id="betrieblich-employees-help"
                  className="mt-2 text-sm leading-relaxed text-neutral-600"
                >
                  Gesamte Belegschaft. Maximal 1.000.000 Beschäftigte.
                </p>
                {!calculation && (
                  <p
                    id="betrieblich-employees-error"
                    role="status"
                    className="mt-2 font-semibold text-red-700"
                  >
                    Bitte geben Sie eine ganze Zahl von 1 bis 1.000.000 ein.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="betrieblich-industry"
                  className="mb-2 block font-bold text-[#0F4F68]"
                >
                  Branche
                </label>
                <select
                  id="betrieblich-industry"
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="min-h-14 w-full rounded-xl border-2 border-[#0F4F68]/30 bg-white px-4 text-base font-semibold text-[#0F4F68] outline-none transition-colors focus:border-[#0F4F68] focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                >
                  {BETRIEBLICH_CARE_INDUSTRIES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-4 rounded-2xl border border-[#F78F2E]/40 border-l-4 border-l-[#F78F2E] bg-[#F78F2E]/10 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F78F2E] text-white shadow-sm">
                <Icon name="people" className="h-7 w-7" />
              </span>
              <p className="leading-relaxed text-[#0F4F68]">
                <strong className="block text-lg font-extrabold">
                  Rund jeder 9. Beschäftigte ist betroffen.
                </strong>
                <span className="mt-1 block text-sm font-semibold">
                  Im Rechenmodell ist diese Person in eine private
                  Pflegesituation involviert. Das entspricht 11 % der
                  Belegschaft.
                </span>
              </p>
            </div>

            <div className="mt-8 border-t border-[#0F4F68]/15 pt-6">
              <p className="text-sm font-semibold text-neutral-600">
                Ein Krankheitstag kostet im Modell
              </p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#0F4F68]">
                {euro(dailyCalculation.dailyCost, 2)}
              </p>
              <a
                href="#betrieblich-methodik"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg font-bold text-[#0F4F68] underline decoration-[#F78F2E] decoration-2 underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E]"
              >
                So rechnen wir
                <Icon name="arrow" className="h-4 w-4 rotate-90" />
              </a>
            </div>
          </div>

          <div
            className="flex min-w-0 flex-col justify-center bg-[#0F4F68] p-5 text-white sm:p-8 lg:p-10"
            aria-live="polite"
            aria-atomic="true"
          >
            {calculation ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-white/85">
                    Lohnkosten zusätzlicher Fehlzeiten
                  </p>
                  <span className="rounded-full border border-white/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/75">
                    Modellrechnung
                  </span>
                </div>
                <p className="mt-4 font-extrabold leading-none tracking-tight">
                  <span className="block break-words text-3xl tabular-nums sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)]">
                    {euro(calculation.annualCost)}
                  </span>
                  <span className="mt-2 block text-base font-bold tracking-normal text-white/70">
                    pro Jahr
                  </span>
                </p>

                <div className="mt-7 flex gap-3 rounded-xl border border-[#F78F2E]/55 border-l-4 border-l-[#F78F2E] bg-white/[0.06] p-4">
                  <Icon
                    name="briefcase"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#F78F2E]"
                  />
                  <p className="text-sm leading-relaxed text-white/85">
                    <strong className="block font-extrabold tracking-wider text-[#F78F2E]">
                      NUR LOHNKOSTEN
                    </strong>
                    inklusive Arbeitgeberbeiträgen. Weitere Ausfallkosten
                    fehlen noch.
                  </p>
                </div>

                <div className="mt-7 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-2 border-t border-white/20 pt-6 sm:gap-4">
                  <div>
                    <strong className="block text-xl font-extrabold tabular-nums sm:text-2xl">
                      {number(calculation.affectedEmployees, 2)}
                    </strong>
                    <span className="mt-2 block text-xs leading-relaxed text-white/65">
                      modellierte pflegende Beschäftigte
                    </span>
                  </div>
                  <span className="pt-1 text-lg text-white/45" aria-hidden>
                    ×
                  </span>
                  <div>
                    <strong className="block text-xl font-extrabold tabular-nums sm:text-2xl">
                      4,5
                    </strong>
                    <span className="mt-2 block text-xs leading-relaxed text-white/65">
                      zusätzliche Krankheitstage
                    </span>
                  </div>
                  <span className="pt-1 text-lg text-white/45" aria-hidden>
                    ×
                  </span>
                  <div>
                    <strong className="block text-xl font-extrabold tabular-nums sm:text-2xl">
                      {euro(calculation.dailyCost)}
                    </strong>
                    <span className="mt-2 block text-xs leading-relaxed text-white/65">
                      Lohnkosten je Tag
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <Icon
                  name="briefcase"
                  className="mx-auto h-10 w-10 text-white/55"
                />
                <h3 className="mt-5 text-2xl font-extrabold">
                  Ihre Berechnung erscheint hier.
                </h3>
                <p className="mt-3 text-white/70">
                  Geben Sie eine gültige Beschäftigtenzahl ein.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-neutral-600">
          Annahmen: 11 % pflegende Beschäftigte und 4,5 zusätzliche
          Krankheitstage je Person und Jahr. Intern wird mit ungerundeten
          Werten gerechnet.
        </p>

        <div className="mt-10 border-t border-[#0F4F68]/15 pt-8">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#F78F2E] text-white shadow-[0_10px_24px_-10px_rgba(247,143,46,0.8)]">
              <span className="text-3xl font-light" aria-hidden>
                +
              </span>
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0F4F68]/65">
                In dieser Zahl noch nicht enthalten
              </p>
              <h3 className="mt-1 text-2xl font-extrabold text-[#0F4F68] sm:text-3xl">
                Ein Ausfall kostet mehr als Geld.
              </h3>
            </div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CALCULATOR_SHADOW_COSTS.map(({ icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-sm"
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-[#F78F2E] bg-gradient-to-br from-[#0F4F68] to-[#176A84] text-white shadow-[0_14px_28px_-14px_rgba(15,79,104,0.9)]">
                  <Icon name={icon} className="h-8 w-8" />
                </span>
                <h4 className="mt-5 text-lg font-extrabold leading-snug text-[#0F4F68]">
                  {title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Facts() {
  const facts = [
    {
      icon: "heart" as const,
      eyebrow: "Gesundheit",
      value: (
        <span aria-label="46,9 Prozent">
          <CountUp value={46.9} decimals={1} />{" "}
          <span aria-hidden className="text-2xl sm:text-3xl">
            %
          </span>
        </span>
      ),
      title: "körperlich und psychisch hochbelastet",
      text: "So geht es fast der Hälfte der berufstätigen pflegenden Angehörigen.",
      source: "WIdO 2026",
      href: evidence.wido,
    },
    {
      icon: "clock" as const,
      eyebrow: "Arbeitszeit",
      value: (
        <span aria-label="1 von 4">
          <CountUp value={1} />{" "}
          <span aria-hidden className="text-2xl sm:text-3xl">
            von
          </span>{" "}
          <CountUp value={4} />
        </span>
      ),
      title: "schränkt die Erwerbstätigkeit ein",
      text: "Eine von vier Hauptpflegepersonen hat wegen häuslicher Pflege die Erwerbstätigkeit eingeschränkt.",
      source: "WIdO 2024, Befragung 2023",
      href: evidence.work,
    },
    {
      icon: "chart" as const,
      eyebrow: "Ausblick 2035",
      value: (
        <span aria-label="circa 7,6 Millionen">
          <span aria-hidden className="text-xl sm:text-2xl">
            ca.
          </span>{" "}
          <CountUp value={7.6} decimals={1} />{" "}
          <span aria-hidden className="text-2xl sm:text-3xl">
            Mio.
          </span>
        </span>
      ),
      title: "Pflegebedürftige bis 2035",
      text: "Prognose für die soziale Pflegeversicherung bis zum Jahr 2035.",
      source: "Rothgang et al. 2025, Seite 58",
      href: evidence.forecast,
    },
  ];

  return (
    <section
      aria-labelledby="betrieblich-fakten-heading"
      className="bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <header>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0F4F68]/65 sm:text-sm">
            Hinter den Fehlzeiten stehen Menschen
          </p>
          <h2
            id="betrieblich-fakten-heading"
            className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)]"
          >
            Die Belastung bleibt selten zu Hause.
          </h2>
        </header>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {facts.map((fact, index) => (
            <article
              key={fact.eyebrow}
              className={`group flex min-w-0 flex-col rounded-2xl border p-6 transition motion-reduce:transition-none sm:p-7 ${
                index === 2
                  ? "border-[#0F4F68]/20 bg-[#F2F9FA]"
                  : "border-[#0F4F68]/15 bg-white"
              } [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-xl`}
            >
              <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[#0F4F68]/65">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0F4F68]/8 text-[#0F4F68]">
                  <Icon name={fact.icon} className="h-5 w-5" />
                </span>
                {fact.eyebrow}
              </div>
              <strong className="mt-6 block text-3xl font-extrabold leading-none tracking-tight tabular-nums text-[#0F4F68] sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)]">
                {fact.value}
              </strong>
              <h3 className="mt-5 text-xl font-extrabold leading-tight text-[#0F4F68]">
                {fact.title}
              </h3>
              <p className="mt-3 leading-relaxed text-neutral-600">
                {fact.text}
              </p>
              <div className="mt-6 text-sm">
                <SourceLink href={fact.href}>{fact.source}</SourceLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  return (
    <section
      aria-labelledby="betrieblich-loesung-heading"
      className="bg-[#F2F9FA] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <header>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0F4F68]/65 sm:text-sm">
              Hier kommen wir ins Spiel
            </p>
            <h2
              id="betrieblich-loesung-heading"
              className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)]"
            >
              Wir wissen, wie Entlastung aussieht.
            </h2>
          </header>
          <div className="border-l-4 border-[#F78F2E] pl-5">
            <p className="text-xl font-extrabold text-[#0F4F68]">
              Wir machen aus Pflegeberatung eine Pflegebegleitung.
            </p>
            <p className="mt-2 leading-relaxed text-neutral-600">
              Persönlich, praxisnah und so lange an der Seite Ihrer
              Beschäftigten, bis eine tragfähige Lösung steht.
            </p>
          </div>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-2xl border border-[#0F4F68]/15 bg-[#0F4F68]/15 sm:grid-cols-3 lg:grid-cols-[0.75fr_0.75fr_0.75fr_1.45fr]">
          <div className="bg-white p-6">
            <strong className="block text-3xl font-extrabold tabular-nums text-[#0F4F68]">
              <span className="sr-only">2.000</span>
              <span aria-hidden>
                <CountUp value={2_000} />
              </span>
            </strong>
            <span className="mt-1 block font-bold leading-snug text-[#0F4F68]">
              aktuell versorgte Familien
            </span>
          </div>
          <div className="border-t border-[#0F4F68]/15 bg-white p-6 sm:border-l sm:border-t-0">
            <strong className="block text-3xl font-extrabold tabular-nums text-[#0F4F68]">
              <span className="sr-only">über 8.000</span>
              <span aria-hidden>
                <CountUp value={8_000} />+
              </span>
            </strong>
            <span className="mt-1 block font-bold leading-snug text-[#0F4F68]">
              durchgeführte Pflegeberatungen
            </span>
          </div>
          <div className="border-t border-[#0F4F68]/15 bg-white p-6 sm:border-l sm:border-t-0">
            <strong className="block text-3xl font-extrabold tabular-nums text-[#0F4F68]">
              <span className="sr-only">über 12 Jahre</span>
              <span aria-hidden>
                <CountUp value={12} />+ Jahre
              </span>
            </strong>
            <span className="mt-1 block font-bold leading-snug text-[#0F4F68]">
              Erfahrung in der Pflege
            </span>
          </div>
          <p className="border-t border-[#0F4F68]/15 bg-white p-6 leading-relaxed text-neutral-600 sm:col-span-3 lg:col-span-1 lg:border-l lg:border-t-0">
            Wir beraten praxisnah, meistens mit Angehörigen am Tisch, von
            denen viele noch berufstätig sind.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[#0F4F68]">
            <Icon name="people" className="h-6 w-6" />
            <h3 className="text-2xl font-extrabold">
              Vorteile für Arbeitnehmer
            </h3>
          </div>
          <span className="rounded-full bg-[#0F4F68]/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#0F4F68]">
            Persönliche Begleitung
          </span>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {EMPLOYEE_BENEFITS.map(({ icon, title, text }) => (
            <article
              key={title}
              className="flex gap-4 rounded-2xl p-3 transition motion-reduce:transition-none [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:shadow-md"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[#0F4F68]/15 bg-white text-[#0F4F68] shadow-sm">
                <Icon name={icon} className="h-6 w-6" />
              </span>
              <div>
                <h4 className="font-extrabold text-[#0F4F68]">{title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <section
          aria-labelledby="betrieblich-arbeitgeber-heading"
          className="mt-12 rounded-3xl border border-[#0F4F68]/20 border-l-[6px] border-l-[#F78F2E] bg-white p-6 shadow-[0_24px_55px_-35px_rgba(15,79,104,0.4)] sm:p-9"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#F78F2E] sm:text-sm">
            Ihre Vorteile
          </p>
          <h3
            id="betrieblich-arbeitgeber-heading"
            className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)]"
          >
            Als Arbeitgeber profitieren Sie gleich mehrfach.
          </h3>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EMPLOYER_BENEFITS.map((benefit) => (
              <div
                key={benefit}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA] px-4 py-3 font-extrabold leading-snug text-[#0F4F68]"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0F4F68] text-white">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                {benefit}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-3xl border border-[#0F4F68]/15 bg-white p-6 shadow-[0_24px_55px_-35px_rgba(15,79,104,0.35)] sm:p-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#F78F2E]/15 text-[#F78F2E]">
                <Icon name="heart" className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
                  Ein Benefit mit echtem Mehrwert.
                </h3>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  Persönliche Pflegebegleitung für Ihre Beschäftigten.
                </p>
              </div>
            </div>
            <p className="flex flex-wrap items-baseline gap-x-2 text-[#0F4F68]">
              <span className="font-bold text-neutral-600">ab</span>
              <strong className="text-3xl font-extrabold tracking-tight tabular-nums text-[#F78F2E] sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)]">
                <span className="sr-only">3,90 €</span>
                <span aria-hidden>
                  <CountUp value={3.9} decimals={2} /> €
                </span>
              </strong>
              <span className="max-w-36 text-sm font-bold leading-snug text-neutral-600">
                je Beschäftigten und Monat
              </span>
            </p>
          </div>
          <p className="mt-7 border-t border-[#0F4F68]/15 pt-5 leading-relaxed text-[#0F4F68]">
            <strong className="text-[#F78F2E]">Zum Vergleich:</strong> Obstkorb
            oder Kaffee kosten häufig 5 bis 9 € pro Mitarbeiter und Monat.
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Preisbasis ist die gesamte Belegschaft. Leistungsumfang und
          Konditionen werden im persönlichen Gespräch geklärt.
        </p>
      </div>
    </section>
  );
}

function ClosingCallToAction() {
  return (
    <section
      aria-labelledby="betrieblich-abschluss-heading"
      className="bg-white py-10 sm:py-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 rounded-3xl bg-[#0F4F68] p-7 text-white shadow-[0_25px_60px_-25px_rgba(15,79,104,0.5)] sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-12">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/65 sm:text-sm">
              Der nächste Schritt dauert 15 Minuten
            </p>
            <h2
              id="betrieblich-abschluss-heading"
              className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[clamp(1.55rem,0.7rem+1.45vw,2.55rem)] lg:leading-[1.28]"
            >
              Wenn Pflege zum zweiten Job wird, braucht es Rückhalt vom
              ersten.
            </h2>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-white/75">
              {["Leistungen kennenlernen", "Fragen klären", "Start besprechen"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <Icon
                      name="check"
                      className="h-4 w-4 text-[#9AD7C7]"
                    />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-center lg:items-stretch">
            <BetrieblichInfoTerminOpenButton className="w-full [&_button]:w-full [&_button]:whitespace-normal [&_button]:px-4 [&_p]:hidden" />
            <p className="mt-4 text-center font-bold text-white/85">
              Kostenlos und unverbindlich
            </p>
            <p className="mt-1 text-center text-sm text-white/60">
              Terminauswahl direkt auf unserer Website
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Methodology() {
  const sample = calculateBetrieblichCareCost(100, "average")!;

  return (
    <section
      id="betrieblich-methodik"
      aria-labelledby="betrieblich-methodik-heading"
      className="scroll-mt-[var(--ahs-header-scroll-padding)] bg-white pb-14 sm:pb-16"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#0F4F68]/15 pb-5">
          <h2
            id="betrieblich-methodik-heading"
            className="text-2xl font-extrabold text-[#0F4F68]"
          >
            Häufige Fragen
          </h2>
          <span className="text-sm text-neutral-500">
            Geprüft am {BETRIEBLICH_CARE_MODEL.checked}
          </span>
        </div>

        <details className="group border-b border-[#0F4F68]/15">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-extrabold text-[#0F4F68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] [&::-webkit-details-marker]:hidden">
            Welche Zahlen stecken im Rechner?
            <span
              className="text-2xl font-light transition-transform group-open:rotate-45 motion-reduce:transition-none"
              aria-hidden
            >
              +
            </span>
          </summary>
          <div className="max-w-5xl space-y-4 pb-7 leading-relaxed text-neutral-600">
            <div className="grid gap-4 rounded-2xl bg-[#F2F9FA] p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#0F4F68]">
                  Amtliche Daten
                </p>
                <h3 className="mt-2 font-extrabold text-[#0F4F68]">
                  Verdienste 2025, Beiträge 2026
                </h3>
                <p className="mt-2 text-sm">
                  Branchenspezifische durchschnittliche
                  Bruttojahresverdienste für Vollzeitbeschäftigte inklusive
                  Sonderzahlungen.
                </p>
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#F78F2E]">
                  Modellannahmen
                </p>
                <h3 className="mt-2 font-extrabold text-[#0F4F68]">
                  11 % und 4,5 zusätzliche Krankheitstage
                </h3>
                <p className="mt-2 text-sm">
                  Für die unternehmerische Szenariorechnung kalkuliert das
                  Modell bewusst mit 4,5 zusätzlichen Krankheitstagen. Diese
                  Annahme ist kein individuelles Ergebnis.
                </p>
              </div>
            </div>
            <p>
              Forschung und Befragungen zeigen eine erhöhte gesundheitliche
              Belastung bei Erwerbstätigen mit Pflegeverantwortung. Der
              konkrete Wert von 4,5 Tagen bleibt im Rechner als transparente
              Modellannahme ausgewiesen.
            </p>
            <p className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              <SourceLink href={evidence.study}>
                Bericht zu Beruf und Pflege
              </SourceLink>
              <SourceLink href={evidence.research}>
                Fachpublikation 2025
              </SourceLink>
            </p>
            <div className="rounded-2xl bg-[#F2F9FA] p-5">
              <h3 className="font-extrabold text-[#0F4F68]">
                Beispiel mit 100 Beschäftigten
              </h3>
              <p className="mt-2">
                11 modellierte pflegende Beschäftigte × 4,5 Krankheitstage ×{" "}
                {euro(sample.dailyCost, 2)} Lohnkosten je Tag ={" "}
                <strong className="font-extrabold text-[#0F4F68]">
                  {euro(sample.annualCost)} pro Jahr
                </strong>
                .
              </p>
            </div>
          </div>
        </details>

        <details className="group border-b border-[#0F4F68]/15">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-extrabold text-[#0F4F68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] [&::-webkit-details-marker]:hidden">
            Wie werden die Lohnkosten berechnet?
            <span
              className="text-2xl font-light transition-transform group-open:rotate-45 motion-reduce:transition-none"
              aria-hidden
            >
              +
            </span>
          </summary>
          <div className="max-w-5xl space-y-5 pb-7 leading-relaxed text-neutral-600">
            <p>
              Jahreswert = Beschäftigtenzahl × 11 % × 4,5 zusätzliche
              Krankheitstage × Lohnkostenwert je Tag. Der Tageswert enthält
              das durchschnittliche Branchenbrutto und Arbeitgeberbeiträge,
              verteilt auf 260 bezahlte Wochentage.
            </p>
            <p>
              Intern rechnet das Modell mit ungerundeten Werten. Erst die
              sichtbare Ausgabe wird gerundet. Teilzeitquoten, individuelle
              Gehälter und Erstattungen können den tatsächlichen Wert
              verändern.
            </p>
            <p className="flex flex-wrap gap-x-3 gap-y-2 text-sm">
              <SourceLink href={evidence.earnings}>
                Destatis, Branchenverdienste 2025
              </SourceLink>
              <SourceLink href={evidence.contributions}>
                BMG, Krankenversicherung 2026
              </SourceLink>
              <SourceLink href={evidence.contributionRates}>
                BMG, Beitragssätze
              </SourceLink>
              <SourceLink href={evidence.contributionCaps}>
                BMAS, Bemessungsgrenzen 2026
              </SourceLink>
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#0F4F68]/15">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="bg-[#F2F9FA] px-4 py-3 text-left font-extrabold text-[#0F4F68]">
                  Hinterlegte Bruttojahresverdienste 2025
                </caption>
                <thead className="bg-[#0F4F68] text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Branche
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Jahresbrutto
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BETRIEBLICH_CARE_INDUSTRIES.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#0F4F68]/10"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-semibold text-[#0F4F68]"
                      >
                        {item.name}
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                        {euro(item.annualGross)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>

        <details className="group border-b border-[#0F4F68]/15">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-extrabold text-[#0F4F68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] [&::-webkit-details-marker]:hidden">
            Welche Kosten bleiben unberücksichtigt?
            <span
              className="text-2xl font-light transition-transform group-open:rotate-45 motion-reduce:transition-none"
              aria-hidden
            >
              +
            </span>
          </summary>
          <div className="max-w-5xl space-y-4 pb-7 leading-relaxed text-neutral-600">
            <p>
              Der Rechner zeigt ausschließlich einen Lohnkostenwert. Je nach
              Betrieb kommen Vertretung, Überstunden, Umplanung,
              Produktionsausfälle, Lieferverzögerungen, Fehler,
              Qualitätsverluste und Mehrbelastung im Team hinzu.
            </p>
            <p>
              Betrieblich veranlasste Beratungskosten können als
              Betriebsausgabe berücksichtigt werden. Die steuerliche
              Behandlung hängt vom Einzelfall ab.{" "}
              <SourceLink href={evidence.tax}>
                § 3 Nr. 34a EStG
              </SourceLink>
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}

export function BetrieblichePflegeberatungB2BSection() {
  useEffect(() => {
    const hash = window.location.hash;
    const targetId =
      hash === "#pflege-kosten-rechner"
        ? "pflege-kosten-rechner"
        : hash === "#kostenrechner"
          ? "kostenrechner"
          : null;

    if (!targetId) return;

    let firstFrame = 0;
    let secondFrame = 0;
    let cancelled = false;

    const scrollToCalculator = () => {
      if (cancelled) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      const stickyHeaderHeight = Array.from(
        document.querySelectorAll<HTMLElement>("header"),
      ).reduce((height, header) => {
        const styles = window.getComputedStyle(header);
        if (styles.position !== "sticky" && styles.position !== "fixed") {
          return height;
        }
        const rect = header.getBoundingClientRect();
        return rect.top <= 1 ? Math.max(height, rect.height) : height;
      }, 0);

      window.scrollTo({
        behavior: "auto",
        top: Math.max(
          0,
          window.scrollY +
            target.getBoundingClientRect().top -
            stickyHeaderHeight,
        ),
      });
    };

    firstFrame = window.requestAnimationFrame(() => {
      scrollToCalculator();
      secondFrame = window.requestAnimationFrame(scrollToCalculator);
    });

    void document.fonts?.ready.then(scrollToCalculator);
    window.addEventListener("load", scrollToCalculator, { once: true });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.removeEventListener("load", scrollToCalculator);
    };
  }, []);

  return (
    <div className="betrieblich-b2b relative bg-white text-neutral-800">
      <Calculator />
      <SectionArc from="#F2F9FA" to="#ffffff" />
      <Facts />
      <SectionArc from="#ffffff" to="#F2F9FA" reverse />
      <Solution />
      <SectionArc from="#F2F9FA" to="#ffffff" />
      <ClosingCallToAction />
      <Methodology />
    </div>
  );
}
