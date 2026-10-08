"use client";

import { useId, useState, useTransition } from "react";
import { sendPartnerSupportRequestAction } from "@/lib/actions/partner-support";
import { PARTNER_SUPPORT_CONTACT_NAME, PARTNER_SUPPORT_TOPICS } from "@/lib/partner/partner-support-contact";

type Props = {
  /** Nach erfolgreichem Versand (z. B. Dialog schließen). */
  onDone?: () => void;
  /** Kompakter Abstand im Dialog. */
  compact?: boolean;
};

const fieldClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0F4F68] focus:ring-1 focus:ring-[#0F4F68] disabled:bg-neutral-50";

const MESSAGE_MAX = 3000;

export function PartnerSupportForm({ onDone, compact = false }: Props) {
  const uid = useId();
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    if (!topic) {
      setError({ message: "Bitte ein Thema wählen.", field: "topic" });
      return;
    }
    if (message.trim().length < 10) {
      setError({ message: "Bitte beschreiben Sie Ihr Anliegen etwas genauer (mindestens 10 Zeichen).", field: "message" });
      return;
    }
    startTransition(async () => {
      const r = await sendPartnerSupportRequestAction({ topic, message, phone, website: honeypot });
      if (!r.ok) {
        setError({ message: r.message, field: r.field });
        return;
      }
      setSent(true);
    });
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center px-2 py-6 text-center" role="status" aria-live="polite">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-4 text-lg font-semibold text-[#0F4F68]">Ihr Anliegen ist unterwegs</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">
          {PARTNER_SUPPORT_CONTACT_NAME} hat Ihre Nachricht erhalten und meldet sich in der Regel innerhalb eines
          Werktags per E-Mail oder Telefon bei Ihnen.
        </p>
        {onDone ? (
          <button
            type="button"
            onClick={onDone}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
          >
            Schließen
          </button>
        ) : null}
      </div>
    );
  }

  const topicId = `${uid}-topic`;
  const messageId = `${uid}-message`;
  const phoneId = `${uid}-phone`;
  const errorId = `${uid}-error`;

  return (
    <form onSubmit={submit} noValidate className={compact ? "relative space-y-4" : "relative space-y-5"}>
      {/* Honeypot: für Menschen unsichtbar, Bots füllen es aus. */}
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={topicId} className="block text-sm font-medium text-neutral-800">
          Worum geht es? <span className="text-red-600">*</span>
        </label>
        <select
          id={topicId}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={pending}
          required
          aria-invalid={error?.field === "topic" || undefined}
          aria-describedby={error?.field === "topic" ? errorId : undefined}
          className={fieldClass}
        >
          <option value="">Bitte wählen …</option>
          {PARTNER_SUPPORT_TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={messageId} className="block text-sm font-medium text-neutral-800">
            Ihre Nachricht <span className="text-red-600">*</span>
          </label>
          <span className="text-xs tabular-nums text-neutral-400" aria-hidden>
            {message.length}/{MESSAGE_MAX}
          </span>
        </div>
        <textarea
          id={messageId}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
          rows={compact ? 5 : 7}
          disabled={pending}
          required
          minLength={10}
          maxLength={MESSAGE_MAX}
          placeholder="Beschreiben Sie kurz Ihr Anliegen. Je konkreter, desto schneller können wir helfen."
          aria-invalid={error?.field === "message" || undefined}
          aria-describedby={error?.field === "message" ? errorId : undefined}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={phoneId} className="block text-sm font-medium text-neutral-800">
          Rückrufnummer <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <input
          id={phoneId}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={pending}
          placeholder="Falls Sie lieber angerufen werden möchten"
          aria-invalid={error?.field === "phone" || undefined}
          aria-describedby={error?.field === "phone" ? errorId : undefined}
          className={fieldClass}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error.message}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-neutral-500">
          Ihre Kontodaten (Name, Partner-Code, E-Mail) werden automatisch mitgesendet, damit {PARTNER_SUPPORT_CONTACT_NAME}{" "}
          Ihnen direkt antworten kann.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {pending ? (
            "Wird gesendet …"
          ) : (
            <>
              Anliegen senden
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
