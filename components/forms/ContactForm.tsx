"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { submitContact } from "@/lib/actions/contact";
import { CONTACT_TOPICS, type ContactFormData } from "@/lib/validations/contact";
import { ContactSourceSelect } from "@/components/forms/ContactSourceSelect";
import { cn } from "@/lib/utils";
import {
  clearContactSubmissionContextStash,
  isNextjsRedirectError,
  stashContactFormSubmissionContext,
  trackFormStarted,
} from "@/lib/analytics/gtm-data-layer";

export type ContactFormProps = {
  /**
   * Signiertes Token (nur von Standort-UI gesetzt). Ohne Token: reines Zentral-Routing
   * wie auf /kontakt – manipulierte Hidden-Felder allein lösen kein Standort-CC aus.
   */
  standortContactProof?: string;
  /** Nur sinnvoll mit Proof: PLZ aus URL-Kontext, serverseitig gegen den Standort geprüft. */
  routingPlz?: string;
  /** Präfix für alle `id`/`htmlFor` (z. B. Modal auf derselben Seite). */
  fieldIdPrefix?: string;
  /** Thema fest als Hidden-Feld (kein Dropdown). */
  topicHidden?: boolean;
  hiddenTopic?: ContactFormData["topic"];
  /** Vorauswahl im Themen-Dropdown (nur wenn `topicHidden` nicht gesetzt). */
  defaultTopic?: ContactFormData["topic"];
  /** Vorbefüllter Nachrichtentext (Anwender kann ihn anpassen). */
  initialMessage?: string;
  /** Ausrichtung des Submit-Buttons: `"left"` (Standard) oder `"center"`. */
  submitAlign?: "left" | "center";
  /**
   * Nur `ratgeber`: setzt ein Hidden-Feld für die anonyme Statistik (Kanal „Ratgeber“).
   * Andere Werte sind unsinnig; Standard ist Kontaktseite / eingebettetes Formular ohne Kennzeichnung.
   */
  statsChannel?: "ratgeber";
};

