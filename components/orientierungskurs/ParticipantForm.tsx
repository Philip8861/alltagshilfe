"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { registerCourseParticipant } from "@/lib/actions/orientierungskurs";
import { COURSE_WAITLIST_MESSAGE } from "@/lib/orientierungskurs/slots";
import { type CourseParticipantInput } from "@/lib/validations/orientierungskurs";
import { CourseField, CourseFormPrivacy, CourseHoneypot, courseButton } from "./ui";

type Success = Extract<Awaited<ReturnType<typeof registerCourseParticipant>>, { ok: true }>;

export function ParticipantForm({ code, waitlist }: { code: string; waitlist: boolean }) {
  const [success, setSuccess] = useState<Success>();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const request = useRef<CourseParticipantInput | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const registered = Boolean(success);
  useEffect(() => { if (registered) heading.current?.focus(); }, [registered]);

  function submit(input: CourseParticipantInput) {
    setMessage("");
    startTransition(async () => {
      try {
        const result = await registerCourseParticipant(input);
        if (result.ok) setSuccess(result);
        else setMessage(result.message);
      } catch {
        setMessage("Die Anmeldung konnte gerade nicht bestätigt werden. Bitte versuchen Sie es erneut.");
      }
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = {
      code, firstName: String(form.get("firstName") ?? "").trim(), lastName: String(form.get("lastName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim().toLowerCase(), website: String(form.get("website") ?? ""),
    };
    const previous = request.current;
    const id = previous && previous.email === fields.email && previous.firstName === fields.firstName &&
      previous.lastName === fields.lastName ? previous.id : crypto.randomUUID();
    request.current = { ...fields, id };
    submit(request.current);
  }

  const alert = message && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">{message}</p>;
  if (success) {
    const onWaitlist = success.status === "waitlisted";
    return (
      <div className="space-y-3">
        <h2 ref={heading} tabIndex={-1} className="text-2xl font-extrabold text-[#123947]">
          {onWaitlist ? "Sie stehen auf der Warteliste" : "Ihre Anmeldung ist erfasst"}
        </h2>
        <p>{success.needsMailRetry
          ? "Ihre Anmeldung ist gespeichert. Der E-Mail-Versand kann hier erneut versucht werden."
          : onWaitlist ? "Wir haben Ihnen Ihren Wartelistenplatz per E-Mail bestätigt." :
            success.status === "existing" ? "Für diese E-Mail-Adresse wurde bereits eine Anmeldung erfasst." :
            "Die Teilnahmebestätigung enthält Ihre Kursdetails. Prüfen Sie Ihren Posteingang und den Spamordner."}</p>
        {alert}
        {success.needsMailRetry && (
          <button type="button" className={courseButton} disabled={pending} onClick={() => request.current && submit(request.current)}>
            {pending ? "Wird versendet …" : "Bestätigung erneut versenden"}
          </button>
        )}
      </div>
    );
  }
  return (
    <form className="space-y-4" onSubmit={onSubmit} aria-busy={pending}>
      {alert}
      {waitlist && <p className="rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-950">{COURSE_WAITLIST_MESSAGE}</p>}
      <fieldset disabled={pending} className="grid gap-3 sm:grid-cols-2">
        <legend className="mb-3 text-xl font-extrabold text-[#123947]">Ihre Kontaktdaten</legend>
        <CourseField label="Vorname" name="firstName" autoComplete="given-name" maxLength={80} required />
        <CourseField label="Nachname" name="lastName" autoComplete="family-name" maxLength={80} required />
        <div className="sm:col-span-2">
          <CourseField label="E-Mail-Adresse" name="email" type="email" autoComplete="email" maxLength={254} required />
        </div>
        <CourseHoneypot />
      </fieldset>
      <CourseFormPrivacy />
      <button type="submit" className={courseButton} disabled={pending}>
        {pending ? "Wird angemeldet …" : waitlist ? "Auf die Warteliste setzen lassen" : "Zur Teilnahme anmelden"}
      </button>
    </form>
  );
}
