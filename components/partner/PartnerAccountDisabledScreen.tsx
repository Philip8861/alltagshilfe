"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  PARTNER_LAST_LOGIN_PASSWORD_FOR_CHANGE_KEY,
  PARTNER_PASSWORD_PROMPT_SESSION_KEY,
} from "@/lib/partner/password-prompt-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Vollflächiger Hinweis, wenn das Partnerkonto admin-seitig deaktiviert wurde (Migration 025).
 * Kein Zugang zu Navigation oder Inhalten des Portals.
 */
export function PartnerAccountDisabledScreen() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const signOutAndLeave = () => {
    setPending(true);
    void (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        try {
          window.sessionStorage.removeItem(PARTNER_LAST_LOGIN_PASSWORD_FOR_CHANGE_KEY);
          window.sessionStorage.removeItem(PARTNER_PASSWORD_PROMPT_SESSION_KEY);
        } catch {
          /* ignore */
        }
      } catch {
        /* Session ggf. schon ungültig */
      }
      router.refresh();
      router.push("/partner/login");
      setPending(false);
    })();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-neutral-900/45 p-4 backdrop-blur-[2px] sm:items-center">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="acct-dis-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xl"
      >
        <div
          className="h-1 w-full bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]/40"
          aria-hidden
        />
        <div className="px-5 py-6 sm:px-7 sm:py-8">
          <h1 id="acct-dis-title" className="text-lg font-bold text-[#0F4F68] sm:text-xl">
            Konto deaktiviert
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            Ihr Konto wurde deaktiviert. Bitte wenden Sie sich an den Support.
          </p>
          <button
            type="button"
            disabled={pending}
            onClick={signOutAndLeave}
            className="mt-6 flex w-full min-h-12 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3d52] disabled:opacity-60"
          >
            {pending ? "Abmelden…" : "Abmelden und zur Anmeldung"}
          </button>
        </div>
      </div>
    </div>
  );
}
