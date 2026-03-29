import type { Metadata } from "next";
import { PartnerDashboardClient } from "@/components/partner/PartnerDashboardClient";
import { requirePartnerLogin } from "@/lib/partner/auth";
import {
  normalizeAdminVisibleNote,
  normalizeArchivedAt,
  normalizePartnerTipAdminStatus,
} from "@/lib/partner/partner-tip-admin";
import { partnerPortalWelcomeLine } from "@/lib/partner/partner-portal-greeting";
import { nextPayoutDateInfo } from "@/lib/partner/partner-payout-date";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Übersicht",
};

type Search = { tip?: string };

export default async function PartnerDashboardPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { tip } = await searchParams;
  const { profile, email } = await requirePartnerLogin();

  let tips: PartnerDashboardTipSerial[] = [];
  try {
    const supabase = await createSupabaseServerClient();
    const tipRes = await supabase
      .from("partner_tip_submissions")
      .select("id, service_slug, payload, created_at, admin_status, admin_visible_note, archived_at")
      .eq("partner_id", profile.id)
      .order("created_at", { ascending: false });
    if (!tipRes.error && tipRes.data) {
      tips = (tipRes.data as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        service_slug: String(row.service_slug),
        payload: (row.payload as Record<string, unknown>) ?? {},
        created_at: String(row.created_at),
        admin_status: normalizePartnerTipAdminStatus(row.admin_status),
        admin_visible_note: normalizeAdminVisibleNote(row.admin_visible_note),
        archived_at: normalizeArchivedAt(row.archived_at),
      }));
    }
  } catch {
    tips = [];
  }

  const { labelDe: payoutLabel } = nextPayoutDateInfo();
  const welcomeLine = partnerPortalWelcomeLine(profile, email);
  const partnerCode = profile.partner_referral_code?.trim() || null;
  const responsibilityAreaSlugs = profile.responsibility_areas ?? [];

  return (
    <PartnerDashboardClient
      welcomeLine={welcomeLine}
      partnerCode={partnerCode}
      payoutLabel={payoutLabel}
      responsibilityAreaSlugs={responsibilityAreaSlugs}
      tips={tips}
      initialTipModalOpen={tip === "1"}
    />
  );
}
