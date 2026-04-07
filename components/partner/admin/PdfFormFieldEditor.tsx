"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  { id: "vorname_nachname", label: "Vorname Nachname", text: "Max Mustermann", tracked: false },
  {
    id: "strasse_ort",
    label: "Straße Hausnr. PLZ Ort",
    text: "Musterstraße 12 a 87700 Memmingen",
    tracked: false,
  },
  { id: "krankenkasse", label: "Krankenkasse", text: "AOK Bayern", tracked: false },
  { id: "checkbox_label", label: "Checkbox-Beschriftung (Text)", text: "Telefonisch", tracked: false },
  { id: "unterschrift", label: "Unterschrift (Hinweis)", text: "Unterschrift", tracked: false },
] as const;

export type PdfFieldDraft = {
  id: string;
  name: string;
  sampleText: string;
  useTracking: boolean;
  pageIndex0: number;
  x: number;
  y: number;
  trackingPt: number;
  fontSizePt: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function newFieldId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `feld-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createField(pageIndex0: number, preset?: (typeof PRESETS)[number]): PdfFieldDraft {
  const p = preset ?? PRESETS[0];
  return {
    id: newFieldId(),
    name: p.label,
    sampleText: p.text,
    useTracking: p.tracked,
    pageIndex0,
    x: 100,
    y: 700,
    trackingPt: 4.5,
    fontSizePt: 11,
  };
}

export function PdfFormFieldEditor() {
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<{ destroy?: () => void; numPages: number } | null>(null);
  const renderGenRef = useRef(0);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [pageIndex0, setPageIndex0] = useState(0);
  const [pageSizePt, setPageSizePt] = useState<{ w: number; h: number } | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ w: number; h: number } | null>(null);

  const [fields, setFields] = useState<PdfFieldDraft[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newPresetId, setNewPresetId] = useState<string>(PRESETS[0].id);

  const activeField = useMemo(
    () => fields.find((f) => f.id === activeId) ?? null,
    [fields, activeId],
  );

  const updateField = useCallback((id: string, patch: Partial<PdfFieldDraft>) => {
    setFields((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const addField = useCallback(() => {
    const preset = PRESETS.find((p) => p.id === newPresetId) ?? PRESETS[0];
    const f = createField(pageIndex0, preset);
    setFields((fs) => [...fs, f]);
    setActiveId(f.id);
  }, [pageIndex0, newPresetId]);

  const removeField = useCallback(
    (id: string) => {
      setFields((fs) => fs.filter((f) => f.id !== id));
      setActiveId((cur) => (cur === id ? null : cur));
    },
    [],
  );

  const redrawOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay || !pageSizePt || !canvasSize) return;
    overlay.width = canvasSize.w;
    overlay.height = canvasSize.h;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const onPage = fields.filter((f) => f.pageIndex0 === pageIndex0);
    for (const f of onPage) {
      const isActive = f.id === activeId;
      const fill = isActive ? "rgba(37, 99, 235, 0.9)" : "rgba(22, 163, 74, 0.72)";
      const common = {
        text: f.sampleText,
        pdfX: f.x,
        pdfY: f.y,
        fontSizePt: f.fontSizePt,
        pageW: pageSizePt.w,
        pageH: pageSizePt.h,
        canvasW: canvasSize.w,
        canvasH: canvasSize.h,
        fillStyle: fill,
      };
      if (f.useTracking) {
        drawTrackedTextOverlay(ctx, { ...common, trackingPt: f.trackingPt });
      } else {
        drawPlainTextOverlay(ctx, common);
      }

      const markX = canvasXFromPdfX(f.x, pageSizePt.w, canvasSize.w);
      const markY = canvasBaselineYFromPdfY(f.y, pageSizePt.h, canvasSize.h);
      ctx.save();
      ctx.strokeStyle = isActive ? "rgba(220, 38, 38, 0.95)" : "rgba(34, 197, 94, 0.7)";
      ctx.lineWidth = isActive ? 1.5 : 1;
      const s = isActive ? 7 : 5;
      ctx.beginPath();
      ctx.moveTo(markX - s, markY);
      ctx.lineTo(markX + s, markY);
      ctx.moveTo(markX, markY - s);
      ctx.lineTo(markX, markY + s);
      ctx.stroke();
      ctx.restore();
    }
  }, [fields, activeId, pageIndex0, pageSizePt, canvasSize]);

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
    setFields([]);
    setActiveId(null);
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
    redrawOverlay();
  }, [canvasSize, pageSizePt, redrawOverlay]);

  const onOverlayClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const overlay = overlayRef.current;
    if (!overlay || !pageSizePt || loading || !activeId) {
      if (!activeId) setError("Bitte zuerst ein Feld anlegen oder in der Liste auswählen.");
      return;
    }
    setError(null);
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
    updateField(activeId, { x: round2(x), y: round2(y), pageIndex0 });
  };

  const exportActiveJson = useMemo(() => {
    if (!activeField) return "";
    const o: Record<string, unknown> = {
      name: activeField.name,
      pageIndex: activeField.pageIndex0,
      x: round2(activeField.x),
      y: round2(activeField.y),
      fontSizePt: activeField.fontSizePt,
    };
    if (activeField.useTracking) o.trackingPt = round2(activeField.trackingPt);
    return JSON.stringify(o, null, 2);
  }, [activeField]);

  const exportAllJson = useMemo(() => {
    const payload = {
      pageSizePtRef: pageSizePt ? { w: round2(pageSizePt.w), h: round2(pageSizePt.h) } : null,
      fields: fields.map((f) => {
        const o: Record<string, unknown> = {
          name: f.name,
          pageIndex: f.pageIndex0,
          x: round2(f.x),
          y: round2(f.y),
          fontSizePt: f.fontSizePt,
          sampleText: f.sampleText,
          useTracking: f.useTracking,
        };
        if (f.useTracking) o.trackingPt = round2(f.trackingPt);
        return o;
      }),
    };
    return JSON.stringify(payload, null, 2);
  }, [fields, pageSizePt]);

  const copyActive = async () => {
    if (!exportActiveJson) return;
    try {
      await navigator.clipboard.writeText(exportActiveJson);
    } catch {
      setError("Zwischenablage nicht verfügbar.");
    }
  };

  const copyAll = async () => {
    if (!fields.length) return;
    try {
      await navigator.clipboard.writeText(exportAllJson);
    } catch {
      setError("Zwischenablage nicht verfügbar.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-0">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/partner/admin"
          className="text-sm font-medium text-[#0F4F68] underline-offset-2 hover:underline"
        >
          ← Zurück zum Admin
        </Link>
      </div>

      <div className="rounded-xl border border-dashed border-[#0F4F68]/30 bg-[#F2F9FA]/70 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-neutral-900">Befülltes Test-PDF (Server)</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Fertige Vorschau mit Mustermann-Daten: Vorlage{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-neutral-200">
            private/forms/form-v1-blank.pdf
          </code>
        </p>
        <a
          href="/partner/admin/pdf-form-preview"
          className="mt-3 inline-flex rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c4256]"
        >
          PDF herunterladen (Max Mustermann)
        </a>
      </div>

      <div className="rounded-xl border border-[#0F4F68]/15 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-lg font-semibold text-neutral-900">PDF-Formularfelder</h1>
        <p className="mt-2 text-sm text-neutral-600">
          PDF laden, Felder anlegen, aktives Feld wählen, auf die Vorschau klicken für Position, Regler für
          Feintuning. Alles auf dieser Seite — blau = aktives Feld, grün = weitere Felder auf derselben
          Seite. Koordinaten wie <code className="rounded bg-neutral-100 px-1 text-xs">pdf-lib</code> (unten
          links, Baseline).
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
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_min(22rem,100%)] lg:items-start">
            <div className="lg:sticky lg:top-4">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-neutral-800" htmlFor="editor-page">
                  Seite
                </label>
                <select
                  id="editor-page"
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
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
              <p className="mb-2 text-xs text-neutral-500">
                Klick auf die Vorschau setzt <strong>x / y</strong> für das <strong>aktive</strong> Feld
                (rotes Kreuz).
              </p>
              <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-100 p-2">
                <div className="relative inline-block max-w-full leading-none">
                  <canvas ref={pdfCanvasRef} className="block max-w-full bg-white" aria-hidden />
                  <canvas
                    ref={overlayRef}
                    onClick={onOverlayClick}
                    className="absolute inset-0 h-full w-full cursor-crosshair touch-manipulation"
                    aria-label="PDF mit Feldvorschau"
                  />
                </div>
              </div>
              {loading && <p className="mt-2 text-center text-sm text-neutral-500">Rendern…</p>}
            </div>

            <div className="space-y-4 rounded-lg border border-neutral-200 bg-[#FAFBFC] p-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Felder</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <select
                    className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm"
                    value={newPresetId}
                    onChange={(e) => setNewPresetId(e.target.value)}
                    aria-label="Vorlage für neues Feld"
                  >
                    {PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addField}
                    className="rounded-lg bg-[#0F4F68] px-3 py-2 text-sm font-medium text-white hover:bg-[#0c4256]"
                  >
                    Feld hinzufügen
                  </button>
                </div>
              </div>

              {fields.length === 0 ? (
                <p className="text-sm text-neutral-600">Noch keine Felder — „Feld hinzufügen“ wählen.</p>
              ) : (
                <ul className="max-h-48 space-y-1 overflow-y-auto rounded border border-neutral-200 bg-white p-2 text-sm">
                  {fields.map((f) => (
                    <li key={f.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveId(f.id);
                          if (f.pageIndex0 !== pageIndex0) setPageIndex0(f.pageIndex0);
                        }}
                        className={`min-w-0 flex-1 truncate rounded px-2 py-1.5 text-left ${
                          f.id === activeId
                            ? "bg-[#0F4F68]/12 font-medium text-[#0F4F68]"
                            : "hover:bg-neutral-100"
                        }`}
                      >
                        {f.name}{" "}
                        <span className="font-normal text-neutral-500">
                          (S.{f.pageIndex0 + 1} · {round2(f.x)},{round2(f.y)})
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeField(f.id)}
                        className="shrink-0 rounded px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                        aria-label={`${f.name} löschen`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {activeField && pageSizePt && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800" htmlFor="f-name">
                      Bezeichnung
                    </label>
                    <input
                      id="f-name"
                      value={activeField.name}
                      onChange={(e) => updateField(activeField.id, { name: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800" htmlFor="f-text">
                      Mustertext (Vorschau)
                    </label>
                    <input
                      id="f-text"
                      value={activeField.sampleText}
                      onChange={(e) => updateField(activeField.id, { sampleText: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      checked={activeField.useTracking}
                      onChange={(e) => updateField(activeField.id, { useTracking: e.target.checked })}
                      className="rounded border-neutral-400"
                    />
                    Buchstabenabstand (Tracking)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm">
                      <span className="font-medium text-neutral-800">x</span>
                      <input
                        type="number"
                        step={0.1}
                        value={activeField.x}
                        onChange={(e) => updateField(activeField.id, { x: Number(e.target.value) })}
                        className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                      />
                      <input
                        type="range"
                        min={0}
                        max={pageSizePt ? Math.round(pageSizePt.w) : 600}
                        step={0.5}
                        value={activeField.x}
                        onChange={(e) => updateField(activeField.id, { x: Number(e.target.value) })}
                        className="mt-1 w-full"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="font-medium text-neutral-800">y</span>
                      <input
                        type="number"
                        step={0.1}
                        value={activeField.y}
                        onChange={(e) => updateField(activeField.id, { y: Number(e.target.value) })}
                        className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                      />
                      <input
                        type="range"
                        min={0}
                        max={pageSizePt ? Math.round(pageSizePt.h) : 850}
                        step={0.5}
                        value={activeField.y}
                        onChange={(e) => updateField(activeField.id, { y: Number(e.target.value) })}
                        className="mt-1 w-full"
                      />
                    </label>
                  </div>
                  <label className="text-sm">
                    <span className="font-medium text-neutral-800">Seite (pageIndex)</span>
                    <select
                      className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                      value={activeField.pageIndex0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        updateField(activeField.id, { pageIndex0: v });
                        setPageIndex0(v);
                      }}
                    >
                      {Array.from({ length: numPages }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </label>
                  {activeField.useTracking && (
                    <label className="text-sm">
                      <span className="font-medium text-neutral-800">trackingPt</span>
                      <input
                        type="number"
                        step={0.05}
                        min={0}
                        value={activeField.trackingPt}
                        onChange={(e) =>
                          updateField(activeField.id, { trackingPt: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                      />
                      <input
                        type="range"
                        min={0}
                        max={8}
                        step={0.05}
                        value={activeField.trackingPt}
                        onChange={(e) =>
                          updateField(activeField.id, { trackingPt: Number(e.target.value) })
                        }
                        className="mt-1 w-full"
                      />
                    </label>
                  )}
                  <label className="text-sm">
                    <span className="font-medium text-neutral-800">Schriftgröße (pt)</span>
                    <input
                      type="number"
                      step={0.5}
                      min={6}
                      max={24}
                      value={activeField.fontSizePt}
                      onChange={(e) =>
                        updateField(activeField.id, { fontSizePt: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                </>
              )}

              <div className="space-y-2 border-t border-neutral-200 pt-4">
                <p className="text-sm font-medium text-neutral-900">Koordinaten (kopieren)</p>
                {activeField ? (
                  <>
                    <pre className="max-h-40 overflow-auto rounded bg-white p-2 text-xs ring-1 ring-neutral-200">
                      {exportActiveJson}
                    </pre>
                    <button
                      type="button"
                      onClick={() => void copyActive()}
                      className="w-full rounded-lg bg-[#0F4F68] px-3 py-2 text-sm font-medium text-white hover:bg-[#0c4256]"
                    >
                      Aktives Feld kopieren
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-neutral-500">Feld auswählen für Einzel-JSON.</p>
                )}
                {fields.length > 0 && (
                  <>
                    <p className="pt-2 text-xs font-medium text-neutral-700">Alle Felder</p>
                    <pre className="max-h-36 overflow-auto rounded bg-white p-2 text-xs ring-1 ring-neutral-200">
                      {exportAllJson}
                    </pre>
                    <button
                      type="button"
                      onClick={() => void copyAll()}
                      className="w-full rounded-lg border border-[#0F4F68] bg-white px-3 py-2 text-sm font-medium text-[#0F4F68] hover:bg-[#F2F9FA]"
                    >
                      Alle Felder kopieren
                    </button>
                  </>
                )}
                {pageSizePt && (
                  <p className="text-xs text-neutral-500">
                    Seite: {round2(pageSizePt.w)} × {round2(pageSizePt.h)} pt
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
