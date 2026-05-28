import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { BetrieblichTeamPageClient } from "@/components/partner/betrieblich/BetrieblichTeamPageClient";
import { PartnerNetworkSection } from "@/components/partner/network/PartnerNetworkSection";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { partnerHasBetrieblichPflegeberatung } from "@/lib/partner/betrieblich-team-types";
import { fetchBetrieblichTeamsOverview } from "@/lib/partner/betrieblich-team-queries";
import { getPartnerNetworkTree } from "@/lib/partner/network-tree";
import { currentBerlinPeriodKey } from "@/lib/partner/referral-commission";
import { formatPayoutPeriodLabelDe } from "@/lib/partner/payout-period";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const metadata: Metadata = {
  title: "Partnernetzwerk",
};

const PERIOD_RE = /^\d{4}-\d{2}$/;

function buildPeriodOptions(currentPeriod: string): { periodKey: string; label: string }[] {
  /** Liefert die letzten 12 Monate (inkl. aktuell), neueste zuerst. */
  const m = /^(\d{4})-(\d{2})$/.exec(currentPeriod);
  if (!m) return [{ periodKey: currentPeriod, label: currentPeriod }];
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const out: { periodKey: string; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(y, mo - 1 - i, 1));
    const yy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const key = `${yy}-${mm}`;
    out.push({ periodKey: key, label: formatPayoutPeriodLabelDe(key) });
  }
  return out;
}

type SearchParams = { [k: string]: string | string[] | undefined };

export default async function PartnerBetrieblichTeamPage(props: { searchParams?: Promise<SearchParams> }) {
  noStore();
  const { profile } = await requirePartnerLogin();
  const sp = (await props.searchParams) ?? {};
  const pRaw = typeof sp.p === "string" ? sp.p : Array.isArray(sp.p) ? sp.p[0] : undefined;
  const periodKey =
    pRaw && PERIOD_RE.test(pRaw) ? pRaw : currentBerlinPeriodKey();

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

  const availablePeriods = buildPeriodOptions(currentBerlinPeriodKey());
  /** Sicherstellen, dass der gewählte Monat in der Liste ist (z. B. älterer Verlauf). */
  if (!availablePeriods.some((p) => p.periodKey === periodKey)) {
    availablePeriods.unshift({ periodKey, label: formatPayoutPeriodLabelDe(periodKey) });
  }

  return (
    <div className="mx-auto w-full max-w-[min(100%,90rem)] space-y-8">
      <PartnerNetworkSection initialData={networkData} availablePeriods={availablePeriods} />
      {showsBetrieblich ? (
        <BetrieblichTeamPageClient initialTeams={teams} viewerPartnerId={profile.id} />
      ) : null}
    </div>
  );
}
