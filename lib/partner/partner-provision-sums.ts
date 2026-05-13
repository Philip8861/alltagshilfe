import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

/** Summen: Monatlich bei Vertragsabschluss erfolgreich (betriebl. Pflegeberatung), Einmal ebenfalls dort (andere Slugs). */
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
    if (t.admin_status !== "vertragsabschluss_erfolgreich") continue;
    if (provisionBucketForServiceSlug(t.service_slug) === "monatlich") {
      provisionMonatlichEur += n;
    } else {
      provisionEinmalEur += n;
    }
  }
  return { provisionMonatlichEur, provisionEinmalEur };
}
