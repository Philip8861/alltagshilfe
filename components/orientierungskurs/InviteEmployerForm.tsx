"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { inviteCourseEmployer } from "@/lib/actions/orientierungskurs";
import { CourseField, courseButton, courseCard, courseField } from "./ui";

export function InviteEmployerForm() {
  const [email, setEmail] = useState("");
  const [salutation, setSalutation] = useState<"" | "frau" | "herr">("");
  const [lastName, setLastName] = useState("");
  const [nameUnknown, setNameUnknown] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const [pending, startTransition] = useTransition();
  const request = useRef<Parameters<typeof inviteCourseEmployer>[0] | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    const recipient = nameUnknown
      ? { kind: "unknown" as const }
      : salutation && lastName.trim() ? { kind: "named" as const, salutation, lastName: lastName.trim() } : null;
    if (!recipient) {
      setResult({ ok: false, message: "Bitte geben Sie Anrede und Nachname an oder wählen Sie „Nicht bekannt“." });
      return;
    }
    const previous = request.current;
    const input = previous?.email === address && JSON.stringify(previous.recipient) === JSON.stringify(recipient)
      ? previous : { email: address, recipient, id: crypto.randomUUID() };
    request.current = input;
    setResult(undefined);
    startTransition(async () => {
      try {
        const response = await inviteCourseEmployer(input);
        setResult(response);
        if (response.ok) {
          setEmail("");
          setSalutation("");
          setLastName("");
          setNameUnknown(false);
          request.current = null;
        }
      } catch {
        setResult({ ok: false, message: "Der Versand konnte nicht bestätigt werden. Bitte erneut versuchen." });
      }
    });
  }

  return (
    <section className={courseCard}>
      <h2 className="text-xl font-extrabold text-[#123947]">Buchungseinladung versenden</h2>
      <p className="mt-1 text-sm text-slate-600">Die E-Mail enthält den Kursflyer und Links zur Kursbuchung und zum Infogespräch.</p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3" aria-busy={pending}>
        <CourseField label="E-Mail-Adresse des Unternehmens" name="email" type="email" required maxLength={254}
          value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending} />
        <fieldset className="space-y-2 text-sm" disabled={pending}>
          <legend className="font-bold text-[#0F4F68]">Persönliche Anrede</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 font-bold text-slate-800">
              Anrede
              <select className={courseField + " font-normal disabled:bg-slate-100"} value={salutation}
                required={!nameUnknown} disabled={nameUnknown} onChange={(event) => {
                const value = event.target.value;
                setSalutation(value === "frau" || value === "herr" ? value : "");
              }}>
                <option value="" disabled>Bitte wählen</option>
                <option value="frau">Frau</option>
                <option value="herr">Herr</option>
              </select>
            </label>
            <CourseField label="Nachname" name="lastName" maxLength={80} required={!nameUnknown}
              disabled={nameUnknown} value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </div>
          <label className="inline-flex min-h-11 items-center gap-2 font-semibold text-slate-800">
            <input type="checkbox" checked={nameUnknown} onChange={(event) => setNameUnknown(event.target.checked)}
              className="h-4 w-4 accent-[#0F4F68]" />
            Nicht bekannt
          </label>
          {nameUnknown && <p className="text-slate-700">Die Einladung beginnt mit „Sehr geehrte Damen und Herren,“.</p>}
        </fieldset>
        <button type="submit" className={courseButton} disabled={pending}>{pending ? "Wird versendet …" : "Einladung versenden"}</button>
      </form>
      {result && <p role={result.ok ? "status" : "alert"} className={"mt-3 break-words text-sm font-bold " + (result.ok ? "text-emerald-800" : "text-red-800")}>{result.message}</p>}
    </section>
  );
}
