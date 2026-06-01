import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getPartnerMonthlyOwnApprovedClosingCommissionCents } from "@/lib/partner/referral-commission";
import { PARTNER_NETWORK_MAX_DEPTH, computeViewerReferralFromDirectChildCents } from "@/lib/partner/referral-money";

/**
 * Werbe-Netzwerk-Baum für die Anzeige im Partnerportal.
 *
 * DATENSCHUTZ (hart, serverseitig erzwungen):
 *   - Antwort enthält ausschließlich `partnerCode` und Geld-Cent-Felder.
 *   - KEINE Namen, KEINE E-Mails, KEINE Telefonnummern, KEINE Adressen.
 *   - IDs werden aus der Antwort entfernt; intern nur für Aufbau verwendet.
 *
 * GELD (hart, serverseitig erzwungen):
 *   - Geld nur an direkten Kindern (`isDirectReferral: true`).
 *   - Indirekte Knoten haben `noDirectReferral: true` und keine Beträge.
 *   - Geld in Cent (Integer); UI-Formatierung übernimmt Client.
 */

export type PartnerNetworkSponsor = {
  partnerCode: string | null;
};

export type PartnerNetworkNode = {
  /** Partner-Code des Knotens (kann null sein, wenn nie ein Code generiert wurde). */
  partnerCode: string | null;
  /** Direktes Kind des aktuell eingeloggten Partners? */
  isDirectReferral: boolean;
  /** Indirektes Kind (= Geld-Beträge nicht relevant für aktuellen Viewer). */
  noDirectReferral: boolean;
  /** Nur bei direkten Kindern: eigene freigegebene Closing-Commission im Monat in Cent. */
  ownApprovedClosingCommissionCents: number | null;
  /** Nur bei direkten Kindern: 5 %-Anteil für aktuellen Viewer in Cent. */
  referralCommissionForCurrentPartnerCents: number | null;
  /** Tiefer Baum (Datenschutz: nur partnerCode + Hinweis). */
  children: PartnerNetworkNode[];
  /** Tiefenanzeige (1 = direktes Kind). */
  depth: number;
};

export type PartnerNetworkTreeResult = {
  /** Code des aktuell eingeloggten Partners (Root). */
  rootPartnerCode: string | null;
  /** Direkter Werber (für Anzeige „Geworben durch …"). */
  sponsor: PartnerNetworkSponsor | null;
  /** Direkte Kinder + tiefer Baum (für Anzeige). */
  directChildren: PartnerNetworkNode[];
  /** Anzahl Knoten gesamt im Baum (zur UI-Hinweisanzeige). */
  totalNodes: number;
  /** Period-Key, auf den sich Geld-Beträge beziehen. */
  periodKey: string;
};

type LeanProfile = {
  id: string;
  partner_referral_code: string | null;
  referred_by_partner_id: string | null;
  referred_at: string | null;
};

const LEAN_PROFILE_SELECT = "id, partner_referral_code, referred_by_partner_id, referred_at";

/**
 * Baut den Werbenetzwerk-Baum für `viewerPartnerId`.
 * `viewerPartnerId` MUSS aus Session/Auth abgeleitet sein – diese Funktion macht KEINE Auth-Checks.
 * Geldberechnung in Cent.
 */
