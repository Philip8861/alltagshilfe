import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerLoginForm } from "@/components/partner/PartnerLoginForm";
import { getPartnerSession } from "@/lib/partner/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function PartnerLoginPage() {
  const configured = isSupabaseConfigured();
  const session = configured ? await getPartnerSession() : null;

  if (session?.profile) {
    redirect("/partner/dashboard");
  }

  return (
    <article>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Kooperationspartner</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">Partner-Login</h1>
      <p className="mt-4 max-w-2xl text-neutral-600">
        Melden Sie sich an, um Fortschritte und abgeschlossene Konfigurationen einzusehen. Zugänge werden von
        Alltagshilfe-Süd vergeben.
      </p>

      {!configured ? (
        <div
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950"
          role="status"
        >
          <p className="font-semibold">Hinweis für Entwicklung / Test</p>
          <p className="mt-2">
            Supabase ist noch nicht konfiguriert. Tragen Sie{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code> und{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
            <code className="rounded bg-white/80 px-1">.env.local</code> ein und führen Sie das SQL aus{" "}
            <code className="rounded bg-white/80 px-1">supabase/migrations/001_partner_portal.sql</code> aus.
          </p>
        </div>
      ) : (
        <PartnerLoginForm emailFieldLabel="E-Mail-Adresse (Anmeldename)" />
      )}

      <p className="mt-8 text-sm text-neutral-600">
        <Link href="/" className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]">
          Zur Startseite
        </Link>
      </p>
    </article>
  );
}
