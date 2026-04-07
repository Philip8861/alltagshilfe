"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  canvasBaselineYFromPdfY,
  canvasXFromPdfX,
  drawPlainTextOverlay,
  drawTrackedTextOverlay,
  pdfCoordsFromCanvasPixel,
} from "@/lib/pdf/canvas-overlay-preview";

const DISPLAY_SCALE = 1.5;

const PRESETS = [
  { id: "geburtsdatum", label: "Geburtsdatum (ohne Punkte)", text: "15031990", tracked: true },
  { id: "versichertennummer", label: "Versichertennummer", text: "123456789012", tracked: true },
  { id: "name", label: "Name (ohne Tracking)", text: "Mustermann, Max", tracked: false },
  { id: "adresse", label: "Adresse (ohne Tracking)", text: "Musterstraße 12 87700 Memmingen", tracked: false },
] as const;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function PdfLayoutLab() {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<{ destroy?: () => void; numPages: number; getPage: (n: number) => Promise<unknown> } | null>(
    null,
  );
  const renderGenRef = useRef(0);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageIndex0, setPageIndex0] = useState(0);
  const [pageSizePt, setPageSizePt] = useState<{ w: number; h: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);

  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const [sampleText, setSampleText] = useState<string>(PRESETS[0].text);
  const [useTracking, setUseTracking] = useState<boolean>(PRESETS[0].tracked);

  const [pdfX, setPdfX] = useState(212);
  const [pdfY, setPdfY] = useState(711);
  const [trackingPt, setTrackingPt] = useState(4.5);
  const [fontSizePt, setFontSizePt] = useState(11);

  useEffect(() => {
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0];
    setSampleText(p.text);
    setUseTracking(p.tracked);
  }, [presetId]);

  const redrawOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    const pdfCv = pdfCanvasRef.current;
    if (!overlay || !pdfCv || !pageSizePt || !canvasSize) return;
    overlay.width = canvasSize.w;
    overlay.height = canvasSize.h;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const common = {
      text: sampleText,
      pdfX,
      pdfY,
      fontSizePt,
      pageW: pageSizePt.w,
      pageH: pageSizePt.h,
      canvasW: canvasSize.w,
      canvasH: canvasSize.h,
    };

    if (useTracking) {
      drawTrackedTextOverlay(ctx, { ...common, trackingPt });
    } else {
      drawPlainTextOverlay(ctx, common);
    }

    ctx.save();
    ctx.strokeStyle = "rgba(220, 38, 38, 0.85)";
    ctx.lineWidth = 1;
    const markX = canvasXFromPdfX(pdfX, pageSizePt.w, canvasSize.w);
    const markY = canvasBaselineYFromPdfY(pdfY, pageSizePt.h, canvasSize.h);
    const s = 6;
    ctx.beginPath();
    ctx.moveTo(markX - s, markY);
    ctx.lineTo(markX + s, markY);
    ctx.moveTo(markX, markY - s);
    ctx.lineTo(markX, markY + s);
    ctx.stroke();
    ctx.restore();
  }, [pageSizePt, canvasSize, sampleText, pdfX, pdfY, trackingPt, fontSizePt, useTracking]);

  const renderPdfPage = useCallback(async (pageIndex: number) => {
    const pdfCv = pdfCanvasRef.current;
    const doc = pdfDocRef.current as {
      getPage: (i: number) => Promise<{
        getViewport: (opts: { scale: number }) => { width: number; height: number };
        render: (opts: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }) => { promise: Promise<void> };
      }>;
    } | null;
    if (!pdfCv || !doc) return;

    const gen = ++renderGenRef.current;
    setLoading(true);
    setError(null);

    try {
      const page = await doc.getPage(pageIndex + 1);
      if (gen !== renderGenRef.current) return;

      const vp1 = page.getViewport({ scale: 1 });
      setPageSizePt({ w: vp1.width, h: vp1.height });

      const viewport = page.getViewport({ scale: DISPLAY_SCALE });
      const ctx = pdfCv.getContext("2d");
      if (!ctx) {
        setError("Canvas-Kontext nicht verfügbar.");
        return;
      }

      const w = Math.floor(viewport.width);
      const h = Math.floor(viewport.height);
      pdfCv.width = w;
      pdfCv.height = h;
      setCanvasSize({ w, h });

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      await page.render({ canvasContext: ctx, viewport }).promise;
      if (gen !== renderGenRef.current) return;
    } catch (e) {
      if (gen === renderGenRef.current) {
        setError(e instanceof Error ? e.message : "Seite konnte nicht gerendert werden.");
      }
    } finally {
      if (gen === renderGenRef.current) setLoading(false);
    }
  }, []);

  const onFile = async (file: File | null) => {
    setError(null);
    setNumPages(0);
    setPageIndex0(0);
    setPageSizePt(null);
    setCanvasSize(null);
    renderGenRef.current++;
    pdfDocRef.current?.destroy?.();
    pdfDocRef.current = null;

    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Bitte eine PDF-Datei wählen.");
      return;
    }

    setLoading(true);
    try {
      const pdfjs = await import("pdfjs-dist");
      if (typeof window !== "undefined") {
        pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdfjs/pdf.worker.min.mjs`;
      }
      const data = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data }).promise;
      pdfDocRef.current = pdf;
      setNumPages(pdf.numPages);
      setPageIndex0(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF konnte nicht geladen werden.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pdfDocRef.current || numPages === 0) return;
    void renderPdfPage(pageIndex0);
  }, [pageIndex0, numPages, renderPdfPage]);

  useEffect(() => {
    if (!canvasSize || !pageSizePt) return;
    const o = overlayRef.current;
    if (o) {
      o.width = canvasSize.w;
      o.height = canvasSize.h;
    }
    redrawOverlay();
  }, [canvasSize, pageSizePt, redrawOverlay]);

  const onOverlayClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const overlay = overlayRef.current;
    if (!overlay || !pageSizePt || loading) return;
    const rect = overlay.getBoundingClientRect();
    const sx = overlay.width / rect.width;
    const sy = overlay.height / rect.height;
    const cx = (e.clientX - rect.left) * sx;
    const cy = (e.clientY - rect.top) * sy;
    const { pdfX: x, pdfY: y } = pdfCoordsFromCanvasPixel(
      cx,
      cy,
      pageSizePt.w,
      pageSizePt.h,
      overlay.width,
      overlay.height,
    );
    setPdfX(round2(x));
    setPdfY(round2(y));
  };

  const exportJson = {
    pageIndex: pageIndex0,
    x: round2(pdfX),
    y: round2(pdfY),
    ...(useTracking ? { trackingPt: round2(trackingPt) } : {}),
    fontSizePt,
    presetHint: presetId,
    note: useTracking
      ? "trackingPt = zusätzlicher Abstand zwischen Glyphen (PDF-Punkt), wie drawTextWithTracking"
      : "ohne trackingPt — einfaches drawText",
  };

  const jsonStr = JSON.stringify(exportJson, null, 2);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonStr);
    } catch {
      setError("Zwischenablage nicht verfügbar.");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/partner/admin"
          className="text-sm font-medium text-[#0F4F68] underline-offset-2 hover:underline"
        >
          ← Zurück zum Admin
        </Link>
        <Link
          href="/partner/admin/pdf-coords"
          className="text-sm font-medium text-[#0F4F68] underline-offset-2 hover:underline"
        >
          PDF-Koordinaten
        </Link>
      </div>

      <div className="rounded-xl border border-[#0F4F68]/15 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-lg font-semibold text-neutral-900">PDF-Layout-Labor</h1>
        <p className="mt-2 text-sm text-neutral-600">
          PDF laden, Mustertext wählen, Position und Buchstabenabstand per Regler anpassen. Blauer Text
          ist die Vorschau (Canvas-Helvetica ≈ PDF); rotes Kreuz = gesetzter Ursprung (links unten, Baseline
          wie <code className="rounded bg-neutral-100 px-1 text-xs">pdf-lib</code>
          <code className="ml-1 rounded bg-neutral-100 px-1 text-xs">drawText</code>). Anschließend JSON
          kopieren und ins Projekt übernehmen.
        </p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-800">PDF-Datei</label>
          <input
            type="file"
            accept="application/pdf"
            className="mt-1 block w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0F4F68]/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#0F4F68]"
            onChange={(ev) => void onFile(ev.target.files?.[0] ?? null)}
          />
        </div>

        {numPages > 0 && (
          <>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-800" htmlFor="lab-page">
                  Seite
                </label>
                <select
                  id="lab-page"
                  className="mt-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                  value={pageIndex0}
                  onChange={(e) => setPageIndex0(Number(e.target.value))}
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <option key={i} value={i}>
                      {i + 1} / {numPages} (pageIndex {i})
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[12rem] flex-1">
                <label className="block text-sm font-medium text-neutral-800" htmlFor="lab-preset">
                  Vorlage
                </label>
                <select
                  id="lab-preset"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                  value={presetId}
                  onChange={(e) => setPresetId(e.target.value)}
                >
                  {PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-800" htmlFor="lab-text">
                Anzeigetext
              </label>
              <input
                id="lab-text"
                type="text"
                value={sampleText}
                onChange={(e) => setSampleText(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                autoComplete="off"
              />
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={useTracking}
                  onChange={(e) => setUseTracking(e.target.checked)}
                  className="rounded border-neutral-400"
                />
                Buchstabenabstand (Tracking) verwenden
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-neutral-800">x (PDF-Punkt)</span>
                <input
                  type="number"
                  step="0.1"
                  value={pdfX}
                  onChange={(e) => setPdfX(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
                <input
                  type="range"
                  min={0}
                  max={pageSizePt ? Math.round(pageSizePt.w) : 600}
                  step={0.5}
                  value={pdfX}
                  onChange={(e) => setPdfX(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-neutral-800">y / Baseline (PDF-Punkt)</span>
                <input
                  type="number"
                  step="0.1"
                  value={pdfY}
                  onChange={(e) => setPdfY(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
                <input
                  type="range"
                  min={0}
                  max={pageSizePt ? Math.round(pageSizePt.h) : 850}
                  step={0.5}
                  value={pdfY}
                  onChange={(e) => setPdfY(Number(e.target.value))}
                  className="mt-2 w-full"
                />
              </label>
            </div>

            {useTracking && (
              <label className="mt-4 block text-sm">
                <span className="font-medium text-neutral-800">trackingPt (Abstand zwischen Glyphen)</span>
                <input
                  type="number"
                  step={0.05}
                  min={0}
                  max={20}
                  value={trackingPt}
                  onChange={(e) => setTrackingPt(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:max-w-xs"
                />
                <input
                  type="range"
                  min={0}
                  max={8}
                  step={0.05}
                  value={trackingPt}
                  onChange={(e) => setTrackingPt(Number(e.target.value))}
                  className="mt-2 w-full sm:max-w-xl"
                />
              </label>
            )}

            <label className="mt-4 block text-sm sm:max-w-xs">
              <span className="font-medium text-neutral-800">Schriftgröße (pt)</span>
              <input
                type="number"
                step={0.5}
                min={6}
                max={24}
                value={fontSizePt}
                onChange={(e) => setFontSizePt(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
          </>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        {numPages > 0 && canvasSize && (
          <div className="mt-4">
            <p className="mb-2 text-xs text-neutral-500">
              Auf die blaue Vorschau klicken setzt x/y (Baseline am Klickpunkt).
            </p>
            <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-100 p-2">
              <div className="relative inline-block max-w-full leading-none">
                <canvas ref={pdfCanvasRef} className="block max-w-full bg-white" aria-hidden />
                <canvas
                  ref={overlayRef}
                  onClick={onOverlayClick}
                  className="absolute inset-0 h-full w-full cursor-crosshair touch-manipulation"
                  aria-label="Overlay: Klick setzt Position"
                />
              </div>
            </div>
            {loading && <p className="mt-2 text-center text-sm text-neutral-500">Rendern…</p>}
          </div>
        )}

        {numPages > 0 && pageSizePt && (
          <div className="mt-6 space-y-2 rounded-lg border border-[#0F4F68]/20 bg-[#F2F9FA] p-4">
            <p className="text-sm font-medium text-neutral-900">Export (in Cursor einfügen)</p>
            <pre className="max-h-64 overflow-auto rounded bg-white p-3 text-xs text-neutral-800 ring-1 ring-neutral-200">
              {jsonStr}
            </pre>
            <button
              type="button"
              onClick={() => void copyJson()}
              className="rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c4256]"
            >
              JSON kopieren
            </button>
            <p className="text-xs text-neutral-600">
              Seitengröße (Referenz): {round2(pageSizePt.w)} × {round2(pageSizePt.h)} pt
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
