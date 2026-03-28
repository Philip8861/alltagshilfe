"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkPartnerLoginRateLimitAction } from "@/lib/actions/partner-auth";
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

  return (
    <form
      className={
        formClassName ??
        "mt-6 w-full space-y-5 rounded-2xl border border-[#0F4F68]/12 bg-[#fafcfd] p-6 shadow-inner sm:rounded-2xl sm:p-7"
      }
      onSubmit={(e) => {
        e.preventDefault();
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
      <button
        type="submit"
        disabled={disabled || pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#0F4F68]/25 transition hover:bg-[#0c3d52] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Anmeldung…" : "Anmelden"}
      </button>
    </form>
  );
}
