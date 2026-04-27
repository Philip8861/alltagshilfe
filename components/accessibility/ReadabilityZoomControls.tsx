"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { AHS_READABILITY_OPEN_EVENT } from "@/components/accessibility/ReadabilityLaunchLink";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";

const KOSTENFREIE_PFLEGEHILFSMITTEL_LANDING = "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel";

function isKostenfreiePflegehilfsmittelLandingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === KOSTENFREIE_PFLEGEHILFSMITTEL_LANDING ||
    pathname.startsWith(`${KOSTENFREIE_PFLEGEHILFSMITTEL_LANDING}/`)
  );
}

const ICON_STROKE = "#FFFFFF";
const ICON_BG = "#0F4F68";

const STORAGE_KEY_LEVEL = "ahs_readability_zoom_level";
const STORAGE_KEY_REDUCE_MOTION = "ahs_readability_reduce_motion";
const STORAGE_KEY_LINE_HEIGHT = "ahs_readability_line_height";
const STORAGE_KEY_BW_MODE = "ahs_readability_bw_mode";
const STORAGE_KEY_FONT = "ahs_readability_font_family";
const STORAGE_KEY_READ_ALOUD = "ahs_readability_read_aloud_mode";
const STORAGE_KEY_BRIGHT_PAGE = "ahs_readability_bright_page";
const STORAGE_KEY_CURSOR_ENHANCED = "ahs_readability_cursor_enhanced";
const STORAGE_KEY_REOPEN_READABILITY = "ahs_reopen_readability_popup";
const MIN_ZOOM = 90;
const MAX_ZOOM = 150;
const STEP = 5;
const MIN_LINE_HEIGHT = 100;
const MAX_LINE_HEIGHT = 200;
const LINE_HEIGHT_STEP = 5;

