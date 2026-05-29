import { unstable_noStore as noStore } from "next/cache";
import { PartnerAdminDashboard } from "@/components/partner/admin/PartnerAdminDashboard";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";
import {
  normalizeAdminVisibleNote,
  normalizeArchivedAt,
  normalizeFormerActiveCompanyAt,
  normalizePartnerArchivedAt,
  normalizePartnerTipAdminStatus,
} from "@/lib/partner/partner-tip-admin";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import { formatPayoutPeriodLabelDe, currentBerlinPeriodKey } from "@/lib/partner/payout-period";
import { fetchAllPartnerCommissionRates } from "@/lib/partner/partner-commission-rates";
import { fetchPartnerTipSubmissionRows } from "@/lib/partner/partner-tip-submissions-select";
import { fetchPartnerPortalAuditLog } from "@/lib/partner/partner-portal-audit-log";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type {
  PartnerAdminPayoutPeriod,
  PartnerProfile,
  PartnerTipSubmissionRow,
} from "@/lib/partner/types";

type AuthUserInfo = {
  email: string;
  created_at?: string;
  last_sign_in_at?: string | null;
};

const VALID_BEREICH = [
  "auftraege",
  "aktive_unternehmen",
  "archiv",
  "anlegen",
  "liste",
  "statistik",
  "auszahlen",
  "verlauf",
] as const;
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

const TIP_DEEP_LINK_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PARTNER_PROFILES_ADMIN_SELECT_WITH_DISABLED_AT =
  "id, display_name, organization_name, role, created_at, updated_at, salutation, partner_referral_code, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at, account_disabled_at, iban, bic, account_holder";

const PARTNER_PROFILES_ADMIN_SELECT_WITHOUT_DISABLED_AT =
  "id, display_name, organization_name, role, created_at, updated_at, salutation, partner_referral_code, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at, iban, bic, account_holder";

function isLikelyMissingAccountDisabledAtColumn(error: {
  message?: string;
  code?: string;
} | null): boolean {
  if (!error) return false;
  const m = String(error.message ?? "").toLowerCase();
  return (
    m.includes("account_disabled_at") &&
    (m.includes("does not exist") || m.includes("could not find") || m.includes("schema cache") || error.code === "42703")
  );
}

async function fetchPartnerProfilesForAdminPage(
  svc: NonNullable<ReturnType<typeof createSupabaseServiceRoleClient>>,
): Promise<{ profiles: PartnerProfile[]; errorMessage?: string }> {
  const first = await svc
    .from("partner_profiles")
    .select(PARTNER_PROFILES_ADMIN_SELECT_WITH_DISABLED_AT)
    .order("created_at", { ascending: false });
  if (!first.error && first.data) {
    return { profiles: (first.data as PartnerProfile[]) ?? [] };
  }
  if (first.error && isLikelyMissingAccountDisabledAtColumn(first.error)) {
    const second = await svc
      .from("partner_profiles")
      .select(PARTNER_PROFILES_ADMIN_SELECT_WITHOUT_DISABLED_AT)
      .order("created_at", { ascending: false });
    if (!second.error && second.data) {
      console.warn(
        "[PartnerAdminPage] partner_profiles ohne account_disabled_at geladen — Migration 025 in Supabase ausführen.",
      );
      return { profiles: (second.data as PartnerProfile[]) ?? [] };
    }
    return { profiles: [], errorMessage: second.error?.message ?? first.error.message };
  }
  return {
    profiles: [],
    errorMessage: first.error?.message ?? "partner_profiles konnte nicht geladen werden.",
  };
}

function partnerDisplayLabel(
  profile: PartnerProfile,
  email?: string | null,
): string {
  const name =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim() ||
    profile.display_name?.trim() ||
    email?.trim() ||
    profile.id.slice(0, 8);
  const code = profile.partner_referral_code?.trim() ?? "";
  return code ? `${name} (${code})` : name;
}

/** Query `tipp` für E-Mail-Deep-Link (UUID). Ungültige Werte ignorieren. */
function parseFocusTipId(v: string | undefined): string | null {
  const s = v?.trim();
  if (!s || !TIP_DEEP_LINK_ID_RE.test(s)) return null;
  return s;
}

export default async function PartnerAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ bereich?: string; tipp?: string }>;
}) {
  noStore();
  await requireSystemAdmin();
  const { bereich, tipp } = await searchParams;
  const initialBereich = parseBereich(bereich);
  const initialFocusTipId = parseFocusTipId(tipp);

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
  let commissionRatesByPartnerId: Awaited<ReturnType<typeof fetchAllPartnerCommissionRates>> = {};
  let initialAuditLog: Awaited<ReturnType<typeof fetchPartnerPortalAuditLog>> = [];
  const defaultAuditPeriodKey = currentBerlinPeriodKey();

  if (svc) {
    try {
      const profilesPromise = fetchPartnerProfilesForAdminPage(svc);
      const [ordRes, listRes, repRes, tipPack] = await Promise.all([
        svc
          .from("pflegebox_orders")
          .select("id, partner_id, external_reference, status, created_at, summary_json")
          .order("created_at", { ascending: false })
          .limit(200),
        svc.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        svc.from("partner_payout_reports").select("*").order("period_key", { ascending: false }).limit(5000),
        fetchPartnerTipSubmissionRows((sel) =>
          svc.from("partner_tip_submissions").select(sel).order("created_at", { ascending: false }).limit(500),
        ),
      ]);

      const loadedProfilesResult = await profilesPromise;
      profiles = loadedProfilesResult.profiles;
      if (loadedProfilesResult.errorMessage) {
        console.error("[PartnerAdminPage] partner_profiles:", loadedProfilesResult.errorMessage);
      }
      tips = tipPack.rows.map((row) => ({
        id: String(row.id),
        partner_id: String(row.partner_id),
        service_slug: String(row.service_slug),
        payload: (row.payload as Record<string, unknown>) ?? {},
        created_at: String(row.created_at),
        admin_status: normalizePartnerTipAdminStatus(row.admin_status),
        admin_visible_note: normalizeAdminVisibleNote(row.admin_visible_note),
        archived_at: normalizeArchivedAt(row.archived_at),
        partner_archived_at: tipPack.hasM012Columns
          ? normalizePartnerArchivedAt(row.partner_archived_at)
          : null,
        former_active_company_at: tipPack.hasM012Columns
          ? normalizeFormerActiveCompanyAt(row.former_active_company_at)
          : null,
        paid_amount_eur: normalizePaidAmountEur(row.paid_amount_eur),
        payout_settled_period_key: normalizePayoutPeriodKey(row.payout_settled_period_key),
      }));
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
      commissionRatesByPartnerId = await fetchAllPartnerCommissionRates(svc);
      initialAuditLog = await fetchPartnerPortalAuditLog(svc, { limit: 300 });
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
              id: String(r.id),
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
      commissionRatesByPartnerId = {};
      initialAuditLog = [];
    }
  }

  const auditSubjectLabels: Record<string, string> = {};
  for (const p of profiles) {
    auditSubjectLabels[p.id] = partnerDisplayLabel(p, authById[p.id]?.email);
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
      initialFocusTipId={initialFocusTipId}
      commissionRatesByPartnerId={commissionRatesByPartnerId}
      initialAuditLog={initialAuditLog}
      auditSubjectLabels={auditSubjectLabels}
      defaultAuditPeriodKey={defaultAuditPeriodKey}
    />
  );
}
