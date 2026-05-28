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

export function getStandortKarteData(): StandortKarteData {
  return standortKarteData as StandortKarteData;
}
