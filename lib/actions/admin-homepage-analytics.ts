"use server";

import { calendarMonthBounds, calendarYearBounds } from "@/lib/site-analytics/month-bounds";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type HomepageTrafficGranularity = "tag" | "monat" | "jahr";

export type HomepageSeriesPoint = { label: string; views: number };

const YEAR_RANGE_START = 2020;

function svcRpc(svc: ReturnType<typeof createSupabaseServiceRoleClient>, name: string, args: Record<string, unknown>) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (svc as any).rpc(name, args);
}

function parseDayRows(data: unknown): { bucket: string; view_count: number }[] {
  if (!Array.isArray(data)) return [];
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    const b = row.bucket ?? row.day;
    const bucket = typeof b === "string" ? b : b instanceof Date ? b.toISOString().slice(0, 10) : String(b ?? "");
    return { bucket, view_count: Number(row.view_count ?? 0) };
  });
}

function parseMonthRows(data: unknown): { month: number; view_count: number }[] {
  if (!Array.isArray(data)) return [];
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    return { month: Number(row.month ?? 0), view_count: Number(row.view_count ?? 0) };
  });
}

function parseYearRows(data: unknown): { year: number; view_count: number }[] {
  if (!Array.isArray(data)) return [];
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    return { year: Number(row.year ?? 0), view_count: Number(row.view_count ?? 0) };
  });
}

/** Lückenlose Serie für Liniendiagramm (Tag im Monat, Monat im Jahr, Jahre im Bereich). */
function fillTotalSeries(
  gran: HomepageTrafficGranularity,
  year: number,
  month: number,
  rawDay: { bucket: string; view_count: number }[],
  rawMonth: { month: number; view_count: number }[],
  rawYear: { year: number; view_count: number }[],
): HomepageSeriesPoint[] {
  if (gran === "tag") {
    const { from, to } = calendarMonthBounds(year, month);
    const start = new Date(from + "T12:00:00");
    const end = new Date(to + "T12:00:00");
    const byDay = new Map<string, number>();
    for (const r of rawDay) byDay.set(r.bucket.slice(0, 10), r.view_count);
    const out: HomepageSeriesPoint[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
      out.push({ label, views: byDay.get(key) ?? 0 });
    }
    return out;
  }
  if (gran === "monat") {
    const byM = new Map<number, number>();
    for (const r of rawMonth) byM.set(r.month, r.view_count);
    const out: HomepageSeriesPoint[] = [];
    for (let m = 1; m <= 12; m++) {
      const label = new Date(year, m - 1, 1).toLocaleString("de-DE", { month: "short" });
      out.push({ label, views: byM.get(m) ?? 0 });
    }
    return out;
  }
  const yEnd = Math.min(2100, Math.max(YEAR_RANGE_START, year));
  const byY = new Map<number, number>();
  for (const r of rawYear) byY.set(r.year, r.view_count);
  const out: HomepageSeriesPoint[] = [];
  for (let y = YEAR_RANGE_START; y <= yEnd; y++) {
    out.push({ label: String(y), views: byY.get(y) ?? 0 });
  }
  return out;
}

function fillPathSeries(
  gran: HomepageTrafficGranularity,
  year: number,
  month: number,
  rawDay: { bucket: string; view_count: number }[],
  rawMonth: { month: number; view_count: number }[],
  rawYear: { year: number; view_count: number }[],
): HomepageSeriesPoint[] {
  return fillTotalSeries(gran, year, month, rawDay, rawMonth, rawYear);
}

