import {
  normalizeAdminVisibleNote,
  normalizeArchivedAt,
  normalizePartnerArchivedAt,
  normalizePartnerTipAdminStatus,
} from "@/lib/partner/partner-tip-admin";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

/** Alle Spalten: funktioniert auch wenn Migration 009 (Notiz/Archiv) auf der DB noch fehlt. */
const TIP_SELECT = "*" as const;

function normalizePayoutPeriodKey(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function mapRows(data: Record<string, unknown>[]): PartnerDashboardTipSerial[] {
  return data.map((row) => ({
    id: String(row.id),
    service_slug: String(row.service_slug),
    payload: (row.payload as Record<string, unknown>) ?? {},
    created_at: String(row.created_at),
    admin_status: normalizePartnerTipAdminStatus(row.admin_status),
    admin_visible_note: normalizeAdminVisibleNote(row.admin_visible_note),
    archived_at: normalizeArchivedAt(row.archived_at),
    partner_archived_at: normalizePartnerArchivedAt(row.partner_archived_at),
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
    const res = await svc
      .from("partner_tip_submissions")
      .select(TIP_SELECT)
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });
    if (res.error) {
      console.error("[fetchPartnerTipsForDashboard] service_role:", res.error.message, res.error.code);
    } else if (res.data?.length !== undefined) {
      return mapRows(res.data as Record<string, unknown>[]);
    }
  }

  const supabase = await createSupabaseServerClient();
  const res = await supabase
    .from("partner_tip_submissions")
    .select(TIP_SELECT)
    .eq("partner_id", partnerId)
    .order("created_at", { ascending: false });

  if (res.error) {
    console.error("[fetchPartnerTipsForDashboard] user client:", res.error.message, res.error.code);
    return [];
  }
  if (!res.data) return [];
  return mapRows(res.data as Record<string, unknown>[]);
}
