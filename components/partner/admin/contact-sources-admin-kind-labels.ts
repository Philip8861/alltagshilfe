import {
  CHART_AMBER,
  CHART_EMERALD,
  CHART_GRID,
  CHART_ROSE,
  CHART_SKY,
  CHART_TEAL,
  CHART_VIOLET,
} from "@/components/partner/partner-chart-theme";

export const KARRIERE_PAGE_SOURCE_KINDS = ["karriere", "karriere-form", "karriere-wizard"] as const;

export const KIND_LABELS: Record<string, string> = {
  contact: "Kontaktformular (/kontakt & eingebunden)",
  ratgeber: "Ratgeber (Beratungsdialog)",
  hilfefinder: "Hilfe-Finder",
  karriere: "Karriere (Legacy)",
  "karriere-form": "Karriere: Formular (Seite)",
  "karriere-wizard": "Karriere: Kurzcheck",
  "betrieblich-angebot": "Betriebliches Angebot",
  pflegebox: "Pflegebox (Konfigurator)",
};

export function kindLabel(kind: string): string {
  return KIND_LABELS[kind] ?? kind;
}

const KIND_LINE_COLORS: Record<string, string> = {
  contact: CHART_TEAL,
  ratgeber: CHART_VIOLET,
  hilfefinder: CHART_SKY,
  pflegebox: CHART_EMERALD,
  "betrieblich-angebot": CHART_AMBER,
  karriere: CHART_ROSE,
  "karriere-form": "#f97316",
  "karriere-wizard": "#c2410c",
};

export function strokeForKind(kind: string): string {
  return KIND_LINE_COLORS[kind] ?? CHART_GRID;
}
