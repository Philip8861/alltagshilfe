"use client";

import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

export function DesktopLupe() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const sync = () => {
      const desktop = media.matches;
      setIsDesktop(desktop);
      if (!desktop) {
        setEnabled(false);
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isDesktop || !enabled) return;

    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setOrigin({ x, y });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isDesktop, enabled]);

  useEffect(() => {
    if (!isDesktop || !enabled) {
      document.body.style.transform = "";
      document.body.style.transformOrigin = "";
      document.body.style.transition = "";
      return;
    }

    document.body.style.transition = "transform 120ms ease-out";
    document.body.style.transform = "scale(1.16)";
    document.body.style.transformOrigin = `${origin.x}% ${origin.y}%`;

    return () => {
      document.body.style.transform = "";
      document.body.style.transformOrigin = "";
      document.body.style.transition = "";
    };
  }, [enabled, isDesktop, origin.x, origin.y]);

  if (!isDesktop || !visible) return null;

  return (
    <div className="fixed right-5 bottom-5 z-[120] hidden lg:flex">
      <div className="flex items-center gap-2 rounded-full border border-[#0F4F68]/20 bg-white/95 px-3 py-2 shadow-[0_10px_24px_rgba(15,79,104,0.22)] backdrop-blur">
        <button
          type="button"
          onClick={() => setEnabled((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#0F4F68] text-white transition hover:bg-[#0c3f53] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
          aria-label={enabled ? "Lupe deaktivieren" : "Lupe aktivieren"}
          title={enabled ? "Lupe deaktivieren" : "Lupe aktivieren"}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            setEnabled(false);
            setVisible(false);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0F4F68]/20 bg-white text-[#0F4F68] transition hover:bg-[#0F4F68]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
          aria-label="Lupe schließen"
          title="Lupe schließen"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
