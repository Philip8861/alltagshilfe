"use client";

import {
  PARTNER_RESPONSIBILITY_LABELS,
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import { provisionBucketForServiceSlug } from "@/lib/partner/partner-tip-provision-bucket";
import {
  commissionRateFormFieldName,
  GLOBAL_EINMAL_PROVISION_EUR,
  type PartnerCommissionRatesMap,
} from "@/lib/partner/partner-commission-rates-shared";

type Props = {
  /** Bereits gespeicherte Partner-Sätze (leer = nur Global-Default). */
  initialRates?: PartnerCommissionRatesMap;
  disabled?: boolean;
  compact?: boolean;
};

function defaultHint(slug: PartnerResponsibilitySlug): string {
  const bucket = provisionBucketForServiceSlug(slug);
  if (bucket === "monatlich") return "Monatlich · kein Standard — bitte Satz eintragen";
  const global = GLOBAL_EINMAL_PROVISION_EUR[slug];
  if (global != null) {
    return `Einmal · Standard ${global.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}`;
  }
  return "Einmal";
}

function formatInitial(value: number | undefined): string {
  if (value == null || !Number.isFinite(value)) return "";
  return String(value).includes(".") ? String(value).replace(".", ",") : String(value);
}

export function PartnerCommissionRatesFields({ initialRates, disabled = false, compact = false }: Props) {
  return (
    <fieldset className={compact ? "space-y-2" : "space-y-3"}>
      <legend className={`font-bold uppercase text-[#0F4F68]/80 ${compact ? "text-xs" : "text-sm"}`}>
        Individuelle Provisionssätze
      </legend>
      <p className={`leading-snug text-neutral-600 ${compact ? "text-[0.65rem]" : "text-xs"}`}>
        Optional pro Leistungsbereich. Bei „Vertragsabschluss erfolgreich“ wird der hinterlegte Satz automatisch
        übernommen (Einmal- oder monatliche Provision). Leer lassen = Standard-Satz (Einmal) bzw. manuelle Eingabe
        pro Auftrag (Betrieb ohne Satz).
      </p>
      <ul className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
        {PARTNER_RESPONSIBILITY_SLUGS.map((slug) => {
          const bucket = provisionBucketForServiceSlug(slug);
          const fieldId = `commission-${slug}`;
          return (
            <li key={slug}>
              <label htmlFor={fieldId} className="block text-xs font-semibold text-[#0F4F68]">
                {PARTNER_RESPONSIBILITY_LABELS[slug]}
                <span className="ml-1 font-normal text-neutral-500">
                  ({bucket === "monatlich" ? "monatlich" : "einmal"})
                </span>
              </label>
              <div className="relative mt-1">
                <input
                  id={fieldId}
                  name={commissionRateFormFieldName(slug)}
                  type="text"
                  inputMode="decimal"
                  defaultValue={formatInitial(initialRates?.[slug])}
                  disabled={disabled}
                  placeholder={bucket === "monatlich" ? "z. B. 128,50" : "z. B. 15,00"}
                  autoComplete="off"
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-3 pr-10 text-sm font-semibold tabular-nums text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-neutral-400">
                  €
                </span>
              </div>
              <p className="mt-0.5 text-[0.62rem] text-neutral-500">{defaultHint(slug)}</p>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
