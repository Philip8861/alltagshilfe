"use client";

import { cn } from "@/lib/utils";

type PartnerAuthStatusBoxProps = {
  message: string | null;
  pending?: boolean;
  /** Erfolg z. B. nach E-Mail-Versand (Registrierung). */
  successHighlight?: string | null;
};

/**
 * Festes Feld für Status/Fehler – immer sichtbar, damit Meldungen nicht übersehen werden.
 */
export function PartnerAuthStatusBox({ message, pending, successHighlight }: PartnerAuthStatusBoxProps) {
  const showError = Boolean(message);
  const showSuccess = Boolean(successHighlight);
  const text = showSuccess
    ? successHighlight
    : pending
      ? "Anfrage wird verarbeitet …"
      : showError
        ? message
        : "Noch keine Meldung. Fehler und Hinweise erscheinen hier nach dem Absenden des Formulars.";

  return (
    <div
      className={cn(
        "min-h-[5rem] rounded-xl border px-4 py-3 text-sm transition-colors",
        showSuccess
          ? "border-emerald-300/80 bg-emerald-50 text-emerald-950"
          : showError
            ? "border-[#b42318]/60 bg-[#fef3f2] text-[#7a271a]"
            : pending
              ? "border-[#0F4F68]/30 bg-[#e8f4f7] text-[#0F4F68]"
              : "border-neutral-200 bg-neutral-50 text-neutral-600",
      )}
      role="region"
      aria-label="Status und Fehlermeldungen"
      aria-live="polite"
    >
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-neutral-500">Status / Fehlermeldungen</p>
      <p className="mt-2 leading-snug" role={showError ? "alert" : showSuccess ? "status" : undefined}>
        {text}
      </p>
    </div>
  );
}
