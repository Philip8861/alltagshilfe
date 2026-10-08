"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  PartnerNetworkTreeViewportContext,
  type PartnerNetworkViewportApi,
} from "@/components/partner/network/PartnerNetworkTreeViewportContext";

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.75;
/** Startansicht: kleine Netzwerke nicht beliebig hochskalieren (Karten bleiben lesbar, nicht „aufgeblasen“). */
const MAX_INITIAL_SCALE = 1.15;
/** Startansicht: nicht kleiner als das – lieber seitlich verschieben als unlesbare Karten. */
const MIN_INITIAL_SCALE = 0.6;

type Transform = { x: number; y: number; scale: number };

function clampScale(s: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function isInteractiveTarget(el: EventTarget | null): boolean {
  return Boolean(
    el &&
      (el as HTMLElement).closest?.("button, a, select, input, textarea, [data-no-pan]"),
  );
}

type Props = {
  children: ReactNode;
  /** Wenn sich der Baum ändert (Monat/Reload), neu zentrieren. */
  layoutKey: string;
  /** Mobile: nur Sponsor + eigene Position in der Startansicht. */
  isMobile?: boolean;
  /** Start-Zoom-Faktor (z. B. 0.9 = 10 % kleiner). */
  initialViewScale?: number;
  /** Linker Bereich der Werkzeugleiste (Titel, Zähler …). */
  toolbarStart?: ReactNode;
};

export function PartnerNetworkTreeViewport({
  children,
  layoutKey,
  isMobile = false,
  initialViewScale = 1,
  toolbarStart,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const panRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const pinchRef = useRef<{ dist: number; scale: number; midX: number; midY: number; x: number; y: number } | null>(
    null,
  );

  /** Weiche Bewegung, wenn programmatisch auf einen Knoten zentriert wird (+/-). */
  const [animating, setAnimating] = useState(false);
  const animTimerRef = useRef<number | null>(null);

  /** Startansicht: Desktop bis direkte Partner; Mobile nur Sponsor + eigene Position. */
  const resetView = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const paddingX = isMobile ? 16 : 36;
    const paddingTop = 16;
    /* Unten Platz für den Aufklapp-Button unter der eigenen Karte und den Hinweis-Chip. */
    const paddingBottom = isMobile ? 72 : 48;

    const focusSelector = isMobile ? '[data-network-focus-top="true"]' : '[data-network-focus="true"]';
    const focusEls = [...content.querySelectorAll<HTMLElement>(focusSelector)];
    const contentRect = content.getBoundingClientRect();
    const currentScale = transformRef.current.scale || 1;

    if (focusEls.length > 0) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const el of focusEls) {
        const r = el.getBoundingClientRect();
        const left = (r.left - contentRect.left) / currentScale;
        const top = (r.top - contentRect.top) / currentScale;
        const right = left + r.width / currentScale;
        const bottom = top + r.height / currentScale;
        minX = Math.min(minX, left);
        minY = Math.min(minY, top);
        maxX = Math.max(maxX, right);
        maxY = Math.max(maxY, bottom);
      }

      const focusWidth = Math.max(maxX - minX, 1);
      const focusHeight = Math.max(maxY - minY, 1);

      /* Zoom so wählen, dass der Fokusbereich hineinpasst – aber nie so klein, dass Karten unlesbar werden. */
      const scale = Math.min(
        MAX_INITIAL_SCALE,
        Math.max(
          MIN_INITIAL_SCALE,
          clampScale(
            Math.min((vw - paddingX * 2) / focusWidth, (vh - paddingTop - paddingBottom) / focusHeight) *
              initialViewScale,
          ),
        ),
      );

      /* Horizontal immer auf die eigene Karte zentrieren (bei breiten Netzwerken sonst irgendwo am Rand). */
      const selfEl = content.querySelector<HTMLElement>('[data-network-focus-self="true"]');
      let centerX = minX + focusWidth / 2;
      if (selfEl) {
        const r = selfEl.getBoundingClientRect();
        centerX = (r.left - contentRect.left) / currentScale + r.width / currentScale / 2;
      }

      /* Vertikal immer oben andocken: Werber/eigene Karte stehen sofort sichtbar am oberen Rand. */
      const x = vw / 2 - centerX * scale;
      const y = paddingTop - minY * scale;
      setTransform({ x, y, scale });
      return;
    }

    const cw = content.offsetWidth;
    const ch = content.offsetHeight;
    let scale = 1;
    if (cw > vw * 0.96 || ch > vh * 0.85) {
      scale = clampScale(Math.min((vw * 0.96) / cw, (vh * 0.85) / ch) * initialViewScale);
    } else {
      scale = Math.min(MAX_INITIAL_SCALE, clampScale(initialViewScale));
    }
    setTransform({
      x: (vw - cw * scale) / 2,
      y: paddingTop,
      scale,
    });
  }, [isMobile, initialViewScale]);

  /** +/- Klick: Anker (z. B. Toggle-Button) weich in die Viewport-Mitte, Zoom unverändert. */
  const centerOnElement = useCallback((el: HTMLElement | null) => {
    if (!el) return;

    const compute = (): Transform | null => {
      const viewport = viewportRef.current;
      const content = contentRef.current;
      if (!viewport || !content) return null;

      const scale = transformRef.current.scale || 1;
      const vw = viewport.clientWidth;
      const vh = viewport.clientHeight;
      const contentRect = content.getBoundingClientRect();
      const r = el.getBoundingClientRect();

      // Position des Ankers im untransformierten Content-Koordinatensystem.
      const cx = (r.left + r.width / 2 - contentRect.left) / scale;
      const cy = (r.top + r.height / 2 - contentRect.top) / scale;

      return {
        scale,
        x: vw / 2 - cx * scale,
        y: vh / 2 - cy * scale,
      };
    };

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Erst nach dem Layout-Update (rAF) messen, damit neu geöffnete/geschlossene
    // Ebenen bereits berücksichtigt sind – sonst springt die Ansicht.
    if (!reduceMotion) setAnimating(true);
    requestAnimationFrame(() => {
      const next = compute();
      if (next) setTransform(next);
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
      if (!reduceMotion) {
        animTimerRef.current = window.setTimeout(() => setAnimating(false), 380);
      }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current);
    };
  }, []);

  /** Während einer programmatischen Zentrierung Bewegungen sofort stoppen (kein Nachzittern). */
  const stopCenterAnimation = useCallback(() => {
    if (animTimerRef.current) {
      window.clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    setAnimating(false);
  }, []);

  /** „Alles anzeigen“: gesamten (aufgeklappten) Baum in den Viewport einpassen. */
  const fitAll = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;
    stopCenterAnimation();

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const pad = isMobile ? 12 : 28;
    const cw = Math.max(content.offsetWidth, 1);
    const ch = Math.max(content.offsetHeight, 1);
    const scale = clampScale(Math.min((vw - pad * 2) / cw, (vh - pad * 2) / ch));
    setTransform({
      x: (vw - cw * scale) / 2,
      y: (vh - ch * scale) / 2,
      scale,
    });
  }, [isMobile, stopCenterAnimation]);

  const viewportApi = useMemo<PartnerNetworkViewportApi>(() => ({ centerOnElement }), [centerOnElement]);

  useLayoutEffect(() => {
    resetView();
    /* Zweiter/dritter Durchlauf, nachdem die Kollisionsauflösung große Bäume umsortiert hat. */
    const t1 = window.setTimeout(resetView, 80);
    const t2 = window.setTimeout(resetView, 320);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [layoutKey, isMobile, resetView]);

  const zoomAtPoint = useCallback((clientX: number, clientY: number, nextScale: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    setTransform((prev) => {
      const scale = clampScale(nextScale);
      const ratio = scale / prev.scale;
      return {
        scale,
        x: px - (px - prev.x) * ratio,
        y: py - (py - prev.y) * ratio,
      };
    });
  }, []);

  const zoomBy = useCallback(
    (factor: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      zoomAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, transformRef.current.scale * factor);
    },
    [zoomAtPoint],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopCenterAnimation();
      const delta = e.deltaY;
      const factor = delta > 0 ? 0.92 : 1.08;
      zoomAtPoint(e.clientX, e.clientY, transformRef.current.scale * factor);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAtPoint, stopCenterAnimation]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isInteractiveTarget(e.target)) return;
    stopCenterAnimation();
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);

    if (pointersRef.current.size === 1) {
      const t = transformRef.current;
      panRef.current = { startX: e.clientX, startY: e.clientY, origX: t.x, origY: t.y };
      pinchRef.current = null;
    } else if (pointersRef.current.size === 2) {
      panRef.current = null;
      const pts = [...pointersRef.current.values()];
      const mid = midpoint(pts[0], pts[1]);
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const t = transformRef.current;
      pinchRef.current = {
        dist: dist(pts[0], pts[1]),
        scale: t.scale,
        midX: mid.x - rect.left,
        midY: mid.y - rect.top,
        x: t.x,
        y: t.y,
      };
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const pts = [...pointersRef.current.values()].slice(0, 2);
      const newDist = dist(pts[0], pts[1]);
      if (newDist < 4) return;

      const mid = midpoint(pts[0], pts[1]);
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const midX = mid.x - rect.left;
      const midY = mid.y - rect.top;

      const p = pinchRef.current;
      const nextScale = clampScale(p.scale * (newDist / p.dist));
      const ratio = nextScale / transformRef.current.scale;

      setTransform({
        scale: nextScale,
        x: midX - (midX - transformRef.current.x) * ratio,
        y: midY - (midY - transformRef.current.y) * ratio,
      });
      return;
    }

    if (pointersRef.current.size === 1 && panRef.current) {
      const p = panRef.current;
      setTransform((prev) => ({
        ...prev,
        x: p.origX + (e.clientX - p.startX),
        y: p.origY + (e.clientY - p.startY),
      }));
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 0) {
      panRef.current = null;
      pinchRef.current = null;
    } else if (pointersRef.current.size === 1) {
      pinchRef.current = null;
      const remaining = [...pointersRef.current.entries()][0];
      if (remaining) {
        const t = transformRef.current;
        panRef.current = {
          startX: remaining[1].x,
          startY: remaining[1].y,
          origX: t.x,
          origY: t.y,
        };
      }
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const pct = Math.round(transform.scale * 100);

  return (
    <div className="relative flex w-full flex-col">
      {/* Werkzeugleiste */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[#0F4F68]/10 bg-white px-3 py-2.5 sm:px-4">
        <div className="w-full min-w-0 sm:w-auto sm:flex-1">{toolbarStart}</div>
        <div className="flex w-full items-center justify-end gap-1 sm:w-auto" role="group" aria-label="Ansicht steuern">
          <ToolbarBtn label="Verkleinern" onClick={() => zoomBy(0.85)} icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
          </ToolbarBtn>
          <span
            className="min-w-[3rem] text-center text-xs font-semibold tabular-nums text-[#0F4F68]"
            aria-live="polite"
            aria-label={`Zoom ${pct} Prozent`}
          >
            {pct}%
          </span>
          <ToolbarBtn label="Vergrößern" onClick={() => zoomBy(1.15)} icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </ToolbarBtn>
          <span className="mx-1 hidden h-5 w-px bg-[#0F4F68]/15 sm:block" aria-hidden />
          <ToolbarBtn label="Startansicht" onClick={resetView} icon title="Startansicht: Werber, Sie und direkt geworbene Partner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-8H9v8H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round" />
            </svg>
          </ToolbarBtn>
          <ToolbarBtn label="Alles anzeigen" onClick={fitAll} icon title="Alles anzeigen: gesamtes Netzwerk einpassen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" strokeLinecap="round" />
            </svg>
          </ToolbarBtn>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="ahs-tree__viewport partner-network-tree__canvas relative h-[clamp(18rem,52vh,26rem)] w-full cursor-grab touch-none overflow-hidden active:cursor-grabbing sm:h-[clamp(24rem,64vh,42rem)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="Werbe-Netzwerk: mit Finger oder Maus verschieben, mit zwei Fingern oder Mausrad zoomen"
      >
        <div
          ref={contentRef}
          className="ahs-tree__transform absolute left-0 top-0 inline-block w-max will-change-transform"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            transition: animating ? "transform 360ms cubic-bezier(0.22, 0.61, 0.36, 1)" : "none",
          }}
        >
          <PartnerNetworkTreeViewportContext.Provider value={viewportApi}>
            {children}
          </PartnerNetworkTreeViewportContext.Provider>
        </div>

        <p className="pointer-events-none absolute bottom-2 left-1/2 max-w-[calc(100%-1.5rem)] -translate-x-1/2 truncate rounded-full border border-[#0F4F68]/10 bg-white/85 px-3 py-1 text-[0.62rem] text-neutral-600 shadow-sm backdrop-blur-sm sm:text-[0.68rem]">
          <span className="hidden sm:inline">Mausrad zoomt · Ziehen verschiebt · </span>
          <span className="sm:hidden">Zwei Finger zoomen · Ziehen verschiebt · </span>
          <span className="font-semibold text-[#0F4F68]">+</span>/<span className="font-semibold text-[#0F4F68]">−</span> an
          einer Karte öffnet bzw. schließt die Ebene darunter
        </p>
      </div>
    </div>
  );
}

function ToolbarBtn({
  label,
  title,
  onClick,
  children,
  icon = false,
}: {
  label: string;
  title?: string;
  onClick: () => void;
  children: ReactNode;
  icon?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title ?? label}
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center rounded-lg border border-[#0F4F68]/15 bg-white text-[#0F4F68] shadow-sm transition hover:border-[#0F4F68]/30 hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] ${
        icon ? "w-9" : "px-3 text-xs font-semibold"
      }`}
    >
      {children}
    </button>
  );
}
