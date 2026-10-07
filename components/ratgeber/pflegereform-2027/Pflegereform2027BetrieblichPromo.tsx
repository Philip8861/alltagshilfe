import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const BETRIEBLICHE_PFLEGEBERATUNG_PATH = "/pflegeberatung/betriebliche-pflegeberatung" as const;

/* ---------- Button-Stile (hell, markenkonform: Orange = Primär, Navy-Outline = Sekundär) ---------- */

const ORANGE_LINK =
  "inline-flex min-h-[2.875rem] items-center justify-center gap-2 rounded-lg bg-[#F78F2E] px-5 text-[0.95rem] font-bold text-white shadow-[0_3px_12px_-4px_rgba(180,90,10,0.32)] transition hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

const NAVY_OUTLINE_LINK =
  "inline-flex min-h-[2.875rem] items-center justify-center gap-2 rounded-lg border border-[#0F4F68]/30 bg-white px-5 text-[0.95rem] font-semibold text-[#0F4F68] transition hover:bg-[#f6fafc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

/* ---------- Icons ---------- */

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function BriefcaseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V3h8v4M3 12a22 22 0 0 0 18 0M10 13h4" />
    </svg>
  );
}

function PeopleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2" />
    </svg>
  );
}

function BetrieblichLink({ className, children, anchor }: { className?: string; children: ReactNode; anchor?: string }) {
  return (
    <Link href={anchor ? `${BETRIEBLICHE_PFLEGEBERATUNG_PATH}#${anchor}` : BETRIEBLICHE_PFLEGEBERATUNG_PATH} className={cn(ORANGE_LINK, className)}>
      {children}
      <ArrowIcon />
    </Link>
  );
}

/* ---------- 1) Anfang: unter dem Artikelbild im Hero ---------- */

export function Pflegereform2027BetrieblichImageCta() {
  return (
    <div className="mt-4 w-full rounded-xl border border-[#F78F2E]/35 bg-[linear-gradient(160deg,#fffdfb_0%,#fff7f0_60%,#ffffff_100%)] px-4 py-3.5 text-center sm:mt-3 lg:text-left">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#F78F2E]">Für Angehörige, die pflegen und arbeiten</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-[#0F4F68]">
        Die Reform macht es Angehörigen nicht leichter. Wie Ihr Arbeitgeber Sie jetzt unterstützen kann:
      </p>
      <BetrieblichLink className="mt-3 w-full">Betriebliche Pflegeberatung entdecken</BetrieblichLink>
    </div>
  );
}

/* ---------- 3) Ende: kompakte Hinweisbox im Fazit ---------- */

export function Pflegereform2027BetrieblichCompactCta({
  eyebrow,
  title,
  children,
  primaryLabel = "Betriebliche Pflegeberatung entdecken",
}: {
  eyebrow: string;
  title?: string;
  children: ReactNode;
  primaryLabel?: string;
}) {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-[linear-gradient(165deg,#fafcfc_0%,#ffffff_55%,#fff9f4_100%)] px-5 py-6 sm:px-7">
      <div className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#F78F2E] to-transparent" aria-hidden />
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e]">{eyebrow}</p>
      {title ? <p className="mt-2 text-[1.15rem] font-bold leading-snug text-[#0F4F68]">{title}</p> : null}
      <div className="mt-2.5 text-[1.0625rem] leading-relaxed text-neutral-800">{children}</div>
      <div className="mt-5">
        <BetrieblichLink className="w-full sm:w-auto">{primaryLabel}</BetrieblichLink>
      </div>
    </div>
  );
}

/* ---------- 2) Mitte: großer Benefit-Abschnitt ---------- */

function BenefitColumn({
  icon,
  eyebrow,
  title,
  items,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  items: readonly string[];
  children?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F2F9FA] text-[#0F4F68]">{icon}</span>
        <div className="min-w-0">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#F78F2E]">{eyebrow}</p>
          <h4 className="text-lg font-extrabold leading-snug text-[#0F4F68]">{title}</h4>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2.5 text-[1rem] leading-snug text-neutral-800">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#F2F9FA] text-[#0F4F68]">
              <CheckIcon className="h-3 w-3" />
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      {children ? <div className="mt-5 flex flex-col gap-2.5 sm:mt-auto sm:pt-5">{children}</div> : null}
    </div>
  );
}

