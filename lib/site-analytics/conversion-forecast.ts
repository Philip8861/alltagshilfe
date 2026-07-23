/** Einfache lineare Regression y = a + b·x für Trend und grobe Prognose. */

export type LinearTrend = {
  intercept: number;
  slope: number;
  /** Bestimmtheit 0…1; null wenn zu wenig Punkte. */
  r2: number | null;
};

export function linearRegression(ys: number[]): LinearTrend | null {
  const n = ys.length;
  if (n < 2) return null;
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumXY = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += ys[i]!;
    sumXX += i * i;
    sumXY += i * ys[i]!;
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const y = ys[i]!;
    const pred = intercept + slope * i;
    ssTot += (y - meanY) ** 2;
    ssRes += (y - pred) ** 2;
  }
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : null;
  return { intercept, slope, r2 };
}

export function predictLinear(trend: LinearTrend, x: number): number {
  return Math.max(0, trend.intercept + trend.slope * x);
}

/** Conversion-Rate in Prozent (0…100); bei 0 Besuchern null. */
export function conversionRatePercent(completions: number, visitors: number): number | null {
  if (visitors <= 0) return null;
  return (completions / visitors) * 100;
}

/** „Besucher pro Anfrage“ – je niedriger, desto besser. */
export function visitorsPerCompletion(visitors: number, completions: number): number | null {
  if (completions <= 0) return null;
  return visitors / completions;
}

/** Kalendermonate / Jahre für Hochrechnung aus Tageswerten. */
export const DAYS_PER_MONTH_AVG = 30.437;
export const DAYS_PER_YEAR_AVG = 365.25;

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type IstPrognosePeriod = {
  perDay: number;
  perMonth: number;
  perYear: number;
};

export type IstPrognoseRow = {
  id: string;
  label: string;
  /** Tatsächliche Anfragen im ausgewerteten Zeitraum. */
  completionsIst: number;
  ist: IstPrognosePeriod;
  prognose: IstPrognosePeriod;
};

/**
 * IST = bisherige Ø-Anfragen/Tag × Monat/Jahr.
 * Voraussichtlich = prognostizierte Besucher/Tag × Kanal-Conversion (Anteil Anfragen/Besucher).
 */
export function buildIstPrognoseRow(
  id: string,
  label: string,
  completionsIst: number,
  daysObserved: number,
  visitorsTotal: number,
  visitorsPerDayPrognose: number,
): IstPrognoseRow {
  const days = Math.max(1, daysObserved);
  const perDayIst = completionsIst / days;
  const share = visitorsTotal > 0 ? completionsIst / visitorsTotal : 0;
  const perDayPrognose = visitorsPerDayPrognose * share;
  return {
    id,
    label,
    completionsIst,
    ist: {
      perDay: round2(perDayIst),
      perMonth: round1(perDayIst * DAYS_PER_MONTH_AVG),
      perYear: round1(perDayIst * DAYS_PER_YEAR_AVG),
    },
    prognose: {
      perDay: round2(perDayPrognose),
      perMonth: round1(perDayPrognose * DAYS_PER_MONTH_AVG),
      perYear: round1(perDayPrognose * DAYS_PER_YEAR_AVG),
    },
  };
}
