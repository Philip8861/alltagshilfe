"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  StandortKarteHauptmarker,
  StandortKarteOrtsLabel,
  StandortKartePunkt,
} from "@/config/standort-karte";

type Props = {
  hauptmarker: StandortKarteHauptmarker[];
  punkte: StandortKartePunkt[];
  ortsLabels?: StandortKarteOrtsLabel[];
  /** `/standorte?karte=bearbeiten` – nur lokal, Speichern nur in NODE_ENV=development */
  editMode?: boolean;
};

/** Sichtbarer Bildausschnitt: Bild hat links ~38% Rand, Karte beginnt danach – object-position -38% 0 */
const IMAGE_CROP_LEFT = 38;
const IMAGE_VISIBLE_PCT = 100 - IMAGE_CROP_LEFT;
const imageToContainer = (left: number) => ((left - IMAGE_CROP_LEFT) / IMAGE_VISIBLE_PCT) * 100;
const containerToImage = (left: number) => (left * IMAGE_VISIBLE_PCT) / 100 + IMAGE_CROP_LEFT;
const visibleContainerLeft = (left: number) => Math.max(0, imageToContainer(left));

const MOBILE_MAX_WIDTH = 768;

function roundCoord(n: number) {
  return Math.round(n * 10) / 10;
}

type DragTarget = {
  kind: "punkt";
  index: number;
  startLeft: number;
  startTop: number;
  startX: number;
  startY: number;
};

