"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { PARTNER_LAST_LOGIN_PASSWORD_FOR_CHANGE_KEY } from "@/lib/partner/password-prompt-session";

type Props = { token: string };

/** Falsches Partnerkonto: Session löschen und zum Login mit Zurückspring auf den Einladungslink. */
export function PartnerInviteReauthClient({ token }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const loginWithReturn = `/partner/login?next=${encodeURIComponent(`/partner/team/einladung/${encodeURIComponent(token)}`)}`;

  return (
    <div className="mt-6 space-y-4 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-4 text-sm text-amber-950">
      <p className="font-medium">Falsche Anmeldung für diese Einladung</p>
      <p className="leading-relaxed text-amber-900/95">
        Sie sind mit einem anderen Partnerkonto angemeldet als für diese E-Mail-Einladung vorgesehen. Bitte melden Sie sich
        ab und danach mit dem Zugang an, zu dem die Einladungsmail gesendet wurde.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setPending(true);
          void (async () => {
            try {
              const supabase = createSupabaseBrowserClient();
              await supabase.auth.signOut();
              try {
                window.sessionStorage.removeItem(PARTNER_LAST_LOGIN_PASSWORD_FOR_CHANGE_KEY);
              } catch {
                /* ignore */
              }
            } catch {
              /* Session ggf. schon ungültig */
            }
            router.push(loginWithReturn);
            setPending(false);
          })();
        }}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3d52] disabled:opacity-60"
      >
        {pending ? "Wird abgemeldet…" : "Abmelden und richtiges Konto anmelden"}
      </button>
    </div>
  );
}
