import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizePartnerTipAdminStatus } from "@/lib/partner/partner-tip-admin";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import {
  PARTNER_DIRECT_REFERRAL_RATE_BPS,
  eurToCents,
  referralCentsFromOwnCents,
} from "@/lib/partner/referral-money";

/**
 * Geld-Aggregationen für Partner (in Cent, niemals Float).
 *
 * Quellen:
 *  - Bereits abgerechnete Monate: `partner_payout_reports.einmal_eur + monatlich_eur`
 *      → das ist die *eigene freigegebene Abschlussprovision* (inkl. monatlich Betrieb),
 *        bestätigt durch den Settlement-Lauf am 1. des Folgemonats.
 *  - Aktueller laufender Monat: aus `partner_tip_submissions` mit
 *      admin_status = "vertragsabschluss_erfolgreich",
 *      paid_amount_eur > 0,
 *      und (für Einmalprovision) noch nicht im Settlement abgerechnet.
 *
 * Referral-Bemessung ist IMMER ownApprovedClosingCommissionCents (eigenständig pro geworbenem Partner).
 * Niemals totalPayoutCents, niemals Referral-Provisionen, niemals storniert/offen.
 */

const PERIOD_KEY_RE = /^\d{4}-\d{2}$/;

function isValidPeriodKey(p: string): boolean {
  return PERIOD_KEY_RE.test(p);
}

function periodKeyFromDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

function periodKeyOfTipForBucket(
  tip: TipRow,
): { periodKey: string | null; isSettled: boolean } {
  const bucket = provisionBucketForServiceSlug(String(tip.service_slug));
  const settledKey = tip.payout_settled_period_key;
  if (settledKey && PERIOD_KEY_RE.test(settledKey)) {
    return { periodKey: settledKey, isSettled: true };
  }

  if (bucket === "monatlich") {
    /** Monatliche Provisionen werden im Monat des created_at gezählt – Settlement folgt. */
    const created = tip.created_at ? new Date(tip.created_at) : null;
    if (!created || Number.isNaN(created.getTime())) return { periodKey: null, isSettled: false };
    return { periodKey: periodKeyFromDate(created), isSettled: false };
  }

  /** Einmalprovision ohne Settlement: Erfassung ⇒ aktueller Monat (created_at). */
  const created = tip.created_at ? new Date(tip.created_at) : null;
  if (!created || Number.isNaN(created.getTime())) return { periodKey: null, isSettled: false };
  return { periodKey: periodKeyFromDate(created), isSettled: false };
}

type TipRow = {
  id: string;
  partner_id: string;
  service_slug: string;
  admin_status: string | null;
  paid_amount_eur: number | string | null;
  payout_settled_period_key: string | null;
  archived_at: string | null;
  created_at: string;
};

const TIP_SELECT =
  "id, partner_id, service_slug, admin_status, paid_amount_eur, payout_settled_period_key, archived_at, created_at";

/**
 * Eigene freigegebene Abschlussprovision in Cent für den Partner im gewählten Monat.
 *
 *  - Aus `partner_payout_reports`: einmal_eur + monatlich_eur (= ownApprovedClosing).
 *  - Falls der Monat noch nicht abgerechnet ist, aus `partner_tip_submissions`:
 *      vertragsabschluss_erfolgreich + paid_amount_eur > 0
 *      (Monatlich: ohne archived_at; Einmal: ohne payout_settled_period_key).
 *
 * Storno = nicht-mehr-vertragsabschluss_erfolgreich oder paid_amount_eur=null oder archiviert.
 * Diese Tipps fließen nicht ein → Referral folgt automatisch.
 */
export async function getPartnerMonthlyOwnApprovedClosingCommissionCents(
  svc: SupabaseClient,
  partnerId: string,
  periodKey: string,
): Promise<number> {
  if (!isValidPeriodKey(periodKey) || !partnerId) return 0;

  const { data: report, error: reportErr } = await svc
    .from("partner_payout_reports")
    .select("einmal_eur, monatlich_eur")
    .eq("period_key", periodKey)
    .eq("partner_id", partnerId)
    .maybeSingle();

  if (!reportErr && report) {
    const r = report as { einmal_eur: number | string | null; monatlich_eur: number | string | null };
    return eurToCents(r.einmal_eur) + eurToCents(r.monatlich_eur);
  }

  const { data: tips, error: tipsErr } = await svc
    .from("partner_tip_submissions")
    .select(TIP_SELECT)
    .eq("partner_id", partnerId);

  if (tipsErr || !tips) return 0;

  let cents = 0;
  for (const raw of tips as TipRow[]) {
    const inc = ownClosingCentsForTipInPeriod(raw, periodKey);
    cents += inc;
  }
  return cents;
}

function ownClosingCentsForTipInPeriod(tip: TipRow, periodKey: string): number {
  const status = normalizePartnerTipAdminStatus(tip.admin_status);
  if (status !== "vertragsabschluss_erfolgreich") return 0;

  const cents = eurToCents(tip.paid_amount_eur);
  if (cents <= 0) return 0;

  const bucket = provisionBucketForServiceSlug(String(tip.service_slug));
  if (bucket === "monatlich") {
    if (tip.archived_at && String(tip.archived_at).trim() !== "") return 0;
  }

  const { periodKey: tipPeriod } = periodKeyOfTipForBucket(tip);
  if (tipPeriod !== periodKey) return 0;

  return cents;
}

