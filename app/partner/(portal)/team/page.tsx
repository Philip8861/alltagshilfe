import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { BetrieblichTeamPageClient } from "@/components/partner/betrieblich/BetrieblichTeamPageClient";
import { PartnerNetworkSection } from "@/components/partner/network/PartnerNetworkSection";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { partnerHasBetrieblichPflegeberatung } from "@/lib/partner/betrieblich-team-types";
import { fetchBetrieblichTeamsOverview } from "@/lib/partner/betrieblich-team-queries";
import { getPartnerNetworkTree } from "@/lib/partner/network-tree";
import { currentBerlinPeriodKey } from "@/lib/partner/payout-period";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "Partnernetzwerk",
};

export default async function PartnerBetrieblichTeamPage() {
  noStore();
  const { profile } = await requirePartnerLogin();
  const periodKey = currentBerlinPeriodKey();

  const showsBetrieblich = partnerHasBetrieblichPflegeberatung(profile);
  const svc = createSupabaseServiceRoleClient();

  const teams = svc && showsBetrieblich ? await fetchBetrieblichTeamsOverview(svc, profile.id) : [];
  const networkData = svc
    ? await getPartnerNetworkTree(svc, profile.id, periodKey)
    : {
        rootPartnerCode: profile.partner_referral_code ?? null,
        sponsor: null,
        directChildren: [],
        totalNodes: 0,
        periodKey,
      };

  return (
    <div className="mx-auto w-full max-w-[min(100%,90rem)] space-y-8">
      <PartnerNetworkSection initialData={networkData} />
      {showsBetrieblich ? (
        <BetrieblichTeamPageClient initialTeams={teams} viewerPartnerId={profile.id} />
      ) : null}
    </div>
  );
}
