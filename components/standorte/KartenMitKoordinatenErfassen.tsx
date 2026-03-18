"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Hauptmarker = { left: number; top: number; label: string; sublabel?: string; href?: string; labelAbove?: boolean };
type Punkt = { left: number; top: number };
type OrtsLabel = { left: number; top: number; label: string; withX?: boolean };

type Props = {
  hauptmarker: Hauptmarker[];
  punkte: Punkt[];
  ortsLabels?: OrtsLabel[];
};

/** Verschieben der Standorte + %-Anzeige/Koordinaten-Erfassung (später wieder aktivierbar). */
const ENABLE_DRAG_AND_CAPTURE = false;

/** Sichtbarer Bildausschnitt: Bild hat links ~38% Rand, Karte beginnt danach – object-position -38% 0 */
const IMAGE_CROP_LEFT = 38;
const IMAGE_VISIBLE_PCT = 100 - IMAGE_CROP_LEFT; // 62
const imageToContainer = (left: number) => ((left - IMAGE_CROP_LEFT) / IMAGE_VISIBLE_PCT) * 100;
const containerToImage = (left: number) => (left * IMAGE_VISIBLE_PCT) / 100 + IMAGE_CROP_LEFT;
/** Container-X für Anzeige: links vom sichtbaren Ausschnitt wird auf 0 geklemmt, damit Marker (z. B. Engen/Konstanz) sichtbar bleiben. */
const visibleContainerLeft = (left: number) => Math.max(0, imageToContainer(left));

