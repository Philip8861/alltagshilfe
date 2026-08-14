"use server";

import { revalidatePath } from "next/cache";
import {
  buildIstPrognoseRow,
  conversionRatePercent,
  linearRegression,
  predictLinear,
  round1,
  round2,
  visitorsPerCompletion,
  type IstPrognoseRow,
} from "@/lib/site-analytics/conversion-forecast";
import { CONVERSION_STATS_START_DAY } from "@/lib/site-analytics/conversion-stats-start";
import {
  calendarDayBounds,
  calendarMonthBounds,
  calendarYearBounds,
} from "@/lib/site-analytics/month-bounds";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type HomepageTrafficGranularity = "tag" | "monat" | "jahr";

/** Ansicht der Traffic-Diagramme inkl. frei wählbarem Von–Bis-Zeitraum. */
export type HomepageTrafficViewMode = HomepageTrafficGranularity | "zeitraum";

export type HomepageSeriesPoint = { label: string; views: number };

const YEAR_RANGE_START = 2020;

/** Von–Bis: bis zu dieser Länge (Tage) Tagespunkte, darüber Monatssummen. */
const RANGE_DAILY_MAX_DAYS = 92;

/** Normalisiert ein Von–Bis-Paar (YYYY-MM-DD); vertauscht bei Bedarf; null bei ungültiger Eingabe. */
function sanitizeDayRange(
  fromDay: string | undefined,
  toDay: string | undefined,
): { from: string; to: string } | null {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  const f = (fromDay ?? "").trim();
  const t = (toDay ?? "").trim();
  if (!re.test(f) || !re.test(t)) return null;
  return f <= t ? { from: f, to: t } : { from: t, to: f };
}

/** Serie für frei gewählten Zeitraum: tagesgenau bis RANGE_DAILY_MAX_DAYS, sonst Monatssummen. */
function fillRangeSeries(
  from: string,
  to: string,
  rawDay: { bucket: string; view_count: number }[],
): HomepageSeriesPoint[] {
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  const byDay = new Map<string, number>();
  for (const r of rawDay) byDay.set(r.bucket.slice(0, 10), r.view_count);
  const spanDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  if (spanDays <= RANGE_DAILY_MAX_DAYS) {
    const withYear = start.getFullYear() !== end.getFullYear();
    const out: HomepageSeriesPoint[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(
        "de-DE",
        withYear ? { day: "2-digit", month: "short", year: "2-digit" } : { day: "2-digit", month: "short" },
      );
      out.push({ label, views: byDay.get(key) ?? 0 });
    }
    return out;
  }
  const monthTotals = new Map<string, number>();
  const monthOrder: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    const mKey = key.slice(0, 7);
    if (!monthTotals.has(mKey)) monthOrder.push(mKey);
    monthTotals.set(mKey, (monthTotals.get(mKey) ?? 0) + (byDay.get(key) ?? 0));
  }
  return monthOrder.map((mKey) => {
    const y = Number(mKey.slice(0, 4));
    const m0 = Number(mKey.slice(5, 7)) - 1;
    return {
      label: `${new Date(y, m0, 1).toLocaleString("de-DE", { month: "short" })} ${y}`,
      views: monthTotals.get(mKey) ?? 0,
    };
  });
}

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
  gran: HomepageTrafficViewMode,
  fromDay?: string,
  toDay?: string,
): Promise<{ ok: true; data: HomepageSeriesPoint[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));

  try {
    if (gran === "zeitraum") {
      const r = sanitizeDayRange(fromDay, toDay) ?? calendarMonthBounds(y, m);
      const res = await svcRpc(svc, "admin_site_traffic_totals_by_day", { p_from: r.from, p_to: r.to });
      if (res.error) throw new Error(res.error.message);
      return { ok: true, data: fillRangeSeries(r.from, r.to, parseDayRows(res.data)) };
    }
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
  gran: HomepageTrafficViewMode,
  fromDay?: string,
  toDay?: string,
): Promise<{ ok: true; data: HomepageSeriesPoint[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const p = path.trim().slice(0, 2048);
  if (!p) return { ok: false, message: "Pfad fehlt." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));

  try {
    if (gran === "zeitraum") {
      const r = sanitizeDayRange(fromDay, toDay) ?? calendarMonthBounds(y, m);
      const res = await svcRpc(svc, "admin_site_traffic_path_by_day", {
        p_path: p,
        p_from: r.from,
        p_to: r.to,
      });
      if (res.error) throw new Error(res.error.message);
      return { ok: true, data: fillRangeSeries(r.from, r.to, parseDayRows(res.data)) };
    }
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
  scope: "monat" | "jahr" | "zeitraum",
  fromDay?: string,
  toDay?: string,
): Promise<
  { ok: true; data: HomepageDeviceBreakdownRow[] } | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from, to } =
    scope === "zeitraum"
      ? (sanitizeDayRange(fromDay, toDay) ?? calendarMonthBounds(y, m))
      : scope === "monat"
        ? calendarMonthBounds(y, m)
        : calendarYearBounds(y);

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

