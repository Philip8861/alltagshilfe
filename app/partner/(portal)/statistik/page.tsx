import type { Metadata } from "next";
import { PartnerStatistikView } from "@/components/partner/PartnerStatistikView";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { fetchPartnerTipsForDashboard } from "@/lib/partner/fetch-partner-tips-for-dashboard";
import type { PartnerDashboardTipSerial, PflegeboxOrderRow } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Statistik",
};

export default async function PartnerStatistikPage() {
  const { profile } = await requirePartnerLogin();

  let orders: PflegeboxOrderRow[] = [];
  let tips: PartnerDashboardTipSerial[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const [ordRes, tipsResult] = await Promise.all([
      supabase
        .from("pflegebox_orders")
        .select("id, partner_id, status, created_at")
        .eq("partner_id", profile.id)
        .order("created_at", { ascending: false }),
      fetchPartnerTipsForDashboard(profile.id),
    ]);
    orders = (ordRes.data as PflegeboxOrderRow[] | null) ?? [];
    tips = tipsResult;
  } catch {
    orders = [];
    tips = [];
  }

  const ordersSerial = orders.map((row) => ({
    created_at: row.created_at,
    status: row.status,
  }));

  return <PartnerStatistikView tips={tips} orders={ordersSerial} />;
}
