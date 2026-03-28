"use client";

import { useActionState, useEffect, useRef } from "react";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import {
  createPartnerUserAction,
  type CreatePartnerUserState,
} from "@/lib/actions/system-admin";

const initial: CreatePartnerUserState = { ok: false, message: "" };

export function CreatePartnerAccountForm() {
  const [state, formAction, pending] = useActionState(createPartnerUserAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  const errorMessage = !state.ok && state.message ? state.message : null;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-6 space-y-5 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:rounded-3xl sm:p-8"
    >
      <h2 className="text-lg font-bold text-[#0F4F68]">Neues Partner-Konto anlegen</h2>
      <p className="text-sm text-neutral-600">
        Es wird ein Supabase-Nutzer mit Passwort erstellt (technisch mit E-Mail: Kurzname wird bei Bedarf mit der
        konfigurierten Domain ergänzt). Das Profil in{" "}
        <code className="rounded bg-neutral-100 px-1 text-xs">partner_profiles</code> legt der Datenbank-Trigger an.
        Passwort dem Partner sicher übermitteln (nicht per unverschlüsselter E-Mail).
      </p>
      <PartnerAuthStatusBox
        message={errorMessage}
        pending={pending}
        successHighlight={state.ok ? state.message : null}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="new-partner-login" className="block text-sm font-semibold text-[#0F4F68]">
            Anmeldename oder E-Mail
          </label>
          <input
            id="new-partner-login"
            name="login"
            type="text"
            required
            autoComplete="off"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="new-partner-password" className="block text-sm font-semibold text-[#0F4F68]">
            Initiales Passwort
          </label>
          <input
            id="new-partner-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="new-partner-org" className="block text-sm font-semibold text-[#0F4F68]">
            Organisation <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="new-partner-org"
            name="organization_name"
            type="text"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="new-partner-display" className="block text-sm font-semibold text-[#0F4F68]">
            Anzeigename <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="new-partner-display"
            name="display_name"
            type="text"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
          />
        </div>
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
            Admin (Rolle in der Datenbank; Verwaltung hier weiterhin nur mit System-Login)
          </label>
        </div>
      </fieldset>
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
