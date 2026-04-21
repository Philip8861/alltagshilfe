import plzCentroids from "@/config/plz-centroids.json";
import { PLZ_CENTROID_OVERRIDES } from "@/config/plz-centroid-overrides";

export type Centroid = { lat: number; lng: number };

const base = plzCentroids as Record<string, Centroid>;

/** Effektive Koordinate (Override oder Eintrag aus plz-centroids.json). */
export function getResolvedCentroid(plz: string): Centroid | undefined {
  const o = PLZ_CENTROID_OVERRIDES[plz];
  if (o) return { lat: o.lat, lng: o.lng };
  const b = base[plz];
  return b ? { lat: b.lat, lng: b.lng } : undefined;
}

export function getAllCentroidPlzKeys(): string[] {
  return Object.keys(base);
}
