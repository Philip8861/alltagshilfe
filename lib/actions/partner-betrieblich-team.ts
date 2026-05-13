"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { rateLimitWithConfig } from "@/lib/rate-limit";
import { requirePartnerLogin } from "@/lib/partner/auth";
import {
  BETRIEBLICHE_PFLEGEBERATUNG_SLUG,
  PARTNER_TEAM_MAX_MEMBERSHIPS,
  type PartnerTeamSettings,
  parseTeamSettings,
} from "@/lib/partner/betrieblich-team-types";
import { partnerTeamInviteFormalInviter } from "@/lib/partner/betrieblich-team-member-label";
import { fetchBetrieblichTeamsOverview } from "@/lib/partner/betrieblich-team-queries";
import { countPartnerTeamMemberships, partnersShareATeamExcluding } from "@/lib/partner/betrieblich-team-pair";
import type { PartnerProfile } from "@/lib/partner/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { resolvePartnerProfileId } from "@/lib/supabase/service";
import { sendTransactionalMail } from "@/lib/email/internal-smtp";
import { buildPartnerTeamInviteEmailHtml, partnerTeamInviteSubject } from "@/lib/email/partner-team-invite-email";
import { siteConfig } from "@/config/site";
import { uuidStringsEqual } from "@/lib/partner/uuid-strings-equal";
import {
  partnerReferralCodeInputSchema,
  teamNameSchema,
  teamProvisionVisibilitySchema,
  teamTokenSchema,
} from "@/lib/validations/partner-betrieblich-team";

export type BetrieblichTeamActionResult = { ok: true } | { ok: false; message: string };

const INVITE_VALID_DAYS = 14;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

function assertBetrieblich(profile: PartnerProfile): BetrieblichTeamActionResult | null {
  if (!profile.responsibility_areas?.includes(BETRIEBLICHE_PFLEGEBERATUNG_SLUG)) {
    return { ok: false, message: "Diese Funktion steht nur Partnern mit betrieblicher Pflegeberatung zur Verfügung." };
  }
  return null;
}

export async function fetchBetrieblichTeamPageDataAction(): Promise<
  { ok: true; teams: Awaited<ReturnType<typeof fetchBetrieblichTeamsOverview>> } | { ok: false; message: string }
> {
  const { profile } = await requirePartnerLogin();
  if (!profile.responsibility_areas?.includes(BETRIEBLICHE_PFLEGEBERATUNG_SLUG)) {
    return { ok: false, message: "Diese Funktion steht nur Partnern mit betrieblicher Pflegeberatung zur Verfügung." };
  }
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };
  const teams = await fetchBetrieblichTeamsOverview(svc, profile.id);
  return { ok: true, teams };
}

export async function createBetrieblichTeamAction(rawName: unknown): Promise<BetrieblichTeamActionResult> {
  const { profile } = await requirePartnerLogin();
  const gate = assertBetrieblich(profile);
  if (gate) return gate;
  const parsed = teamNameSchema.safeParse(rawName);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };

  const { success: rl } = rateLimitWithConfig(`partner-team-create:${profile.id}`, 10, 60 * 60 * 1000);
  if (!rl) return { ok: false, message: "Zu viele Versuche. Bitte später erneut versuchen." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };

  const n = await countPartnerTeamMemberships(svc, profile.id);
  if (n === null) return { ok: false, message: "Teams konnten nicht geladen werden." };
  if (n >= PARTNER_TEAM_MAX_MEMBERSHIPS) {
    return { ok: false, message: `Sie sind bereits in ${PARTNER_TEAM_MAX_MEMBERSHIPS} Teams — weitere Gründung ist nicht möglich.` };
  }

  const { data: team, error: insErr } = await svc
    .from("partner_teams")
    .insert({
      name: parsed.data,
      created_by_partner_id: profile.id,
      settings: { provision_visibility: "owner_sees_all" },
    })
    .select("id")
    .single();

  if (insErr || !team?.id) {
    console.error("[createBetrieblichTeamAction]", insErr?.message);
    return { ok: false, message: "Team konnte nicht angelegt werden." };
  }

  const tid = String(team.id);
  const { error: memErr } = await svc.from("partner_team_members").insert({ team_id: tid, partner_id: profile.id, role: "owner" });
  if (memErr) {
    console.error("[createBetrieblichTeamAction] member", memErr.message);
    await svc.from("partner_teams").delete().eq("id", tid);
    return { ok: false, message: "Team konnte nicht fertiggestellt werden." };
  }

  revalidatePath("/partner/team");
  revalidatePath("/partner/dashboard");
  return { ok: true };
}

