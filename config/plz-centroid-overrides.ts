/**
 * Manuelle Korrekturen (Vorrang vor Nominatim-Ortsmitte in plz-centroids-ortsmitte.json).
 * Nur bei Bedarf eintragen, z. B. wenn Geocoder und Ortsname stark abweichen.
 */
export const PLZ_CENTROID_OVERRIDES: Partial<Record<string, { lat: number; lng: number }>> = {};
