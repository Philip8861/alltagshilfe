"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import {
  checkPartnerLoginRateLimitAction,
  requestPartnerPasswordResetAction,
} from "@/lib/actions/partner-auth";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { partnerLoginSchema } from "@/lib/validations/partner";
import { resolvePartnerLoginToEmail } from "@/lib/partner/resolve-partner-login-email";

type PartnerLoginFormProps = {
  disabled?: boolean;
  loginFieldLabel?: string;
  formClassName?: string;
};

export function PartnerLoginForm({
  disabled,
  loginFieldLabel = "Anmeldename oder E-Mail",
  formClassName,
}: PartnerLoginFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetLogin, setResetLogin] = useState("");
  const [resetFeedback, setResetFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [resetSending, setResetSending] = useState(false);

  const sendPasswordResetLink = useCallback(() => {
    setResetFeedback(null);
    const fd = new FormData();
    fd.set("reset_login", resetLogin);
    void (async () => {
      setResetSending(true);
      try {
        const result = await requestPartnerPasswordResetAction(null, fd);
        setResetFeedback({ ok: result.ok, text: result.message });
      } finally {
        setResetSending(false);
      }
    })();
  }, [resetLogin]);

  return (
    <form
      className={
        formClassName ??
        "mt-6 w-full space-y-5 rounded-2xl border border-[#0F4F68]/12 bg-[#fafcfd] p-6 shadow-inner sm:rounded-2xl sm:p-7"
      }
      onSubmit={(e) => {
        e.preventDefault();
        if (resetOpen) {
          return;
        }
        setMessage(null);
        const fd = new FormData(e.currentTarget);
        const parsed = partnerLoginSchema.safeParse({
          login: fd.get("login"),
          password: fd.get("password"),
        });
        if (!parsed.success) {
          const first = parsed.error.flatten().fieldErrors;
          setMessage(first.login?.[0] ?? first.password?.[0] ?? "Bitte Eingaben prüfen.");
          return;
        }

        const resolved = resolvePartnerLoginToEmail(parsed.data.login);
        if (!resolved.ok) {
          setMessage(resolved.message);
          return;
        }

        startTransition(async () => {
          const allowed = await checkPartnerLoginRateLimitAction();
          if (!allowed.ok) {
            setMessage(allowed.message);
            return;
          }
          try {
            const supabase = createSupabaseBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({
              email: resolved.email,
              password: parsed.data.password,
            });
            if (error) {
              setMessage("Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.");
              return;
            }
            if (typeof window !== "undefined") {
              window.location.assign("/partner/sync-profile");
            } else {
              router.push("/partner/sync-profile");
            }
          } catch {
            setMessage("Anmeldung fehlgeschlagen. Bitte später erneut versuchen.");
          }
        });
      }}
    >
      {!resetOpen ? (
        <>
          <PartnerAuthStatusBox message={message} pending={pending} />
          <div>
            <label htmlFor="partner-login" className="block text-sm font-semibold text-[#0F4F68]">
              {loginFieldLabel}
            </label>
            <input
              id="partner-login"
              name="login"
              type="text"
              autoComplete="username"
              required
              disabled={disabled || pending}
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="partner-password" className="block text-sm font-semibold text-[#0F4F68]">
              Passwort
            </label>
            <div className="relative mt-2">
              <input
                id="partner-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={disabled || pending}
                className="w-full rounded-xl border border-neutral-200 py-3 pl-4 pr-12 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#0F4F68]/70 transition hover:bg-[#0F4F68]/[0.08] hover:text-[#0F4F68] disabled:opacity-40"
                onClick={() => setShowPassword((v) => !v)}
                disabled={disabled || pending}
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
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

          <div className="flex flex-col items-center border-t border-[#0F4F68]/10 pt-4">
            <button
              type="button"
              className="text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52] disabled:opacity-50"
              disabled={disabled || pending}
              aria-expanded={false}
              onClick={() => {
                setResetOpen(true);
                setMessage(null);
                setResetFeedback(null);
              }}
            >
              Passwort vergessen?
            </button>
          </div>

          <button
            type="submit"
            disabled={disabled || pending}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#0F4F68]/25 transition hover:bg-[#0c3d52] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Anmeldung…" : "Anmelden"}
          </button>
        </>
      ) : (
        <div className="w-full space-y-4 text-left">
          <div className="flex justify-center border-b border-[#0F4F68]/10 pb-3">
            <button
              type="button"
              className="text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52] disabled:opacity-50"
              disabled={disabled || resetSending}
              onClick={() => {
                setResetOpen(false);
                setResetFeedback(null);
              }}
            >
              Zurück zur Anmeldung
            </button>
          </div>
          <p className="text-center text-sm font-semibold text-[#0F4F68]">Passwort zurücksetzen</p>
          <p className="text-center text-xs text-neutral-600 sm:text-sm">
            Wir senden Ihnen eine E-Mail mit einem sicheren Link. Dort legen Sie ein neues Passwort fest (kein Passwort
            wird per E-Mail mitgeteilt).
          </p>
          <div>
            <label htmlFor="partner-reset-login" className="block text-sm font-semibold text-[#0F4F68]">
              Anmeldename oder E-Mail
            </label>
            <input
              id="partner-reset-login"
              name="reset_login"
              type="text"
              autoComplete="username"
              value={resetLogin}
              onChange={(e) => setResetLogin(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!disabled && !resetSending) sendPasswordResetLink();
                }
              }}
              disabled={disabled || resetSending}
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
            />
          </div>
          {resetFeedback ? (
            <p
              className={`text-sm ${resetFeedback.ok ? "text-[#0F4F68]" : "text-red-700"}`}
              role={resetFeedback.ok ? "status" : "alert"}
            >
              {resetFeedback.text}
            </p>
          ) : null}
          <button
            type="button"
            disabled={disabled || resetSending}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#0F4F68]/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => sendPasswordResetLink()}
          >
            {resetSending ? "Wird gesendet…" : "Link per E-Mail anfordern"}
          </button>
        </div>
      )}
    </form>
  );
}
