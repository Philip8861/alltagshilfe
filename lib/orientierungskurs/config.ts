import { randomUUID } from "node:crypto";

export const BOOKING_PATH = "/orientierungskurs";
export const INFO_APPOINTMENT_PATH = "/orientierungskurs/infogespraech";
export const COURSE_MATERIAL_BUCKET = "orientierungskurs-material";
export const COURSE_BROCHURE_FILE = "Orientierungskurs-Pflege-und-Beruf.pdf";
export const COURSE_BROCHURE_OBJECT = "Orientierungskurs-Pflege-und-Beruf-mit-Buchungsbutton.pdf";
export const COURSE_SIGNATURE_LOGO_OBJECT = "Alltagshilfe-Sued-Signatur.png";

export const INFO_APPOINTMENT_ADVISORS = [
  { name: "Philip Sonntag", email: "philip.sonntag@alltagshilfe-sued.de" },
  { name: "Franz Dirscherl", email: "franz.dirscherl@alltagshilfe-sued.de" },
] as const;

export function courseSiteOrigin(): string | null {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "");
    if (url.username || url.password) return null;
    if (url.protocol === "https:") return url.origin;
    if (process.env.NODE_ENV !== "production" && url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return url.origin;
    return null;
  } catch {
    return null;
  }
}

export function newOnlineMeetingUrl(): string | null {
  const template = process.env.ORIENTIERUNGSKURS_ONLINE_URL_TEMPLATE?.trim();
  if (!template?.includes("{courseId}")) return null;
  try {
    const url = new URL(template.replaceAll("{courseId}", randomUUID()));
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function participationUrl(origin: string, code: string): string {
  return new URL(BOOKING_PATH + "/teilnahme/" + code, origin).href;
}
