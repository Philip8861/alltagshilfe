import standortKarteData from "./standort-karte.json";

export type StandortKartePunkt = { left: number; top: number };

export type StandortKarteHauptmarker = StandortKartePunkt & {
  label: string;
  sublabel?: string;
  href?: string;
  labelAbove?: boolean;
};

export type StandortKarteOrtsLabel = StandortKartePunkt & {
  label: string;
  withX?: boolean;
};

export type StandortKarteData = {
  hauptmarker: StandortKarteHauptmarker[];
  punkte: StandortKartePunkt[];
  ortsLabels: StandortKarteOrtsLabel[];
};

/**
 * Standort-Karte: Koordinaten sind Kartenbild-%-Werte (0–100) im sichtbaren Bereich
 * von `object-fit: contain` + `object-position` – identisch für Marker und Punkte.
 * Berechnung: `lib/standort-karte-coords.ts`
 */
export function getStandortKarteData(): StandortKarteData {
  return standortKarteData as StandortKarteData;
}

/**
 * Karten-Konfigurator (nur lokal): standardmäßig aus.
 * Aktivieren: `.env.local` → `STANDORT_KARTE_EDITOR=true`, dann `/standorte?karte=bearbeiten`
 */
export function isStandortKarteEditorEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.STANDORT_KARTE_EDITOR === "true"
  );
}
