"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { isAlltagshelferJobTitle } from "@/lib/karriere-job-map";
import { cn } from "@/lib/utils";

type BewerbungPlzVorabDialogProps = {
  jobTitle: string;
  onDismiss: () => void;
  onAlltagshelferContinue: (plz: string, jobTitle: string) => void;
  /** Schließt den Dialog und scrollt zum Bewerbungsformular (Initiativweg). */
  onInitiativScrollToForm: () => void;
};

export function BewerbungPlzVorabDialog({
  jobTitle,
  onDismiss,
  onAlltagshelferContinue,
  onInitiativScrollToForm,
}: BewerbungPlzVorabDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const plzInputId = useId();
  const errorId = useId();

  const [phase, setPhase] = useState<"plz" | "initiativ">("plz");
  const [plz, setPlz] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (!el.open) {
      el.showModal();
    }
    const onClose = () => onDismiss();
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [onDismiss]);

  const normalizedPlz = plz.replace(/\D/g, "").slice(0, 5);
  const alltagshelfer = isAlltagshelferJobTitle(jobTitle);

  const handleWeiter = useCallback(() => {
    setError(null);
    if (normalizedPlz.length !== 5) {
      setError("Bitte geben Sie eine Postleitzahl mit genau fünf Ziffern ein.");
      return;
    }
    if (alltagshelfer) {
      onAlltagshelferContinue(normalizedPlz, jobTitle);
      return;
    }
    setPhase("initiativ");
  }, [alltagshelfer, jobTitle, normalizedPlz, onAlltagshelferContinue]);

  const onPlzKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleWeiter();
      }
    },
    [handleWeiter],
  );

  const handleDialogClick = useCallback((e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleDialogClick}
      className={cn(
        "fixed inset-0 z-[115] m-0 max-h-none w-full max-w-none border-0 bg-transparent p-3 sm:p-5 md:p-8",
        "open:flex open:min-h-dvh open:items-center open:justify-center",
        "[&::backdrop]:bg-[#0F4F68]/45 [&::backdrop]:backdrop-blur-[2px]",
      )}
    >
      <div
        className={cn(
          "relative flex min-w-0 max-h-[min(88dvh,calc(100dvh-2.5rem))] w-full max-w-[min(36rem,calc(100dvw-1.25rem))] flex-col self-center overflow-hidden rounded-3xl border-2 border-[#0F4F68]/15 bg-white shadow-[0_25px_80px_-12px_rgba(15,79,104,0.35)] sm:max-w-[min(40rem,calc(100dvw-2rem))]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F4F68]/10 bg-gradient-to-r from-[#FFF7ED] via-[#F2F9FA] to-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 pr-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F78F2E] sm:text-xs">Bewerbung</p>
            <h2
              id={titleId}
              className="mt-1 text-balance text-lg font-bold leading-snug text-[#0F4F68] sm:text-xl sm:leading-snug"
            >
              {phase === "plz" ? "Kurz vorweg" : "Initiativbewerbung"}
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl border border-[#0F4F68]/10 bg-white/90 px-3 py-2 text-xs font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:px-4 sm:text-sm"
            onClick={() => dialogRef.current?.close()}
          >
            Abbrechen
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-7">
          {phase === "plz" ? (
            <>
              <p className="text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
                Bevor der Bewerbungsweg beginnt, möchten wir Sie kurz nach Ihrer Postleitzahl fragen. So können wir
                prüfen, ob diese Stelle in Ihrer Region derzeit vergeben wird, und Ihre Angaben gleich dem passenden
                Team zuordnen.
              </p>
              {alltagshelfer ? (
                <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
                  Als Alltagshelferin oder Alltagshelfer sind wir für Sie an allen unseren Standorten aktiv.
                </p>
              ) : null}
              <div className="mt-6">
                <label htmlFor={plzInputId} className="block text-sm font-semibold text-[#0F4F68]">
                  Ihre Postleitzahl
                </label>
                <input
                  id={plzInputId}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  value={plz}
                  onChange={(e) => {
                    setPlz(e.target.value.replace(/\D/g, "").slice(0, 5));
                    setError(null);
                  }}
                  onKeyDown={onPlzKeyDown}
                  maxLength={5}
                  className="mt-2 w-full max-w-[12rem] rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base text-neutral-900 shadow-sm outline-none transition focus:border-[#0F4F68] focus:ring-2 focus:ring-[#0F4F68]/25"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                />
                {error ? (
                  <p id={errorId} className="mt-2 text-sm font-medium text-red-600" role="alert">
                    {error}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-neutral-500 sm:text-sm">Bitte genau fünf Ziffern eingeben.</p>
                )}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:flex-none sm:min-w-[10rem]"
                  onClick={handleWeiter}
                >
                  Weiter
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
                Vielen Dank für Ihre Angabe. Für die von Ihnen ausgewählte Stelle nehmen wir in Ihrer Region aktuell
                keine planbaren Einstellungen vor. Das kann sich ändern. Gerne freuen wir uns trotzdem über eine
                Initiativbewerbung.
              </p>
              <p className="mt-5 text-pretty text-sm leading-relaxed text-neutral-800 sm:text-base">
                Nicht jede starke Zusammenarbeit beginnt mit einer perfekt passenden Stellenanzeige. Oft entsteht etwas
                Besonderes ganz unerwartet.
              </p>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-800 sm:text-base">
                Wenn Sie glauben, dass Sie gut zu uns passen und unser Team verstärken können, dann erzählen Sie uns
                mehr über sich.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-[#ea8328] focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/30 focus:ring-offset-2 sm:flex-none sm:min-w-[14rem]"
                  onClick={() => onInitiativScrollToForm()}
                >
                  Jetzt initiativ bewerben
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-[#0F4F68]/20 bg-white px-4 py-3 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                  onClick={() => {
                    setPhase("plz");
                    setError(null);
                  }}
                >
                  Postleitzahl ändern
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
