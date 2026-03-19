"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Sehr dezentes Anthrazit */
const ANTHRAZIT = "#4a5568";

type StandortAnthrazitRuleProps = {
  className?: string;
};

/**
 * Horizontale Strukturlinie: ~2/3 Seitenbreite (zentriert, mit Seitenabstand),
 * dünner an den Enden, in der Mitte etwas kräftiger; sanftes Einblenden im Viewport.
 */
export function StandortAnthrazitRule({ className = "" }: StandortAnthrazitRuleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `standort-anthrazit-rule-${rawId}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex w-full justify-center px-4 sm:px-6 lg:px-8 ${className}`.trim()}
      aria-hidden
    >
      <div
        className={
          "w-2/3 max-w-3xl origin-center transition-[opacity,transform] duration-[750ms] ease-out motion-reduce:transition-none " +
          (visible
            ? "opacity-100 [transform:translateZ(0)_scaleX(1)]"
            : "opacity-0 [transform:translateZ(0)_scaleX(0.96)]")
        }
      >
        <svg
          viewBox="0 0 600 6"
          className="block h-[3px] w-full sm:h-[4px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ANTHRAZIT} stopOpacity="0" />
              <stop offset="12%" stopColor={ANTHRAZIT} stopOpacity="0.08" />
              <stop offset="50%" stopColor={ANTHRAZIT} stopOpacity="0.22" />
              <stop offset="88%" stopColor={ANTHRAZIT} stopOpacity="0.08" />
              <stop offset="100%" stopColor={ANTHRAZIT} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 3 C 90 2.1 220 1.8 300 2.2 C 380 1.8 510 2.1 600 3 C 510 3.9 380 4.2 300 3.8 C 220 4.2 90 3.9 0 3 Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      </div>
    </div>
  );
}