const EMPLOYEE_POINTS = [
  "Persönliche Ansprechperson statt Hotline – vertraulich, der Arbeitgeber erfährt keine Details",
  "Hilfe bei Pflegegrad, Höherstufung, Widerspruch und offenen Leistungen",
  "Termine zu Hause oder auf Wunsch im Betrieb – schnell vergeben",
  "Versorgung planen: Haushalt, Betreuung, Pflege, Umbau, Hausnotruf und mehr",
] as const;

const EMPLOYER_POINTS = [
  "Fehlzeiten reduzieren und Mitarbeiterbindung stärken",
  "Vorteile im Recruiting und ein Arbeitgeberimage mit Substanz",
  "Ab 3,90 € je Beschäftigten und Monat – Preisbasis gesamte Belegschaft",
  "Steuerliche Möglichkeiten nutzen, kaum Aufwand für die Personalabteilung",
] as const;

/**
 * Werbeabschnitt in der Artikelmitte – für pflegende Angehörige und Arbeitgeber gleichermaßen.
 * Inhalte entsprechen der Seite /pflegeberatung/betriebliche-pflegeberatung.
 */
export function Pflegereform2027BetrieblichBenefitSection() {
  return (
    <div className="mt-8 rounded-[1.35rem] border border-[#0F4F68]/14 bg-gradient-to-br from-[#f8fcfd] via-white to-[#fff8f2] p-5 shadow-md sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#0F4F68]/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F78F2E]" aria-hidden />
            Betriebliche Pflegeberatung von Alltagshilfe-Süd
          </p>
          <h3 className="mt-2 text-balance text-2xl font-extrabold leading-snug tracking-tight text-[#0F4F68] sm:text-3xl">
            Wie Ihr Unternehmen jetzt unterstützen kann – bevor die Reform greift.
          </h3>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-neutral-700">
            Die sieben Prüfpunkte in diesem Beitrag kosten Zeit, Nerven und oft Arbeitszeit. Viele Angehörige stemmen
            das neben dem Job – und 2027 kommen neue Regeln dazu. Betriebliche Pflegeberatung schafft hier Abhilfe:
            Unternehmen stellen ihren Beschäftigten eine persönliche Pflegebegleitung zur Seite, und wir übernehmen
            die Orientierung im Pflegesystem – von der Höherstufung bis zur Vertretung der Pflegeperson. Ein Benefit,
            der jetzt zählt.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2 text-center sm:gap-3">
          {[
            { value: "12+", label: "Jahre Erfahrung" },
            { value: "8.000+", label: "Pflegeberatungen" },
            { value: "2.000", label: "versorgte Familien" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col rounded-xl border border-[#0F4F68]/12 bg-white px-2 py-3 sm:px-3">
              <dt className="order-2 mt-1.5 text-[0.68rem] font-semibold leading-tight text-neutral-600 sm:text-xs">{s.label}</dt>
              <dd className="text-xl font-extrabold tabular-nums leading-none text-[#0F4F68] sm:text-2xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <BenefitColumn
          icon={<PeopleIcon />}
          eyebrow="Für pflegende Angehörige"
          title="Entlastung, die im Alltag ankommt"
          items={EMPLOYEE_POINTS}
        >
          <Link href={BETRIEBLICHE_PFLEGEBERATUNG_PATH} className={`${NAVY_OUTLINE_LINK} w-full`}>
            So funktioniert der Benefit
            <ArrowIcon />
          </Link>
        </BenefitColumn>
        <BenefitColumn
          icon={<BriefcaseIcon />}
          eyebrow="Für Arbeitgeber"
          title="Wenn Pflege zum zweiten Job wird, leidet der erste"
          items={EMPLOYER_POINTS}
        >
          <BetrieblichLink className="w-full">Benefit kennenlernen</BetrieblichLink>
          <Link href={`${BETRIEBLICHE_PFLEGEBERATUNG_PATH}#pflege-kosten-rechner`} className={`${NAVY_OUTLINE_LINK} w-full`}>
            Zum Pflegekostenrechner
          </Link>
        </BenefitColumn>
      </div>
    </div>
  );
}
