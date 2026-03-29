import { isSupabaseMissingColumnError } from "@/lib/partner/supabase-schema-errors";

/** Ohne Migration 012 (partner_archived_at, former_active_company_at). */
export const PARTNER_TIP_SUBMISSIONS_SELECT_MINIMAL =
  "id, partner_id, service_slug, payload, created_at, admin_status, admin_visible_note, archived_at, paid_amount_eur, payout_settled_period_key";

export const PARTNER_TIP_SUBMISSIONS_SELECT_WITH_M012 = `${PARTNER_TIP_SUBMISSIONS_SELECT_MINIMAL}, partner_archived_at, former_active_company_at`;

/**
 * Lädt Tipps; bei fehlender Migration 012 oder veraltetem Schema-Cache Fallback ohne optionale Spalten.
 */
export async function fetchPartnerTipSubmissionRows(
  buildQuery: (
    selectList: string,
  ) => PromiseLike<{ data: unknown; error: { message?: string; code?: string } | null }>,
): Promise<{ rows: Record<string, unknown>[]; hasM012Columns: boolean }> {
  const first = await Promise.resolve(buildQuery(PARTNER_TIP_SUBMISSIONS_SELECT_WITH_M012));
  if (!first.error && first.data != null) {
    return { rows: (first.data as Record<string, unknown>[]) ?? [], hasM012Columns: true };
  }
  if (first.error && isSupabaseMissingColumnError(first.error)) {
    const second = await Promise.resolve(buildQuery(PARTNER_TIP_SUBMISSIONS_SELECT_MINIMAL));
    if (second.error) {
      console.error("[fetchPartnerTipSubmissionRows] fallback:", second.error.message);
      return { rows: [], hasM012Columns: false };
    }
    return { rows: (second.data as Record<string, unknown>[]) ?? [], hasM012Columns: false };
  }
  if (first.error) {
    console.error("[fetchPartnerTipSubmissionRows]:", first.error.message);
  }
  return { rows: [], hasM012Columns: false };
}
