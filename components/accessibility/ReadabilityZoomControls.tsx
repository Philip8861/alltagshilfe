"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY_LEVEL = "ahs_readability_zoom_level";
const STORAGE_KEY_PROMPT_SEEN = "ahs_readability_zoom_prompt_seen";
const MIN_ZOOM = 90;
const MAX_ZOOM = 130;
const STEP = 5;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function applyZoom(level: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.fontSize = `${level}%`;
}

export function ReadabilityZoomControls() {
  const pathname = usePathname();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const storedLevel = window.localStorage.getItem(STORAGE_KEY_LEVEL);
    const parsed = storedLevel ? Number.parseInt(storedLevel, 10) : 100;
    const nextLevel = Number.isFinite(parsed) ? clampZoom(parsed) : 100;
    setZoomLevel(nextLevel);
    applyZoom(nextLevel);

    const promptSeen = window.localStorage.getItem(STORAGE_KEY_PROMPT_SEEN) === "1";
    if (!promptSeen && pathname === "/") {
      setShowPrompt(true);
    }
  }, [pathname]);

  const updateZoom = (next: number) => {
    const level = clampZoom(next);
    setZoomLevel(level);
    applyZoom(level);
    window.localStorage.setItem(STORAGE_KEY_LEVEL, String(level));
  };

  const markPromptSeen = () => {
    window.localStorage.setItem(STORAGE_KEY_PROMPT_SEEN, "1");
    setShowPrompt(false);
  };

  const increase = () => updateZoom(zoomLevel + STEP);
  const decrease = () => updateZoom(zoomLevel - STEP);
  const reset = () => updateZoom(100);

  return (
    <>
      {showPrompt && (
        <div className="fixed right-4 bottom-28 z-[95] w-[min(92vw,22rem)] rounded-2xl border border-[#0F4F68]/25 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,79,104,0.18)] backdrop-blur">
          <p className="text-sm font-semibold text-[#0F4F68]">Möchten Sie die Seite größer anzeigen?</p>
          <p className="mt-1 text-xs text-neutral-600">
            Für bessere Lesbarkeit können Sie die Ansicht mit einem Klick vergrößern.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                updateZoom(115);
                markPromptSeen();
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F78F2E] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#e57f1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              Ja, größer anzeigen
            </button>
            <button
              type="button"
              onClick={markPromptSeen}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#0F4F68]/25 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              Nein, danke
            </button>
          </div>
        </div>
      )}

      <div className="fixed right-4 bottom-5 z-[90] flex items-center gap-2 rounded-full border border-[#0F4F68]/20 bg-white/95 px-2 py-2 shadow-[0_10px_26px_rgba(15,79,104,0.2)] backdrop-blur">
        <button
          type="button"
          onClick={decrease}
          aria-label="Ansicht verkleinern"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4F68] text-2xl font-bold leading-none text-white transition hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2"
        >
          -
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Ansicht zurücksetzen"
          className="inline-flex h-11 min-w-12 items-center justify-center rounded-full bg-[#F2F9FA] px-2 text-xs font-extrabold text-[#0F4F68] transition hover:bg-[#e4f1f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2"
        >
          {zoomLevel}%
        </button>
        <button
          type="button"
          onClick={increase}
          aria-label="Ansicht vergrößern"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F78F2E] text-2xl font-bold leading-none text-white transition hover:bg-[#e57f1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
        >
          +
        </button>
      </div>
    </>
  );
}
