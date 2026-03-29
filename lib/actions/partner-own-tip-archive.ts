"use server";

import { revalidatePath } from "next/cache";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { archivePartnerTipSchema } from "@/lib/validations/partner-admin";

export type PartnerOwnArchiveState = { ok: true; message?: string } | { ok: false; message: string };

/**
 * Partner archiviert eigene Tippzeile oder holt sie zurück (nur partner_id = Session).
 */
export async function archiveOwnPartnerTipAction(
  _prev: PartnerOwnArchiveState | null,
  formData: FormData,
): Promise<PartnerOwnArchiveState> {
  const { userId } = await requirePartnerLogin();

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
    .select("partner_id")
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

  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/statistik");
  return { ok: true, message: archivedAt ? "In Ihr Archiv verschoben." : "Wieder in den aktiven Listen." };
}
