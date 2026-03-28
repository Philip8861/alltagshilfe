import type { PflegeboxOrderRow } from "@/lib/partner/types";

export function orderContactLine(summary: Record<string, unknown> | null): string | null {
  if (!summary || typeof summary !== "object") return null;
  const c = summary.contact as Record<string, unknown> | undefined;
  if (!c || typeof c !== "object") return null;
  const first = typeof c.firstName === "string" ? c.firstName : "";
  const last = typeof c.lastName === "string" ? c.lastName : "";
  const mail = typeof c.email === "string" ? c.email : "";
  const name = `${first} ${last}`.trim();
  if (name && mail) return `${name} · ${mail}`;
  if (mail) return mail;
  if (name) return name;
  return null;
}

export function partnerOrderStats(orders: Pick<PflegeboxOrderRow, "created_at">[]) {
  const now = Date.now();
  const ms7 = 7 * 24 * 60 * 60 * 1000;
  const ms30 = 30 * 24 * 60 * 60 * 1000;
  let last7 = 0;
  let last30 = 0;
  for (const o of orders) {
    const t = new Date(o.created_at).getTime();
    if (!Number.isFinite(t)) continue;
    if (now - t <= ms7) last7 += 1;
    if (now - t <= ms30) last30 += 1;
  }
  return { total: orders.length, last7, last30 };
}
