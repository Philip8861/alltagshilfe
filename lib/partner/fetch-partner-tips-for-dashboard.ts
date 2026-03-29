import {
  normalizeAdminVisibleNote,
  normalizeArchivedAt,
  normalizePartnerArchivedAt,
  normalizePartnerTipAdminStatus,
} from "@/lib/partner/partner-tip-admin";
import { fetchPartnerTipSubmissionRows } from "@/lib/partner/partner-tip-submissions-select";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

function normalizePayoutPeriodKey(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function mapRows(data: Record<string, unknown>[], hasM012: boolean): PartnerDashboardTipSerial[] {
  return data.map((row) => ({
    id: String(row.id),
    service_slug: String(row.service_slug),
    payload: (row.payload as Record<string, unknown>) ?? {},
    created_at: String(row.created_at),
    admin_status: normalizePartnerTipAdminStatus(row.admin_status),
    admin_visible_note: normalizeAdminVisibleNote(row.admin_visible_note),
    archived_at: normalizeArchivedAt(row.archived_at),
    partner_archived_at: hasM012 ? normalizePartnerArchivedAt(row.partner_archived_at) : null,
    paid_amount_eur: normalizePaidAmountEur(row.paid_amount_eur),
    payout_settled_period_key: normalizePayoutPeriodKey(row.payout_settled_period_key),
  }));
}

/**
 * Tipps für das Partner-Dashboard: zuerst Service-Role (umgeht RLS/Cookie-Probleme bei Server Components),
 * sonst Session-Client. Nur nach erfolgreicher Auth mit dieser partnerId aufrufen.
 */
export async function fetchPartnerTipsForDashboard(partnerId: string): Promise<PartnerDashboardTipSerial[]> {
  const svc = createSupabaseServiceRoleClient();
  if (svc) {
    const pack = await fetchPartnerTipSubmissionRows((sel) =>
      svc.from("partner_tip_submissions").select(sel).eq("partner_id", partnerId).order("created_at", { ascending: false }),
    );
    return mapRows(pack.rows, pack.hasM012Columns);
  }

  const supabase = await createSupabaseServerClient();
  const pack = await fetchPartnerTipSubmissionRows((sel) =>
    supabase.from("partner_tip_submissions").select(sel).eq("partner_id", partnerId).order("created_at", { ascending: false }),
  );
  return mapRows(pack.rows, pack.hasM012Columns);
}