export function ContactForm(props: ContactFormProps = {}) {
  const {
    standortContactProof,
    routingPlz,
    fieldIdPrefix = "",
    topicHidden = false,
    hiddenTopic = "Kooperation",
    defaultTopic,
    initialMessage,
    submitAlign = "left",
    statsChannel,
  } = props;
  const pathname = usePathname();
  const formInteractionTracked = useRef(false);
  const pid = (base: string) => (fieldIdPrefix ? `${fieldIdPrefix}${base}` : base);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isDatenschutzError = Boolean(error?.includes("Datenschutz"));

  /**
   * onSubmit + preventDefault statt action={…}: React 19 setzt Formulare nach erfülltem
   * Action-Promise zurück — auch bei { success: false }, wodurch alle Felder leer wurden.
   */
  function onFormFirstInteraction() {
    if (formInteractionTracked.current) return;
    formInteractionTracked.current = true;
    trackFormStarted({
      source_component: fieldIdPrefix ? `website_contact_form_${fieldIdPrefix.replace(/[^a-z0-9_-]/gi, "_")}` : "website_contact_form",
      contact_path: pathname || "website_contact",
      service: statsChannel === "ratgeber" ? "channel_ratgeber" : undefined,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setPending(true);
    try {
      const formData = new FormData(form);
      stashContactFormSubmissionContext(pathname, String(formData.get("topic") ?? ""));
      const result = await submitContact(formData);
      if (!result.success && result.error) {
        clearContactSubmissionContextStash();
        setError(result.error);
        if (result.error.includes("Datenschutz")) {
          const el = document.getElementById(pid("contact-datenschutz"));
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          window.requestAnimationFrame(() => el?.focus());
        }
      } else if (result.success) {
        clearContactSubmissionContextStash();
      }
    } catch (err) {
      if (isNextjsRedirectError(err)) {
        return;
      }
      clearContactSubmissionContextStash();
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onInput={onFormFirstInteraction}
      className={cn("relative isolate space-y-6")}
      noValidate
      aria-label="Kontaktformular"
      aria-busy={pending}
    >
      {pending ? (
        <div
          className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 rounded-xl bg-white/85 px-4 py-8 backdrop-blur-[2px] sm:py-10 pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          <span className="sr-only">Ihre Nachricht wird gesendet, bitte einen Moment warten.</span>
          <span
            className={cn(
              "inline-block h-11 w-11 shrink-0 rounded-full border-[3px] border-[#F78F2E]/25 border-t-[#F78F2E]",
              "motion-reduce:animate-none motion-reduce:border-[#F78F2E]",
              "animate-spin",
            )}
            aria-hidden
          />
          <span className="text-center text-sm font-semibold text-[#0F4F68]">
            Nachricht wird gesendet …
          </span>
        </div>
      ) : null}
      {standortContactProof ? (
        <>
          <input type="hidden" name="standortContactProof" value={standortContactProof} />
          {routingPlz ? <input type="hidden" name="routingPlz" value={routingPlz} /> : null}
        </>
      ) : null}
      {topicHidden ? <input type="hidden" name="topic" value={hiddenTopic} /> : null}
      {statsChannel === "ratgeber" ? (
        <input type="hidden" name="contactStatsChannel" value="ratgeber" />
      ) : null}
      {error && !isDatenschutzError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={pid("contact-vorname")} className="block text-sm font-medium text-neutral-700">
            Vorname *
          </label>
          <input
            id={pid("contact-vorname")}
            type="text"
            name="vorname"
            required
            autoComplete="given-name"
            disabled={pending}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="Ihr Vorname"
          />
        </div>
        <div>
          <label htmlFor={pid("contact-nachname")} className="block text-sm font-medium text-neutral-700">
            Nachname *
          </label>
          <input
            id={pid("contact-nachname")}
            type="text"
            name="nachname"
            required
            autoComplete="family-name"
            disabled={pending}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="Ihr Nachname"
          />
        </div>
      </div>

      <div>
        <label htmlFor={pid("contact-email")} className="block text-sm font-medium text-neutral-700">
          E-Mail *
        </label>
        <input
          id={pid("contact-email")}
          type="email"
          name="email"
          required
          autoComplete="email"
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="ihre@email.de"
        />
      </div>

      <div>
        <label htmlFor={pid("contact-phone")} className="block text-sm font-medium text-neutral-700">
          Telefonnummer
        </label>
        <input
          id={pid("contact-phone")}
          type="tel"
          name="phone"
          autoComplete="tel"
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="z. B. 08334 / 9893330"
        />
      </div>

      {!topicHidden ? (
        <div>
          <label htmlFor={pid("contact-topic")} className="block text-sm font-medium text-neutral-700">
            Zu welchem Thema wünschen Sie Beratung? *
          </label>
          <select
            id={pid("contact-topic")}
            name="topic"
            required
            disabled={pending}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            defaultValue={defaultTopic ?? ""}
            aria-required="true"
          >
            <option value="" disabled>
              Bitte wählen …
            </option>
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={pid("contact-website")}>Website</label>
        <input
          id={pid("contact-website")}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          placeholder="Website"
        />
      </div>

      <ContactSourceSelect id={pid("contact-source")} disabled={pending} />

      <div>
        <label htmlFor={pid("contact-message")} className="block text-sm font-medium text-neutral-700">
          Nachricht *
        </label>
        <textarea
          id={pid("contact-message")}
          name="message"
          required
          rows={5}
          disabled={pending}
          defaultValue={initialMessage ?? ""}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="Ihre Nachricht"
        />
      </div>

      <div
        className={cn(
          "rounded-xl p-4 transition-colors",
          isDatenschutzError
            ? "border-2 border-red-500 bg-red-50 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]"
            : "border-2 border-transparent",
        )}
      >
        {isDatenschutzError && (
          <p
            id={pid("contact-datenschutz-error")}
            role="alert"
            className="mb-3 text-sm font-semibold text-red-800"
          >
            {error}
          </p>
        )}
        <div className="flex items-start gap-3">
          <input
            id={pid("contact-datenschutz")}
            type="checkbox"
            name="datenschutz"
            required
            disabled={pending}
            value="on"
            onChange={() => {
              setError((prev) => (prev?.includes("Datenschutz") ? null : prev));
            }}
            className={cn(
              "mt-1 h-4 w-4 rounded text-[#0F4F68] focus:ring-[#0F4F68] disabled:opacity-50",
              isDatenschutzError
                ? "border-2 border-red-500 ring-2 ring-red-200"
                : "border-neutral-300",
            )}
            aria-describedby={
              isDatenschutzError
                ? `${pid("contact-datenschutz-hint")} ${pid("contact-datenschutz-error")}`
                : pid("contact-datenschutz-hint")
            }
            aria-invalid={isDatenschutzError}
            aria-required="true"
          />
          <label htmlFor={pid("contact-datenschutz")} className="text-sm text-neutral-700">
            <span id={pid("contact-datenschutz-hint")}>
              Ich habe die{" "}
              <Link
                href="/datenschutz"
                className="font-medium text-[#0F4F68] underline hover:no-underline"
              >
                Datenschutzerklärung
              </Link>{" "}
              gelesen und stimme der Verarbeitung meiner Daten zum Zweck der Kontaktaufnahme zu. *
            </span>
          </label>
        </div>
      </div>

      <div className={submitAlign === "center" ? "flex justify-center" : undefined}>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-[#0F4F68] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:opacity-50"
        >
          {pending ? "Wird gesendet …" : "Nachricht senden"}
        </button>
      </div>
    </form>
  );
}
