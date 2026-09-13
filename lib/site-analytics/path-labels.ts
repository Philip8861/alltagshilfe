import { BETRIEBLICH_ANALYTICS_PATH } from "@/lib/site-analytics/record-page-view";

const PATH_LABELS: Record<string, string> = {
  "/": "Startseite",
  [BETRIEBLICH_ANALYTICS_PATH]: "Betriebliche Pflegeberatung",
  "/pflegeberatung": "Betriebliche Pflegeberatung",
  "/pflegeberatung/private-pflegeberatung": "Private Pflegeberatung",
  "/landing/haushaltshilfe-alltagsbegleitung": "Landing Haushaltshilfe (Social Media)",
};

export function siteAnalyticsPathLabel(path: string): string | null {
  return PATH_LABELS[path] ?? null;
}
