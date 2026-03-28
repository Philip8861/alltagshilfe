"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkPartnerRegisterRateLimitAction } from "@/lib/actions/partner-auth";
import { mapSupabaseRegisterError } from "@/lib/partner/map-register-error";
import { getAuthCallbackUrl } from "@/lib/partner/register-redirect";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { partnerRegisterSchema } from "@/lib/validations/partner";

type PartnerRegisterFormProps = {
  disabled?: boolean;
  formClassName?: string;
};

export function PartnerRegisterForm({ disabled, formClassName }: PartnerRegisterFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  if (successEmail) {
    return (
      <div
        className={
          formClassName ??
          "mt-8 max-w-md space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-6 text-sm text-emerald-950 shadow-sm sm:p-8"
        }
        role="status"
      >
        <p className="font-semibold">Fast geschafft</p>
        <p>
          Wir haben eine Bestätigungs-E-Mail an <strong className="font-semibold">{successEmail}</strong> gesendet.
          Bitte klicken Sie auf den Link in der E-Mail – danach können Sie sich anmelden.
        </p>
        <p className="text-neutral-700">
          Keine E-Mail erhalten? Prüfen Sie den Spam-Ordner oder wenden Sie sich an Alltagshilfe-Süd.
        </p>
        <p>
          <Link
            href="/partner/login"
            className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
          >
            Zum Partner-Login
          </Link>
        </p>
      </div>
    );
  }

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
        const display_name = String(fd.get("display_name") ?? "").trim();
        const organization_name = String(fd.get("organization_name") ?? "").trim();
        const parsed = partnerRegisterSchema.safeParse({
          email: fd.get("email"),
          password: fd.get("password"),
          passwordConfirm: fd.get("passwordConfirm"),
          display_name: display_name || undefined,
          organization_name: organization_name || undefined,
          datenschutz: fd.get("datenschutz"),
        });
        if (!parsed.success) {
          const first = parsed.error.flatten().fieldErrors;
          setMessage(
            first.email?.[0] ??
              first.password?.[0] ??
              first.passwordConfirm?.[0] ??
              first.datenschutz?.[0] ??
              first.display_name?.[0] ??
              first.organization_name?.[0] ??
              "Bitte Eingaben prüfen.",
          );
          return;
        }

        startTransition(async () => {
          const allowed = await checkPartnerRegisterRateLimitAction();
          if (!allowed.ok) {
            setMessage(allowed.message);
            return;
          }
          try {
            const supabase = createSupabaseBrowserClient();
            const redirectTo =
              typeof window !== "undefined" ? getAuthCallbackUrl(window.location.origin) : undefined;
            const meta = {
              data: {
                display_name: parsed.data.display_name,
                organization_name: parsed.data.organization_name,
              },
            };
            let { data, error } = await supabase.auth.signUp({
              email: parsed.data.email,
              password: parsed.data.password,
              options: { ...meta, emailRedirectTo: redirectTo },
            });
            const errMsg = (error?.message ?? "").toLowerCase();
            const redirectBlocked =
              Boolean(error) &&
              errMsg.includes("redirect") &&
              (errMsg.includes("not allowed") || errMsg.includes("invalid") || errMsg.includes("whitelist"));
            if (error && redirectBlocked) {
              ({ data, error } = await supabase.auth.signUp({
                email: parsed.data.email,
                password: parsed.data.password,
                options: meta,
              }));
            }
            if (error) {
              const hint = mapSupabaseRegisterError(error);
              const dev =
                process.env.NODE_ENV === "development" && error.message
                  ? ` Technisch: ${error.message}`
                  : "";
              setMessage(`${hint}${dev}`);
              return;
            }
            const user = data.user;
            const session = data.session;
            if (user && session) {
              const patch: { display_name?: string; organization_name?: string } = {};
              if (parsed.data.display_name) patch.display_name = parsed.data.display_name;
              if (parsed.data.organization_name) patch.organization_name = parsed.data.organization_name;
              if (Object.keys(patch).length > 0) {
                await supabase.from("partner_profiles").update(patch).eq("id", user.id);
              }
              router.refresh();
              router.push("/partner/dashboard");
              return;
            }
            setSuccessEmail(parsed.data.email);
          } catch {
            setMessage("Registrierung fehlgeschlagen. Bitte später erneut versuchen.");
          }
        });
      }}
    >
      <div>
        <label htmlFor="partner-reg-org" className="block text-sm font-semibold text-[#0F4F68]">
          Organisation / Betrieb <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <input
          id="partner-reg-org"
          name="organization_name"
          type="text"
          autoComplete="organization"
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="partner-reg-display" className="block text-sm font-semibold text-[#0F4F68]">
          Anzeigename <span className="font-normal text-neutral-500">(optional)</span>
        </label>
        <input
          id="partner-reg-display"
          name="display_name"
          type="text"
          autoComplete="name"
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="partner-reg-email" className="block text-sm font-semibold text-[#0F4F68]">
          E-Mail-Adresse
        </label>
        <input
          id="partner-reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div>
        <label htmlFor="partner-reg-password" className="block text-sm font-semibold text-[#0F4F68]">
          Passwort
        </label>
        <input
          id="partner-reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
        <p className="mt-1 text-xs text-neutral-500">Mindestens 8 Zeichen.</p>
      </div>
      <div>
        <label htmlFor="partner-reg-password2" className="block text-sm font-semibold text-[#0F4F68]">
          Passwort wiederholen
        </label>
        <input
          id="partner-reg-password2"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          disabled={disabled || pending}
          className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
      </div>
      <div className="flex gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
        <input
          id="partner-reg-dsgvo"
          name="datenschutz"
          type="checkbox"
          value="on"
          required
          disabled={disabled || pending}
          className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
        />
        <label htmlFor="partner-reg-dsgvo" className="text-sm text-neutral-700">
          Ich habe die{" "}
          <Link
            href="/datenschutz"
            className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung
          </Link>{" "}
          zur Kenntnis genommen.
        </label>
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
        {pending ? "Wird registriert…" : "Konto anlegen"}
      </button>
    </form>
  );
}
