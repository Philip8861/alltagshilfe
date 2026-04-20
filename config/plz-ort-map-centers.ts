/**
 * Optional: ungefährer Kartenmittelpunkt für das Suchgebiet (PLZ/Ort der Standort-Unterseite).
 * Für Slugs ohne Eintrag wird nur der Google-Maps-Link zur Suche angezeigt.
 */
export const PLZ_ORT_MAP_CENTER_BY_SLUG: Partial<Record<string, { lat: number; lng: number }>> = {
  "87700-memmingen": { lat: 47.98789, lng: 10.18148 },
};

export function getPlzOrtGoogleMapsSearchHref(plz: string, ort: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${plz} ${ort}, Deutschland`)}`;
}

/** iframe-Einbettung für das Suchgebiet PLZ/Ort (Gebiet, kein fester Büro-Punkt). */
export function getPlzOrtMapsEmbedSrc(plz: string, ort: string): string {
  const q = encodeURIComponent(`${plz} ${ort}, Deutschland`);
  return `https://maps.google.com/maps?q=${q}&hl=de&z=12&output=embed`;
}

export function getPlzOrtMapLines(slug: string, plz: string, ort: string): {
  mapsHref: string;
  coordsLine: string | null;
} {
  const mapsHref = getPlzOrtGoogleMapsSearchHref(plz, ort);
  const c = PLZ_ORT_MAP_CENTER_BY_SLUG[slug];
  if (!c) return { mapsHref, coordsLine: null };
  const latH = c.lat >= 0 ? "N" : "S";
  const lngH = c.lng >= 0 ? "O" : "W";
  const coordsLine = `${Math.abs(c.lat).toFixed(5)}° ${latH}, ${Math.abs(c.lng).toFixed(5)}° ${lngH} (${plz} ${ort})`;
  return { mapsHref, coordsLine };
}
