"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { submitBetrieblichAngebotAnfrage } from "@/lib/actions/betrieblich-angebot-anfrage";
import { cn } from "@/lib/utils";

type AngebotCtx = { open: () => void };

const BetrieblichAngebotDialogContext = createContext<AngebotCtx | null>(null);

function useBetrieblichAngebotDialog() {
  const ctx = useContext(BetrieblichAngebotDialogContext);
  if (!ctx) throw new Error("BetrieblichAngebotDialogProvider fehlt");
  return ctx;
}

const BTN_ORANGE =
  "inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-semibold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2";

export function BetrieblichAngebotOpenButton({
  className,
  children = "Jetzt Angebot anfordern!",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { open } = useBetrieblichAngebotDialog();
  return (
    <button type="button" onClick={open} className={cn(BTN_ORANGE, className)}>
      {children}
    </button>
  );
}

/** Provider + Portal-Dialog; Kinder (z. B. Sektionen) bleiben Server Components. */
export function BetrieblichAngebotDialogProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const titelId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const isDatenschutzError = Boolean(error?.includes("Datenschutz"));

  useEffect(() => setMounted(true), []);

  const schliessen = useCallback(() => {
    setOpen(false);
    setSent(false);
    setError(null);
    setPending(false);
  }, []);

  const openDialog = useCallback(() => {
    setOpen(true);
    setSent(false);
    setError(null);
  }, []);

  const ctxValue = useMemo(() => ({ open: openDialog }), [openDialog]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") schliessen();
    };
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, schliessen]);

  useEffect(() => {
    if (!open || sent || !mounted) return;
    const id = window.requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open, sent, mounted]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setPending(true);
    try {
      const formData = new FormData(form);
      const result = await submitBetrieblichAngebotAnfrage(formData);
      if (result.success) {
        setSent(true);
        form.reset();
      } else if (result.error) {
        setError(result.error);
        if (result.error.includes("Datenschutz")) {
          const el = document.getElementById("betrieblich-angebot-datenschutz");
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          window.requestAnimationFrame(() => el?.focus());
        }
      }
    } catch {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setPending(false);
    }
  }

  const show = open && mounted && typeof document !== "undefined";

  return (
    <BetrieblichAngebotDialogContext.Provider value={ctxValue}>
      {children}
      {show &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" aria-hidden onClick={schliessen} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titelId}
              className="fixed left-1/2 top-1/2 z-[61] max-h-[min(92vh,44rem)] w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-2xl sm:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 id={titelId} className="text-lg font-extrabold text-[#0F4F68] sm:text-xl">
                  {sent ? "Vielen Dank" : "Angebot anfordern"}
                </h2>
                <button
                  type="button"
                  onClick={schliessen}
                  className="shrink-0 rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]"
                  aria-label="Dialog schließen"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {sent ? (
                <p className="mt-5 text-pretty text-neutral-700 leading-relaxed">
                  Ihre Anfrage wurde übermittelt. Wir melden uns bei Ihnen.
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-5 space-y-4"
                  noValidate
                  aria-label="Angebotsanfrage betriebliche Pflegeberatung"
                >
                  {error && !isDatenschutzError && (
                    <div
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                      {error}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="betrieblich-nachname" className="block text-sm font-medium text-neutral-700">
                        Name *
                      </label>
                      <input
                        ref={firstFieldRef}
                        id="betrieblich-nachname"
                        name="nachname"
                        type="text"
                        autoComplete="family-name"
                        disabled={pending}
                        className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
                        placeholder="Nachname"
                      />
                    </div>
                    <div>
                      <label htmlFor="betrieblich-vorname" className="block text-sm font-medium text-neutral-700">
                        Vorname *
                      </label>
                      <input
                        id="betrieblich-vorname"
                        name="vorname"
                        type="text"
                        autoComplete="given-name"
                        disabled={pending}
                        className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
                        placeholder="Vorname"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="betrieblich-firma" className="block text-sm font-medium text-neutral-700">
                      Firmenname (optional)
                    </label>
                    <input
                      id="betrieblich-firma"
                      name="firmenname"
                      type="text"
                      autoComplete="organization"
                      disabled={pending}
                      className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
                      placeholder="Unternehmen oder Einrichtung"
                    />
                  </div>

                  <div>
                    <label htmlFor="betrieblich-email" className="block text-sm font-medium text-neutral-700">
                      E-Mail *
                    </label>
                    <input
                      id="betrieblich-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      disabled={pending}
                      className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
                      placeholder="name@firma.de"
                    />
                  </div>

                  <div>
                    <label htmlFor="betrieblich-phone" className="block text-sm font-medium text-neutral-700">
                      Telefonnummer (optional)
                    </label>
                    <input
                      id="betrieblich-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      disabled={pending}
                      className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
                      placeholder="z. B. für Rückfragen"
                    />
                  </div>

                  <div>
                    <label htmlFor="betrieblich-ma" className="block text-sm font-medium text-neutral-700">
                      Mitarbeiteranzahl *
                    </label>
                    <input
                      id="betrieblich-ma"
                      name="mitarbeiteranzahl"
                      type="text"
                      inputMode="numeric"
                      disabled={pending}
                      className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
                      placeholder="z. B. 120 oder ca. 50–100"
                    />
                  </div>

                  <div>
                    <label htmlFor="betrieblich-bemerkung" className="block text-sm font-medium text-neutral-700">
                      Bemerkung (optional)
                    </label>
                    <textarea
                      id="betrieblich-bemerkung"
                      name="bemerkung"
                      rows={3}
                      disabled={pending}
                      className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
                      placeholder="Ihr Anliegen in wenigen Sätzen"
                    />
                  </div>

                  <input type="text" name="website" autoComplete="off" tabIndex={-1} className="sr-only" aria-hidden />

                  <div className="rounded-lg border border-[#0F4F68]/15 bg-[#F8FBFC] p-4">
                    <label className="flex cursor-pointer gap-3 text-sm leading-snug text-neutral-800">
                      <input
                        id="betrieblich-angebot-datenschutz"
                        type="checkbox"
                        name="datenschutz"
                        disabled={pending}
                        className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#0F4F68]/30 text-[#0F4F68] focus:ring-[#0F4F68]"
                      />
                      <span>
                        Ich habe die{" "}
                        <Link href="/datenschutz" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                          Datenschutzerklärung
                        </Link>{" "}
                        zur Kenntnis genommen. *
                      </span>
                    </label>
                    {error && isDatenschutzError && (
                      <p className="mt-2 text-sm font-medium text-red-600" role="alert">
                        {error}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="flex w-full min-h-12 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:opacity-60"
                  >
                    {pending ? "Wird gesendet…" : "Absenden"}
                  </button>
                </form>
              )}
            </div>
          </>,
          document.body,
        )}
    </BetrieblichAngebotDialogContext.Provider>
  );
}
