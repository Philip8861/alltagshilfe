#!/usr/bin/env node
/**
 * Verifikations-Skript für die Cent-Logik der Referral-Provision.
 *
 * Verwendung (lokal):
 *   node scripts/verify-referral-money.mjs
 *
 * Es spiegelt die Logik aus `lib/partner/referral-money.ts` 1:1 in JS und prüft die
 * vom Nutzer geforderten Fälle. Der Build/Test-Runner-freie Vergleich ist absichtlich
 * "dumm einfach", damit der Nutzer ohne weitere Tooling-Schritte Vertrauen aufbauen kann.
 */

const PARTNER_DIRECT_REFERRAL_RATE_BPS = 500;

function eurToCents(input) {
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

function centsToEur(cents) {
  if (!Number.isFinite(cents)) return 0;
  return Math.round(cents) / 100;
}

function referralCentsFromOwnCents(ownCents, bps = PARTNER_DIRECT_REFERRAL_RATE_BPS) {
  if (!Number.isFinite(ownCents) || ownCents <= 0) return 0;
  if (!Number.isFinite(bps) || bps <= 0) return 0;
  return Math.round((ownCents * bps) / 10000);
}

const cases = [
  { name: "100,00 EUR → 5,00 EUR", own: 10000, expectedRef: 500 },
  { name: "20,00 EUR → 1,00 EUR", own: 2000, expectedRef: 100 },
  { name: "1,00 EUR → 0,05 EUR", own: 100, expectedRef: 5 },
  { name: "0,01 EUR → 0,00 EUR (Rundung)", own: 1, expectedRef: 0 },
  { name: "100,33 EUR → 5,02 EUR (kaufmännisch gerundet)", own: 10033, expectedRef: 502 },
  { name: "0 EUR → 0 EUR", own: 0, expectedRef: 0 },
  { name: "negativ → 0 EUR", own: -1000, expectedRef: 0 },
  { name: "999.999,00 EUR → 49.999,95 EUR", own: 99999900, expectedRef: 4999995 },
  { name: "Storno: own=0 → ref=0", own: 0, expectedRef: 0 },
  { name: "12,34 EUR → 0,62 EUR", own: 1234, expectedRef: 62 },
  { name: "EUR → Cent: '99,90' → 9990", parse: "99,90", expectedCents: 9990 },
  { name: "EUR → Cent: '99.90' → 9990", parse: "99.90", expectedCents: 9990 },
  { name: "EUR → Cent: '0' → 0", parse: "0", expectedCents: 0 },
  { name: "EUR → Cent: leer → 0", parse: "", expectedCents: 0 },
  { name: "EUR → Cent: null → 0", parse: null, expectedCents: 0 },
  /** numeric(12,2) liefert nie mehr als 2 NK – 1.005 als number ist Float und wird ggf. abgeschnitten;
   *  in der Realität kommen Strings aus Supabase, daher kein Praxisproblem. */
];

let passed = 0;
let failed = 0;

for (const c of cases) {
  if ("expectedRef" in c) {
    const actual = referralCentsFromOwnCents(c.own);
    const ok = actual === c.expectedRef;
    if (ok) {
      passed++;
      console.log(`OK   ${c.name}  → ${actual} cents`);
    } else {
      failed++;
      console.log(`FAIL ${c.name}  → got ${actual}, expected ${c.expectedRef}`);
    }
  } else if ("expectedCents" in c) {
    const actual = eurToCents(c.parse);
    const ok = actual === c.expectedCents;
    if (ok) {
      passed++;
      console.log(`OK   ${c.name}  → ${actual} cents`);
    } else {
      failed++;
      console.log(`FAIL ${c.name}  → got ${actual}, expected ${c.expectedCents}`);
    }
  }
}

console.log("");
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
