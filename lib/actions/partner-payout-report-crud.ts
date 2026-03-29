"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { parsePayoutAmountGerman } from "@/lib/partner/partner-tip-payout";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type PayoutReportCrudState = { ok: true; message: string } | { ok: false; message: string };

const uuid = z.string().uuid();

const updateSchema = z.object({
  report_id: uuid,
  einmal_eur: z.string(),
  monatlich_eur: z.string(),
});

const deleteSchema = z.object({
  report_id: uuid,
});

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function updatePartnerPayoutReportAction(
  _prev: PayoutReportCrudState | null,
  formData: FormData,
): Promise<PayoutReportCrudState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const parsed = updateSchema.safeParse({
    report_id: formData.get("report_id"),
    einmal_eur: formData.get("einmal_eur"),
    monatlich_eur: formData.get("monatlich_eur"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Ungültige Eingabe." };
  }

  const einmal = parsePayoutAmountGerman(parsed.data.einmal_eur.trim());
  const monatlich = parsePayoutAmountGerman(parsed.data.monatlich_eur.trim());
  if (einmal == null || einmal < 0 || monatlich == null || monatlich < 0) {
    return { ok: false, message: "Beträge müssen gültige Zahlen ≥ 0 sein (z. B. 12,50)." };
  }

  const total = round2(einmal + monatlich);
  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const { error } = await svc
    .from("partner_payout_reports")
    .update({
      einmal_eur: round2(einmal),
      monatlich_eur: round2(monatlich),
      total_eur: total,
    })
    .eq("id", parsed.data.report_id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/partner/admin");
  return { ok: true, message: "Berichtszeile aktualisiert." };
}

/**
 * Löscht eine Auszahlungszeile und setzt zugehörige Einmal-Tipps dieses Partners für diesen Abrechnungsmonat
 * wieder frei (payout_settled_period_key / archived_at), soweit sie auf diesen Monat zeigen.
 */
export async function deletePartnerPayoutReportAction(
  _prev: PayoutReportCrudState | null,
  formData: FormData,
): Promise<PayoutReportCrudState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const parsed = deleteSchema.safeParse({ report_id: formData.get("report_id") });
  if (!parsed.success) {
    return { ok: false, message: "Ungültige ID." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const { data: row, error: fetchErr } = await svc
    .from("partner_payout_reports")
    .select("id, period_key, partner_id")
    .eq("id", parsed.data.report_id)
    .maybeSingle();

  if (fetchErr) {
    return { ok: false, message: fetchErr.message };
  }
  if (!row) {
    return { ok: false, message: "Eintrag nicht gefunden." };
  }

  const periodKey = String(row.period_key ?? "").trim();
  const partnerId = String(row.partner_id ?? "").trim();
  if (!periodKey || !partnerId) {
    return { ok: false, message: "Datensatz unvollständig." };
  }

  const { error: delErr } = await svc.from("partner_payout_reports").delete().eq("id", parsed.data.report_id);
  if (delErr) {
    return { ok: false, message: delErr.message };
  }

  const { error: resetErr } = await svc
    .from("partner_tip_submissions")
    .update({ payout_settled_period_key: null, archived_at: null })
    .eq("partner_id", partnerId)
    .eq("payout_settled_period_key", periodKey);

  if (resetErr) {
    return {
      ok: false,
      message: `Bericht gelöscht, Einmal-Tipps konnten nicht zurückgesetzt werden: ${resetErr.message}`,
    };
  }

  revalidatePath("/partner/admin");
  return { ok: true, message: "Auszahlungszeile gelöscht; zugehörige Einmal-Tipps für diesen Monat wurden freigegeben." };
}