export async function renameBetrieblichTeamAction(teamId: unknown, rawName: unknown): Promise<BetrieblichTeamActionResult> {
  const { profile } = await requirePartnerLogin();
  const gate = assertBetrieblich(profile);
  if (gate) return gate;
  const id = typeof teamId === "string" ? teamId.trim() : "";
  const parsed = teamNameSchema.safeParse(rawName);
  if (!id || !parsed.success) return { ok: false, message: parsed.success ? "Team nicht gefunden." : parsed.error.issues[0]?.message ?? "Ungültig." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };

  const { data: mem, error: mErr } = await svc
    .from("partner_team_members")
    .select("role")
    .eq("team_id", id)
    .eq("partner_id", profile.id)
    .maybeSingle();
  if (mErr || !mem || mem.role !== "owner") return { ok: false, message: "Nur die Gründer:in kann den Teamnamen ändern." };

  const { error: uErr } = await svc.from("partner_teams").update({ name: parsed.data }).eq("id", id);
  if (uErr) return { ok: false, message: "Speichern fehlgeschlagen." };
  revalidatePath("/partner/team");
  return { ok: true };
}

export async function updateBetrieblichTeamProvisionVisibilityAction(
  teamId: unknown,
  rawVisibility: unknown,
): Promise<BetrieblichTeamActionResult> {
  const { profile } = await requirePartnerLogin();
  const gate = assertBetrieblich(profile);
  if (gate) return gate;
  const id = typeof teamId === "string" ? teamId.trim() : "";
  const visParsed = teamProvisionVisibilitySchema.safeParse(rawVisibility);
  if (!id || !visParsed.success) return { ok: false, message: "Ungültige Eingabe." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };

  const { data: mem, error: mErr } = await svc
    .from("partner_team_members")
    .select("role")
    .eq("team_id", id)
    .eq("partner_id", profile.id)
    .maybeSingle();
  if (mErr || !mem || mem.role !== "owner") return { ok: false, message: "Nur die Gründer:in kann die Einstellungen ändern." };

  const { data: row, error: tErr } = await svc.from("partner_teams").select("settings").eq("id", id).single();
  if (tErr || !row) return { ok: false, message: "Team nicht gefunden." };
  const base = parseTeamSettings(row.settings);
  const next: PartnerTeamSettings = { ...base, provision_visibility: visParsed.data };

  const { error: uErr } = await svc.from("partner_teams").update({ settings: next }).eq("id", id);
  if (uErr) return { ok: false, message: "Speichern fehlgeschlagen." };
  revalidatePath("/partner/team");
  return { ok: true };
}