/**
 * Direkt geworbene Partner (= Kinder-IDs) eines Partners.
 * Liefert nur ID + Code; keine personenbezogenen Daten.
 */
export async function getDirectReferralPartners(
  svc: SupabaseClient,
  partnerId: string,
): Promise<Array<{ id: string; partner_referral_code: string | null; referred_at: string | null }>> {
  if (!partnerId) return [];
  const { data, error } = await svc
    .from("partner_profiles")
    .select("id, partner_referral_code, referred_at")
    .eq("referred_by_partner_id", partnerId);
  if (error || !data) return [];
  return data as Array<{ id: string; partner_referral_code: string | null; referred_at: string | null }>;
}

/**
 * Referral-Provision in Cent: 5 % auf eigene freigegebene Abschlussprovisionen
 * der direkt geworbenen Partner im periodKey – nur ab `referred_at` (rückwirkend = 0).
 */
export async function getPartnerMonthlyReferralCommissionCents(
  svc: SupabaseClient,
  partnerId: string,
  periodKey: string,
): Promise<number> {
  if (!isValidPeriodKey(periodKey) || !partnerId) return 0;

  const directs = await getDirectReferralPartners(svc, partnerId);
  if (directs.length === 0) return 0;

  let total = 0;
  for (const d of directs) {
    const referredAt = d.referred_at ? new Date(d.referred_at) : null;
    if (!referredAt || Number.isNaN(referredAt.getTime())) continue;

    const periodMonthStart = periodMonthStartUtc(periodKey);
    if (!periodMonthStart) continue;

    /** Wenn referred_at NACH dem Ende des periodKey-Monats liegt → keine Referral. */
    const periodMonthEnd = periodMonthEndUtc(periodKey);
    if (!periodMonthEnd) continue;
    if (referredAt > periodMonthEnd) continue;

    const ownCents = await getPartnerMonthlyOwnApprovedClosingCommissionCents(svc, d.id, periodKey);
    if (ownCents <= 0) continue;

    /**
     * Wenn referred_at INNERHALB des Monats liegt: konservativ trotzdem voll werten,
     * weil der Settlement-Monatsfilter die Provisionen schon dem Periodenmonat zuordnet
     * und Provisionen, die VOR `referred_at` erfasst wurden, in der Realität meist
     * nicht denselben period_key bekommen (settlement passiert erst am 1. des Folgemonats).
     * Strenger Filter: zähle pro Tipp und prüfe `created_at >= referred_at`.
     */
    if (referredAt > periodMonthStart) {
      const strict = await getOwnApprovedClosingCommissionCentsSinceReferredAt(
        svc,
        d.id,
        periodKey,
        referredAt,
      );
      total += referralCentsFromOwnCents(strict, PARTNER_DIRECT_REFERRAL_RATE_BPS);
      continue;
    }

    total += referralCentsFromOwnCents(ownCents, PARTNER_DIRECT_REFERRAL_RATE_BPS);
  }
  return total;
}

function periodMonthStartUtc(periodKey: string): Date | null {
  const m = /^(\d{4})-(\d{2})$/.exec(periodKey);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (!Number.isFinite(y) || mo < 1 || mo > 12) return null;
  return new Date(Date.UTC(y, mo - 1, 1, 0, 0, 0, 0));
}

function periodMonthEndUtc(periodKey: string): Date | null {
  const start = periodMonthStartUtc(periodKey);
  if (!start) return null;
  const next = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  return new Date(next.getTime() - 1);
}

/**
 * Strikter Filter: für einen direkten geworbenen Partner im periodKey nur die Tipps,
 * deren `created_at >= referredAt` (= Provisionen, die NACH der Werbung erfasst wurden).
 * Wird verwendet, wenn referred_at innerhalb des periodKey-Monats liegt.
 */
async function getOwnApprovedClosingCommissionCentsSinceReferredAt(
  svc: SupabaseClient,
  partnerId: string,
  periodKey: string,
  referredAt: Date,
): Promise<number> {
  const { data: tips, error } = await svc
    .from("partner_tip_submissions")
    .select(TIP_SELECT)
    .eq("partner_id", partnerId)
    .gte("created_at", referredAt.toISOString());

  if (error || !tips) return 0;

  let cents = 0;
  for (const raw of tips as TipRow[]) {
    cents += ownClosingCentsForTipInPeriod(raw, periodKey);
  }
  return cents;
}

/**
 * Komplett-Übersicht für einen Partner im Monat:
 *  - ownCents             = eigene freigegebene Abschlussprovision
 *  - referralCents        = 5 % auf own der direkten geworbenen Partner (nur ab referred_at)
 *  - totalCents           = ownCents + referralCents (= Auszahlungssumme)
 */
export async function getPartnerMonthlyPayoutSummary(
  svc: SupabaseClient,
  partnerId: string,
  periodKey: string,
): Promise<{ ownCents: number; referralCents: number; totalCents: number }> {
  const ownCents = await getPartnerMonthlyOwnApprovedClosingCommissionCents(svc, partnerId, periodKey);
  const referralCents = await getPartnerMonthlyReferralCommissionCents(svc, partnerId, periodKey);
  return {
    ownCents,
    referralCents,
    totalCents: ownCents + referralCents,
  };
}

