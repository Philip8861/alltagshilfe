"use client";

import { useEffect, useState } from "react";

const storageKey = (tipId: string) => `partner_tip_note_read_v1:${tipId}`;

type Props = {
  tipId: string;
  note: string;
};

/**
 * Notiz mit lokalem „gelesen“-Status: nach Öffnen verschwindet der Hinweis.
 */
export function PartnerNoteDetails({ tipId, note }: Props) {
  const [read, setRead] = useState(false);

  useEffect(() => {
    const syncRead = () => {
      try { setRead(Boolean(window.localStorage.getItem(storageKey(tipId)))); }
      catch { /* Browser-Speicher ist optional. */ }
    };
    syncRead();
    window.addEventListener("partner-note-read", syncRead);
    window.addEventListener("storage", syncRead);
    return () => {
      window.removeEventListener("partner-note-read", syncRead);
      window.removeEventListener("storage", syncRead);
    };
  }, [tipId]);

  const markRead = () => {
    try {
      window.localStorage.setItem(storageKey(tipId), "1");
      window.dispatchEvent(new Event("partner-note-read"));
    } catch {
      /* ignore */
    }
    setRead(true);
  };

  const trimmed = note.trim();
  if (!trimmed) {
    return <span className="text-neutral-300">—</span>;
  }

  return (
    <details
      className="text-sm"
      onToggle={(e) => {
        if (e.currentTarget.open) markRead();
      }}
    >
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center font-medium text-[#0F4F68] hover:underline [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          {!read ? (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold leading-none text-amber-900 ring-1 ring-amber-200"
              aria-hidden
            >
              !
            </span>
          ) : null}
          <span>Notiz lesen</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </summary>
      <p className="mt-2 whitespace-pre-wrap text-neutral-700">{trimmed}</p>
    </details>
  );
}
