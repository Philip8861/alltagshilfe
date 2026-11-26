import type { InputHTMLAttributes, ReactNode } from "react";
import { WEEKDAY_HEADERS_DE, addMonths, monthLabelDe, ymdToYearMonth } from "@/lib/betrieblich-info-termin/slots";
import { courseMonthDates } from "@/lib/orientierungskurs/slots";
import type { CourseContactSalutation } from "@/lib/validations/orientierungskurs";

export const courseButton = "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0b3c50] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68] disabled:opacity-50";
export const courseSecondary = "inline-flex min-h-11 items-center justify-center rounded-xl border border-[#9ebec9] bg-white px-4 py-2 text-sm font-bold text-[#0F4F68] hover:bg-[#eef7f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40";
export const courseField = "min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-[#0F4F68] focus:outline focus:outline-2 focus:outline-[#0F4F68]";
export const courseCard = "rounded-2xl border border-[#cfe2e7] bg-white p-4 shadow-sm sm:p-6";

export function CourseField({ label, ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-slate-800">
      <span>{label}</span>
      <input className={courseField + " font-normal"} {...input} />
    </label>
  );
}

export function CourseSalutationField({ value, onChange }: {
  value: CourseContactSalutation | "";
  onChange: (value: CourseContactSalutation | "") => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-slate-800">
      Anrede für die Bestätigung
      <select className={courseField + " font-normal"} name="salutation" required value={value}
        onChange={(event) => onChange(event.target.value as CourseContactSalutation | "")}>
        <option value="" disabled>Bitte wählen</option>
        <option value="frau">Frau</option>
        <option value="herr">Herr</option>
        <option value="unknown">Allgemeine Anrede</option>
      </select>
    </label>
  );
}

export function CourseHoneypot() {
  return <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>;
}

export function CourseFormPrivacy() {
  return (
    <p className="text-sm text-slate-600">
      Wir verwenden Ihre Angaben zur Organisation des Kurses. Weitere Informationen finden Sie in unserer{" "}
      <a className="font-semibold text-[#0F4F68] underline underline-offset-2" href="/datenschutz" target="_blank" rel="noreferrer">Datenschutzerklärung</a>.
    </p>
  );
}

export function CoursePage({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return (
    <section className="flex-1 bg-[#eff7f8] px-3 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#123947] sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">{description}</p>
        </header>
        {children}
      </div>
    </section>
  );
}

export function adjacentMonth(month: string, change: number): string {
  const { year, month: number } = ymdToYearMonth(month);
  const next = addMonths(year, number, change);
  return String(next.year) + "-" + String(next.month).padStart(2, "0");
}

export function CourseCalendar({ month, previous, next, renderDay }: {
  month: string;
  previous: ReactNode;
  next: ReactNode;
  renderDay: (date: string) => ReactNode;
}) {
  const { year, month: number } = ymdToYearMonth(month);
  const weekdays = courseMonthDates(month).filter((_, index) => index % 7 < 5);
  const firstWeek = Math.floor(weekdays.findIndex(Boolean) / 5) * 5;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        {previous}
        <h3 className="text-center font-extrabold text-[#123947]" aria-live="polite">{monthLabelDe(year, number)}</h3>
        {next}
      </div>
      <div className="grid grid-cols-5 gap-1 text-center">
        {WEEKDAY_HEADERS_DE.slice(0, 5).map((day) => <span key={day} className="pb-1 text-xs font-bold text-slate-600">{day}</span>)}
        {weekdays.slice(firstWeek).map((date, index) =>
          date ? <div key={date}>{renderDay(date)}</div> : <div key={"empty-" + index} aria-hidden="true" />,
        )}
      </div>
    </div>
  );
}
