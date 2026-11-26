"use client";

import { useState, useTransition, type FormEvent } from "react";
import { archiveOrientationCourse, editOrientationCourse } from "@/lib/actions/orientierungskurs-verwalten";
import { COURSE_TIMES, courseTimeLabel, type CourseFormat } from "@/lib/orientierungskurs/slots";
import type { Booking } from "@/lib/orientierungskurs/store";
import type { CourseContactSalutation } from "@/lib/validations/orientierungskurs";
import { CourseField, CourseSalutationField, courseButton, courseField, courseSecondary } from "./ui";

type EditableBooking = Pick<Booking, "id" | "revision" | "slot_date" | "slot_time" | "format" |
  "company" | "contact_name" | "contact_salutation" | "contact_last_name" | "contact_email" | "contact_phone" |
  "address" | "room" | "parking">;

export function CourseManageForm({ course, onlineAvailable }: { course: EditableBooking; onlineAvailable: boolean }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [format, setFormat] = useState<CourseFormat>(course.format);
  const [salutation, setSalutation] = useState<CourseContactSalutation | "">(course.contact_salutation ?? "unknown");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; message: string }>();

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!salutation) return;
    const fields = new FormData(event.currentTarget);
    const field = (name: string) => String(fields.get(name) ?? "");
    setStatus(undefined);
    startTransition(async () => {
      try {
        const details = {
          id: course.id, date: field("date"), time: field("time"),
          company: field("company"), contactName: field("contactName"), email: field("email"), phone: field("phone"),
          contactGreeting: { salutation, lastName: field("contactLastName") },
        };
        const input = format === "onsite"
          ? { ...details, format, address: field("address"), room: field("room"), parking: field("parking") }
          : { ...details, format };
        const result = await editOrientationCourse(input, course.revision);
        setStatus(result);
        if (result.ok) setEditing(false);
      } catch {
        setStatus({ ok: false, message: "Änderungen konnten gerade nicht bestätigt werden." });
      }
    });
  }

  function remove() {
    setStatus(undefined);
    startTransition(async () => {
      try {
        const result = await archiveOrientationCourse({ id: course.id, revision: course.revision });
        setStatus(result);
        if (result.ok) setConfirmDelete(false);
      } catch {
        setStatus({ ok: false, message: "Die Löschung konnte gerade nicht bestätigt werden." });
      }
    });
  }

  return (
    <div className="space-y-3">
      {status && <p role={status.ok ? "status" : "alert"} className={"text-sm font-bold " + (status.ok ? "text-emerald-800" : "text-red-800")}>{status.message}</p>}
      {!editing && !confirmDelete && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={courseSecondary} onClick={() => {
            setStatus(undefined);
            setFormat(course.format);
            setSalutation(course.contact_salutation ?? "unknown");
            setEditing(true);
          }}>Kurs bearbeiten</button>
          <button type="button" className={courseSecondary + " text-red-800"} onClick={() => {
            setStatus(undefined);
            setConfirmDelete(true);
          }}>Kurs löschen</button>
        </div>
      )}

      {editing && (
        <form onSubmit={save} aria-busy={pending} className="space-y-3 rounded-xl border border-[#cfe2e7] p-3">
          <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-3 font-extrabold text-[#123947]">Kurs bearbeiten</legend>
            <CourseField label="Kurstag" name="date" type="date" required defaultValue={course.slot_date} />
            <label className="grid gap-1.5 text-sm font-bold text-slate-800">
              Uhrzeit
              <select name="time" required defaultValue={course.slot_time.slice(0, 5)} className={courseField + " font-normal"}>
                {COURSE_TIMES.map((time) => <option key={time} value={time}>{courseTimeLabel(time)}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-800">
              Kursformat
              <select className={courseField + " font-normal"} value={format}
                onChange={(event) => setFormat(event.target.value === "online" ? "online" : "onsite")}>
                <option value="onsite">Vor Ort</option>
                <option value="online" disabled={!onlineAvailable && course.format !== "online"}>Online</option>
              </select>
            </label>
            <CourseField label="Firma" name="company" required maxLength={160} defaultValue={course.company} />
            <CourseField label="Ansprechperson" name="contactName" required maxLength={120} defaultValue={course.contact_name} />
            <CourseSalutationField value={salutation} onChange={setSalutation} />
            {salutation && salutation !== "unknown" && (
              <CourseField label="Nachname für die Anrede" name="contactLastName" required maxLength={80}
                defaultValue={course.contact_last_name ?? ""} />
            )}
            <CourseField label="E-Mail der Ansprechperson" name="email" type="email" required maxLength={254} defaultValue={course.contact_email} />
            <CourseField label="Telefonnummer" name="phone" type="tel" required maxLength={40} defaultValue={course.contact_phone} />
            {format === "onsite" && (
              <>
                <CourseField label="Schulungsadresse" name="address" required maxLength={240} defaultValue={course.address ?? ""} />
                <CourseField label="Schulungsraum" name="room" required maxLength={100} defaultValue={course.room ?? ""} />
                <label className="grid gap-1.5 text-sm font-bold text-slate-800 sm:col-span-2">
                  Parkhinweis (optional)
                  <textarea className={courseField + " font-normal"} name="parking" rows={2} maxLength={300} defaultValue={course.parking ?? ""} />
                </label>
              </>
            )}
          </fieldset>
          <p className="text-sm text-slate-600">Teilnahmelink und QR-Code bleiben gültig. Bereits verschickte E-Mails und Aushänge behalten ihre bisherigen Angaben.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={courseSecondary} onClick={() => setEditing(false)} disabled={pending}>Abbrechen</button>
            <button type="submit" className={courseButton} disabled={pending}>{pending ? "Wird gespeichert …" : "Änderungen speichern"}</button>
          </div>
        </form>
      )}

      {confirmDelete && (
        <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-950">Der Termin wird freigegeben und der Anmeldelink geschlossen. Die Kursdaten und Anmeldungen bleiben im Archiv verfügbar.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={courseSecondary} onClick={() => setConfirmDelete(false)} disabled={pending}>Abbrechen</button>
            <button type="button" className={courseButton + " bg-red-800 hover:bg-red-900"} onClick={remove} disabled={pending}>
              {pending ? "Wird gelöscht …" : "Kurs löschen und archivieren"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
