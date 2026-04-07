"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** Anzeige-Skalierung (Canvas-Pixel); Koordinaten werden auf PDF-Punkte (scale 1) umgerechnet. */
const DISPLAY_SCALE = 1.5;

type PdfPoint = { pageIndex0: number; x: number; y: number };

export function PdfCoordinatePicker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageIndex0, setPageIndex0] = useState(0);
  const [pageSizePt, setPageSizePt] = useState<{ w: number; h: number } | null>(null);
  const [lastPoint, setLastPoint] = useState<PdfPoint | null>(null);
  const pdfDocRef = useRef<{ destroy?: () => void } | null>(null);
  const renderGenRef = useRef(0);

  const renderPage = useCallback(async (pageIndex: number) => {
    const canvas = canvasRef.current;
    const doc = pdfDocRef.current as {
      getPage: (i: number) => Promise<{
        getViewport: (opts: { scale: number }) => { width: number; height: number };
        render: (opts: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
        }) => { promise: Promise<void> };
      }>;
    } | null;
    if (!canvas || !doc) return;

    const gen = ++renderGenRef.current;
    setLoading(true);
    setError(null);

    try {
      const page = await doc.getPage(pageIndex + 1);
      if (gen !== renderGenRef.current) return;

      const vp1 = page.getViewport({ scale: 1 });
      setPageSizePt({ w: vp1.width, h: vp1.height });

      const viewport = page.getViewport({ scale: DISPLAY_SCALE });
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Canvas-Kontext nicht verfügbar.");
        return;
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    setLastPoint(null);
    setNumPages(0);
    setPageIndex0(0);
    setPageSizePt(null);
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
      const loadingTask = pdfjs.getDocument({ data });
      const pdf = await loadingTask.promise;
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
    void renderPage(pageIndex0);
  }, [pageIndex0, numPages, renderPage]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !pageSizePt || loading) return;

    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * sx;
    const cy = (e.clientY - rect.top) * sy;

    const pdfX = (cx / canvas.width) * pageSizePt.w;
    const pdfY = pageSizePt.h - (cy / canvas.height) * pageSizePt.h;

    setLastPoint({
      pageIndex0: pageIndex0,
      x: Math.round(pdfX * 100) / 100,
      y: Math.round(pdfY * 100) / 100,
    });
  };

  const jsonSnippet =
    lastPoint != null
      ? JSON.stringify(
          { pageIndex: lastPoint.pageIndex0, x: lastPoint.x, y: lastPoint.y },
          null,
          2,
        )
      : "";

  const copyJson = async () => {
    if (!jsonSnippet) return;
    try {
      await navigator.clipboard.writeText(jsonSnippet);
    } catch {
      setError("Zwischenablage nicht verfügbar.");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/partner/admin"
          className="text-sm font-medium text-[#0F4F68] underline-offset-2 hover:underline"
        >
          ← Zurück zum Admin
        </Link>
      </div>

      <div className="rounded-xl border border-dashed border-[#0F4F68]/30 bg-[#F2F9FA]/70 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-neutral-900">Formular-Vorschau (Testdaten)</h2>
        <p className="mt-1 text-sm text-neutral-600">
          PDF mit <strong>Mustermann, Max</strong> und Geburtsdatum <strong>15.03.1990</strong> — ohne
          Konfigurator. Vorlage ablegen als{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-neutral-200">
            private/forms/form-v1-blank.pdf
          </code>{" "}
          oder Pfad in <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-neutral-200">FORM_V1_PDF_TEMPLATE_PATH</code>{" "}
          setzen.
        </p>
        <a
          href="/partner/admin/pdf-form-preview"
          className="mt-3 inline-flex rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c4256] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
        >
          PDF herunterladen (Max Mustermann)
        </a>
      </div>

      <div className="rounded-xl border border-[#0F4F68]/15 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-lg font-semibold text-neutral-900">PDF-Koordinaten (pdf-lib)</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Flaches PDF hochladen, Seite wählen und auf die Stelle tippen. Die Werte sind in{" "}
          <strong>PDF-Punkten</strong> mit Ursprung <strong>unten links</strong> (wie bei{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">pdf-lib</code>
          <code className="ml-1 rounded bg-neutral-100 px-1 py-0.5 text-xs">page.drawText</code>).
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
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-neutral-800" htmlFor="pdf-page">
              Seite (Anzeige)
            </label>
            <select
              id="pdf-page"
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900"
              value={pageIndex0}
              onChange={(e) => setPageIndex0(Number(e.target.value))}
            >
              {Array.from({ length: numPages }, (_, i) => (
                <option key={i} value={i}>
                  {i + 1} von {numPages}
                </option>
              ))}
            </select>
            <span className="text-xs text-neutral-500">
              pdf-lib <code className="rounded bg-neutral-100 px-1">pageIndex</code>: {pageIndex0}{" "}
              (0-basiert)
            </span>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        {numPages > 0 && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-2">
            <canvas
              ref={canvasRef}
              className="max-w-full cursor-crosshair touch-manipulation"
              onClick={onCanvasClick}
              aria-label="PDF-Vorschau, Klick für Koordinaten"
            />
            {loading && (
              <p className="mt-2 text-center text-sm text-neutral-500">Rendern…</p>
            )}
          </div>
        )}

        {lastPoint && pageSizePt && (
          <div className="mt-4 space-y-2 rounded-lg border border-[#0F4F68]/20 bg-[#F2F9FA] p-4">
            <p className="text-sm font-medium text-neutral-900">Letzter Klick (pdf-lib)</p>
            <ul className="list-inside list-disc text-sm text-neutral-700">
              <li>
                <code className="text-xs">pageIndex</code>: {lastPoint.pageIndex0}
              </li>
              <li>
                <code className="text-xs">x</code>: {lastPoint.x} pt
              </li>
              <li>
                <code className="text-xs">y</code>: {lastPoint.y} pt
              </li>
              <li>
                Seitenhöhe (Referenz): {Math.round(pageSizePt.h * 100) / 100} pt
              </li>
            </ul>
            <pre className="overflow-x-auto rounded bg-white p-3 text-xs text-neutral-800 ring-1 ring-neutral-200">
              {jsonSnippet}
            </pre>
            <button
              type="button"
              onClick={() => void copyJson()}
              className="rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c4256]"
            >
              JSON kopieren
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
