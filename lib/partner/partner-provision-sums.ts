import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

/** Summen: Monatlich bei erledigt/bezahlt (betriebl. Pflegeberatung), Einmal nur bei bezahlt. */
export function partnerProvisionSumsFromTips(tips: PartnerDashboardTipSerial[]): {
  provisionMonatlichEur: number;
  provisionEinmalEur: number;
} {
  let provisionMonatlichEur = 0;
  let provisionEinmalEur = 0;
  for (const t of tips) {
    if (t.archived_at) continue;
    const n = Number(t.paid_amount_eur);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (provisionBucketForServiceSlug(t.service_slug) === "monatlich") {
      if (t.admin_status === "erledigt" || t.admin_status === "bezahlt") provisionMonatlichEur += n;
    } else if (t.admin_status === "bezahlt") {
      provisionEinmalEur += n;
    }
  }
  return { provisionMonatlichEur, provisionEinmalEur };
}
