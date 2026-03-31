"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const KFG_HEIGHT_MSG = "ahs-kfg-height";
/** Entspricht grob der bisherigen Iframe-Formel (Header + Abstände). */
const VIEWPORT_RESERVE_PX = 168;
const MIN_IFRAME_PX = 280;

function viewportCapPx() {
  if (typeof window === "undefined") return 1200;
  return Math.max(320, window.innerHeight - VIEWPORT_RESERVE_PX);
}

function clampIframeHeight(contentPx: number) {
  const cap = viewportCapPx();
  return Math.min(Math.max(Math.ceil(contentPx), MIN_IFRAME_PX), cap);
}

export function PflegeboxConfiguratorIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [heightPx, setHeightPx] = useState<number | null>(null);

  const onMessage = useCallback((ev: MessageEvent) => {
    if (ev.source !== iframeRef.current?.contentWindow) return;
    if (ev.origin !== window.location.origin) return;
    const data = ev.data as { type?: string; height?: unknown };
    if (!data || data.type !== KFG_HEIGHT_MSG) return;
    const h = Number(data.height);
    if (!Number.isFinite(h) || h < 120) return;
    setHeightPx(clampIframeHeight(h));
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  const src = "/konfigurator/index.html?embed=1&v=kfg-embed-head-2";

  const style =
    heightPx != null
      ? {
          height: `${heightPx}px`,
          minHeight: `${Math.min(MIN_IFRAME_PX, heightPx)}px`,
          maxHeight: "calc(100dvh - 10.5rem)",
        }
      : {
          height: "max(520px, calc(100dvh - 10.5rem))",
          minHeight: "max(520px, calc(100dvh - 10.5rem))",
        };

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title="Pflegebox-Konfigurator – Produkte auswählen"
      className="block min-h-0 min-w-0 w-full max-w-full border-0 bg-[#f1f9fb]"
      style={style}
    />
  );
}
