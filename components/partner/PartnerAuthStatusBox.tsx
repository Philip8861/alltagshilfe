"use client";

import { cn } from "@/lib/utils";

type PartnerAuthStatusBoxProps = {
  message: string | null;
  pending?: boolean;
  successHighlight?: string | null;
};

/**
 * Meldungen nur bei Bedarf (kein Platzhalter, kein „Status“-Label).
 */
export function PartnerAuthStatusBox({ message, pending, successHighlight }: PartnerAuthStatusBoxProps) {
  const showError = Boolean(message);
  const showSuccess = Boolean(successHighlight);
  const showPending = Boolean(pending);

  if (!showError && !showSuccess && !showPending) {
    return null;
  }

  const text = showSuccess
    ? successHighlight
    : showPending
      ? "Wird verarbeitet …"
      : message;

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm transition-colors",
        showSuccess
          ? "border-emerald-300/80 bg-emerald-50 text-emerald-950"
          : showError
            ? "border-[#b42318]/60 bg-[#fef3f2] text-[#7a271a]"
            : "border-[#0F4F68]/30 bg-[#e8f4f7] text-[#0F4F68]",
      )}
      role={showError ? "alert" : "status"}
      aria-live="polite"
    >
      <p className="leading-snug">{text}</p>
    </div>
  );
}
