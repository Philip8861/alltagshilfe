"use client";

import { useState, FormEvent } from "react";

/**
 * Lead-Magnet: Pflegegrad-Checkliste per E-Mail.
 * TODO: Newsletter/CRM/API anbinden (z. B. Brevo, Mailchimp, eigenes API-Route mit Rate-Limit & Zod).
 */
export function PflegegradBeantragenLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Kein echter Versand – nur UI-Feedback
    setSent(true);
  }

  if (sent) {
    return (
      <div
        className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-6 text-center text-[#0F4F68] shadow-sm"
        role="status"
        aria-live="polite"
      >
        <p className="text-base font-semibold">Vielen Dank!</p>
        <p className="mt-2 text-sm text-neutral-700">
          Die Checkliste steht Ihnen in Kürze per E-Mail zur Verfügung (sobald der Versand
          angebunden ist). Bis dahin nutzen Sie gern die kompakte Checkliste direkt auf dieser
          Seite.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#0F4F68]/15 bg-white p-6 shadow-md sm:p-8"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="lead-name" className="mb-1 block text-sm font-medium text-[#0F4F68]">
            Name <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="lead-name"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[#0F4F68] outline-none ring-[#0F4F68]/20 transition focus:ring-2"
            placeholder="Vor- und Nachname"
          />
        </div>
        <div className="sm:col-span-1">
          <label htmlFor="lead-email" className="mb-1 block text-sm font-medium text-[#0F4F68]">
            E-Mail <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[#0F4F68] outline-none ring-[#0F4F68]/20 transition focus:ring-2"
            placeholder="name@beispiel.de"
          />
        </div>
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="w-full rounded-full bg-[#F47C20] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#e06d15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68] sm:w-auto"
        >
          Checkliste kostenlos erhalten
        </button>
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        Mit Ihrer Anmeldung stimmen Sie der Verarbeitung Ihrer Daten zum Versand der Checkliste zu.
        Keine Weitergabe an Dritte zu Werbezwecken.
      </p>
    </form>
  );
}
