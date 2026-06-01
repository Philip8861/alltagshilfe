/** Layout-Hilfen für den Werbe-Netzwerk-Baum — verhindert Überlappung durch reservierte Mindestbreite pro Ast. */

export type TreeLayoutNodeKind = "sponsor" | "self" | "direct" | "indirect";

export type TreeLayoutNode = {
  kind: TreeLayoutNodeKind;
  ownCents: number | null;
  children: TreeLayoutNode[];
};

/** Muss exakt zu Tailwind w-[…rem] in PartnerNetworkPremium passen (root 16px). */
const CARD_WIDTH_PX: Record<TreeLayoutNodeKind | "indirectCompact", number> = {
  sponsor: 264,
  self: 264,
  direct: 224,
  indirect: 200,
  indirectCompact: 168,
};

/** Entspricht gap + horizontales Padding in partner-network-tree.css (sm+). */
const BRANCH_GAP_PX = 28;
const BRANCH_PADDING_X_PX = 24;

function cardWidthPx(node: TreeLayoutNode): number {
  const hasProvision = node.ownCents != null && node.ownCents > 0;
  const compact = node.kind === "indirect" && !hasProvision;
  if (node.kind === "self" || node.kind === "sponsor" || node.kind === "direct" || hasProvision) {
    if (node.kind === "self" || node.kind === "sponsor") return CARD_WIDTH_PX.self;
    return CARD_WIDTH_PX.direct;
  }
  if (compact) return CARD_WIDTH_PX.indirectCompact;
  return CARD_WIDTH_PX.indirect;
}

/**
 * Mindestbreite eines Astes in px = max(Kartenbreite, Summe der Kind-Mindestbreiten + Abstände).
 * Rekursiv — garantiert, dass Geschwister und Cousins sich nicht überlappen.
 */
export function computeBranchMinWidthPx(node: TreeLayoutNode, collapsed: boolean): number {
  const cardMin = cardWidthPx(node) + BRANCH_PADDING_X_PX;
  if (collapsed || node.children.length === 0) return cardMin;

  const childMins = node.children.map((child) => computeBranchMinWidthPx(child, false));
  const gapTotal = BRANCH_GAP_PX * Math.max(0, childMins.length - 1);
  const childrenRow = childMins.reduce((sum, w) => sum + w, 0) + gapTotal;
  return Math.max(cardMin, childrenRow);
}
