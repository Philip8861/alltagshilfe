"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";

const MIN_SCALE = 0.35;
const MAX_SCALE = 2.75;

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
};

export function PartnerNetworkTreeViewport({ children, layoutKey }: Props) {
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

  const centerContent = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const cw = content.offsetWidth;
    const ch = content.offsetHeight;

    let scale = 1;
    if (cw > vw * 0.92 || ch > vh * 0.92) {
      scale = clampScale(Math.min((vw * 0.92) / cw, (vh * 0.92) / ch));
    }

    const x = (vw - cw * scale) / 2;
    const y = Math.max(12, (vh - ch * scale) / 2);
    setTransform({ x, y, scale });
  }, []);

  useLayoutEffect(() => {
    centerContent();
    const t = window.setTimeout(centerContent, 80);
    return () => window.clearTimeout(t);
  }, [layoutKey, centerContent]);

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
      const delta = e.deltaY;
      const factor = delta > 0 ? 0.92 : 1.08;
      zoomAtPoint(e.clientX, e.clientY, transformRef.current.scale * factor);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAtPoint]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isInteractiveTarget(e.target)) return;
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
    <div className="relative">
      <div
        ref={viewportRef}
        className="ahs-tree__viewport relative min-h-[min(52vh,22rem)] max-h-[min(72vh,32rem)] w-full cursor-grab touch-none overflow-hidden rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA]/50 active:cursor-grabbing sm:min-h-[min(58vh,26rem)]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="Werbe-Netzwerk: mit Finger oder Maus verschieben, mit zwei Fingern oder Mausrad zoomen"
      >
        <div
          ref={contentRef}
          className="ahs-tree__transform inline-block will-change-transform"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.65rem] leading-snug text-neutral-600 sm:text-xs">
          <span className="hidden sm:inline">Mausrad zum Zoomen · </span>
          Ziehen zum Verschieben
          <span className="sm:hidden"> · Zwei Finger zum Zoomen</span>
        </p>
        <div className="flex items-center gap-1.5">
          <span className="min-w-[2.75rem] text-center text-[0.65rem] font-semibold tabular-nums text-[#0F4F68]">
            {pct}%
          </span>
          <ZoomBtn label="Verkleinern" onClick={() => zoomBy(0.85)}>
            −
          </ZoomBtn>
          <ZoomBtn label="Vergrößern" onClick={() => zoomBy(1.15)}>
            +
          </ZoomBtn>
          <button
            type="button"
            onClick={centerContent}
            className="min-h-9 rounded-lg border border-[#0F4F68]/20 bg-white px-2.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]"
          >
            Zentrieren
          </button>
        </div>
      </div>
    </div>
  );
}

function ZoomBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg border border-[#0F4F68]/20 bg-white text-lg font-semibold leading-none text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68]"
    >
      {children}
    </button>
  );
}
