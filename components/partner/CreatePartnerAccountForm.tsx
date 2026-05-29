"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import { PartnerCommissionRatesFields } from "@/components/partner/admin/PartnerCommissionRatesFields";
import {
  createPartnerUserAction,
  type CreatePartnerUserState,
} from "@/lib/actions/system-admin";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  PARTNER_RESPONSIBILITY_LABELS,
} from "@/lib/partner/responsibility-areas";

const initial: CreatePartnerUserState = { ok: false, message: "" };

export function CreatePartnerAccountForm() {
  const [state, formAction, pending] = useActionState(createPartnerUserAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [copiedPw, setCopiedPw] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setCopiedPw(false);
      setCopiedCode(false);
    }
  }, [state.ok]);

  const errorMessage = !state.ok && state.message ? state.message : null;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-6 space-y-6 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8"
    >
      <div>
        <h2 className="text-lg font-bold text-[#0F4F68]">Neues Partner-Konto anlegen</h2>
        <p className="mt-2 text-sm text-neutral-600">
          E-Mail ist der Login. Das Passwort wird automatisch erzeugt (8 Zeichen, Groß-/Kleinbuchstaben, Ziffer,
          Sonderzeichen). Nach dem Anlegen sehen Sie es hier einmalig; parallel senden wir eine Bestätigungs-Mail an
          die angegebene Partner-Adresse mit Login-Link und Zugangsdaten (Transport per TLS, wenn SMTP korrekt
          eingestellt ist).
        </p>
      </div>
      <PartnerAuthStatusBox
        message={errorMessage}
        pending={pending}
        successHighlight={state.ok ? state.message : null}
      />
      {state.ok && state.confirmationEmailSent === false ? (
        <div
          className="rounded-xl border border-amber-400/90 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          Hinweis: Die Bestätigungs-E-Mail wurde nicht gesendet — SMTP-Umgebung prüfen. Zugangsdaten unten kopieren und
          dem Partner sicher mitteilen.
        </div>
      ) : null}
      {state.ok ? (
        <div
          className="rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-4 text-sm text-amber-950 shadow-sm"
          role="region"
          aria-label="Generiertes Passwort"
        >
          <p className="font-semibold">Einmalig sichtbar: Zugangspasswort</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              readOnly
              value={state.generatedPassword}
              className="w-full min-w-0 flex-1 rounded-lg border border-amber-200/90 bg-white px-3 py-2 font-mono text-sm text-neutral-900"
              aria-label="Generiertes Passwort"
            />
            <button
              type="button"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52]"
              onClick={() => {
                void navigator.clipboard.writeText(state.generatedPassword);
                setCopiedPw(true);
                window.setTimeout(() => setCopiedPw(false), 2500);
              }}
            >
              {copiedPw ? "Kopiert" : "Kopieren"}
            </button>
          </div>
          <p className="mt-4 font-semibold">Einmalig sichtbar: Partner-Code</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              readOnly
              value={state.referralCode}
              className="w-full min-w-0 flex-1 rounded-lg border border-amber-200/90 bg-white px-3 py-2 font-mono text-lg font-bold tracking-widest text-neutral-900"
              aria-label="Partner-Code"
            />
            <button
              type="button"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#0F4F68]/30 bg-white px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
              onClick={() => {
                void navigator.clipboard.writeText(state.referralCode);
                setCopiedCode(true);
                window.setTimeout(() => setCopiedCode(false), 2500);
              }}
            >
              {copiedCode ? "Kopiert" : "Code kopieren"}
            </button>
          </div>
        </div>
      ) : null}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-[#0F4F68]">
          Anrede <span className="text-red-700">*</span>
        </legend>
        <p className="text-xs text-neutral-500">Für die Begrüßung im Partnerportal („Willkommen, Herr/Frau …“).</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="salutation" value="herr" required disabled={pending} className="h-4 w-4" />
            Herr
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="salutation" value="frau" disabled={pending} className="h-4 w-4" />
            Frau
          </label>
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="new-partner-email" className="block text-sm font-semibold text-[#0F4F68]">
            E-Mail <span className="text-red-700">*</span>
          </label>
          <input
            id="new-partner-email"
            name="email"
            type="email"
            required
            autoComplete="off"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="new-partner-first" className="block text-sm font-semibold text-[#0F4F68]">
            Vorname <span className="text-red-700">*</span>
          </label>
          <input
            id="new-partner-first"
            name="first_name"
            type="text"
            required
            autoComplete="off"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="new-partner-last" className="block text-sm font-semibold text-[#0F4F68]">
            Nachname <span className="text-red-700">*</span>
          </label>
          <input
            id="new-partner-last"
            name="last_name"
            type="text"
            required
            autoComplete="off"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="new-partner-phone" className="block text-sm font-semibold text-[#0F4F68]">
            Telefonnummer <span className="text-red-700">*</span>
          </label>
          <input
            id="new-partner-phone"
            name="phone"
            type="tel"
            required
            autoComplete="off"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <h3 className="text-sm font-semibold text-[#0F4F68]">Bankverbindung für Auszahlungen</h3>
          <p className="mt-1 text-xs text-neutral-500">
            Für die monatliche Überweisung der Provisionen. Leer lassen und später im Partner bearbeiten möglich.
          </p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="new-partner-iban" className="block text-sm font-semibold text-[#0F4F68]">
            IBAN <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="new-partner-iban"
            name="iban"
            type="text"
            inputMode="text"
            autoComplete="off"
            disabled={pending}
            spellCheck={false}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 font-mono text-sm text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
            placeholder="DE89 …"
          />
        </div>
        <div>
          <label htmlFor="new-partner-bic" className="block text-sm font-semibold text-[#0F4F68]">
            BIC <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="new-partner-bic"
            name="bic"
            type="text"
            autoComplete="off"
            disabled={pending}
            spellCheck={false}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 font-mono text-sm text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="new-partner-acc-holder" className="block text-sm font-semibold text-[#0F4F68]">
            Kontoinhaber <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="new-partner-acc-holder"
            name="account_holder"
            type="text"
            autoComplete="name"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="new-partner-org" className="block text-sm font-semibold text-[#0F4F68]">
            Zugehörige Firma <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="new-partner-org"
            name="organization_name"
            type="text"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="new-partner-referral-code" className="block text-sm font-semibold text-[#0F4F68]">
            Geworben durch Partner-Code <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="new-partner-referral-code"
            name="referral_partner_code"
            type="text"
            disabled={pending}
            spellCheck={false}
            autoComplete="off"
            inputMode="text"
            placeholder="z. B. AA1234"
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 font-mono uppercase text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
          <p className="mt-1 text-xs text-neutral-600">
            Wenn dieser Partner durch eine Kollegin oder einen Kollegen geworben wurde, hier den Partner-Code eintragen.
            Die Beziehung wird einmalig fest gespeichert und kann später nicht mehr geändert werden.
          </p>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-semibold text-[#0F4F68]">Zuständigkeitsbereich</legend>
          <p className="mt-1 text-xs text-neutral-500">Mehrfachauswahl möglich.</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {PARTNER_RESPONSIBILITY_SLUGS.map((slug) => (
              <li key={slug}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 text-sm hover:border-[#0F4F68]/30">
                  <input
                    type="checkbox"
                    name="responsibility_areas"
                    value={slug}
                    disabled={pending}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
                  />
                  <span className="text-neutral-800">{PARTNER_RESPONSIBILITY_LABELS[slug]}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-[#0F4F68]">Rolle</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="role" value="partner" defaultChecked disabled={pending} className="h-4 w-4" />
            Partner
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="role" value="admin" disabled={pending} className="h-4 w-4" />
            Admin (Datenbank-Rolle; Zugang zur Verwaltung weiter nur mit System-Login)
          </label>
        </div>
      </fieldset>
      <PartnerCommissionRatesFields disabled={pending} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60"
      >
        {pending ? "Wird angelegt…" : "Konto anlegen"}
      </button>
    </form>
  );
}
