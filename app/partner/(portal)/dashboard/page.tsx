import type { Metadata } from "next";
import { PartnerDashboardClient } from "@/components/partner/PartnerDashboardClient";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { partnerOrderStats } from "@/lib/partner/dashboard-order-utils";
import { partnerDashboardWelcomeHeadline } from "@/lib/partner/partner-portal-greeting";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import type { PflegeboxOrderRow } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Übersicht",
};

export default async function PartnerDashboardPage() {
  const { profile, email } = await requirePartnerLogin();

  let orders: PflegeboxOrderRow[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("pflegebox_orders")
      .select("id, partner_id, external_reference, status, summary_json, created_at")
      .eq("partner_id", profile.id)
      .order("created_at", { ascending: false });
    orders = (data as PflegeboxOrderRow[] | null) ?? [];
  } catch {
    orders = [];
  }

  const stats = partnerOrderStats(orders);
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
      stats={stats}
      orders={ordersSerial}
    />
  );
}
