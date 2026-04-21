/**
 * Web-Mercator (wie Google Maps): Welt-Pixel bei Zoom z, Kachelbreite 256 px.
 * Ermöglicht deckungsgleiche Marker-Offsets zum eingebetteten Google-Map-iframe.
 */
const TILE = 256;

export function latLngToWorldPixel(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const latClamped = Math.min(85.05112878, Math.max(-85.05112878, lat));
  const lngClamped = Math.min(180, Math.max(-180, lng));
  const scale = TILE * Math.pow(2, zoom);
  const x = ((lngClamped + 180) / 360) * scale;
  const siny = Math.sin((latClamped * Math.PI) / 180);
  const y = (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)) * scale;
  return { x, y };
}
