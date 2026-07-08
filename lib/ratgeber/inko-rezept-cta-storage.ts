"use client";

import { useCallback, useEffect, useState } from "react";

import {
  INKO_REZEPT_CTA_DISMISS_DAYS,
  INKO_REZEPT_CTA_STORAGE_KEYS,
} from "@/lib/ratgeber/inko-rezept-cta-config";

function addDaysToNow(days: number): number {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export function isStorageDismissed(key: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const until = Number(raw);
    if (Number.isNaN(until)) return false;
    return Date.now() < until;
  } catch {
    return false;
  }
}

export function setStorageDismissed(key: string, days: number = INKO_REZEPT_CTA_DISMISS_DAYS): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, String(addDaysToNow(days)));
  } catch {
    /* quota / private mode */
  }
}

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

/** Gate für Popups: Dismiss-Status, Session-Klicks, Hydration-sicher. */
export function useInkoRezeptCtaGate() {
  const [hydrated, setHydrated] = useState(false);
  const [ctaClicked, setCtaClicked] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(true);
  const [exitDismissed, setExitDismissed] = useState(true);

  useEffect(() => {
    setCtaClicked(hasInkoCtaClickedThisSession());
    setPopupDismissed(isStorageDismissed(INKO_REZEPT_CTA_STORAGE_KEYS.popupDismissedUntil));
    setExitDismissed(isStorageDismissed(INKO_REZEPT_CTA_STORAGE_KEYS.exitDismissedUntil));
    setHydrated(true);
  }, []);

  const markClicked = useCallback(() => {
    markInkoCtaClickedThisSession();
    setCtaClicked(true);
  }, []);

  const dismissPopup = useCallback(() => {
    setStorageDismissed(INKO_REZEPT_CTA_STORAGE_KEYS.popupDismissedUntil);
    setPopupDismissed(true);
  }, []);

  const dismissExit = useCallback(() => {
    setStorageDismissed(INKO_REZEPT_CTA_STORAGE_KEYS.exitDismissedUntil);
    setExitDismissed(true);
  }, []);

  return {
    hydrated,
    ctaClicked,
    popupDismissed,
    exitDismissed,
    markClicked,
    dismissPopup,
    dismissExit,
  };
}