export async function fetchHomepageTotalsSeriesAction(
  year: number,
  month: number,
  gran: HomepageTrafficGranularity,
): Promise<{ ok: true; data: HomepageSeriesPoint[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));

  try {
    if (gran === "tag") {
      const { from, to } = calendarMonthBounds(y, m);
      const res = await svcRpc(svc, "admin_site_traffic_totals_by_day", { p_from: from, p_to: to });
      if (res.error) throw new Error(res.error.message);
      const series = fillTotalSeries("tag", y, m, parseDayRows(res.data), [], []);
      return { ok: true, data: series };
    }
    if (gran === "monat") {
      const res = await svcRpc(svc, "admin_site_traffic_totals_by_month_for_year", { p_year: y });
      if (res.error) throw new Error(res.error.message);
      const series = fillTotalSeries("monat", y, m, [], parseMonthRows(res.data), []);
      return { ok: true, data: series };
    }
    const res = await svcRpc(svc, "admin_site_traffic_totals_by_year", {
      p_year_from: YEAR_RANGE_START,
      p_year_to: y,
    });
    if (res.error) throw new Error(res.error.message);
    const series = fillTotalSeries("jahr", y, m, [], [], parseYearRows(res.data));
    return { ok: true, data: series };
  } catch (e) {
    console.error("[fetchHomepageTotalsSeriesAction]", e);
    return { ok: false, message: "Zeitreihe konnte nicht geladen werden (Migration 016 ausgeführt?)." };
  }
}

export async function fetchHomepagePathSeriesAction(
  path: string,
  year: number,
  month: number,
  gran: HomepageTrafficGranularity,
): Promise<{ ok: true; data: HomepageSeriesPoint[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const p = path.trim().slice(0, 2048);
  if (!p) return { ok: false, message: "Pfad fehlt." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));

  try {
    if (gran === "tag") {
      const { from, to } = calendarMonthBounds(y, m);
      const res = await svcRpc(svc, "admin_site_traffic_path_by_day", {
        p_path: p,
        p_from: from,
        p_to: to,
      });
      if (res.error) throw new Error(res.error.message);
      const series = fillPathSeries("tag", y, m, parseDayRows(res.data), [], []);
      return { ok: true, data: series };
    }
    if (gran === "monat") {
      const res = await svcRpc(svc, "admin_site_traffic_path_by_month_for_year", { p_path: p, p_year: y });
      if (res.error) throw new Error(res.error.message);
      const series = fillPathSeries("monat", y, m, [], parseMonthRows(res.data), []);
      return { ok: true, data: series };
    }
    const res = await svcRpc(svc, "admin_site_traffic_path_by_year", {
      p_path: p,
      p_year_from: YEAR_RANGE_START,
      p_year_to: y,
    });
    if (res.error) throw new Error(res.error.message);
    const series = fillPathSeries("jahr", y, m, [], [], parseYearRows(res.data));
    return { ok: true, data: series };
  } catch (e) {
    console.error("[fetchHomepagePathSeriesAction]", e);
    return { ok: false, message: "Zeitreihe für Pfad konnte nicht geladen werden." };
  }
}

export async function fetchHomepageYearPathTotalsAction(
  year: number,
): Promise<
  { ok: true; data: { path: string; view_count: number }[] } | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const { from: yFrom, to: yTo } = calendarYearBounds(y);

  const res = await svcRpc(svc, "admin_site_traffic_by_path_range", { p_from: yFrom, p_to: yTo });
  if (res.error) {
    console.error("[fetchHomepageYearPathTotalsAction]", res.error.message);
    return { ok: false, message: "Pfade konnten nicht geladen werden." };
  }
  const rows = Array.isArray(res.data)
    ? res.data.map((r: unknown) => {
        const row = r as Record<string, unknown>;
        return { path: String(row.path ?? ""), view_count: Number(row.view_count ?? 0) };
      })
    : [];
  return { ok: true, data: rows };
}

export type HomepageDeviceBreakdownRow = { device_category: string; view_count: number };

export async function fetchHomepageDeviceBreakdownAction(
  year: number,
  month: number,
  scope: "monat" | "jahr",
): Promise<
  { ok: true; data: HomepageDeviceBreakdownRow[] } | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from, to } = scope === "monat" ? calendarMonthBounds(y, m) : calendarYearBounds(y);

  const res = await svcRpc(svc, "admin_site_traffic_device_breakdown", { p_from: from, p_to: to });
  if (res.error) {
    console.error("[fetchHomepageDeviceBreakdownAction]", res.error.message);
    return { ok: false, message: "Geräte-Auswertung fehlgeschlagen (Migration 017?)." };
  }
  const rows = Array.isArray(res.data)
    ? res.data.map((r: unknown) => {
        const row = r as Record<string, unknown>;
        return {
          device_category: String(row.device_category ?? "unknown"),
          view_count: Number(row.view_count ?? 0),
        };
      })
    : [];
  return { ok: true, data: rows };
}