/**
 * Löscht aggregierte Homepage-Aufrufe, Unique Visitors und Conversion-Anfragen.
 * `contact_sources_daily` (Anfragen nach Kanal) bleibt unberührt.
 * Nur System-Admin; nicht rückgängig zu machen.
 */
export async function resetHomepageSiteAnalyticsAction(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  try {
    /* PostgREST verlangt einen Filter; alle Zeilen haben views/visitors/completions >= 0 */
    const { error } = await svc.from("site_page_views_daily").delete().gte("views", 0);
    if (error) throw new Error(error.message);
    const { error: uniqueErr } = await svc.from("site_unique_visitors_daily").delete().gte("visitors", 0);
    if (uniqueErr) throw new Error(uniqueErr.message);
    const { error: convErr } = await svc
      .from("site_conversion_completions_daily")
      .delete()
      .gte("completions", 0);
    if (convErr) throw new Error(convErr.message);
    revalidatePath("/partner/admin");
    return { ok: true };
  } catch (e) {
    console.error("[resetHomepageSiteAnalyticsAction]", e);
    return { ok: false, message: "Zähler konnten nicht zurückgesetzt werden." };
  }
}

/* ───────────── Kontaktquellen-Statistik (anonyme Aggregate) ───────────── */

/** Zeitraum der Kontakt-Auswertung: ein Tag, ein Monat, ganzes Jahr oder frei wählbar (von–bis). */
export type ContactStatsScope = "tag" | "monat" | "jahr" | "zeitraum";

function contactStatsRange(
  year: number,
  month: number,
  scope: ContactStatsScope,
  /** Nur bei scope „tag“ relevant (1 … Tage im Monat). */
  day: number,
  /** Nur bei scope „zeitraum“ relevant (YYYY-MM-DD). */
  fromDay?: string,
  toDay?: string,
): { from: string; to: string } {
  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  if (scope === "zeitraum") {
    return sanitizeDayRange(fromDay, toDay) ?? calendarMonthBounds(y, m);
  }
  if (scope === "tag") return calendarDayBounds(y, m, day);
  if (scope === "monat") return calendarMonthBounds(y, m);
  return calendarYearBounds(y);
}

export type ContactSourceStatsRow = {
  source: string;
  kind: string;
  view_count: number;
};

export type ContactKindDailyRow = { day: string; kind: string; view_count: number };

/** Bekannte Kanäle in sinnvoller Reihenfolge für Diagramm und Legende (weitere alphabetisch dahinter). */
const CONTACT_KIND_DAILY_ORDER = [
  "contact",
  "ratgeber",
  "hilfefinder",
  "landingpage-social-media",
  "pflegebox",
  "betrieblich-angebot",
  "karriere",
  "karriere-form",
  "karriere-wizard",
] as const;

function parseContactKindDailyRows(data: unknown): ContactKindDailyRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    const d = row.day;
    let day =
      typeof d === "string"
        ? d.slice(0, 10)
        : d instanceof Date
          ? d.toISOString().slice(0, 10)
          : String(d ?? "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) day = "";
    return {
      day,
      kind: String(row.kind ?? "contact"),
      view_count: Number(row.view_count ?? 0),
    };
  }).filter((r) => r.day.length > 0);
}

