"use server";

import { revalidatePath } from "next/cache";
import {
  calendarDayBounds,
  calendarMonthBounds,
  calendarYearBounds,
} from "@/lib/site-analytics/month-bounds";
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

/**
 * Löscht alle aggregierten Homepage-Seitenaufrufe (`site_page_views_daily`).
 * Nur System-Admin; nicht rückgängig zu machen.
 */
export async function resetHomepageSiteAnalyticsAction(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  try {
    /* PostgREST verlangt einen Filter; alle Zeilen haben views >= 0 */
    const { error } = await svc.from("site_page_views_daily").delete().gte("views", 0);
    if (error) throw new Error(error.message);
    revalidatePath("/partner/admin");
    return { ok: true };
  } catch (e) {
    console.error("[resetHomepageSiteAnalyticsAction]", e);
    return { ok: false, message: "Zähler konnten nicht zurückgesetzt werden." };
  }
}

/* ───────────── Kontaktquellen-Statistik (anonyme Aggregate) ───────────── */

/** Zeitraum der Kontakt-Auswertung: ein Tag, ein Monat oder ganzes Jahr (Kalenderjahr von `year`). */
export type ContactStatsScope = "tag" | "monat" | "jahr";

function contactStatsRange(
  year: number,
  month: number,
  scope: ContactStatsScope,
  /** Nur bei scope „tag“ relevant (1 … Tage im Monat). */
  day: number,
): { from: string; to: string } {
  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
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
  const { from, to } = contactStatsRange(y, m, scope, day);

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

/** Aggregiert nach ISO-Wochentag (1 = Montag … 7 = Sonntag); Karriere vs. Kern-Kanäle vs. Übriges. */
export type ContactWeekdayGroupRow = {
  isoWeekday: number;
  weekdayLabel: string;
  karriere: number;
  kern: number;
  other: number;
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

function parseContactWeekdayGroupRpc(data: unknown): Map<number, { k: number; n: number; o: number }> {
  const m = new Map<number, { k: number; n: number; o: number }>();
  if (!Array.isArray(data)) return m;
  for (const row of data) {
    const r = row as Record<string, unknown>;
    const iso = Number(r.iso_weekday ?? 0);
    if (iso < 1 || iso > 7) continue;
    m.set(iso, {
      k: Number(r.karriere_views ?? 0),
      n: Number(r.kern_views ?? 0),
      o: Number(r.other_views ?? 0),
    });
  }
  return m;
}

function fillContactWeekdayGroups(raw: Map<number, { k: number; n: number; o: number }>): ContactWeekdayGroupRow[] {
  return ISO_WEEKDAY_LABELS_DE.map((weekdayLabel, i) => {
    const isoWeekday = i + 1;
    const cell = raw.get(isoWeekday);
    return {
      isoWeekday,
      weekdayLabel,
      karriere: cell?.k ?? 0,
      kern: cell?.n ?? 0,
      other: cell?.o ?? 0,
    };
  });
}

export async function fetchContactWeekdayGroupTotalsAction(
  year: number,
  month: number,
  scope: ContactStatsScope,
  day: number = 1,
): Promise<{ ok: true; weekdays: ContactWeekdayGroupRow[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from, to } = contactStatsRange(y, m, scope, day);

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
        "Wochentags-Auswertung fehlgeschlagen (Migration 021 ausgeführt? RPC admin_contact_weekday_group_totals).",
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
): Promise<{ ok: true; data: ContactSourceStatsRow[] } | { ok: false; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht angemeldet." };
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "Service nicht konfiguriert." };

  const y = Math.min(2100, Math.max(YEAR_RANGE_START, Math.floor(year)));
  const m = Math.min(12, Math.max(1, Math.floor(month)));
  const { from, to } = contactStatsRange(y, m, scope, day);

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
