"use client";

import { useState, useTransition } from "react";
import { checkPartnerPasswordChangeRateLimitAction } from "@/lib/actions/partner-auth";
import { PartnerAuthStatusBox } from "@/components/partner/PartnerAuthStatusBox";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { partnerPasswordChangeSchema } from "@/lib/validations/partner-settings";

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
      <div>
        <label htmlFor="pw-current" className="block text-sm font-semibold text-[#0F4F68]">
          Aktuelles Passwort
        </label>
        <input
          id="pw-current"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
          className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="pw-new" className="block text-sm font-semibold text-[#0F4F68]">
          Neues Passwort
        </label>
        <input
          id="pw-new"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={pending}
          className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
        <p className="mt-1 text-xs text-neutral-500">Mindestens 10 Zeichen, Buchstabe und Ziffer.</p>
      </div>
      <div>
        <label htmlFor="pw-confirm" className="block text-sm font-semibold text-[#0F4F68]">
          Neues Passwort wiederholen
        </label>
        <input
          id="pw-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          disabled={pending}
          className="mt-1.5 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
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
