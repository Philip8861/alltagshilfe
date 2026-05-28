"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  StandortKarteHauptmarker,
  StandortKarteOrtsLabel,
  StandortKartePunkt,
} from "@/config/standort-karte";
import {
  clientToMapPercent,
  getMapContentRect,
  mapPercentToContainerPercent,
  roundMapCoord,
} from "@/lib/standort-karte-coords";

type Props = {
  hauptmarker: StandortKarteHauptmarker[];
  punkte: StandortKartePunkt[];
  ortsLabels?: StandortKarteOrtsLabel[];
  /** `/standorte?karte=bearbeiten` – nur lokal, Speichern nur in NODE_ENV=development */
  editMode?: boolean;
};

const MOBILE_MAX_WIDTH = 768;

type Selection = { kind: "punkt" | "marker"; index: number };

type DragTarget = Selection & {
  startLeft: number;
  startTop: number;
  startX: number;
  startY: number;
};

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function toContainerStyle(
  mapLeft: number,
  mapTop: number,
  containerWidth: number,
  containerHeight: number,
) {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { left: `${mapLeft}%`, top: `${mapTop}%` };
  }
  const pos = mapPercentToContainerPercent(mapLeft, mapTop, containerWidth, containerHeight);
  return { left: `${pos.left}%`, top: `${pos.top}%` };
}

