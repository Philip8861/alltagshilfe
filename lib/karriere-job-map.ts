import { KARRIERE_STELLENANGEBOTE } from "@/lib/validations/karriere";

export type KarriereStellenangebotValue = (typeof KARRIERE_STELLENANGEBOTE)[number];

/** Mappt freie Stellentitel von der Karriere-Seite auf die festen Formular-Werte. */
export function jobTitleToStellenangebot(jobTitle: string): KarriereStellenangebotValue {
  const t = jobTitle.toLowerCase();
  if (t.includes("alltagshelfer")) return "Alltagshelfer";
  if (t.includes("pflegeberater")) return "Pflegeberater";
  if (t.includes("buchhalter")) return "Bürofachkraft";
  if (t.includes("bürofachkraft")) return "Bürofachkraft";
  if (t.includes("standortleiter")) return "Standortleitung";
  return "Alltagshelfer";
}

export const KARRIERE_BEWERBUNG_PREFILL_KEY = "karriere-bewerbung-prefill";

export type KarriereBewerbungPrefill = {
  vorname: string;
  nachname: string;
  email: string;
  phone: string;
  stellenangebot: KarriereStellenangebotValue;
  anmerkung?: string;
};

export function parseKarriereBewerbungPrefill(raw: string): KarriereBewerbungPrefill | null {
  try {
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return null;
    const o = j as Record<string, unknown>;
    const stellenangebot = o.stellenangebot;
    if (
      typeof stellenangebot !== "string" ||
      !(KARRIERE_STELLENANGEBOTE as readonly string[]).includes(stellenangebot)
    ) {
      return null;
    }
    const vorname = String(o.vorname ?? "").trim();
    const nachname = String(o.nachname ?? "").trim();
    const email = String(o.email ?? "").trim();
    const phone = String(o.phone ?? "").trim();
    if (!vorname || !nachname || !email || !phone) return null;
    const anmerkungRaw = o.anmerkung;
    const anmerkung =
      typeof anmerkungRaw === "string" && anmerkungRaw.trim().length > 0 ? anmerkungRaw.trim() : undefined;
    return {
      vorname,
      nachname,
      email,
      phone,
      stellenangebot: stellenangebot as KarriereStellenangebotValue,
      anmerkung,
    };
  } catch {
    return null;
  }
}
