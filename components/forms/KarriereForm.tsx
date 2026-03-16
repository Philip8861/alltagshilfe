"use client";

import { useState } from "react";
import Link from "next/link";
import { submitKarriere } from "@/lib/actions/karriere";
import { KARRIERE_STELLENANGEBOTE } from "@/lib/validations/karriere";

export function KarriereForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      const result = await submitKarriere(formData);
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="mt-6 w-full max-w-full space-y-4 border-t border-[#0F4F68]/15 pt-6 text-left"
      noValidate
      aria-label="Bewerbungsformular Karriere"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="karriere-nachname" className="block text-sm font-medium text-neutral-700">
            Nachname *
          </label>
          <input
            id="karriere-nachname"
            type="text"
            name="nachname"
            required
            autoComplete="family-name"
            disabled={pending}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="Ihr Nachname"
          />
        </div>
        <div>
          <label htmlFor="karriere-vorname" className="block text-sm font-medium text-neutral-700">
            Vorname *
          </label>
          <input
            id="karriere-vorname"
            type="text"
            name="vorname"
            required
            autoComplete="given-name"
            disabled={pending}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="Ihr Vorname"
          />
        </div>
      </div>

      <div>
        <label htmlFor="karriere-email" className="block text-sm font-medium text-neutral-700">
          E-Mail *
        </label>
        <input
          id="karriere-email"
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
        <label htmlFor="karriere-phone" className="block text-sm font-medium text-neutral-700">
          Telefonnummer *
        </label>
        <input
          id="karriere-phone"
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="z. B. 08334 / 9893330"
        />
      </div>

      <div>
        <label htmlFor="karriere-stellenangebot" className="block text-sm font-medium text-neutral-700">
          Für welches Stellenangebot interessieren Sie sich? *
        </label>
        <select
          id="karriere-stellenangebot"
          name="stellenangebot"
          required
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          defaultValue=""
          aria-required="true"
        >
          <option value="" disabled>
            Bitte wählen …
          </option>
          {KARRIERE_STELLENANGEBOTE.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="karriere-website">Website</label>
        <input
          id="karriere-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          placeholder="Website"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="karriere-agbs"
          type="checkbox"
          name="agbs"
          required
          disabled={pending}
          value="on"
          className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68] disabled:opacity-50"
          aria-describedby="karriere-agbs-hint"
          aria-required="true"
        />
        <label htmlFor="karriere-agbs" className="text-sm text-neutral-700">
          <span id="karriere-agbs-hint">
            Ich habe die{" "}
            <Link
              href="/impressum"
              className="font-medium text-[#0F4F68] underline hover:no-underline"
            >
              AGB
            </Link>{" "}
            gelesen und akzeptiert. *
          </span>
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[#0F4F68] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:opacity-50"
        >
          {pending ? "Wird gesendet …" : "Bewerbung absenden"}
        </button>
      </div>
    </form>
  );
}
