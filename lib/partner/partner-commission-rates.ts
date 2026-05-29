import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import {
  commissionRateFormFieldName,
  parseCommissionRatesFromFormData,
  type PartnerCommissionRatesMap,
} from "@/lib/partner/partner-commission-rates-shared";

export type { PartnerCommissionRatesMap } from "@/lib/partner/partner-commission-rates-shared";
export {
  commissionRateFormFieldName,
  resolveProvisionEurForPartner,
  GLOBAL_EINMAL_PROVISION_EUR,
} from "@/lib/partner/partner-commission-rates-shared";

type DbRateRow = {
  service_slug: string;
  amount_eur: number | string;
};

function rowToMap(rows: DbRateRow[]): PartnerCommissionRatesMap {
  const out: PartnerCommissionRatesMap = {};
  for (const row of rows) {
    const slug = row.service_slug as PartnerResponsibilitySlug;
    if (!PARTNER_RESPONSIBILITY_SLUGS.includes(slug)) continue;
    const n = typeof row.amount_eur === "number" ? row.amount_eur : Number(row.amount_eur);
    if (Number.isFinite(n) && n > 0) out[slug] = Math.round(n * 100) / 100;
  }
  return out;
}

export async function fetchPartnerCommissionRates(
  svc: SupabaseClient,
  partnerId: string,
): Promise<PartnerCommissionRatesMap> {
  const { data, error } = await svc
    .from("partner_commission_rates")
    .select("service_slug, amount_eur")
    .eq("partner_id", partnerId);

  if (error || !data?.length) return {};
  return rowToMap(data as DbRateRow[]);
}

export async function fetchAllPartnerCommissionRates(
  svc: SupabaseClient,
): Promise<Record<string, PartnerCommissionRatesMap>> {
  const { data, error } = await svc.from("partner_commission_rates").select("partner_id, service_slug, amount_eur");

  if (error || !data?.length) return {};

  const out: Record<string, PartnerCommissionRatesMap> = {};
  for (const row of data as (DbRateRow & { partner_id: string })[]) {
    const pid = row.partner_id;
    if (!out[pid]) out[pid] = {};
    const slug = row.service_slug as PartnerResponsibilitySlug;
    if (!PARTNER_RESPONSIBILITY_SLUGS.includes(slug)) continue;
    const n = typeof row.amount_eur === "number" ? row.amount_eur : Number(row.amount_eur);
    if (Number.isFinite(n) && n > 0) out[pid][slug] = Math.round(n * 100) / 100;
  }
  return out;
}

export async function savePartnerCommissionRates(
  svc: SupabaseClient,
  partnerId: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const parsed = parseCommissionRatesFromFormData(formData);
  if (parsed.error) return { ok: false, message: parsed.error };

  const toUpsert: {
    partner_id: string;
    service_slug: PartnerResponsibilitySlug;
    bucket: "einmal" | "monatlich";
    amount_eur: number;
    updated_at: string;
  }[] = [];

  const toDelete: PartnerResponsibilitySlug[] = [];

  for (const slug of PARTNER_RESPONSIBILITY_SLUGS) {
    const raw = formData.get(commissionRateFormFieldName(slug));
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    if (!trimmed) {
      toDelete.push(slug);
      continue;
    }
    const amount = parsed.rates[slug];
    if (amount == null) continue;
    toUpsert.push({
      partner_id: partnerId,
      service_slug: slug,
      bucket: provisionBucketForServiceSlug(slug),
      amount_eur: amount,
      updated_at: new Date().toISOString(),
    });
  }

  if (toDelete.length > 0) {
    const { error } = await svc
      .from("partner_commission_rates")
      .delete()
      .eq("partner_id", partnerId)
      .in("service_slug", toDelete);
    if (error) {
      return {
        ok: false,
        message:
          "Provisionssätze konnten nicht gespeichert werden. Migration 027 (partner_commission_rates) in Supabase ausführen.",
      };
    }
  }

  if (toUpsert.length > 0) {
    const { error } = await svc.from("partner_commission_rates").upsert(toUpsert, {
      onConflict: "partner_id,service_slug",
    });
    if (error) {
      return {
        ok: false,
        message:
          error.message ||
          "Provisionssätze konnten nicht gespeichert werden. Migration 027 (partner_commission_rates) prüfen.",
      };
    }
  }

  return { ok: true };
}
