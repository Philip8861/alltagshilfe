import plzCentroids from "@/config/plz-centroids.json";
import plzCentroidsOrtsmitte from "@/config/plz-centroids-ortsmitte.json";
import { PLZ_CENTROID_OVERRIDES } from "@/config/plz-centroid-overrides";

export type Centroid = { lat: number; lng: number };

const base = plzCentroids as Record<string, Centroid>;
const ortsmitte = plzCentroidsOrtsmitte as Record<string, Centroid>;

/** Ab dieser Distanz (km) zwischen Nominatim-Ortsmitte und PLZ-Polygon-Schwerpunkt gilt Ortsmitte als falscher Treffer. */
const ORTSMITTE_MAX_DRIFT_KM = 85;

function distanceKm(a: Centroid, b: Centroid): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Koordinate für Karte & Umkreis: manuelle Korrektur → Ortsmitte (Nominatim), wenn plausibel → geometrischer Fallback.
 */
export function getResolvedCentroid(plz: string): Centroid | undefined {
  const manual = PLZ_CENTROID_OVERRIDES[plz];
  if (manual) return { lat: manual.lat, lng: manual.lng };
  const b = base[plz];
  const om = ortsmitte[plz];
  if (om && b) {
    if (distanceKm(om, b) > ORTSMITTE_MAX_DRIFT_KM) {
      return { lat: b.lat, lng: b.lng };
    }
    return { lat: om.lat, lng: om.lng };
  }
  if (om) return { lat: om.lat, lng: om.lng };
  return b ? { lat: b.lat, lng: b.lng } : undefined;
}

export function getAllCentroidPlzKeys(): string[] {
  return Object.keys(base);
}
