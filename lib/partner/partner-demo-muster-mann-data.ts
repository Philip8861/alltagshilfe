import type { PartnerNetworkNode, PartnerNetworkTreeResult } from "@/lib/partner/network-tree";
import type { PartnerDashboardTipSerial } from "@/lib/partner/types";
import { currentBerlinPeriodKey, formatPayoutPeriodLabelDe } from "@/lib/partner/payout-period";

/** Öffentliche Demo — fiktiver Partner-Code (kein Produktionskonto). */
export const PARTNER_DEMO_MAX_MUSTERMANN_CODE = "MM2847";

export const PARTNER_DEMO_MAX_MUSTERMANN_NAME = "Max Mustermann";

/** Geworben durch (nur Code in der UI). */
export const PARTNER_DEMO_MAX_MUSTERMANN_SPONSOR_CODE = "SW1903";

export type PartnerDemoPayoutSummary = {
  periodKey: string;
  ownCents: number;
  referralCents: number;
  totalCents: number;
};

/**
 * Öffentliche Demo: fiktive Tippzeilen für „Max Mustermann“ (keine DB, keine IDs aus Produktion).
 */
export const PARTNER_DEMO_MAX_MUSTERMANN_TIPS: PartnerDashboardTipSerial[] = [
  {
    id: "demo-tip-bp-1",
    service_slug: "betriebliche_pflegeberatung",
    payload: {
      firmenname: "Beispiel GmbH Süd",
      vorname: "Clara",
      nachname: "Neumann",
    },
    created_at: "2025-02-03T09:15:00.000Z",
    admin_status: "vertragsabschluss_erfolgreich",
    admin_visible_note: "Vertrag aktiv — reine Demo, keine Abrechnung.",
    archived_at: null,
    partner_archived_at: null,
    paid_amount_eur: 120,
    payout_settled_period_key: null,
  },
  {
    id: "demo-tip-bp-2",
    service_slug: "betriebliche_pflegeberatung",
    payload: {
      firmenname: "Musterwerk AG",
      vorname: "Jonas",
      nachname: "Weber",
    },
    created_at: "2025-01-18T14:40:00.000Z",
    admin_status: "in_bearbeitung",
    admin_visible_note: "",
    archived_at: null,
    partner_archived_at: null,
    paid_amount_eur: null,
    payout_settled_period_key: null,
  },
  {
    id: "demo-tip-ph-1",
    service_slug: "pflegehilfsmittel",
    payload: { vorname: "Sabine", nachname: "Koch" },
    created_at: "2025-02-10T11:00:00.000Z",
    admin_status: "vertragsabschluss_erfolgreich",
    admin_visible_note: "Kasse bewilligt — Demo.",
    archived_at: null,
    partner_archived_at: null,
    paid_amount_eur: 42.5,
    payout_settled_period_key: null,
  },
  {
    id: "demo-tip-pb-1",
    service_slug: "pflegeberatung",
    payload: { vorname: "Thomas", nachname: "Bauer" },
    created_at: "2025-02-12T08:30:00.000Z",
    admin_status: "in_bearbeitung",
    admin_visible_note: "Erstgespräch geplant.",
    archived_at: null,
    partner_archived_at: null,
    paid_amount_eur: null,
    payout_settled_period_key: null,
  },
  {
    id: "demo-tip-hb-1",
    service_slug: "hauswirtschaft_betreuung",
    payload: { vorname: "Elena", nachname: "Fischer" },
    created_at: "2024-12-01T16:20:00.000Z",
    admin_status: "vertragsabschluss_erfolgreich",
    admin_visible_note: "",
    archived_at: null,
    partner_archived_at: "2025-01-05T12:00:00.000Z",
    paid_amount_eur: 35,
    payout_settled_period_key: null,
  },
];

function demoNode(
  code: string,
  depth: number,
  opts?: {
    direct?: boolean;
    ownCents?: number;
    referralCents?: number;
    children?: PartnerNetworkNode[];
  },
): PartnerNetworkNode {
  const direct = opts?.direct ?? false;
  return {
    partnerCode: code,
    isDirectReferral: direct,
    noDirectReferral: !direct,
    ownApprovedClosingCommissionCents:
      opts?.ownCents !== undefined ? opts.ownCents : direct ? 0 : null,
    referralCommissionForCurrentPartnerCents: direct ? (opts?.referralCents ?? 0) : null,
    children: opts?.children ?? [],
    depth,
  };
}

