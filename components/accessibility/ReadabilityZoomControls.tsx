"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { AHS_READABILITY_OPEN_EVENT } from "@/components/accessibility/ReadabilityLaunchLink";

const ICON_STROKE = "#FFFFFF";
const ICON_BG = "#0F4F68";

const STORAGE_KEY_LEVEL = "ahs_readability_zoom_level";
const STORAGE_KEY_CONTRAST = "ahs_readability_high_contrast";
const STORAGE_KEY_REDUCE_MOTION = "ahs_readability_reduce_motion";
const STORAGE_KEY_LINE_HEIGHT = "ahs_readability_line_height";
const STORAGE_KEY_BW_MODE = "ahs_readability_bw_mode";
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

function fixedLaunchStyle(partial: Pick<CSSProperties, "right" | "bottom">): CSSProperties {
  return {
    position: "fixed",
    zIndex: 2147483647,
    visibility: "visible",
    opacity: 1,
    pointerEvents: "auto",
    ...partial,
  };
}

export function ReadabilityZoomControls() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [bwMode, setBwMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [expandedLineHeight, setExpandedLineHeight] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [widgetHidden, setWidgetHidden] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [isKonfiguratorOpen, setIsKonfiguratorOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onOpenFromFooter = () => {
      setWidgetHidden(false);
      setShowUndo(false);
      setOpen(true);
    };
    window.addEventListener(AHS_READABILITY_OPEN_EVENT, onOpenFromFooter);
    return () => window.removeEventListener(AHS_READABILITY_OPEN_EVENT, onOpenFromFooter);
  }, []);

  useEffect(() => {
    const onKonfiguratorState = (event: Event) => {
      const custom = event as CustomEvent<{ open?: boolean }>;
      const openState = Boolean(custom.detail?.open);
      setIsKonfiguratorOpen(openState);
      if (openState) {
        setOpen(false);
      }
    };
    window.addEventListener("ahs-konfigurator-open-state", onKonfiguratorState as EventListener);
    return () => window.removeEventListener("ahs-konfigurator-open-state", onKonfiguratorState as EventListener);
  }, []);

  useEffect(() => {
    const storedLevel = window.localStorage.getItem(STORAGE_KEY_LEVEL);
    const parsed = storedLevel ? Number.parseInt(storedLevel, 10) : 100;
    const nextLevel = Number.isFinite(parsed) ? clampZoom(parsed) : 100;
    setZoomLevel(nextLevel);
    applyZoom(nextLevel);
    const storedContrast = window.localStorage.getItem(STORAGE_KEY_CONTRAST) === "1";
    const storedBwMode = window.localStorage.getItem(STORAGE_KEY_BW_MODE) === "1";
    const storedReduceMotion = window.localStorage.getItem(STORAGE_KEY_REDUCE_MOTION) === "1";
    const storedLineHeight = window.localStorage.getItem(STORAGE_KEY_LINE_HEIGHT) === "1";
    setHighContrast(storedContrast);
    setBwMode(storedBwMode);
    setReduceMotion(storedReduceMotion);
    setExpandedLineHeight(storedLineHeight);
  }, []);

  useEffect(() => {
    // Kontrast / Motion / Zeilenabstand als Klasse auf <html> schalten.
    // So greift es zuverlässig auch auf Child-Elemente.
    const root = document.documentElement;
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("bw-mode", bwMode);
    root.classList.toggle("reduce-motion", reduceMotion);
    root.classList.toggle("readability-expanded-spacing", expandedLineHeight);
  }, [highContrast, bwMode, reduceMotion, expandedLineHeight]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const updateZoom = (next: number) => {
    const level = clampZoom(next);
    setZoomLevel(level);
    applyZoom(level);
    window.localStorage.setItem(STORAGE_KEY_LEVEL, String(level));
  };

  const reset = () => updateZoom(100);
  const resetAllSettings = () => {
    updateZoom(100);
    setHighContrast(false);
    setBwMode(false);
    setReduceMotion(false);
    setExpandedLineHeight(false);
    window.localStorage.setItem(STORAGE_KEY_CONTRAST, "0");
    window.localStorage.setItem(STORAGE_KEY_BW_MODE, "0");
    window.localStorage.setItem(STORAGE_KEY_REDUCE_MOTION, "0");
    window.localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, "0");
  };

  const isKontakt = useMemo(() => pathname === "/kontakt", [pathname]);
  const hideLauncher = isKontakt || isKonfiguratorOpen;

  const buttonWrapStyle = useMemo(
    () =>
      fixedLaunchStyle({
        right: "max(1rem, env(safe-area-inset-right, 0px))",
        bottom: isKontakt
          ? "min(42vh, calc(env(safe-area-inset-bottom, 0px) + max(2rem, 11rem)))"
          : "max(1rem, env(safe-area-inset-bottom, 0px))",
      }),
    [isKontakt],
  );

  useEffect(() => {
    // Rückwärtskompatibilität: falls eine alte Version das Widget „dauerhaft“ versteckt hat,
    // entfernen wir den Flag, damit es wieder sichtbar ist.
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem("ahs_readability_zoom_widget_hidden");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!showUndo) return;
    const t = window.setTimeout(() => setShowUndo(false), 6500);
    return () => window.clearTimeout(t);
  }, [showUndo]);

  const ui = (
    <div ref={panelRef}>
      {!hideLauncher && widgetHidden ? (
        <div style={buttonWrapStyle}>
          <button
            type="button"
            onClick={() => {
              setWidgetHidden(false);
              setShowUndo(false);
            }}
            aria-label="Lesbarkeits-Widget wieder einblenden"
            className="flex h-7 w-7 items-center justify-center rounded-lg shadow-[0_8px_18px_rgba(15,79,104,0.34)] transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            style={{ backgroundColor: ICON_BG }}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ICON_STROKE}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 21l-4.35-4.35" />
              <circle cx="11" cy="11" r="7" />
            </svg>
          </button>
        </div>
      ) : !hideLauncher ? (
        <div style={buttonWrapStyle}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={`Lesbarkeit Einstellungen öffnen. Aktuelle Schriftgröße: ${zoomLevel}%`}
            className="flex min-h-[60px] min-w-[60px] flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 shadow-[0_10px_36px_rgba(15,79,104,0.34)] transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            style={{ backgroundColor: ICON_BG }}
          >
            <svg
              className="h-7 w-7 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ICON_STROKE}
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 21l-4.35-4.35" />
              <circle cx="11" cy="11" r="7" />
            </svg>
            <span className="text-[15px] font-extrabold tracking-wide text-white">{zoomLevel}%</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setWidgetHidden(true);
              setShowUndo(true);
              setOpen(false);
            }}
            aria-label="Lesbarkeits-Widget schließen"
            className="absolute -right-2 -top-8 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0F4F68] text-white shadow-[0_10px_20px_rgba(15,79,104,0.25)] transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
          >
          <span aria-hidden className="text-lg leading-none font-extrabold">
              ×
            </span>
          </button>
        </div>
      ) : null}

      {!hideLauncher && showUndo && (
        <div
          className="fixed right-4 w-[min(92vw,22rem)] rounded-2xl border border-[#0F4F68]/15 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,79,104,0.18)] backdrop-blur"
          style={{
            zIndex: 2147483647,
            bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))",
          }}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-[#0F4F68]">Lesbarkeits-Widget ausgeblendet</p>
          <p className="mt-1 text-xs text-neutral-600">Sie können es jederzeit wieder einblenden.</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setWidgetHidden(false);
                setShowUndo(false);
              }}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#0F4F68] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              Rückgängig
            </button>
            <button
              type="button"
              onClick={() => setShowUndo(false)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 flex items-center justify-end bg-[#0F4F68]/38 p-3 sm:p-4"
          style={{ zIndex: 2147483647 }}
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div
            role="menu"
            aria-label="Barrierefreie Einstellungen"
            className="w-[min(96vw,42rem)] max-h-[92vh] overflow-y-auto rounded-3xl border border-[#0F4F68]/18 bg-white p-6 shadow-[0_18px_48px_rgba(15,79,104,0.26)] sm:p-8"
            style={{
              transform: `scale(${100 / zoomLevel})`,
              transformOrigin: "right center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-extrabold text-[#0F4F68] sm:text-xl">Barrierefreie Homepage</p>
                <p className="mt-1 text-sm text-neutral-600">Passen Sie die Darstellung so an, dass Veränderungen im Hintergrund gut sichtbar bleiben.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                aria-label="Einstellungen schließen"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <section className="rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-3">
                <h4 className="text-lg font-extrabold text-[#0F4F68]">Schriftgröße & Art</h4>
                <label className="mt-3 block text-xs font-semibold text-[#0F4F68]" htmlFor="zoom-range">
                  Schriftgröße ({zoomLevel}%)
                </label>
                <input
                  id="zoom-range"
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={STEP}
                  value={zoomLevel}
                  onChange={(e) => updateZoom(Number.parseInt(e.target.value, 10))}
                  className="mt-2 w-full accent-[#F78F2E]"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateZoom(zoomLevel - STEP)}
                    className="flex-1 rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => updateZoom(zoomLevel + STEP)}
                    className="flex-1 rounded-xl bg-[#F78F2E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#e57f1f] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 w-full rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  Zurücksetzen
                </button>
              </section>

              <section className="rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-3">
                <h4 className="text-lg font-extrabold text-[#0F4F68]">Farben</h4>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setHighContrast(v);
                      window.localStorage.setItem(STORAGE_KEY_CONTRAST, v ? "1" : "0");
                    }}
                    className="mt-1 h-5 w-5 accent-[#F78F2E]"
                  />
                  <span>
                    <span className="block text-sm font-bold text-[#0F4F68]">Hoher Kontrast</span>
                    <span className="block text-sm text-neutral-600">Für mehr Lesbarkeit bei hellem/unklarem Hintergrund.</span>
                  </span>
                </label>
                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <input
                    type="checkbox"
                    checked={bwMode}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setBwMode(v);
                      window.localStorage.setItem(STORAGE_KEY_BW_MODE, v ? "1" : "0");
                    }}
                    className="mt-1 h-5 w-5 accent-[#F78F2E]"
                  />
                  <span>
                    <span className="block text-sm font-bold text-[#0F4F68]">Schwarz/Weiß-Modus</span>
                    <span className="block text-sm text-neutral-600">Reduziert Farben auf Graustufen für ruhigere Darstellung.</span>
                  </span>
                </label>
              </section>

              <section className="rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-3">
                <h4 className="text-lg font-extrabold text-[#0F4F68]">Ton</h4>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setReduceMotion(v);
                      window.localStorage.setItem(STORAGE_KEY_REDUCE_MOTION, v ? "1" : "0");
                    }}
                    className="mt-1 h-5 w-5 accent-[#F78F2E]"
                  />
                  <span>
                    <span className="block text-sm font-bold text-[#0F4F68]">Ruhiger Modus</span>
                    <span className="block text-sm text-neutral-600">Weniger Bewegung und visuelle Reize für konzentrierteres Lesen.</span>
                  </span>
                </label>

                <div className="mt-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <p className="text-sm font-bold text-[#0F4F68]">Zeilenabstand</p>
                  <p className="mt-1 text-sm text-neutral-600">Erhöhen oder reduzieren Sie den Zeilenabstand.</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedLineHeight(false);
                        window.localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, "0");
                      }}
                      className="flex-1 rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedLineHeight(true);
                        window.localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, "1");
                      }}
                      className="flex-1 rounded-xl bg-[#F78F2E] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#e57f1f] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                    >
                      +
                    </button>
                  </div>
                </div>
              </section>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={resetAllSettings}
                className="w-full rounded-xl border border-[#0F4F68]/20 bg-white px-4 py-3 text-base font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
              >
                Einstellungen zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(ui, document.body);
}
