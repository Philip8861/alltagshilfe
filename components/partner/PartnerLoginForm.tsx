"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkPartnerLoginRateLimitAction } from "@/lib/actions/partner-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { partnerLoginSchema } from "@/lib/validations/partner";

type PartnerLoginFormProps = {
  disabled?: boolean;
  /** Standard: „E-Mail“; z. B. Startseite: Anmeldename-Hinweis (weiterhin E-Mail für Supabase). */
  emailFieldLabel?: string;
  formClassName?: string;
};

export function PartnerLoginForm({
  disabled,
  emailFieldLabel = "E-Mail",
  formClassName,
}: PartnerLoginFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className={
        formClassName ??
        "mt-8 max-w-md space-y-5 rounded-2xl border border-[#0F4F68]/12 bg-white p-6 shadow-sm sm:p-8"
      }
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        const fd = new FormData(e.currentTarget);
        const parsed = partnerLoginSchema.safeParse({
          email: fd.get("email"),
          password: fd.get("password"),
        });
        if (!parsed.success) {
          const first = parsed.error.flatten().fieldErrors;
          setMessage(first.email?.[0] ?? first.password?.[0] ?? "Bitte Eingaben prüfen.");
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
              email: parsed.data.email,
              password: parsed.data.password,
            });
            if (error) {
              setMessage("Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen.");
              return;
            }
            router.refresh();
            router.push("/partner/dashboard");
          } catch {
            setMessage("Anmeldung fehlgeschlagen. Bitte später erneut versuchen.");
          }
        });
      }}
    >
      <div>
        <label htmlFor="partner-email" className="block text-sm font-semibold text-[#0F4F68]">
          {emailFieldLabel}
        </label>
        <input
          id="partner-email"
          name="email"
          type="email"
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
        <input
          id="partner-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      {message ? (
        <p className="text-sm font-medium text-[#b42318]" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Anmeldung…" : "Anmelden"}
      </button>
    </form>
  );
}