const FONT_OPTIONS = [
  { id: "nunito", label: "Nunito Sans (Standard)", value: "'Nunito Sans', system-ui, sans-serif" },
  { id: "arial", label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { id: "verdana", label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { id: "trebuchet", label: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { id: "georgia", label: "Georgia", value: "Georgia, 'Times New Roman', serif" },
] as const;

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
  const [bwMode, setBwMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lineHeightLevel, setLineHeightLevel] = useState(100);
  const [selectedFont, setSelectedFont] = useState<(typeof FONT_OPTIONS)[number]["id"]>("nunito");
  const [readAloudMode, setReadAloudMode] = useState(false);
  const [brightPage, setBrightPage] = useState(false);
  const [enhancedCursor, setEnhancedCursor] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [widgetHidden, setWidgetHidden] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [isKonfiguratorOpen, setIsKonfiguratorOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasReadOnce, setHasReadOnce] = useState(false);
  const [readAloudError, setReadAloudError] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stopRequestedRef = useRef(false);
  const speakingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(STORAGE_KEY_REOPEN_READABILITY) === "1") {
        sessionStorage.removeItem(STORAGE_KEY_REOPEN_READABILITY);
        setWidgetHidden(false);
        setShowUndo(false);
        setOpen(true);
      }
    } catch {
      // ignore session storage errors
    }
  }, []);

  useEffect(() => {
    const onOpenFromFooter = () => {
      if (pathname === "/pflegeberatung") return;
      setWidgetHidden(false);
      setShowUndo(false);
      setOpen(true);
    };
    window.addEventListener(AHS_READABILITY_OPEN_EVENT, onOpenFromFooter);
    return () => window.removeEventListener(AHS_READABILITY_OPEN_EVENT, onOpenFromFooter);
  }, [pathname]);

  useEffect(() => {
    const onKonfiguratorState = (event: Event) => {
      const custom = event as CustomEvent<{ open?: boolean }>;
      const openState = Boolean(custom.detail?.open);
      setIsKonfiguratorOpen(openState);
      if (openState) setOpen(false);
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
    const storedBwMode = window.localStorage.getItem(STORAGE_KEY_BW_MODE) === "1";
    const storedLineHeightRaw = window.localStorage.getItem(STORAGE_KEY_LINE_HEIGHT);
    const parsedLineHeight = storedLineHeightRaw ? Number.parseInt(storedLineHeightRaw, 10) : 100;
    const nextLineHeight = Number.isFinite(parsedLineHeight)
      ? Math.min(MAX_LINE_HEIGHT, Math.max(MIN_LINE_HEIGHT, parsedLineHeight))
      : 100;
    const storedFont = window.localStorage.getItem(STORAGE_KEY_FONT);
    const validFont = FONT_OPTIONS.some((f) => f.id === storedFont) ? (storedFont as (typeof FONT_OPTIONS)[number]["id"]) : "nunito";
    const storedReadAloud = window.localStorage.getItem(STORAGE_KEY_READ_ALOUD) === "1";
    const storedBrightPage = window.localStorage.getItem(STORAGE_KEY_BRIGHT_PAGE) === "1";
    const storedEnhancedCursor = window.localStorage.getItem(STORAGE_KEY_CURSOR_ENHANCED) === "1";
    setBwMode(storedBwMode);
    setReduceMotion(false);
    setLineHeightLevel(nextLineHeight);
    setSelectedFont(validFont);
    setReadAloudMode(storedReadAloud);
    setBrightPage(storedBrightPage);
    setEnhancedCursor(storedEnhancedCursor);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("bw-mode", bwMode);
    root.classList.toggle("bright-page", brightPage);
    root.classList.toggle("cursor-enhanced", enhancedCursor);
    root.classList.toggle("reduce-motion", reduceMotion);
    root.classList.toggle("readability-adjusted-spacing", lineHeightLevel !== 100);
    root.classList.toggle("readability-font-adjusted", selectedFont !== "nunito");
    root.style.setProperty("--ahs-line-height", `${lineHeightLevel / 100}`);
    root.style.setProperty("--ahs-letter-spacing", `${(lineHeightLevel - 100) / 1000}em`);
    root.style.setProperty("--ahs-font-family", FONT_OPTIONS.find((f) => f.id === selectedFont)?.value ?? FONT_OPTIONS[0].value);
  }, [bwMode, brightPage, enhancedCursor, reduceMotion, lineHeightLevel, selectedFont]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!readAloudMode && isSpeaking) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
      setIsSpeaking(false);
    }
  }, [readAloudMode, isSpeaking]);

  useEffect(() => {
    speakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (!speakingRef.current) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  }, [pathname]); // Nur bei Seitenwechsel stoppen, nicht bei jedem Start.

  const updateZoom = (next: number) => {
    const level = clampZoom(next);
    setZoomLevel(level);
    applyZoom(level);
    window.localStorage.setItem(STORAGE_KEY_LEVEL, String(level));
  };

  const getReadablePageText = () => {
    const main = document.getElementById("main-content");
    if (!main) return "";
    const parts = Array.from(main.querySelectorAll("h1, h2, h3, p, li"))
      .map((el) => el.textContent?.trim() ?? "")
      .filter(Boolean);
    return parts.join(". ");
  };

  const startReading = () => {
    setReadAloudError("");
    if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setReadAloudError("Vorlesen wird in diesem Browser nicht unterstützt.");
      return;
    }
    const text = getReadablePageText();
    if (!text) {
      setReadAloudError("Kein vorlesbarer Seiteninhalt gefunden.");
      return;
    }
    stopRequestedRef.current = false;
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    // Lange Texte in stabile, kurze Abschnitte teilen.
    const rawSentences = text
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const chunks: string[] = [];
    let current = "";
    for (const sentence of rawSentences) {
      const next = current ? `${current} ${sentence}` : sentence;
      if (next.length > 220 && current) {
        chunks.push(current);
        current = sentence;
      } else {
        current = next;
      }
    }
    if (current) chunks.push(current);
    if (chunks.length === 0) {
      setReadAloudError("Kein vorlesbarer Textabschnitt vorhanden.");
      return;
    }

    let idx = 0;
    const activeLang = "de-DE";

    const getBestVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return undefined;
      const baseLang = activeLang.startsWith("en") ? "en" : "de";
      const scoped = voices.filter((v) => v.lang?.toLowerCase().startsWith(baseLang));
      if (scoped.length === 0) {
        return voices.find((v) => v.default) ?? voices[0];
      }
      const preferredGoogle = scoped.find(
        (v) =>
          v.lang.toLowerCase() === activeLang.toLowerCase() &&
          `${v.name} ${v.voiceURI}`.toLowerCase().includes("google"),
      );
      if (preferredGoogle) return preferredGoogle;
      return scoped.find((v) => v.lang.toLowerCase() === activeLang.toLowerCase()) ?? scoped[0];
    };
    const speakNext = () => {
      if (stopRequestedRef.current || idx >= chunks.length) {
        setIsSpeaking(false);
        utteranceRef.current = null;
        return;
      }
      const utterance = new SpeechSynthesisUtterance(chunks[idx]);
      utterance.lang = activeLang;
      utterance.rate = 0.92;
      utterance.pitch = 1.03;
      utterance.volume = 1;
      const voice = getBestVoice();
      if (voice) utterance.voice = voice;
      utterance.onend = () => {
        idx += 1;
        speakNext();
      };
      utterance.onerror = () => {
        setReadAloudError("Vorlesen konnte nicht gestartet werden. Bitte prüfen Sie Browser-Sound und Sprachausgabe.");
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };
    // In einigen Browsern werden Stimmen asynchron geladen.
    if (window.speechSynthesis.getVoices().length === 0) {
      let triggered = false;
      window.speechSynthesis.onvoiceschanged = () => {
        if (triggered) return;
        triggered = true;
        speakNext();
      };
      window.setTimeout(() => {
        if (!triggered) {
          triggered = true;
          speakNext();
        }
      }, 450);
    } else {
      speakNext();
    }
    setIsSpeaking(true);
    setHasReadOnce(true);
  };

  const stopReading = () => {
    stopRequestedRef.current = true;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setReadAloudError("");
  };

  const resetAllSettings = () => {
    updateZoom(100);
    setBwMode(false);
    setReduceMotion(false);
    setLineHeightLevel(100);
    setSelectedFont("nunito");
    setReadAloudMode(false);
    setBrightPage(false);
    setEnhancedCursor(false);
    stopReading();
    setHasReadOnce(false);
    window.localStorage.setItem(STORAGE_KEY_BW_MODE, "0");
    window.localStorage.setItem(STORAGE_KEY_REDUCE_MOTION, "0");
    window.localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, "100");
    window.localStorage.setItem(STORAGE_KEY_FONT, "nunito");
    window.localStorage.setItem(STORAGE_KEY_READ_ALOUD, "0");
    window.localStorage.setItem(STORAGE_KEY_BRIGHT_PAGE, "0");
    window.localStorage.setItem(STORAGE_KEY_CURSOR_ENHANCED, "0");
  };

  const isKontakt = useMemo(() => pathname === "/kontakt", [pathname]);
  /** Kostenfrei-Landing: schwebender Lesbarkeits-Button aus – dort Pflegeboxi unten links; Barrierefreiheit weiter über Footer-Link. */
  const hideLauncher =
    isKontakt || isKonfiguratorOpen || isKostenfreiePflegehilfsmittelLandingPath(pathname);
  const selectedFontIndex = FONT_OPTIONS.findIndex((f) => f.id === selectedFont);
  const cycleFont = (direction: -1 | 1) => {
    const nextIndex = (selectedFontIndex + direction + FONT_OPTIONS.length) % FONT_OPTIONS.length;
    const nextFont = FONT_OPTIONS[nextIndex].id;
    setSelectedFont(nextFont);
    window.localStorage.setItem(STORAGE_KEY_FONT, nextFont);
  };

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

  /** Kein Launcher im Header: schwebender Button; bei geöffnetem Panel ausblenden (Lupe/% nur im Dialog unter der Überschrift). */
  const launcherNode =
    hideLauncher || open ? null : widgetHidden ? (
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
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke={ICON_STROKE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 21l-4.35-4.35" />
            <circle cx="11" cy="11" r="7" />
          </svg>
        </button>
      </div>
    ) : (
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
    );

  const overlayNode = (
    <div ref={panelRef}>
      {!hideLauncher && showUndo ? (
        <div
          className="fixed right-4 w-[min(92vw,22rem)] rounded-2xl border border-[#0F4F68]/15 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,79,104,0.18)] backdrop-blur"
          style={{ zIndex: 2147483647, bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))" }}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-[#0F4F68]">Lesbarkeits-Widget ausgeblendet</p>
          <p className="mt-1 text-xs text-neutral-600">Sie können es jederzeit wieder einblenden.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { setWidgetHidden(false); setShowUndo(false); }} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#0F4F68] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0c3d52]">Rückgängig</button>
            <button type="button" onClick={() => setShowUndo(false)} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA]">OK</button>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 bg-[#0F4F68]/38" style={{ zIndex: 2147483647 }} onClick={() => setOpen(false)} aria-hidden>
          <div
            role="menu"
            aria-label="Barrierefreie Einstellungen"
            className="absolute right-3 top-1/2 w-[min(96vw,42rem)] max-h-[92vh] -translate-y-1/2 overflow-y-auto rounded-3xl border border-[#0F4F68]/18 bg-white p-6 shadow-[0_18px_48px_rgba(15,79,104,0.26)] sm:right-4 sm:p-8"
            style={{ transform: `translateY(-50%) scale(${100 / zoomLevel})`, transformOrigin: "top right" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-extrabold text-[#0F4F68] sm:text-xl">Barrierefreie Homepage</p>
                <p className="mt-1 text-sm text-neutral-600">Hier können Sie ihre Darstellung ändern.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50" aria-label="Einstellungen schließen">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <section className="rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-3">
                <h4 className="text-lg font-extrabold text-[#0F4F68]">Schriftgröße & Art</h4>
                <label className="mt-3 block text-xs font-semibold text-[#0F4F68]" htmlFor="zoom-range">{`Schriftgröße (${zoomLevel}%)`}</label>
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
                    className="flex-1 rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68]"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => updateZoom(zoomLevel + STEP)}
                    className="flex-1 rounded-xl bg-[#F78F2E] px-3 py-2 text-sm font-semibold text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => updateZoom(100)}
                  className="mt-2 w-full rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68]"
                >
                  Zurücksetzen
                </button>
                <label className="mt-3 block text-xs font-semibold text-[#0F4F68]">Schriftart</label>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cycleFont(-1)}
                    aria-label="Vorherige Schriftart"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#0F4F68]/20 bg-white text-[#0F4F68]"
                  >
                    ←
                  </button>
                  <p className="flex-1 text-center text-sm font-semibold text-[#0F4F68]">
                    {FONT_OPTIONS[selectedFontIndex]?.label}
                  </p>
                  <button
                    type="button"
                    onClick={() => cycleFont(1)}
                    aria-label="Nächste Schriftart"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#0F4F68]/20 bg-white text-[#0F4F68]"
                  >
                    →
                  </button>
                </div>
                <div
                  className="mt-3 text-center text-2xl font-bold text-[#0F4F68]"
                  style={{ fontFamily: FONT_OPTIONS.find((f) => f.id === selectedFont)?.value }}
                >
                  Schriftart Test
                </div>
                <div className="mt-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <p className="text-sm font-bold text-[#0F4F68]">Zeilenabstand</p>
                  <p className="mt-1 text-sm text-neutral-600">{`Aktuell: ${lineHeightLevel}%`}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.max(MIN_LINE_HEIGHT, lineHeightLevel - LINE_HEIGHT_STEP);
                        setLineHeightLevel(next);
                        window.localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, String(next));
                      }}
                      className="flex-1 rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68]"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = Math.min(MAX_LINE_HEIGHT, lineHeightLevel + LINE_HEIGHT_STEP);
                        setLineHeightLevel(next);
                        window.localStorage.setItem(STORAGE_KEY_LINE_HEIGHT, String(next));
                      }}
                      className="flex-1 rounded-xl bg-[#F78F2E] px-3 py-2 text-sm font-semibold text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-3">
                <h4 className="text-lg font-extrabold text-[#0F4F68]">Farben</h4>
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
                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <input
                    type="checkbox"
                    checked={brightPage}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setBrightPage(v);
                      window.localStorage.setItem(STORAGE_KEY_BRIGHT_PAGE, v ? "1" : "0");
                    }}
                    className="mt-1 h-5 w-5 accent-[#F78F2E]"
                  />
                  <span>
                    <span className="block text-sm font-bold text-[#0F4F68]">Seite heller machen</span>
                    <span className="block text-sm text-neutral-600">Erhöht Helligkeit und Kontrast für bessere Sichtbarkeit.</span>
                  </span>
                </label>
                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <input
                    type="checkbox"
                    checked={enhancedCursor}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setEnhancedCursor(v);
                      window.localStorage.setItem(STORAGE_KEY_CURSOR_ENHANCED, v ? "1" : "0");
                    }}
                    className="mt-1 h-5 w-5 accent-[#F78F2E]"
                  />
                  <span>
                    <span className="block text-sm font-bold text-[#0F4F68]">Maus Cursor vergrößern</span>
                    <span className="block text-sm text-neutral-600">Gleiche Pfeil-Form wie gewohnt, nur größer dargestellt.</span>
                  </span>
                </label>
              </section>

              <section className="rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-3">
                <h4 className="text-lg font-extrabold text-[#0F4F68]">Ton</h4>
                <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-4">
                  <input
                    type="checkbox"
                    checked={readAloudMode}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setReadAloudMode(v);
                      window.localStorage.setItem(STORAGE_KEY_READ_ALOUD, v ? "1" : "0");
                      if (!v) stopReading();
                    }}
                    className="mt-1 h-5 w-5 accent-[#F78F2E]"
                  />
                  <span>
                    <span className="flex items-center gap-2 text-sm font-bold text-[#0F4F68]">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a3.5 3.5 0 0 0-2.1-3.2v6.4a3.5 3.5 0 0 0 2.1-3.2zm0-7.5v2.1a6 6 0 0 1 0 10.8v2.1a8.5 8.5 0 0 0 0-15z" />
                      </svg>
                      Vorlese Modus
                    </span>
                    <span className="block text-sm text-neutral-600">Nutzt standardmäßig Google Deutsch (de-DE), falls vorhanden.</span>
                  </span>
                </label>
              </section>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={resetAllSettings}
                className="w-full rounded-xl border border-[#0F4F68]/20 bg-white px-4 py-3 text-base font-semibold text-[#0F4F68]"
              >
                Einstellungen zurücksetzen
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {readAloudMode ? (
        <div
          className="fixed left-1/2 z-[2147483647] w-[min(92vw,28rem)] -translate-x-1/2"
          style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0px) + 1rem))" }}
        >
          <div className="relative rounded-2xl border border-[#0F4F68]/15 bg-white p-3 shadow-[0_12px_34px_rgba(15,79,104,0.22)]">
            <button
              type="button"
              onClick={() => {
                setReadAloudMode(false);
                window.localStorage.setItem(STORAGE_KEY_READ_ALOUD, "0");
                stopReading();
              }}
              aria-label="Vorlesemodus schließen"
              className="absolute -right-2 -top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#0F4F68] text-white"
            >
              <span aria-hidden className="text-lg leading-none font-extrabold">×</span>
            </button>
            {readAloudError ? (
              <p className="mb-2 text-xs font-semibold text-[#b42318]">{readAloudError}</p>
            ) : null}
            <button
              type="button"
              onClick={() => (isSpeaking ? stopReading() : startReading())}
              className="inline-flex min-h-[56px] w-full items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-lg font-bold text-white transition hover:bg-[#0c3d52]"
            >
              {isSpeaking ? "Vorlesen Stoppen" : hasReadOnce ? "Erneut lesen" : "Vorlesen Start"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  /* Partner, Pflegebox, Betriebliche Pflegeberatung, Karriere, Kooperation: kein portaliertes Lesbarkeits-UI. */
  if (
    pathname.startsWith("/partner") ||
    isPflegeboxKonfiguratorPagePath(pathname) ||
    pathname === "/pflegeberatung" ||
    pathname === "/karriere" ||
    pathname.startsWith("/karriere/") ||
    pathname === "/kooperation"
  ) {
    return null;
  }

  return (
    <>
      {createPortal(overlayNode, document.body)}
      {launcherNode ? createPortal(launcherNode, document.body) : null}
    </>
  );
}
