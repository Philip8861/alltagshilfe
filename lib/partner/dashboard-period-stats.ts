import { PARTNER_TIP_ADMIN_STATUSES } from "@/lib/partner/partner-tip-admin";
import type { PartnerTipAdminStatus } from "@/lib/partner/types";

export type DashboardAuftragStats = {
  abgeschlossen: number;
  abgelehnt: number;
  inBearbeitung: number;
};

/** Zählung je Verwaltungsstatus im Zeitraum (nur Tippgeber, keine Pflegebox). */
export function periodTipStatusCounts(
  tips: readonly { created_at: string; admin_status: PartnerTipAdminStatus }[],
  start: Date,
  end: Date,
): Record<PartnerTipAdminStatus, number> {
  const a = start.getTime();
  const b = end.getTime();
  const out = Object.fromEntries(PARTNER_TIP_ADMIN_STATUSES.map((s) => [s, 0])) as Record<
    PartnerTipAdminStatus,
    number
  >;
  for (const t of tips) {
    const ti = new Date(t.created_at).getTime();
    if (!Number.isFinite(ti) || ti < a || ti >= b) continue;
    if (out[t.admin_status] !== undefined) out[t.admin_status] += 1;
    else out.in_bearbeitung += 1;
  }
  return out;
}

type TipLike = { created_at: string; admin_status: PartnerTipAdminStatus };
type OrderLike = { created_at: string; status: string };

function inRange(iso: string, startMs: number, endMs: number): boolean {
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t >= startMs && t < endMs;
}

export function statsForPeriod(
  tips: TipLike[],
  orders: OrderLike[],
  start: Date,
  end: Date,
): DashboardAuftragStats {
  const a = start.getTime();
  const b = end.getTime();
  let abgeschlossen = 0;
  let abgelehnt = 0;
  let inBearbeitung = 0;
  for (const t of tips) {
    if (!inRange(t.created_at, a, b)) continue;
    if (t.admin_status === "erledigt" || t.admin_status === "bezahlt") abgeschlossen += 1;
    else if (t.admin_status === "abgelehnt") abgelehnt += 1;
    else inBearbeitung += 1;
  }
  for (const o of orders) {
    if (!inRange(o.created_at, a, b)) continue;
    const s = (o.status || "").toLowerCase();
    if (s === "completed" || s === "erledigt" || s === "abgeschlossen") abgeschlossen += 1;
  }
  return { abgeschlossen, abgelehnt, inBearbeitung };
}

export function statsForMonth(tips: TipLike[], orders: OrderLike[], year: number, monthIndex0: number) {
  const start = new Date(year, monthIndex0, 1, 0, 0, 0, 0);
  const end = new Date(year, monthIndex0 + 1, 1, 0, 0, 0, 0);
  return statsForPeriod(tips, orders, start, end);
}

export function statsForYear(tips: TipLike[], orders: OrderLike[], year: number) {
  const start = new Date(year, 0, 1, 0, 0, 0, 0);
  const end = new Date(year + 1, 0, 1, 0, 0, 0, 0);
  return statsForPeriod(tips, orders, start, end);
}

export function monthlyStatsForYear(tips: TipLike[], orders: OrderLike[], year: number): DashboardAuftragStats[] {
  return Array.from({ length: 12 }, (_, m) => statsForMonth(tips, orders, year, m));
}
