"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Muss mit public/konfigurator/app.js (postMessage) übereinstimmen. */
const KFG_RESIZE_TYPE = "kfg-resize";

const MIN_IFRAME_PX = 400;
const MAX_IFRAME_PX = 16000;

function viewportCapPx(): number {
  if (typeof window === "undefined") return 800;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return Math.max(MIN_IFRAME_PX, Math.round(window.innerHeight - 10.5 * rem));
}

type Props = {
  src: string;
  title: string;
};

export function PflegeboxConfiguratorIframe({ src, title }: Props) {
  const [heightPx, setHeightPx] = useState(520);
  const lastContentHeight = useRef(520);

  const applyHeight = useCallback((contentHeight: number) => {
    lastContentHeight.current = contentHeight;
    const capped = Math.min(contentHeight, viewportCapPx());
    setHeightPx(Math.max(MIN_IFRAME_PX, Math.min(MAX_IFRAME_PX, capped)));
  }, []);

  const onMessage = useCallback(
    (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data;
      if (!d || typeof d !== "object" || d.type !== KFG_RESIZE_TYPE) return;
      const h = Number((d as { height?: unknown }).height);
      if (!Number.isFinite(h)) return;
      const rounded = Math.ceil(h);
      if (rounded < MIN_IFRAME_PX || rounded > MAX_IFRAME_PX) return;
      applyHeight(rounded);
    },
    [applyHeight]
  );

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onMessage]);

  useEffect(() => {
    const onResize = () => applyHeight(lastContentHeight.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyHeight]);

  useEffect(() => {
    applyHeight(lastContentHeight.current);
  }, [applyHeight]);

  return (
    <iframe
      src={src}
      title={title}
      className="block w-full max-w-full border-0"
      style={{
        height: heightPx,
        minHeight: MIN_IFRAME_PX,
        width: "100%",
      }}
    />
  );
}
