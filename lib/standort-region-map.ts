/**
 * Regionale Standortkarte: gemeinsame Bounds aller servierten PLZ (plz-centroids.json),
 * Zentrum/Zoom für Regionalkarte (MapLibre/OSM) und Link „Google Maps öffnen“.
 */
import { findStandortByPlz, getOrtByPlz } from "@/config/standorte";
import { buildRegionMapsEmbedSrc } from "@/lib/region-map-embed";
import { getAllCentroidPlzKeys, getResolvedCentroid } from "@/lib/plz-centroid-resolve";

const PADDING_RATIO = 0.12;
/** Sichtbare Breite in px (Referenz), konservativ für typische Embed-Breite */
const EMBED_REF_WIDTH_PX = 640;
const ZOOM_MARGIN = 1.06;
const ZOOM_MIN = 6;
const ZOOM_MAX = 10;

export type PlzMapMarker = {
  plz: string;
  ort: string;
  /** Feste Standortseite (/standorte/{slug}). */
  standortPageSlug: string;
  lat: number;
  lng: number;
};

type Bounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

let cachedBounds: Bounds | null = null;

function computeRawBounds(): Bounds {
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;
  for (const key of getAllCentroidPlzKeys()) {
    const c = getResolvedCentroid(key);
    if (!c) continue;
    if (c.lat < minLat) minLat = c.lat;
    if (c.lat > maxLat) maxLat = c.lat;
    if (c.lng < minLng) minLng = c.lng;
    if (c.lng > maxLng) maxLng = c.lng;
  }
  return { minLat, maxLat, minLng, maxLng };
}

function getPaddedBounds(): Bounds {
  if (cachedBounds) return cachedBounds;
  const raw = computeRawBounds();
  const latMid = (raw.minLat + raw.maxLat) / 2;
  const lngMid = (raw.minLng + raw.maxLng) / 2;
  const latHalf = ((raw.maxLat - raw.minLat) / 2) * (1 + PADDING_RATIO);
  const lngHalf = ((raw.maxLng - raw.minLng) / 2) * (1 + PADDING_RATIO);
  cachedBounds = {
    minLat: latMid - latHalf,
    maxLat: latMid + latHalf,
    minLng: lngMid - lngHalf,
    maxLng: lngMid + lngHalf,
  };
  return cachedBounds;
}

function lngSpanToZoom(lngSpan: number): number {
  const visibleNeed = Math.max(lngSpan * ZOOM_MARGIN, 0.12);
  const zFloat = Math.log2((360 * EMBED_REF_WIDTH_PX) / (256 * visibleNeed));
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zFloat)));
}

/** Zentrum und Zoom für Google-Maps-Embed (ganzes Versorgungsgebiet). */
export function getServiceRegionMapView(): { lat: number; lng: number; zoom: number } {
  const b = getPaddedBounds();
  const lat = (b.minLat + b.maxLat) / 2;
  const lng = (b.minLng + b.maxLng) / 2;
  const zoom = lngSpanToZoom(b.maxLng - b.minLng);
  return { lat, lng, zoom };
}

export function getServiceRegionMapsEmbedSrc(): string {
  const { lat, lng, zoom } = getServiceRegionMapView();
  return buildRegionMapsEmbedSrc(lat, lng, zoom);
}

export function getServiceRegionGoogleMapsSearchHref(): string {
  const { lat, lng } = getServiceRegionMapView();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

let markersCache: PlzMapMarker[] | null = null;

/** Servierte PLZ mit Koordinate; Linkziel ist die zugehörige feste Standortseite inkl. PLZ/Ort. */
export function getPlzMarkersForRegionMap(): PlzMapMarker[] {
  if (markersCache) return markersCache;
  const out: PlzMapMarker[] = [];
  for (const plz of getAllCentroidPlzKeys()) {
    if (!/^\d{5}$/.test(plz)) continue;
    const ort = getOrtByPlz(plz);
    const standort = findStandortByPlz(plz);
    const c = getResolvedCentroid(plz);
    if (!ort || !standort || !c) continue;
    out.push({ plz, ort, standortPageSlug: standort.pageSlug, lat: c.lat, lng: c.lng });
  }
  markersCache = out;
  return out;
}
