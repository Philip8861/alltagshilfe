"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AHS_READABILITY_TOGGLE_PANEL_EVENT,
  AHS_READABILITY_UPDATED_EVENT,
  READABILITY_ZOOM_STORAGE_KEY,
} from "@/lib/readability-constants";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";

function clampZoom(value: number) {
  return Math.min(150, Math.max(90, value));
}

function readZoomFromStorage(): number {
  if (typeof window === "undefined") return 100;
  try {
    const raw = window.localStorage.getItem(READABILITY_ZOOM_STORAGE_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 100;
    return Number.isFinite(n) ? clampZoom(n) : 100;
  } catch {
    return 100;
  }
}

function shouldHideLauncher(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/partner") ||
    pathname.startsWith("/en/partner") ||
    isPflegeboxKonfiguratorPagePath(pathname) ||
    pathname === "/pflegeberatung" ||
    pathname === "/karriere" ||
    pathname.startsWith("/karriere/") ||
    pathname === "/kooperation"
  );
}

/** Weiße Lupe + Zoom-Prozent in der blauen Header-Leiste; öffnet die barrierefreien Einstellungen. */
export function ReadabilityHeaderLauncher() {
  const pathname = usePathname();
  const [zoomLevel, setZoomLevel] = useState(100);

  const sync = useCallback(() => {
    setZoomLevel(readZoomFromStorage());
  }, []);

  useEffect(() => {
    sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === READABILITY_ZOOM_STORAGE_KEY || e.key === null) sync();
    };
    const onUpdated = (e: Event) => {
      const z = (e as CustomEvent<{ zoomLevel?: number }>).detail?.zoomLevel;
      if (typeof z === "number" && Number.isFinite(z)) {
        setZoomLevel(clampZoom(z));
      } else {
        sync();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(AHS_READABILITY_UPDATED_EVENT, onUpdated as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(AHS_READABILITY_UPDATED_EVENT, onUpdated as EventListener);
    };
  }, [sync]);

  if (shouldHideLauncher(pathname)) return null;

  const en = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new Event(AHS_READABILITY_TOGGLE_PANEL_EVENT));
      }}
      aria-haspopup="dialog"
      aria-label={
        en
          ? `Open accessibility settings. Current text size: ${zoomLevel} percent.`
          : `Barrierefreie Einstellungen öffnen. Aktuelle Schriftgröße: ${zoomLevel} Prozent.`
      }
      className="inline-flex shrink-0 flex-col items-stretch gap-0 rounded-md border border-white/50 bg-white/[0.06] px-2 py-0 text-white shadow-sm transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F4F68] sm:px-2.5"
    >
      <span className="-mb-1 inline-flex items-center gap-0.5 leading-none" aria-hidden>
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center sm:h-6 sm:w-6">
          <svg
            className="h-4 w-4 shrink-0 sm:h-[0.95rem] sm:w-[0.95rem]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 21l-4.35-4.35" />
            <circle cx="11" cy="11" r="7" />
          </svg>
        </span>
        <span className="text-xs font-extrabold tabular-nums tracking-wide leading-none sm:text-[0.8125rem]">{zoomLevel}%</span>
      </span>
      <span className="-mt-0.5 max-w-[10rem] text-left text-[0.625rem] font-semibold leading-none text-white/95 sm:max-w-[11rem] sm:text-[0.6875rem]">
        {en ? "Accessible homepage" : "Barrierefreie Homepage"}
      </span>
    </button>
  );
}