export function KartenMitKoordinatenErfassen({ hauptmarker, punkte, ortsLabels = [] }: Props) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [erfassenAktiv, setErfassenAktiv] = useState(false);
  const [mouseProzent, setMouseProzent] = useState<{ left: number; top: number } | null>(null);
  const [gespeichert, setGespeichert] = useState<Array<{ left: number; top: number }>>([]);

  const [markerPositions, setMarkerPositions] = useState<Array<{ left: number; top: number }>>(() =>
    hauptmarker.map((m) => ({ left: m.left, top: m.top }))
  );
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);
  const [savedMarkerPositions, setSavedMarkerPositions] = useState<
    Array<{ name: string; left: number; top: number }>
  >([]);
  const dragRef = useRef<{ index: number; startLeft: number; startTop: number; startX: number; startY: number } | null>(null);
  const didDragRef = useRef(false);
  const pendingSelectRef = useRef<number | null>(null);

  const updateMouse = useCallback(
    (e: MouseEvent) => {
      const el = mapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const left = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const top = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setMouseProzent({ left: Math.round(left * 10) / 10, top: Math.round(top * 10) / 10 });
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!ENABLE_DRAG_AND_CAPTURE || e.code !== "Space") return;
      if (erfassenAktiv && mouseProzent) {
        e.preventDefault();
        setGespeichert((prev) => [...prev, { ...mouseProzent }]);
        return;
      }
      if (selectedMarkerIndex !== null) {
        e.preventDefault();
        const m = hauptmarker[selectedMarkerIndex];
        const pos = markerPositions[selectedMarkerIndex];
        if (pos) {
          const name = m.sublabel ? `${m.label} ${m.sublabel}` : m.label;
          setSavedMarkerPositions((prev) => [
            ...prev,
            { name, left: Math.round(pos.left * 10) / 10, top: Math.round(pos.top * 10) / 10 },
          ]);
        }
      }
    },
    [erfassenAktiv, mouseProzent, selectedMarkerIndex, hauptmarker, markerPositions]
  );

  const handleMarkerMouseDown = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      didDragRef.current = false;
      pendingSelectRef.current = index;
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pos = markerPositions[index];
      dragRef.current = {
        index,
        startLeft: pos.left,
        startTop: pos.top,
        startX: e.clientX,
        startY: e.clientY,
      };
    },
    [markerPositions]
  );

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragRef.current) return;
      const rect = mapRef.current?.getBoundingClientRect();
      if (!rect) return;
      didDragRef.current = true;
      const { index, startLeft, startTop, startX, startY } = dragRef.current;
      const deltaX = ((e.clientX - startX) / rect.width) * 100;
      const deltaY = ((e.clientY - startY) / rect.height) * 100;
      const newLeftContainer = imageToContainer(startLeft) + deltaX;
      const newTop = startTop + deltaY;
      setMarkerPositions((prev) => {
        const next = [...prev];
        next[index] = {
          left: Math.max(IMAGE_CROP_LEFT, Math.min(100, containerToImage(Math.max(0, Math.min(100, newLeftContainer))))),
          top: Math.max(0, Math.min(100, newTop)),
        };
        return next;
      });
    },
    []
  );

  const handleGlobalMouseUp = useCallback(() => {
    if (!didDragRef.current && pendingSelectRef.current !== null) {
      setSelectedMarkerIndex(pendingSelectRef.current);
    }
    pendingSelectRef.current = null;
    dragRef.current = null;
  }, []);

  useEffect(() => {
    if (erfassenAktiv) {
      setMouseProzent(null);
    }
  }, [erfassenAktiv]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!erfassenAktiv) return;
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, [erfassenAktiv, updateMouse]);

  useEffect(() => {
    if (!ENABLE_DRAG_AND_CAPTURE) return;
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("mouseleave", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mouseleave", handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  return (
    <div className="flex flex-col gap-3">
      {/* Karte: Aspect 3/2.5 strikt, damit GPS-Symbole auf Mobil und Desktop exakt gleich liegen. */}
      <div
        ref={mapRef}
        className="relative w-full flex-none select-none overflow-visible isolate aspect-[3/2.5] min-h-0"
      >
        {/* Karte als unterste Ebene (z-0); overflow-visible damit drop-shadow auf Mobil sichtbar bleibt */}
        <div className="absolute inset-0 z-0 overflow-visible">
          <Image
            src="/images/Landkarte_sueddeutschland.webp"
            alt="Karte Süddeutschland – Standorte Alltagshilfe-Süd"
            fill
            className="object-contain object-top"
            style={{
              objectPosition: "-38% 0",
              filter: "drop-shadow(0 2px 8px rgba(15, 79, 104, 0.25)) drop-shadow(0 4px 14px rgba(242, 249, 250, 1)) drop-shadow(0 8px 24px rgba(242, 249, 250, 1)) drop-shadow(0 12px 32px rgba(230, 245, 247, 1)) drop-shadow(0 18px 44px rgba(242, 249, 250, 0.95))",
            }}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        {/* GPS-Symbole, orangene Punkte, X München/Nürnberg: über der Karte, unter sonstigen Grafiken (Header) */}
        <div
          className="absolute left-0 top-0 w-full h-full z-10"
          aria-hidden
        >
          {/* Orangene Punkte: Koordinaten sind Container-% (0–100 sichtbarer Bereich), keine Umrechnung */}
          {punkte.map((p, i) => (
            <span
              key={`dot-${i}`}
              className="pointer-events-none absolute rounded-full bg-[#F78F2E] ring-2 ring-white animate-marker-pop-in"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: "clamp(3px, 0.65vw, 5px)",
                height: "clamp(3px, 0.65vw, 5px)",
                transform: "translate(-50%, -50%)",
                animationDelay: `${Math.min(i * 35, 650)}ms`,
              }}
            />
          ))}
          {/* München/Nürnberg: Koordinaten sind Container-% (0–100 sichtbarer Bereich), keine Umrechnung */}
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
              <span className="whitespace-nowrap font-semibold text-[#0F4F68]">
                {o.label}
              </span>
              {o.withX && (
                <span className="text-[#0F4F68] font-bold leading-none -mt-1" style={{ fontSize: "clamp(0.75rem, 2vw, 24px)" }} aria-hidden>×</span>
              )}
            </div>
          ))}
          {hauptmarker.map((m, i) => {
            const pos = markerPositions[i] ?? { left: m.left, top: m.top };
            const isSelected = selectedMarkerIndex === i;
            const textShadow = [
              "0 0 2px white",
              "1px 0 0 white", "-1px 0 0 white", "0 1px 0 white", "0 -1px 0 white",
              "1px 1px 0 white", "-1px -1px 0 white", "1px -1px 0 white", "-1px 1px 0 white",
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
                className="flex shrink-0"
                style={{
                  filter: "drop-shadow(0 0 3px white) drop-shadow(0 2px 6px rgba(15,79,104,0.5))",
                  width: "clamp(24px, 5.5vw, 45px)",
                  height: "clamp(24px, 5.5vw, 45px)",
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
            const animDelay = 400 + (i * 120);
            const commonStyle = { ...style, animationDelay: `${animDelay}ms` };
            const markerClassName = ENABLE_DRAG_AND_CAPTURE
              ? `absolute flex flex-col items-center pointer-events-auto rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-transparent animate-marker-slide-in cursor-grab active:cursor-grabbing ${isSelected ? "ring-2 ring-[#F78F2E] ring-offset-0 z-[5]" : "z-10"}`
              : "absolute flex flex-col items-center pointer-events-auto rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-0 animate-marker-slide-in cursor-pointer z-10";
            const handleClick = (e: React.MouseEvent) => {
              e.preventDefault();
              if (!didDragRef.current) setSelectedMarkerIndex(i);
            };
            if (m.href) {
              if (ENABLE_DRAG_AND_CAPTURE) {
                return (
                  <Link
                    key={m.label}
                    href={m.href}
                    className={markerClassName}
                    style={commonStyle}
                    aria-label={`${m.label} – Klick: auswählen. Doppelklick: Standort öffnen. Leertaste: Position speichern.`}
                    onMouseDown={(e) => handleMarkerMouseDown(e, i)}
                    onClick={handleClick}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      router.push(m.href!);
                    }}
                  >
                    {content}
                  </Link>
                );
              }
              return (
                <Link
                  key={m.label}
                  href={m.href}
                  className={markerClassName}
                  style={commonStyle}
                  aria-label={`${m.label} – Standort öffnen`}
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
                role={ENABLE_DRAG_AND_CAPTURE ? "button" : undefined}
                tabIndex={ENABLE_DRAG_AND_CAPTURE ? 0 : undefined}
                onMouseDown={ENABLE_DRAG_AND_CAPTURE ? (e) => handleMarkerMouseDown(e, i) : undefined}
                onClick={ENABLE_DRAG_AND_CAPTURE ? () => setSelectedMarkerIndex(i) : undefined}
                onKeyDown={ENABLE_DRAG_AND_CAPTURE ? (e) => {
                  if (e.code === "Space" || e.code === "Enter") {
                    e.preventDefault();
                    setSelectedMarkerIndex(i);
                  }
                } : undefined}
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* Overlay: Maus-% Anzeige + Leertaste-Hinweis */}
        {erfassenAktiv && (
          <div className="absolute inset-0 z-[200] cursor-crosshair bg-black/5">
            {mouseProzent && (
              <div className="pointer-events-none absolute left-2 top-2 z-[201] rounded-lg bg-[#0F4F68] px-3 py-2 font-mono text-sm font-bold text-white shadow-lg">
                left: {mouseProzent.left}% · top: {mouseProzent.top}%
              </div>
            )}
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-[201] -translate-x-1/2 rounded bg-black/75 px-3 py-1.5 text-xs font-medium text-white">
              Leertaste = Koordinaten speichern
            </div>
          </div>
        )}
      </div>

      {/* Button unter der Karte + Hinweise (nur wenn Drag/Capture aktiv) */}
      {ENABLE_DRAG_AND_CAPTURE && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setErfassenAktiv((a) => !a)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 ${
                erfassenAktiv
                  ? "bg-[#F78F2E] text-white hover:bg-[#e07d1f]"
                  : "bg-[#0F4F68] text-white hover:bg-[#0c3d52]"
              }`}
            >
              {erfassenAktiv ? "Koordinaten-Erfassung an" : "GPS-Koordinaten erfassen"}
            </button>
            {erfassenAktiv && (
              <span className="text-sm text-neutral-600">
                Maus auf Karte bewegen → Leertaste = Punkt speichern
              </span>
            )}
          </div>
          {selectedMarkerIndex !== null && (
            <p className="text-sm font-medium text-[#0F4F68]">
              <strong>{hauptmarker[selectedMarkerIndex]?.label}</strong> ausgewählt – Leertaste = Name + Koordinaten speichern. Doppelklick auf Symbol = Standort öffnen.
            </p>
          )}
        </div>
      )}

      {/* Gespeicherte Koordinaten (Maus-Klick-Modus) – nur bei aktivierter Erfassung */}
      {ENABLE_DRAG_AND_CAPTURE && gespeichert.length > 0 && (
        <div className="rounded-lg border border-[#0F4F68]/20 bg-[#F2F9FA] p-4">
          <p className="mb-2 text-sm font-semibold text-[#0F4F68]">
            Gespeicherte Koordinaten (zum Kopieren an den Assistenten):
          </p>
          <pre className="max-h-40 overflow-auto rounded bg-white p-3 text-xs text-neutral-800">
            {gespeichert
              .map((p, i) => `  { left: ${p.left}, top: ${p.top} },  // Punkt ${i + 1}`)
              .join("\n")}
          </pre>
          <button
            type="button"
            onClick={() => setGespeichert([])}
            className="mt-2 text-sm text-[#0F4F68] underline hover:no-underline"
          >
            Liste leeren
          </button>
        </div>
      )}

      {/* Gespeicherte Standort-Positionen (Marker verschieben + Leertaste) – nur bei aktivierter Erfassung */}
      {ENABLE_DRAG_AND_CAPTURE && savedMarkerPositions.length > 0 && (
        <div className="rounded-lg border border-[#0F4F68]/20 bg-[#F2F9FA] p-4">
          <p className="mb-2 text-sm font-semibold text-[#0F4F68]">
            Gespeicherte Standort-Positionen (Name + % Koordinaten):
          </p>
          <pre className="max-h-48 overflow-auto rounded bg-white p-3 text-xs text-neutral-800">
            {savedMarkerPositions
              .map((s) => `${s.name}, left: ${s.left}, top: ${s.top}`)
              .join("\n")}
          </pre>
          <button
            type="button"
            onClick={() => setSavedMarkerPositions([])}
            className="mt-2 text-sm text-[#0F4F68] underline hover:no-underline"
          >
            Liste leeren
          </button>
        </div>
      )}
    </div>
  );
}
