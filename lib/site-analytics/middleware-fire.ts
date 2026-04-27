import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { analyticsDayBerlin } from "@/lib/site-analytics/berlin-day";
import { deviceCategoryFromHeaders } from "@/lib/site-analytics/device-category";
import { normalizePathForSiteAnalytics, shouldRecordSitePageView } from "@/lib/site-analytics/record-page-view";

let supabaseSingleton: ReturnType<typeof createClient> | null = null;

function getServiceSupabaseForAnalytics() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  if (!supabaseSingleton) {
    supabaseSingleton = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseSingleton;
}

/**
 * Asynchroner Zählimpuls (kein await im Middleware-Hauptpfad).
 * Zählt nur aggregierte Seitenaufrufe; keine personenbezogenen Daten.
 */
export function fireSitePageViewIfEligible(request: NextRequest, pathnameForAnalytics: string): void {
  if (!shouldRecordSitePageView(request, pathnameForAnalytics)) return;
  const supabase = getServiceSupabaseForAnalytics();
  if (!supabase) return;

  const path = normalizePathForSiteAnalytics(pathnameForAnalytics);
  const day = analyticsDayBerlin();
  const device = deviceCategoryFromHeaders(request.headers);

  /* eslint-disable @typescript-eslint/no-explicit-any -- RPC nicht im generierten DB-Typ */
  void (supabase as any)
    .rpc("increment_site_page_view", { p_day: day, p_path: path, p_device: device })
    .then((res: { error: { message: string } | null }) => {
      if (res.error) console.warn("[site-analytics]", res.error.message);
    });
}
