import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { BetrieblichTeamPageClient } from "@/components/partner/betrieblich/BetrieblichTeamPageClient";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { partnerHasBetrieblichPflegeberatung } from "@/lib/partner/betrieblich-team-types";
import { fetchBetrieblichTeamsOverview } from "@/lib/partner/betrieblich-team-queries";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "Teams — betriebliche Pflegeberatung",
};

export default async function PartnerBetrieblichTeamPage() {
  noStore();
  const { profile } = await requirePartnerLogin();
  if (!partnerHasBetrieblichPflegeberatung(profile)) {
    redirect("/partner/dashboard");
  }
  const svc = createSupabaseServiceRoleClient();
  const teams = svc ? await fetchBetrieblichTeamsOverview(svc, profile.id) : [];
  return <BetrieblichTeamPageClient initialTeams={teams} viewerPartnerId={profile.id} />;
}