/** Pro Kalendertag eine flache Datenzeile (Chart: dataKey je kind). */
function buildContactKindDailyChartSeries(
  from: string,
  to: string,
  rows: ContactKindDailyRow[],
  kindsOrdered: string[],
): Record<string, string | number>[] {
  const byDayKind = new Map<string, Map<string, number>>();
  for (const r of rows) {
    if (!r.day) continue;
    const inner = byDayKind.get(r.day) ?? new Map<string, number>();
    inner.set(r.kind, (inner.get(r.kind) ?? 0) + r.view_count);
    byDayKind.set(r.day, inner);
  }
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  const out: Record<string, string | number>[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    const inner = byDayKind.get(key) ?? new Map<string, number>();
    const label = d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "short" });
    const point: Record<string, string | number> = { label, day: key };
    for (const k of kindsOrdered) {
      point[k] = inner.get(k) ?? 0;
    }
    out.push(point);
  }
  return out;
}

function orderKindsForDailyChart(kindSet: Set<string>): string[] {
  const orderPreset = CONTACT_KIND_DAILY_ORDER as readonly string[];
  const known = orderPreset.filter((k) => kindSet.has(k));
  const rest = [...kindSet].filter((k) => !orderPreset.includes(k)).sort();
  return [...known, ...rest];
}

export async function fetchContactKindDailyStatsAction(
  year: number,
  month: number,
  scope: ContactStatsScope,
  /** Bei scope „tag“: Kalendertag (1–31, wird gekappt); sonst ignoriert. */
  day: number = 1,
  /** Bei scope „zeitraum“: Von–Bis (YYYY-MM-DD); sonst ignoriert. */
  fromDay?: string,
  toDay?: string,
): Promise<
  | {
      ok: true;
      data: ContactKindDailyRow[];
      chartSeries: Record<string, string | number>[];
      kinds: string[];
    }
  | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from, to } = contactStatsRange(y, m, scope, day, fromDay, toDay);

  const res = await svcRpc(svc, "admin_contact_kind_totals_by_day", {
    p_from: from,
    p_to: to,
  });
  if (res.error) {
    console.error("[fetchContactKindDailyStatsAction]", res.error.message);
    return {
      ok: false,
      message:
        "Tagesauswertung nach Kanal fehlgeschlagen (Migration 019 ausgeführt? RPC admin_contact_kind_totals_by_day).",
    };
  }

  const data = parseContactKindDailyRows(res.data);
  const kindSet = new Set<string>();
  for (const r of data) kindSet.add(r.kind);
  const kinds = orderKindsForDailyChart(kindSet);
  const chartSeries =
    kinds.length > 0 ? buildContactKindDailyChartSeries(from, to, data, kinds) : [];
  return { ok: true, data, chartSeries, kinds };
}

/** Aggregiert nach ISO-Wochentag (1 = Montag … 7 = Sonntag): Karriere vs. alle übrigen Kanäle gemeinsam. */
export type ContactWeekdayGroupRow = {
  isoWeekday: number;
  weekdayLabel: string;
  karriere: number;
  ohneKarriere: number;
};

const ISO_WEEKDAY_LABELS_DE = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
] as const;

function parseContactWeekdayGroupRpc(data: unknown): Map<number, { k: number; rest: number }> {
  const m = new Map<number, { k: number; rest: number }>();
  if (!Array.isArray(data)) return m;
  for (const row of data) {
    const r = row as Record<string, unknown>;
    const iso = Number(r.iso_weekday ?? 0);
    if (iso < 1 || iso > 7) continue;
    m.set(iso, {
      k: Number(r.karriere_views ?? 0),
      rest: Number(r.ohne_karriere_views ?? 0),
    });
  }
  return m;
}

function fillContactWeekdayGroups(raw: Map<number, { k: number; rest: number }>): ContactWeekdayGroupRow[] {
  return ISO_WEEKDAY_LABELS_DE.map((weekdayLabel, i) => {
    const isoWeekday = i + 1;
    const cell = raw.get(isoWeekday);
    return {
      isoWeekday,
      weekdayLabel,
      karriere: cell?.k ?? 0,
      ohneKarriere: cell?.rest ?? 0,
    };
  });
}

