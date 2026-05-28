/**
 * Geld-Konstanten und Cent-Hilfsfunktionen für Partner-Referral.
 *
 * Regel: Geldberechnung IMMER in Cent (Integer), niemals Float.
 * EUR-Werte (numeric 12,2) aus DB werden direkt als String/number gelesen und in Cent gewandelt.
 *
 * Bemessungsgrundlage Referral = ownApprovedClosingCommissionCents (NIE totalPayoutCents,
 * NIE Referral-Provisionen, NIE Umsatz, NIE storniert/offen).
 */

/** 5 % in Basispunkten. */
export const PARTNER_DIRECT_REFERRAL_RATE_BPS = 500;

/** Maximale Tiefe beim Aufbau des Werbe-Strukturbaums (Schutz gegen Endlos-Loop). */
export const PARTNER_NETWORK_MAX_DEPTH = 10;

/**
 * Wandelt eine EUR-Eingabe (z. B. aus DB numeric(12,2)) in Cent.
 * Toleriert string/number; gibt 0 zurück bei ungültigem Wert.
 */
export function eurToCents(input: unknown): number {
  if (input === null || input === undefined) return 0;
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return 0;
    if (input <= 0) return 0;
    return Math.round(input * 100);
  }
  if (typeof input === "string") {
    const t = input.trim().replace(/\s/g, "").replace(",", ".");
    if (!t) return 0;
    const n = Number(t);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.round(n * 100);
  }
  return 0;
}

/** Cent → EUR (number, exakt 2 NK). */
export function centsToEur(cents: number): number {
  if (!Number.isFinite(cents)) return 0;
  return Math.round(cents) / 100;
}

/**
 * Berechnet Referral-Provision in Cent: ownCents × bps / 10000.
 * Banker's-Rounding nicht nötig — Standard math-round genügt (5 % auf glatte EUR-Beträge ist ohnehin exakt).
 * Bei "krummen" Bemessungen (z. B. 100,33 €) wird auf den ganzen Cent gerundet (kaufmännisch).
 */
export function referralCentsFromOwnCents(
  ownCents: number,
  bps: number = PARTNER_DIRECT_REFERRAL_RATE_BPS,
): number {
  if (!Number.isFinite(ownCents) || ownCents <= 0) return 0;
  if (!Number.isFinite(bps) || bps <= 0) return 0;
  return Math.round((ownCents * bps) / 10000);
}

/** Deutsche Euro-Anzeige aus Cent. */
export function formatCentsDe(cents: number): string {
  const eur = centsToEur(cents);
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(eur);
}

/**
 * Normalisiert einen PartnerCode-Eingabewert für DB-Vergleich:
 *   - leerer/null → null
 *   - sonst trim + uppercase
 * Erlaubt nur Buchstaben + Ziffern (1-32 Zeichen) – konsistent mit `assignUniquePartnerReferralCode`
 * (Format `XX1234`), aber tolerant gegenüber zukünftigen Formaten.
 */
export function normalizePartnerCodeInput(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  const t = String(raw).trim().toUpperCase();
  if (!t) return null;
  if (!/^[A-Z0-9]{1,32}$/.test(t)) return null;
  return t;
}
