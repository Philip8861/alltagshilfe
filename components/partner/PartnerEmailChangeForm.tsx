"use client";

import { useActionState, useEffect } from "react";
import { partnerRequestEmailChangeAction, type PartnerEmailChangeState } from "@/lib/actions/partner-email-change";

const initial: PartnerEmailChangeState = { ok: false, message: "" };

export function PartnerEmailChangeForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState(partnerRequestEmailChangeAction, initial);

  useEffect(() => {
    if (state.ok) {
      (document.getElementById("partner-email-form") as HTMLFormElement | null)?.reset();
    }
  }, [state.ok]);

  return (
    <form id="partner-email-form" action={formAction} className="space-y-4">
      <p className="text-sm text-neutral-600">
        Aktuelle Anmeldung: <span className="font-mono font-medium text-neutral-800">{currentEmail}</span>
      </p>
      {state.message ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            state.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="new_email" className="block text-sm font-semibold text-[#0F4F68]">
          Neue E-Mail-Adresse
        </label>
        <input
          id="new_email"
          name="new_email"
          type="email"
          autoComplete="email"
          required
          disabled={pending}
          className="mt-1.5 w-full max-w-md rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Sie erhalten ggf. eine Bestätigungs-E-Mail (je nach Supabase-Konfiguration).
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Senden…" : "E-Mail-Änderung anstoßen"}
      </button>
    </form>
  );
}
