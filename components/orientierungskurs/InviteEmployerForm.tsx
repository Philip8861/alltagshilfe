"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { inviteCourseEmployer } from "@/lib/actions/orientierungskurs";
import { CourseField, courseButton, courseCard } from "./ui";

export function InviteEmployerForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  const [pending, startTransition] = useTransition();
  const request = useRef<{ email: string; id: string } | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const recipient = email.trim().toLowerCase();
    const input = request.current?.email === recipient ? request.current : { email: recipient, id: crypto.randomUUID() };
    request.current = input;
    setResult(undefined);
    startTransition(async () => {
      try {
        const response = await inviteCourseEmployer(input);
        setResult(response);
        if (response.ok) {
          setEmail("");
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
      <p className="mt-1 text-sm text-slate-600">Die E-Mail enthält den Link, über den das Unternehmen seinen Termin bucht.</p>
      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" aria-busy={pending}>
        <div className="min-w-0 flex-1">
          <CourseField label="E-Mail-Adresse des Unternehmens" name="email" type="email" required maxLength={254}
            value={email} onChange={(event) => setEmail(event.target.value)} disabled={pending} />
        </div>
        <button type="submit" className={courseButton} disabled={pending}>{pending ? "Wird versendet …" : "Einladung versenden"}</button>
      </form>
      {result && <p role={result.ok ? "status" : "alert"} className={"mt-3 break-words text-sm font-bold " + (result.ok ? "text-emerald-800" : "text-red-800")}>{result.message}</p>}
    </section>
  );
}
