"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { PartnerSupportForm } from "@/components/partner/PartnerSupportForm";
import { PARTNER_SUPPORT_CONTACT_NAME } from "@/lib/partner/partner-support-contact";

/** Globales Event, um den Support-Dialog von überall im Portal zu öffnen. */
export const PARTNER_SUPPORT_OPEN_EVENT = "partner-open-support";

export function openPartnerSupportDialog() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(PARTNER_SUPPORT_OPEN_EVENT));
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Pop-up „Ihr Anliegen an Franz Dirscherl“: wird per Button im Portal-Header oder
 * über {@link openPartnerSupportDialog} geöffnet. ESC und Klick auf den Hintergrund schließen.
 */
export function PartnerSupportModal() {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener && document.contains(opener)) opener.focus();
  }, []);

  useEffect(() => {
    const onOpen = () => {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener(PARTNER_SUPPORT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(PARTNER_SUPPORT_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("select, textarea, input, button")?.focus();
    }, 30);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="notranslate fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-neutral-900/45 backdrop-blur-[3px]"
        aria-label="Dialog schließen"
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 flex max-h-[min(92dvh,760px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-neutral-200/90 bg-white shadow-[0_-12px_48px_rgba(15,79,104,0.14),0_25px_50px_-12px_rgba(0,0,0,0.2)] sm:max-h-[min(88vh,760px)] sm:rounded-2xl sm:shadow-2xl"
      >
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]/40" aria-hidden />

        <header className="shrink-0 border-b border-neutral-100 bg-gradient-to-b from-[#f6fafc] to-white px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] text-sm font-bold tracking-wide text-white shadow-[0_6px_16px_-6px_rgba(15,79,104,0.6)] ring-4 ring-[#e3f1f5]"
                aria-hidden
              >
                {initialsOf(PARTNER_SUPPORT_CONTACT_NAME)}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5a7c89]">Hilfe &amp; Kontakt</p>
                <h2 id={titleId} className="mt-0.5 text-xl font-semibold tracking-tight text-[#0F4F68]">
                  Ihr Anliegen an {PARTNER_SUPPORT_CONTACT_NAME}
                </h2>
                <p id={descId} className="mt-1 text-sm leading-relaxed text-neutral-600">
                  Ihr persönlicher Ansprechpartner im Partnerprogramm. Die Nachricht geht direkt an ihn.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]"
              aria-label="Schließen (Esc)"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <PartnerSupportForm compact onDone={close} />
        </div>
      </div>
    </div>
  );
}

/** Auslöser im Portal-Header. */
export function PartnerSupportHeaderButton() {
  return (
    <button
      type="button"
      onClick={openPartnerSupportDialog}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#cfe1e8] bg-white px-3.5 text-xs font-semibold text-[#0F4F68] shadow-sm transition hover:border-[#0F4F68]/40 hover:bg-[#f2f8fa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" />
      </svg>
      <span>Hilfe &amp; Kontakt</span>
    </button>
  );
}
