/**
 * Katalog wie `public/konfigurator/app.js` → `BUNDLED_CATALOG_ITEMS` (IDs & Mengenlogik).
 * Bei neuen Artikeln: hier und im Konfigurator synchron halten.
 */
export const KONFIGURATOR_CATALOG_IDS = [
  9102, 9109, 9111, 9112, 9104, 9113, 9101, 9110, 9103, 9107, 9105, 9108,
] as const;

export type KonfiguratorCatalogId = (typeof KONFIGURATOR_CATALOG_IDS)[number];

export type KonfiguratorCatalogUnit = "pieces" | "ml" | "count";

export type KonfiguratorCatalogRow = {
  id: KonfiguratorCatalogId;
  name: string;
  unit: KonfiguratorCatalogUnit;
  /** Nur unit pieces: Stück pro einer Bestellzeile (1× im Korb) */
  piecesPerPack?: number;
};

/** Eine Warenkorbzeile wie im Browser-Konfigurator */
export type KonfiguratorCartLine = {
  id: number;
  count: number;
  /** Bei ml-Artikeln gewählte Milliliter-Variante */
  selectedMl?: number;
};

export const KONFIGURATOR_CATALOG: readonly KonfiguratorCatalogRow[] = [
  { id: 9102, name: "Flächendesinfektionstücher", unit: "pieces", piecesPerPack: 150 },
  { id: 9109, name: "Einmalhandschuhe", unit: "pieces", piecesPerPack: 100 },
  { id: 9111, name: "Flächendesinfektionsmittel", unit: "ml" },
  { id: 9112, name: "Händedesinfektionsmittel", unit: "ml" },
  { id: 9104, name: "FFP2 Masken", unit: "pieces", piecesPerPack: 20 },
  { id: 9113, name: "Händedesinfektionstücher", unit: "pieces", piecesPerPack: 50 },
  { id: 9101, name: "Mundschutz", unit: "pieces", piecesPerPack: 50 },
  { id: 9110, name: "Fingerlinge", unit: "pieces", piecesPerPack: 100 },
  { id: 9103, name: "Schutzschürze wiederverwendbar", unit: "pieces", piecesPerPack: 1 },
  { id: 9107, name: "Einmallätzchen", unit: "pieces", piecesPerPack: 100 },
  { id: 9105, name: "Bettschutzeinlagen", unit: "pieces", piecesPerPack: 25 },
  { id: 9108, name: "Wiederverwendbare Bettschutzeinlage", unit: "count" },
] as const;

const catalogById = new Map<number, KonfiguratorCatalogRow>(
  KONFIGURATOR_CATALOG.map((r) => [r.id, r]),
);

function formatMlFactor(totalMl: number): string {
  if (totalMl <= 0) return "";
  const factor = totalMl / 100;
  if (Number.isInteger(factor)) return String(factor);
  const r = Math.round(factor * 100) / 100;
  return String(r).replace(/\.?0+$/, "");
}

/**
 * Anzeigewert fürs PDF: Stückartikel = Packungsgröße × Anzahl Zeilen (Summe count);
 * ml-Artikel = Summe(ml × count) / 100 als Faktor (100 ml → 1, 1300 ml → 13);
 * count (9108) = Summe count.
 */
export function computeKonfiguratorFieldValue(
  itemId: KonfiguratorCatalogId,
  lines: KonfiguratorCartLine[] | undefined,
): string {
  if (!lines?.length) return "";
  const row = catalogById.get(itemId);
  if (!row) return "";

  const relevant = lines.filter((l) => Number(l.id) === itemId);
  if (!relevant.length) return "";

  if (row.unit === "count") {
    const qty = relevant.reduce((s, l) => s + Math.max(0, Math.floor(l.count)), 0);
    return qty > 0 ? String(qty) : "";
  }

  if (row.unit === "ml") {
    let totalMl = 0;
    for (const l of relevant) {
      const ml = Math.max(0, Number(l.selectedMl) || 0);
      const c = Math.max(0, Math.floor(l.count));
      totalMl += ml * c;
    }
    return formatMlFactor(totalMl);
  }

  const per = row.piecesPerPack ?? 0;
  if (per <= 0) return "";
  const qty = relevant.reduce((s, l) => s + Math.max(0, Math.floor(l.count)), 0);
  return String(per * qty);
}

export function katalogFieldIdForItem(id: KonfiguratorCatalogId): `katalog_${KonfiguratorCatalogId}` {
  return `katalog_${id}`;
}
