"use server";

import { revalidatePath } from "next/cache";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { rateLimitWithConfig } from "@/lib/rate-limit";
import { teamNameSchema } from "@/lib/validations/partner-betrieblich-team";

export type PartnerTeamsAdminResult = { ok: true } | { ok: false; message: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseUuid(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return UUID_RE.test(s) ? s.toLowerCase() : null;
}

async function assertAdmin(): Promise<PartnerTeamsAdminResult | null> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht angemeldet." };
  }
  return null;
}

function rateAdmin(key: string): PartnerTeamsAdminResult | null {
  try {
    const { success } = rateLimitWithConfig(key, 40, 60 * 1000);
    if (!success) return { ok: false, message: "Zu viele Anfragen. Bitte kurz warten." };
  } catch {
    /* ignore */
  }
  return null;
}

/** Admin: Teamgruppe inkl. Mitgliedern und offenen Einladungen löschen. */
export async function adminDeletePartnerTeamAction(teamIdRaw: unknown): Promise<PartnerTeamsAdminResult> {
  const gate = await assertAdmin();
  if (gate) return gate;
  const teamId = parseUuid(teamIdRaw);
  if (!teamId) return { ok: false, message: "Ungültige Team-ID." };

  const rl = rateAdmin(`admin-del-team:${teamId}`);
  if (rl) return rl;

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst nicht verfügbar." };

  const { error } = await svc.from("partner_teams").delete().eq("id", teamId);
  if (error) {
    console.error("[adminDeletePartnerTeamAction]", error.message);
    return { ok: false, message: "Team konnte nicht gelöscht werden." };
  }

  revalidatePath("/partner/admin");
  revalidatePath("/partner/team");
  return { ok: true };
}

/** Admin: Teamnamen ändern. */
export async function adminRenamePartnerTeamAction(teamIdRaw: unknown, rawName: unknown): Promise<PartnerTeamsAdminResult> {
  const gate = await assertAdmin();
  if (gate) return gate;
  const teamId = parseUuid(teamIdRaw);
  if (!teamId) return { ok: false, message: "Ungültige Team-ID." };
  const parsed = teamNameSchema.safeParse(rawName);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Ungültiger Name." };

  const rl = rateAdmin(`admin-rename-team:${teamId}`);
  if (rl) return rl;

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst nicht verfügbar." };

  const { error } = await svc.from("partner_teams").update({ name: parsed.data }).eq("id", teamId);
  if (error) return { ok: false, message: "Speichern fehlgeschlagen." };

  revalidatePath("/partner/admin");
  revalidatePath("/partner/team");
  return { ok: true };
}

/**
 * Admin: Mitglied aus Team entfernen.
 * Wenn der/die letzte Person: Team löschen.
 * Wenn Gründer:in mit weiteren Mitgliedern: neue/n Gründer:in bestimmen (ältestes Beitrittsdatum).
 */
export async function adminRemovePartnerTeamMemberAction(
  teamIdRaw: unknown,
  partnerIdRaw: unknown,
): Promise<PartnerTeamsAdminResult> {
  const gate = await assertAdmin();
  if (gate) return gate;
  const teamId = parseUuid(teamIdRaw);
  const partnerId = parseUuid(partnerIdRaw);
  if (!teamId || !partnerId) return { ok: false, message: "Ungültige Eingabe." };

  const rl = rateAdmin(`admin-rm-member:${teamId}:${partnerId}`);
  if (rl) return rl;

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst nicht verfügbar." };

  const { data: rows, error: selErr } = await svc
    .from("partner_team_members")
    .select("partner_id, role, joined_at")
    .eq("team_id", teamId);

  if (selErr || !rows?.length) return { ok: false, message: "Team oder Mitglieder nicht gefunden." };

  const target = rows.find((r) => String((r as { partner_id: string }).partner_id) === partnerId);
  if (!target) return { ok: false, message: "Mitglied nicht im Team." };

  const role = (target as { role: string }).role;

  if (rows.length === 1) {
    const { error: delTErr } = await svc.from("partner_teams").delete().eq("id", teamId);
    if (delTErr) return { ok: false, message: "Team konnte nicht entfernt werden." };
    revalidatePath("/partner/admin");
    revalidatePath("/partner/team");
    return { ok: true };
  }

  const { error: delErr } = await svc.from("partner_team_members").delete().eq("team_id", teamId).eq("partner_id", partnerId);
  if (delErr) return { ok: false, message: "Mitglied konnte nicht entfernt werden." };

  if (role === "owner") {
    const remaining = rows
      .filter((r) => String((r as { partner_id: string }).partner_id) !== partnerId)
      .map((r) => ({
        partner_id: String((r as { partner_id: string }).partner_id),
        joined_at: String((r as { joined_at: string }).joined_at),
      }));
    remaining.sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime());
    const newOwner = remaining[0]?.partner_id;
    if (!newOwner) {
      return { ok: false, message: "Konnte keine neue Teamleitung setzen." };
    }
    await svc.from("partner_team_members").update({ role: "owner" }).eq("team_id", teamId).eq("partner_id", newOwner);
    await svc.from("partner_teams").update({ created_by_partner_id: newOwner }).eq("id", teamId);
  }

  revalidatePath("/partner/admin");
  revalidatePath("/partner/team");
  return { ok: true };
}

/** Admin: offene Einladung widerrufen. */
export async function adminRevokePartnerTeamInvitationAction(invitationIdRaw: unknown): Promise<PartnerTeamsAdminResult> {
  const gate = await assertAdmin();
  if (gate) return gate;
  const invitationId = parseUuid(invitationIdRaw);
  if (!invitationId) return { ok: false, message: "Ungültige Einladungs-ID." };

  const rl = rateAdmin(`admin-revoke-inv:${invitationId}`);
  if (rl) return rl;

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst nicht verfügbar." };

  const { error } = await svc.from("partner_team_invitations").delete().eq("id", invitationId);
  if (error) return { ok: false, message: "Einladung konnte nicht widerrufen werden." };

  revalidatePath("/partner/admin");
  revalidatePath("/partner/team");
  return { ok: true };
}