function countNodes(nodes: PartnerNetworkNode[]): number {
  let n = 0;
  for (const node of nodes) {
    n += 1 + countNodes(node.children);
  }
  return n;
}

/** Mehrstufiger Werbe-Baum (4 Ebenen unter Max, 17 Knoten gesamt). */
function buildDemoDirectChildren(scale: number): PartnerNetworkNode[] {
  const s = (cents: number) => Math.round(cents * scale);
  return [
    demoNode("LH5210", 1, {
      direct: true,
      ownCents: s(24000),
      referralCents: s(1200),
      children: [
        demoNode("JK1190", 2, {
          ownCents: s(320000),
          children: [
            demoNode("PF3301", 3, {
              ownCents: s(145000),
              children: [demoNode("AW7720", 4)],
            }),
          ],
        }),
        demoNode("RS9021", 2, { ownCents: s(185000) }),
      ],
    }),
    demoNode("NK8834", 1, {
      direct: true,
      ownCents: s(18550),
      referralCents: s(928),
      children: [
        demoNode("CL8812", 2, {
          ownCents: s(410000),
          children: [demoNode("DM2299", 3, { ownCents: s(89000) })],
        }),
        demoNode("RS5540", 2, { ownCents: s(275000) }),
      ],
    }),
    demoNode("TB4471", 1, {
      direct: true,
      ownCents: s(32000),
      referralCents: s(1600),
      children: [
        demoNode("HF6618", 2, {
          ownCents: s(450000),
          children: [
            demoNode("KT9044", 3, {
              ownCents: s(178000),
              children: [
                demoNode("BL1155", 4, {
                  children: [demoNode("VN4488", 5)],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    demoNode("MR6602", 1, {
      direct: true,
      ownCents: s(9600),
      referralCents: s(480),
      children: [demoNode("GS3321", 2, { ownCents: s(120000) })],
    }),
  ];
}

/** Werbe-Netzwerk für die Demo (keine DB). */
export function getPartnerDemoNetworkTree(periodKey?: string): PartnerNetworkTreeResult {
  const key = periodKey ?? currentBerlinPeriodKey();
  /** Vormonat etwas kleinere Beträge — wirkt realistischer in der Monatsauswahl. */
  const scale = key === currentBerlinPeriodKey() ? 1 : 0.82;
  const directChildren = buildDemoDirectChildren(scale);

  return {
    rootPartnerCode: PARTNER_DEMO_MAX_MUSTERMANN_CODE,
    sponsor: { partnerCode: PARTNER_DEMO_MAX_MUSTERMANN_SPONSOR_CODE },
    directChildren,
    totalNodes: countNodes(directChildren),
    periodKey: key,
  };
}

/** Monats-Auszahlung für Dashboard-Karten (Demo). */
export function getPartnerDemoPayoutSummary(periodKey?: string): PartnerDemoPayoutSummary {
  const key = periodKey ?? currentBerlinPeriodKey();
  const tree = getPartnerDemoNetworkTree(key);
  const referralCents = tree.directChildren.reduce(
    (sum, c) => sum + (c.referralCommissionForCurrentPartnerCents ?? 0),
    0,
  );
  const ownCents = key === currentBerlinPeriodKey() ? 14750 : 12100;
  return {
    periodKey: key,
    ownCents,
    referralCents,
    totalCents: ownCents + referralCents,
  };
}

/** Letzte 12 Monate für Monatsauswahl in der Demo. */
export function getPartnerDemoNetworkPeriodOptions(): { periodKey: string; label: string }[] {
  const current = currentBerlinPeriodKey();
  const m = /^(\d{4})-(\d{2})$/.exec(current);
  if (!m) return [{ periodKey: current, label: formatPayoutPeriodLabelDe(current) }];
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const out: { periodKey: string; label: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(Date.UTC(y, mo - 1 - i, 1));
    const yy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const pk = `${yy}-${mm}`;
    out.push({ periodKey: pk, label: formatPayoutPeriodLabelDe(pk) });
  }
  return out;
}
