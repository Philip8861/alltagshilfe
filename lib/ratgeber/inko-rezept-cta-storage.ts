"use client";

import { useCallback, useEffect, useState } from "react";

import { INKO_REZEPT_CTA_STORAGE_KEYS } from "@/lib/ratgeber/inko-rezept-cta-config";

export function hasSessionFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function setSessionFlag(key: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export function hasInkoCtaClickedThisSession(): boolean {
  return hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.ctaClickedSession);
}

export function markInkoCtaClickedThisSession(): void {
  setSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.ctaClickedSession);
}

/** Gate für 30s-Popup: Session-Klicks, Hydration-sicher. */
export function useInkoRezeptCtaGate() {
  const [hydrated, setHydrated] = useState(false);
  const [ctaClicked, setCtaClicked] = useState(false);

  useEffect(() => {
    setCtaClicked(hasInkoCtaClickedThisSession());
    setHydrated(true);
  }, []);

  const markClicked = useCallback(() => {
    markInkoCtaClickedThisSession();
    setCtaClicked(true);
  }, []);

  return {
    hydrated,
    ctaClicked,
    markClicked,
  };
}
