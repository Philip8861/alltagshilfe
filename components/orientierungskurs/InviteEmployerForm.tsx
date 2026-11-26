"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { inviteCourseEmployer } from "@/lib/actions/orientierungskurs";
import { CourseField, courseButton, courseCard, courseField } from "./ui";

export function InviteEmployerForm() {
  const [email, setEmail] = useState("");
  const [salutation, setSalutation] = useState<"" | "frau" | "herr">("");
  const [lastName, setLastName] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const [pending, startTransition] = useTransition();
  const request = useRef<Parameters<typeof inviteCourseEmployer>[0] | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    const recipient = salutation ? { salutation, lastName: lastName.trim() } : undefined;
    if (recipient && !recipient.lastName) {
      setResult({ ok: false, message: "Bitte geben Sie den Nachnamen für die Anrede an." });
      return;
    }
    const input = request.current?.email === address && request.current.recipient?.salutation === recipient?.salutation &&
      request.current.recipient?.lastName === recipient?.lastName ? request.current : { email: address, recipient, id: crypto.randomUUID() };
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
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold text-[#0F4F68]">Persönliche Anrede (optional)</summary>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 font-bold text-slate-800">
              Anrede
              <select className={courseField + " font-normal"} value={salutation} disabled={pending} onChange={(event) => {
                const value = event.target.value;
                setSalutation(value === "frau" || value === "herr" ? value : "");
              }}>
                <option value="">Allgemeine Anrede</option>
                <option value="frau">Frau</option>
                <option value="herr">Herr</option>
              </select>
            </label>
            <CourseField label="Nachname" name="lastName" maxLength={80}
              disabled={pending || !salutation} value={lastName} onChange={(event) => setLastName(event.target.value)} />
          </div>
        </details>
        <button type="submit" className={courseButton} disabled={pending}>{pending ? "Wird versendet …" : "Einladung versenden"}</button>
      </form>
      {result && <p role={result.ok ? "status" : "alert"} className={"mt-3 break-words text-sm font-bold " + (result.ok ? "text-emerald-800" : "text-red-800")}>{result.message}</p>}
    </section>
  );
}