export async function fetchContactWeekdayGroupTotalsAction(
  year: number,
  month: number,
  scope: ContactStatsScope,
  day: number = 1,
  fromDay?: string,
  toDay?: string,
): Promise<{ ok: true; weekdays: ContactWeekdayGroupRow[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from, to } = contactStatsRange(y, m, scope, day, fromDay, toDay);

  try {
    const res = await svcRpc(svc, "admin_contact_weekday_group_totals", {
      p_from: from,
      p_to: to,
    });
    if (res.error) throw new Error(res.error.message);
    const raw = parseContactWeekdayGroupRpc(res.data);
    return { ok: true, weekdays: fillContactWeekdayGroups(raw) };
  } catch (e) {
    console.error("[fetchContactWeekdayGroupTotalsAction]", e);
    return {
      ok: false,
      message:
        "Wochentags-Auswertung fehlgeschlagen (Migration 022 ausgeführt? RPC admin_contact_weekday_group_totals).",
    };
  }
}

/**
 * Aggregiert alle Anfragen nach (Quelle, Formular-Typ) im gewählten Zeitraum.
 * Liest aus `contact_sources_daily` (Service Role); Personenbezug ist ausgeschlossen,
 * weil die Tabelle nur (Tag, Quelle, Formular-Typ, Anzahl) speichert.
 */
export async function fetchContactSourceStatsAction(
  year: number,
  month: number,
  scope: ContactStatsScope,
  day: number = 1,
  fromDay?: string,
  toDay?: string,
): Promise<{ ok: true; data: ContactSourceStatsRow[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from, to } = contactStatsRange(y, m, scope, day, fromDay, toDay);

  const res = await svcRpc(svc, "admin_contact_sources_by_range", {
    p_from: from,
    p_to: to,
  });
  if (res.error) {
    console.error("[fetchContactSourceStatsAction]", res.error.message);
    return {
      ok: false,
      message:
        "Quellen-Auswertung fehlgeschlagen (Migration 018 ausgeführt? Tabelle contact_sources_daily verfügbar?).",
    };
  }

  const rows: ContactSourceStatsRow[] = Array.isArray(res.data)
    ? res.data.map((r: unknown) => {
        const row = r as Record<string, unknown>;
        return {
          source: String(row.source ?? ""),
          kind: String(row.kind ?? "contact"),
          view_count: Number(row.view_count ?? 0),
        };
      })
    : [];
  return { ok: true, data: rows };
}

/**
 * Löscht alle aggregierten Kontaktquellen (`contact_sources_daily`).
 * Nur System-Admin; nicht rückgängig zu machen.
 */
export async function resetContactSourceStatsAction(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  try {
    const { error } = await svc.from("contact_sources_daily").delete().gte("views", 0);
    if (error) throw new Error(error.message);
    revalidatePath("/partner/admin");
    return { ok: true };
  } catch (e) {
    console.error("[resetContactSourceStatsAction]", e);
    return { ok: false, message: "Zähler konnten nicht zurückgesetzt werden." };
  }
}

/* ───────────── Unique Visitors × Formular-Conversion ───────────── */

/** Kanal-Gruppen für Conversion (gleiche Struktur wie Admin-UI). */
const CONVERSION_CHANNEL_GROUPS: { id: string; label: string; kinds: readonly string[] }[] = [
  { id: "contact", label: "Kontaktformular", kinds: ["contact"] },
  { id: "hilfefinder", label: "Hilfe-Finder", kinds: ["hilfefinder"] },
  {
    id: "landingpage-social-media",
    label: "Landingpage Social Media",
    kinds: ["landingpage-social-media"],
  },
  { id: "ratgeber", label: "Ratgeber", kinds: ["ratgeber"] },
  { id: "pflegebox", label: "Pflegebox", kinds: ["pflegebox"] },
  { id: "betrieblich-angebot", label: "Betriebliches Angebot", kinds: ["betrieblich-angebot"] },
  {
    id: "karriere",
    label: "Karriere",
    kinds: ["karriere", "karriere-form", "karriere-wizard"],
  },
];

export type ConversionSeriesPoint = {
  label: string;
  day: string;
  visitors: number;
  completions: number;
  conversionPercent: number | null;
  /** Prognose-Besucher (nur Forecast-Punkte). */
  forecastVisitors?: number | null;
  /** Prognose-Anfragen (nur Forecast-Punkte). */
  forecastCompletions?: number | null;
};

