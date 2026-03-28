import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerAuthModalShell } from "@/components/partner/PartnerAuthModalShell";
import { PartnerRegisterForm } from "@/components/partner/PartnerRegisterForm";
import { getPartnerSession } from "@/lib/partner/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function PartnerRegisterPage() {
  const configured = isSupabaseConfigured();
  const session = configured ? await getPartnerSession() : null;

  if (session?.profile) {
    redirect("/partner/dashboard");
  }

  return (
    <PartnerAuthModalShell titleId="partner-register-heading">
      <article>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Kooperationspartner</p>
        <h1
          id="partner-register-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl"
        >
          Partner-Registrierung
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
          Konto anlegen – das Partnerprofil wird automatisch angelegt (Supabase-Trigger).
        </p>

        {!configured ? (
          <div
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950 sm:mt-8"
            role="status"
          >
            <p className="font-semibold">Registrierung: Supabase fehlt noch</p>
            <p className="mt-2">
              Bitte <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code> und{" "}
              <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> setzen und Migration{" "}
              <code className="rounded bg-white/80 px-1">001_partner_portal.sql</code> ausführen (Trigger für
              automatisches Profil).
            </p>
          </div>
        ) : (
          <PartnerRegisterForm />
        )}

        <p className="mt-8 text-sm text-neutral-600">
          <Link
            href="/partner/login"
            className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
          >
            Bereits ein Konto? Zum Login
          </Link>
          {" · "}
          <Link href="/" className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]">
            Zur Startseite
          </Link>
        </p>
      </article>
    </PartnerAuthModalShell>
  );
}
