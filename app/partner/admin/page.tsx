import { unstable_noStore as noStore } from "next/cache";
import { PartnerAdminDashboard } from "@/components/partner/admin/PartnerAdminDashboard";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";
import {
  normalizeAdminVisibleNote,
  normalizeArchivedAt,
  normalizePartnerTipAdminStatus,
} from "@/lib/partner/partner-tip-admin";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import { formatPayoutPeriodLabelDe } from "@/lib/partner/payout-period";
import type {
  PartnerAdminPayoutPeriod,
  PartnerProfile,
  PartnerTipSubmissionRow,
} from "@/lib/partner/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

type AuthUserInfo = {
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
};

const VALID_BEREICH = ["auftraege", "archiv", "anlegen", "liste", "statistik", "auszahlen"] as const;
type PartnerAdminInitialBereich = (typeof VALID_BEREICH)[number];

function normalizePayoutPeriodKey(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

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
  let payoutPeriods: PartnerAdminPayoutPeriod[] = [];
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
      const [profRes, tipsRes, ordRes, listRes, repRes] = await Promise.all([
        svc
          .from("partner_profiles")
          .select(
            "id, display_name, organization_name, role, created_at, updated_at, salutation, partner_referral_code, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at, iban, bic, account_holder",
          )
          .order("created_at", { ascending: false }),
        svc
          .from("partner_tip_submissions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500),
        svc
          .from("pflegebox_orders")
          .select("id, partner_id, external_reference, status, created_at, summary_json")
          .order("created_at", { ascending: false })
          .limit(200),
        svc.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        svc.from("partner_payout_reports").select("*").order("period_key", { ascending: false }).limit(5000),
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
          paid_amount_eur: normalizePaidAmountEur(row.paid_amount_eur),
          payout_settled_period_key: normalizePayoutPeriodKey(row.payout_settled_period_key),
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
      if (repRes.error) {
        console.error("[PartnerAdminPage] partner_payout_reports:", repRes.error.message);
      } else if (repRes.data?.length !== undefined) {
        const raw = repRes.data as Record<string, unknown>[];
        const byPeriod = new Map<string, Record<string, unknown>[]>();
        for (const r of raw) {
          const pk = String(r.period_key ?? "");
          if (!pk) continue;
          const list = byPeriod.get(pk) ?? [];
          list.push(r);
          byPeriod.set(pk, list);
        }
        const profileMap = new Map(profiles.map((p) => [p.id, p]));
        payoutPeriods = Array.from(byPeriod.entries())
          .sort((a, b) => b[0].localeCompare(a[0]))
          .map(([periodKey, list]) => ({
            periodKey,
            labelDe: formatPayoutPeriodLabelDe(periodKey),
            rows: list.map((r) => ({
              period_key: String(r.period_key),
              partner_id: String(r.partner_id),
              einmal_eur: Number(r.einmal_eur),
              monatlich_eur: Number(r.monatlich_eur),
              total_eur: Number(r.total_eur),
              created_at: r.created_at != null ? String(r.created_at) : undefined,
              email: authById[String(r.partner_id)]?.email ?? "—",
              profile: profileMap.get(String(r.partner_id)) ?? null,
            })),
          }));
      }
    } catch {
      profiles = [];
      tips = [];
      orders = [];
      payoutPeriods = [];
    }
  }

  return (
    <PartnerAdminDashboard
      hasServiceRole={Boolean(svc)}
      tips={tips}
      orders={orders}
      profiles={profiles}
      authById={authById}
      payoutPeriods={payoutPeriods}
      initialBereich={initialBereich}
    />
  );
}