export function KartenMitKoordinatenErfassen({
  hauptmarker,
  punkte: punkteProp,
  ortsLabels = [],
  editMode = false,
}: Props) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(mapRef);

  const [playMarkerAnimation, setPlayMarkerAnimation] = useState(false);
  const [punktHinzufuegen, setPunktHinzufuegen] = useState(false);
  const [mouseMapCoords, setMouseMapCoords] = useState<{ left: number; top: number } | null>(null);

  const [markerState, setMarkerState] = useState<StandortKarteHauptmarker[]>(() =>
    hauptmarker.map((m) => ({ ...m })),
  );
  const [punkteState, setPunkteState] = useState<StandortKartePunkt[]>(() =>
    punkteProp.map((p) => ({ ...p })),
  );

  const [selection, setSelection] = useState<Selection | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const dragRef = useRef<DragTarget | null>(null);
  const didDragRef = useRef(false);
  const pendingSelectRef = useRef<Selection | null>(null);

  useEffect(() => {
    setMarkerState(hauptmarker.map((m) => ({ ...m })));
  }, [hauptmarker]);

  useEffect(() => {
    setPunkteState(punkteProp.map((p) => ({ ...p })));
  }, [punkteProp]);

  const contentRectStyle = useMemo(() => {
    const { width, height } = containerSize;
    if (width <= 0 || height <= 0) return null;
    const content = getMapContentRect(width, height);
    return {
      left: `${(content.left / width) * 100}%`,
      top: `${(content.top / height) * 100}%`,
      width: `${(content.width / width) * 100}%`,
      height: `${(content.height / height) * 100}%`,
    };
  }, [containerSize]);

  const removeSelectedPunkt = useCallback(() => {
    if (!selection || selection.kind !== "punkt") return;
    setPunkteState((prev) => prev.filter((_, i) => i !== selection.index));
    setSelection(null);
  }, [selection]);

  const addPunktAtCursor = useCallback(() => {
    if (!mouseMapCoords) return;
    setPunkteState((prev) => {
      const nextIndex = prev.length;
      queueMicrotask(() => setSelection({ kind: "punkt", index: nextIndex }));
      return [...prev, { ...mouseMapCoords }];
    });
  }, [mouseMapCoords]);

  const updateMouse = useCallback(
    (e: MouseEvent) => {
      const el = mapRef.current;
      if (!el) return;
      setMouseMapCoords(clientToMapPercent(e.clientX, e.clientY, el.getBoundingClientRect()));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    setSaveMessage(null);
    const payload = {
      hauptmarker: markerState.map((m) => ({
        ...m,
        left: roundMapCoord(m.left),
        top: roundMapCoord(m.top),
      })),
      punkte: punkteState.map((p) => ({
        left: roundMapCoord(p.left),
        top: roundMapCoord(p.top),
      })),
      ortsLabels,
    };
    try {
      const res = await fetch("/api/dev/standort-karte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setSaveStatus("error");
        setSaveMessage(data.error ?? "Speichern fehlgeschlagen.");
        return;
      }
      setSaveStatus("ok");
      setSaveMessage("Gespeichert in config/standort-karte.json – nach Push erscheint es online 1:1.");
      setSelection(null);
      router.refresh();
    } catch {
      setSaveStatus("error");
      setSaveMessage("Netzwerkfehler beim Speichern.");
    }
  }, [markerState, punkteState, ortsLabels, router]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!editMode) return;

      if (e.code === "Delete" || e.code === "Backspace") {
        if (selection?.kind === "punkt") {
          e.preventDefault();
          removeSelectedPunkt();
        }
        return;
      }

      if (e.code !== "Space") return;

      if (punktHinzufuegen && mouseMapCoords) {
        e.preventDefault();
        addPunktAtCursor();
      }
    },
    [editMode, punktHinzufuegen, mouseMapCoords, selection, removeSelectedPunkt, addPunktAtCursor],
  );

  const startDrag = useCallback(
    (e: React.MouseEvent, target: Selection) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
      pendingSelectRef.current = target;
      setSelection(target);

      const pos =
        target.kind === "punkt"
          ? punkteState[target.index]
          : { left: markerState[target.index].left, top: markerState[target.index].top };

      dragRef.current = {
        ...target,
        startLeft: pos.left,
        startTop: pos.top,
        startX: e.clientX,
        startY: e.clientY,
      };
    },
    [editMode, punkteState, markerState],
  );

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current) return;
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    didDragRef.current = true;
    const { kind, index, startLeft, startTop, startX, startY } = dragRef.current;
    const content = getMapContentRect(rect.width, rect.height);
    const deltaLeft = ((e.clientX - startX) / content.width) * 100;
    const deltaTop = ((e.clientY - startY) / content.height) * 100;
    const next = {
      left: Math.max(0, Math.min(100, startLeft + deltaLeft)),
      top: Math.max(0, Math.min(100, startTop + deltaTop)),
    };

    if (kind === "punkt") {
      setPunkteState((prev) => {
        const copy = [...prev];
        copy[index] = next;
        return copy;
      });
    } else {
      setMarkerState((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], ...next };
        return copy;
      });
    }
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    if (!didDragRef.current && pendingSelectRef.current) {
      setSelection(pendingSelectRef.current);
    }
    pendingSelectRef.current = null;
    dragRef.current = null;
  }, []);

  useEffect(() => {
    if (!punktHinzufuegen) setMouseMapCoords(null);
  }, [punktHinzufuegen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!editMode || !punktHinzufuegen) return;
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, [editMode, punktHinzufuegen, updateMouse]);

  useEffect(() => {
    if (!editMode) return;
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("mouseleave", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mouseleave", handleGlobalMouseUp);
    };
  }, [editMode, handleGlobalMouseMove, handleGlobalMouseUp]);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_MAX_WIDTH}px)`);
    if (mql.matches) {
      setPlayMarkerAnimation(true);
      return;
    }
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPlayMarkerAnimation(true);
      },
      { threshold: 0.15, rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selectedCoords =
    selection?.kind === "punkt"
      ? punkteState[selection.index]
      : selection?.kind === "marker"
        ? markerState[selection.index]
        : null;

  const { width: cw, height: ch } = containerSize;

  return (
    <div className="flex flex-col gap-3">
      {editMode && (
        <div className="rounded-xl border border-[#F78F2E]/40 bg-[#FFF8F0] px-4 py-3 text-sm text-neutral-800">
          <p className="font-semibold text-[#0F4F68]">Karten-Konfigurator</p>
          <p className="mt-1 text-neutral-700">
            Positionen beziehen sich auf das <strong>sichtbare Kartenbild</strong> – lokal und online
            identisch. GPS-Marker (Pin-Spitze) und orangene Punkte per Drag verschieben. Punkte mit
            Klick auswählen und <kbd className="rounded bg-white px-1">Entf</kbd> oder Button löschen.
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            {punkteState.length} Punkte · {markerState.length} Standorte · gestrichelter Rahmen =
            Kartenbereich
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPunktHinzufuegen((a) => !a);
                setSelection(null);
              }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 ${
                punktHinzufuegen
                  ? "bg-[#F78F2E] text-white hover:bg-[#e07d1f]"
                  : "bg-[#0F4F68] text-white hover:bg-[#0c3d52]"
              }`}
            >
              {punktHinzufuegen ? "Punkt hinzufügen: an" : "Punkt hinzufügen"}
            </button>
            <button
              type="button"
              onClick={removeSelectedPunkt}
              disabled={selection?.kind !== "punkt"}
              className="rounded-lg border border-[#0F4F68]/25 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition-colors hover:bg-[#F2F9FA] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Punkt löschen
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              {saveStatus === "saving" ? "Speichern…" : "Koordinaten speichern"}
            </button>
            {selectedCoords && selection && (
              <span className="text-[#0F4F68]">
                {selection.kind === "marker"
                  ? `${markerState[selection.index]?.label}: `
                  : `Punkt #${selection.index + 1}: `}
                {roundMapCoord(selectedCoords.left)}% / {roundMapCoord(selectedCoords.top)}%
              </span>
            )}
          </div>
          {punktHinzufuegen && (
            <p className="mt-2 text-xs text-neutral-600">
              Maus auf Karte → Leertaste = Punkt setzen (Koordinaten am Kartenbild)
            </p>
          )}
          {saveMessage && (
            <p
              className={`mt-2 text-sm font-medium ${saveStatus === "ok" ? "text-emerald-800" : "text-red-700"}`}
              role="status"
            >
              {saveMessage}
            </p>
          )}
        </div>
      )}

      <div
        ref={mapRef}
        className="relative w-full flex-none select-none overflow-visible isolate aspect-[3/2.5] min-h-0"
        style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" } as React.CSSProperties}
      >
        <div className="absolute inset-0 z-0 overflow-visible" style={{ transform: "translateZ(0)" }}>
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            fill
            className="object-contain object-top"
            style={{
              objectPosition: "-38% 0",
              filter:
                "drop-shadow(0 2px 6px rgba(15, 79, 104, 0.19)) drop-shadow(0 3px 11px rgba(242, 249, 250, 0.75)) drop-shadow(0 6px 18px rgba(242, 249, 250, 0.75)) drop-shadow(0 9px 24px rgba(230, 245, 247, 0.75)) drop-shadow(0 14px 33px rgba(242, 249, 250, 0.71))",
            }}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {editMode && contentRectStyle && (
          <div
            className="pointer-events-none absolute z-[1] rounded-sm border-2 border-dashed border-[#0F4F68]/35"
            style={contentRectStyle}
            aria-hidden
          />
        )}

        <div
          className="absolute left-0 top-0 w-full h-full z-10 overflow-visible"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" } as React.CSSProperties}
        >
          {punkteState.map((p, i) => {
            const pos = toContainerStyle(p.left, p.top, cw, ch);
            const isSelected = editMode && selection?.kind === "punkt" && selection.index === i;

            if (editMode) {
              return (
                <button
                  key={`dot-${i}-${p.left}-${p.top}`}
                  type="button"
                  aria-label={`Punkt ${i + 1}, verschieben oder löschen`}
                  onMouseDown={(e) => startDrag(e, { kind: "punkt", index: i })}
                  className={`absolute rounded-full bg-[#F78F2E] ring-2 ring-white overflow-visible pointer-events-auto cursor-grab active:cursor-grabbing ${
                    isSelected ? "ring-[#0F4F68] ring-4 z-[6]" : "ring-[#0F4F68]/50 z-[5]"
                  }`}
                  style={{
                    ...pos,
                    width: "clamp(10px, 1.4vw, 14px)",
                    height: "clamp(10px, 1.4vw, 14px)",
                    transform: "translate(-50%, -50%) translateZ(0)",
                  }}
                />
              );
            }

            return (
              <span
                key={`dot-${i}-${p.left}-${p.top}`}
                className={`pointer-events-none absolute rounded-full bg-[#F78F2E] ring-2 ring-white overflow-visible ${
                  playMarkerAnimation ? "animate-marker-pop-in" : ""
                }`}
                style={{
                  ...pos,
                  width: "clamp(3px, 0.65vw, 5px)",
                  height: "clamp(3px, 0.65vw, 5px)",
                  transform: "translate(-50%, -50%) translateZ(0)",
                  ...(playMarkerAnimation ? { animationDelay: `${Math.min(i * 90, 1800)}ms` } : {}),
                }}
              />
            );
          })}

          {ortsLabels.map((o) => {
            const pos = toContainerStyle(o.left, o.top, cw, ch);
            return (
              <div
                key={o.label}
                className="pointer-events-none absolute flex flex-col items-center gap-0 leading-tight"
                style={{
                  ...pos,
                  transform: "translate(-50%, -50%)",
                  fontSize: "clamp(0.6rem, 1.75vw, 18px)",
                }}
              >
                <span className="whitespace-nowrap font-semibold text-[#0F4F68]">{o.label}</span>
                {o.withX && (
                  <span
                    className="text-[#0F4F68] font-bold leading-none -mt-1"
                    style={{ fontSize: "clamp(0.75rem, 2vw, 24px)" }}
                    aria-hidden
                  >
                    ×
                  </span>
                )}
              </div>
            );
          })}

          {markerState.map((m, i) => {
            const pos = toContainerStyle(m.left, m.top, cw, ch);
            const isSelected = editMode && selection?.kind === "marker" && selection.index === i;
            const textShadow = [
              "1px 0 0 white",
              "-1px 0 0 white",
              "0 1px 0 white",
              "0 -1px 0 white",
              "1px 1px 0 white",
              "-1px -1px 0 white",
              "1px -1px 0 white",
              "-1px 1px 0 white",
            ].join(", ");
            const labelEl = (
              <span className="flex flex-col items-center gap-0">
                <span
                  className="whitespace-nowrap font-extrabold text-[#0F4F68] leading-tight"
                  style={{ textShadow, fontSize: "clamp(0.5rem, 2.2vw, 13.8px)" }}
                >
                  {m.label}
                </span>
                {m.sublabel && (
                  <span
                    className="whitespace-nowrap font-bold text-[#0F4F68] leading-tight"
                    style={{ textShadow, fontSize: "clamp(0.45rem, 1.8vw, 11.5px)" }}
                  >
                    {m.sublabel}
                  </span>
                )}
              </span>
            );
            const iconEl = (
              <span
                className="flex shrink-0 overflow-visible"
                style={{
                  filter: "drop-shadow(0 0 3px white) drop-shadow(0 2px 6px rgba(15,79,104,0.5))",
                  width: "clamp(24px, 5.5vw, 45px)",
                  height: "clamp(24px, 5.5vw, 45px)",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                <svg
                  className="h-full w-full"
                  viewBox="0 0 24 24"
                  fill="#F78F2E"
                  stroke="#0F4F68"
                  strokeWidth={1.5}
                  aria-hidden
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </span>
            );
            const gapV = "clamp(2px, 0.4vw, 6px)";
            const content = m.labelAbove ? (
              <>
                <span style={{ marginBottom: gapV }}>{labelEl}</span>
                {iconEl}
              </>
            ) : (
              <>
                {iconEl}
                <span style={{ marginTop: gapV }}>{labelEl}</span>
              </>
            );
            const style = {
              ...pos,
              transform: "translate(-50%, 100%)",
            };
            const animDelay = 700 + i * 220;
            const commonStyle = {
              ...style,
              ...(playMarkerAnimation && !editMode ? { animationDelay: `${animDelay}ms` } : {}),
            };
            const animClass = playMarkerAnimation && !editMode ? "animate-marker-slide-in" : "";
            const markerClassName = `absolute flex flex-col items-center rounded-lg transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] z-10 ${
              editMode
                ? `pointer-events-auto cursor-grab active:cursor-grabbing ${isSelected ? "ring-2 ring-[#F78F2E] ring-offset-1 rounded-xl" : "hover:opacity-90"}`
                : "pointer-events-auto hover:opacity-90 focus:ring-0 focus:ring-offset-0"
            } ${animClass}`;

            if (editMode) {
              const standortSeiteName = m.sublabel ? `${m.label} ${m.sublabel}` : m.label;
              return (
                <div
                  key={m.label}
                  role="button"
                  tabIndex={0}
                  aria-label={`Standort ${standortSeiteName} verschieben`}
                  className={markerClassName}
                  style={commonStyle}
                  onMouseDown={(e) => startDrag(e, { kind: "marker", index: i })}
                >
                  {content}
                </div>
              );
            }

            if (m.href) {
              const standortSeiteName = m.sublabel ? `${m.label} ${m.sublabel}` : m.label;
              return (
                <Link
                  key={m.label}
                  href={m.href}
                  className={markerClassName}
                  style={commonStyle}
                  aria-label={`Zur Standortseite ${standortSeiteName}`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={m.label} className={markerClassName} style={commonStyle}>
                {content}
              </div>
            );
          })}
        </div>

        {editMode && punktHinzufuegen && (
          <div className="absolute inset-0 z-[200] cursor-crosshair bg-black/5 pointer-events-none">
            {mouseMapCoords && (
              <div className="absolute left-2 top-2 z-[201] rounded-lg bg-[#0F4F68] px-3 py-2 font-mono text-sm font-bold text-white shadow-lg">
                left: {mouseMapCoords.left}% · top: {mouseMapCoords.top}%
              </div>
            )}
            <div className="absolute bottom-2 left-1/2 z-[201] -translate-x-1/2 rounded bg-black/75 px-3 py-1.5 text-xs font-medium text-white">
              Leertaste = Punkt setzen
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