export type ConversionForecast = {
  /** Erwartete Besucher pro Tag (Trendende der Historie). */
  visitorsPerDay: number;
  /** Durchschnittliche Conversion-Rate (0…100) im Zeitraum. */
  avgConversionPercent: number;
  /** Erwartete Anfragen pro Tag = visitorsPerDay × Rate. */
  completionsPerDay: number;
  /** Erwartete Anfragen in den nächsten 30 Tagen. */
  completionsNext30Days: number;
  /** Trendsteigung Besucher/Tag (positiv = steigend). */
  visitorSlopePerDay: number;
  /** Trendsteigung Conversion-Punkte/Tag. */
  conversionSlopePerDay: number;
  /** Kurze Textbewertung. */
  trendLabel: string;
};

export type ConversionChannelSummary = {
  id: string;
  label: string;
  completions: number;
  conversionPercent: number | null;
  visitorsPerCompletion: number | null;
  /** Anteil an allen Anfragen im Zeitraum (0…100). */
  sharePercent: number | null;
  /** Tagesverlauf nur für diesen Kanal. */
  series: ConversionSeriesPoint[];
  forecastSeries: ConversionSeriesPoint[];
  forecast: ConversionForecast | null;
  istPrognose: IstPrognoseRow;
  trendLabel: string;
};

/** IST (bisher) vs. Voraussichtlich (Prognose) – Anfragen/Tag · Monat · Jahr. */
export type ConversionIstPrognose = {
  daysObserved: number;
  visitorsPerDayIst: number;
  visitorsPerDayPrognose: number;
  /** Zeilen je Formular + Gesamt. */
  rows: IstPrognoseRow[];
};

export type ConversionStatsResult = {
  visitorsTotal: number;
  completionsTotal: number;
  conversionPercent: number | null;
  visitorsPerCompletion: number | null;
  channels: ConversionChannelSummary[];
  series: ConversionSeriesPoint[];
  forecastSeries: ConversionSeriesPoint[];
  forecast: ConversionForecast | null;
  istPrognose: ConversionIstPrognose;
  /** Erster Tag, ab dem dieser Bereich Daten einbezieht (YYYY-MM-DD). */
  trackingStartDay: string;
};

function parseVisitorDayRows(data: unknown): { bucket: string; visitor_count: number }[] {
  if (!Array.isArray(data)) return [];
  return data.map((r) => {
    const row = r as Record<string, unknown>;
    const b = row.bucket ?? row.day;
    const bucket =
      typeof b === "string" ? b.slice(0, 10) : b instanceof Date ? b.toISOString().slice(0, 10) : String(b ?? "");
    return { bucket, visitor_count: Number(row.visitor_count ?? 0) };
  });
}

function sumKindsForDay(kindMap: Map<string, number> | undefined, kinds: readonly string[]): number {
  if (!kindMap) return 0;
  return kinds.reduce((acc, k) => acc + (kindMap.get(k) ?? 0), 0);
}

function buildConversionTrendLabel(visitorSlope: number, conversionSlope: number): string {
  const vUp = visitorSlope > 0.05;
  const vDown = visitorSlope < -0.05;
  const cUp = conversionSlope > 0.01;
  const cDown = conversionSlope < -0.01;
  if (vUp && cUp) return "Besucher und Conversion steigen – Anfragen wachsen überproportional.";
  if (vUp && cDown) return "Mehr Besucher, aber sinkende Conversion – Anfragen halten nicht Schritt.";
  if (vDown && cUp) return "Weniger Besucher, aber bessere Conversion – Qualität der Besucher steigt.";
  if (vDown && cDown) return "Besucher und Conversion sinken – Anfragen gehen zurück.";
  if (vUp) return "Besucher steigen, Conversion weitgehend stabil.";
  if (vDown) return "Besucher sinken, Conversion weitgehend stabil.";
  if (cUp) return "Conversion steigt bei stabilen Besucherzahlen.";
  if (cDown) return "Conversion sinkt bei stabilen Besucherzahlen.";
  return "Besucher und Conversion sind im Zeitraum weitgehend stabil.";
}

