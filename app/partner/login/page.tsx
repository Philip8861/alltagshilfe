import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerLoginForm } from "@/components/partner/PartnerLoginForm";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";
import { getPartnerSession } from "@/lib/partner/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Props = { searchParams: Promise<{ reason?: string }> };

export default async function PartnerLoginPage({ searchParams }: Props) {
  const configured = isSupabaseConfigured();
  const session = configured ? await getPartnerSession() : null;
  const { reason } = await searchParams;

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

      {(session && !session.profile) || reason === "no_profile" ? (
        <div
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950"
          role="status"
        >
          <p className="font-semibold">Angemeldet, aber kein Partnerprofil</p>
          <p className="mt-2">
            Das Supabase-Konto ist gültig, in der Tabelle{" "}
            <code className="rounded bg-white/80 px-1">partner_profiles</code> fehlt jedoch noch ein passender Eintrag.
            Häufig: Benutzer wurde angelegt, bevor die Migration mit Trigger lief – dann einmalig per SQL ergänzen.
          </p>
          <p className="mt-3 rounded-lg bg-white/70 p-3 font-mono text-xs text-neutral-800">
            insert into public.partner_profiles (id, role)
            <br />
            values (&apos;UUID_AUS_AUTHENTICATION_USERS&apos;, &apos;partner&apos;)
            <br />
            on conflict (id) do nothing;
          </p>
          <p className="mt-2">
            Die UUID steht in Supabase unter <strong>Authentication → Users</strong> bei Ihrem Konto. Danach diese Seite
            neu laden oder abmelden und erneut anmelden.
          </p>
          {session && !session.profile ? (
            <div className="mt-4">
              <PartnerLogoutButton />
            </div>
          ) : null}
        </div>
      ) : null}

      {!configured ? (
        <div
          className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950"
          role="status"
        >
          <p className="font-semibold">Anmeldung: Supabase fehlt noch</p>
          <p className="mt-2">
            In <code className="rounded bg-white/80 px-1">.env.local</code> müssen mindestens{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code> und der vollständige{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (aus Supabase →
            Project Settings → API, „anon“ oder „publishable“) stehen – beide Zeilen ohne Leerzeichen am Anfang.
            Für das Speichern von Pflegebox-Abschlüssen zusätzlich{" "}
            <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> (nur serverseitig).
          </p>
          <p className="mt-2">
            Datenbanktabellen: SQL aus{" "}
            <code className="rounded bg-white/80 px-1">supabase/migrations/001_partner_portal.sql</code> im
            Supabase-SQL-Editor ausführen. Danach Entwicklungsserver beenden und neu starten (
            <code className="rounded bg-white/80 px-1">npm run dev</code>). Prüfen:{" "}
            <code className="rounded bg-white/80 px-1">npm run check:partner-env</code>.
          </p>
        </div>
      ) : session && !session.profile ? null : (
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
