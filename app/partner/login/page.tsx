import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerLoginShell } from "@/components/partner/PartnerLoginShell";
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
    /** Interner Zielpfad nach Login (nur /partner/...). */
    next?: string;
  }>;
};

function safePartnerInternalNext(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const u = raw.trim();
  if (!u.startsWith("/partner/") || u.includes("//")) return null;
  return u;
}

export default async function PartnerLoginPage({ searchParams }: Props) {
  const configured = isSupabaseConfigured();
  const session = configured ? await getPartnerSession() : null;
  const { reason, error, ensure_failed, next: nextRaw } = await searchParams;
  const next = safePartnerInternalNext(typeof nextRaw === "string" ? nextRaw : undefined);
  const ensureFailed = ensure_failed === "1";

  if (session?.profile) {
    redirect(next ?? "/partner/dashboard");
  }

  return (
    <PartnerLoginShell>
      <article className="text-left">
        <p className="mb-2 text-sm font-bold text-[#527580]">Ihr Partnerbereich</p>
        <h1
          id="partner-login-heading"
          className="text-[1.75rem] font-extrabold tracking-tight text-[#0F4F68] sm:text-[2rem]"
        >
          Willkommen zurück.
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#53717b]">
          Melden Sie sich an, um Ihre Vermittlungen, Abschlüsse und Provisionen einzusehen.
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
          <p className="font-semibold">Ihr Partnerzugang wird eingerichtet</p>
          <p className="mt-2">Ihre Anmeldung war erfolgreich. Ihr Partnerprofil ist noch nicht verfügbar. Sie können die Einrichtung hier erneut starten. Falls das nicht klappt, hilft Ihnen unser Team weiter.</p>
          {session && !session.profile ? <PartnerProfileEnsureClient ensureFailed={ensureFailed} /> : null}
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
          <p className="font-semibold">Anmeldung vorübergehend nicht verfügbar</p>
          <p className="mt-2">Bitte versuchen Sie es später erneut. Bei Fragen hilft Ihnen unser Team über die <Link href="/kontakt" className="font-semibold underline">Kontaktseite</Link> weiter.</p>
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
            <div className="mt-6 text-left">
              <PartnerLoginForm afterLoginHref={next ?? undefined} formClassName="w-full space-y-4" />
            </div>
          </>
        )}

        <div className="mt-5 border-t border-[#dce9ec] pt-4 text-sm leading-6 text-[#53717b]">
          <p><span className="font-bold text-[#0F4F68]">Zum ersten Mal hier?</span> Ihre Zugangsdaten finden Sie in unserer Willkommens-E-Mail.</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 text-xs">
            <Link href="/kontakt" className="inline-flex min-h-11 items-center rounded font-bold text-[#0F4F68] underline-offset-4 hover:underline">Hilfe beim Zugang</Link>
            {configured && !(session && !session.profile) ? <Link href="/partner/admin-login" className="inline-flex min-h-11 items-center rounded underline-offset-4 hover:underline">Zur Partnerverwaltung</Link> : null}
          </div>
        </div>
      </article>
    </PartnerLoginShell>
  );
}