function emptyConversionStats(from: string, to: string, scope: ContactStatsScope): ConversionStatsResult {
  const start = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  const series: ConversionSeriesPoint[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    const label =
      scope === "jahr" || scope === "zeitraum"
        ? d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" })
        : d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "short" });
    series.push({
      label,
      day: key,
      visitors: 0,
      completions: 0,
      conversionPercent: null,
    });
  }
  const emptyRows = [
    ...CONVERSION_CHANNEL_GROUPS.map((g) => buildIstPrognoseRow(g.id, g.label, 0, 1, 0, 0)),
    buildIstPrognoseRow("gesamt", "Gesamt (alle Formulare)", 0, 1, 0, 0),
  ];
  return {
    visitorsTotal: 0,
    completionsTotal: 0,
    conversionPercent: null,
    visitorsPerCompletion: null,
    channels: CONVERSION_CHANNEL_GROUPS.map((g) => ({
      id: g.id,
      label: g.label,
      completions: 0,
      conversionPercent: null,
      visitorsPerCompletion: null,
      sharePercent: null,
      series: series.map((p) => ({ ...p, completions: 0, conversionPercent: null })),
      forecastSeries: [],
      forecast: null,
      istPrognose: buildIstPrognoseRow(g.id, g.label, 0, 1, 0, 0),
      trendLabel: "Noch keine Daten für diesen Bereich.",
    })),
    series,
    forecastSeries: [],
    forecast: null,
    istPrognose: {
      daysObserved: series.length,
      visitorsPerDayIst: 0,
      visitorsPerDayPrognose: 0,
      rows: emptyRows,
    },
    trackingStartDay: CONVERSION_STATS_START_DAY,
  };
}

/**
 * Unique Visitors (Statistik-Consent) × abgeschlossene Formulare im Zeitraum.
 * Anfragen kommen aus `site_conversion_completions_daily` (frisch ab Tracking-Start) –
 * nicht aus `contact_sources_daily` (dort bleibt der Altbestand für die anderen Kacheln).
 */
