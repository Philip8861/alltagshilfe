"use server";

import { revalidatePath } from "next/cache";
import { isPartnerAccountDisabled, PARTNER_ACCOUNT_DISABLED_MESSAGE, requirePartnerLogin } from "@/lib/partner/auth";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import {
  logPartnerPortalAuditEvent,
  partnerAuditDisplayLabel,
  serviceLabelDe,
} from "@/lib/partner/partner-portal-audit-log";
import { archivePartnerTipSchema } from "@/lib/validations/partner-admin";

export type PartnerOwnArchiveState = { ok: true; message?: string } | { ok: false; message: string };

/**
 * Partner archiviert eigene Tippzeile oder holt sie zurück (nur partner_id = Session).
 */
export async function archiveOwnPartnerTipAction(
  _prev: PartnerOwnArchiveState | null,
  formData: FormData,
): Promise<PartnerOwnArchiveState> {
  const { userId, profile } = await requirePartnerLogin();

  if (isPartnerAccountDisabled(profile)) {
    return { ok: false, message: PARTNER_ACCOUNT_DISABLED_MESSAGE };
  }

  const parsed = archivePartnerTipSchema.safeParse({
    tip_id: formData.get("tip_id"),
    archived: formData.get("archived"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Ungültige Eingabe." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "Dienst vorübergehend nicht verfügbar." };
  }

  const { data: row, error: fetchErr } = await svc
    .from("partner_tip_submissions")
    .select("partner_id, service_slug")
    .eq("id", parsed.data.tip_id)
    .maybeSingle();

  if (fetchErr || !row || String(row.partner_id) !== userId) {
    return { ok: false, message: "Eintrag nicht gefunden oder keine Berechtigung." };
  }

  const archivedAt = parsed.data.archived === "true" ? new Date().toISOString() : null;
  const { error } = await svc
    .from("partner_tip_submissions")
    .update({ partner_archived_at: archivedAt })
    .eq("id", parsed.data.tip_id)
    .eq("partner_id", userId);

  if (error) {
    const msg = (error.message ?? "").toLowerCase();
    if (msg.includes("partner_archived_at") && msg.includes("does not exist")) {
      return {
        ok: false,
        message: "Migration 012 (partner_archived_at) in Supabase ausführen.",
      };
    }
    return { ok: false, message: "Archiv konnte nicht gespeichert werden." };
  }

  const actorLabel = await partnerAuditDisplayLabel(svc, userId, profile?.display_name ?? undefined);
  await logPartnerPortalAuditEvent(svc, {
    event_kind: archivedAt ? "tip_partner_archived" : "tip_partner_unarchived",
    subject_partner_id: userId,
    actor_kind: "partner",
    actor_partner_id: userId,
    actor_label: actorLabel,
    tip_id: parsed.data.tip_id,
    summary: archivedAt
      ? `${serviceLabelDe(String(row.service_slug))}: In eigenes Archiv verschoben (nur Sortierung, keine Auswirkung auf Auszahlung).`
      : `${serviceLabelDe(String(row.service_slug))}: Aus eigenem Archiv zurück in die aktive Liste.`,
    detail_json: { service_slug: row.service_slug },
  });

  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/statistik");
  return { ok: true, message: archivedAt ? "In Ihr Archiv verschoben." : "Wieder in den aktiven Listen." };
}
