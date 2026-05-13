import type { PartnerProfile } from "@/lib/partner/types";

export const BETRIEBLICHE_PFLEGEBERATUNG_SLUG = "betriebliche_pflegeberatung" as const;

/** Max. gleichzeitige Team-Mitgliedschaften je Partner (Anforderung). */
export const PARTNER_TEAM_MAX_MEMBERSHIPS = 3;

export type TeamProvisionVisibility = "all" | "owner_sees_all" | "self_only";

export type PartnerTeamSettings = {
  provision_visibility: TeamProvisionVisibility;
};

export const DEFAULT_TEAM_SETTINGS: PartnerTeamSettings = {
  provision_visibility: "owner_sees_all",
};

export function parseTeamSettings(raw: unknown): PartnerTeamSettings {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_TEAM_SETTINGS };
  const o = raw as Record<string, unknown>;
  const v = o.provision_visibility;
  if (v === "all" || v === "owner_sees_all" || v === "self_only") {
    return { provision_visibility: v };
  }
  return { ...DEFAULT_TEAM_SETTINGS };
}

export type BetrieblichTeamMemberStat = {
  partner_id: string;
  code: string | null;
  label: string;
  /** Sichtbarkeit: `null` = ausgeblendet laut Team-Einstellungen (nicht null für eigene Zeile). */
  monatlich_eur: number | null;
  /** Siehe `monatlich_eur`. */
  abschluesse: number | null;
};

export type BetrieblichTeamMemberRow = {
  partner_id: string;
  role: "owner" | "member";
  joined_at: string;
  profile: Pick<PartnerProfile, "first_name" | "last_name" | "display_name" | "organization_name" | "partner_referral_code" | "salutation">;
};

export type BetrieblichTeamSummary = {
  id: string;
  name: string;
  created_by_partner_id: string;
  settings: PartnerTeamSettings;
  my_role: "owner" | "member";
  members: BetrieblichTeamMemberRow[];
  /** Bereits nach Sichtbarkeitsregeln für den aktuellen Betrachter gefiltert. */
  member_stats: BetrieblichTeamMemberStat[];
  pending_invites_count: number;
};

export function partnerHasBetrieblichPflegeberatung(profile: PartnerProfile | null | undefined): boolean {
  const areas = profile?.responsibility_areas;
  if (!areas?.length) return false;
  return areas.includes(BETRIEBLICHE_PFLEGEBERATUNG_SLUG);
}
