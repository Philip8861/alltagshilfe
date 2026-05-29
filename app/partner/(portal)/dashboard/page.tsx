import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerDashboardClient } from "@/components/partner/PartnerDashboardClient";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { fetchPartnerTipsForDashboard } from "@/lib/partner/fetch-partner-tips-for-dashboard";
import { partnerEinmalProvisionSumFromTips } from "@/lib/partner/partner-provision-sums";
import { partnerPortalWelcomeLine } from "@/lib/partner/partner-portal-greeting";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import { normalizePortalPreferences, parsePortalPreferences } from "@/lib/partner/portal-preferences";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import { PARTNER_RESPONSIBILITY_SLUGS } from "@/lib/partner/responsibility-areas";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { getPartnerMonthlyPayoutSummary } from "@/lib/partner/referral-commission";
import { partnerAvatarPublicUrl } from "@/lib/partner/partner-avatar-shared";
import { currentBerlinPeriodKey } from "@/lib/partner/payout-period";

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
  const provisionEinmalEur = partnerEinmalProvisionSumFromTips(tips);
  const portalPreferences = normalizePortalPreferences(parsePortalPreferences(profile.portal_preferences));
  const avatarUrl = partnerAvatarPublicUrl(profile.avatar_path, profile.updated_at);
  const tipSlugSet = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);
  const hasAnyTipArea = responsibilityAreaSlugs.some((s) => tipSlugSet.has(s));

  let ownCents = 0;
  let referralCents = 0;
  let totalCents = 0;
  const periodKey = currentBerlinPeriodKey();
  try {
    const svc = createSupabaseServiceRoleClient();
    if (svc) {
      const summary = await getPartnerMonthlyPayoutSummary(svc, profile.id, periodKey);
      ownCents = summary.ownCents;
      referralCents = summary.referralCents;
      totalCents = summary.totalCents;
    }
  } catch {
    /* still render dashboard without summary */
  }

  return (
    <PartnerDashboardClient
      welcomeLine={welcomeLine}
      partnerCode={partnerCode}
      avatarUrl={avatarUrl}
      payoutLabel={payoutLabel}
      responsibilityAreaSlugs={responsibilityAreaSlugs}
      tips={tips}
      initialTipModalOpen={tip === "1" && hasAnyTipArea}
      provisionEinmalEur={provisionEinmalEur}
      portalPreferences={portalPreferences}
      payoutSummary={{
        periodKey,
        ownCents,
        referralCents,
        totalCents,
      }}
    />
  );
}
