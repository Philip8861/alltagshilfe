"use client";

import { CONTACT_SOURCE_OPTIONS, KARRIERE_CONTACT_SOURCE_OPTIONS } from "@/lib/contact-source";

export type ContactSourceSelectProps = {
  /** `karriere`: nur Optionen für Bewerbung / Kurzcheck (ohne Plakat/Flyer etc.). */
  variant?: "general" | "karriere";
  /** Eindeutige ID des Selects (mehrere Formulare auf einer Seite). */
  id: string;
  /** Name im FormData (Default: `contactSource`). */
  name?: string;
  /** Reicht den disabled-Status durch (z. B. während Versand). */
  disabled?: boolean;
  /** Vorausgewählter Wert (Slug). */
  defaultValue?: string;
  /** Optionaler Klassen-Override für das Wrapper-`<div>` (für Spaltenlayouts). */
  wrapperClassName?: string;
  /** Optionaler Klassen-Override für das `<select>` (Default: Hausstil). */
  selectClassName?: string;
  /** Steuert Pflichtfeld-Verhalten (Default: true). */
  required?: boolean;
};

/**
 * Wiederverwendbares Pflichtfeld „Wie sind Sie auf uns aufmerksam geworden?".
 * Optionen aus `lib/contact-source.ts` (`general` oder `karriere`).
 * Slug landet im FormData; serverseitig wird er geprüft, in die E-Mail aufgenommen
 * und anonym in der Tagesstatistik aggregiert.
 */
export function ContactSourceSelect({
  variant = "general",
  id,
  name = "contactSource",
  disabled = false,
  defaultValue = "",
  wrapperClassName,
  selectClassName,
  required = true,
}: ContactSourceSelectProps) {
  const options = variant === "karriere" ? KARRIERE_CONTACT_SOURCE_OPTIONS : CONTACT_SOURCE_OPTIONS;
  const labelId = `${id}-label`;
  return (
    <div className={wrapperClassName}>
      <label
        id={labelId}
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700"
      >
        Wie sind Sie auf uns aufmerksam geworden? {required ? "*" : null}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        aria-required={required}
        aria-labelledby={labelId}
        className={
          selectClassName ??
          "mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
        }
      >
        <option value="" disabled>
          Bitte wählen …
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
