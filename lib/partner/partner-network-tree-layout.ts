/** Kompaktes Werbe-Netzwerk-Layout: eng beieinander, Kollisionen nur bei Bedarf auflösen. */

export const NETWORK_TREE_COLLISION_MIN_GAP_PX = 10;
export const NETWORK_TREE_MAX_COLLISION_PASSES = 32;

const COLLISION_SHIFT_ATTR = "data-collision-shift";

function clearCollisionShifts(treeRoot: HTMLElement): void {
  treeRoot.querySelectorAll<HTMLElement>(`li.partner-network-tree__branch[${COLLISION_SHIFT_ATTR}]`).forEach((branch) => {
    branch.style.marginLeft = "";
    branch.removeAttribute(COLLISION_SHIFT_ATTR);
  });
}

function siblingBranches(ul: HTMLElement): HTMLElement[] {
  return [...ul.children].filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement && el.classList.contains("partner-network-tree__branch"),
  );
}

function shiftBranchRight(branch: HTMLElement, deltaPx: number): void {
  if (deltaPx <= 0.5) return;
  const current = parseFloat(getComputedStyle(branch).marginLeft) || 0;
  branch.style.marginLeft = `${current + deltaPx}px`;
  branch.setAttribute(COLLISION_SHIFT_ATTR, "1");
}

/**
 * Misst Geschwister-Aste und schiebt nur bei Überlappung auseinander.
 * Mehrere Durchläufe, bis alle Ebenen stabil sind.
 */
export function resolveNetworkTreeCollisions(
  treeRoot: HTMLElement,
  minGapPx: number = NETWORK_TREE_COLLISION_MIN_GAP_PX,
): void {
  clearCollisionShifts(treeRoot);

  const childLists = [...treeRoot.querySelectorAll<HTMLElement>("ul.partner-network-tree__children")];
  if (childLists.length === 0) return;

  for (let pass = 0; pass < NETWORK_TREE_MAX_COLLISION_PASSES; pass++) {
    let changed = false;

    for (const ul of childLists) {
      const branches = siblingBranches(ul);
      for (let i = 0; i < branches.length - 1; i++) {
        const leftRect = branches[i].getBoundingClientRect();
        const rightRect = branches[i + 1].getBoundingClientRect();
        const overlap = leftRect.right + minGapPx - rightRect.left;
        if (overlap > 0.5) {
          shiftBranchRight(branches[i + 1], overlap);
          changed = true;
        }
      }
    }

    if (!changed) break;
  }
}
