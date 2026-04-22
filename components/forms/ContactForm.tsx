"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { submitContact } from "@/lib/actions/contact";
import { CONTACT_TOPICS } from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

export type ContactFormProps = {
  /**
   * Signiertes Token (nur von Standort-UI gesetzt). Ohne Token: reines Zentral-Routing
   * wie auf /kontakt – manipulierte Hidden-Felder allein lösen kein Standort-CC aus.
   */
  standortContactProof?: string;
  /** Nur sinnvoll mit Proof: PLZ aus URL-Kontext, serverseitig gegen den Standort geprüft. */
  routingPlz?: string;
};

export function ContactForm(props: ContactFormProps = {}) {
  const { standortContactProof, routingPlz } = props;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isDatenschutzError = Boolean(error?.includes("Datenschutz"));

  /**
   * onSubmit + preventDefault statt action={…}: React 19 setzt Formulare nach erfülltem
   * Action-Promise zurück — auch bei { success: false }, wodurch alle Felder leer wurden.
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setPending(true);
    try {
      const formData = new FormData(form);
      const result = await submitContact(formData);
      if (!result.success && result.error) {
        setError(result.error);
        if (result.error.includes("Datenschutz")) {
          const el = document.getElementById("contact-datenschutz");
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          window.requestAnimationFrame(() => el?.focus());
        }
      }
    } catch {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
      aria-label="Kontaktformular"
    >
      {standortContactProof ? (
        <>
          <input type="hidden" name="standortContactProof" value={standortContactProof} />
          {routingPlz ? <input type="hidden" name="routingPlz" value={routingPlz} /> : null}
        </>
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
          <label htmlFor="contact-vorname" className="block text-sm font-medium text-neutral-700">
            Vorname *
          </label>
          <input
            id="contact-vorname"
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
          <label htmlFor="contact-nachname" className="block text-sm font-medium text-neutral-700">
            Nachname *
          </label>
          <input
            id="contact-nachname"
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
        <label htmlFor="contact-email" className="block text-sm font-medium text-neutral-700">
          E-Mail *
        </label>
        <input
          id="contact-email"
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
        <label htmlFor="contact-phone" className="block text-sm font-medium text-neutral-700">
          Telefonnummer
        </label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          autoComplete="tel"
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="z. B. 08334 / 9893330"
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className="block text-sm font-medium text-neutral-700">
          Zu welchem Thema wünschen Sie Beratung? *
        </label>
        <select
          id="contact-topic"
          name="topic"
          required
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          defaultValue=""
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

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          placeholder="Website"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-neutral-700">
          Nachricht *
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          disabled={pending}
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
            id="contact-datenschutz-error"
            role="alert"
            className="mb-3 text-sm font-semibold text-red-800"
          >
            {error}
          </p>
        )}
        <div className="flex items-start gap-3">
          <input
            id="contact-datenschutz"
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
                ? "contact-datenschutz-hint contact-datenschutz-error"
                : "contact-datenschutz-hint"
            }
            aria-invalid={isDatenschutzError}
            aria-required="true"
          />
          <label htmlFor="contact-datenschutz" className="text-sm text-neutral-700">
            <span id="contact-datenschutz-hint">
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

      <div>
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
