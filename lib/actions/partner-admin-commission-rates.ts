"use server";

import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { fetchPartnerCommissionRates } from "@/lib/partner/partner-commission-rates";
import type { PartnerCommissionRatesMap } from "@/lib/partner/partner-commission-rates-shared";

export async function getPartnerCommissionRatesAction(
  partnerId: string,
): Promise<{ ok: true; rates: PartnerCommissionRatesMap } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  if (!partnerId?.trim()) {
    return { ok: false, message: "Partner-ID fehlt." };
  }

  try {
    const rates = await fetchPartnerCommissionRates(svc, partnerId);
    return { ok: true, rates };
  } catch {
    return { ok: false, message: "Provisionssätze konnten nicht geladen werden." };
  }
}
