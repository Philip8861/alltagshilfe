import type { Metadata } from "next";
import { PartnerDashboardClient } from "@/components/partner/PartnerDashboardClient";
import {
  getPartnerDemoPayoutSummary,
  PARTNER_DEMO_MAX_MUSTERMANN_CODE,
  PARTNER_DEMO_MAX_MUSTERMANN_TIPS,
} from "@/lib/partner/partner-demo-muster-mann-data";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import { partnerProvisionSumsFromTips } from "@/lib/partner/partner-provision-sums";
import { DEFAULT_PORTAL_PREFERENCES } from "@/lib/partner/portal-preferences";
import { PARTNER_RESPONSIBILITY_SLUGS } from "@/lib/partner/responsibility-areas";

export const metadata: Metadata = {
  title: "Partner-Dashboard (Demo)",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PartnerDemoDashboardPage() {
  const { labelDe: payoutLabel } = nextPayoutDateInfo();
  const tips = PARTNER_DEMO_MAX_MUSTERMANN_TIPS;
  const { provisionMonatlichEur, provisionEinmalEur } = partnerProvisionSumsFromTips(tips);
  const payout = getPartnerDemoPayoutSummary();

  return (
    <PartnerDashboardClient
      welcomeLine="Willkommen, Max Mustermann"
      partnerCode={PARTNER_DEMO_MAX_MUSTERMANN_CODE}
      payoutLabel={payoutLabel}
      responsibilityAreaSlugs={[...PARTNER_RESPONSIBILITY_SLUGS]}
      tips={tips}
      initialTipModalOpen={false}
      provisionMonatlichEur={provisionMonatlichEur}
      provisionEinmalEur={provisionEinmalEur}
      portalPreferences={DEFAULT_PORTAL_PREFERENCES}
      payoutSummary={{
        periodKey: payout.periodKey,
        ownCents: payout.ownCents,
        referralCents: payout.referralCents,
        totalCents: payout.totalCents,
      }}
      demoMode
    />
  );
}
