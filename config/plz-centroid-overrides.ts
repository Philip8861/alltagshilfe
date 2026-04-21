/**
 * Manuelle Korrekturen für Karte & Umkreis (Ortskern statt PLZ-Flächenmittelpunkt).
 * Basis: config/plz-centroids.json (WZB-Geometrie-Mittelpunkte – bei langen oder gebirgigen
 * PLZ-Gebieten kann der Punkt neben dem Ortsnamen liegen).
 */
export const PLZ_CENTROID_OVERRIDES: Partial<Record<string, { lat: number; lng: number }>> = {
  "87541": { lat: 47.5029, lng: 10.3731 }, // Bad Hindelang (Ortsmitte)
  "87561": { lat: 47.4112, lng: 10.2776 }, // Oberstdorf (Ortsmitte)
};
