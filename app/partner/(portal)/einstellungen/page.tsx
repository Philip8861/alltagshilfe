import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerEmailChangeForm } from "@/components/partner/PartnerEmailChangeForm";
import { PartnerPasswordChangeForm } from "@/components/partner/PartnerPasswordChangeForm";
import { PartnerPortalPreferencesForm } from "@/components/partner/PartnerPortalPreferencesForm";
import { PartnerStatuslisteTable } from "@/components/partner/PartnerStatuslisteTable";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { fetchPartnerTipsForDashboard } from "@/lib/partner/fetch-partner-tips-for-dashboard";
import { mapTipsToStatuslisteRows, normalizePortalPreferences, parsePortalPreferences } from "@/lib/partner/portal-preferences";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

export const metadata: Metadata = {
  title: "Einstellungen",
};

export default async function PartnerEinstellungenPage() {
  noStore();
  const { profile, email } = await requirePartnerLogin();
  const currentEmail = email?.trim() || "";

  let tips: PartnerDashboardTipSerial[] = [];
  try {
    tips = await fetchPartnerTipsForDashboard(profile.id);
  } catch {
    tips = [];
  }

  const archivedTips = tips.filter((t) => Boolean(t.partner_archived_at));
  const archivRows = mapTipsToStatuslisteRows(archivedTips);
  const portalPreferences = normalizePortalPreferences(parsePortalPreferences(profile.portal_preferences));

  return (
    <div className="space-y-10">
      <div className="partner-dash-animate">
        <h1 className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">Einstellungen</h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Zugangsdaten, Anzeige der Statuslisten und Ihr Archiv.
        </p>
      </div>

      <section
        className="partner-dash-animate partner-dash-delay-1 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="email-heading"
      >
        <h2 id="email-heading" className="text-lg font-bold text-[#0F4F68]">
          E-Mail-Adresse ändern
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Nach einer Änderung bestätigen Sie die neue Adresse ggf. über den Link in der E-Mail von Supabase.
        </p>
        <div className="mt-6 max-w-md">
          <PartnerEmailChangeForm currentEmail={currentEmail} />
        </div>
      </section>

      <section
        className="partner-dash-animate partner-dash-delay-2 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="pw-heading"
      >
        <h2 id="pw-heading" className="text-lg font-bold text-[#0F4F68]">
          Passwort ändern
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Nach dem Speichern können Sie sich mit dem neuen Passwort anmelden.
        </p>
        <div className="mt-6 max-w-md">
          <PartnerPasswordChangeForm />
        </div>
      </section>

      <section
        className="partner-dash-animate partner-dash-delay-3 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="anzeige-heading"
      >
        <h2 id="anzeige-heading" className="text-lg font-bold text-[#0F4F68]">
          Übersicht &amp; Tabellen
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Welche Statuslisten auf der Übersicht erscheinen, ob das Archiv dort mit angezeigt wird und welche Spalten in den
          Tabellen sichtbar sind.
        </p>
        <div className="mt-6 max-w-3xl">
          <PartnerPortalPreferencesForm initial={portalPreferences} />
        </div>
      </section>

      <section
        id="partner-archiv-section"
        className="partner-dash-animate partner-dash-delay-4 scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/20 bg-white shadow-sm"
        aria-labelledby="archiv-heading"
      >
        <header className="border-b border-[#0c3d52] bg-[#0F4F68] px-6 py-5 sm:px-8">
          <h2 id="archiv-heading" className="text-lg font-bold text-white sm:text-xl">
            Mein Archiv
          </h2>
          <p className="mt-1 text-sm text-white/85">
            Von Ihnen abgelegte Fälle — ohne Einfluss auf Provision oder Auszahlung. Optional können Sie den Archiv-Bereich
            auch auf der{" "}
            <Link href="/partner/dashboard" className="font-semibold underline">
              Übersicht
            </Link>{" "}
            einblenden (unter „Übersicht &amp; Tabellen“).
          </p>
        </header>
        <div className="p-4 sm:p-6">
          <PartnerStatuslisteTable
            variant="archiv"
            rows={archivRows}
            emptyHint="Keine archivierten Einträge."
            theadClass="bg-[#e8f2f6] text-[#0F4F68]"
            columns={portalPreferences.columns}
          />
        </div>
      </section>

      <section
        className="partner-dash-animate partner-dash-delay-5 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="vertraege-teaser"
      >
        <h2 id="vertraege-teaser" className="text-lg font-bold text-[#0F4F68]">
          Verträge
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Hier können Sie später Rahmenverträge und Dokumente als PDF hinterlegen. Der Upload wird in einer folgenden
          Ausbaustufe ergänzt.
        </p>
        <div className="mt-5">
          <Link
            href="/partner/einstellungen/vertraege"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-[#0F4F68]/5 px-5 py-2.5 text-sm font-semibold text-[#0F4F68] transition hover:border-[#0F4F68]/40 hover:bg-[#0F4F68]/10"
          >
            Zu Verträgen
          </Link>
        </div>
      </section>
    </div>
  );
}
