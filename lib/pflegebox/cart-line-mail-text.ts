import type { PflegeboxOrderBody } from "@/lib/validations/pflegebox-order";

type CartLine = PflegeboxOrderBody["cartLines"][number];

/**
 * Eine Zeile für interne Pflegebox-Mails (Größe, ml, Material …).
 * Beispiele: „2× Einmalhandschuhe, Größe M“, „1× Flächendesinfektionsmittel, 250 ml“.
 */
export function formatPflegeboxCartLineForMail(line: CartLine): string {
  const base = `${line.count}× ${line.name.trim()}`;
  const bits: string[] = [];

  const size = line.selectedSize != null ? String(line.selectedSize).trim() : "";
  if (size) bits.push(`Größe ${size}`);

  if (line.ml != null && Number.isFinite(line.ml)) {
    bits.push(`${line.ml} ml`);
  }

  const mat = line.material != null ? String(line.material).trim() : "";
  if (mat) bits.push(mat);

  const pieces = line.pieces != null ? String(line.pieces).trim() : "";
  if (pieces) bits.push(`Packung ${pieces}`);

  const qty = line.quantity != null ? String(line.quantity).trim() : "";
  if (qty) bits.push(`Angabe Menge ${qty}`);

  if (bits.length === 0) return base;
  return `${base}, ${bits.join(", ")}`;
}
