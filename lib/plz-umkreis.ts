/**
 * Umkreis-Berechnung für servierte PLZ (nur Einträge in config/plz-centroids.json).
 * Koordinaten: Teilmenge aus WZB plz_geocoord (Apache-2.0), siehe config/plz-centroids-source.txt.
 */
import plzCentroids from "@/config/plz-centroids.json";
import { getOrtByPlz } from "@/config/standorte";

type Centroid = { lat: number; lng: number };

const centroids = plzCentroids as Record<string, Centroid>;

function haversineKm(a: Centroid, b: Centroid): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
}

export type NearbyPlzOrt = { plz: string; ort: string; distanceKm: number };

/** Servierte PLZ/Ort-Paare (ohne Zentrum) im angegebenen Radius, sortiert nach Entfernung. */
export function getNearbyServedPlzOrte(centerPlz: string, radiusKm: number): NearbyPlzOrt[] {
  const normalized = centerPlz.replace(/\D/g, "").slice(0, 5);
  const center = centroids[normalized];
  if (!center) return [];

  const out: NearbyPlzOrt[] = [];
  for (const plz of Object.keys(centroids)) {
    if (plz === normalized) continue;
    const d = haversineKm(center, centroids[plz]);
    if (d > radiusKm) continue;
    const ort = getOrtByPlz(plz);
    if (!ort) continue;
    out.push({ plz, ort, distanceKm: d });
  }
  out.sort((a, b) => a.distanceKm - b.distanceKm || a.plz.localeCompare(b.plz));
  return out;
}
