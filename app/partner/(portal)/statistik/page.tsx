import type { Metadata } from "next";
import { PartnerStatistikView } from "@/components/partner/PartnerStatistikView";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { normalizePartnerTipAdminStatus } from "@/lib/partner/partner-tip-admin";
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
    const [ordRes, tipRes] = await Promise.all([
      supabase
        .from("pflegebox_orders")
        .select("id, partner_id, status, created_at")
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

  const ordersSerial = orders.map((row) => ({
    created_at: row.created_at,
    status: row.status,
  }));

  return <PartnerStatistikView tips={tips} orders={ordersSerial} />;
}
