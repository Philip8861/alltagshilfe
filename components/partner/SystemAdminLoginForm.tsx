"use client";

import { useActionState } from "react";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import {
  systemAdminLoginAction,
  type SystemAdminLoginState,
} from "@/lib/actions/system-admin";

const initial: SystemAdminLoginState = { ok: true };

export function SystemAdminLoginForm({ disabled }: { disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(systemAdminLoginAction, initial);

  const message = !state.ok ? state.message : null;

  return (
    <form
      action={formAction}
      className="mt-6 w-full space-y-5 rounded-2xl border border-[#0F4F68]/10 bg-white/90 p-6 shadow-[0_4px_24px_rgba(15,79,104,0.06)] backdrop-blur-sm sm:rounded-3xl sm:p-8"
    >
      <PartnerAuthStatusBox message={message} pending={pending} />
      <div>
        <label htmlFor="sys-admin-user" className="block text-sm font-semibold text-[#0F4F68]">
          Benutzername
        </label>
        <input
          id="sys-admin-user"
          name="user"
          type="text"
          autoComplete="username"
          required
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="sys-admin-password" className="block text-sm font-semibold text-[#0F4F68]">
          Passwort
        </label>
        <input
          id="sys-admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#e67e22] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Anmeldung…" : "In die Verwaltung"}
      </button>
    </form>
  );
}
