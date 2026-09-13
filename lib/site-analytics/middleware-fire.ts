import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { analyticsDayBerlin } from "@/lib/site-analytics/berlin-day";
import { deviceCategoryFromHeaders } from "@/lib/site-analytics/device-category";
import { normalizePathForSiteAnalytics, shouldRecordSitePageView } from "@/lib/site-analytics/record-page-view";
import { shouldCountUniqueVisitorDocument } from "@/lib/site-analytics/unique-visitor";

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

type RpcClient = {
  rpc: (
    name: string,
    args: Record<string, unknown>,
  ) => Promise<{ error: { message: string } | null }>;
};

async function incrementPageView(
  supabase: RpcClient,
  day: string,
  path: string,
  device: string,
): Promise<void> {
  const res = await supabase.rpc("increment_site_page_view", {
    p_day: day,
    p_path: path,
    p_device: device,
  });
  if (res.error) console.warn("[site-analytics]", res.error.message);
}

async function incrementUniqueVisitor(supabase: RpcClient, day: string): Promise<void> {
  const res = await supabase.rpc("increment_site_unique_visitor", { p_day: day });
  if (res.error) console.warn("[site-analytics/unique]", res.error.message);
}

/**
 * Zählt Page-View und optional Unique Visitor.
 * Rückgabe: Berlin-Tag wenn Unique neu gezählt (Cookie setzen), sonst null.
 * `pending` muss per `waitUntil` am Leben gehalten werden (Edge friert sonst den RPC ab).
 */
export function scheduleSiteAnalyticsIfEligible(
  request: NextRequest,
  pathnameForAnalytics: string,
): { uniqueDay: string | null; pending: Promise<unknown> } {
  const tasks: Promise<unknown>[] = [];
  let uniqueDay: string | null = null;

  const supabase = getServiceSupabaseForAnalytics();
  if (!supabase) return { uniqueDay: null, pending: Promise.resolve() };

  const path = normalizePathForSiteAnalytics(pathnameForAnalytics);
  const day = analyticsDayBerlin();
  const device = deviceCategoryFromHeaders(request.headers);
  const rpc = supabase as unknown as RpcClient;

  if (shouldRecordSitePageView(request, path)) {
    tasks.push(incrementPageView(rpc, day, path, device));
  }

  if (shouldCountUniqueVisitorDocument(request, pathnameForAnalytics)) {
    uniqueDay = day;
    tasks.push(incrementUniqueVisitor(rpc, day));
  }

  return { uniqueDay, pending: Promise.all(tasks) };
}
