"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setPartnerTutorialHiddenAction } from "@/lib/actions/partner-tutorial";
import { buildPartnerTutorialSteps } from "@/lib/partner/partner-tutorial-content";
import {
  PARTNER_TUTORIAL_DEFER_AFTER_PW_PROMPT_YES,
  PARTNER_TUTORIAL_OPEN_EVENT,
  PARTNER_TUTORIAL_PENDING_DASHBOARD_KEY,
  PARTNER_TUTORIAL_SESSION_DONE_KEY,
} from "@/lib/partner/tutorial-session";

type Mode = "off" | "intro" | "steps";

type Props = {
  /** false, sobald der Partner „Tutorial ausblenden“ gespeichert hat (kein Auto-Start nach Login). */
  tutorialAutoShow: boolean;
  /** true, solange der Erst-Login-Passwortdialog offen ist — kein Rundgang darunter. */
  passwordPromptGateBlocked?: boolean;
  /** Freigeschaltete Leistungsbereiche — bestimmt, welche Schritte gezeigt werden. */
  responsibilityAreaSlugs?: string[];
};

function readSessionDone(): boolean {
  try {
    return window.sessionStorage.getItem(PARTNER_TUTORIAL_SESSION_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSessionDone() {
  try {
    window.sessionStorage.setItem(PARTNER_TUTORIAL_SESSION_DONE_KEY, "1");
  } catch {
    /* ignore */
  }
}

function readPendingDashboard(): boolean {
  try {
    return window.sessionStorage.getItem(PARTNER_TUTORIAL_PENDING_DASHBOARD_KEY) === "1";
  } catch {
    return false;
  }
}

function writePendingDashboard(v: boolean) {
  try {
    if (v) window.sessionStorage.setItem(PARTNER_TUTORIAL_PENDING_DASHBOARD_KEY, "1");
    else window.sessionStorage.removeItem(PARTNER_TUTORIAL_PENDING_DASHBOARD_KEY);
  } catch {
    /* ignore */
  }
}

function isDashboardPath(path: string): boolean {
  return path === "/partner/dashboard" || path === "/partner";
}

/** Abstand unten: mobile Partner-Leiste (~4.5rem) + Puffer. */
function viewportBottomReservePx(vw: number): number {
  return vw < 768 ? 112 : 40;
}

/** Mindesthöhe, die der Dialog braucht, damit Titel, Text und Buttons sichtbar bleiben. */
const MIN_PANEL_HEIGHT_PX = 260;

/**
 * Platziert die Sprechblase bevorzugt unterhalb des beleuchteten Elements. Reicht der Platz dort nicht,
 * wandert sie oberhalb des Ankers; passt sie auch dort nicht (sehr hoher Anker), wird sie am unteren
 * Bildschirmrand verankert. Der Dialog bleibt dadurch immer vollständig im sichtbaren Bereich,
 * die Höhe wird über {@link maxPanelHeightPx} begrenzt (Inhalt scrollt, Buttons bleiben fixiert).
 * `panelH` = reale oder geschätzte Dialoghöhe.
 */
function computeBubbleStyle(
  rect: DOMRect | null,
  vw: number,
  vh: number,
  panelH: number,
  options?: { viewportCenterXFromMd?: boolean; maxBubbleWidthPx?: number },
): { top: number; left: number; width: number; maxPanelHeightPx?: number } {
  const margin = Math.max(10, Math.min(18, Math.round(vw * 0.028)));
  const reserve = viewportBottomReservePx(vw);
  const safeBottom = vh - reserve;
  const maxBubble = options?.maxBubbleWidthPx ?? 22.5 * 16;
  const width = Math.min(maxBubble, vw - 2 * margin);
  const availableH = Math.max(120, safeBottom - margin);
  const ph = Math.max(Math.min(160, availableH), Math.min(panelH, availableH));

  const maxTop = Math.max(margin, safeBottom - ph);
  const clampTop = (t: number) => Math.max(margin, Math.min(t, maxTop));

  const centerXInViewport = () =>
    Math.max(margin, Math.min((vw - width) / 2, vw - width - margin));

  if (!rect || rect.width <= 0 || rect.height <= 0) {
    const top = clampTop((vh - ph) / 2);
    return { top, left: centerXInViewport(), width, maxPanelHeightPx: Math.floor(safeBottom - top) };
  }

  const gap = 12;
  const minNeeded = Math.min(MIN_PANEL_HEIGHT_PX, availableH);
  const spaceBelow = safeBottom - (rect.bottom + gap);
  const spaceAbove = rect.top - gap - margin;

  let top: number;
  let maxPanelHeightPx: number;
  if (spaceBelow >= minNeeded) {
    top = Math.max(margin, rect.bottom + gap);
    maxPanelHeightPx = Math.floor(safeBottom - top - 4);
  } else if (spaceAbove >= minNeeded) {
    const h = Math.min(ph, spaceAbove);
    top = Math.max(margin, rect.top - gap - h);
    maxPanelHeightPx = Math.floor(rect.top - gap - top);
  } else {
    /* Anker höher als der verfügbare Platz: Dialog am unteren Rand festmachen (überlappt den Anker). */
    top = maxTop;
    maxPanelHeightPx = Math.floor(safeBottom - top);
  }
  maxPanelHeightPx = Math.max(120, maxPanelHeightPx);

  const useViewportCenter = Boolean(options?.viewportCenterXFromMd && vw >= 768);
  let left: number;
  if (useViewportCenter) {
    left = centerXInViewport();
  } else {
    const cx = rect.left + rect.width / 2;
    left = cx - width / 2;
    left = Math.max(margin, Math.min(left, vw - width - margin));
  }

  return { top, left, width, maxPanelHeightPx };
}

export function PartnerTutorialOverlay({
  tutorialAutoShow,
  passwordPromptGateBlocked = false,
  responsibilityAreaSlugs,
}: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const areasKey = (responsibilityAreaSlugs ?? []).join("|");
  const steps = useMemo(
    () => buildPartnerTutorialSteps(areasKey ? areasKey.split("|") : []),
    [areasKey],
  );
  const introTitleId = useId();
  const stepTitleId = useId();
  const [mode, setMode] = useState<Mode>("off");
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [missingAnchor, setMissingAnchor] = useState(false);
  const [bubble, setBubble] = useState(() =>
    computeBubbleStyle(
      null,
      typeof window !== "undefined" ? window.innerWidth : 1200,
      typeof window !== "undefined" ? window.innerHeight : 800,
      420,
      undefined,
    ),
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const closeAll = useCallback(() => {
    setMode("off");
    setRect(null);
    setMissingAnchor(false);
    setActionError(null);
  }, []);

  /** Rundgang für diese Sitzung beenden (ESC oder Schließen-Kreuz), ohne die Einstellung dauerhaft zu ändern. */
  const dismissForSession = useCallback(() => {
    writeSessionDone();
    writePendingDashboard(false);
    closeAll();
  }, [closeAll]);

  useEffect(() => {
    if (mode === "off") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      e.preventDefault();
      dismissForSession();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, dismissForSession]);

  const hideForever = useCallback(() => {
    setActionError(null);
    startTransition(async () => {
      const r = await setPartnerTutorialHiddenAction(true);
      if (!r.ok) {
        setActionError(r.message);
        return;
      }
      writeSessionDone();
      closeAll();
      router.refresh();
    });
  }, [closeAll, router]);

  useLayoutEffect(() => {
    if (pathname !== "/partner/einstellungen/passwort") {
      try {
        if (window.sessionStorage.getItem(PARTNER_TUTORIAL_DEFER_AFTER_PW_PROMPT_YES)) {
          window.sessionStorage.removeItem(PARTNER_TUTORIAL_DEFER_AFTER_PW_PROMPT_YES);
          if (tutorialAutoShow && !passwordPromptGateBlocked && !readSessionDone()) {
            setMode("intro");
          }
        }
      } catch {
        /* ignore */
      }
    }

    if (!tutorialAutoShow) return;
    if (passwordPromptGateBlocked) return;
    if (readSessionDone()) return;
    try {
      if (window.sessionStorage.getItem(PARTNER_TUTORIAL_DEFER_AFTER_PW_PROMPT_YES)) return;
    } catch {
      /* ignore */
    }
    setMode((m) => (m === "off" ? "intro" : m));
  }, [tutorialAutoShow, passwordPromptGateBlocked, pathname]);

  useEffect(() => {
    const onOpen = () => {
      try {
        window.sessionStorage.removeItem(PARTNER_TUTORIAL_SESSION_DONE_KEY);
      } catch {
        /* ignore */
      }
      setActionError(null);
      setStepIndex(0);
      setMode("intro");
    };
    window.addEventListener(PARTNER_TUTORIAL_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(PARTNER_TUTORIAL_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!readPendingDashboard()) return;
    if (!isDashboardPath(pathname)) return;
    writePendingDashboard(false);
    setMode("steps");
    setStepIndex(0);
  }, [pathname]);

  const step = steps[stepIndex] ?? steps[0];
  const anchorSel = step?.anchor ?? "";

  const updateLayout = useCallback(() => {
    if (mode !== "steps" || !step) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fallbackH = Math.min(440, Math.max(220, Math.round(vh * 0.68)));

    const el = document.querySelector(anchorSel) as HTMLElement | null;
    if (!el || !el.isConnected) {
      setRect(null);
      setMissingAnchor(true);
      setBubble(
        computeBubbleStyle(null, vw, vh, fallbackH, {
          viewportCenterXFromMd: step.bubbleAlignViewportCenterMd,
          maxBubbleWidthPx: stepIndex === 0 ? 18 * 16 : 22.5 * 16,
        }),
      );
      return;
    }
    setMissingAnchor(false);
    /* „auto“: sonst ist getBoundingClientRect nach smooth-Scroll auf Desktop oft noch veraltet. */
    el.scrollIntoView({ block: "start", behavior: "auto" });
    const pad = 10;
    const readInflated = () => {
      const target = document.querySelector(anchorSel) as HTMLElement | null;
      if (!target?.isConnected) return null;
      const b = target.getBoundingClientRect();
      return new DOMRect(b.left - pad, b.top - pad, b.width + pad * 2, b.height + pad * 2);
    };
    const inflated = readInflated();
    if (!inflated) return;
    setRect(inflated);
    const bubbleOpts = {
      viewportCenterXFromMd: step.bubbleAlignViewportCenterMd,
      maxBubbleWidthPx: stepIndex === 0 ? 18 * 16 : 22.5 * 16,
    };
    setBubble(computeBubbleStyle(inflated, vw, vh, fallbackH, bubbleOpts));

    const measureAndApply = () => {
      const refreshed = readInflated();
      if (refreshed) setRect(refreshed);
      const rectForBubble = refreshed ?? inflated;
      const panel = document.getElementById("partner-tutorial-step-panel");
      const measured = panel?.getBoundingClientRect().height;
      const panelH =
        measured != null && measured > 80 ? measured + 8 : Math.min(460, Math.max(240, Math.round(vh * 0.7)));
      setBubble(computeBubbleStyle(rectForBubble, vw, vh, panelH, bubbleOpts));
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(measureAndApply);
    });
  }, [anchorSel, mode, step, stepIndex]);

  useLayoutEffect(() => {
    if (mode !== "steps") return;
    updateLayout();
    const t = window.setTimeout(updateLayout, 400);
    return () => window.clearTimeout(t);
  }, [mode, stepIndex, pathname, updateLayout]);

  useEffect(() => {
    if (mode !== "steps") return;
    const onResize = () => updateLayout();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [mode, updateLayout]);

  const startFromIntro = () => {
    setActionError(null);
    if (!isDashboardPath(pathname)) {
      writePendingDashboard(true);
      router.push("/partner/dashboard");
      return;
    }
    setMode("steps");
    setStepIndex(0);
  };

  const nextStep = () => {
    if (stepIndex >= steps.length - 1) {
      writeSessionDone();
      closeAll();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const prevStep = () => {
    setStepIndex((i) => Math.max(0, i - 1));
  };

  if (mode === "off") return null;

  const isIntro = mode === "intro";
  const lastStep = stepIndex >= steps.length - 1;

  const closeButton = (
    <button
      type="button"
      onClick={dismissForSession}
      aria-label="Rundgang schließen (Esc)"
      title="Schließen (Esc)"
      className="pointer-events-auto absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-[#0F4F68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M5 5l10 10M15 5L5 15" />
      </svg>
    </button>
  );

  const dialogShell = (children: ReactNode, labelledBy: string, variant: "intro" | "step") => (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className={
        variant === "intro"
          ? "relative max-h-[min(88vh,34rem)] w-full overflow-y-auto overflow-x-hidden rounded-2xl border border-[#0F4F68]/25 bg-white p-5 shadow-2xl sm:p-6"
          : "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-[#0F4F68]/25 bg-white shadow-2xl"
      }
    >
      {closeButton}
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[85] flex flex-col" role="presentation">
      {mode === "steps" && rect ? (
        <div
          key={`spot-${stepIndex}`}
          className="pointer-events-none fixed z-[86] rounded-xl animate-partner-tutorial-spotlight"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
          aria-hidden
        />
      ) : mode === "steps" ? (
        <div className="pointer-events-none fixed inset-0 z-[86] bg-[#0F4F68]/40" aria-hidden />
      ) : (
        <div className="pointer-events-none fixed inset-0 z-[86] bg-[#0F4F68]/50" aria-hidden />
      )}

      {isIntro ? (
        <div className="pointer-events-none fixed inset-0 z-[87] flex items-center justify-center p-4">
          <div className="pointer-events-auto w-full max-w-md">
            {dialogShell(
              <>
                <h2 id={introTitleId} className="pr-8 text-center text-lg font-bold text-[#0F4F68] sm:text-xl">
                  Kurzer Rundgang
                </h2>
                <p className="mt-3 text-center text-sm leading-relaxed text-neutral-700">
                  In wenigen Schritten zeigen wir Ihnen die wichtigsten Bereiche des Partnerportals — Partner-Code,
                  Provisionen, Statuslisten und mehr. Es geht nur kurz; Sie können direkt{" "}
                  <strong className="font-semibold text-neutral-900">starten</strong>, ohne etwas ablehnen zu müssen.
                </p>
                {actionError ? (
                  <p className="mt-3 text-center text-sm font-medium text-red-700" role="alert">
                    {actionError}
                  </p>
                ) : null}
                <div className="mt-5 flex flex-col items-stretch gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={startFromIntro}
                    className="pointer-events-auto inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F78F2E] focus-visible:ring-offset-2"
                  >
                    Jetzt Rundgang starten
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={hideForever}
                    className="pointer-events-auto text-center text-sm font-semibold text-neutral-600 underline decoration-neutral-400 underline-offset-2 hover:text-[#0F4F68] disabled:opacity-50"
                  >
                    Tutorial ausblenden
                  </button>
                </div>
              </>,
              introTitleId,
              "intro",
            )}
          </div>
        </div>
      ) : (
        <div
          id="partner-tutorial-step-panel"
          className={`fixed z-[87] box-border flex flex-col p-2 transition-[top,left] duration-300 ease-out motion-reduce:transition-none sm:p-4 ${
            bubble.maxPanelHeightPx == null ? "max-h-[min(100svh-6rem,36rem)] sm:max-h-[min(88vh,36rem)]" : ""
          }`}
          style={{
            top: bubble.top,
            left: bubble.left,
            width: bubble.width,
            ...(bubble.maxPanelHeightPx != null
              ? { maxHeight: `${Math.min(bubble.maxPanelHeightPx, 36 * 16)}px` }
              : {}),
          }}
        >
          {dialogShell(
            <>
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pt-5 sm:px-6 sm:pt-6">
                <p className="pr-10 text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/80">
                  Schritt {stepIndex + 1} von {steps.length}
                </p>
                <h2 id={stepTitleId} className="mt-1 pr-10 text-lg font-bold text-[#0F4F68] sm:text-xl">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">{step.body}</p>
                {missingAnchor ? (
                  <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs text-amber-950">
                    {step.missingAnchorHint}
                  </p>
                ) : null}
                {actionError ? (
                  <p className="mt-3 text-sm font-medium text-red-700" role="alert">
                    {actionError}
                  </p>
                ) : null}
              </div>
              <div className="shrink-0 border-t border-neutral-200/80 bg-white px-5 pb-4 pt-3 sm:px-6">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={stepIndex === 0}
                    onClick={prevStep}
                    className="pointer-events-auto inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-40"
                  >
                    Zurück
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="pointer-events-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52]"
                  >
                    {lastStep ? "Fertig" : "Weiter"}
                  </button>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={hideForever}
                  className="pointer-events-auto mt-2 inline-flex min-h-9 items-center text-xs font-semibold text-neutral-600 underline decoration-neutral-400 underline-offset-2 hover:text-[#0F4F68] disabled:opacity-50"
                >
                  Tutorial dauerhaft ausblenden
                </button>
              </div>
            </>,
            stepTitleId,
            "step",
          )}
        </div>
      )}
    </div>
  );
}
