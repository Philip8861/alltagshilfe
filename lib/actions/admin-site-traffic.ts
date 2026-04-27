"use server";

import { calendarMonthBounds, calendarYearBounds } from "@/lib/site-analytics/month-bounds";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type AdminSiteTrafficPayload = {
  year: number;
  month: number;
  monthTotal: number;
  yearTotal: number;
  monthPaths: { path: string; view_count: number }[];
  yearPaths: { path: string; view_count: number }[];
};

export async function fetchAdminSiteTrafficAction(year: number, month: number): Promise<
  { ok: true; data: AdminSiteTrafficPayload } | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht angemeldet." };
  }
  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "Service nicht konfiguriert." };
  }

  const y = Math.min(2100, Math.max(2020, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from: mFrom, to: mTo } = calendarMonthBounds(y, m);
  const { from: yFrom, to: yTo } = calendarYearBounds(y);

  const [monthRes, yearRes] = await Promise.all([
    svc.rpc("admin_site_traffic_by_path_range", { p_from: mFrom, p_to: mTo }),
    svc.rpc("admin_site_traffic_by_path_range", { p_from: yFrom, p_to: yTo }),
  ]);

  if (monthRes.error) {
    console.error("[fetchAdminSiteTrafficAction]", monthRes.error.message);
    return { ok: false, message: "Auswertung fehlgeschlagen." };
  }
  if (yearRes.error) {
    console.error("[fetchAdminSiteTrafficAction]", yearRes.error.message);
    return { ok: false, message: "Auswertung fehlgeschlagen." };
  }

  const mapRows = (data: unknown): { path: string; view_count: number }[] => {
    if (!Array.isArray(data)) return [];
    return data.map((r) => {
      const row = r as Record<string, unknown>;
      return {
        path: String(row.path ?? ""),
        view_count: Number(row.view_count ?? 0),
      };
    });
  };

  const monthPaths = mapRows(monthRes.data);
  const yearPaths = mapRows(yearRes.data);
  const monthTotal = monthPaths.reduce((s, r) => s + r.view_count, 0);
  const yearTotal = yearPaths.reduce((s, r) => s + r.view_count, 0);

  return {
    ok: true,
    data: { year: y, month: m, monthTotal, yearTotal, monthPaths, yearPaths },
  };
}
