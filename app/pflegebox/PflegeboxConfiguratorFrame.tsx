"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CONFIGURATOR_SRC = "/konfigurator/index.html?embed=1&v=kfg-layout-4";

/**
 * Iframe-Höhe = reeller Dokumentinhalt: ein Scroll (Browser) von Header bis Footer,
 * kein „Stop“ zwischen Konfigurator und Footer. Höhe folgt per ResizeObserver (Warenkorb, Dialoge, Bilder).
 */
export function PflegeboxConfiguratorFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [contentHeightPx, setContentHeightPx] = useState<number | null>(null);

  const measure = useCallback(() => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow;
    const doc = win?.document;
    if (!doc?.documentElement) return;

    try {
      const el = doc.documentElement;
      const h = Math.max(el.scrollHeight, el.offsetHeight, doc.body?.scrollHeight ?? 0, doc.body?.offsetHeight ?? 0);
      setContentHeightPx(Math.ceil(h));
    } catch {
      /* Cross-Origin o.ä. */
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const attach = () => {
      measure();
      const doc = iframe.contentWindow?.document;
      const w = iframe.contentWindow;
      if (!doc) return;
      roRef.current?.disconnect();
      const ro = new ResizeObserver(() => measure());
      roRef.current = ro;
      ro.observe(doc.documentElement);
      if (doc.body) ro.observe(doc.body);
      /* Bilder / Schrift: layout oft erst verzögert final */
      w?.setTimeout(() => measure(), 400);
      w?.setTimeout(() => measure(), 1200);
    };

    const onWinResize = () => measure();

    iframe.addEventListener("load", attach);
    window.addEventListener("resize", onWinResize);
    if (iframe.contentDocument?.readyState === "complete") queueMicrotask(attach);

    return () => {
      iframe.removeEventListener("load", attach);
      window.removeEventListener("resize", onWinResize);
      roRef.current?.disconnect();
      roRef.current = null;
    };
  }, [measure]);

  return (
    <iframe
      ref={iframeRef}
      src={CONFIGURATOR_SRC}
      title="Pflegebox-Konfigurator – Produkte auswählen"
      className="block w-full max-w-full border-0"
      style={{
        width: "100%",
        display: "block",
        /* Bis erstes Layout-Messung: Platzhalter; danach exakte Inhaltshöhe */
        minHeight: contentHeightPx == null ? "min(85dvh, 56rem)" : undefined,
        height: contentHeightPx != null ? `${contentHeightPx}px` : undefined,
      }}
    />
  );
}
