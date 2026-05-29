import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import { PARTNER_EINMAL_PROVISION_SLUGS } from "@/lib/partner/partner-program-capabilities";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";

const einmalSlugSet = new Set<string>(PARTNER_EINMAL_PROVISION_SLUGS);

/** Summe Einmalprovision (nur Pflegehilfsmittel, Hauswirtschaft & Betreuung, Pflegeberatung). */
export function partnerEinmalProvisionSumFromTips(tips: PartnerDashboardTipSerial[]): number {
  let provisionEinmalEur = 0;
  for (const t of tips) {
    if (!einmalSlugSet.has(t.service_slug)) continue;
    if (t.archived_at) continue;
    const n = Number(t.paid_amount_eur);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (t.admin_status !== "vertragsabschluss_erfolgreich") continue;
    if (provisionBucketForServiceSlug(t.service_slug) !== "einmal") continue;
    provisionEinmalEur += n;
  }
  return provisionEinmalEur;
}

/** @deprecated Nur noch Alias — bitte partnerEinmalProvisionSumFromTips verwenden. */
export function partnerProvisionSumsFromTips(tips: PartnerDashboardTipSerial[]): {
  provisionMonatlichEur: number;
  provisionEinmalEur: number;
} {
  return {
    provisionMonatlichEur: 0,
    provisionEinmalEur: partnerEinmalProvisionSumFromTips(tips),
  };
}
