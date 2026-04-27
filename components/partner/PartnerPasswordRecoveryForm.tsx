"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkPartnerPasswordChangeRateLimitAction } from "@/lib/actions/partner-auth";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { partnerPasswordRecoverySchema } from "@/lib/validations/partner-settings";

export function PartnerPasswordRecoveryForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  return (
    <form
      className="mt-6 space-y-4 text-left"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        setSuccess(false);
        const fd = new FormData(e.currentTarget);
        const parsed = partnerPasswordRecoverySchema.safeParse({
          newPassword: fd.get("newPassword"),
          confirmPassword: fd.get("confirmPassword"),
        });
        if (!parsed.success) {
          const fe = parsed.error.flatten().fieldErrors;
          setMessage(
            fe.newPassword?.[0] ?? fe.confirmPassword?.[0] ?? "Bitte Eingaben prüfen.",
          );
          return;
        }

        startTransition(async () => {
          const allowed = await checkPartnerPasswordChangeRateLimitAction();
          if (!allowed.ok) {
            setMessage(allowed.message);
            return;
          }
          try {
            const supabase = createSupabaseBrowserClient();
            const { error } = await supabase.auth.updateUser({ password: parsed.data.newPassword });
            if (error) {
              setMessage("Passwort konnte nicht gespeichert werden. Bitte erneut den Link aus der E-Mail verwenden.");
              return;
            }
            setSuccess(true);
            if (typeof window !== "undefined") {
              window.location.assign("/partner/sync-profile");
            } else {
              router.push("/partner/sync-profile");
            }
          } catch {
            setMessage("Passwort konnte nicht gespeichert werden. Bitte später erneut versuchen.");
          }
        });
      }}
    >
      <PartnerAuthStatusBox message={message} pending={pending} />
      {success ? (
        <p className="text-sm font-medium text-[#0F4F68]">Passwort gespeichert. Sie werden weitergeleitet…</p>
      ) : (
        <>
          <div>
            <label htmlFor="recovery-new-pw" className="block text-sm font-semibold text-[#0F4F68]">
              Neues Passwort
            </label>
            <div className="relative mt-2">
              <input
                id="recovery-new-pw"
                name="newPassword"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                required
                disabled={pending}
                className="w-full rounded-xl border border-neutral-200 py-3 pl-4 pr-12 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#0F4F68]/70 transition hover:bg-[#0F4F68]/[0.08] disabled:opacity-40"
                onClick={() => setShowPw((v) => !v)}
                disabled={pending}
                aria-label={showPw ? "Neues Passwort verbergen" : "Neues Passwort anzeigen"}
                aria-pressed={showPw}
              >
                {showPw ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 9.88A3 3 0 0112 7c4 0 7 5 7 5a12.4 12.4 0 01-2.57 3.18M6.12 6.12A12.4 12.4 0 003 12s3 5 7 5c.94 0 1.83-.15 2.65-.42"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Mindestens 6 Zeichen, Buchstabe, Ziffer und Sonderzeichen.
            </p>
          </div>
          <div>
            <label htmlFor="recovery-confirm-pw" className="block text-sm font-semibold text-[#0F4F68]">
              Neues Passwort wiederholen
            </label>
            <div className="relative mt-2">
              <input
                id="recovery-confirm-pw"
                name="confirmPassword"
                type={showPw2 ? "text" : "password"}
                autoComplete="new-password"
                required
                disabled={pending}
                className="w-full rounded-xl border border-neutral-200 py-3 pl-4 pr-12 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#0F4F68]/70 transition hover:bg-[#0F4F68]/[0.08] disabled:opacity-40"
                onClick={() => setShowPw2((v) => !v)}
                disabled={pending}
                aria-label={showPw2 ? "Bestätigung verbergen" : "Bestätigung anzeigen"}
                aria-pressed={showPw2}
              >
                {showPw2 ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 9.88A3 3 0 0112 7c4 0 7 5 7 5a12.4 12.4 0 01-2.57 3.18M6.12 6.12A12.4 12.4 0 003 12s3 5 7 5c.94 0 1.83-.15 2.65-.42"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#0F4F68]/25 transition hover:bg-[#0c3d52] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Speichern…" : "Neues Passwort speichern"}
          </button>
        </>
      )}
    </form>
  );
}
