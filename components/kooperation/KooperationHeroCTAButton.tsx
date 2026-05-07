"use client";

import type { ReactNode } from "react";

/** Event-Name, auf den `KooperationspartnerBereiche` lauscht und das Modal allgemein öffnet. */
export const KOOP_OPEN_ANFRAGE_EVENT = "koop-anfrage-allgemein" as const;

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * Hero-CTA „Jetzt Kooperationspartner werden“: dispatcht ein Custom Event,
 * damit `KooperationspartnerBereiche` das gemeinsame Modal mit einer
 * allgemeinen Anfrage öffnet (statt nur zu einem Anker zu scrollen).
 */
export function KooperationHeroCTAButton({ className = "", children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent(KOOP_OPEN_ANFRAGE_EVENT));
      }}
    >
      {children}
    </button>
  );
}
