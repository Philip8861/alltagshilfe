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
import {
  getBetrieblichInfoAvailability,
  submitBetrieblichInfoTermin,
} from "@/lib/actions/betrieblich-info-termin";
import {
  BETRIEBLICH_INFO_COMPANY_SIZES,
  BETRIEBLICH_INFO_CONTACT,
  SLOT_TIMES,
  WEEKDAY_HEADERS_DE,
  addMonths,
  calendarCellsForMonth,
  earliestBookableYmd,
  formatDateLongDe,
  isBookableDate,
  latestBookableYmd,
  monthLabelDe,
  ymdToYearMonth,
} from "@/lib/betrieblich-info-termin/slots";
import { cn } from "@/lib/utils";

type DialogCtx = { open: () => void };

const BetrieblichInfoTerminDialogContext = createContext<DialogCtx | null>(null);

function useBetrieblichInfoTerminDialog() {
  const ctx = useContext(BetrieblichInfoTerminDialogContext);
  if (!ctx) throw new Error("BetrieblichInfoTerminDialogProvider fehlt");
  return ctx;
}

const BTN_ORANGE =
  "inline-flex min-h-[48px] flex-col items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-center text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2";

const FIELD =
  "mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] disabled:opacity-50";

export function BetrieblichInfoTerminOpenButton({
  className,
}: {
  className?: string;
}) {
  const { open } = useBetrieblichInfoTerminDialog();
  return (
    <button type="button" onClick={open} className={cn(BTN_ORANGE, className)}>
      <span className="text-base font-semibold leading-tight sm:text-lg">15-Min. Infogespräch buchen</span>
      <span className="mt-0.5 text-xs font-medium leading-snug text-white/90 sm:text-sm">
        Kostenlos &amp; 100% unverbindlich
      </span>
    </button>
  );
}

export function BetrieblichInfoTerminDialogProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [booked, setBooked] = useState<Record<string, string[]>>({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(earliestBookableYmd);
  const [selectedTime, setSelectedTime] = useState("");
  const initialMonth = ymdToYearMonth(earliestBookableYmd());
  const [viewYear, setViewYear] = useState(initialMonth.year);
  const [viewMonth, setViewMonth] = useState(initialMonth.month);

  const titelId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const resetBookingState = useCallback(() => {
    const earliest = earliestBookableYmd();
    const { year, month } = ymdToYearMonth(earliest);
    setSelectedDate(earliest);
    setSelectedTime("");
    setViewYear(year);
    setViewMonth(month);
    setSent(false);
    setError(null);
    setPending(false);
    setSlotsError(null);
  }, []);

  const schliessen = useCallback(() => {
    setOpen(false);
    resetBookingState();
  }, [resetBookingState]);

  const openDialog = useCallback(() => {
    resetBookingState();
    setOpen(true);
  }, [resetBookingState]);

  const ctxValue = useMemo(() => ({ open: openDialog }), [openDialog]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setSlotsLoading(true);
    void getBetrieblichInfoAvailability()
      .then((res) => {
        if (cancelled) return;
        if (!res.success) {
          setSlotsError(res.error);
          return;
        }
        setBooked(res.data.booked);
        if (!isBookableDate(selectedDate) || selectedDate < res.data.earliest) {
          setSelectedDate(res.data.earliest);
          const ym = ymdToYearMonth(res.data.earliest);
          setViewYear(ym.year);
          setViewMonth(ym.month);
        }
      })
      .catch(() => {
        if (!cancelled) setSlotsError("Die verfügbaren Termine konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Nur beim Öffnen neu laden – selectedDate absichtlich nicht in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        schliessen();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const nodes = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.tabIndex !== -1 && !el.closest("[aria-hidden='true']"));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, sent, schliessen]);

  useEffect(() => {
    if (!open || !mounted) return;
    const id = window.requestAnimationFrame(() => {
      if (sent) closeBtnRef.current?.focus();
      else closeBtnRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, sent, mounted]);

  const earliest = earliestBookableYmd();
  const latest = latestBookableYmd();
  const minMonth = ymdToYearMonth(earliest);
  const maxMonth = ymdToYearMonth(latest);
  const canPrevMonth = viewYear > minMonth.year || (viewYear === minMonth.year && viewMonth > minMonth.month);
  const canNextMonth = viewYear < maxMonth.year || (viewYear === maxMonth.year && viewMonth < maxMonth.month);

  const bookedForDay = booked[selectedDate] ?? [];
  const cells = calendarCellsForMonth(viewYear, viewMonth);

  function goMonth(delta: number) {
    const next = addMonths(viewYear, viewMonth, delta);
    setViewYear(next.year);
    setViewMonth(next.month);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    if (!selectedDate || !selectedTime) {
      setError("Bitte wählen Sie Datum und Uhrzeit.");
      return;
    }
    setPending(true);
    try {
      const formData = new FormData(form);
      formData.set("slotDate", selectedDate);
      formData.set("slotTime", selectedTime);
      const result = await submitBetrieblichInfoTermin(formData);
      if (result.success) {
        setSent(true);
        form.reset();
      } else {
        setError(result.error);
        if (result.taken) {
          setBooked((prev) => {
            const next = { ...prev };
            const times = new Set(next[selectedDate] ?? []);
            times.add(selectedTime);
            next[selectedDate] = [...times];
            return next;
          });
          setSelectedTime("");
        }
        if (result.error.includes("Datenschutz")) {
          const el = document.getElementById("betrieblich-info-datenschutz");
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
  const isDatenschutzError = Boolean(error?.includes("Datenschutz"));

  return (
    <BetrieblichInfoTerminDialogContext.Provider value={ctxValue}>
      {children}
      {show &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" aria-hidden onClick={schliessen} />
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titelId}
              className="fixed left-1/2 top-1/2 z-[61] max-h-[min(94vh,52rem)] w-[calc(100%-1rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[#0F4F68]/15 bg-white p-4 shadow-2xl sm:w-[calc(100%-1.5rem)] sm:p-6 md:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 id={titelId} className="text-lg font-extrabold text-[#0F4F68] sm:text-xl">
                  {sent ? "Vielen Dank! Ihr Termin ist gebucht." : "15-Minuten-Infogespräch buchen"}
                </h2>
                <button
                  ref={closeBtnRef}
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
                <div className="mt-5 space-y-5">
                  <p className="text-pretty leading-relaxed text-neutral-700">
                    Wir freuen uns sehr auf den gemeinsamen Austausch mit Ihnen! Eine Bestätigung mit dem Einwahllink
                    wurde soeben an Ihre E-Mail-Adresse gesendet.
                  </p>
                  <div className="rounded-xl border border-[#0F4F68]/15 bg-[#F8FBFC] px-4 py-4 text-sm leading-relaxed text-[#0F4F68]">
                    <p className="font-extrabold">Betriebliche Pflegeberatung</p>
                    <p className="mt-2">
                      Telefon:{" "}
                      <a
                        href={BETRIEBLICH_INFO_CONTACT.phoneHref}
                        className="font-semibold underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]"
                      >
                        {BETRIEBLICH_INFO_CONTACT.phone}
                      </a>
                    </p>
                    <p>
                      E-Mail:{" "}
                      <a
                        href={`mailto:${BETRIEBLICH_INFO_CONTACT.email}`}
                        className="font-semibold underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]"
                      >
                        {BETRIEBLICH_INFO_CONTACT.email}
                      </a>
                    </p>
                    <p className="mt-3 italic text-[#0F4F68]/80">
                      Falls vorab Fragen entstehen oder Sie den Termin verschieben müssen, erreichen Sie uns jederzeit
                      unter diesen Kontaktdaten.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4" noValidate aria-label="Infogespräch buchen">
                  {error && !isDatenschutzError && (
                    <div
                      role="alert"
                      className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                      {error}
                    </div>
                  )}
                  {slotsError && (
                    <div
                      role="alert"
                      className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                    >
                      {slotsError}
                    </div>
                  )}

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="min-w-0 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-[#0F4F68]">Termin- und Zeitauswahl</p>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                          Buchbar ab dem nächsten Werktag, montags bis freitags, 09:00–16:30 Uhr (15-Minuten-Takt).
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#0F4F68]/15 p-3 sm:p-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => goMonth(-1)}
                            disabled={!canPrevMonth || pending}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-[#0F4F68]/10 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] disabled:opacity-40"
                            aria-label="Vorheriger Monat"
                          >
                            ‹
                          </button>
                          <p className="text-sm font-extrabold text-[#0F4F68]" aria-live="polite">
                            {monthLabelDe(viewYear, viewMonth)}
                          </p>
                          <button
                            type="button"
                            onClick={() => goMonth(1)}
                            disabled={!canNextMonth || pending}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-[#0F4F68]/10 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] disabled:opacity-40"
                            aria-label="Nächster Monat"
                          >
                            ›
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[0.7rem] font-semibold uppercase tracking-wide text-neutral-500">
                          {WEEKDAY_HEADERS_DE.map((d) => (
                            <span key={d}>{d}</span>
                          ))}
                        </div>
                        <div className="mt-1 grid grid-cols-7 gap-1">
                          {cells.map((ymd, idx) => {
                            if (!ymd) return <span key={`e-${idx}`} />;
                            const bookable = isBookableDate(ymd);
                            const selected = ymd === selectedDate;
                            const dayNum = Number(ymd.slice(8, 10));
                            return (
                              <button
                                key={ymd}
                                type="button"
                                disabled={!bookable || pending}
                                onClick={() => {
                                  setSelectedDate(ymd);
                                  setSelectedTime("");
                                }}
                                aria-pressed={selected}
                                aria-label={`${formatDateLongDe(ymd)}${bookable ? "" : ", nicht buchbar"}`}
                                className={cn(
                                  "min-h-10 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F4F68]",
                                  selected && "bg-[#F78F2E] text-white",
                                  !selected && bookable && "text-[#0F4F68] hover:bg-[#0F4F68]/10",
                                  !selected && !bookable && "cursor-not-allowed text-neutral-300",
                                )}
                              >
                                {dayNum}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#0F4F68]">
                          Uhrzeit{" "}
                          {selectedDate ? (
                            <span className="font-medium text-neutral-600">· {formatDateLongDe(selectedDate)}</span>
                          ) : null}
                        </p>
                        {slotsLoading ? (
                          <p className="mt-2 text-sm text-neutral-600">Verfügbare Zeiten werden geladen…</p>
                        ) : (
                          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {SLOT_TIMES.map((time) => {
                              const taken = bookedForDay.includes(time);
                              const selected = selectedTime === time;
                              return (
                                <button
                                  key={time}
                                  type="button"
                                  disabled={taken || pending || !selectedDate}
                                  onClick={() => setSelectedTime(time)}
                                  aria-pressed={selected}
                                  className={cn(
                                    "min-h-11 rounded-lg border px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F4F68]",
                                    selected && "border-[#F78F2E] bg-[#F78F2E] text-white",
                                    !selected &&
                                      !taken &&
                                      "border-[#0F4F68]/20 text-[#0F4F68] hover:border-[#0F4F68] hover:bg-[#0F4F68]/5",
                                    taken && "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400 line-through",
                                  )}
                                >
                                  {time}
                                  <span className="sr-only">{taken ? ", bereits belegt" : ""}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 space-y-4">
                      <p className="text-sm font-semibold text-[#0F4F68]">Ihre Angaben</p>
                      <div>
                        <label htmlFor="betrieblich-info-name" className="block text-sm font-medium text-neutral-700">
                          Vollständiger Name *
                        </label>
                        <input
                          ref={nameRef}
                          id="betrieblich-info-name"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          disabled={pending}
                          className={FIELD}
                          placeholder="Vorname und Nachname"
                        />
                      </div>
                      <div>
                        <label htmlFor="betrieblich-info-email" className="block text-sm font-medium text-neutral-700">
                          E-Mail-Adresse *
                        </label>
                        <input
                          id="betrieblich-info-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          disabled={pending}
                          className={FIELD}
                          placeholder="name@firma.de"
                        />
                      </div>
                      <div>
                        <label htmlFor="betrieblich-info-firma" className="block text-sm font-medium text-neutral-700">
                          Firmenname *
                        </label>
                        <input
                          id="betrieblich-info-firma"
                          name="companyName"
                          type="text"
                          autoComplete="organization"
                          disabled={pending}
                          className={FIELD}
                          placeholder="Unternehmen"
                        />
                      </div>
                      <div>
                        <label htmlFor="betrieblich-info-size" className="block text-sm font-medium text-neutral-700">
                          Firmengröße *
                        </label>
                        <select
                          id="betrieblich-info-size"
                          name="companySize"
                          disabled={pending}
                          defaultValue=""
                          className={FIELD}
                        >
                          <option value="" disabled>
                            Bitte auswählen
                          </option>
                          {BETRIEBLICH_INFO_COMPANY_SIZES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <input type="hidden" name="slotDate" value={selectedDate} />
                      <input type="hidden" name="slotTime" value={selectedTime} />
                      <input type="text" name="website" autoComplete="off" tabIndex={-1} className="sr-only" aria-hidden />

                      <div className="rounded-lg border border-[#0F4F68]/15 bg-[#F8FBFC] p-4">
                        <label className="flex cursor-pointer gap-3 text-sm leading-snug text-neutral-800">
                          <input
                            id="betrieblich-info-datenschutz"
                            type="checkbox"
                            name="datenschutz"
                            disabled={pending}
                            className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#0F4F68]/30 text-[#0F4F68] focus:ring-[#0F4F68]"
                          />
                          <span>
                            Mit der Buchung stimmen Sie unserer{" "}
                            <Link
                              href="/datenschutz"
                              className="font-semibold text-[#0F4F68] underline underline-offset-2"
                            >
                              Datenschutzerklärung
                            </Link>{" "}
                            zu. *
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
                        disabled={pending || slotsLoading}
                        className="flex w-full min-h-12 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:opacity-60"
                      >
                        {pending ? "Wird gebucht…" : "Termin jetzt verbindlich buchen"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </>,
          document.body,
        )}
    </BetrieblichInfoTerminDialogContext.Provider>
  );
}
