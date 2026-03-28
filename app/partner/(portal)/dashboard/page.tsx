import type { Metadata } from "next";
import { PartnerDashboardClient } from "@/components/partner/PartnerDashboardClient";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { normalizePartnerTipAdminStatus } from "@/lib/partner/partner-tip-admin";
import { partnerDashboardWelcomeHeadline } from "@/lib/partner/partner-portal-greeting";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import type { PartnerDashboardTipSerial, PflegeboxOrderRow } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Übersicht",
};

export default async function PartnerDashboardPage() {
  const { profile, email } = await requirePartnerLogin();

  let orders: PflegeboxOrderRow[] = [];
  let tips: PartnerDashboardTipSerial[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const [ordRes, tipRes] = await Promise.all([
      supabase
        .from("pflegebox_orders")
        .select("id, partner_id, external_reference, status, summary_json, created_at")
        .eq("partner_id", profile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("partner_tip_submissions")
        .select("id, service_slug, payload, created_at, admin_status")
        .eq("partner_id", profile.id)
        .order("created_at", { ascending: false }),
    ]);
    orders = (ordRes.data as PflegeboxOrderRow[] | null) ?? [];
    if (!tipRes.error && tipRes.data) {
      tips = (tipRes.data as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        service_slug: String(row.service_slug),
        payload: (row.payload as Record<string, unknown>) ?? {},
        created_at: String(row.created_at),
        admin_status: normalizePartnerTipAdminStatus(row.admin_status),
      }));
    }
  } catch {
    orders = [];
    tips = [];
  }

  const { labelDe: payoutLabel, isoDate: payoutIso } = nextPayoutDateInfo();
  const welcomeHeadline = partnerDashboardWelcomeHeadline(profile, email);
  const partnerCode = profile.partner_referral_code?.trim() || null;
  const responsibilityAreaSlugs = profile.responsibility_areas ?? [];

  const ordersSerial = orders.map((row) => ({
    id: row.id,
    external_reference: row.external_reference,
    status: row.status,
    created_at: row.created_at,
    summary_json: row.summary_json as Record<string, unknown> | null,
  }));

  return (
    <PartnerDashboardClient
      welcomeHeadline={welcomeHeadline}
      partnerCode={partnerCode}
      payoutLabel={payoutLabel}
      payoutIso={payoutIso}
      responsibilityAreaSlugs={responsibilityAreaSlugs}
      orders={ordersSerial}
      tips={tips}
    />
  );
}
