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

/** Kanal-Gruppen für Tages-/Monats-/Jahresauswertung (je Gruppe ein eigener Abschnitt). */
export const CONTACT_CHANNEL_GROUPS = [
  { id: "contact", kinds: ["contact"], label: "Kontaktformular" },
  { id: "hilfefinder", kinds: ["hilfefinder"], label: "Hilfe-Finder" },
  {
    id: "landingpage-social-media",
    kinds: ["landingpage-social-media"],
    label: "Landingpage Social Media",
  },
  { id: "ratgeber", kinds: ["ratgeber"], label: "Ratgeber" },
  { id: "pflegebox", kinds: ["pflegebox"], label: "Pflegebox" },
  { id: "betrieblich-angebot", kinds: ["betrieblich-angebot"], label: "Betriebliches Angebot" },
  {
    id: "karriere",
    kinds: [...KARRIERE_PAGE_SOURCE_KINDS],
    label: "Karriere",
  },
] as const;

export type ContactChannelGroupId = (typeof CONTACT_CHANNEL_GROUPS)[number]["id"];

export const KIND_LABELS: Record<string, string> = {
  contact: "Kontaktformular (/kontakt & eingebunden)",
  ratgeber: "Ratgeber (Beratungsdialog)",
  hilfefinder: "Hilfe-Finder",
  "landingpage-social-media": "Landingpage Social Media",
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
  "landingpage-social-media": "#1877F2",
  pflegebox: CHART_EMERALD,
  "betrieblich-angebot": CHART_AMBER,
  karriere: CHART_ROSE,
  "karriere-form": "#f97316",
  "karriere-wizard": "#c2410c",
};

export function strokeForKind(kind: string): string {
  return KIND_LINE_COLORS[kind] ?? CHART_GRID;
}

const GROUP_LINE_COLORS: Record<ContactChannelGroupId, string> = {
  contact: CHART_TEAL,
  hilfefinder: CHART_SKY,
  "landingpage-social-media": "#1877F2",
  ratgeber: CHART_VIOLET,
  pflegebox: CHART_EMERALD,
  "betrieblich-angebot": CHART_AMBER,
  karriere: CHART_ROSE,
};

export function strokeForChannelGroup(id: ContactChannelGroupId): string {
  return GROUP_LINE_COLORS[id] ?? CHART_GRID;
}
