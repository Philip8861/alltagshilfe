import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerAuthModalShell } from "@/components/partner/PartnerAuthModalShell";
import { SystemAdminLoginForm } from "@/components/partner/SystemAdminLoginForm";
import { getSystemAdminSession, isSystemAdminConfigured } from "@/lib/partner/system-admin-session";

export default async function PartnerAdminLoginPage() {
  if (await getSystemAdminSession()) {
    redirect("/partner/admin");
  }

  const configured = isSystemAdminConfigured();

  return (
    <PartnerAuthModalShell titleId="partner-admin-login-heading">
      <article>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/70">Betrieb</p>
        <h1
          id="partner-admin-login-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-3xl"
        >
          Partner-Verwaltung
        </h1>
        <p className="mt-3 text-sm text-neutral-600 sm:text-base">
          Anmeldung mit den in <code className="rounded bg-neutral-100 px-1 text-xs">.env</code> / Vercel hinterlegten
          Zugangsdaten – nicht mit Partner-E-Mail/Passwort.
        </p>

        {!configured ? (
          <div
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950"
            role="status"
          >
            <p className="font-semibold">Noch nicht eingerichtet</p>
            <p className="mt-2">
              In <code className="rounded bg-white/80 px-1">.env.local</code> setzen (siehe{" "}
              <code className="rounded bg-white/80 px-1">.env.example</code>):
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <code className="rounded bg-white/80 px-1">PARTNER_SYSTEM_ADMIN_USER</code> (z. B. admin)
              </li>
              <li>
                <code className="rounded bg-white/80 px-1">PARTNER_SYSTEM_ADMIN_PASSWORD</code> (starkes Passwort –
                niemals committen)
              </li>
              <li>
                <code className="rounded bg-white/80 px-1">PARTNER_SYSTEM_ADMIN_SECRET</code> (min. 24 Zeichen,
                zufällig)
              </li>
            </ul>
            <p className="mt-2">
              Für „Konto anlegen“ zusätzlich <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code>
              .
            </p>
          </div>
        ) : (
          <SystemAdminLoginForm />
        )}

        <p className="mt-8 text-sm text-neutral-600">
          <Link
            href="/partner/login"
            className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
          >
            Zum Partner-Login
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
