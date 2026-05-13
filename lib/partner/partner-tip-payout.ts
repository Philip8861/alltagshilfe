import type { PartnerResponsibilitySlug } from "@/lib/partner/responsibility-areas";

/** Feste Einmalprovisionen (EUR) bei Status „Vertragsabschluss erfolgreich“ (nicht betriebliche Slugs). */
export const EINMAL_PROVISION_EUR: Partial<Record<PartnerResponsibilitySlug, number>> = {
  pflegehilfsmittel: 15,
  hauswirtschaft_betreuung: 30,
  pflegeberatung: 15,
};

export function einmalProvisionForSlug(slug: string): number | null {
  const s = slug as PartnerResponsibilitySlug;
  const n = EINMAL_PROVISION_EUR[s];
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

export function formatProvisionEur(n: number): string {
  return n.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** de-DE Eingabe: Komma oder Punkt */
export function parsePayoutAmountGerman(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

export function normalizePaidAmountEur(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100) / 100;
}
