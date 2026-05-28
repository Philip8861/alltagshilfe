import { normalizePartnerTipAdminStatus } from "@/lib/partner/partner-tip-admin";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import { previousMonthPeriodKeyBerlin } from "@/lib/partner/payout-period";
import {
  centsToEur,
  eurToCents,
  referralCentsFromOwnCents,
} from "@/lib/partner/referral-money";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type PayoutSettlementResult = {
  ok: boolean;
  message: string;
  periodKey?: string;
  partnersCount?: number;
  skipped?: boolean;
};

/**
 * Monatsabrechnung: Bericht für periodKey (Standard: Vormonat Europe/Berlin).
 * Einmal: nur noch nicht abgerechnete Tipps mit Vertragsabschluss erfolgreich → Summe, dann Archiv + payout_settled_period_key.
 * Monatlich: laufende Verträge mit vertragsabschluss_erfolgreich → Summe; Admin-archivierte Tipps zählen nicht.
 * Idempotent: wenn bereits Zeilen in partner_payout_reports für periodKey existieren → überspringen.
 */
export async function runPartnerMonthlyPayoutSettlement(options?: {
  periodKey?: string;
}): Promise<PayoutSettlementResult> {
  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const periodKey = options?.periodKey ?? previousMonthPeriodKeyBerlin();

  const { count: existingCount, error: countErr } = await svc
    .from("partner_payout_reports")
    .select("id", { count: "exact", head: true })
    .eq("period_key", periodKey);

  if (countErr) {
    return { ok: false, message: countErr.message };
  }
  if ((existingCount ?? 0) > 0) {
    return {
      ok: true,
      message: `Abrechnung ${periodKey} ist bereits gespeichert.`,
      periodKey,
      skipped: true,
      partnersCount: existingCount ?? 0,
    };
  }

  const { data: tips, error: tipsErr } = await svc
    .from("partner_tip_submissions")
    .select("id, partner_id, service_slug, admin_status, paid_amount_eur, payout_settled_period_key, archived_at");

  if (tipsErr) {
    return { ok: false, message: tipsErr.message };
  }

  const rows = (tips ?? []) as Record<string, unknown>[];
  const partnerAgg = new Map<string, { einmal: number; monatlich: number }>();
  const einmalTipIds: string[] = [];

  for (const row of rows) {
    const st = normalizePartnerTipAdminStatus(row.admin_status);
    const paid = normalizePaidAmountEur(row.paid_amount_eur);
    if (paid == null || paid <= 0) continue;

    const partnerId = String(row.partner_id);
    const bucket = provisionBucketForServiceSlug(String(row.service_slug));

    const arch = row.archived_at;
    if (bucket === "monatlich") {
      if (arch != null && String(arch).trim() !== "") continue;
      if (st !== "vertragsabschluss_erfolgreich") continue;
    } else if (st !== "vertragsabschluss_erfolgreich") {
      continue;
    }

    const cur = partnerAgg.get(partnerId) ?? { einmal: 0, monatlich: 0 };

    if (bucket === "monatlich") {
      cur.monatlich += paid;
    } else {
      const pk = row.payout_settled_period_key;
      if (pk != null && String(pk).trim() !== "") continue;
      cur.einmal += paid;
      einmalTipIds.push(String(row.id));
    }
    partnerAgg.set(partnerId, cur);
  }

  const reports: {
    period_key: string;
    partner_id: string;
    einmal_eur: number;
    monatlich_eur: number;
    total_eur: number;
  }[] = [];

  for (const [partner_id, v] of partnerAgg) {
    const e = Math.round(v.einmal * 100) / 100;
    const m = Math.round(v.monatlich * 100) / 100;
    const t = Math.round((e + m) * 100) / 100;
    if (t <= 0) continue;
    reports.push({ period_key: periodKey, partner_id, einmal_eur: e, monatlich_eur: m, total_eur: t });
  }

  if (reports.length === 0 && einmalTipIds.length === 0) {
    return {
      ok: true,
      message: `Keine auszuzahlenden Beträge für ${periodKey}.`,
      periodKey,
      partnersCount: 0,
    };
  }

  if (reports.length > 0) {
    const { error: insErr } = await svc.from("partner_payout_reports").insert(
      reports.map((r) => ({
        ...r,
        /** total_with_referral_eur initial = total_eur; wird nach Referral-Pass aktualisiert. */
        total_with_referral_eur: r.total_eur,
      })),
    );
    if (insErr) {
      return {
        ok: false,
        message: insErr.message.includes("does not exist")
          ? "Tabelle partner_payout_reports fehlt – Migration 011/026 ausführen."
          : insErr.message,
      };
    }
  }

  /**
   * Referral-Pass:
   * Für jeden Partner mit Eigenprovision in diesem periodKey:
   *   - finde direkte geworbene Partner
   *   - ihre Eigenprovision in diesem periodKey (aus partner_payout_reports)
   *   - 5 % als referral_eur addieren
   *   - nur ab referred_at (Provisionen vor referred_at zählen NICHT — beim Settlement
   *     ist referred_at ohnehin <= Periodenende, da die Reports erst am 1. des Folgemonats
   *     entstehen; wir filtern trotzdem strikt: referred_at <= Periodenende)
   */
  const allReports = reports.map((r) => ({
    ...r,
    referralCents: 0,
  }));

  if (allReports.length > 0) {
    const periodEnd = monthEndUtcFromKey(periodKey);
    const referralByBeneficiary = new Map<string, number>();

    /** Erzeuge Map: partnerId -> ownCents (aus diesem Lauf) */
    const ownCentsByPartner = new Map<string, number>();
    for (const r of allReports) {
      ownCentsByPartner.set(r.partner_id, eurToCents(r.einmal_eur) + eurToCents(r.monatlich_eur));
    }

    /** Direkte geworbene Partner nur derjenigen Partner laden, die in diesem Lauf own commission haben. */
    const earnersIds = Array.from(ownCentsByPartner.keys());
    if (earnersIds.length > 0) {
      const { data: directs, error: directsErr } = await svc
        .from("partner_profiles")
        .select("id, referred_by_partner_id, referred_at")
        .in("id", earnersIds);

      if (directsErr) {
        const m = (directsErr.message ?? "").toLowerCase();
        if (m.includes("referred_by_partner_id") || m.includes("referred_at")) {
          /** Migration 026 fehlt → Lauf nicht abbrechen, Referral-Pass überspringen. */
          return {
            ok: true,
            message: `Abrechnung ${periodKey}: ${reports.length} Partner (Referral übersprungen — Migration 026 nicht ausgeführt).`,
            periodKey,
            partnersCount: reports.length,
          };
        }
      } else if (directs) {
        for (const row of directs as Array<{
          id: string;
          referred_by_partner_id: string | null;
          referred_at: string | null;
        }>) {
          const sponsorId = row.referred_by_partner_id;
          const referredAt = row.referred_at ? new Date(row.referred_at) : null;
          if (!sponsorId || !referredAt || Number.isNaN(referredAt.getTime())) continue;
          if (periodEnd && referredAt > periodEnd) continue;

          const ownCentsOfBeneficiary = ownCentsByPartner.get(row.id) ?? 0;
          if (ownCentsOfBeneficiary <= 0) continue;

          const ref = referralCentsFromOwnCents(ownCentsOfBeneficiary);
          if (ref <= 0) continue;

          referralByBeneficiary.set(
            sponsorId,
            (referralByBeneficiary.get(sponsorId) ?? 0) + ref,
          );
        }
      }
    }

    /** Updates für Reports schreiben (nur wenn referral > 0). */
    for (const [sponsorId, refCents] of referralByBeneficiary.entries()) {
      const reportRow = allReports.find((r) => r.partner_id === sponsorId);
      if (!reportRow || refCents <= 0) {
        /** Sponsor hat in diesem periodKey selbst keine Eigenprovision → Reportzeile fehlt
         *  → keine Auszahlung dieses Monats. (User-Anforderung: Referral wird in genau dem
         *  Monat gezahlt, in dem Eigenprovision der geworbenen Partner freigegeben wird; ein Sponsor
         *  ohne eigene Reportzeile bekommt im selben Monat trotzdem Geld → wir legen leere
         *  Reportzeile mit referral_eur an.) */
        const referralEur = centsToEur(refCents);
        const total = referralEur;
        const insertRow = {
          period_key: periodKey,
          partner_id: sponsorId,
          einmal_eur: 0,
          monatlich_eur: 0,
          total_eur: 0,
          referral_eur: referralEur,
          total_with_referral_eur: total,
        };
        await svc.from("partner_payout_reports").insert(insertRow);
        continue;
      }

      const newTotalWithReferral = centsToEur(
        eurToCents(reportRow.einmal_eur) + eurToCents(reportRow.monatlich_eur) + refCents,
      );
      const newReferralEur = centsToEur(refCents);

      await svc
        .from("partner_payout_reports")
        .update({
          referral_eur: newReferralEur,
          total_with_referral_eur: newTotalWithReferral,
        })
        .eq("period_key", periodKey)
        .eq("partner_id", sponsorId);
    }
  }

  const settledAt = new Date().toISOString();
  const chunkSize = 80;
  for (let i = 0; i < einmalTipIds.length; i += chunkSize) {
    const slice = einmalTipIds.slice(i, i + chunkSize);
    const { error: upErr } = await svc
      .from("partner_tip_submissions")
      .update({ payout_settled_period_key: periodKey, archived_at: settledAt })
      .in("id", slice);
    if (upErr) {
      return {
        ok: false,
        message: upErr.message.includes("does not exist")
          ? "Spalte payout_settled_period_key fehlt – Migration 011 ausführen."
          : `Bericht geschrieben, Einmal-Tipps konnten nicht finalisiert werden: ${upErr.message}`,
      };
    }
  }

  return {
    ok: true,
    message: `Abrechnung ${periodKey}: ${reports.length} Partner, ${einmalTipIds.length} Einmal-Tipp(e) archiviert.`,
    periodKey,
    partnersCount: reports.length,
  };
}

function monthEndUtcFromKey(periodKey: string): Date | null {
  const m = /^(\d{4})-(\d{2})$/.exec(periodKey);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (!Number.isFinite(y) || mo < 1 || mo > 12) return null;
  const next = new Date(Date.UTC(y, mo, 1, 0, 0, 0, 0));
  return new Date(next.getTime() - 1);
}
