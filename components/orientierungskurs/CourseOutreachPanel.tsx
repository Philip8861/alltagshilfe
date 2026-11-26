"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { documentCourseEmployerOutreach, sendCourseOutreachReminder } from "@/lib/actions/orientierungskurs";
import type { CourseOutreach } from "@/lib/orientierungskurs/outreach";
import { CourseField, courseCard, courseField, courseSecondary } from "./ui";

const labels = {
  sent: "Versendet", failed: "Fehlgeschlagen", sending: "Wird versendet", unconfirmed: "Versand unklar",
};
const dateFormat = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin", dateStyle: "medium", timeStyle: "short",
});
const dayFormat = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", dateStyle: "medium" });
const matchLabels = { link: "Einladungslink", email: "E-Mail-Adresse", domain: "Firmendomain" };

function unknownAfterTimeout(status: CourseOutreach["reminder_status"], timestamp: string | null) {
  return status === "unconfirmed" || (status === "sending" && timestamp !== null &&
    Date.now() - new Date(timestamp).getTime() > 5 * 60_000);
}

export function CourseOutreachPanel({ entries, dashboardPath, today }: {
  entries: CourseOutreach[] | null; dashboardPath: string; today: string;
}) {
  const [search, setSearch] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const [reminderResult, setReminderResult] = useState<{ email: string; ok: boolean; message: string }>();
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(20);
  const matching = entries?.filter((entry) => {
    if (!entry.email.includes(search.trim().toLowerCase())) return false;
    if (filter === "booked") return Boolean(entry.booked_registration_code);
    if (filter === "due") return entry.due && (entry.reminder_status === null || entry.reminder_status === "failed");
    if (filter === "problem") return entry.status === "failed" || unknownAfterTimeout(entry.status, entry.updated_at) ||
      entry.reminder_status === "failed" || unknownAfterTimeout(entry.reminder_status, entry.reminder_at);
    return true;
  });

  function remind(email: string) {
    startTransition(async () => {
      try {
        setReminderResult({ email, ...await sendCourseOutreachReminder(email) });
      } catch {
        setReminderResult({ email, ok: false, message: "Der Versandstatus der Erinnerung ist unklar." });
      }
    });
  }

  function record(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      try {
        const response = await documentCourseEmployerOutreach({
          email: String(data.get("email")), note: String(data.get("note") ?? ""),
          sentDate: String(data.get("sentDate") ?? "") || undefined,
        });
        setResult(response);
        if (response.ok) form.reset();
      } catch {
        setResult({ ok: false, message: "Der Eintrag konnte nicht bestätigt werden." });
      }
    });
  }

  return (
    <section id="versandprotokoll" className={courseCard + " scroll-mt-8"}>
      <h2 className="text-xl font-extrabold text-[#123947]">Versandprotokoll und Buchungsstatus</h2>
      <form onSubmit={record} className="mt-4 space-y-3" aria-busy={pending}>
        <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-2">
          <legend className="mb-2 font-bold">Früheren Versand nachtragen</legend>
          <CourseField label="Bereits kontaktierte E-Mail-Adresse" name="email" type="email" required maxLength={254} />
          <CourseField label="Versanddatum (falls bekannt)" name="sentDate" type="date" />
          <CourseField label="Notiz (optional)" name="note" maxLength={400} placeholder="z. B. Datum oder Rückmeldung" />
        </fieldset>
        <button type="submit" className={courseSecondary} disabled={pending}>
          {pending ? "Wird dokumentiert …" : "Als versendet dokumentieren"}
        </button>
        {result && <p role={result.ok ? "status" : "alert"} className="text-sm font-semibold">{result.message}</p>}
      </form>
      {matching ? (
        <div className="mt-5 space-y-3 border-t border-[#cfe2e7] pt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold">
              E-Mail-Adresse suchen
              <input type="search" value={search} className={courseField} onChange={(event) => {
                setSearch(event.target.value);
                setVisibleCount(20);
              }} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Status filtern
              <select className={courseField} value={filter} onChange={(event) => {
                setFilter(event.target.value);
                setVisibleCount(20);
              }}>
                <option value="all">Alle Einträge</option>
                <option value="booked">Kurs gebucht</option>
                <option value="due">Erinnerung fällig</option>
                <option value="problem">Versandprobleme</option>
              </select>
            </label>
          </div>
          {matching.length === 0 ? <p className="text-sm">Keine passenden Einträge.</p> : (
            <ul className="divide-y divide-[#cfe2e7]">
              {matching.slice(0, visibleCount).map((entry) => {
                const uncertain = unknownAfterTimeout(entry.status, entry.updated_at);
                return (
                  <li key={entry.email} className="grid gap-1 break-words py-3 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,1.2fr)] sm:gap-3">
                    <div className="min-w-0"><strong>{entry.email}</strong>{entry.note && <p>{entry.note}</p>}</div>
                    <div>
                      <p className={entry.status === "failed" || uncertain ? "text-red-800" : ""}>
                        {uncertain ? labels.unconfirmed : labels[entry.status]}{entry.source === "manual" && " · nachgetragen"}
                      </p>
                      <time className="text-slate-600" dateTime={entry.sent_at ?? entry.updated_at}>
                        {(entry.source === "manual" ? dayFormat : dateFormat).format(new Date(entry.sent_at ?? entry.updated_at))}
                      </time>
                    </div>
                    <div className="min-w-0 space-y-1">
                      {entry.booked_date && entry.booked_registration_code && entry.match_method ? (
                        <>
                          <Link className="font-bold text-[#0F4F68] underline" href={dashboardPath +
                            (entry.booked_date < today ? "?bereich=archiv&month=" : "?bereich=kurse&month=") + entry.booked_date.slice(0, 7) +
                            "&day=" + entry.booked_date + "#kurs-" + entry.booked_registration_code}>Kurs gebucht</Link>
                          <p>{entry.booked_company} · {entry.booked_contact}</p>
                          <p className="text-slate-600">{entry.booked_email} · Zuordnung über {matchLabels[entry.match_method]}</p>
                        </>
                      ) : entry.status === "sent" && <p>{entry.due ? "Noch keine Buchung nach 14 Tagen" : "Buchung offen"}</p>}
                      {entry.reminder_status && (
                        <p>{unknownAfterTimeout(entry.reminder_status, entry.reminder_at) ? "Versand der Erinnerung unklar" :
                          "Erinnerung " + labels[entry.reminder_status].toLowerCase()}
                          {entry.reminder_at && " · " + dateFormat.format(new Date(entry.reminder_at))}</p>
                      )}
                      {entry.due && (!entry.reminder_status || entry.reminder_status === "failed") && (
                        <button className={courseSecondary} type="button" disabled={pending}
                          onClick={() => remind(entry.email)}>Erinnerung versenden</button>
                      )}
                      {reminderResult?.email === entry.email && <p role={reminderResult.ok ? "status" : "alert"}>{reminderResult.message}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {visibleCount < matching.length && <button type="button" className={courseSecondary}
            onClick={() => setVisibleCount((count) => count + 20)}>Weitere Einträge anzeigen</button>}
        </div>
      ) : <p className="mt-4 text-sm" role="status">Das Versandprotokoll konnte nicht geladen werden.</p>}
    </section>
  );
}
