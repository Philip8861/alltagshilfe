"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { bookCourseInfoAppointment, getCourseInfoAvailability } from "@/lib/actions/orientierungskurs-infogespraech";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { infoAppointmentTimeLabel } from "@/lib/orientierungskurs/info-slots";
import { courseHoliday } from "@/lib/orientierungskurs/slots";
import type { CourseInfoAppointmentInput } from "@/lib/validations/orientierungskurs";
import {
  adjacentMonth, CourseCalendar, CourseField, CourseFormPrivacy, CourseHoneypot, courseButton, courseCard, courseSecondary,
} from "./ui";

type Availability = Awaited<ReturnType<typeof getCourseInfoAvailability>>;

export function InfoAppointmentForm({ earliestDate }: { earliestDate: string }) {
  const [month, setMonth] = useState(earliestDate.slice(0, 7));
  const [calendar, setCalendar] = useState<Availability>();
  const [refresh, setRefresh] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [confirmation, setConfirmation] = useState<{ emailComplete: boolean }>();
  const [pending, startTransition] = useTransition();
  const request = useRef<CourseInfoAppointmentInput | undefined>(undefined);
  const confirmationHeading = useRef<HTMLHeadingElement>(null);
  const confirmed = Boolean(confirmation);

  useEffect(() => {
    let active = true;
    getCourseInfoAvailability(month).then(
      (result) => { if (active) setCalendar(result); },
      () => { if (active) setCalendar({ ok: false, message: "Der Terminkalender ist gerade nicht verfügbar." }); },
    );
    return () => { active = false; };
  }, [month, refresh]);
  useEffect(() => {
    if (confirmed) confirmationHeading.current?.focus();
  }, [confirmed]);

  function changeMonth(delta: number) {
    setCalendar(undefined);
    setDate("");
    setTime("");
    setMessage("");
    setMonth(adjacentMonth(month, delta));
  }

  function send(input: CourseInfoAppointmentInput) {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await bookCourseInfoAppointment(input);
        if (result.ok) {
          setConfirmation(result);
          return;
        }
        setMessage(result.message);
        if (result.refresh) {
          setTime("");
          setCalendar(undefined);
          setRefresh((current) => current + 1);
        }
      } catch {
        setMessage("Die Buchung konnte gerade nicht bestätigt werden. Bitte versuchen Sie es erneut.");
      }
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!calendar?.ok || !calendar.times[date]?.includes(time)) return;
    const form = new FormData(event.currentTarget);
    const field = (name: string) => String(form.get(name) ?? "").trim();
    const details = {
      date, time, contactName: field("contactName"), email: field("email").toLowerCase(),
      phone: field("phone"), company: field("company"), website: field("website"),
    };
    const previous = request.current;
    const id = previous && JSON.stringify({ ...previous, id: "" }) === JSON.stringify({ ...details, id: "" })
      ? previous.id : crypto.randomUUID();
    request.current = { ...details, id };
    send(request.current);
  }

  const error = message && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{message}</p>;
  if (confirmation && request.current) {
    const { date: bookedDate, time: bookedTime, phone } = request.current;
    return (
      <div className={courseCard + " space-y-3"}>
        <h2 ref={confirmationHeading} tabIndex={-1} className="text-2xl font-extrabold text-[#123947]">Ihr Infogespräch ist gebucht</h2>
        <p className="font-bold">{formatDateLongDe(bookedDate)} · {infoAppointmentTimeLabel(bookedTime)}</p>
        <p>Zum Termin rufen wir Sie unter {phone} an.</p>
        <p>{confirmation.emailComplete ? "Die Bestätigung wurde per E-Mail versendet."
          : "Der Termin ist gespeichert. Sie können den offenen E-Mail-Versand hier erneut versuchen."}</p>
        {error}
        {!confirmation.emailComplete && (
          <button type="button" className={courseButton} disabled={pending} onClick={() => request.current && send(request.current)}>
            {pending ? "Wird versendet …" : "Offene E-Mails erneut versenden"}
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={courseCard + " space-y-5"} aria-busy={pending}>
      <div>
        <h2 className="text-2xl font-extrabold text-[#123947]">Tag und Uhrzeit wählen</h2>
        <p className="mt-2 text-sm text-slate-700">Montag bis Freitag von 08:00 bis 16:00 Uhr. Feiertage sind gesperrt.</p>
      </div>
      {error}
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <CourseCalendar month={month}
          previous={<button type="button" className={courseSecondary + " px-3"} aria-label="Vorheriger Monat"
            disabled={pending || month <= earliestDate.slice(0, 7)} onClick={() => changeMonth(-1)}>‹</button>}
          next={<button type="button" className={courseSecondary + " px-3"} aria-label="Nächster Monat"
            disabled={pending || month === "9999-12"} onClick={() => changeMonth(1)}>›</button>}
          renderDay={(day) => {
            const holiday = courseHoliday(day);
            return (
              <button type="button" aria-pressed={day === date} title={holiday}
                aria-label={formatDateLongDe(day) + (holiday ? ", " + holiday : "")}
                className={"min-h-11 w-full rounded-lg text-sm font-bold focus-visible:outline focus-visible:outline-2 disabled:text-slate-500 " +
                  (holiday ? "bg-amber-50" : day === date ? "bg-[#0F4F68] text-white" : "enabled:bg-[#edf6f8] enabled:text-[#0F4F68]")}
                disabled={pending || !calendar?.ok || !calendar.times[day]?.length}
                onClick={() => { setDate(day); setTime(""); }}>
                {Number(day.slice(-2))}
              </button>
            );
          }} />
        <div className="rounded-xl bg-[#f2f8f9] p-4">
          {!calendar && <p role="status">Freie Termine werden geladen …</p>}
          {calendar && !calendar.ok && (
            <>
              <p role="alert">{calendar.message}</p>
              <button type="button" className={courseSecondary + " mt-3"} onClick={() => {
                setCalendar(undefined);
                setRefresh((current) => current + 1);
              }}>Erneut laden</button>
            </>
          )}
          {calendar?.ok && !date && <p>Wählen Sie einen verfügbaren Tag im Kalender.</p>}
          {calendar?.ok && date && (
            <fieldset disabled={pending}>
              <legend className="mb-2 font-extrabold text-[#123947]">{formatDateLongDe(date)}</legend>
              <div className="grid grid-cols-2 gap-2">
                {calendar.times[date]?.map((slot) => (
                  <label key={slot} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#a8c6d1] bg-white px-2 text-sm font-bold text-[#0F4F68] has-[:checked]:bg-[#dbeef2]">
                    <input name="time" type="radio" value={slot} checked={slot === time} className="accent-[#0F4F68]"
                      onChange={() => setTime(slot)} />
                    {slot} Uhr
                  </label>
                ))}
              </div>
              {!calendar.times[date]?.length && <p>Für diesen Tag sind keine freien Termine verfügbar.</p>}
            </fieldset>
          )}
        </div>
      </div>

      <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-3 text-xl font-extrabold text-[#123947]">Ihre Kontaktdaten für den Rückruf</legend>
        <CourseField label="Vor- und Nachname" name="contactName" autoComplete="name" required maxLength={120} />
        <CourseField label="Firma (optional)" name="company" autoComplete="organization" maxLength={160} />
        <CourseField label="E-Mail-Adresse" name="email" type="email" autoComplete="email" required maxLength={254} />
        <CourseField label="Telefonnummer für den Rückruf" name="phone" type="tel" autoComplete="tel" required maxLength={40} />
        <CourseHoneypot />
      </fieldset>
      <CourseFormPrivacy />
      <button type="submit" className={courseButton} disabled={pending || !calendar?.ok || !calendar.times[date]?.includes(time)}>
        {pending ? "Wird gebucht …" : "Kostenloses Infogespräch buchen"}
      </button>
    </form>
  );
}
