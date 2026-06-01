/** Demo-only: deterministische Avatar-Farben aus Partner-Code (keine echten Profilbilder). */

const DEMO_AVATAR_GRADIENTS = [
  "from-[#0F4F68] to-[#3DB8C9]",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-violet-500 to-indigo-400",
  "from-amber-500 to-orange-400",
  "from-rose-400 to-pink-500",
] as const;

function hashCode(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getDemoAvatarGradient(partnerCode: string | null | undefined): string {
  const key = (partnerCode ?? "XX").toUpperCase();
  return DEMO_AVATAR_GRADIENTS[hashCode(key) % DEMO_AVATAR_GRADIENTS.length];
}

export function getDemoAvatarInitials(partnerCode: string | null | undefined, displayName?: string | null): string {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    return displayName.slice(0, 2).toUpperCase();
  }
  const code = (partnerCode ?? "??").replace(/[^A-Za-z0-9]/g, "");
  return code.slice(0, 2).toUpperCase() || "??";
}

/** Feste Demo-Avatar-URL für Max Mustermann (lokal, keine Upload-Logik). */
export const PARTNER_DEMO_MAX_MUSTERMANN_AVATAR = "/images/Max_mustermann.jpg";

const DEMO_AVATAR_COLOR_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["#0F4F68", "#3DB8C9"],
  ["#0284c7", "#22d3ee"],
  ["#059669", "#2dd4bf"],
  ["#7c3aed", "#818cf8"],
  ["#d97706", "#fb923c"],
  ["#e11d48", "#fb7185"],
] as const;

/** Deterministische Farben für Demo-Profilbilder (SVG-Silhouette). */
export function getDemoAvatarColorPair(partnerCode: string | null | undefined): [string, string] {
  const key = (partnerCode ?? "XX").toUpperCase();
  const pair = DEMO_AVATAR_COLOR_PAIRS[hashCode(key) % DEMO_AVATAR_COLOR_PAIRS.length];
  return [pair[0], pair[1]];
}

/** Demo-Profilbild-URL für Netzwerk-Knoten (lokal generiertes SVG). */
export function getDemoPartnerAvatarUrl(partnerCode: string | null | undefined): string | null {
  if (!partnerCode?.trim()) return null;
  const code = partnerCode.trim().toUpperCase();
  if (code === "MM2847") return PARTNER_DEMO_MAX_MUSTERMANN_AVATAR;
  return `/partner-demo/avatar/${encodeURIComponent(code)}`;
}
