"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { bookOrientationCourse, getCourseAvailability } from "@/lib/actions/orientierungskurs";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { COURSE_FORMAT_LABEL, courseHoliday, courseTimeLabel, type CourseFormat } from "@/lib/orientierungskurs/slots";
import { courseBookingSchema, type CourseBookingInput, type CourseContactSalutation } from "@/lib/validations/orientierungskurs";
import {
  adjacentMonth, CourseCalendar, CourseField, CourseFormPrivacy, CourseHoneypot, CourseSalutationField,
  courseButton, courseCard, courseField, courseSecondary,
} from "./ui";

const steps = ["Kursformat", "Tag und Zeit", "Übersicht und Buchung"];
const defaultContact = { company: "", firstName: "", lastName: "", email: "", phone: "", address: "", room: "", parking: "" };
type BookingSuccess = Extract<Awaited<ReturnType<typeof bookOrientationCourse>>, { ok: true }>;

export function BookingWizard({ earliestDate, onlineAvailable, outreachCode }: {
  earliestDate: string; onlineAvailable: boolean; outreachCode?: string;
}) {
  const [step, setStep] = useState(0);
  const [format, setFormat] = useState<CourseFormat | null>(null);
  const [month, setMonth] = useState(earliestDate.slice(0, 7));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [calendar, setCalendar] = useState<Awaited<ReturnType<typeof getCourseAvailability>>>();
  const [revision, setRevision] = useState(0);
  const [contact, setContact] = useState(defaultContact);
  const [salutation, setSalutation] = useState<CourseContactSalutation | "">("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<BookingSuccess>();
  const [pending, startTransition] = useTransition();
  const heading = useRef<HTMLHeadingElement>(null);
  const request = useRef<CourseBookingInput | null>(null);
  const focusNext = useRef(false);

  useEffect(() => {
    if (focusNext.current) {
      heading.current?.focus();
      focusNext.current = false;
    }
  }, [step, success]);

  useEffect(() => {
    if (step !== 1) return;
    let active = true;
    getCourseAvailability(month).then(
      (result) => { if (active) setCalendar(result); },
      () => { if (active) setCalendar({ ok: false, message: "Der Kurskalender ist gerade nicht verfügbar." }); },
    );
    return () => { active = false; };
  }, [step, month, revision]);

  function goTo(target: number) {
    setMessage("");
    focusNext.current = true;
    setStep(target);
  }

  function changeMonth(change: number) {
    setCalendar(undefined);
    setDate("");
    setTime("");
    setMonth(adjacentMonth(month, change));
  }

  function submit(input: CourseBookingInput) {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await bookOrientationCourse(input);
        if (!result.ok) {
          if (result.reloadCalendar) {
            setDate("");
            setTime("");
            setCalendar(undefined);
            setRevision((previous) => previous + 1);
            goTo(1);
          }
          setMessage(result.message);
          return;
        }
        focusNext.current = !success;
        setSuccess(result);
      } catch {
        setMessage("Die Buchung konnte gerade nicht bestätigt werden. Bitte versuchen Sie es erneut.");
      }
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!format || !salutation) return;
    const fields = new FormData(event.currentTarget);
    const { firstName, lastName, ...details } = contact;
    const input = {
      ...details, contactName: firstName.trim() + " " + lastName.trim(), contactGreeting: { salutation, lastName },
      date, time, format, website: String(fields.get("website") ?? ""), id: crypto.randomUUID(), outreachCode,
    };
    const parsed = courseBookingSchema.safeParse(input);
    if (!parsed.success) {
      setMessage(parsed.error.issues[0].message);
      return;
    }
    const previous = request.current;
    if (previous && JSON.stringify({ ...previous, id: input.id }) === JSON.stringify(parsed.data)) {
      submit(previous);
      return;
    }
    request.current = parsed.data;
    submit(parsed.data);
  }

  if (success) {
    const complete = success.invitationSent && success.confirmationSent;
    return (
      <div className={courseCard + " space-y-4"}>
        <h2 ref={heading} tabIndex={-1} className="text-2xl font-extrabold text-[#123947]">Ihr Termin ist gebucht</h2>
        <p className="font-bold">{formatDateLongDe(date)} · {courseTimeLabel(time)}</p>
        <p>{complete
          ? "Die Buchungsbestätigung und die Einladung zum Weiterleiten wurden per E-Mail versendet."
          : "Ihr Termin ist gespeichert. Der E-Mail-Versand ist noch offen. Sie können ihn hier erneut versuchen."}</p>
        <a className="block break-all font-bold text-[#0F4F68] underline" href={success.url}>Anmeldelink für Mitarbeitende öffnen</a>
        {message && <p role="alert" className="text-sm text-red-800">{message}</p>}
        {!complete && (
          <button className={courseButton} type="button" disabled={pending} onClick={() => request.current && submit(request.current)}>
            {pending ? "Wird versendet …" : "Offene E-Mails erneut versenden"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={courseCard}>
      <ol className="mb-5 grid grid-cols-3 gap-2 border-b border-[#cfe2e7] pb-4" aria-label="Buchungsschritte">
        {steps.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}
            className={"flex flex-col items-start gap-1 text-xs font-bold sm:flex-row sm:items-center sm:gap-2 sm:text-sm " + (index === step ? "text-[#0F4F68]" : "text-slate-600")}>
            <span className={"grid h-7 w-7 place-items-center rounded-full " + (index === step ? "bg-[#0F4F68] text-white" : "bg-[#e8f2f4]")}>{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <h2 ref={heading} tabIndex={-1} className="mb-4 text-2xl font-extrabold text-[#123947]">
        {["Wie soll der Kurs stattfinden?", "Wann soll der Kurs stattfinden?", "Prüfen Sie Ihren Termin"][step]}
      </h2>
      {message && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{message}</p>}

      {step === 0 && (
        <fieldset>
          <legend className="sr-only">Kursformat wählen</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["onsite", "online"] as const).map((option) => (
              <label key={option} className="flex min-h-24 items-start gap-3 rounded-xl border border-[#bdd4db] p-4 has-[:checked]:border-[#0F4F68] has-[:checked]:bg-[#eaf5f7] has-[:disabled]:opacity-60">
                <input type="radio" name="format" value={option} checked={format === option}
                  disabled={option === "online" && !onlineAvailable} onChange={() => setFormat(option)} className="mt-1 h-4 w-4 accent-[#0F4F68]" />
                <span>
                  <strong className="block text-[#123947]">{COURSE_FORMAT_LABEL[option]}</strong>
                  <span className="text-sm text-slate-700">{option === "onsite" ? "Empfohlen · in Ihrem Unternehmen"
                    : onlineAvailable ? "Teilnahme per Videokonferenz" : "Momentan nicht buchbar"}</span>
                </span>
              </label>
            ))}
          </div>
          <button type="button" className={courseButton + " mt-5"} disabled={!format} onClick={() => goTo(1)}>Weiter zur Terminwahl</button>
        </fieldset>
      )}

      {step === 1 && (
        <>
          <p className="mb-4 text-sm text-slate-700">Die Kurse finden montags bis freitags statt. Feiertage sind gesperrt. Alle Termine dauern zwei Stunden.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <CourseCalendar month={month}
              previous={<button type="button" className={courseSecondary + " px-3"} aria-label="Vorheriger Monat"
                disabled={month <= (calendar?.ok ? calendar.earliestDate : earliestDate).slice(0, 7)} onClick={() => changeMonth(-1)}>‹</button>}
              next={<button type="button" className={courseSecondary + " px-3"} aria-label="Nächster Monat"
                disabled={month === "9999-12"} onClick={() => changeMonth(1)}>›</button>}
              renderDay={(day) => {
                const holiday = courseHoliday(day);
                return (
                  <button type="button" className={"min-h-11 w-full rounded-lg text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 disabled:text-slate-500 " +
                    (holiday ? "bg-amber-50" : day === date ? "bg-[#0F4F68] text-white" : "enabled:bg-[#edf6f8] enabled:text-[#0F4F68] enabled:hover:bg-[#dbedf1]")}
                    disabled={Boolean(holiday) || !calendar?.ok || !calendar.times[day]?.length} title={holiday}
                    aria-pressed={day === date} aria-label={formatDateLongDe(day) + (holiday ? ", " + holiday : "")}
                    onClick={() => { setDate(day); setTime(""); }}>
                    {Number(day.slice(-2))}
                  </button>
                );
              }} />
            <div className="rounded-xl bg-[#f2f8f9] p-4">
              {!calendar && <p role="status">Freie Termine werden geladen …</p>}
              {calendar && !calendar.ok && (
                <>
                  <p role="status">{calendar.message}</p>
                  <button type="button" className={courseSecondary + " mt-3"} onClick={() => {
                    setCalendar(undefined);
                    setRevision((previous) => previous + 1);
                  }}>Erneut laden</button>
                </>
              )}
              {calendar?.ok && !date && <p>Wählen Sie einen verfügbaren Tag im Kalender.</p>}
              {calendar?.ok && date && (
                <fieldset>
                  <legend className="mb-3 font-bold text-[#123947]">{formatDateLongDe(date)}</legend>
                  <div className="flex flex-wrap gap-2">
                    {calendar.times[date]?.map((slot) => (
                      <label key={slot} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#a8c6d1] bg-white px-2 text-sm font-bold text-[#0F4F68] has-[:checked]:border-[#0F4F68] has-[:checked]:bg-[#dbeef2]">
                        <input type="radio" name="slot" value={slot} checked={time === slot}
                          onChange={() => setTime(slot)} className="accent-[#0F4F68]" />{courseTimeLabel(slot)}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className={courseSecondary} onClick={() => goTo(0)}>Zurück</button>
            <button type="button" className={courseButton} disabled={!calendar?.ok || !calendar.times[date]?.includes(time)}
              onClick={() => goTo(2)}>Weiter zur Übersicht</button>
          </div>
        </>
      )}

      {step === 2 && format && (
        <form onSubmit={onSubmit} className="space-y-4" aria-busy={pending}>
          <dl className="grid gap-3 rounded-xl bg-[#edf6f8] p-4 sm:grid-cols-2">
            <div><dt className="text-sm text-slate-600">Kursformat</dt><dd className="font-extrabold">{COURSE_FORMAT_LABEL[format]}</dd></div>
            <div><dt className="text-sm text-slate-600">Termin</dt><dd className="font-extrabold">{formatDateLongDe(date)} · {courseTimeLabel(time)}</dd></div>
          </dl>
          <fieldset disabled={pending} className="space-y-4">
            <legend className="font-extrabold text-[#123947]">Ihre Angaben</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <CourseField label="Firma" name="company" required autoComplete="organization" maxLength={160}
                value={contact.company} onChange={(event) => setContact({ ...contact, company: event.target.value })} />
              <CourseSalutationField value={salutation} onChange={setSalutation} />
              <CourseField label="Vorname der Ansprechperson" name="firstName" required pattern=".*\S.*"
                autoComplete="given-name" maxLength={39} value={contact.firstName}
                onChange={(event) => setContact({ ...contact, firstName: event.target.value })} />
              <CourseField label="Nachname der Ansprechperson" name="lastName" required pattern=".*\S.*"
                autoComplete="family-name" maxLength={80} value={contact.lastName}
                onChange={(event) => setContact({ ...contact, lastName: event.target.value })} />
              <CourseField label="E-Mail der Ansprechperson" type="email" name="email" required autoComplete="email" maxLength={254}
                value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} />
              <CourseField label="Telefonnummer" name="phone" type="tel" required autoComplete="tel" maxLength={40}
                value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} />
              {format === "onsite" && (
                <>
                  <CourseField label="Schulungsadresse (Straße, PLZ und Ort)" name="address" required maxLength={240}
                    value={contact.address} onChange={(event) => setContact({ ...contact, address: event.target.value })} />
                  <CourseField label="Schulungsraum" name="room" required maxLength={100}
                    value={contact.room} onChange={(event) => setContact({ ...contact, room: event.target.value })} />
                  <label className="grid gap-1.5 text-sm font-bold text-slate-800 sm:col-span-2">
                    Parkhinweis (optional)
                    <textarea className={courseField + " font-normal"} name="parking" rows={2} maxLength={300}
                      value={contact.parking} onChange={(event) => setContact({ ...contact, parking: event.target.value })} />
                  </label>
                </>
              )}
            </div>
            <CourseHoneypot />
          </fieldset>
          <CourseFormPrivacy />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={courseSecondary} disabled={pending} onClick={() => goTo(1)}>Zurück</button>
            <button type="submit" className={courseButton} disabled={pending}>{pending ? "Wird gebucht …" : "Termin buchen"}</button>
          </div>
        </form>
      )}
    </div>
  );
}
