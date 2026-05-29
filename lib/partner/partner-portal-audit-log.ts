import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { PARTNER_RESPONSIBILITY_LABELS } from "@/lib/partner/responsibility-areas";
import type {
  PartnerPortalAuditEventKind,
  PartnerPortalAuditLogRow,
} from "@/lib/partner/partner-portal-audit-log-shared";

export type {
  PartnerPortalAuditActorKind,
  PartnerPortalAuditEventKind,
  PartnerPortalAuditLogRow,
} from "@/lib/partner/partner-portal-audit-log-shared";

export {
  PARTNER_PORTAL_AUDIT_ADMIN_LABEL,
  PARTNER_PORTAL_AUDIT_EVENT_LABELS,
} from "@/lib/partner/partner-portal-audit-log-shared";

export type PartnerPortalAuditInsert = {
  event_kind: PartnerPortalAuditEventKind;
  subject_partner_id?: string | null;
  actor_kind: import("@/lib/partner/partner-portal-audit-log-shared").PartnerPortalAuditActorKind;
  actor_partner_id?: string | null;
  actor_label?: string | null;
  tip_id?: string | null;
  summary: string;
  detail_json?: Record<string, unknown> | null;
};

function berlinMonthRange(periodKey: string): { start: Date; end: Date } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(periodKey.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (!Number.isFinite(y) || mo < 1 || mo > 12) return null;
  const start = new Date(Date.UTC(y, mo - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, mo, 1, 0, 0, 0, 0));
  return { start, end };
}

export function serviceLabelDe(slug: string): string {
  return PARTNER_RESPONSIBILITY_LABELS[slug as keyof typeof PARTNER_RESPONSIBILITY_LABELS] ?? slug.replace(/_/g, " ");
}

export async function logPartnerPortalAuditEvent(
  svc: SupabaseClient,
  event: PartnerPortalAuditInsert,
): Promise<void> {
  try {
    const { error } = await svc.from("partner_portal_audit_log").insert({
      event_kind: event.event_kind,
      subject_partner_id: event.subject_partner_id ?? null,
      actor_kind: event.actor_kind,
      actor_partner_id: event.actor_partner_id ?? null,
      actor_label: event.actor_label?.trim() || null,
      tip_id: event.tip_id ?? null,
      summary: event.summary.trim(),
      detail_json: event.detail_json ?? null,
    });
    if (error) {
      console.error("[logPartnerPortalAuditEvent]", error.message);
    }
  } catch (e) {
    console.error("[logPartnerPortalAuditEvent] unerwartet:", e);
  }
}

export async function fetchPartnerPortalAuditLog(
  svc: SupabaseClient,
  options?: { periodKey?: string; limit?: number },
): Promise<PartnerPortalAuditLogRow[]> {
  const limit = Math.min(Math.max(options?.limit ?? 250, 1), 2000);
  let q = svc
    .from("partner_portal_audit_log")
    .select(
      "id, created_at, event_kind, subject_partner_id, actor_kind, actor_partner_id, actor_label, tip_id, summary, detail_json",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.periodKey) {
    const range = berlinMonthRange(options.periodKey);
    if (range) {
      q = q.gte("created_at", range.start.toISOString()).lt("created_at", range.end.toISOString());
    }
  }

  const { data, error } = await q;
  if (error || !data) {
    console.error("[fetchPartnerPortalAuditLog]", error?.message);
    return [];
  }
  return data as PartnerPortalAuditLogRow[];
}

export async function partnerAuditDisplayLabel(
  svc: SupabaseClient,
  partnerId: string,
  email?: string | null,
): Promise<string> {
  const { data } = await svc
    .from("partner_profiles")
    .select("first_name, last_name, partner_referral_code, display_name")
    .eq("id", partnerId)
    .maybeSingle();
  const name =
    [data?.first_name, data?.last_name].filter(Boolean).join(" ").trim() ||
    (typeof data?.display_name === "string" ? data.display_name.trim() : "") ||
    email?.trim() ||
    partnerId.slice(0, 8);
  const code = typeof data?.partner_referral_code === "string" ? data.partner_referral_code.trim() : "";
  return code ? `${name} (${code})` : name;
}
