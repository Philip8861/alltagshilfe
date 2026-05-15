"use client";

import { AHS_READABILITY_OPEN_EVENT } from "@/lib/readability-constants";

/** Öffnet das bestehende Barrierefreiheits-Panel (Lesbarkeit / Kontrast). */
export function AccessibilitySettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event(AHS_READABILITY_OPEN_EVENT));
      }}
      aria-haspopup="dialog"
      aria-label="Barrierefreie Einstellungen öffnen"
      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#0F4F68] bg-transparent px-5 py-2.5 font-semibold text-[#0F4F68] shadow-sm transition-colors hover:bg-[#0F4F68]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
    >
      Einstellung vornehmen
    </button>
  );
}