export function KartenMitKoordinatenErfassen({
  hauptmarker,
  punkte,
  ortsLabels = [],
  editMode = false,
}: Props) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [playMarkerAnimation, setPlayMarkerAnimation] = useState(false);
  const [punktHinzufuegen, setPunktHinzufuegen] = useState(false);
  const [mouseProzent, setMouseProzent] = useState<{ left: number; top: number } | null>(null);

  const [markerPositions, setMarkerPositions] = useState<Array<{ left: number; top: number }>>(() =>
    hauptmarker.map((m) => ({ left: m.left, top: m.top })),
  );
  /** Nur in dieser Session neu gesetzte Punkte – bestehende aus `punkte` bleiben unverändert. */
  const [neuePunkte, setNeuePunkte] = useState<StandortKartePunkt[]>([]);

  const [selectedNeuerPunktIndex, setSelectedNeuerPunktIndex] = useState<number | null>(null);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const dragRef = useRef<DragTarget | null>(null);
  const didDragRef = useRef(false);
  const pendingSelectRef = useRef<{ kind: "punkt"; index: number } | null>(null);

  useEffect(() => {
    setMarkerPositions(hauptmarker.map((m) => ({ left: m.left, top: m.top })));
  }, [hauptmarker]);

  const removeSelectedNeuerPunkt = useCallback(() => {
    if (selectedNeuerPunktIndex === null) return;
    setNeuePunkte((prev) => prev.filter((_, i) => i !== selectedNeuerPunktIndex));
    setSelectedNeuerPunktIndex(null);
  }, [selectedNeuerPunktIndex]);

  const addPunktAtCursor = useCallback(() => {
    if (!mouseProzent) return;
    setNeuePunkte((prev) => {
      const nextIndex = prev.length;
      queueMicrotask(() => setSelectedNeuerPunktIndex(nextIndex));
      return [...prev, { ...mouseProzent }];
    });
    setSelectedNeuerPunktIndex(null);
  }, [mouseProzent]);

  const updateMouse = useCallback((e: MouseEvent) => {
    const el = mapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const top = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMouseProzent({ left: roundCoord(left), top: roundCoord(top) });
  }, []);

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    setSaveMessage(null);
    const payload = {
      /** GPS-Marker nur aus Config – im Editor nicht versehentlich verschieben. */
      hauptmarker: hauptmarker.map((m) => ({
        ...m,
        left: roundCoord(m.left),
        top: roundCoord(m.top),
      })),
      punkte: [
        ...punkte.map((p) => ({
          left: roundCoord(p.left),
          top: roundCoord(p.top),
        })),
        ...neuePunkte.map((p) => ({
          left: roundCoord(p.left),
          top: roundCoord(p.top),
        })),
      ],
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
      setSaveMessage("Gespeichert in config/standort-karte.json");
      setNeuePunkte([]);
      setSelectedNeuerPunktIndex(null);
      router.refresh();
    } catch {
      setSaveStatus("error");
      setSaveMessage("Netzwerkfehler beim Speichern.");
    }
  }, [hauptmarker, punkte, neuePunkte, ortsLabels, router]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!editMode) return;

      if (e.code === "Delete" || e.code === "Backspace") {
        if (selectedNeuerPunktIndex !== null) {
          e.preventDefault();
          removeSelectedNeuerPunkt();
        }
        return;
      }

      if (e.code !== "Space") return;

      if (punktHinzufuegen && mouseProzent) {
        e.preventDefault();
        addPunktAtCursor();
      }
    },
    [editMode, punktHinzufuegen, mouseProzent, selectedNeuerPunktIndex, removeSelectedNeuerPunkt, addPunktAtCursor],
  );

  const handleNeuerPunktMouseDown = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
      pendingSelectRef.current = { kind: "punkt", index };
      const pos = neuePunkte[index];
      dragRef.current = {
        kind: "punkt",
        index,
        startLeft: pos.left,
        startTop: pos.top,
        startX: e.clientX,
        startY: e.clientY,
      };
      setSelectedNeuerPunktIndex(index);
    },
    [editMode, neuePunkte],
  );

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current) return;
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    didDragRef.current = true;
    const { index, startLeft, startTop, startX, startY } = dragRef.current;
    const deltaX = ((e.clientX - startX) / rect.width) * 100;
    const deltaY = ((e.clientY - startY) / rect.height) * 100;

    setNeuePunkte((prev) => {
      const next = [...prev];
      next[index] = {
        left: Math.max(0, Math.min(100, startLeft + deltaX)),
        top: Math.max(0, Math.min(100, startTop + deltaY)),
      };
      return next;
    });
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    if (!didDragRef.current && pendingSelectRef.current?.kind === "punkt") {
      setSelectedNeuerPunktIndex(pendingSelectRef.current.index);
    }
    pendingSelectRef.current = null;
    dragRef.current = null;
  }, []);

  useEffect(() => {
    if (!punktHinzufuegen) setMouseProzent(null);
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

  return (
    <div className="flex flex-col gap-3">
      {editMode && (
        <div className="rounded-xl border border-[#F78F2E]/40 bg-[#FFF8F0] px-4 py-3 text-sm text-neutral-800">
          <p className="font-semibold text-[#0F4F68]">Karten-Bearbeitungsmodus</p>
          <p className="mt-1 text-neutral-700">
            Bestehende orangene Punkte bleiben fix wie auf der normalen Karte. Nur <strong>neu gesetzte</strong>{" "}
            Punkte (größer, blauer Ring) lassen sich verschieben oder entfernen. GPS-Marker sind fix. Speichern hängt
            neue Punkte an die bestehende Liste in{" "}
            <code className="text-xs">config/standort-karte.json</code>.
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            {punkte.length} gespeicherte Punkte · {neuePunkte.length} neu in dieser Sitzung
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPunktHinzufuegen((a) => !a);
                setSelectedNeuerPunktIndex(null);
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
              onClick={removeSelectedNeuerPunkt}
              disabled={selectedNeuerPunktIndex === null}
              className="rounded-lg border border-[#0F4F68]/25 bg-white px-3 py-2 text-sm font-semibold text-[#0F4F68] transition-colors hover:bg-[#F2F9FA] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Neuen Punkt entfernen
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
            >
              {saveStatus === "saving" ? "Speichern…" : "Koordinaten speichern"}
            </button>
            {selectedNeuerPunktIndex !== null && (
              <span className="text-[#0F4F68]">
                Neuer Punkt #{selectedNeuerPunktIndex + 1} (
                {roundCoord(neuePunkte[selectedNeuerPunktIndex]?.left ?? 0)}% /{" "}
                {roundCoord(neuePunkte[selectedNeuerPunktIndex]?.top ?? 0)}%)
              </span>
            )}
          </div>
          {punktHinzufuegen && (
            <p className="mt-2 text-xs text-neutral-600">Maus auf Karte → Leertaste = neuen Punkt setzen</p>
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

        <div
          className="absolute left-0 top-0 w-full h-full z-10 overflow-visible"
          style={{ transform: "translateZ(0)", backfaceVisibility: "hidden" } as React.CSSProperties}
        >
          {punkte.map((p, i) => (
            <span
              key={`dot-existing-${i}-${p.left}-${p.top}`}
              className={`pointer-events-none absolute rounded-full bg-[#F78F2E] ring-2 ring-white overflow-visible ${
                playMarkerAnimation && !editMode ? "animate-marker-pop-in" : ""
              }`}
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: "clamp(3px, 0.65vw, 5px)",
                height: "clamp(3px, 0.65vw, 5px)",
                transform: "translate(-50%, -50%) translateZ(0)",
                ...(playMarkerAnimation && !editMode ? { animationDelay: `${Math.min(i * 90, 1800)}ms` } : {}),
              }}
            />
          ))}
          {neuePunkte.map((p, i) => {
            const isSelected = editMode && selectedNeuerPunktIndex === i;
            return (
              <button
                key={`dot-new-${i}-${p.left}-${p.top}`}
                type="button"
                aria-label={`Neuer Punkt ${i + 1}, verschieben oder entfernen`}
                tabIndex={editMode ? 0 : -1}
                onMouseDown={(e) => handleNeuerPunktMouseDown(e, i)}
                onClick={(e) => {
                  if (!editMode) return;
                  e.preventDefault();
                  if (!didDragRef.current) {
                    setSelectedNeuerPunktIndex(i);
                  }
                }}
                className={`absolute rounded-full bg-[#F78F2E] ring-2 ring-white overflow-visible pointer-events-auto cursor-grab active:cursor-grabbing ${
                  isSelected ? "ring-[#0F4F68] ring-4 z-[6]" : "ring-[#0F4F68]/70 ring-offset-1 ring-offset-white z-[5]"
                }`}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: "clamp(10px, 1.4vw, 14px)",
                  height: "clamp(10px, 1.4vw, 14px)",
                  transform: "translate(-50%, -50%) translateZ(0)",
                }}
              />
            );
          })}

          {ortsLabels.map((o) => (
            <div
              key={o.label}
              className="pointer-events-none absolute flex flex-col items-center gap-0 leading-tight"
              style={{
                left: `${o.left}%`,
                top: `${o.top}%`,
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
          ))}

          {hauptmarker.map((m, i) => {
            const pos = markerPositions[i] ?? { left: m.left, top: m.top };
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
              left: `${visibleContainerLeft(pos.left)}%`,
              top: `${pos.top}%`,
              transform: "translate(-50%, 100%)",
            };
            const animDelay = 700 + i * 220;
            const commonStyle = {
              ...style,
              ...(playMarkerAnimation && !editMode ? { animationDelay: `${animDelay}ms` } : {}),
            };
            const animClass = playMarkerAnimation && !editMode ? "animate-marker-slide-in" : "";
            const markerClassName = editMode
              ? `absolute flex flex-col items-center pointer-events-auto rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-0 ${animClass} cursor-pointer z-10`
              : `absolute flex flex-col items-center pointer-events-auto rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-0 ${animClass} cursor-pointer z-10`;

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
              <div
                key={m.label}
                className={markerClassName}
                style={commonStyle}
              >
                {content}
              </div>
            );
          })}
        </div>

        {editMode && punktHinzufuegen && (
          <div className="absolute inset-0 z-[200] cursor-crosshair bg-black/5 pointer-events-none">
            {mouseProzent && (
              <div className="absolute left-2 top-2 z-[201] rounded-lg bg-[#0F4F68] px-3 py-2 font-mono text-sm font-bold text-white shadow-lg">
                left: {mouseProzent.left}% · top: {mouseProzent.top}%
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
