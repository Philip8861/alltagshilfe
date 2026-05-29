import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { PartnerNetworkSection } from "@/components/partner/network/PartnerNetworkSection";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { getPartnerNetworkTree } from "@/lib/partner/network-tree";
import { partnerAvatarPublicUrl } from "@/lib/partner/partner-avatar-shared";
import { partnerPortalGreetingName } from "@/lib/partner/partner-portal-greeting";
import { partnerHasBetrieblicheProgram } from "@/lib/partner/partner-program-capabilities";
import { currentBerlinPeriodKey } from "@/lib/partner/payout-period";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "Werbe-Netzwerk",
};

export default async function PartnerNetworkPage() {
  noStore();
  const { profile, email } = await requirePartnerLogin();

  if (!partnerHasBetrieblicheProgram(profile.responsibility_areas)) {
    redirect("/partner/dashboard");
  }

  const periodKey = currentBerlinPeriodKey();
  const svc = createSupabaseServiceRoleClient();

  const networkData = svc
    ? await getPartnerNetworkTree(svc, profile.id, periodKey)
    : {
        rootPartnerCode: profile.partner_referral_code ?? null,
        sponsor: null,
        directChildren: [],
        totalNodes: 0,
        periodKey,
      };

  const avatarUrl = partnerAvatarPublicUrl(profile.avatar_path, profile.updated_at);

  return (
    <div className="mx-auto w-full max-w-[min(100%,96rem)]">
      <PartnerNetworkSection
        initialData={networkData}
        viewer={{
          displayName: partnerPortalGreetingName(profile, email),
          partnerCode: profile.partner_referral_code ?? networkData.rootPartnerCode,
          isActive: !profile.account_disabled_at,
          avatarUrl,
        }}
      />
    </div>
  );
}
