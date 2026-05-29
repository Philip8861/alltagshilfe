import {
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import {
  EINMAL_PROVISION_EUR,
  einmalProvisionForSlug,
  parsePayoutAmountGerman,
} from "@/lib/partner/partner-tip-payout";

export type PartnerCommissionRatesMap = Partial<Record<PartnerResponsibilitySlug, number>>;

export const COMMISSION_RATE_FORM_PREFIX = "commission_rate_eur__";

export function commissionRateFormFieldName(slug: PartnerResponsibilitySlug): string {
  return `${COMMISSION_RATE_FORM_PREFIX}${slug}`;
}

export function parseCommissionRatesFromFormData(formData: FormData): {
  rates: PartnerCommissionRatesMap;
  error?: string;
} {
  const rates: PartnerCommissionRatesMap = {};

  for (const slug of PARTNER_RESPONSIBILITY_SLUGS) {
    const raw = formData.get(commissionRateFormFieldName(slug));
    if (typeof raw !== "string") continue;
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const amount = parsePayoutAmountGerman(trimmed);
    if (amount == null) {
      return {
        rates: {},
        error: `Ungültiger Provisionssatz. Bitte z. B. 15,00 oder 128,50 eingeben.`,
      };
    }
    rates[slug] = amount;
  }

  return { rates };
}

export function globalDefaultProvisionEur(slug: string): number | null {
  return einmalProvisionForSlug(slug);
}

export function resolveProvisionEurForPartner(
  serviceSlug: string,
  partnerRates: PartnerCommissionRatesMap | null | undefined,
): number | null {
  const slug = serviceSlug as PartnerResponsibilitySlug;
  const custom = partnerRates?.[slug];
  if (typeof custom === "number" && Number.isFinite(custom) && custom > 0) {
    return Math.round(custom * 100) / 100;
  }

  const bucket = provisionBucketForServiceSlug(serviceSlug);
  if (bucket === "einmal") {
    return globalDefaultProvisionEur(serviceSlug);
  }
  return null;
}

export { EINMAL_PROVISION_EUR as GLOBAL_EINMAL_PROVISION_EUR };
