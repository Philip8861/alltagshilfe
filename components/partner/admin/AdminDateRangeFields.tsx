"use client";

/** Gemeinsame Von–Bis-Datumsfelder für die Admin-Statistik-Panels. */

export function todayInputValue(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function firstOfMonthInputValue(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export function formatDayInputDe(v: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(`${v}T12:00:00`).toLocaleDateString("de-DE") : v;
}

const INPUT_CLASS =
  "mt-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20";

type Props = {
  idPrefix: string;
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
};

export function AdminDateRangeFields({ idPrefix, from, to, onFromChange, onToChange }: Props) {
  return (
    <>
      <div>
        <label htmlFor={`${idPrefix}-range-from`} className="block text-xs font-bold uppercase text-[#0F4F68]/75">
          Von
        </label>
        <input
          id={`${idPrefix}-range-from`}
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-range-to`} className="block text-xs font-bold uppercase text-[#0F4F68]/75">
          Bis
        </label>
        <input
          id={`${idPrefix}-range-to`}
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => onToChange(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>
    </>
  );
}
