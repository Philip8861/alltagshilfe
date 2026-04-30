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

function daysInMonth(year: number, month1to12: number): number {
  return new Date(year, month1to12, 0).getDate();
}

/** Tage ab Bewilligungstag (einschließlich) bis Monatsende. */
function daysFromApprovalThroughMonthEnd(year: number, month1to12: number, dayOfMonth: number): number {
  const dim = daysInMonth(year, month1to12);
  return Math.max(0, dim - dayOfMonth + 1);
}

function partialFirstMonthAmount(monthly: number, year: number, month1to12: number, dayOfMonth: number): number {
  const dim = daysInMonth(year, month1to12);
  const days = daysFromApprovalThroughMonthEnd(year, month1to12, dayOfMonth);
  return monthly * (days / dim);
}

/** Summe Pflegegeld im Kalenderjahr der Bewilligung: anteiliger Bewilligungsmonat + volle Monate danach bis Dezember. */
function calendarYearTotalFromApproval(monthly: number, year: number, month1to12: number, dayOfMonth: number): number {
  const partial = partialFirstMonthAmount(monthly, year, month1to12, dayOfMonth);
  const fullMonthsAfterSameYear = 12 - month1to12;
  return partial + fullMonthsAfterSameYear * monthly;
}

function parseISODate(s: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return { y, m: mo, d };
}

const eur0 = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(n));

const eur2 = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

