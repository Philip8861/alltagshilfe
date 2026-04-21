/** Google-Maps-Embed (ohne Abhängigkeit von standorte.ts) – für Server und Client. */

export const REGION_MAP_INTERACTIVE_ZOOM_MIN = 6;
export const REGION_MAP_INTERACTIVE_ZOOM_MAX = 12;

export function buildRegionMapsEmbedSrc(lat: number, lng: number, zoom: number): string {
  const z = Math.round(
    Math.min(REGION_MAP_INTERACTIVE_ZOOM_MAX, Math.max(REGION_MAP_INTERACTIVE_ZOOM_MIN, zoom)),
  );
  return `https://maps.google.com/maps?ll=${lat},${lng}&hl=de&z=${z}&output=embed`;
}
