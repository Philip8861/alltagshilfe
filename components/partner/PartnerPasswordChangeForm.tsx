"use client";

import { useState, useTransition } from "react";
import { checkPartnerPasswordChangeRateLimitAction } from "@/lib/actions/partner-auth";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { partnerPasswordChangeSchema } from "@/lib/validations/partner-settings";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.4 10.4 0 0112 5c6.5 0 10 7 10 7a18.5 18.5 0 01-5.1 5.1M6.3 6.3C3.7 8.2 2 12 2 12s3.5 7 10 7a9.9 9.9 0 004.7-1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PasswordField({
  id,
  name,
  label,
  autoComplete,
  disabled,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  autoComplete: string;
  disabled: boolean;
  hint?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[#0F4F68]">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          disabled={disabled}
          className="w-full rounded-xl border border-neutral-200 py-3 pl-4 pr-12 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
          aria-pressed={visible}
          aria-label={visible ? `${label}: Eingabe verbergen` : `${label}: Eingabe anzeigen`}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

export function PartnerPasswordChangeForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        setSuccess(false);
        const fd = new FormData(e.currentTarget);
        const parsed = partnerPasswordChangeSchema.safeParse({
          currentPassword: fd.get("currentPassword"),
          newPassword: fd.get("newPassword"),
          confirmPassword: fd.get("confirmPassword"),
        });
        if (!parsed.success) {
          const first = parsed.error.flatten().fieldErrors;
          setMessage(
            first.currentPassword?.[0] ??
              first.newPassword?.[0] ??
              first.confirmPassword?.[0] ??
              "Bitte Eingaben prüfen.",
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
            const {
              data: { user },
              error: userErr,
            } = await supabase.auth.getUser();
            if (userErr || !user?.email) {
              setMessage("Sitzung ungültig. Bitte neu anmelden.");
              return;
            }
            const { error: signErr } = await supabase.auth.signInWithPassword({
              email: user.email,
              password: parsed.data.currentPassword,
            });
            if (signErr) {
              setMessage("Aktuelles Passwort ist nicht korrekt.");
              return;
            }
            const { error: updErr } = await supabase.auth.updateUser({
              password: parsed.data.newPassword,
            });
            if (updErr) {
              setMessage("Passwort konnte nicht geändert werden. Bitte Anforderungen von Supabase prüfen.");
              return;
            }
            const changedAt = new Date().toISOString();
            await supabase.from("partner_profiles").update({ password_changed_at: changedAt }).eq("id", user.id);
            (e.target as HTMLFormElement).reset();
            setSuccess(true);
            setMessage(null);
          } catch {
            setMessage("Unerwarteter Fehler. Bitte später erneut versuchen.");
          }
        });
      }}
    >
      <PartnerAuthStatusBox message={message} pending={pending} />
      {success ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          Passwort wurde geändert.
        </p>
      ) : null}
      <PasswordField
        id="pw-current"
        name="currentPassword"
        label="Aktuelles Passwort"
        autoComplete="current-password"
        disabled={pending}
      />
      <PasswordField
        id="pw-new"
        name="newPassword"
        label="Neues Passwort"
        autoComplete="new-password"
        disabled={pending}
        hint="Mindestens 6 Zeichen, mind. ein Buchstabe, eine Ziffer und ein Sonderzeichen."
      />
      <PasswordField
        id="pw-confirm"
        name="confirmPassword"
        label="Neues Passwort wiederholen"
        autoComplete="new-password"
        disabled={pending}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Speichern…" : "Passwort speichern"}
      </button>
    </form>
  );
}
