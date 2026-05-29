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
  resolveProvisionEurForPartner,
  type PartnerCommissionRatesMap,
} from "@/lib/partner/partner-commission-rates-shared";
import { normalizePartnerTipAdminStatus, partnerTipStatusTriggersProvision } from "@/lib/partner/partner-tip-admin";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import {
  logPartnerPortalAuditEvent,
  PARTNER_PORTAL_AUDIT_ADMIN_LABEL,
  serviceLabelDe,
} from "@/lib/partner/partner-portal-audit-log";

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

type SyncProvisionOptions = {
  actorKind?: "admin" | "system";
  actorLabel?: string;
};

/**
 * Passt paid_amount_eur bei allen Tipps mit „Vertragsabschluss erfolgreich“ an die aktuellen Partner-Sätze an
 * (auch bereits abgerechnete / archivierte Tipps in der Partnerliste).
 */
export async function syncPartnerTipProvisionsFromRates(
  svc: SupabaseClient,
  partnerId: string,
  options?: SyncProvisionOptions,
): Promise<{ updatedCount: number }> {
  const rates = await fetchPartnerCommissionRates(svc, partnerId);
  const { data: tips, error } = await svc
    .from("partner_tip_submissions")
    .select("id, service_slug, admin_status, paid_amount_eur")
    .eq("partner_id", partnerId);

  if (error || !tips?.length) {
    return { updatedCount: 0 };
  }

  const actorKind = options?.actorKind ?? "system";
  const actorLabel = options?.actorLabel ?? "System";
  let updatedCount = 0;

  for (const row of tips) {
    const status = normalizePartnerTipAdminStatus(row.admin_status);
    if (!partnerTipStatusTriggersProvision(status)) continue;

    const slug = String(row.service_slug);
    const bucket = provisionBucketForServiceSlug(slug);
    const slugKey = slug as PartnerResponsibilitySlug;

    if (bucket === "monatlich" && rates[slugKey] == null) {
      continue;
    }

    const newPaid = resolveProvisionEurForPartner(slug, rates);
    if (newPaid == null) continue;

    const oldPaid = normalizePaidAmountEur(row.paid_amount_eur);
    if (oldPaid === newPaid) continue;

    const { error: upErr } = await svc
      .from("partner_tip_submissions")
      .update({ paid_amount_eur: newPaid })
      .eq("id", row.id);

    if (upErr) {
      console.error("[syncPartnerTipProvisionsFromRates]", upErr.message);
      continue;
    }

    updatedCount += 1;
    await logPartnerPortalAuditEvent(svc, {
      event_kind: "tip_provision_adjusted",
      subject_partner_id: partnerId,
      actor_kind: actorKind,
      actor_label: actorLabel,
      tip_id: String(row.id),
      summary: `${serviceLabelDe(slug)}: Provision von ${oldPaid != null ? `${oldPaid} EUR` : "—"} auf ${newPaid} EUR angepasst (Satzänderung).`,
      detail_json: {
        service_slug: slug,
        old_paid_eur: oldPaid,
        new_paid_eur: newPaid,
      },
    });
  }

  return { updatedCount };
}

export async function savePartnerCommissionRates(
  svc: SupabaseClient,
  partnerId: string,
  formData: FormData,
  options?: SyncProvisionOptions,
): Promise<{ ok: true; tipsUpdated: number } | { ok: false; message: string }> {
  const parsed = parseCommissionRatesFromFormData(formData);
  if (parsed.error) return { ok: false, message: parsed.error };

  const previousRates = await fetchPartnerCommissionRates(svc, partnerId);

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

  const sync = await syncPartnerTipProvisionsFromRates(svc, partnerId, {
    actorKind: options?.actorKind ?? "admin",
    actorLabel: options?.actorLabel ?? PARTNER_PORTAL_AUDIT_ADMIN_LABEL,
  });

  const rateSummary = PARTNER_RESPONSIBILITY_SLUGS.map((slug) => {
    const prev = previousRates[slug];
    const next = parsed.rates[slug];
    if (prev === next && prev != null) return null;
    if (next != null) return `${slug}: ${next} EUR`;
    if (prev != null) return `${slug}: entfernt (Standard)`;
    return null;
  })
    .filter(Boolean)
    .join("; ");

  if (rateSummary || sync.updatedCount > 0) {
    await logPartnerPortalAuditEvent(svc, {
      event_kind: "commission_rates_updated",
      subject_partner_id: partnerId,
      actor_kind: options?.actorKind ?? "admin",
      actor_label: options?.actorLabel ?? PARTNER_PORTAL_AUDIT_ADMIN_LABEL,
      summary:
        sync.updatedCount > 0
          ? `Provisionssätze gespeichert; ${sync.updatedCount} bestehende Tipps angepasst.${rateSummary ? ` ${rateSummary}` : ""}`
          : `Provisionssätze gespeichert.${rateSummary ? ` ${rateSummary}` : ""}`,
      detail_json: {
        previous: previousRates,
        next: parsed.rates,
        tips_updated: sync.updatedCount,
      },
    });
  }

  return { ok: true, tipsUpdated: sync.updatedCount };
}
