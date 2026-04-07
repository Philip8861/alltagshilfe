"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  canvasBaselineYFromPdfY,
  canvasXFromPdfX,
  drawCheckboxOverlayPreview,
  drawCheckmarkXOnlyOverlay,
  drawPdfHorizontalLineOverlay,
  drawPlainTextOverlay,
  drawTrackedTextOverlay,
  pdfCoordsFromCanvasPixel,
} from "@/lib/pdf/canvas-overlay-preview";
import type { FormV1DataFieldId } from "@/lib/pdf/form-v1-data-fields";
import { FORM_V1_DATA_FIELDS, getFormV1DataFieldMeta } from "@/lib/pdf/form-v1-data-fields";
import {
  allDraftsFromRepoConfig,
  createDraftFromFieldId,
  draftToPlacement,
  draftsFromPlacementsJson,
  type PdfFormV1FieldDraft,
} from "@/lib/pdf/form-v1-editor-draft";

/** Basis-Skalierung für pdf.js; tatsächliche Größe = Basis × (Vorschau-% / 100). */
const PDF_RENDER_BASE_SCALE = 1.5;
const PREVIEW_PERCENT_MIN = 35;
const PREVIEW_PERCENT_MAX = 100;
const FIELD_LIST_HEIGHT_MIN = 180;
const FIELD_LIST_HEIGHT_MAX = 900;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function newFieldId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `feld-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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

  const [fields, setFields] = useState<PdfFormV1FieldDraft[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newFieldIdToAdd, setNewFieldIdToAdd] = useState<FormV1DataFieldId>(
    FORM_V1_DATA_FIELDS[0]!.id,
  );
  const [importText, setImportText] = useState("");
  /** Vorschau-Größe in % der Basisskalierung (kleiner = mehr Rand, nichts abgeschnitten). */
  const [previewPercent, setPreviewPercent] = useState(62);
  /** Max. Höhe der scrollbaren Datenfeldliste (px). */
  const [fieldListMaxHeightPx, setFieldListMaxHeightPx] = useState(420);

  const renderScale = useMemo(
    () => (PDF_RENDER_BASE_SCALE * previewPercent) / 100,
    [previewPercent],
  );

  const activeField = useMemo(
    () => fields.find((f) => f.id === activeId) ?? null,
    [fields, activeId],
  );

  const updateField = useCallback((id: string, patch: Partial<PdfFormV1FieldDraft>) => {
    setFields((fs) =>
      fs.map((f) => (f.id === id ? ({ ...f, ...patch } as PdfFormV1FieldDraft) : f)),
    );
  }, []);

  const addField = useCallback(() => {
    if (fields.some((f) => f.fieldId === newFieldIdToAdd)) {
      setError("Dieses Datenfeld ist schon in der Liste — zuerst entfernen oder anderes wählen.");
      return;
    }
    setError(null);
    const f = createDraftFromFieldId(newFieldIdToAdd, newFieldId());
    setFields((fs) => [...fs, f]);
    setActiveId(f.id);
  }, [fields, newFieldIdToAdd]);

  const loadAllFromRepo = useCallback(() => {
    setError(null);
    const list = allDraftsFromRepoConfig(newFieldId);
    setFields(list);
    setActiveId(list[0]?.id ?? null);
    setPageIndex0(0);
  }, []);

  const removeField = useCallback((id: string) => {
    setFields((fs) => fs.filter((f) => f.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

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
      const stroke = isActive ? "rgba(220, 38, 38, 0.95)" : "rgba(34, 197, 94, 0.75)";
      const fill = isActive ? "rgba(37, 99, 235, 0.9)" : "rgba(22, 163, 74, 0.72)";
      const meta = getFormV1DataFieldMeta(f.fieldId);

      const commonPage = {
        pageW: pageSizePt.w,
        pageH: pageSizePt.h,
        canvasW: canvasSize.w,
        canvasH: canvasSize.h,
      };

      if (f.shape === "text") {
        const useTrack = meta.kind === "trackedText" && (f.trackingPt ?? 0) > 0;
        if (useTrack) {
          drawTrackedTextOverlay(ctx, {
            text: meta.sampleText,
            pdfX: f.x,
            pdfY: f.y,
            trackingPt: f.trackingPt ?? 0,
            fontSizePt: f.fontSizePt,
            fillStyle: fill,
            ...commonPage,
          });
        } else {
          drawPlainTextOverlay(ctx, {
            text: meta.sampleText,
            pdfX: f.x,
            pdfY: f.y,
            fontSizePt: f.fontSizePt,
            fillStyle: fill,
            ...commonPage,
          });
        }
      } else if (f.shape === "checkbox") {
        const checkedPreview = f.fieldId === "kontaktTelefonisch";
        drawCheckboxOverlayPreview(ctx, {
          pdfBoxLeftX: f.boxLeftX,
          pdfYBaseline: f.yBaseline,
          label: meta.checkboxLabel ?? "",
          fontSizePt: f.fontSizePt,
          strokeStyle: stroke,
          fillStyle: fill,
          checkedPreview,
          ...commonPage,
        });
      } else if (f.shape === "checkmarkOnly") {
        drawCheckmarkXOnlyOverlay(ctx, {
          pdfBoxLeftX: f.boxLeftX,
          pdfYBaseline: f.yBaseline,
          fontSizePt: f.fontSizePt,
          strokeStyle: stroke,
          ...commonPage,
        });
      } else if (f.shape === "signatureLabel") {
        drawPlainTextOverlay(ctx, {
          text: meta.sampleText || "Unterschrift",
          pdfX: f.x,
          pdfY: f.y,
          fontSizePt: f.fontSizePt,
          fillStyle: fill,
          ...commonPage,
        });
      } else if (f.shape === "signatureGraphic") {
        const cx = canvasXFromPdfX(f.x, pageSizePt.w, canvasSize.w);
        const cy = canvasBaselineYFromPdfY(f.y, pageSizePt.h, canvasSize.h);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((f.rotateDeg * Math.PI) / 180);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = Math.max(1, f.borderWidth * 1.2);
        ctx.beginPath();
        ctx.moveTo(0, 4);
        ctx.bezierCurveTo(8, -8, 28, -6, 38, 2);
        ctx.bezierCurveTo(48, 10, 58, -4, 68, 4);
        ctx.stroke();
        ctx.restore();
      } else if (f.shape === "signatureLine") {
        drawPdfHorizontalLineOverlay(ctx, {
          pdfX1: f.x1,
          pdfX2: f.x2,
          pdfY: f.lineY,
          strokeStyle: stroke,
          ...commonPage,
        });
      }

      let markPdfX = 0;
      let markPdfY = 0;
      if (f.shape === "text" || f.shape === "signatureLabel" || f.shape === "signatureGraphic") {
        markPdfX = f.x;
        markPdfY = f.y;
      } else if (f.shape === "checkbox" || f.shape === "checkmarkOnly") {
        markPdfX = f.boxLeftX;
        markPdfY = f.yBaseline;
      } else {
        markPdfX = f.x1;
        markPdfY = f.lineY;
      }
      const markX = canvasXFromPdfX(markPdfX, pageSizePt.w, canvasSize.w);
      const markY = canvasBaselineYFromPdfY(markPdfY, pageSizePt.h, canvasSize.h);
      ctx.save();
      ctx.strokeStyle = stroke;
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

      const viewport = page.getViewport({ scale: renderScale });
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
  }, [renderScale]);

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
  }, [pageIndex0, numPages, renderScale, renderPdfPage]);

  useEffect(() => {
    if (!canvasSize || !pageSizePt) return;
    redrawOverlay();
  }, [canvasSize, pageSizePt, redrawOverlay]);

  const onOverlayClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const overlay = overlayRef.current;
    if (!overlay || !pageSizePt || loading || !activeField) {
      if (!activeField) setError("Bitte zuerst ein Datenfeld anlegen oder in der Liste auswählen.");
      return;
    }
    setError(null);
    const rect = overlay.getBoundingClientRect();
    const sx = overlay.width / rect.width;
    const sy = overlay.height / rect.height;
    const cx = (e.clientX - rect.left) * sx;
    const cy = (e.clientY - rect.top) * sy;
    const { pdfX, pdfY } = pdfCoordsFromCanvasPixel(
      cx,
      cy,
      pageSizePt.w,
      pageSizePt.h,
      overlay.width,
      overlay.height,
    );

    if (
      activeField.shape === "text" ||
      activeField.shape === "signatureLabel" ||
      activeField.shape === "signatureGraphic"
    ) {
      updateField(activeField.id, { x: round2(pdfX), y: round2(pdfY), pageIndex0 });
    } else if (activeField.shape === "checkbox" || activeField.shape === "checkmarkOnly") {
      updateField(activeField.id, {
        boxLeftX: round2(pdfX),
        yBaseline: round2(pdfY),
        pageIndex0,
      });
    } else if (activeField.shape === "signatureLine") {
      updateField(activeField.id, {
        x1: round2(pdfX),
        lineY: round2(pdfY),
        pageIndex0,
      });
    }
  };

  const exportPlacementsObject = useMemo(() => {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      out[f.fieldId] = draftToPlacement(f);
    }
    return JSON.stringify(out, null, 2);
  }, [fields]);

  const exportActivePlacement = useMemo(() => {
    if (!activeField) return "";
    return JSON.stringify(
      { [activeField.fieldId]: draftToPlacement(activeField) },
      null,
      2,
    );
  }, [activeField]);

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError("Zwischenablage nicht verfügbar.");
    }
  };

  const runImport = () => {
    setError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(importText) as unknown;
    } catch {
      setError("JSON konnte nicht gelesen werden.");
      return;
    }
    const res = draftsFromPlacementsJson(parsed, newFieldId);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setFields(res.drafts);
    setActiveId(res.drafts[0]?.id ?? null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-3 sm:px-4">
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
          Fertige Vorschau mit Mustermann-Daten. Koordinaten kommen aus{" "}
          <code className="rounded bg-white px-1 py-0.5 text-xs ring-1 ring-neutral-200">
            lib/pdf/form-v1-placements.ts
          </code>{" "}
          (nicht aus der Zeichenfläche).
        </p>
        <a
          href="/partner/admin/pdf-form-preview"
          className="mt-3 inline-flex rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c4256]"
        >
          PDF herunterladen (Max Mustermann)
        </a>
      </div>

      <div className="rounded-xl border border-[#0F4F68]/15 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-lg font-semibold text-neutral-900">PDF-Datenfelder positionieren</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Hier legst du nur die <strong>Platzierung</strong> semantischer Datenfelder fest (Vorname/Nachname-Zeile,
          Adresse, Checkboxen, Unterschrift …). Die Werte beim echten PDF kommen aus den Formulardaten; die
          Vorschau nutzt feste Mustertexte pro Feld. Nach dem Feintuning: JSON kopieren und die Werte in{" "}
          <code className="rounded bg-neutral-100 px-1 text-xs">FORM_V1_PLACEMENTS</code> in{" "}
          <code className="rounded bg-neutral-100 px-1 text-xs">form-v1-placements.ts</code> eintragen.
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
          <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_min(22rem,100%)] lg:items-start">
            <div className="min-w-0 lg:sticky lg:top-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                <div className="flex flex-wrap items-center gap-3">
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
                <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm text-neutral-800 sm:max-w-md">
                  <span className="font-medium">
                    PDF-Vorschau ({previewPercent}% · Skala {renderScale.toFixed(2)})
                  </span>
                  <input
                    type="range"
                    min={PREVIEW_PERCENT_MIN}
                    max={PREVIEW_PERCENT_MAX}
                    step={1}
                    value={previewPercent}
                    onChange={(e) => setPreviewPercent(Number(e.target.value))}
                    className="w-full accent-[#0F4F68]"
                    aria-label="Größe der PDF-Vorschau"
                  />
                  <span className="text-xs font-normal text-neutral-500">
                    Kleiner = ganze Seite sichtbar; Klick-Koordinaten bleiben korrekt.
                  </span>
                </label>
              </div>
              <p className="mb-2 text-xs text-neutral-500">
                Klick auf die Vorschau setzt die Position für das <strong>aktive</strong> Datenfeld (rotes Kreuz).
                Bei der Unterschriftslinie: linker Anker und y-Position; x2 im Panel feinjustieren.
              </p>
              <div className="max-h-[min(90vh,1200px)] w-full overflow-auto rounded-lg border border-neutral-200 bg-neutral-100 p-2">
                <div className="relative inline-block w-max min-w-0 max-w-none leading-none">
                  <canvas ref={pdfCanvasRef} className="block bg-white" aria-hidden />
                  <canvas
                    ref={overlayRef}
                    onClick={onOverlayClick}
                    className="absolute inset-0 h-full w-full cursor-crosshair touch-manipulation"
                    aria-label="PDF mit Datenfeld-Vorschau"
                  />
                </div>
              </div>
              {loading && <p className="mt-2 text-center text-sm text-neutral-500">Rendern…</p>}
            </div>

            <div className="min-w-0 space-y-4 rounded-lg border border-neutral-200 bg-[#FAFBFC] p-4">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Datenfelder</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Jedes Feld entspricht einem Eintrag in <code className="text-[11px]">FORM_V1_PLACEMENTS</code>.
                </p>
                <label className="mt-3 block text-sm text-neutral-800">
                  <span className="font-medium">Höhe Datenfeldliste ({fieldListMaxHeightPx}px)</span>
                  <input
                    type="range"
                    min={FIELD_LIST_HEIGHT_MIN}
                    max={FIELD_LIST_HEIGHT_MAX}
                    step={10}
                    value={fieldListMaxHeightPx}
                    onChange={(e) => setFieldListMaxHeightPx(Number(e.target.value))}
                    className="mt-1 w-full accent-[#0F4F68]"
                    aria-label="Höhe der Datenfeldliste"
                  />
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <select
                    className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm"
                    value={newFieldIdToAdd}
                    onChange={(e) => setNewFieldIdToAdd(e.target.value as FormV1DataFieldId)}
                    aria-label="Datenfeld hinzufügen"
                  >
                    {FORM_V1_DATA_FIELDS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.editorLabel}
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
                  <button
                    type="button"
                    onClick={loadAllFromRepo}
                    className="rounded-lg border border-[#0F4F68] bg-white px-3 py-2 text-sm font-medium text-[#0F4F68] hover:bg-[#F2F9FA]"
                  >
                    Alle aus Repo laden
                  </button>
                </div>
              </div>

              {fields.length === 0 ? (
                <p className="text-sm text-neutral-600">
                  Noch keine Felder — „Alle aus Repo laden“ oder einzelnes Datenfeld hinzufügen.
                </p>
              ) : (
                <ul
                  className="space-y-1 overflow-y-auto overflow-x-hidden rounded border border-neutral-200 bg-white p-2 text-sm"
                  style={{ maxHeight: fieldListMaxHeightPx }}
                >
                  {fields.map((f) => {
                    const meta = getFormV1DataFieldMeta(f.fieldId);
                    return (
                      <li key={f.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveId(f.id);
                            if (f.pageIndex0 !== pageIndex0) setPageIndex0(f.pageIndex0);
                          }}
                          className={`min-w-0 flex-1 rounded px-2 py-1.5 text-left break-words ${
                            f.id === activeId
                              ? "bg-[#0F4F68]/12 font-medium text-[#0F4F68]"
                              : "hover:bg-neutral-100"
                          }`}
                        >
                          <span className="font-mono text-xs text-neutral-500">{f.fieldId}</span>{" "}
                          <span className="text-neutral-700">{meta.editorLabel}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeField(f.id)}
                          className="shrink-0 rounded px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                          aria-label="Feld entfernen"
                        >
                          ✕
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {activeField && pageSizePt && (
                <>
                  <div className="rounded border border-neutral-200 bg-white p-3 text-xs text-neutral-600">
                    <span className="font-semibold text-neutral-800">Aktiv: </span>
                    <code>{activeField.fieldId}</code>
                    <span className="block pt-1 text-neutral-500">
                      Vorschau:{" "}
                      {activeField.shape === "checkbox"
                        ? (getFormV1DataFieldMeta(activeField.fieldId).checkboxLabel ?? "")
                        : activeField.shape === "checkmarkOnly"
                          ? "nur Kreuz"
                          : activeField.shape === "signatureGraphic"
                            ? "Vektor-Unterschrift"
                            : getFormV1DataFieldMeta(activeField.fieldId).sampleText || "—"}
                    </span>
                  </div>

                  {activeField.shape === "text" && (
                    <>
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
                            max={Math.round(pageSizePt.w)}
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
                            max={Math.round(pageSizePt.h)}
                            step={0.5}
                            value={activeField.y}
                            onChange={(e) => updateField(activeField.id, { y: Number(e.target.value) })}
                            className="mt-1 w-full"
                          />
                        </label>
                      </div>
                      {getFormV1DataFieldMeta(activeField.fieldId).kind === "trackedText" && (
                        <label className="text-sm">
                          <span className="font-medium text-neutral-800">trackingPt</span>
                          <input
                            type="number"
                            step={0.05}
                            min={0}
                            value={activeField.trackingPt ?? 0}
                            onChange={(e) =>
                              updateField(activeField.id, { trackingPt: Number(e.target.value) })
                            }
                            className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                          />
                        </label>
                      )}
                    </>
                  )}

                  {activeField.shape === "signatureLabel" && (
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
                      </label>
                    </div>
                  )}

                  {(activeField.shape === "checkbox" || activeField.shape === "checkmarkOnly") && (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-sm">
                        <span className="font-medium text-neutral-800">boxLeftX</span>
                        <input
                          type="number"
                          step={0.1}
                          value={activeField.boxLeftX}
                          onChange={(e) =>
                            updateField(activeField.id, { boxLeftX: Number(e.target.value) })
                          }
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="font-medium text-neutral-800">yBaseline</span>
                        <input
                          type="number"
                          step={0.1}
                          value={activeField.yBaseline}
                          onChange={(e) =>
                            updateField(activeField.id, { yBaseline: Number(e.target.value) })
                          }
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                    </div>
                  )}

                  {activeField.shape === "signatureGraphic" && (
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
                      </label>
                      <label className="text-sm">
                        <span className="font-medium text-neutral-800">scale</span>
                        <input
                          type="number"
                          step={0.05}
                          min={0.3}
                          max={4}
                          value={activeField.scale}
                          onChange={(e) => updateField(activeField.id, { scale: Number(e.target.value) })}
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="font-medium text-neutral-800">rotateDeg</span>
                        <input
                          type="number"
                          step={0.5}
                          value={activeField.rotateDeg}
                          onChange={(e) =>
                            updateField(activeField.id, { rotateDeg: Number(e.target.value) })
                          }
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-sm sm:col-span-2">
                        <span className="font-medium text-neutral-800">Linienstärke (borderWidth)</span>
                        <input
                          type="number"
                          step={0.05}
                          min={0.2}
                          max={3}
                          value={activeField.borderWidth}
                          onChange={(e) =>
                            updateField(activeField.id, { borderWidth: Number(e.target.value) })
                          }
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                    </div>
                  )}

                  {activeField.shape === "signatureLine" && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <label className="text-sm">
                        <span className="font-medium text-neutral-800">x1</span>
                        <input
                          type="number"
                          step={0.1}
                          value={activeField.x1}
                          onChange={(e) => updateField(activeField.id, { x1: Number(e.target.value) })}
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="font-medium text-neutral-800">x2</span>
                        <input
                          type="number"
                          step={0.1}
                          value={activeField.x2}
                          onChange={(e) => updateField(activeField.id, { x2: Number(e.target.value) })}
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="font-medium text-neutral-800">y (Linie)</span>
                        <input
                          type="number"
                          step={0.1}
                          value={activeField.lineY}
                          onChange={(e) => updateField(activeField.id, { lineY: Number(e.target.value) })}
                          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1.5 text-sm"
                        />
                      </label>
                    </div>
                  )}

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
                  {(activeField.shape === "text" ||
                    activeField.shape === "checkbox" ||
                    activeField.shape === "checkmarkOnly" ||
                    activeField.shape === "signatureLabel" ||
                    activeField.shape === "signatureLine") && (
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
                  )}
                </>
              )}

              <div className="space-y-2 border-t border-neutral-200 pt-4">
                <p className="text-sm font-medium text-neutral-900">Platzierungen (JSON)</p>
                <label className="block text-xs font-medium text-neutral-700" htmlFor="import-placements">
                  Import (JSON-Objekt, Schlüssel = fieldId)
                </label>
                <textarea
                  id="import-placements"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-neutral-300 px-2 py-2 font-mono text-xs"
                  placeholder='{ "vornameNachname": { "kind": "text", ... } }'
                />
                <button
                  type="button"
                  onClick={runImport}
                  className="w-full rounded-lg border border-neutral-400 bg-white px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
                >
                  Import anwenden
                </button>
                {activeField ? (
                  <>
                    <pre className="max-h-40 overflow-auto rounded bg-white p-2 text-xs ring-1 ring-neutral-200">
                      {exportActivePlacement}
                    </pre>
                    <button
                      type="button"
                      onClick={() => void copyText(exportActivePlacement)}
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
                    <p className="pt-2 text-xs font-medium text-neutral-700">Alle Felder (für form-v1-placements)</p>
                    <pre className="max-h-36 overflow-auto rounded bg-white p-2 text-xs ring-1 ring-neutral-200">
                      {exportPlacementsObject}
                    </pre>
                    <button
                      type="button"
                      onClick={() => void copyText(exportPlacementsObject)}
                      className="w-full rounded-lg border border-[#0F4F68] bg-white px-3 py-2 text-sm font-medium text-[#0F4F68] hover:bg-[#F2F9FA]"
                    >
                      Alle Platzierungen kopieren
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
