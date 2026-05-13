"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useState } from "react";
import { PartnerPasswordChangeForm } from "@/components/partner/PartnerPasswordChangeForm";
import { PARTNER_PASSWORD_PROMPT_SESSION_KEY } from "@/lib/partner/password-prompt-session";

type Props = {
  /** Vom Server: noch kein Passwortwechsel protokolliert und keine dauerhafte Unterdrückung. */
  shouldPrompt: boolean;
  /** true solange der Dialog den Rundgang blockieren soll (synchron vor erstem Tutorial-Paint). */
  onGateChange?: (blocked: boolean) => void;
};

/**
 * Erstlogin: ein einziges Pop-up mit direktem Passwortwechsel (aktuelles Passwort i. d. R. aus
 * der Anmeldung vorausgefüllt). Kein Zwischen-Schritt „Jetzt ändern?“.
 */
export function PartnerInitialPasswordPrompt({ shouldPrompt, onGateChange }: Props) {
  const headingId = useId();
  const descId = useId();
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (!shouldPrompt) {
      onGateChange?.(false);
      return;
    }
    try {
      if (window.sessionStorage.getItem(PARTNER_PASSWORD_PROMPT_SESSION_KEY)) {
        onGateChange?.(false);
        return;
      }
    } catch {
      onGateChange?.(false);
      return;
    }
    setOpen(true);
    onGateChange?.(true);
  }, [shouldPrompt, onGateChange]);

  const unlockTutorial = useCallback(() => {
    setOpen(false);
    onGateChange?.(false);
  }, [onGateChange]);

  const dismissSessionOnly = useCallback(() => {
    try {
      window.sessionStorage.setItem(PARTNER_PASSWORD_PROMPT_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    unlockTutorial();
  }, [unlockTutorial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismissSessionOnly();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismissSessionOnly]);

  function handleSkip() {
    dismissSessionOnly();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismissSessionOnly();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
        className="max-h-[min(92vh,40rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-[#0F4F68]/20 bg-white p-5 shadow-xl sm:max-w-lg sm:p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={headingId} className="text-lg font-bold text-[#0F4F68] sm:text-xl">
          Persönliches Passwort festlegen
        </h2>
        <p id={descId} className="mt-2 text-sm text-neutral-600">
          Sie haben sich mit dem Zugang aus der E-Mail angemeldet. Bitte wählen Sie jetzt ein eigenes Passwort. Das
          aktuelle Passwort ist vorausgefüllt — Sie müssen nur noch das neue Passwort eingeben.
        </p>

        <div className="mt-5">
          <PartnerPasswordChangeForm
            fieldIdPrefix="partner-initial-pw"
            submitButtonClassName="w-full rounded-xl bg-[#F78F2E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2 disabled:opacity-60"
            submitLabel="Passwort speichern"
          />
        </div>

        <div className="mt-5 border-t border-neutral-200 pt-4">
          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#0F4F68]/5"
          >
            Später erinnern
          </button>
        </div>
      </div>
    </div>
  );
}
