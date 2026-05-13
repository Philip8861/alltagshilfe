"use server";

import { revalidatePath } from "next/cache";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { rateLimitWithConfig } from "@/lib/rate-limit";

export type PartnerAccountAdminResult = { ok: true } | { ok: false; message: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseUuid(v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return UUID_RE.test(s) ? s.toLowerCase() : null;
}

/** Admin: Partnerportal sperren oder wieder freigeben (Profil bleibt bestehen). */
export async function setPartnerAccountDisabledByAdminAction(
  partnerIdRaw: unknown,
  disabled: unknown,
): Promise<PartnerAccountAdminResult> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht angemeldet." };
  }
  const partnerId = parseUuid(partnerIdRaw);
  if (!partnerId) return { ok: false, message: "Ungültige Partner-ID." };

  const isDisabled = disabled === true || disabled === "true" || disabled === 1;

  try {
    const { success } = rateLimitWithConfig(`admin-partner-disable:${partnerId}`, 60, 60 * 1000);
    if (!success) return { ok: false, message: "Zu viele Anfragen. Bitte kurz warten." };
  } catch {
    /* ignore */
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Dienst nicht verfügbar." };

  const nextAt = isDisabled ? new Date().toISOString() : null;
  const { error } = await svc.from("partner_profiles").update({ account_disabled_at: nextAt }).eq("id", partnerId);

  if (error) {
    const m = (error.message ?? "").toLowerCase();
    if (m.includes("account_disabled_at") && (m.includes("does not exist") || m.includes("could not find"))) {
      return {
        ok: false,
        message: "Spalte account_disabled_at fehlt — Migration 025 in Supabase ausführen.",
      };
    }
    console.error("[setPartnerAccountDisabledByAdminAction]", error.message);
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  revalidatePath("/partner/admin");
  return { ok: true };
}
