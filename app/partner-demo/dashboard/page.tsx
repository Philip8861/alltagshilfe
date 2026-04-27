import type { Metadata } from "next";
import { PartnerDashboardClient } from "@/components/partner/PartnerDashboardClient";
import { PARTNER_DEMO_MAX_MUSTERMANN_TIPS } from "@/lib/partner/partner-demo-muster-mann-data";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import { partnerProvisionSumsFromTips } from "@/lib/partner/partner-provision-sums";
import { DEFAULT_PORTAL_PREFERENCES } from "@/lib/partner/portal-preferences";
import { PARTNER_RESPONSIBILITY_SLUGS } from "@/lib/partner/responsibility-areas";

export const metadata: Metadata = {
  title: "Partner-Dashboard (Demo)",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/** Fiktiver Partner-Code nur für die öffentliche Vorschau. */
const DEMO_PARTNER_CODE = "AH-DEMO1";

export default function PartnerDemoDashboardPage() {
  const { labelDe: payoutLabel } = nextPayoutDateInfo();
  const tips = PARTNER_DEMO_MAX_MUSTERMANN_TIPS;
  const { provisionMonatlichEur, provisionEinmalEur } = partnerProvisionSumsFromTips(tips);

  return (
    <PartnerDashboardClient
      welcomeLine="Willkommen, Max Mustermann"
      partnerCode={DEMO_PARTNER_CODE}
      payoutLabel={payoutLabel}
      responsibilityAreaSlugs={[...PARTNER_RESPONSIBILITY_SLUGS]}
      tips={tips}
      initialTipModalOpen={false}
      provisionMonatlichEur={provisionMonatlichEur}
      provisionEinmalEur={provisionEinmalEur}
      portalPreferences={DEFAULT_PORTAL_PREFERENCES}
      demoMode
    />
  );
}
