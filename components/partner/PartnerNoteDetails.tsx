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
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(storageKey(tipId))) {
        setRead(true);
      }
    } catch {
      /* private mode etc. */
    }
  }, [tipId]);

  const markRead = () => {
    try {
      window.localStorage.setItem(storageKey(tipId), "1");
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
      <summary className="cursor-pointer list-none font-medium text-[#0F4F68] hover:underline [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          {!read ? (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black leading-none text-amber-950 shadow-[0_0_14px_rgba(251,191,36,0.95)] ring-2 ring-amber-200/80 motion-safe:animate-pulse"
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
