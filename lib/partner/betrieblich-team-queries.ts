import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type BetrieblichTeamMemberRow,
  type BetrieblichTeamMemberStat,
  type BetrieblichTeamSummary,
  type PartnerTeamSettings,
  parseTeamSettings,
} from "@/lib/partner/betrieblich-team-types";
import { partnerTeamMemberLabel } from "@/lib/partner/betrieblich-team-member-label";
import { aggregateBetrieblichTipStatsByPartner } from "@/lib/partner/betrieblich-team-stats";
import { fetchPartnerTipSubmissionRows } from "@/lib/partner/partner-tip-submissions-select";
import type { PartnerProfile } from "@/lib/partner/types";

function applyStatVisibility(
  settings: PartnerTeamSettings,
  viewerPartnerId: string,
  viewerRole: "owner" | "member",
  full: BetrieblichTeamMemberStat[],
): BetrieblichTeamMemberStat[] {
  const pol = settings.provision_visibility;
  if (pol === "all") return full;

  const mask = (s: BetrieblichTeamMemberStat): BetrieblichTeamMemberStat => {
    if (s.partner_id === viewerPartnerId) return s;
    return { ...s, monatlich_eur: null, abschluesse: null };
  };

  if (pol === "self_only") {
    return full.map(mask);
  }
  if (viewerRole === "owner") return full;
  return full.map(mask);
}

async function fetchTipRowsForPartners(
  svc: SupabaseClient,
  partnerIds: string[],
): Promise<{ partner_id: string; service_slug: string; admin_status: unknown; archived_at: unknown; partner_archived_at?: unknown; paid_amount_eur: unknown }[]> {
  if (partnerIds.length === 0) return [];
  const pack = await fetchPartnerTipSubmissionRows((sel) =>
    svc
      .from("partner_tip_submissions")
      .select(sel)
      .in("partner_id", partnerIds)
      .order("created_at", { ascending: false }),
  );
  return (pack.rows as { partner_id: string; service_slug: string; admin_status: unknown; archived_at: unknown; partner_archived_at?: unknown; paid_amount_eur: unknown }[]) ?? [];
}

/**
 * Lädt alle Teams des Partners inkl. Mitgliedern, Einladungen und Statistik (nur betriebliche Pflegeberatung).
 * Nutzung nur serverseitig mit Service-Role nach Auth-Check.
 */
export async function fetchBetrieblichTeamsOverview(
  svc: SupabaseClient,
  viewerPartnerId: string,
): Promise<BetrieblichTeamSummary[]> {
  const { data: memberships, error: memErr } = await svc
    .from("partner_team_members")
    .select("team_id, role, joined_at")
    .eq("partner_id", viewerPartnerId);

  if (memErr || !memberships?.length) return [];

  const teamIds = [...new Set(memberships.map((m) => m.team_id as string))];
  const myRoleByTeam = new Map(
    memberships.map((m) => [m.team_id as string, m.role as "owner" | "member"] as const),
  );
  const { data: teams, error: teamErr } = await svc
    .from("partner_teams")
    .select("id, name, created_by_partner_id, settings, created_at, updated_at")
    .in("id", teamIds);

  if (teamErr || !teams?.length) return [];

  const { data: allMembers, error: amErr } = await svc.from("partner_team_members").select("team_id, partner_id, role, joined_at").in("team_id", teamIds);

  if (amErr || !allMembers?.length) return [];

  const partnerIdsAll = [...new Set(allMembers.map((m) => m.partner_id as string))];

  const { data: profiles, error: pErr } = await svc
    .from("partner_profiles")
    .select("id, first_name, last_name, display_name, organization_name, partner_referral_code, salutation")
    .in("id", partnerIdsAll);

  if (pErr || !profiles) return [];

  const profileById = new Map(
    profiles.map((p) => [
      String(p.id),
      {
        first_name: p.first_name as string | null,
        last_name: p.last_name as string | null,
        display_name: p.display_name as string | null,
        organization_name: p.organization_name as string | null,
        partner_referral_code: p.partner_referral_code as string | null,
        salutation: p.salutation as PartnerProfile["salutation"],
      },
    ]),
  );

  const tipRows = await fetchTipRowsForPartners(svc, partnerIdsAll);
  const statsByPartner = aggregateBetrieblichTipStatsByPartner(partnerIdsAll, tipRows);

  const { data: pendingInvites } = await svc
    .from("partner_team_invitations")
    .select("team_id")
    .in("team_id", teamIds)
    .is("consumed_at", null);

  const pendingCountByTeam = new Map<string, number>();
  for (const row of pendingInvites ?? []) {
    const tid = String((row as { team_id: string }).team_id);
    pendingCountByTeam.set(tid, (pendingCountByTeam.get(tid) ?? 0) + 1);
  }

  const out: BetrieblichTeamSummary[] = [];

  for (const t of teams) {
    const id = String(t.id);
    const settings = parseTeamSettings(t.settings);
    const my_role = myRoleByTeam.get(id) ?? "member";
    const membersRaw = allMembers.filter((m) => String(m.team_id) === id);

    const memberRows: BetrieblichTeamMemberRow[] = membersRaw.map((m) => {
      const pid = String(m.partner_id);
      const prof = profileById.get(pid);
      const profileSlice =
        prof ??
        ({
          first_name: null,
          last_name: null,
          display_name: null,
          organization_name: null,
          partner_referral_code: null,
          salutation: null,
        } as BetrieblichTeamMemberRow["profile"]);
      return {
        partner_id: pid,
        role: m.role as "owner" | "member",
        joined_at: String(m.joined_at),
        profile: profileSlice,
      };
    });

    memberRows.sort((a, b) => {
      if (a.role !== b.role) return a.role === "owner" ? -1 : 1;
      return partnerTeamMemberLabel(a.profile).localeCompare(partnerTeamMemberLabel(b.profile), "de");
    });

    const fullStats: BetrieblichTeamMemberStat[] = memberRows.map((mr) => {
      const st = statsByPartner.get(mr.partner_id) ?? { monatlich_eur: 0, abschluesse: 0 };
      return {
        partner_id: mr.partner_id,
        code: mr.profile.partner_referral_code?.trim() || null,
        label: partnerTeamMemberLabel(mr.profile),
        monatlich_eur: st.monatlich_eur,
        abschluesse: st.abschluesse,
      };
    });

    const member_stats = applyStatVisibility(settings, viewerPartnerId, my_role, fullStats);

    out.push({
      id,
      name: String(t.name),
      created_by_partner_id: String(t.created_by_partner_id),
      settings,
      my_role,
      members: memberRows,
      member_stats,
      pending_invites_count: pendingCountByTeam.get(id) ?? 0,
    });
  }

  out.sort((a, b) => a.name.localeCompare(b.name, "de"));
  return out;
}
