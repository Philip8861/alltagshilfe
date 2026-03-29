import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerDashboardClient } from "@/components/partner/PartnerDashboardClient";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { fetchPartnerTipsForDashboard } from "@/lib/partner/fetch-partner-tips-for-dashboard";
import { partnerProvisionSumsFromTips } from "@/lib/partner/partner-provision-sums";
import { partnerPortalWelcomeLine } from "@/lib/partner/partner-portal-greeting";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import { normalizePortalPreferences, parsePortalPreferences } from "@/lib/partner/portal-preferences";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

export const metadata: Metadata = {
  title: "Übersicht",
};

type Search = { tip?: string };

export default async function PartnerDashboardPage({ searchParams }: { searchParams: Promise<Search> }) {
  noStore();
  const { tip } = await searchParams;
  const { profile, email } = await requirePartnerLogin();

  let tips: PartnerDashboardTipSerial[] = [];
  try {
    tips = await fetchPartnerTipsForDashboard(profile.id);
  } catch {
    tips = [];
  }

  const { labelDe: payoutLabel } = nextPayoutDateInfo();
  const welcomeLine = partnerPortalWelcomeLine(profile, email);
  const partnerCode = profile.partner_referral_code?.trim() || null;
  const responsibilityAreaSlugs = profile.responsibility_areas ?? [];
  const { provisionMonatlichEur, provisionEinmalEur } = partnerProvisionSumsFromTips(tips);
  const portalPreferences = normalizePortalPreferences(parsePortalPreferences(profile.portal_preferences));

  return (
    <PartnerDashboardClient
      welcomeLine={welcomeLine}
      partnerCode={partnerCode}
      payoutLabel={payoutLabel}
      responsibilityAreaSlugs={responsibilityAreaSlugs}
      tips={tips}
      initialTipModalOpen={tip === "1"}
      provisionMonatlichEur={provisionMonatlichEur}
      provisionEinmalEur={provisionEinmalEur}
      portalPreferences={portalPreferences}
    />
  );
}
