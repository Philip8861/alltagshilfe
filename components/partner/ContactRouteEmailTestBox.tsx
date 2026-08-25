"use client";

import { useActionState } from "react";
import {
  sendContactRouteTestEmailsAction,
  type ContactRouteTestEmailsState,
} from "@/lib/actions/system-admin";

const initial: ContactRouteTestEmailsState = { ok: false, message: "" };

export function ContactRouteEmailTestBox() {
  const [state, action, pending] = useActionState(sendContactRouteTestEmailsAction, initial);

  const showMsg =
    typeof state.message === "string" && state.message.trim().length > 0 ? state.message : null;

  return (
    <div className="mb-8 rounded-2xl border border-dashed border-amber-500/35 bg-amber-50/60 p-4 sm:p-5">
      <h3 className="text-base font-bold text-[#0F4F68]">Kontakt-Routing testen</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Sendet je eine <strong>Test-E-Mail</strong> über alle internen Kontaktwege (Kontakt, Hilfe-Finder,
        Landingpage, Ratgeber, Karriere, Kooperation, Pflegebox …). Betreff beginnt mit{" "}
        <strong>[ROUTING-TEST]</strong>. Wird <strong>nicht</strong> in der Statistik gezählt.
      </p>
      <form action={action} className="mt-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-amber-600/35 bg-white px-4 py-2.5 text-sm font-semibold text-amber-900 hover:bg-amber-100/70 disabled:opacity-60"
        >
          {pending ? "Test-Mails werden gesendet…" : "Alle Kontaktwege testen"}
        </button>
      </form>
      {showMsg ? (
        <p
          className={`mt-3 whitespace-pre-wrap text-sm font-medium ${state.ok ? "text-emerald-800" : "text-red-800"}`}
          role="status"
        >
          {showMsg}
        </p>
      ) : null}
    </div>
  );
}
