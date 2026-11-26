"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { retryFollowupConfirmations, splitOrientationCourse } from "@/lib/actions/orientierungskurs-verwalten";
import { COURSE_PARTICIPANT_LIMIT, COURSE_TIMES, courseTimeLabel, earliestCourseDate } from "@/lib/orientierungskurs/slots";
import type { Participant } from "@/lib/orientierungskurs/store";
import { CourseField, courseButton, courseField, courseSecondary } from "./ui";

type SplitRequest = Parameters<typeof splitOrientationCourse>[0];

export function CourseSplitForm({ id, waiting, followup }: {
  id: string; waiting: Participant[]; followup: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const priorRequest = useRef<SplitRequest | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");
    const previous = priorRequest.current;
    const same = previous?.date === date && previous.time === time && previous.participantIds.join() === selected.join();
    const request = same ? previous : { sourceId: id, followupId: crypto.randomUUID(), date, time, participantIds: selected };
    priorRequest.current = request;
    startTransition(async () => {
      try {
        const response = await splitOrientationCourse(request);
        setResult(response);
        if (response.ok) {
          setOpen(false);
          setSelected([]);
          priorRequest.current = null;
        }
      } catch {
        setResult({ ok: false, message: "Der Folgetermin konnte nicht bestätigt werden. Versuchen Sie es erneut." });
      }
    });
  }

  return (
    <div className="space-y-3">
      {waiting.length > 0 && !open && <button type="button" className={courseSecondary} onClick={() => setOpen(true)}>Folgetermin anlegen</button>}
      {followup && <button type="button" disabled={pending} className={courseSecondary} onClick={() => startTransition(async () => {
        try {
          setResult(await retryFollowupConfirmations(id));
        } catch {
          setResult({ ok: false, message: "Bestätigungen konnten nicht geprüft werden." });
        }
      })}>Offene Teilnahmebestätigungen versenden</button>}
      {open && waiting.length > 0 && (
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-[#cfe2e7] p-3" aria-busy={pending}>
          <fieldset disabled={pending} className="space-y-3">
            <legend className="mb-2 font-extrabold text-[#123947]">Folgetermin für die Warteliste</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <CourseField label="Datum des Folgetermins" name="date" type="date" min={earliestCourseDate()} required />
              <label className="grid gap-1.5 text-sm font-bold">
                Uhrzeit des Folgetermins
                <select name="time" className={courseField} defaultValue="" required>
                  <option value="" disabled>Bitte wählen</option>
                  {COURSE_TIMES.map((time) => <option key={time} value={time}>{courseTimeLabel(time)}</option>)}
                </select>
              </label>
            </div>
            <p className="text-sm">Wählen Sie bis zu {COURSE_PARTICIPANT_LIMIT} Personen für den Folgetermin aus. Diese erhalten eine neue Teilnahmebestätigung.</p>
            <ul className="grid gap-1">
              {waiting.map((person) => (
                <li key={person.id}>
                  <label className="flex min-h-9 items-center gap-2 break-all text-sm">
                    <input type="checkbox" checked={selected.includes(person.id)}
                      disabled={!selected.includes(person.id) && selected.length >= COURSE_PARTICIPANT_LIMIT}
                      onChange={(event) => setSelected((current) => event.target.checked
                        ? [...current, person.id] : current.filter((value) => value !== person.id))} />
                    {person.first_name} {person.last_name} · {person.email}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={courseSecondary} disabled={pending} onClick={() => setOpen(false)}>Abbrechen</button>
            <button type="submit" className={courseButton} disabled={pending || !selected.length}>
              {pending ? "Wird angelegt …" : "Folgetermin buchen und Teilnehmende informieren"}
            </button>
          </div>
        </form>
      )}
      {result && <p role={result.ok ? "status" : "alert"} className="text-sm font-semibold">{result.message}</p>}
    </div>
  );
}
