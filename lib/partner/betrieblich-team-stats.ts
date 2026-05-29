import { BETRIEBLICHE_PFLEGEBERATUNG_SLUG } from "@/lib/partner/betrieblich-team-types";
import {
  normalizeArchivedAt,
  normalizePartnerTipAdminStatus,
} from "@/lib/partner/partner-tip-admin";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";

type TipLike = {
  partner_id: string;
  service_slug: string;
  admin_status: unknown;
  archived_at: unknown;
  partner_archived_at?: unknown;
  paid_amount_eur: unknown;
};

function tipRowActiveForPartnerDashboard(t: TipLike): boolean {
  const a = normalizeArchivedAt(t.archived_at);
  if (a) return false;
  return true;
}

/** Monatsprovision + Abschlüsse nur betriebliche Pflegeberatung, wie in der Partner-Statusliste. */
export function aggregateBetrieblichTipStatsByPartner(partnerIds: string[], rows: TipLike[]): Map<string, { monatlich_eur: number; abschluesse: number }> {
  const want = new Set(partnerIds);
  const map = new Map<string, { monatlich_eur: number; abschluesse: number }>();
  for (const id of partnerIds) {
    map.set(id, { monatlich_eur: 0, abschluesse: 0 });
  }

  const stOk = normalizePartnerTipAdminStatus("vertragsabschluss_erfolgreich");

  for (const t of rows) {
    if (!want.has(t.partner_id)) continue;
    if (String(t.service_slug) !== BETRIEBLICHE_PFLEGEBERATUNG_SLUG) continue;
    if (!tipRowActiveForPartnerDashboard(t)) continue;
    const status = normalizePartnerTipAdminStatus(t.admin_status);
    const entry = map.get(t.partner_id);
    if (!entry) continue;
    if (status === stOk) {
      entry.abschluesse += 1;
      const paid = normalizePaidAmountEur(t.paid_amount_eur);
      if (paid != null && paid > 0 && provisionBucketForServiceSlug(BETRIEBLICHE_PFLEGEBERATUNG_SLUG) === "monatlich") {
        entry.monatlich_eur += paid;
      }
    }
  }

  return map;
}
