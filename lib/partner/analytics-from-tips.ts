import { PARTNER_TIP_ADMIN_STATUSES } from "@/lib/partner/partner-tip-admin";
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

/** Wie Dashboard-Provision: ohne Admin-Archiv; erfolgreicher Vertrag mit hinterlegtem Betrag zählt. */
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
    if (t.admin_status !== "vertragsabschluss_erfolgreich") continue;
    const bucket = provisionBucketForServiceSlug(t.service_slug);
    if (bucket === "monatlich") monatlich += n;
    else einmal += n;
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

/** Erster Monat, für den Statistik angezeigt wird (Kalendermonat der Partner-Anlage, lokale Zeit). */
export function partnerStatsEpochMonth(createdAtIso: string | undefined | null): { year: number; month0: number } {
  if (createdAtIso) {
    const d = new Date(createdAtIso);
    if (Number.isFinite(d.getTime())) {
      return { year: d.getFullYear(), month0: d.getMonth() };
    }
  }
  const n = new Date();
  return { year: n.getFullYear(), month0: n.getMonth() };
}

export function partnerStatsMinMonthInputValue(createdAtIso: string | undefined | null): string {
  const { year, month0 } = partnerStatsEpochMonth(createdAtIso);
  return `${year}-${String(month0 + 1).padStart(2, "0")}`;
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

/**
 * Wie rollingMonthlyCreatedCounts, aber ohne Monate vor dem Partner-Anlagemonat
 * (höchstens `maxMonths` bis zum Anker, gekappt am Anlagemonat).
 */
export function rollingMonthlyCreatedCountsSincePartner(
  tips: readonly { created_at: string }[],
  anchorYear: number,
  anchorMonth0: number,
  partnerYear: number,
  partnerMonth0: number,
  maxMonths: number,
): MonthlyCountPoint[] {
  const anchorIdx = anchorYear * 12 + anchorMonth0;
  const partnerIdx = partnerYear * 12 + partnerMonth0;
  const span = anchorIdx - partnerIdx + 1;
  const months = span < 1 ? 1 : Math.min(maxMonths, span);
  return rollingMonthlyCreatedCounts(tips, anchorYear, anchorMonth0, months);
}

/** Januar–Dezember des Jahres, aber nur ab dem Anlagemonat im Anlagejahr; leer wenn Jahr vor Anlage. */
export function monthlyCreatedCountsForYearSincePartner(
  tips: readonly { created_at: string }[],
  year: number,
  partnerYear: number,
  partnerMonth0: number,
): MonthlyCountPoint[] {
  if (year < partnerYear) return [];
  const startM = year === partnerYear ? partnerMonth0 : 0;
  const points: MonthlyCountPoint[] = [];
  for (let m = startM; m < 12; m++) {
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

function emptyStatusRow(name: string): { name: string } & Record<PartnerTipAdminStatus, number> {
  const row = { name } as { name: string } & Record<PartnerTipAdminStatus, number>;
  for (const s of PARTNER_TIP_ADMIN_STATUSES) row[s] = 0;
  return row;
}

/** Liniendiagramm: je Monat alle Admin-Status-Zähler (nach Eingangsdatum). */
export function monthlyStatusCountLinesForYear(
  tips: readonly { created_at: string; admin_status: PartnerTipAdminStatus }[],
  year: number,
): Array<{ name: string } & Record<PartnerTipAdminStatus, number>> {
  return Array.from({ length: 12 }, (_, m) => {
    const start = new Date(year, m, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year, m + 1, 1, 0, 0, 0, 0).getTime();
    const row = emptyStatusRow(MONTH_SHORT_DE[m]);
    for (const t of tips) {
      const ti = new Date(t.created_at).getTime();
      if (!Number.isFinite(ti) || ti < start || ti >= end) continue;
      row[t.admin_status] += 1;
    }
    return row;
  });
}

export function monthlyStatusCountLinesForPoints(
  tips: readonly { created_at: string; admin_status: PartnerTipAdminStatus }[],
  points: MonthlyCountPoint[],
): Array<{ name: string } & Record<PartnerTipAdminStatus, number>> {
  return points.map((pt) => {
    const parts = pt.key.split("-").map(Number);
    const y = parts[0];
    const mo = parts[1];
    if (!Number.isFinite(y) || !Number.isFinite(mo)) return emptyStatusRow(pt.label);
    const start = new Date(y, mo - 1, 1, 0, 0, 0, 0).getTime();
    const end = new Date(y, mo, 1, 0, 0, 0, 0).getTime();
    const row = emptyStatusRow(pt.label);
    for (const t of tips) {
      const ti = new Date(t.created_at).getTime();
      if (!Number.isFinite(ti) || ti < start || ti >= end) continue;
      row[t.admin_status] += 1;
    }
    return row;
  });
}

/** Geschätzte Provision (EUR) nach Eingangsmonat des Tipps. */
export function monthlyProvisionEuroLinesForYear(tips: readonly TipLike[], year: number) {
  return Array.from({ length: 12 }, (_, m) => {
    const start = new Date(year, m, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year, m + 1, 1, 0, 0, 0, 0).getTime();
    const subset = tips.filter((t) => {
      const ti = new Date(t.created_at).getTime();
      return Number.isFinite(ti) && ti >= start && ti < end;
    });
    const p = provisionEuroTotalsForTips(subset);
    return { name: MONTH_SHORT_DE[m], monatlich: p.monatlich, einmal: p.einmal, gesamt: p.total };
  });
}

export function monthlyProvisionEuroLinesForPoints(tips: readonly TipLike[], points: MonthlyCountPoint[]) {
  return points.map((pt) => {
    const parts = pt.key.split("-").map(Number);
    const y = parts[0];
    const mo = parts[1];
    if (!Number.isFinite(y) || !Number.isFinite(mo)) {
      return { name: pt.label, monatlich: 0, einmal: 0, gesamt: 0 };
    }
    const start = new Date(y, mo - 1, 1, 0, 0, 0, 0).getTime();
    const end = new Date(y, mo, 1, 0, 0, 0, 0).getTime();
    const subset = tips.filter((t) => {
      const ti = new Date(t.created_at).getTime();
      return Number.isFinite(ti) && ti >= start && ti < end;
    });
    const p = provisionEuroTotalsForTips(subset);
    return { name: pt.label, monatlich: p.monatlich, einmal: p.einmal, gesamt: p.total };
  });
}

export function filterTipsByPartnerId<T extends { partner_id: string }>(tips: readonly T[], partnerId: string): T[] {
  return tips.filter((t) => t.partner_id === partnerId);
}

/** Zählt Bestellungen im Kalendermonat `key` (YYYY-MM). */
export function countOrdersInMonthKey(orders: readonly { created_at: string }[], key: string): number {
  const m = /^(\d{4})-(\d{2})$/.exec(key.trim());
  if (!m) return 0;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const start = new Date(y, mo, 1, 0, 0, 0, 0).getTime();
  const end = new Date(y, mo + 1, 1, 0, 0, 0, 0).getTime();
  let n = 0;
  for (const o of orders) {
    if (inLocalRange(o.created_at, start, end)) n += 1;
  }
  return n;
}
