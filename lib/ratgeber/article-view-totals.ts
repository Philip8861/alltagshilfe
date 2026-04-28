import { RATGEBER_BEITRAEGE } from "@/config/ratgeber-betraege";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

/**
 * Aggregiert Seitenaufrufe aus `site_page_views_daily` (Middleware-Analytics),
 * jeweils für den exakten Pfad `/ratgeber/[slug]` (über alle Geräte und Tage).
 */
export async function fetchRatgeberArticleViewTotals(): Promise<{ bySlug: Record<string, number>; live: boolean }> {
  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { bySlug: {}, live: false };
  }

  const paths = RATGEBER_BEITRAEGE.map((b) => `/ratgeber/${b.slug}`);
  /* eslint-disable @typescript-eslint/no-explicit-any -- generischer Supabase Client */
  const { data, error } = await (svc as any)
    .from("site_page_views_daily")
    .select("path, views")
    .in("path", paths);

  if (error || !data) {
    console.warn("[ratgeber/views]", error?.message ?? "keine Daten");
    return { bySlug: {}, live: false };
  }

  const byPath = new Map<string, number>();
  for (const row of data as { path: string; views: string | number }[]) {
    const p = typeof row.path === "string" ? row.path.trim() : "";
    const v = typeof row.views === "number" ? row.views : Number(row.views);
    if (!p || Number.isNaN(v)) continue;
    byPath.set(p, (byPath.get(p) ?? 0) + v);
  }

  const bySlug: Record<string, number> = {};
  for (const b of RATGEBER_BEITRAEGE) {
    const path = `/ratgeber/${b.slug}`;
    bySlug[b.slug] = byPath.get(path) ?? 0;
  }

  return { bySlug, live: true };
}

/** Für Anzeige: Live-Zähler wenn verfügbar, sonst statischer Referenzwert aus der Konfiguration. */
export function displayArticleViews(
  slug: string,
  seedViews: number,
  liveTotals: Record<string, number> | undefined,
  analyticsLive: boolean,
): number {
  if (!analyticsLive || !liveTotals) return seedViews;
  const v = liveTotals[slug];
  return v !== undefined ? v : seedViews;
}
