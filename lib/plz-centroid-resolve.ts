import plzCentroids from "@/config/plz-centroids.json";
import plzCentroidsOrtsmitte from "@/config/plz-centroids-ortsmitte.json";
import { PLZ_CENTROID_OVERRIDES } from "@/config/plz-centroid-overrides";

export type Centroid = { lat: number; lng: number };

const base = plzCentroids as Record<string, Centroid>;
const ortsmitte = plzCentroidsOrtsmitte as Record<string, Centroid>;

/**
 * Koordinate für Karte & Umkreis: manuelle Korrektur → Ortsmitte (Nominatim) → geometrischer Fallback.
 */
export function getResolvedCentroid(plz: string): Centroid | undefined {
  const manual = PLZ_CENTROID_OVERRIDES[plz];
  if (manual) return { lat: manual.lat, lng: manual.lng };
  const om = ortsmitte[plz];
  if (om) return { lat: om.lat, lng: om.lng };
  const b = base[plz];
  return b ? { lat: b.lat, lng: b.lng } : undefined;
}

export function getAllCentroidPlzKeys(): string[] {
  return Object.keys(base);
}