export async function fetchConversionStatsAction(
  year: number,
  month: number,
  scope: ContactStatsScope,
  day: number = 1,
  fromDay?: string,
  toDay?: string,
): Promise<{ ok: true; data: ConversionStatsResult } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const range = contactStatsRange(y, m, scope, day, fromDay, toDay);
  /** Nur ab Tracking-Start – verhindert verzerrte Conversion durch Alt-Anfragen ohne Unique Visitors. */
  const from =
    range.from < CONVERSION_STATS_START_DAY ? CONVERSION_STATS_START_DAY : range.from;
  const to = range.to;

  if (to < CONVERSION_STATS_START_DAY || from > to) {
    return { ok: true, data: emptyConversionStats(range.from, range.to, scope) };
  }

  try {
    const [visitorsRes, kindsRes] = await Promise.all([
      svcRpc(svc, "admin_site_unique_visitors_by_day", { p_from: from, p_to: to }),
      svcRpc(svc, "admin_site_conversion_completions_by_day", { p_from: from, p_to: to }),
    ]);
    if (visitorsRes.error) {
      throw new Error(
        visitorsRes.error.message.includes("function") || visitorsRes.error.message.includes("does not exist")
          ? "Unique-Visitor-Auswertung fehlt (Migration 031 ausgeführt?)."
          : visitorsRes.error.message,
      );
    }
    if (kindsRes.error) {
      throw new Error(
        kindsRes.error.message.includes("function") || kindsRes.error.message.includes("does not exist")
          ? "Conversion-Anfragen-Zähler fehlt (Migration 032 ausgeführt?)."
          : kindsRes.error.message,
      );
    }

    const visitorByDay = new Map<string, number>();
    for (const r of parseVisitorDayRows(visitorsRes.data)) {
      if (r.bucket) visitorByDay.set(r.bucket.slice(0, 10), r.visitor_count);
    }

    const kindsByDay = new Map<string, Map<string, number>>();
    for (const r of parseContactKindDailyRows(kindsRes.data)) {
      const inner = kindsByDay.get(r.day) ?? new Map<string, number>();
      inner.set(r.kind, (inner.get(r.kind) ?? 0) + r.view_count);
      kindsByDay.set(r.day, inner);
    }

    const start = new Date(`${from}T12:00:00`);
    const end = new Date(`${to}T12:00:00`);
    const series: ConversionSeriesPoint[] = [];
    const channelDaySeries = new Map<string, ConversionSeriesPoint[]>();
    for (const g of CONVERSION_CHANNEL_GROUPS) channelDaySeries.set(g.id, []);

    let visitorsTotal = 0;
    let completionsTotal = 0;
    const channelTotals = new Map<string, number>();

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const visitors = visitorByDay.get(key) ?? 0;
      const kindMap = kindsByDay.get(key);
      let dayCompletions = 0;
      const label =
        scope === "jahr" || scope === "zeitraum"
          ? d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" })
          : d.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "short" });

      for (const g of CONVERSION_CHANNEL_GROUPS) {
        const n = sumKindsForDay(kindMap, g.kinds);
        dayCompletions += n;
        channelTotals.set(g.id, (channelTotals.get(g.id) ?? 0) + n);
        channelDaySeries.get(g.id)!.push({
          label,
          day: key,
          visitors,
          completions: n,
          conversionPercent: conversionRatePercent(n, visitors),
        });
      }
      if (kindMap) {
        const known = new Set(CONVERSION_CHANNEL_GROUPS.flatMap((g) => [...g.kinds]));
        for (const [kind, n] of kindMap) {
          if (!known.has(kind)) dayCompletions += n;
        }
      }
      visitorsTotal += visitors;
      completionsTotal += dayCompletions;
      series.push({
        label,
        day: key,
        visitors,
        completions: dayCompletions,
        conversionPercent: conversionRatePercent(dayCompletions, visitors),
      });
    }

    const daysObserved = Math.max(1, series.length);
    const visitorsPerDayIst = visitorsTotal / daysObserved;
    const visitorYs = series.map((p) => p.visitors);
    const visitorTrend = linearRegression(visitorYs);
    const lastIdx = Math.max(0, series.length - 1);
    const visitorsPerDayPrognose = visitorTrend
      ? predictLinear(visitorTrend, lastIdx)
      : visitorsPerDayIst;
    const avgCvr = conversionRatePercent(completionsTotal, visitorsTotal) ?? 0;
    const cvrYs = series.map((p) => p.conversionPercent ?? 0);
    const cvrTrend = linearRegression(cvrYs);

    function buildChannelForecast(
      channelSeries: ConversionSeriesPoint[],
      channelCompletions: number,
    ): {
      forecast: ConversionForecast | null;
      forecastSeries: ConversionSeriesPoint[];
      trendLabel: string;
    } {
      const chCvr = conversionRatePercent(channelCompletions, visitorsTotal) ?? 0;
      const chCvrYs = channelSeries.map((p) => p.conversionPercent ?? 0);
      const chCvrTrend = linearRegression(chCvrYs);
      const chCompYs = channelSeries.map((p) => p.completions);
      const chCompTrend = linearRegression(chCompYs);
      const trendLabel = buildConversionTrendLabel(
        visitorTrend?.slope ?? 0,
        chCvrTrend?.slope ?? 0,
      );
      if (visitorsTotal <= 0 && channelCompletions <= 0) {
        return { forecast: null, forecastSeries: [], trendLabel: "Noch keine Daten für diesen Bereich." };
      }
      const completionsPerDay = visitorsPerDayPrognose * (chCvr / 100);
      const forecastSeries: ConversionSeriesPoint[] = [];
      let completionsNext30 = 0;
      for (let i = 1; i <= 30; i++) {
        const x = lastIdx + i;
        const fv = visitorTrend ? predictLinear(visitorTrend, x) : visitorsPerDayIst;
        const fc = chCompTrend
          ? predictLinear(chCompTrend, x)
          : fv * (chCvr / 100);
        completionsNext30 += fc;
        const fd = new Date(end);
        fd.setDate(fd.getDate() + i);
        forecastSeries.push({
          label: fd.toLocaleDateString("de-DE", { day: "2-digit", month: "short" }),
          day: fd.toISOString().slice(0, 10),
          visitors: 0,
          completions: 0,
          conversionPercent: null,
          forecastVisitors: round1(fv),
          forecastCompletions: round2(fc),
        });
      }
      return {
        trendLabel,
        forecastSeries,
        forecast: {
          visitorsPerDay: round1(visitorsPerDayPrognose),
          avgConversionPercent: round2(chCvr),
          completionsPerDay: round2(completionsPerDay),
          completionsNext30Days: round1(completionsNext30),
          visitorSlopePerDay: round2(visitorTrend?.slope ?? 0),
          conversionSlopePerDay: Math.round((chCvrTrend?.slope ?? 0) * 1000) / 1000,
          trendLabel,
        },
      };
    }

    const channels: ConversionChannelSummary[] = CONVERSION_CHANNEL_GROUPS.map((g) => {
      const completions = channelTotals.get(g.id) ?? 0;
      const chSeries = channelDaySeries.get(g.id) ?? [];
      const { forecast, forecastSeries, trendLabel } = buildChannelForecast(chSeries, completions);
      const ist = buildIstPrognoseRow(
        g.id,
        g.label,
        completions,
        daysObserved,
        visitorsTotal,
        visitorsPerDayPrognose,
      );
      return {
        id: g.id,
        label: g.label,
        completions,
        conversionPercent: conversionRatePercent(completions, visitorsTotal),
        visitorsPerCompletion: visitorsPerCompletion(visitorsTotal, completions),
        sharePercent:
          completionsTotal > 0 ? round1((completions / completionsTotal) * 100) : null,
        series: chSeries,
        forecastSeries,
        forecast,
        istPrognose: ist,
        trendLabel,
      };
    });

    const istPrognoseRows: IstPrognoseRow[] = [
      ...channels.map((ch) => ch.istPrognose),
      buildIstPrognoseRow(
        "gesamt",
        "Gesamt (alle Formulare)",
        completionsTotal,
        daysObserved,
        visitorsTotal,
        visitorsPerDayPrognose,
      ),
    ];

    let forecast: ConversionForecast | null = null;
    const forecastSeries: ConversionSeriesPoint[] = [];
    if (visitorsTotal > 0 || completionsTotal > 0) {
      const completionsPerDay = visitorsPerDayPrognose * (avgCvr / 100);
      let completionsNext30 = 0;
      for (let i = 1; i <= 30; i++) {
        const x = lastIdx + i;
        const fv = visitorTrend ? predictLinear(visitorTrend, x) : visitorsPerDayIst;
        const fc = fv * (avgCvr / 100);
        completionsNext30 += fc;
        const fd = new Date(end);
        fd.setDate(fd.getDate() + i);
        forecastSeries.push({
          label: fd.toLocaleDateString("de-DE", { day: "2-digit", month: "short" }),
          day: fd.toISOString().slice(0, 10),
          visitors: 0,
          completions: 0,
          conversionPercent: null,
          forecastVisitors: round1(fv),
          forecastCompletions: round2(fc),
        });
      }
      const trendLabel = buildConversionTrendLabel(visitorTrend?.slope ?? 0, cvrTrend?.slope ?? 0);
      forecast = {
        visitorsPerDay: round1(visitorsPerDayPrognose),
        avgConversionPercent: round2(avgCvr),
        completionsPerDay: round2(completionsPerDay),
        completionsNext30Days: round1(completionsNext30),
        visitorSlopePerDay: round2(visitorTrend?.slope ?? 0),
        conversionSlopePerDay: Math.round((cvrTrend?.slope ?? 0) * 1000) / 1000,
        trendLabel,
      };
    }

    return {
      ok: true,
      data: {
        visitorsTotal,
        completionsTotal,
        conversionPercent: conversionRatePercent(completionsTotal, visitorsTotal),
        visitorsPerCompletion: visitorsPerCompletion(visitorsTotal, completionsTotal),
        channels,
        series,
        forecastSeries,
        forecast,
        istPrognose: {
          daysObserved,
          visitorsPerDayIst: round1(visitorsPerDayIst),
          visitorsPerDayPrognose: round1(visitorsPerDayPrognose),
          rows: istPrognoseRows,
        },
        trackingStartDay: CONVERSION_STATS_START_DAY,
      },
    };
  } catch (e) {
    console.error("[fetchConversionStatsAction]", e);
    const msg = e instanceof Error ? e.message : "Conversion-Statistik konnte nicht geladen werden.";
    return { ok: false, message: msg };
  }
}
