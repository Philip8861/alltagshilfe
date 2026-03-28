"use client";

import { useActionState } from "react";
import { partnerLoginAction, type PartnerLoginState } from "@/lib/actions/partner-auth";

const initial: PartnerLoginState = { ok: true };

export function PartnerLoginForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(partnerLoginAction, initial);

  return (
    <form action={formAction} className="mt-8 max-w-md space-y-5 rounded-2xl border border-[#0F4F68]/12 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="partner-email" className="block text-sm font-semibold text-[#0F4F68]">
          E-Mail
        </label>
        <input
          id="partner-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="partner-password" className="block text-sm font-semibold text-[#0F4F68]">
          Passwort
        </label>
        <input
          id="partner-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      {!state.ok ? (
        <p className="text-sm font-medium text-[#b42318]" role="alert">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Anmeldung…" : "Anmelden"}
      </button>
    </form>
  );
}