export async function getPartnerNetworkTree(
  svc: SupabaseClient,
  viewerPartnerId: string,
  periodKey: string,
): Promise<PartnerNetworkTreeResult> {
  if (!viewerPartnerId) {
    return {
      rootPartnerCode: null,
      sponsor: null,
      directChildren: [],
      totalNodes: 0,
      periodKey,
    };
  }

  const { data: rootData } = await svc
    .from("partner_profiles")
    .select("partner_referral_code, referred_by_partner_id")
    .eq("id", viewerPartnerId)
    .maybeSingle();

  const rootPartnerCode =
    (rootData as { partner_referral_code: string | null } | null)?.partner_referral_code ?? null;
  const sponsorId =
    (rootData as { referred_by_partner_id: string | null } | null)?.referred_by_partner_id ?? null;

  let sponsor: PartnerNetworkSponsor | null = null;
  if (sponsorId) {
    const { data: spRow } = await svc
      .from("partner_profiles")
      .select("partner_referral_code")
      .eq("id", sponsorId)
      .maybeSingle();
    const code = (spRow as { partner_referral_code: string | null } | null)?.partner_referral_code ?? null;
    sponsor = { partnerCode: code };
  }

  /**
   * BFS bis Tiefe PARTNER_NETWORK_MAX_DEPTH.
   * Lädt nur (id, code, referred_by, referred_at) – keine PII.
   */
  const allDescendants: LeanProfile[] = [];
  const visited = new Set<string>([viewerPartnerId]);
  let frontier: string[] = [viewerPartnerId];

  for (let depth = 0; depth < PARTNER_NETWORK_MAX_DEPTH; depth++) {
    if (frontier.length === 0) break;

    const { data, error } = await svc
      .from("partner_profiles")
      .select(LEAN_PROFILE_SELECT)
      .in("referred_by_partner_id", frontier);

    if (error || !data) break;

    const next: string[] = [];
    for (const row of data as LeanProfile[]) {
      if (visited.has(row.id)) continue;
      visited.add(row.id);
      allDescendants.push(row);
      next.push(row.id);
    }
    frontier = next;
  }

  const childrenByParent = new Map<string, LeanProfile[]>();
  for (const p of allDescendants) {
    const parent = p.referred_by_partner_id ?? "";
    if (!parent) continue;
    const arr = childrenByParent.get(parent) ?? [];
    arr.push(p);
    childrenByParent.set(parent, arr);
  }

  const directChildrenRows = childrenByParent.get(viewerPartnerId) ?? [];

  const directChildren: PartnerNetworkNode[] = [];
  for (const direct of directChildrenRows) {
    const ownCents = await getPartnerMonthlyOwnApprovedClosingCommissionCents(
      svc,
      direct.id,
      periodKey,
    );
    const children = await buildIndirectChildren(direct.id, childrenByParent, 2, svc, periodKey);
    const referralForViewerCents = computeViewerReferralFromDirectChildCents({
      ownApprovedClosingCommissionCents: ownCents,
      children,
    });

    const node: PartnerNetworkNode = {
      partnerCode: direct.partner_referral_code,
      isDirectReferral: true,
      noDirectReferral: false,
      ownApprovedClosingCommissionCents: ownCents,
      referralCommissionForCurrentPartnerCents: referralForViewerCents,
      children,
      depth: 1,
    };
    directChildren.push(node);
  }

  const totalNodes = countNodes(directChildren);

  return {
    rootPartnerCode,
    sponsor,
    directChildren,
    totalNodes,
    periodKey,
  };
}

async function buildIndirectChildren(
  parentId: string,
  childrenByParent: Map<string, LeanProfile[]>,
  depth: number,
  svc: SupabaseClient,
  periodKey: string,
): Promise<PartnerNetworkNode[]> {
  if (depth > PARTNER_NETWORK_MAX_DEPTH) return [];
  const list = childrenByParent.get(parentId) ?? [];
  const nodes: PartnerNetworkNode[] = [];
  for (const c of list) {
    const ownCents = await getPartnerMonthlyOwnApprovedClosingCommissionCents(svc, c.id, periodKey);
    nodes.push({
      partnerCode: c.partner_referral_code,
      isDirectReferral: false,
      noDirectReferral: true,
      ownApprovedClosingCommissionCents: ownCents > 0 ? ownCents : null,
      referralCommissionForCurrentPartnerCents: null,
      children: await buildIndirectChildren(c.id, childrenByParent, depth + 1, svc, periodKey),
      depth,
    });
  }
  return nodes;
}

function countNodes(nodes: PartnerNetworkNode[]): number {
  let n = 0;
  for (const node of nodes) {
    n += 1 + countNodes(node.children);
  }
  return n;
}
