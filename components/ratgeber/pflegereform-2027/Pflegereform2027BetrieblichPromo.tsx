import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const BETRIEBLICHE_PFLEGEBERATUNG_PATH = "/pflegeberatung/betriebliche-pflegeberatung" as const;

/* ---------- Button-Stile (hell, markenkonform: Orange = Primär, Navy-Outline = Sekundär) ---------- */

const ORANGE_LINK =
  "inline-flex min-h-[2.875rem] items-center justify-center gap-2 rounded-lg bg-[#F78F2E] px-5 text-[0.95rem] font-bold text-white shadow-[0_3px_12px_-4px_rgba(180,90,10,0.32)] transition hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

/* ---------- Icons ---------- */

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14m-6-6 6 6-6 6" />
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
    <div className="mt-4 w-full rounded-xl border border-[#F78F2E]/30 bg-[#fffaf6] px-4 py-3.5 text-center sm:mt-3 lg:text-left">
      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-[#F78F2E]">Pflege und Beruf</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-[#0F4F68]">
        Ihr Arbeitgeber kann Sie mit persönlicher Pflegeberatung entlasten.
      </p>
      <BetrieblichLink className="mt-3 w-full">Unterstützung ansehen</BetrieblichLink>
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

/**
 * Ruhiger Werbeabschnitt in der Artikelmitte:
 * eine Botschaft, drei Kernvorteile, ein klarer nächster Schritt.
 */
export function Pflegereform2027BetrieblichBenefitSection() {
  const benefits = ["Vertraulich für Beschäftigte", "Persönliche Begleitung", "Kaum Aufwand für HR"] as const;

  return (
    <aside className="relative mt-7 overflow-hidden rounded-2xl border border-[#0F4F68]/12 bg-white px-5 py-6 shadow-[0_12px_36px_-30px_rgba(15,79,104,0.3)] sm:px-7 sm:py-7">
      <span aria-hidden className="absolute inset-y-4 left-0 w-[3px] rounded-full bg-[#F78F2E]" />
      <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.15em] text-[#F78F2E]">
        Betriebliche Pflegeberatung
      </p>
      <h3 className="mt-2 text-balance text-xl font-extrabold leading-snug text-[#0F4F68] sm:text-2xl">
        Ein Benefit, der im Pflegealltag wirklich hilft.
      </h3>
      <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-neutral-700">
        Beschäftigte erhalten eine feste Ansprechperson für Pflegegrad, Anträge und Leistungen. Unternehmen entlasten
        ihr Team, ohne dass die Personalabteilung Einzelfälle betreuen muss.
      </p>

      <ul className="mt-4 flex flex-col gap-2 text-sm font-semibold text-[#0F4F68] sm:flex-row sm:flex-wrap sm:gap-x-6">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#F78F2E]" aria-hidden />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <BetrieblichLink className="w-full sm:w-auto">So funktioniert der Benefit</BetrieblichLink>
      </div>
    </aside>
  );
}
