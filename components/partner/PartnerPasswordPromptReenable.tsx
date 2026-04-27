"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPartnerPasswordPromptSuppressAction } from "@/lib/actions/partner-password-prompt";
import { PARTNER_PASSWORD_PROMPT_SESSION_KEY } from "@/lib/partner/password-prompt-session";

export function PartnerPasswordPromptReenable() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="partner-dash-animate rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-[#0F4F68] sm:text-lg">Hinweis zum Passwortwechsel</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Sie haben den Hinweis zum Ändern Ihres Erstpassworts dauerhaft ausgeblendet. Sie können ihn wieder aktivieren —
        der Dialog erscheint dann erneut nach dem nächsten Laden des Partnerportals (sofern Sie Ihr Passwort noch nicht
        geändert haben).
      </p>
      {message ? (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            const res = await setPartnerPasswordPromptSuppressAction(false);
            if (!res.ok) {
              setMessage(res.message);
              return;
            }
            try {
              window.sessionStorage.removeItem(PARTNER_PASSWORD_PROMPT_SESSION_KEY);
            } catch {
              /* ignore */
            }
            router.refresh();
          });
        }}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#0F4F68]/5 disabled:opacity-60"
      >
        {pending ? "Speichern…" : "Hinweis wieder anzeigen"}
      </button>
    </div>
  );
}
