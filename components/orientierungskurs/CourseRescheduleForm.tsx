"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCourseRescheduleAvailability, rescheduleOrientationCourse } from "@/lib/actions/orientierungskurs-verwalten";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { courseHoliday, courseTimeLabel } from "@/lib/orientierungskurs/slots";
import { adjacentMonth, CourseCalendar, courseButton, courseSecondary } from "./ui";

type Availability = Awaited<ReturnType<typeof getCourseRescheduleAvailability>>;

export function CourseRescheduleForm({ id, code, revision, date, time, earliestDate }: {
  id: string; code: string; revision: number; date: string; time: string; earliestDate: string;
}) {
  const [open, setOpen] = useState(false);
  const earliestMonth = earliestDate.slice(0, 7);
  const [month, setMonth] = useState(date < earliestDate ? earliestMonth : date.slice(0, 7));
  const [selectedDate, setDate] = useState(date >= earliestDate ? date : "");
  const [selectedTime, setTime] = useState("");
  const [availability, setAvailability] = useState<Availability>();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [refresh, setRefresh] = useState(0);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!open) return;
    let current = true;
    getCourseRescheduleAvailability(id, month).then(
      (result) => { if (current) setAvailability(result); },
      () => { if (current) setAvailability({ ok: false, message: "Der Kurskalender ist gerade nicht verfügbar." }); },
    );
    return () => { current = false; };
  }, [id, month, open, refresh]);

  function changeMonth(delta: number) {
    setAvailability(undefined);
    setDate("");
    setTime("");
    setMonth((value) => adjacentMonth(value, delta));
  }

  const times = availability?.ok ? availability.times[selectedDate]?.filter((slot) =>
    selectedDate !== date || slot !== time.slice(0, 5)) ?? [] : [];

  function move() {
    setError("");
    startTransition(async () => {
      try {
        const result = await rescheduleOrientationCourse({ id, revision, date: selectedDate, time: selectedTime });
        if (result.ok) {
          setOpen(false);
          router.push(path + "?bereich=kurse&month=" + selectedDate.slice(0, 7) +
            "&day=" + selectedDate + "&verschoben=1#kurs-" + code);
        } else {
          setError(result.message);
          setAvailability(undefined);
          setRefresh((value) => value + 1);
        }
      } catch {
        setError("Die Verschiebung konnte gerade nicht bestätigt werden.");
      }
    });
  }

  if (!open) return <button type="button" className={courseSecondary} onClick={() => setOpen(true)}>Termin verschieben</button>;

  return (
    <section className="space-y-3 rounded-xl border border-[#cfe2e7] p-3" aria-busy={pending}>
      <h4 className="font-extrabold text-[#123947]">Neuen Termin wählen</h4>
      {error && <p className="text-sm font-semibold text-red-800" role="alert">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <CourseCalendar month={month}
          previous={<button type="button" className={courseSecondary + " px-3"} aria-label="Vorheriger Monat im Verschiebekalender"
            disabled={pending || month <= earliestMonth} onClick={() => changeMonth(-1)}>‹</button>}
          next={<button type="button" className={courseSecondary + " px-3"} aria-label="Nächster Monat im Verschiebekalender"
            disabled={pending || month >= "9999-12"} onClick={() => changeMonth(1)}>›</button>}
          renderDay={(day) => {
            const holiday = courseHoliday(day);
            const slots = availability?.ok ? availability.times[day] : undefined;
            const selectable = slots?.some((slot) => day !== date || slot !== time.slice(0, 5));
            return (
              <button type="button" className={"min-h-11 w-full rounded-lg text-sm font-bold disabled:text-slate-500 " +
                (day === selectedDate && selectable ? "bg-[#0F4F68] text-white" : "enabled:bg-[#edf6f8] enabled:text-[#0F4F68]")}
                disabled={pending || !selectable || Boolean(holiday)} aria-label={formatDateLongDe(day) + (holiday ? ", " + holiday : "")}
                aria-pressed={day === selectedDate} onClick={() => { setDate(day); setTime(""); }}>
                {Number(day.slice(-2))}
              </button>
            );
          }} />
        <div className="rounded-xl bg-[#f2f8f9] p-3">
          {!availability ? <p role="status">Freie Termine werden geladen …</p> : !availability.ok ? (
            <>
              <p role="status">{availability.message}</p>
              <button type="button" className={courseSecondary + " mt-2"} onClick={() => {
                setAvailability(undefined);
                setRefresh((value) => value + 1);
              }}>Erneut laden</button>
            </>
          ) : !times.length ? <p>Wählen Sie einen verfügbaren Tag.</p> : (
            <fieldset disabled={pending} className="flex flex-wrap gap-2">
              <legend className="mb-2 text-sm font-bold">{formatDateLongDe(selectedDate)}</legend>
              {times.map((slot) => (
                <label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#a8c6d1] bg-white px-2 text-sm font-bold" key={slot}>
                  <input type="radio" name={"reschedule-" + id} value={slot} checked={selectedTime === slot}
                    className="accent-[#0F4F68]" onChange={() => setTime(slot)} />
                  {courseTimeLabel(slot)}
                </label>
              ))}
            </fieldset>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-700">Bereits verschickte Einladungen und Aushänge zeigen den bisherigen Termin.</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={courseSecondary} disabled={pending} onClick={() => setOpen(false)}>Abbrechen</button>
        <button type="button" className={courseButton} disabled={pending || !times.includes(selectedTime)} onClick={move}>
          {pending ? "Wird verschoben …" : "Neuen Termin speichern"}
        </button>
      </div>
    </section>
  );
}
