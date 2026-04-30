"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { RatgeberBeratungCtaButton } from "@/components/ratgeber/RatgeberBeratungDialog";
import { cn } from "@/lib/utils";

const PFLEGEGELD_2026: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 0,
  2: 347,
  3: 599,
  4: 800,
  5: 990,
};

const GRADES = [1, 2, 3, 4, 5] as const;

const eur = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function PflegegeldrechnerCalculator({ className }: { className?: string }) {
  const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 5>(2);

  const monthly = PFLEGEGELD_2026[selected];
  const yearly = monthly * 12;

  const hint = useMemo(() => {
    if (selected === 1) {
      return "Bei Pflegegrad 1 gibt es kein Pflegegeld. Es können aber andere Leistungen wie der Entlastungsbetrag, Pflegehilfsmittel oder Unterstützung im Alltag möglich sein.";
    }
    return "Pflegegeld erhalten Pflegebedürftige, wenn die häusliche Pflege privat organisiert wird, zum Beispiel durch Angehörige.";
  }, [selected]);

  return (
    <div
      id="rechner"
      className={cn(
        "scroll-mt-28 rounded-2xl border border-neutral-200/95 bg-[linear-gradient(180deg,#ffffff_0%,#fafcfc_100%)] p-5 shadow-[0_8px_28px_-18px_rgba(15,79,104,0.2)] sm:p-6",
        className,
      )}
    >
      <fieldset>
        <legend className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/80">
          Pflegegrad wählen
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {GRADES.map((g) => {
            const active = selected === g;
            return (
              <button
                key={g}
                type="button"
                aria-pressed={active}
                aria-label={`Pflegegrad ${g}`}
                onClick={() => setSelected(g)}
                className={cn(
                  "min-h-[44px] min-w-[2.75rem] rounded-xl border px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                  active
                    ? "border-[#0F4F68] bg-[#0F4F68] text-white shadow-none"
                    : "border-neutral-200 bg-white text-[#0F4F68] hover:border-[#0F4F68]/35 hover:bg-[#f6fafb]",
                )}
              >
                PG&nbsp;{g}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 border-t border-neutral-100 pt-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">Monatliches Pflegegeld</p>
        <p className="mt-2 text-center text-4xl font-extrabold tabular-nums tracking-tight text-[#0F4F68] sm:text-[2.65rem]" aria-live="polite">
          {eur(monthly)}
        </p>
        <div className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl border border-neutral-200/90 bg-white px-3 py-3 text-center sm:px-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">Pro Monat</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[#0F4F68]">{eur(monthly)}</p>
          </div>
          <div className="rounded-xl border border-neutral-200/90 bg-white px-3 py-3 text-center sm:px-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">Pro Jahr</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[#0F4F68]">{eur(yearly)}</p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-[0.9375rem] leading-relaxed text-neutral-700">{hint}</p>

      <p className="mt-4 text-sm leading-relaxed text-neutral-600">
        Der Rechner dient zur Orientierung und ersetzt keine individuelle Beratung durch die Pflegekasse.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        <RatgeberBeratungCtaButton
          className="w-full justify-center sm:w-auto sm:min-w-[16rem]"
          contextNote="Ratgeber: Pflegegeldrechner – Hilfe beim Pflegegrad-Antrag"
          preselectedServices={["pflegegrad_beantrag_widerspruch"]}
        >
          Hilfe beim Pflegegrad-Antrag erhalten
        </RatgeberBeratungCtaButton>
        <Link
          href="/ratgeber/pflegegrad-beantragen#widerspruch"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-4 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#f3f9fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:w-auto"
        >
          Widerspruch prüfen lassen
        </Link>
      </div>
    </div>
  );
}
