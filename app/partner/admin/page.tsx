import { PartnerAdminDashboard } from "@/components/partner/admin/PartnerAdminDashboard";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";
import type { PartnerTipAdminStatus, PartnerProfile, PartnerTipSubmissionRow } from "@/lib/partner/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

type AuthUserInfo = {
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
};

function normalizeTipStatus(v: unknown): PartnerTipAdminStatus {
  if (v === "in_bearbeitung" || v === "erledigt" || v === "abgelehnt" || v === "neu") return v;
  return "neu";
}

export default async function PartnerAdminPage() {
  await requireSystemAdmin();

  const svc = createSupabaseServiceRoleClient();

  let profiles: PartnerProfile[] = [];
  const authById: Record<string, AuthUserInfo> = {};
  let tips: PartnerTipSubmissionRow[] = [];
  let orders: {
    id: string;
    partner_id: string | null;
    external_reference: string | null;
    status: string;
    created_at: string;
    summary_json: Record<string, unknown> | null;
  }[] = [];

  if (svc) {
    try {
      const [profRes, tipsRes, ordRes, listRes] = await Promise.all([
        svc
          .from("partner_profiles")
          .select(
            "id, display_name, organization_name, role, created_at, updated_at, salutation, partner_referral_code, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at",
          )
          .order("created_at", { ascending: false }),
        svc
          .from("partner_tip_submissions")
          .select("id, partner_id, service_slug, payload, created_at, admin_status")
          .order("created_at", { ascending: false })
          .limit(500),
        svc
          .from("pflegebox_orders")
          .select("id, partner_id, external_reference, status, created_at, summary_json")
          .order("created_at", { ascending: false })
          .limit(200),
        svc.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      ]);

      profiles = (profRes.data as PartnerProfile[] | null) ?? [];
      if (!tipsRes.error && tipsRes.data) {
        tips = (tipsRes.data as Record<string, unknown>[]).map((row) => ({
          id: String(row.id),
          partner_id: String(row.partner_id),
          service_slug: String(row.service_slug),
          payload: (row.payload as Record<string, unknown>) ?? {},
          created_at: String(row.created_at),
          admin_status: normalizeTipStatus(row.admin_status),
        }));
      }
      orders = (ordRes.data as typeof orders | null) ?? [];
      if (!listRes.error && listRes.data?.users) {
        for (const u of listRes.data.users) {
          authById[u.id] = {
            email: u.email ?? "",
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at ?? null,
          };
        }
      }
    } catch {
      profiles = [];
      tips = [];
      orders = [];
    }
  }

  return (
    <PartnerAdminDashboard
      hasServiceRole={Boolean(svc)}
      tips={tips}
      orders={orders}
      profiles={profiles}
      authById={authById}
    />
  );
}
