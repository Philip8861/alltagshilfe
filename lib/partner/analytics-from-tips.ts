import type { PartnerTipAdminStatus } from "@/lib/partner/types";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";

type TipLike = {
  created_at: string;
  admin_status: PartnerTipAdminStatus;
  service_slug: string;
  paid_amount_eur: number | null;
  archived_at: string | null;
};

function inLocalRange(iso: string, startMs: number, endMs: number): boolean {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t >= startMs && t < endMs;
}

export function filterTipsCreatedInMonth<T extends { created_at: string }>(
  tips: readonly T[],
  year: number,
  monthIndex0: number,
): T[] {
  const start = new Date(year, monthIndex0, 1, 0, 0, 0, 0).getTime();
  const end = new Date(year, monthIndex0 + 1, 1, 0, 0, 0, 0).getTime();
  return tips.filter((t) => inLocalRange(t.created_at, start, end));
}

export function filterTipsCreatedInYear<T extends { created_at: string }>(tips: readonly T[], year: number): T[] {
  const start = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
  const end = new Date(year + 1, 0, 1, 0, 0, 0, 0).getTime();
  return tips.filter((t) => inLocalRange(t.created_at, start, end));
}

/** Wie Dashboard-Provision: ohne Admin-Archiv; Monatlich bei erledigt/bezahlt, Einmal bei bezahlt. */
export function provisionEuroTotalsForTips(tips: readonly TipLike[]): {
  monatlich: number;
  einmal: number;
  total: number;
} {
  let monatlich = 0;
  let einmal = 0;
  for (const t of tips) {
    if (t.archived_at) continue;
    const n = normalizePaidAmountEur(t.paid_amount_eur);
    if (n == null || n <= 0) continue;
    const bucket = provisionBucketForServiceSlug(t.service_slug);
    if (bucket === "monatlich") {
      if (t.admin_status === "erledigt" || t.admin_status === "bezahlt") monatlich += n;
    } else if (t.admin_status === "bezahlt") {
      einmal += n;
    }
  }
  return {
    monatlich: Math.round(monatlich * 100) / 100,
    einmal: Math.round(einmal * 100) / 100,
    total: Math.round((monatlich + einmal) * 100) / 100,
  };
}

export type MonthlyCountPoint = { key: string; label: string; count: number };

const MONTH_SHORT_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export function monthlyCreatedCountsForYear(
  tips: readonly { created_at: string }[],
  year: number,
): MonthlyCountPoint[] {
  const points: MonthlyCountPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const start = new Date(year, m, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year, m + 1, 1, 0, 0, 0, 0).getTime();
    const key = `${year}-${String(m + 1).padStart(2, "0")}`;
    let count = 0;
    for (const t of tips) {
      if (inLocalRange(t.created_at, start, end)) count += 1;
    }
    points.push({ key, label: MONTH_SHORT_DE[m], count });
  }
  return points;
}

/** Letzte `months` Monate inkl. Anker-Monat (lokales Datum). */
export function rollingMonthlyCreatedCounts(
  tips: readonly { created_at: string }[],
  anchorYear: number,
  anchorMonth0: number,
  months: number,
): MonthlyCountPoint[] {
  const points: MonthlyCountPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(anchorYear, anchorMonth0, 1);
    d.setMonth(d.getMonth() - i);
    const y = d.getFullYear();
    const m = d.getMonth();
    const start = new Date(y, m, 1, 0, 0, 0, 0).getTime();
    const end = new Date(y, m + 1, 1, 0, 0, 0, 0).getTime();
    const key = `${y}-${String(m + 1).padStart(2, "0")}`;
    let count = 0;
    for (const t of tips) {
      if (inLocalRange(t.created_at, start, end)) count += 1;
    }
    points.push({ key, label: `${MONTH_SHORT_DE[m]} ${y}`, count });
  }
  return points;
}

export function countTipsByServiceSlug<T extends { service_slug: string }>(
  tips: readonly T[],
): { slug: string; name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const t of tips) {
    const s = t.service_slug || "—";
    map.set(s, (map.get(s) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([slug, count]) => ({ slug, name: slug, count }))
    .sort((a, b) => b.count - a.count);
}

export function countTipsByAdminStatus(tips: readonly { admin_status: PartnerTipAdminStatus }[]): {
  status: PartnerTipAdminStatus;
  count: number;
}[] {
  const map = new Map<PartnerTipAdminStatus, number>();
  for (const t of tips) {
    map.set(t.admin_status, (map.get(t.admin_status) ?? 0) + 1);
  }
  return (Array.from(map.entries()) as [PartnerTipAdminStatus, number][])
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

export function monthlyOrderCountsForYear(
  orders: readonly { created_at: string }[],
  year: number,
): MonthlyCountPoint[] {
  const points: MonthlyCountPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const start = new Date(year, m, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year, m + 1, 1, 0, 0, 0, 0).getTime();
    const key = `${year}-${String(m + 1).padStart(2, "0")}`;
    let count = 0;
    for (const o of orders) {
      if (inLocalRange(o.created_at, start, end)) count += 1;
    }
    points.push({ key, label: MONTH_SHORT_DE[m], count });
  }
  return points;
}

export function countOrdersInLocalMonth(orders: readonly { created_at: string }[], year: number, monthIndex0: number) {
  const start = new Date(year, monthIndex0, 1, 0, 0, 0, 0).getTime();
  const end = new Date(year, monthIndex0 + 1, 1, 0, 0, 0, 0).getTime();
  let n = 0;
  for (const o of orders) {
    if (inLocalRange(o.created_at, start, end)) n += 1;
  }
  return n;
}

export function countOrdersInLocalYear(orders: readonly { created_at: string }[], year: number) {
  const start = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
  const end = new Date(year + 1, 0, 1, 0, 0, 0, 0).getTime();
  let n = 0;
  for (const o of orders) {
    if (inLocalRange(o.created_at, start, end)) n += 1;
  }
  return n;
}