function defaultApprovalDateISO(): string {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function PflegegeldrechnerCalculator({ className }: { className?: string }) {
  const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [approvalISO, setApprovalISO] = useState(defaultApprovalDateISO);

  const parsed = useMemo(() => parseISODate(approvalISO), [approvalISO]);

  const monthly = PFLEGEGELD_2026[selected];

  const { partialRounded, partialExact, daysCount, dim, monthLabel, yearTotalRounded } = useMemo(() => {
    if (!parsed || selected === 1) {
      return {
        partialRounded: 0,
        partialExact: 0,
        daysCount: 0,
        dim: 0,
        monthLabel: "",
        yearTotalRounded: 0,
      };
    }
    const { y, m, d } = parsed;
    const dimLocal = daysInMonth(y, m);
    const days = daysFromApprovalThroughMonthEnd(y, m, d);
    const partialExactLocal = partialFirstMonthAmount(monthly, y, m, d);
    const monthLabelLocal = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(y, m - 1, 1));
    const yearTotal = calendarYearTotalFromApproval(monthly, y, m, d);
    return {
      partialRounded: Math.round(partialExactLocal),
      partialExact: partialExactLocal,
      daysCount: days,
      dim: dimLocal,
      monthLabel: monthLabelLocal,
      yearTotalRounded: Math.round(yearTotal),
    };
  }, [parsed, monthly, selected]);

  const hint = useMemo(() => {
    if (selected === 1) {
      return "Bei Pflegegrad 1 gibt es kein Pflegegeld. Es können aber andere Leistungen wie der Entlastungsbetrag, Pflegehilfsmittel oder Unterstützung im Alltag möglich sein.";
    }
    return "Pflegegeld erhalten Pflegebedürftige, wenn die häusliche Pflege privat organisiert wird, zum Beispiel durch Angehörige. Im Monat der Bewilligung wird das Pflegegeld in der Regel nur für die Tage ab dem Bewilligungsdatum bis zum Monatsende angesetzt.";
  }, [selected]);

  const showPartial = selected >= 2 && parsed !== null;

  return (
    <div
      id="rechner"
      className={cn(
        "scroll-mt-28 rounded-2xl border border-neutral-200/95 bg-[linear-gradient(180deg,#ffffff_0%,#fafcfc_100%)] p-5 text-center shadow-[0_8px_28px_-18px_rgba(15,79,104,0.2)] sm:p-6",
        className,
      )}
    >
      <fieldset>
        <legend className="mx-auto w-full max-w-xl text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/80">
          Pflegegrad wählen
        </legend>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
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
        <label
          htmlFor="pflegegeld-bewilligung"
          className="mx-auto block max-w-xl text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/80"
        >
          Bewilligungsdatum (Tag der Bewilligung)
        </label>
        <p className="mx-auto mt-1.5 max-w-xl text-sm leading-snug text-neutral-600">
          Ab diesem Kalendertag gilt der Pflegegrad; im selben Monat wird das Pflegegeld nur für die verbleibenden Tage
          (einschließlich Bewilligungstag) hochgerechnet – z.&nbsp;B. Bewilligung am 30.01.: 2 von 31 Tagen im Januar.
        </p>
        <input
          id="pflegegeld-bewilligung"
          type="date"
          value={approvalISO}
          min="2017-01-01"
          max="2035-12-31"
          onChange={(e) => setApprovalISO(e.target.value)}
          className="mx-auto mt-3 block w-full max-w-[18rem] rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[0.9375rem] font-medium text-neutral-900 shadow-sm focus:border-[#0F4F68]/40 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/25"
        />
        {parsed === null ? (
          <p className="mt-2 text-sm text-[#b42318]" role="alert">
            Bitte gültiges Datum wählen.
          </p>
        ) : null}
      </div>

      <div className="mt-6 border-t border-neutral-100 pt-6">
        <p className="text-center text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">Regelbetrag (voller Monat)</p>
        <p className="mt-2 text-center text-4xl font-extrabold tabular-nums tracking-tight text-[#0F4F68] sm:text-[2.65rem]" aria-live="polite">
          {eur0(monthly)}
        </p>

        {showPartial ? (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-[#0F4F68]/15 bg-white px-4 py-4 text-center shadow-sm">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">Anteilig im Bewilligungsmonat</p>
            <p className="mt-1 text-sm font-medium text-[#0F4F68]">{monthLabel}</p>
            <p className="mt-2 text-sm text-neutral-700">
              {daysCount} {daysCount === 1 ? "Tag" : "Tage"} von {dim} Tagen
            </p>
            <p className="mt-2 text-2xl font-extrabold tabular-nums text-[#0F4F68] sm:text-[1.75rem]" aria-live="polite">
              {eur0(partialRounded)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">exakt: {eur2(partialExact)}</p>
          </div>
        ) : null}

        <div className="mx-auto mt-6 grid w-full max-w-md grid-cols-1 justify-items-stretch gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl border border-neutral-200/90 bg-white px-3 py-3 text-center sm:px-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">Pro Monat (Regel)</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[#0F4F68]">{eur0(monthly)}</p>
          </div>
          <div className="rounded-xl border border-neutral-200/90 bg-white px-3 py-3 text-center sm:px-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">Kalenderjahr ab Bewilligung</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[#0F4F68]">{selected === 1 ? eur0(0) : eur0(yearTotalRounded)}</p>
            <p className="mt-1 text-[0.65rem] leading-snug text-neutral-500">
              {selected === 1
                ? "—"
                : "Anteil Bewilligungsmonat plus alle vollen Monate bis 31.12. desselben Jahres"}
            </p>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-neutral-700">{hint}</p>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-600">
        Der Rechner dient zur Orientierung und ersetzt keine individuelle Beratung durch die Pflegekasse. Abrechnung und
        Auszahlungstermine können abweichen.
      </p>

      <div className="mx-auto mt-6 flex w-full max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        <RatgeberBeratungCtaButton
          className="w-full justify-center sm:mx-auto sm:w-auto sm:min-w-[16rem]"
          contextNote="Ratgeber: Pflegegeldrechner – Hilfe beim Pflegegrad-Antrag"
          preselectedServices={["pflegegrad_beantrag_widerspruch"]}
        >
          Hilfe beim Pflegegrad-Antrag erhalten
        </RatgeberBeratungCtaButton>
        <Link
          href="/ratgeber/pflegegrad-beantragen#widerspruch"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-4 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#f3f9fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:mx-auto sm:w-auto"
        >
          Widerspruch prüfen lassen
        </Link>
      </div>
    </div>
  );
}
