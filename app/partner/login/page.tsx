import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerAuthModalShell } from "@/components/partner/PartnerAuthModalShell";
import { PartnerLoginForm } from "@/components/partner/PartnerLoginForm";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";
import { PartnerProfileEnsureClient } from "@/components/partner/PartnerProfileEnsureClient";
import { getPartnerSession } from "@/lib/partner/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Props = {
  searchParams: Promise<{
    reason?: string;
    error?: string;
    ensure_failed?: string;
    sync_reason?: string;
  }>;
};

export default async function PartnerLoginPage({ searchParams }: Props) {
  const configured = isSupabaseConfigured();
  const session = configured ? await getPartnerSession() : null;
  const { reason, error, ensure_failed, sync_reason } = await searchParams;
  const ensureFailed = ensure_failed === "1";

  if (session?.profile) {
    redirect("/partner/dashboard");
  }

  return (
    <PartnerAuthModalShell titleId="partner-login-heading">
      <article className="partner-dash-animate text-center">
        <h1
          id="partner-login-heading"
          className="text-2xl font-semibold tracking-tight text-[#0F4F68] sm:text-3xl"
        >
          Partner-Login
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600 sm:text-base">
          Melden Sie sich an, um Fortschritte und abgeschlossene Konfigurationen einzusehen.
        </p>

        {reason === "reset_expired" ? (
          <div
            className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950"
            role="status"
          >
            <p className="font-semibold">Link abgelaufen oder ungültig</p>
            <p className="mt-1 text-amber-900/90">
              Bitte fordern Sie unten unter „Passwort vergessen?“ erneut einen Link per E-Mail an.
            </p>
          </div>
        ) : null}

        {(session && !session.profile) || reason === "no_profile" ? (
          <div
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left text-sm text-amber-950 sm:mt-8"
            role="status"
          >
          <p className="font-semibold">Angemeldet, aber kein Partnerprofil</p>
          <p className="mt-2">
            Das Supabase-Konto ist gültig, in der Tabelle{" "}
            <code className="rounded bg-white/80 px-1">partner_profiles</code> fehlt jedoch noch ein passender Eintrag.
            Über den Button unten öffnen Sie{" "}
            <code className="rounded bg-white/80 px-1">/partner/sync-profile</code> — dort wird die Zeile mit dem{" "}
            <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> nachgetragen (muss in Vercel
            für Production gesetzt sein).
          </p>
          {session && !session.profile ? (
            <PartnerProfileEnsureClient ensureFailed={ensureFailed} syncReason={sync_reason} />
          ) : null}
          <p className="mt-4 text-neutral-800">
            <strong>Manuell (Fallback):</strong> Migration{" "}
            <code className="rounded bg-white/80 px-1">002_backfill_partner_profiles.sql</code> im SQL-Editor ausführen
            oder einzeln:
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
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left text-sm text-amber-950 sm:mt-8"
            role="status"
          >
          <p className="font-semibold">Anmeldung: Supabase fehlt noch</p>
          <p className="mt-2">
            Die Website „sieht“ zum Laufzeitpunkt keine gültige Supabase-Konfiguration. Es müssen exakt diese Namen
            gesetzt sein: <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_URL</code> (beginnt mit{" "}
            <code className="rounded bg-white/80 px-1">https://</code>) und{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (kompletter Key aus
            Supabase → Project Settings → API: „anon“/JWT oder „publishable“/langer Key — Wert in{" "}
            <strong>diese</strong> Variable kopieren, nicht umbenennen). Zeilen in{" "}
            <code className="rounded bg-white/80 px-1">.env.local</code> ohne Leerzeichen vor dem Namen, Format{" "}
            <code className="rounded bg-white/80 px-1">NAME=wert</code>.
          </p>
          <p className="mt-2 font-medium">
            <strong>Lokal:</strong> Datei <code className="rounded bg-white/80 px-1">.env.local</code> im Projektroot
            (gleicher Ordner wie <code className="rounded bg-white/80 px-1">package.json</code>), dann{" "}
            <code className="rounded bg-white/80 px-1">npm run dev</code> beenden und neu starten. Prüfen:{" "}
            <code className="rounded bg-white/80 px-1">npm run check:partner-env</code>.
          </p>
          <p className="mt-2 font-medium">
            <strong>Vercel / Live:</strong> Project → Settings → Environment Variables — dieselben beiden Variablen für{" "}
            <strong>Production</strong> (und ggf. Preview) eintragen. Wichtig:{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC_*</code> wird beim{" "}
            <strong>Build</strong> eingebaut; nach dem Anlegen oder Ändern immer{" "}
            <strong>Redeploy</strong> auslösen, sonst bleibt die alte (leere) Konfiguration.
          </p>
          <p className="mt-2">
            Für Verwaltung und Profil-Nachzug zusätzlich{" "}
            <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> (nur serverseitig, nie{" "}
            <code className="rounded bg-white/80 px-1">NEXT_PUBLIC</code>).
          </p>
          <p className="mt-2">
            Datenbanktabellen: SQL aus{" "}
            <code className="rounded bg-white/80 px-1">supabase/migrations/001_partner_portal.sql</code> im
            Supabase-SQL-Editor ausführen.
          </p>
          </div>
        ) : session && !session.profile ? null : (
          <>
            {error === "auth" ? (
              <div
                className="mt-6 min-h-[5rem] rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950"
                role="alert"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-amber-800/90">
                  Status / Fehlermeldungen
                </p>
                <p className="mt-2 font-medium leading-snug">
                  Anmeldung über den E-Mail-Link ist fehlgeschlagen. Bitte erneut auf den Link klicken oder sich mit
                  Anmeldename (bzw. E-Mail) und Passwort anmelden.
                </p>
              </div>
            ) : null}
            <div className="partner-dash-animate partner-dash-delay-1 mt-6 text-left">
              <PartnerLoginForm />
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col items-center gap-1.5 text-center">
          <p className="text-base font-semibold text-neutral-800 sm:text-lg">
            <Link
              href="/kooperation"
              className="text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
            >
              Zur Kooperationsseite
            </Link>
          </p>
          {configured && !(session && !session.profile) ? (
            <p className="text-xs text-neutral-500 sm:text-sm">
              <Link
                href="/partner/admin-login"
                className="font-medium text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
              >
                Partner-Verwaltung (Betrieb)
              </Link>
            </p>
          ) : null}
        </div>
      </article>
    </PartnerAuthModalShell>
  );
}
