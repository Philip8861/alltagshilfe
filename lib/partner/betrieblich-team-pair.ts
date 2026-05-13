import type { SupabaseClient } from "@supabase/supabase-js";

export type TeamPairCheck = { shares: boolean } | { error: true };

/** True, wenn beide Partner bereits in mindestens einem gemeinsamen Team sind (optional eine Team-ID ignorieren). */
export async function partnersShareATeamExcluding(
  svc: SupabaseClient,
  partnerA: string,
  partnerB: string,
  excludeTeamId: string | null,
): Promise<TeamPairCheck> {
  if (partnerA === partnerB) return { shares: false };
  const [{ data: rowsA, error: e1 }, { data: rowsB, error: e2 }] = await Promise.all([
    svc.from("partner_team_members").select("team_id").eq("partner_id", partnerA),
    svc.from("partner_team_members").select("team_id").eq("partner_id", partnerB),
  ]);
  if (e1 || e2) {
    console.error("[partnersShareATeamExcluding]", e1?.message ?? e2?.message);
    return { error: true };
  }
  const setB = new Set((rowsB ?? []).map((r) => String((r as { team_id: string }).team_id)));
  for (const r of rowsA ?? []) {
    const tid = String((r as { team_id: string }).team_id);
    if (excludeTeamId && tid === excludeTeamId) continue;
    if (setB.has(tid)) return { shares: true };
  }
  return { shares: false };
}

export async function countPartnerTeamMemberships(svc: SupabaseClient, partnerId: string): Promise<number | null> {
  const { count, error } = await svc
    .from("partner_team_members")
    .select("team_id", { count: "exact", head: true })
    .eq("partner_id", partnerId);
  if (error) {
    console.error("[countPartnerTeamMemberships]", error.message);
    return null;
  }
  return count ?? 0;
}
