/**
 * Modellgrundlage für den Pflegekostenrechner.
 *
 * Verdienstwerte: Destatis, durchschnittlicher Bruttojahresverdienst 2025
 * für Vollzeitbeschäftigte inklusive Sonderzahlungen.
 * Beitragssätze und Beitragsbemessungsgrenzen: Stand 2026.
 */
export const BETRIEBLICH_CARE_MODEL = Object.freeze({
  checked: "16.09.2026",
  earningsYear: 2025,
  contributionsYear: 2026,
  careShare: 0.11,
  additionalSickDays: 4.5,
  paidWeekdays: 260,
  monthlyPrice: 3.9,
  pensionRate: 0.093,
  unemploymentRate: 0.013,
  healthRate: 0.073,
  additionalHealthRate: 0.0145,
  careRate: 0.018,
  pensionCapAnnual: 101_400,
  healthCapAnnual: 69_750,
});

export const BETRIEBLICH_CARE_INDUSTRIES = [
  {
    id: "average",
    name: "Sonstiges, Unternehmensdurchschnitt",
    official: "Gesamtwirtschaft",
    annualGross: 64_441,
  },
  {
    id: "industry",
    name: "Industrie und Produktion",
    official: "Verarbeitendes Gewerbe",
    annualGross: 67_520,
  },
  {
    id: "construction",
    name: "Bau und Bauhandwerk",
    official: "Baugewerbe",
    annualGross: 54_358,
  },
  {
    id: "trade",
    name: "Großhandel und Einzelhandel",
    official: "Handel einschließlich Kraftfahrzeuginstandhaltung und Reparatur",
    annualGross: 59_558,
  },
  {
    id: "transport",
    name: "Verkehr und Logistik",
    official: "Verkehr und Lagerei",
    annualGross: 51_843,
  },
  {
    id: "hospitality",
    name: "Gastronomie und Hotellerie",
    official: "Gastgewerbe",
    annualGross: 39_749,
  },
  {
    id: "it",
    name: "IT und Kommunikation",
    official: "Information und Kommunikation",
    annualGross: 86_638,
  },
  {
    id: "finance",
    name: "Finanzen und Versicherungen",
    official: "Finanzdienstleistungen und Versicherungsdienstleistungen",
    annualGross: 91_678,
  },
  {
    id: "professional",
    name: "Beratung, Technik und freie Berufe",
    official: "Freiberufliche, wissenschaftliche und technische Dienstleistungen",
    annualGross: 83_847,
  },
  {
    id: "services",
    name: "Unternehmensnahe Dienstleistungen",
    official: "Sonstige wirtschaftliche Dienstleistungen",
    annualGross: 50_706,
  },
  {
    id: "health",
    name: "Gesundheit und Soziales",
    official: "Gesundheitswesen und Sozialwesen",
    annualGross: 62_503,
  },
] as const;

export type BetrieblichIndustryId = (typeof BETRIEBLICH_CARE_INDUSTRIES)[number]["id"];

export function calculateBetrieblichCareCost(employees: number, industryId: string) {
  const industry = BETRIEBLICH_CARE_INDUSTRIES.find((item) => item.id === industryId);

  if (
    !industry ||
    !Number.isSafeInteger(employees) ||
    employees < 1 ||
    employees > 1_000_000
  ) {
    return null;
  }

  const model = BETRIEBLICH_CARE_MODEL;
  const gross = industry.annualGross;
  const pension =
    Math.min(gross, model.pensionCapAnnual) * model.pensionRate;
  const unemployment =
    Math.min(gross, model.pensionCapAnnual) * model.unemploymentRate;
  const health =
    Math.min(gross, model.healthCapAnnual) *
    (model.healthRate + model.additionalHealthRate);
  const care = Math.min(gross, model.healthCapAnnual) * model.careRate;
  const annualContributions = pension + unemployment + health + care;
  const dailyCost =
    (gross + annualContributions) / model.paidWeekdays;
  const affectedEmployees = employees * model.careShare;
  const additionalSickDaysTotal =
    affectedEmployees * model.additionalSickDays;
  const annualCost = additionalSickDaysTotal * dailyCost;

  return {
    industry,
    employees,
    annualContributions,
    dailyCost,
    affectedEmployees,
    additionalSickDaysTotal,
    annualCost,
    scenarios: [3, 4.5, 8].map((days) => ({
      days,
      annualCost: affectedEmployees * days * dailyCost,
    })),
  };
}
