/** Stabiler Vergleich von UUID-Strings (Groß/Kleinschreibung, Bindestriche). */
export function uuidStringsEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  if (a == null || b == null) return false;
  const x = String(a)
    .trim()
    .replace(/-/g, "")
    .toLowerCase();
  const y = String(b)
    .trim()
    .replace(/-/g, "")
    .toLowerCase();
  if (x.length !== 32 || y.length !== 32) return false;
  return x === y;
}
