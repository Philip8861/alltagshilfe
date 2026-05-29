"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PARTNER_AVATAR_MAX_BYTES,
  PARTNER_AVATAR_OUTPUT_SIZE,
} from "@/lib/partner/partner-avatar-shared";

type CropState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

type Props = {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onConfirm: (file: File) => void;
  busy?: boolean;
};

const VIEWPORT = 280;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

async function exportCircularAvatar(
  image: HTMLImageElement,
  crop: CropState,
): Promise<File> {
  const canvas = document.createElement("canvas");
  const size = PARTNER_AVATAR_OUTPUT_SIZE;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas nicht verfügbar");

  const baseScale = Math.max(VIEWPORT / image.naturalWidth, VIEWPORT / image.naturalHeight);
  const scale = baseScale * crop.zoom;
  const drawW = image.naturalWidth * scale;
  const drawH = image.naturalHeight * scale;
  const drawX = (VIEWPORT - drawW) / 2 + crop.offsetX;
  const drawY = (VIEWPORT - drawH) / 2 + crop.offsetY;
  const ratio = size / VIEWPORT;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(image, drawX * ratio, drawY * ratio, drawW * ratio, drawH * ratio);
  ctx.restore();

  let quality = 0.92;
  let blob: Blob | null = null;

  while (quality >= 0.5) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= PARTNER_AVATAR_MAX_BYTES) break;
    quality -= 0.08;
  }

  if (!blob) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.72));
  }
  if (!blob) throw new Error("Export fehlgeschlagen");
  if (blob.size > PARTNER_AVATAR_MAX_BYTES) {
    throw new Error("Das zugeschnittene Bild ist zu groß. Bitte zoomen Sie näher heran.");
  }

  return new File([blob], "avatar.jpg", { type: "image/jpeg" });
}

export function PartnerAvatarCropModal({ open, imageSrc, onClose, onConfirm, busy = false }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropState>({ zoom: 1, offsetX: 0, offsetY: 0 });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    setError(null);
    setCrop({ zoom: 1, offsetX: 0, offsetY: 0 });
  }, [open, imageSrc]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (busy || exporting) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: crop.offsetX, oy: crop.offsetY };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || busy || exporting) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setCrop((c) => ({ ...c, offsetX: dragStart.current!.ox + dx, offsetY: dragStart.current!.oy + dy }));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStart.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      dragStart.current = null;
    }
  };

  const handleConfirm = useCallback(async () => {
    const img = imgRef.current;
    if (!img || !loaded) return;
    setError(null);
    setExporting(true);
    try {
      const file = await exportCircularAvatar(img, crop);
      onConfirm(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Zuschneiden fehlgeschlagen.");
    } finally {
      setExporting(false);
    }
  }, [crop, loaded, onConfirm]);

  if (!open) return null;

  const img = imgRef.current;
  const baseScale = img && loaded ? Math.max(VIEWPORT / img.naturalWidth, VIEWPORT / img.naturalHeight) : 1;
  const scale = baseScale * crop.zoom;
  const drawW = img && loaded ? img.naturalWidth * scale : VIEWPORT;
  const drawH = img && loaded ? img.naturalHeight * scale : VIEWPORT;
  const drawX = (VIEWPORT - drawW) / 2 + crop.offsetX;
  const drawY = (VIEWPORT - drawH) / 2 + crop.offsetY;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatar-crop-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <h2 id="avatar-crop-title" className="text-lg font-bold text-[#0F4F68]">
          Bild zuschneiden
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Ziehen Sie das Bild, bis es im Kreis passt. Mit dem Regler zoomen Sie hinein oder heraus.
        </p>

        <div
          className="relative mx-auto mt-5 touch-none select-none overflow-hidden rounded-full bg-neutral-100"
          style={{ width: VIEWPORT, height: VIEWPORT }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt=""
            className="pointer-events-none absolute max-w-none"
            style={{
              width: drawW,
              height: drawH,
              left: drawX,
              top: drawY,
              opacity: loaded ? 1 : 0,
            }}
            onLoad={() => setLoaded(true)}
            draggable={false}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/90 ring-offset-0"
            aria-hidden
          />
        </div>

        <label className="mt-5 block text-sm font-semibold text-[#0F4F68]" htmlFor="avatar-crop-zoom">
          Zoom
        </label>
        <input
          id="avatar-crop-zoom"
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={crop.zoom}
          disabled={busy || exporting || !loaded}
          onChange={(e) =>
            setCrop((c) => ({ ...c, zoom: clamp(Number(e.target.value), MIN_ZOOM, MAX_ZOOM) }))
          }
          className="mt-2 w-full accent-[#0F4F68]"
        />

        {error ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy || exporting}
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            type="button"
            disabled={busy || exporting || !loaded}
            onClick={() => void handleConfirm()}
            className="flex-1 rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-50"
          >
            {exporting ? "Wird gespeichert…" : "Übernehmen"}
          </button>
        </div>
      </div>
    </div>
  );
}
