"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Gestaffelte Einblendung (ms) nach Eintritt in den sichtbaren Bereich */
  delayMs?: number;
};

/**
 * Blendet Inhalt erst ein, wenn er ins Viewport scrollt (IntersectionObserver).
 * Bei prefers-reduced-motion sofort sichtbar.
 */
export function RevealOnScroll({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    let timer: number | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        obs.disconnect();
        if (delayMs > 0) {
          timer = window.setTimeout(() => setShown(true), delayMs);
        } else {
          setShown(true);
        }
      },
      { root: null, rootMargin: "0px 0px -7% 0px", threshold: 0.06 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
