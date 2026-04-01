"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const KFG_HEIGHT_MSG = "ahs-kfg-height";
const MIN_IFRAME_PX = 280;

function measureAvailableIframeHeight(iframeEl: HTMLIFrameElement | null) {
  if (typeof window === "undefined") return 520;
  const top = iframeEl?.getBoundingClientRect().top ?? 0;
  return Math.max(MIN_IFRAME_PX, Math.floor(window.innerHeight - Math.max(0, top)));
}

export function PflegeboxConfiguratorIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [heightPx, setHeightPx] = useState<number>(520);

  const syncIframeHeight = useCallback(() => {
    setHeightPx(measureAvailableIframeHeight(iframeRef.current));
  }, []);

  const onMessage = useCallback((ev: MessageEvent) => {
    if (ev.source !== iframeRef.current?.contentWindow) return;
    if (ev.origin !== window.location.origin) return;
    const data = ev.data as { type?: string; height?: unknown };
    if (!data || data.type !== KFG_HEIGHT_MSG) return;
    const h = Number(data.height);
    if (!Number.isFinite(h) || h < 120) return;
    syncIframeHeight();
  }, [syncIframeHeight]);

  useEffect(() => {
    syncIframeHeight();
    window.addEventListener("message", onMessage);
    window.addEventListener("resize", syncIframeHeight);
    window.addEventListener("orientationchange", syncIframeHeight);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("resize", syncIframeHeight);
      window.removeEventListener("orientationchange", syncIframeHeight);
    };
  }, [onMessage, syncIframeHeight]);

  const src = "/konfigurator/index.html?embed=1&v=kfg-grid-bettui-1";

  const style = {
    height: `${heightPx}px`,
    minHeight: `${heightPx}px`,
    maxHeight: `${heightPx}px`,
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
