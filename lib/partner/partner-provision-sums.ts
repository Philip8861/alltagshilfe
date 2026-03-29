import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

/** Summen bezahlter Provisionen je Liste (nur Status bezahlt mit Betrag). */
export function partnerProvisionSumsFromTips(tips: PartnerDashboardTipSerial[]): {
  provisionMonatlichEur: number;
  provisionEinmalEur: number;
} {
  let provisionMonatlichEur = 0;
  let provisionEinmalEur = 0;
  for (const t of tips) {
    if (t.admin_status !== "bezahlt" || t.paid_amount_eur == null) continue;
    const n = Number(t.paid_amount_eur);
    if (!Number.isFinite(n)) continue;
    if (provisionBucketForServiceSlug(t.service_slug) === "monatlich") provisionMonatlichEur += n;
    else provisionEinmalEur += n;
  }
  return { provisionMonatlichEur, provisionEinmalEur };
}
