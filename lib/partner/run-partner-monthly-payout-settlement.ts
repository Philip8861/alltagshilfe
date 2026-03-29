import { normalizePartnerTipAdminStatus } from "@/lib/partner/partner-tip-admin";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import { previousMonthPeriodKeyBerlin } from "@/lib/partner/payout-period";
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
 * Einmal: nur noch nicht abgerechnete bezahlte Tipps → Summe, dann Archiv + payout_settled_period_key.
 * Monatlich: laufende Verträge mit erledigt/bezahlt → Summe; Admin-archivierte Tipps zählen nicht.
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

    if (bucket === "monatlich") {
      const arch = row.archived_at;
      if (arch != null && String(arch).trim() !== "") continue;
      if (st !== "erledigt" && st !== "bezahlt") continue;
    } else if (st !== "bezahlt") {
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
    const { error: insErr } = await svc.from("partner_payout_reports").insert(reports);
    if (insErr) {
      return {
        ok: false,
        message: insErr.message.includes("does not exist")
          ? "Tabelle partner_payout_reports fehlt – Migration 011 ausführen."
          : insErr.message,
      };
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
