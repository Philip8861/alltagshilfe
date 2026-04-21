export function getPlzOrtGoogleMapsSearchHref(plz: string, ort: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${plz} ${ort}, Deutschland`)}`;
}

/** iframe-Einbettung für das Suchgebiet PLZ/Ort (Gebiet, kein fester Büro-Punkt). */
export function getPlzOrtMapsEmbedSrc(plz: string, ort: string): string {
  const q = encodeURIComponent(`${plz} ${ort}, Deutschland`);
  return `https://maps.google.com/maps?q=${q}&hl=de&z=12&output=embed`;
}
