import Link from "next/link";
import type { ReactNode } from "react";

import { RatgeberBeratungCtaButton } from "@/components/ratgeber/RatgeberBeratungDialog";
import { PFLEGEREFORM_2027_SLUG } from "@/config/ratgeber-betraege";
import { siteConfig } from "@/config/site";

export const BETRIEBLICHE_PFLEGEBERATUNG_PATH = "/pflegeberatung/betriebliche-pflegeberatung" as const;

const WHITE_OUTLINE_LINK =
  "inline-flex min-h-[2.875rem] items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/5 px-5 text-[0.95rem] font-semibold text-white transition hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F4F68]";

const NAVY_LINK =
  "inline-flex min-h-[2.875rem] items-center justify-center gap-2 rounded-lg bg-[#0F4F68] px-5 text-[0.95rem] font-semibold text-white transition hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

const NAVY_OUTLINE_LINK =
  "inline-flex min-h-[2.875rem] items-center justify-center gap-2 rounded-lg border border-[#0F4F68]/35 bg-white px-5 text-[0.95rem] font-semibold text-[#0F4F68] transition hover:bg-[#f6fafc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

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

function MailIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/**
 * Kompakter Banner nach „Was sich 2027 ändern könnte“:
 * spricht Beschäftigte und Arbeitgeber gleichzeitig an.
 */
export function Pflegereform2027BetrieblichInlineBanner() {
  return (
    <aside
      aria-labelledby="pr27-inline-banner-heading"
      className="relative mt-10 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0F4F68_0%,#15607c_60%,#1d6f8c_100%)] px-5 py-6 text-white shadow-[0_18px_48px_-30px_rgba(15,79,104,0.6)] sm:px-7 sm:py-7"
    >
      <span className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border border-white/10" aria-hidden />
      <span className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full border border-white/10" aria-hidden />
      <p className="relative inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-white/80">
        <BriefcaseIcon className="h-4 w-4 text-[#F78F2E]" />
        Betriebliche Pflegeberatung
      </p>
      <h3 id="pr27-inline-banner-heading" className="relative mt-2 text-balance text-xl font-extrabold leading-snug sm:text-2xl">
        Mit uns vorbereitet auf die Pflegereform 2027.
      </h3>
      <p className="relative mt-3 max-w-2xl text-[1rem] leading-relaxed text-white/85">
        Pflegegrade, Entlastungsbetrag, neue Budgets: Vieles davon muss nebenbei im Berufsalltag geklärt werden. Mit
        der betrieblichen Pflegeberatung bekommen Beschäftigte eine persönliche Pflegebegleitung über ihren
        Arbeitgeber – vertraulich, mit fester Ansprechperson und Hilfe bei Anträgen, Höherstufung und Leistungen.
      </p>
      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/15 bg-white/[0.06] p-4">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#F78F2E]">Sie pflegen und arbeiten?</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/85">
            Fragen Sie Ihren Arbeitgeber nach dem Benefit – oder lassen Sie sich direkt von uns beraten.
          </p>
          <RatgeberBeratungCtaButton
            className="mt-3 w-full"
            preselectedServices={["pflegeberatung"]}
            contextNote="Ratgeber: Pflegereform 2027 – Inline-Banner (Beschäftigte)"
          >
            Jetzt kostenlos beraten lassen
          </RatgeberBeratungCtaButton>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/[0.06] p-4">
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#F78F2E]">Sie sind Arbeitgeber?</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/85">
            Ein Benefit, der jetzt zählt: Entlasten Sie pflegende Beschäftigte, bevor die Reform greift.
          </p>
          <Link href={BETRIEBLICHE_PFLEGEBERATUNG_PATH} className={`${WHITE_OUTLINE_LINK} mt-3 w-full`}>
            Benefit für Unternehmen
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </aside>
  );
}

