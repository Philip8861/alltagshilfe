import { unstable_noStore as noStore } from "next/cache";
import { PartnerAdminDashboard } from "@/components/partner/admin/PartnerAdminDashboard";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";
import {
  normalizeAdminVisibleNote,
  normalizeArchivedAt,
  normalizePartnerTipAdminStatus,
} from "@/lib/partner/partner-tip-admin";
import type { PartnerProfile, PartnerTipSubmissionRow } from "@/lib/partner/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

type AuthUserInfo = {
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
};

const VALID_BEREICH = ["auftraege", "archiv", "anlegen", "liste", "statistik"] as const;
type PartnerAdminInitialBereich = (typeof VALID_BEREICH)[number];

function parseBereich(v: string | undefined): PartnerAdminInitialBereich {
  if (v && (VALID_BEREICH as readonly string[]).includes(v)) return v as PartnerAdminInitialBereich;
  return "auftraege";
}

export default async function PartnerAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ bereich?: string }>;
}) {
  noStore();
  await requireSystemAdmin();
  const { bereich } = await searchParams;
  const initialBereich = parseBereich(bereich);

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
          .select("id, partner_id, service_slug, payload, created_at, admin_status, admin_visible_note, archived_at")
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
      if (tipsRes.error) {
        console.error("[PartnerAdminPage] partner_tip_submissions:", tipsRes.error.message);
      }
      if (!tipsRes.error && tipsRes.data) {
        tips = (tipsRes.data as Record<string, unknown>[]).map((row) => ({
          id: String(row.id),
          partner_id: String(row.partner_id),
          service_slug: String(row.service_slug),
          payload: (row.payload as Record<string, unknown>) ?? {},
          created_at: String(row.created_at),
          admin_status: normalizePartnerTipAdminStatus(row.admin_status),
          admin_visible_note: normalizeAdminVisibleNote(row.admin_visible_note),
          archived_at: normalizeArchivedAt(row.archived_at),
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
      initialBereich={initialBereich}
    />
  );
}
