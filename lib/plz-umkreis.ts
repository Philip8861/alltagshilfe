/**
 * Umkreis-Berechnung für servierte PLZ. Koordinaten: plz-centroids.json + config/plz-centroid-overrides.ts.
 */
import { getOrtByPlz } from "@/config/standorte";
import { getAllCentroidPlzKeys, getResolvedCentroid, type Centroid } from "@/lib/plz-centroid-resolve";

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
  const center = getResolvedCentroid(normalized);
  if (!center) return [];

  const out: NearbyPlzOrt[] = [];
  for (const plz of getAllCentroidPlzKeys()) {
    if (plz === normalized) continue;
    const other = getResolvedCentroid(plz);
    if (!other) continue;
    const d = haversineKm(center, other);
    if (d > radiusKm) continue;
    const ort = getOrtByPlz(plz);
    if (!ort) continue;
    out.push({ plz, ort, distanceKm: d });
  }
  out.sort((a, b) => a.distanceKm - b.distanceKm || a.plz.localeCompare(b.plz));
  return out;
}
