"use client";

import { useActionState } from "react";
import {
  sendPartnerRegistrationTestEmailAction,
  type PartnerRegistrationTestEmailState,
} from "@/lib/actions/system-admin";

const initial: PartnerRegistrationTestEmailState = { ok: false, message: "" };

export function PartnerRegistrationEmailTestBox() {
  const [state, action, pending] = useActionState(sendPartnerRegistrationTestEmailAction, initial);

  const showMsg =
    typeof state.message === "string" && state.message.trim().length > 0 ? state.message : null;

  return (
    <div className="mb-8 rounded-2xl border border-dashed border-[#0F4F68]/28 bg-[#F2F9FA]/55 p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#0F4F68]">E-Mail-Design testen</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Sendet eine <strong>Vorschau</strong> der Registrierungsbestätigung (Beispieldaten, kein echtes Konto). Gleiche
        Gestaltung wie die Live-Mail.
      </p>
      <form action={action} className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="min-w-[min(100%,280px)] flex-1 text-sm font-medium text-neutral-800">
          Empfänger
          <input
            name="test_email"
            type="email"
            placeholder="philip.sonntag@web.de"
            defaultValue="philip.sonntag@web.de"
            disabled={pending}
            autoComplete="email"
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-[#0F4F68] focus:border-[#0F4F68]/35 focus:ring-2 disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl border border-[#0F4F68]/35 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#0F4F68]/8 disabled:opacity-60"
        >
          {pending ? "Wird gesendet…" : "Test-Mail senden"}
        </button>
      </form>
      {showMsg ? (
        <p
          className={`mt-3 text-sm font-medium ${state.ok ? "text-emerald-800" : "text-red-800"}`}
          role="status"
        >
          {showMsg}
        </p>
      ) : null}
    </div>
  );
}