/** Kurzer Teaser nach Punkt 4 (Verhinderungspflege): Pflege und Beruf. */
export function Pflegereform2027BetrieblichQuoteTeaser() {
  return (
    <aside
      aria-label="Hinweis: Pflege und Beruf"
      className="relative mt-8 overflow-hidden rounded-xl border border-[#F78F2E]/35 bg-[linear-gradient(160deg,#fffdfb_0%,#fff8f2_55%,#ffffff_100%)] px-5 py-5 sm:px-6"
    >
      <div className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#F78F2E] to-transparent" aria-hidden />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e]">Pflege und Beruf</p>
          <p className="mt-1.5 text-[1.0625rem] font-semibold leading-snug text-[#0F4F68]">
            Wer pflegt, braucht Pausen – und einen Arbeitgeber, der mitdenkt.
          </p>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-neutral-700">
            Betriebliche Pflegeberatung hilft Beschäftigten, Verhinderungs- und Kurzzeitpflege rechtzeitig zu planen,
            statt erst im Notfall zu reagieren. Für Unternehmen: weniger Ausfälle, mehr Bindung.
          </p>
        </div>
        <Link href={BETRIEBLICHE_PFLEGEBERATUNG_PATH} className={`${NAVY_OUTLINE_LINK} shrink-0`}>
          Mehr erfahren
          <ArrowIcon />
        </Link>
      </div>
    </aside>
  );
}

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
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#0F4F68] text-white">
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
 * Großer Werbeabschnitt „Ein Benefit, der jetzt zählt“ – für Arbeitnehmer und Arbeitgeber gleichermaßen.
 * Inhalte entsprechen der Seite /pflegeberatung/betriebliche-pflegeberatung.
 */
export function Pflegereform2027BetrieblichBenefitSection() {
  const articleUrl = `${siteConfig.baseUrl.replace(/\/?$/, "")}/ratgeber/${PFLEGEREFORM_2027_SLUG}`;
  const shareSubject = encodeURIComponent("Vorschlag: Betriebliche Pflegeberatung als Benefit (Pflegereform 2027)");
  const shareBody = encodeURIComponent(
    [
      "Hallo,",
      "",
      "ich bin auf diesen Beitrag zur Pflegereform 2027 gestoßen. Darin wird beschrieben, wie Unternehmen pflegende Beschäftigte mit einer betrieblichen Pflegeberatung entlasten können.",
      "",
      `Beitrag: ${articleUrl}`,
      `Infos für Unternehmen: ${siteConfig.baseUrl.replace(/\/?$/, "")}${BETRIEBLICHE_PFLEGEBERATUNG_PATH}`,
      "",
      "Vielleicht ist das auch für uns ein passender Benefit?",
      "",
      "Viele Grüße",
    ].join("\n"),
  );

  return (
    <div className="mt-8 rounded-[1.35rem] border border-[#0F4F68]/14 bg-gradient-to-br from-[#f8fcfd] via-white to-[#fff8f2] p-5 shadow-md sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-[#0F4F68]/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F78F2E]" aria-hidden />
            Betriebliche Pflegeberatung von Alltagshilfe-Süd
          </p>
          <h3 className="mt-2 text-balance text-2xl font-extrabold leading-snug tracking-tight text-[#0F4F68] sm:text-3xl">
            Ein Benefit, der jetzt zählt: Mit uns vorbereitet auf die Pflegereform 2027.
          </h3>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-neutral-700">
            Die sieben Punkte in diesem Beitrag kosten Zeit, Nerven und oft Arbeitszeit. Genau hier setzt die
            betriebliche Pflegeberatung an: Unternehmen stellen ihren Beschäftigten eine persönliche Pflegebegleitung
            zur Seite – und wir übernehmen die Orientierung im Pflegesystem, von der Höherstufung bis zur Vertretung
            der Pflegeperson.
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
          eyebrow="Für Beschäftigte"
          title="Entlastung, die im Alltag ankommt"
          items={EMPLOYEE_POINTS}
        >
          <RatgeberBeratungCtaButton
            className="w-full"
            preselectedServices={["pflegeberatung"]}
            contextNote="Ratgeber: Pflegereform 2027 – Benefit-Abschnitt (Beschäftigte)"
          >
            Jetzt kostenlos beraten lassen
          </RatgeberBeratungCtaButton>
          <a
            href={`mailto:?subject=${shareSubject}&body=${shareBody}`}
            className={`${NAVY_OUTLINE_LINK} w-full`}
          >
            <MailIcon />
            Beitrag an Personalabteilung weiterleiten
          </a>
        </BenefitColumn>
        <BenefitColumn
          icon={<BriefcaseIcon />}
          eyebrow="Für Arbeitgeber"
          title="Wenn Pflege zum zweiten Job wird, leidet der erste"
          items={EMPLOYER_POINTS}
        >
          <Link href={BETRIEBLICHE_PFLEGEBERATUNG_PATH} className={`${NAVY_LINK} w-full`}>
            15-Min. Infogespräch buchen
            <ArrowIcon />
          </Link>
          <Link href={`${BETRIEBLICHE_PFLEGEBERATUNG_PATH}#pflege-kosten-rechner`} className={`${NAVY_OUTLINE_LINK} w-full`}>
            Pflegekostenrechner für Arbeitgeber
          </Link>
          <p className="text-center text-xs font-medium text-neutral-500">Kostenlos &amp; 100 % unverbindlich</p>
        </BenefitColumn>
      </div>
    </div>
  );
}
