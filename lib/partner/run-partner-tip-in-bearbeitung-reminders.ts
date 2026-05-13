import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { isSupabaseMissingColumnError } from "@/lib/partner/supabase-schema-errors";
import { normalizePartnerTipAdminStatus } from "@/lib/partner/partner-tip-admin";
import { partnerTipPayloadSummary } from "@/lib/partner/partner-tip-summary";
import {
  isPartnerTipStaffMailSlug,
  notifyStaffOfInBearbeitungPartnerTipReminder,
  type PartnerTipStaffNotifyBase,
} from "@/lib/partner/partner-tip-staff-notify";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
/** Pro Cron-Lauf, damit SMTP/Timeout bei vielen Vorgängen nicht explodieren. */
const MAX_REMINDERS_PER_RUN = 200;

export type PartnerTipInBearbeitungReminderRunResult = {
  ok: boolean;
  /** Kandidaten (DB: in_bearbeitung, nicht archiviert). */
  eligibleRows: number;
  /** Nach 3-Tage-Regel fällig (vor Max-Limit). */
  dueCount: number;
  sent: number;
  migrationMissing?: boolean;
  errors: string[];
};

export async function runPartnerTipInBearbeitungReminders(): Promise<PartnerTipInBearbeitungReminderRunResult> {
  const svc = createSupabaseServiceRoleClient();
  const fail = (errors: string[]): PartnerTipInBearbeitungReminderRunResult => ({
    ok: false,
    eligibleRows: 0,
    dueCount: 0,
    sent: 0,
    errors,
  });

  if (!svc) {
    return fail(["SUPABASE_SERVICE_ROLE_KEY fehlt."]);
  }

  const { data, error } = await svc
    .from("partner_tip_submissions")
    .select(
      "id, partner_id, service_slug, payload, created_at, admin_status, archived_at, last_in_bearbeitung_staff_reminder_at",
    )
    .eq("admin_status", "in_bearbeitung")
    .is("archived_at", null);

  if (error) {
    if (isSupabaseMissingColumnError(error)) {
      return {
        ok: true,
        eligibleRows: 0,
        dueCount: 0,
        sent: 0,
        migrationMissing: true,
        errors: [],
      };
    }
    return fail([error.message]);
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const now = Date.now();

  type DueItem = {
    id: string;
    partnerId: string | null;
    payload: Record<string, unknown>;
  } & Pick<PartnerTipStaffNotifyBase, "serviceSlug">;

  const dueItems: DueItem[] = [];

  for (const row of rows) {
    const norm = normalizePartnerTipAdminStatus(row.admin_status);
    if (norm !== "in_bearbeitung") continue;

    const slugRaw = String(row.service_slug ?? "");
    if (!isPartnerTipStaffMailSlug(slugRaw)) continue;

    const createdAt = new Date(String(row.created_at ?? "")).getTime();
    if (!Number.isFinite(createdAt)) continue;

    const lastRaw = row.last_in_bearbeitung_staff_reminder_at;
    const lastAt =
      lastRaw != null && String(lastRaw).trim() !== ""
        ? new Date(String(lastRaw)).getTime()
        : null;

    const due =
      lastAt == null || !Number.isFinite(lastAt)
        ? createdAt + THREE_DAYS_MS <= now
        : lastAt + THREE_DAYS_MS <= now;

    if (!due) continue;

    dueItems.push({
      id: String(row.id),
      partnerId: row.partner_id != null ? String(row.partner_id) : null,
      serviceSlug: slugRaw,
      payload: (row.payload as Record<string, unknown>) ?? {},
    });
  }

  const partnerIds = [...new Set(dueItems.map((d) => d.partnerId).filter((x): x is string => Boolean(x)))];
  const profileById = new Map<
    string,
    { organization_name?: string | null; display_name?: string | null; partner_referral_code?: string | null }
  >();

  if (partnerIds.length > 0) {
    const { data: profs, error: profErr } = await svc
      .from("partner_profiles")
      .select("id, organization_name, display_name, partner_referral_code")
      .in("id", partnerIds.slice(0, 500));

    if (profErr) {
      console.warn("[partner-tip-reminder] partner_profiles:", profErr.message);
    } else {
      for (const p of (profs ?? []) as Record<string, unknown>[]) {
        profileById.set(String(p.id), {
          organization_name: p.organization_name as string | null,
          display_name: p.display_name as string | null,
          partner_referral_code: p.partner_referral_code as string | null,
        });
      }
    }
  }

  let sent = 0;
  const errors: string[] = [];
  const capped = dueItems.slice(0, MAX_REMINDERS_PER_RUN);

  for (const d of capped) {
    const summary = partnerTipPayloadSummary(d.payload, d.serviceSlug);
    let partnerHint: string | undefined;
    if (d.partnerId) {
      const pr = profileById.get(d.partnerId);
      if (pr) {
        partnerHint = [pr.organization_name, pr.display_name, pr.partner_referral_code]
          .map((s) => (typeof s === "string" ? s.trim() : ""))
          .filter(Boolean)
          .join(" · ");
      }
    }

    const okMail = await notifyStaffOfInBearbeitungPartnerTipReminder({
      serviceSlug: d.serviceSlug,
      tipId: d.id,
      payloadSummary: summary,
      partnerHint: partnerHint || undefined,
    });

    if (!okMail) {
      errors.push(`SMTP/Versand fehlgeschlagen (Tipp ${d.id}).`);
      continue;
    }

    const { error: updErr } = await svc
      .from("partner_tip_submissions")
      .update({ last_in_bearbeitung_staff_reminder_at: new Date().toISOString() })
      .eq("id", d.id);

    if (updErr) {
      if (isSupabaseMissingColumnError(updErr)) {
        errors.push("Spalte last_in_bearbeitung_staff_reminder_at fehlt – Migration 023 ausführen.");
        break;
      }
      errors.push(`Update Reminder-Zeitstempel fehlgeschlagen (${d.id}): ${updErr.message}`);
      continue;
    }
    sent += 1;
  }

  const ok = errors.length === 0 || sent > 0;

  return {
    ok,
    eligibleRows: rows.length,
    dueCount: dueItems.length,
    sent,
    errors,
  };
}
