import Link from "next/link";
import { PartnerLoginForm } from "@/components/partner/PartnerLoginForm";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";
import { getPartnerSession } from "@/lib/partner/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function HomePartnerLoginBlock() {
  const configured = isSupabaseConfigured();
  let session: Awaited<ReturnType<typeof getPartnerSession>> = null;
  if (configured) {
    try {
      session = await getPartnerSession();
    } catch {
      session = null;
    }
  }

  const displayName =
    session?.profile?.display_name ??
    session?.profile?.organization_name ??
    session?.email ??
    "Partner";

  return (
    <section
      className="relative z-20 mx-auto mt-14 w-full max-w-6xl px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-8"
      aria-labelledby="home-partner-login-heading"
    >
      <div className="rounded-3xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#F2F9FA]/50 p-6 shadow-[0_12px_40px_rgba(15,79,104,0.08)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/75">Kooperationspartner</p>
            <h2 id="home-partner-login-heading" className="mt-2 text-2xl font-bold text-[#0F4F68] sm:text-3xl">
              Anmeldung für Partner
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              Melden Sie sich mit Ihrer <strong className="font-semibold text-neutral-800">E-Mail-Adresse</strong> (als
              Anmeldename) und Ihrem <strong className="font-semibold text-neutral-800">Passwort</strong> an. Zugänge
              werden von Alltagshilfe-Süd vergeben.
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              <Link
                href="/partner/login"
                className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
              >
                Zur Vollseite Partner-Login
              </Link>
            </p>
          </div>

          <div className="w-full min-w-0 lg:max-w-md lg:shrink-0">
            {!configured ? (
              <div
                className="rounded-2xl border border-amber-200 bg-amber-50/90 p-5 text-sm text-amber-950"
                role="status"
              >
                <p className="font-semibold">Anmeldung: Supabase fehlt noch</p>
                <p className="mt-2 text-amber-900/90">
                  In <code className="rounded bg-white/80 px-1 text-xs">.env.local</code>:{" "}
                  <code className="rounded bg-white/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> und den
                  vollständigen <code className="rounded bg-white/80 px-1 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                  (Supabase → API). Ohne ausgefüllten Anon-Key erscheint dieser Hinweis. Optional für Pflegebox:{" "}
                  <code className="rounded bg-white/80 px-1 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>. SQL:{" "}
                  <code className="rounded bg-white/80 px-1 text-xs">001_partner_portal.sql</code>. Dann{" "}
                  <code className="rounded bg-white/80 px-1 text-xs">npm run check:partner-env</code> und{" "}
                  <code className="rounded bg-white/80 px-1 text-xs">npm run dev</code> neu starten.
                </p>
              </div>
            ) : session?.profile ? (
              <div className="rounded-2xl border border-[#0F4F68]/15 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-[#0F4F68]">Sie sind angemeldet</p>
                <p className="mt-2 text-sm text-neutral-700">{displayName}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/partner/dashboard"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52]"
                  >
                    Zur Partner-Übersicht
                  </Link>
                  <PartnerLogoutButton />
                </div>
              </div>
            ) : (
              <PartnerLoginForm
                emailFieldLabel="E-Mail-Adresse (Anmeldename)"
                formClassName="space-y-5 rounded-2xl border border-[#0F4F68]/12 bg-white p-6 shadow-sm sm:p-8"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
