"use client";

/** Event-Name: Lesbarkeits-Widget öffnen (z. B. Footer-Link). */
export const AHS_READABILITY_OPEN_EVENT = "ahs-open-readability";

export function ReadabilityLaunchLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={
        className ??
        "rounded text-left text-sm text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
      }
      onClick={() => {
        window.dispatchEvent(new Event(AHS_READABILITY_OPEN_EVENT));
      }}
    >
      Lesbarkeit &amp; Kontrast
    </button>
  );
}