export async function inviteBetrieblichTeamByCodeAction(teamId: unknown, rawCode: unknown): Promise<BetrieblichTeamActionResult> {
  const { profile } = await requirePartnerLogin();
  const gate = assertBetrieblich(profile);
  if (gate) return gate;
  const id = typeof teamId === "string" ? teamId.trim() : "";
  const codeParsed = partnerReferralCodeInputSchema.safeParse(rawCode);
  if (!id || !codeParsed.success) return { ok: false, message: codeParsed.success ? "Team nicht gefunden." : codeParsed.error.issues[0]?.message ?? "Ungültig." };

  const { success: rl } = rateLimitWithConfig(`partner-team-invite:${profile.id}`, 30, 60 * 60 * 1000);
  if (!rl) return { ok: false, message: "Zu viele Einladungen. Bitte später erneut versuchen." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };

  const { data: myMem, error: meErr } = await svc
    .from("partner_team_members")
    .select("role")
    .eq("team_id", id)
    .eq("partner_id", profile.id)
    .maybeSingle();
  if (meErr || !myMem) return { ok: false, message: "Sie sind kein Mitglied dieses Teams." };

  const inviteeId = await resolvePartnerProfileId(svc, codeParsed.data);
  if (!inviteeId) return { ok: false, message: "Kein Partner mit diesem Code gefunden." };
  if (inviteeId === profile.id) return { ok: false, message: "Sie können sich nicht selbst einladen." };

  const { data: inviteeProf, error: ipErr } = await svc
    .from("partner_profiles")
    .select("responsibility_areas, first_name, last_name, display_name, organization_name, salutation")
    .eq("id", inviteeId)
    .maybeSingle();
  if (ipErr || !inviteeProf) return { ok: false, message: "Partnerprofil nicht gefunden." };
  const areas = (inviteeProf.responsibility_areas as string[] | null) ?? [];
  if (!areas.includes(BETRIEBLICHE_PFLEGEBERATUNG_SLUG)) {
    return { ok: false, message: "Der eingeladene Partner hat keine betriebliche Pflegeberatung freigeschaltet." };
  }

  const { data: teamMembers, error: tmErr } = await svc
    .from("partner_team_members")
    .select("partner_id")
    .eq("team_id", id);
  if (tmErr) return { ok: false, message: "Teammitglieder konnten nicht geladen werden." };

  for (const row of teamMembers ?? []) {
    const mid = String((row as { partner_id: string }).partner_id);
    if (mid === inviteeId) return { ok: false, message: "Dieser Partner ist bereits im Team." };
    const p = await partnersShareATeamExcluding(svc, mid, inviteeId, id);
    if ("error" in p) return { ok: false, message: "Prüfung der Teamregeln fehlgeschlagen." };
    if (p.shares) {
      return {
        ok: false,
        message:
          "Mit einem Mitglied dieses Teams sind Sie oder der eingeladene Partner bereits in einem anderen Team — Einladung nicht möglich.",
      };
    }
  }

  const invCount = await countPartnerTeamMemberships(svc, inviteeId);
  if (invCount === null) return { ok: false, message: "Einladung derzeit nicht möglich." };
  if (invCount >= PARTNER_TEAM_MAX_MEMBERSHIPS) {
    return { ok: false, message: "Der eingeladene Partner ist bereits in drei Teams." };
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + INVITE_VALID_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { error: invErr } = await svc.from("partner_team_invitations").insert({
    team_id: id,
    invited_partner_id: inviteeId,
    invited_by_partner_id: profile.id,
    token_hash: tokenHash,
    expires_at: expires,
  });
  if (invErr) {
    if (invErr.code === "23505") {
      return { ok: false, message: "Für diesen Partner liegt bereits eine offene Einladung vor." };
    }
    console.error("[inviteBetrieblichTeamByCodeAction]", invErr.message);
    return { ok: false, message: "Einladung konnte nicht erstellt werden." };
  }

  const { data: teamRow } = await svc.from("partner_teams").select("name").eq("id", id).single();
  const teamName = String(teamRow?.name ?? "Team");

  const { data: authUser, error: auErr } = await svc.auth.admin.getUserById(inviteeId);
  if (auErr || !authUser?.user?.email) {
    console.error("[inviteBetrieblichTeamByCodeAction] no email", auErr?.message);
    await svc.from("partner_team_invitations").delete().eq("token_hash", tokenHash);
    return { ok: false, message: "Für diesen Partner ist keine E-Mail-Adresse hinterlegt — Einladung nicht möglich." };
  }

  const joinUrl = `${siteConfig.baseUrl}/partner/team/einladung/${rawToken}`;
  const inviterFormal = partnerTeamInviteFormalInviter(profile as PartnerProfile);
  const html = buildPartnerTeamInviteEmailHtml({
    inviterFormalLine: inviterFormal,
    teamName,
    joinUrl,
  });
  const text = `${inviterFormal} lädt Sie in die Teamgruppe ${teamName} ein.\n\nJetzt beitreten: ${joinUrl}\n`;

  const sent = await sendTransactionalMail({
    to: authUser.user.email,
    subject: partnerTeamInviteSubject(teamName),
    text,
    html,
  });
  if (sent.ok !== true) {
    console.warn("[inviteBetrieblichTeamByCodeAction] mail", sent);
    await svc.from("partner_team_invitations").delete().eq("token_hash", tokenHash);
    return { ok: false, message: "E-Mail-Versand fehlgeschlagen. Bitte versuchen Sie es später erneut." };
  }

  revalidatePath("/partner/team");
  return { ok: true };
}

export type BetrieblichInvitePreview =
  | { ok: true; teamName: string; expiresAt: string; invitedPartnerId: string }
  | { ok: false; message: string };

export async function getBetrieblichTeamInvitePreviewAction(rawToken: unknown): Promise<BetrieblichInvitePreview> {
  const parsed = teamTokenSchema.safeParse(typeof rawToken === "string" ? rawToken : "");
  if (!parsed.success) return { ok: false, message: "Ungültige Einladung." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst nicht verfügbar." };

  const tokenHash = hashToken(parsed.data);
  const { data: inv, error } = await svc
    .from("partner_team_invitations")
    .select("id, team_id, invited_partner_id, expires_at, consumed_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !inv) return { ok: false, message: "Einladung nicht gefunden." };
  if (inv.consumed_at) return { ok: false, message: "Diese Einladung wurde bereits verwendet." };
  if (new Date(String(inv.expires_at)) < new Date()) return { ok: false, message: "Diese Einladung ist abgelaufen." };

  const { data: team } = await svc.from("partner_teams").select("name").eq("id", String(inv.team_id)).single();
  return {
    ok: true,
    teamName: String(team?.name ?? "Team"),
    expiresAt: String(inv.expires_at),
    invitedPartnerId: String(inv.invited_partner_id),
  };
}

export async function acceptBetrieblichTeamInviteAction(rawToken: unknown): Promise<BetrieblichTeamActionResult> {
  const { userId, profile } = await requirePartnerLogin();
  const gate = assertBetrieblich(profile);
  if (gate) return gate;
  const parsed = teamTokenSchema.safeParse(typeof rawToken === "string" ? rawToken : "");
  if (!parsed.success) return { ok: false, message: "Ungültige Einladung." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };

  const tokenHash = hashToken(parsed.data);
  const { data: inv, error: iErr } = await svc
    .from("partner_team_invitations")
    .select("id, team_id, invited_partner_id, expires_at, consumed_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (iErr || !inv) return { ok: false, message: "Einladung nicht gefunden." };
  if (inv.consumed_at) return { ok: false, message: "Bereits eingelöst." };
  if (new Date(String(inv.expires_at)) < new Date()) return { ok: false, message: "Abgelaufen." };
  if (!uuidStringsEqual(inv.invited_partner_id, userId)) {
    return {
      ok: false,
      message:
        "Diese Einladung ist für ein anderes Partnerkonto bestimmt. Bitte melden Sie sich ab und mit der E-Mail-Adresse an, an die die Einladung geschickt wurde.",
    };
  }

  const teamId = String(inv.team_id);

  const n = await countPartnerTeamMemberships(svc, userId);
  if (n === null) return { ok: false, message: "Konnte nicht beitreten." };
  if (n >= PARTNER_TEAM_MAX_MEMBERSHIPS) {
    return { ok: false, message: `Sie sind bereits in ${PARTNER_TEAM_MAX_MEMBERSHIPS} Teams.` };
  }

  const { data: existingMembers, error: emErr } = await svc
    .from("partner_team_members")
    .select("partner_id")
    .eq("team_id", teamId);
  if (emErr) return { ok: false, message: "Team konnte nicht geprüft werden." };

  for (const row of existingMembers ?? []) {
    const mid = String((row as { partner_id: string }).partner_id);
    const p = await partnersShareATeamExcluding(svc, mid, userId, teamId);
    if ("error" in p) return { ok: false, message: "Prüfung fehlgeschlagen." };
    if (p.shares) {
      return {
        ok: false,
        message: "Mit einem Mitglied dieses Teams sind Sie bereits in einem anderen Team — Beitritt nicht möglich.",
      };
    }
  }

  const { error: memErr } = await svc
    .from("partner_team_members")
    .insert({ team_id: teamId, partner_id: userId, role: "member" });
  if (memErr) {
    if (memErr.code === "23505") return { ok: false, message: "Sie sind bereits Mitglied." };
    console.error("[acceptBetrieblichTeamInviteAction]", memErr.message);
    return { ok: false, message: "Beitritt fehlgeschlagen." };
  }

  await svc.from("partner_team_invitations").update({ consumed_at: new Date().toISOString() }).eq("id", String(inv.id));

  revalidatePath("/partner/team");
  revalidatePath("/partner/dashboard");
  return { ok: true };
}

export async function leaveBetrieblichTeamAction(teamId: unknown): Promise<BetrieblichTeamActionResult> {
  const { profile } = await requirePartnerLogin();
  const gate = assertBetrieblich(profile);
  if (gate) return gate;
  const id = typeof teamId === "string" ? teamId.trim() : "";
  if (!id) return { ok: false, message: "Ungültig." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };

  const { data: mem } = await svc
    .from("partner_team_members")
    .select("role")
    .eq("team_id", id)
    .eq("partner_id", profile.id)
    .maybeSingle();
  if (!mem) return { ok: false, message: "Nicht im Team." };
  if (mem.role === "owner") {
    const { count } = await svc
      .from("partner_team_members")
      .select("team_id", { count: "exact", head: true })
      .eq("team_id", id);
    const c = count ?? 0;
    if (c > 1) {
      return {
        ok: false,
        message: "Als Gründer:in können Sie das Team bei weiteren Mitgliedern nicht nur verlassen — bitte wenden Sie sich an die Geschäftsstelle oder lösen Sie das Team auf.",
      };
    }
    await svc.from("partner_teams").delete().eq("id", id);
  } else {
    await svc.from("partner_team_members").delete().eq("team_id", id).eq("partner_id", profile.id);
  }

  revalidatePath("/partner/team");
  revalidatePath("/partner/dashboard");
  return { ok: true };
}

export async function dissolveBetrieblichTeamAction(teamId: unknown): Promise<BetrieblichTeamActionResult> {
  const { profile } = await requirePartnerLogin();
  const gate = assertBetrieblich(profile);
  if (gate) return gate;
  const id = typeof teamId === "string" ? teamId.trim() : "";
  if (!id) return { ok: false, message: "Ungültig." };

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };

  const { data: mem } = await svc
    .from("partner_team_members")
    .select("role")
    .eq("team_id", id)
    .eq("partner_id", profile.id)
    .maybeSingle();
  if (!mem || mem.role !== "owner") return { ok: false, message: "Nur die Gründer:in kann das Team auflösen." };

  await svc.from("partner_teams").delete().eq("id", id);
  revalidatePath("/partner/team");
  revalidatePath("/partner/dashboard");
  return { ok: true };
}
