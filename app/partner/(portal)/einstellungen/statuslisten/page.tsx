import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerPortalPreferencesForm } from "@/components/partner/PartnerPortalPreferencesForm";
import { PartnerStatuslisteTable } from "@/components/partner/PartnerStatuslisteTable";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { fetchPartnerTipsForDashboard } from "@/lib/partner/fetch-partner-tips-for-dashboard";
import { mapTipsToStatuslisteRows, normalizePortalPreferences, parsePortalPreferences } from "@/lib/partner/portal-preferences";
import {
  partnerHasBetrieblicheProgram,
  partnerHasEinmalProvisionProgram,
} from "@/lib/partner/partner-program-capabilities";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

export const metadata: Metadata = {
  title: "Statuslisten",
};

export default async function PartnerEinstellungenStatuslistenPage() {
  noStore();
  const { profile } = await requirePartnerLogin();

  let tips: PartnerDashboardTipSerial[] = [];
  try {
    tips = await fetchPartnerTipsForDashboard(profile.id);
  } catch {
    tips = [];
  }

  const archivedTips = tips.filter((t) => Boolean(t.partner_archived_at));
  const archivRows = mapTipsToStatuslisteRows(archivedTips);
  const portalPreferences = normalizePortalPreferences(parsePortalPreferences(profile.portal_preferences));
  const hasBetriebliche = partnerHasBetrieblicheProgram(profile.responsibility_areas);
  const hasEinmal = partnerHasEinmalProvisionProgram(profile.responsibility_areas);

  return (
    <div className="space-y-10">
      <nav className="partner-dash-animate text-sm text-neutral-600">
        <Link href="/partner/einstellungen" className="font-semibold text-[#0F4F68] hover:underline">
          ← Zurück zu Einstellungen
        </Link>
      </nav>

      <section
        className="partner-dash-animate partner-dash-delay-1 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-8"
        aria-labelledby="anzeige-heading"
      >
        <h1 id="anzeige-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
          Statuslisten einstellen
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Welche Statuslisten auf der Übersicht erscheinen, ob das Archiv dort mit angezeigt wird und welche Spalten in den
          Tabellen sichtbar sind.
        </p>
        <div className="mt-6 max-w-3xl">
          <PartnerPortalPreferencesForm
            initial={portalPreferences}
            hasBetriebliche={hasBetriebliche}
            hasEinmal={hasEinmal}
          />
        </div>
      </section>

      <section
        id="partner-archiv-section"
        className="partner-dash-animate partner-dash-delay-2 scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/20 bg-white shadow-sm"
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
            einblenden (hier unter „Statuslisten einstellen“).
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
    </div>
  );
}
