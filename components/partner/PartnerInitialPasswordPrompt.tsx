"use client";

import { useCallback, useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPartnerPasswordPromptSuppressAction } from "@/lib/actions/partner-password-prompt";
import { PARTNER_PASSWORD_PROMPT_SESSION_KEY } from "@/lib/partner/password-prompt-session";

type Props = {
  /** Vom Server: noch kein Passwortwechsel protokolliert und keine dauerhafte Unterdrückung. */
  shouldPrompt: boolean;
};

export function PartnerInitialPasswordPrompt({ shouldPrompt }: Props) {
  const router = useRouter();
  const headingId = useId();
  const descId = useId();
  const checkboxId = useId();
  const [open, setOpen] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!shouldPrompt) return;
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(PARTNER_PASSWORD_PROMPT_SESSION_KEY)) return;
    } catch {
      return;
    }
    setOpen(true);
  }, [shouldPrompt]);

  const dismissSessionOnly = useCallback(() => {
    try {
      window.sessionStorage.setItem(PARTNER_PASSWORD_PROMPT_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
    setError(null);
  }, []);

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

  function handleYes() {
    try {
      window.sessionStorage.setItem(PARTNER_PASSWORD_PROMPT_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
    setError(null);
    router.push("/partner/einstellungen/passwort");
  }

  function handleNo() {
    setError(null);
    if (dontAskAgain) {
      startTransition(async () => {
        const res = await setPartnerPasswordPromptSuppressAction(true);
        if (!res.ok) {
          setError(res.message);
          return;
        }
        setOpen(false);
        router.refresh();
      });
      return;
    }
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
        className="w-full max-w-md rounded-2xl border border-[#0F4F68]/20 bg-white p-5 shadow-xl sm:p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id={headingId} className="text-lg font-bold text-[#0F4F68] sm:text-xl">
          Passwort jetzt ändern?
        </h2>
        <p id={descId} className="mt-2 text-sm text-neutral-600">
          Sie haben Ihr Passwort seit der Einrichtung noch nicht selbst geändert. Aus Sicherheitsgründen empfehlen wir,
          jetzt ein eigenes Passwort festzulegen.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-neutral-200 bg-[#F2F9FA]/60 px-3 py-3">
          <input
            id={checkboxId}
            type="checkbox"
            checked={dontAskAgain}
            onChange={(e) => setDontAskAgain(e.target.checked)}
            disabled={pending}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
          />
          <label htmlFor={checkboxId} className="text-sm text-neutral-700">
            Nicht mehr nachfragen (nur unter Einstellungen wieder möglich)
          </label>
        </div>

        {error ? (
          <p className="mt-3 text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={handleNo}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#0F4F68]/5 disabled:opacity-60 sm:w-auto"
          >
            {pending && dontAskAgain ? "Speichern…" : "Nein"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={handleYes}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60 sm:w-auto"
          >
            Ja, Passwort ändern
          </button>
        </div>
      </div>
    </div>
  );
}
