"use server";

import { revalidatePath } from "next/cache";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { previousMonthPeriodKeyBerlin } from "@/lib/partner/payout-period";
import { runPartnerMonthlyPayoutSettlement } from "@/lib/partner/run-partner-monthly-payout-settlement";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type PartnerPayoutTestState = { ok: true; message: string } | { ok: false; message: string };

const PERIOD_RE = /^\d{4}-\d{2}$/;

/**
 * Nur System-Admin: löscht Abrechnung + Einmal-Rücksetzung für einen Monat und führt den Lauf erneut aus (Tests).
 */
export async function adminTestPartnerPayoutRerunAction(
  _prev: PartnerPayoutTestState | null,
  formData: FormData,
): Promise<PartnerPayoutTestState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const raw = String(formData.get("period_key") ?? "").trim();
  const refDateRaw = String(formData.get("reference_date") ?? "").trim();
  let referenceInstant = new Date();
  if (refDateRaw.length > 0) {
    const parsed = new Date(`${refDateRaw}T12:00:00`);
    if (!Number.isFinite(parsed.getTime())) {
      return { ok: false, message: "Ungültiges Referenzdatum (YYYY-MM-DD)." };
    }
    referenceInstant = parsed;
  }

  const periodKey = raw.length > 0 ? raw : previousMonthPeriodKeyBerlin(referenceInstant);
  if (!PERIOD_RE.test(periodKey)) {
    return { ok: false, message: "Ungültiger Abrechnungsmonat (YYYY-MM)." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const { error: delRepErr } = await svc.from("partner_payout_reports").delete().eq("period_key", periodKey);
  if (delRepErr) {
    return {
      ok: false,
      message: delRepErr.message.includes("does not exist")
        ? "Tabelle partner_payout_reports fehlt (Migration 011)."
        : delRepErr.message,
    };
  }

  const { error: resetErr } = await svc
    .from("partner_tip_submissions")
    .update({ payout_settled_period_key: null, archived_at: null })
    .eq("payout_settled_period_key", periodKey);

  if (resetErr) {
    return {
      ok: false,
      message: resetErr.message.includes("does not exist")
        ? "Spalte payout_settled_period_key fehlt (Migration 011)."
        : resetErr.message,
    };
  }

  const result = await runPartnerMonthlyPayoutSettlement({ periodKey });
  revalidatePath("/partner/admin");

  if (!result.ok) {
    return { ok: false, message: result.message };
  }
  const refHint = refDateRaw.length > 0 ? `; Referenzdatum ${refDateRaw}` : "";
  return {
    ok: true,
    message: `${result.message} (Test-Lauf für ${periodKey}${refHint})`,
  };
}
