import { findStandortByPlz, standorteByPlz, type Standort } from "@/config/standorte";
import { getResolvedCentroid, type Centroid } from "@/lib/plz-centroid-resolve";

export type StandortPlzMatch = "exact" | "nearest" | "fallback";

function haversineKm(a: Centroid, b: Centroid): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function findNearestStandortByPlzCentroid(plz5: string): Standort | undefined {
  const inputCentroid = getResolvedCentroid(plz5);
  if (!inputCentroid) return undefined;

  let best: { standort: Standort; dist: number } | undefined;
  for (const standort of standorteByPlz) {
    const officeCentroid = getResolvedCentroid(standort.schemaAddress.postalCode);
    if (!officeCentroid) continue;
    const dist = haversineKm(inputCentroid, officeCentroid);
    if (!best || dist < best.dist) {
      best = { standort, dist };
    }
  }
  return best?.standort;
}

const FALLBACK_STANDORT = standorteByPlz[0];

/**
 * Ordnet eine PLZ einem zuständigen Standort zu – ohne Ablehnung unbekannter PLZ.
 * 1. Exakte Zuordnung über servierte PLZ-Listen
 * 2. Nächster Standort per Geo-Koordinate (deutsche PLZ mit Centroid)
 * 3. Zentrale Allgäu als Fallback
 */
export function resolveStandortForPlz(plz: string): {
  standort: Standort;
  match: StandortPlzMatch;
} {
  const normalized = plz.replace(/\D/g, "").slice(0, 5);

  if (normalized.length === 5) {
    const exact = findStandortByPlz(normalized);
    if (exact) {
      return { standort: exact, match: "exact" };
    }
    const nearest = findNearestStandortByPlzCentroid(normalized);
    if (nearest) {
      return { standort: nearest, match: "nearest" };
    }
  }

  return { standort: FALLBACK_STANDORT, match: "fallback" };
}
