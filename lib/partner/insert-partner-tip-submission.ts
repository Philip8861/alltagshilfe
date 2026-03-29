import { isSupabaseMissingColumnError } from "@/lib/partner/supabase-schema-errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type { PartnerTipSubmissionInput } from "@/lib/validations/partner-tips";
import type { SupabaseClient } from "@supabase/supabase-js";

export type InsertPartnerTipSubmissionResult = { ok: true } | { ok: false; message: string };

function buildRows(partnerId: string, data: PartnerTipSubmissionInput) {
  const base = {
    partner_id: partnerId,
    service_slug: data.service_slug,
    payload: data.payload as Record<string, unknown>,
  };
  return {
    full: { ...base, admin_status: "in_bearbeitung" as const },
    minimal: base,
  };
}

async function insertWithColumnFallback(
  client: SupabaseClient,
  partnerId: string,
  data: PartnerTipSubmissionInput,
) {
  const { full, minimal } = buildRows(partnerId, data);
  let res = await client.from("partner_tip_submissions").insert(full);
  if (res.error && isSupabaseMissingColumnError(res.error)) {
    res = await client.from("partner_tip_submissions").insert(minimal);
  }
  return res;
}

/**
 * Schreibt einen Tipp; zuerst Service-Role, sonst User-Client (RLS).
 * Fallback ohne admin_status, falls die Spalte in der DB noch fehlt (nur Migration 007).
 */
export async function insertPartnerTipSubmission(
  partnerId: string,
  data: PartnerTipSubmissionInput,
): Promise<InsertPartnerTipSubmissionResult> {
  const svc = createSupabaseServiceRoleClient();
  if (svc) {
    const svcRes = await insertWithColumnFallback(svc, partnerId, data);
    if (!svcRes.error) return { ok: true };
    if (!isSupabaseMissingColumnError(svcRes.error)) {
      console.error(
        "[insertPartnerTipSubmission] service_role:",
        svcRes.error.message,
        svcRes.error.code,
        svcRes.error.details,
      );
    }
  }

  const supabase = await createSupabaseServerClient();
  const userRes = await insertWithColumnFallback(supabase, partnerId, data);
  if (userRes.error) {
    console.error(
      "[insertPartnerTipSubmission] user client:",
      userRes.error.message,
      userRes.error.code,
      userRes.error.details,
    );
    return { ok: false, message: "Speichern fehlgeschlagen. Bitte Seite neu laden oder Support informieren." };
  }
  return { ok: true };
}
