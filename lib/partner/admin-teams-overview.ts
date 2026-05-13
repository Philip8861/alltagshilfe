import type { SupabaseClient } from "@supabase/supabase-js";
import type { TeamProvisionVisibility } from "@/lib/partner/betrieblich-team-types";
import { parseTeamSettings } from "@/lib/partner/betrieblich-team-types";
import { partnerTeamMemberLabel } from "@/lib/partner/betrieblich-team-member-label";
import type { PartnerProfile } from "@/lib/partner/types";

export type AdminTeamInviteOverview = {
  id: string;
  invited_partner_id: string;
  email: string;
  expires_at: string;
};

export type AdminTeamMemberOverview = {
  partner_id: string;
  role: "owner" | "member";
  joined_at: string;
  email: string;
  display_name: string;
  partner_referral_code: string | null;
};

export type AdminTeamOverview = {
  id: string;
  name: string;
  created_by_partner_id: string;
  created_at: string;
  updated_at: string;
  provision_visibility: TeamProvisionVisibility;
  members: AdminTeamMemberOverview[];
  pending_invites: AdminTeamInviteOverview[];
};

/**
 * Lädt alle betrieblichen Partner-Teams für die Admin-Ansicht (nur Service-Role).
 */
export async function fetchAllTeamsForAdmin(
  svc: SupabaseClient,
  authById: Record<string, { email: string }>,
  profileById: Map<string, PartnerProfile>,
): Promise<AdminTeamOverview[]> {
  const { data: teams, error: tErr } = await svc
    .from("partner_teams")
    .select("id, name, created_by_partner_id, settings, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (tErr || !teams?.length) return [];

  const teamIds = teams.map((t) => String(t.id));
  const { data: memRows, error: mErr } = await svc
    .from("partner_team_members")
    .select("team_id, partner_id, role, joined_at")
    .in("team_id", teamIds);

  if (mErr || !memRows?.length) {
    return teams.map((t) => ({
      id: String(t.id),
      name: String(t.name),
      created_by_partner_id: String(t.created_by_partner_id),
      created_at: String(t.created_at),
      updated_at: String(t.updated_at),
      provision_visibility: parseTeamSettings(t.settings).provision_visibility,
      members: [],
      pending_invites: [],
    }));
  }

  const { data: invRows } = await svc
    .from("partner_team_invitations")
    .select("id, team_id, invited_partner_id, expires_at")
    .in("team_id", teamIds)
    .is("consumed_at", null);

  const invitesByTeam = new Map<string, AdminTeamInviteOverview[]>();
  for (const row of invRows ?? []) {
    const tid = String((row as { team_id: string }).team_id);
    const invitedId = String((row as { invited_partner_id: string }).invited_partner_id);
    const list = invitesByTeam.get(tid) ?? [];
    list.push({
      id: String((row as { id: string }).id),
      invited_partner_id: invitedId,
      email: authById[invitedId]?.email ?? "—",
      expires_at: String((row as { expires_at: string }).expires_at),
    });
    invitesByTeam.set(tid, list);
  }

  const membersByTeam = new Map<string, AdminTeamMemberOverview[]>();
  for (const raw of memRows) {
    const tid = String((raw as { team_id: string }).team_id);
    const pid = String((raw as { partner_id: string }).partner_id);
    const prof = profileById.get(pid);
    const slice = prof ?? ({} as PartnerProfile);
    const email = authById[pid]?.email ?? "—";
    const display_name = partnerTeamMemberLabel(
      {
        first_name: slice.first_name ?? null,
        last_name: slice.last_name ?? null,
        display_name: slice.display_name ?? null,
        organization_name: slice.organization_name ?? null,
      },
      email !== "—" ? email : undefined,
    );
    const list = membersByTeam.get(tid) ?? [];
    list.push({
      partner_id: pid,
      role: (raw as { role: string }).role as "owner" | "member",
      joined_at: String((raw as { joined_at: string }).joined_at),
      email,
      display_name,
      partner_referral_code: slice.partner_referral_code?.trim() ?? null,
    });
    membersByTeam.set(tid, list);
  }

  for (const [, list] of membersByTeam) {
    list.sort((a, b) => {
      if (a.role !== b.role) return a.role === "owner" ? -1 : 1;
      return a.display_name.localeCompare(b.display_name, "de");
    });
  }

  return teams.map((t) => {
    const id = String(t.id);
    return {
      id,
      name: String(t.name),
      created_by_partner_id: String(t.created_by_partner_id),
      created_at: String(t.created_at),
      updated_at: String(t.updated_at),
      provision_visibility: parseTeamSettings(t.settings).provision_visibility,
      members: membersByTeam.get(id) ?? [],
      pending_invites: invitesByTeam.get(id) ?? [],
    };
  });
}
