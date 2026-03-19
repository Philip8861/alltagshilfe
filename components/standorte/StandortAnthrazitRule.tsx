"use client";

import { useEffect, useId, useRef, useState } from "react";

/** Dunkles Anthrazit, schlicht und lesbar auf #fafbfc */
const ANTHRAZIT = "#3a4550";

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
      className={`flex w-full justify-center px-4 sm:px-6 ${className}`.trim()}
      aria-hidden
    >
      <div
        className={
          "w-2/3 max-w-4xl origin-center transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none " +
          (visible
            ? "opacity-100 [transform:translateZ(0)_scaleX(1)]"
            : "opacity-0 [transform:translateZ(0)_scaleX(0.88)]")
        }
      >
        <svg
          viewBox="0 0 600 12"
          className="block h-2.5 w-full sm:h-3"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ANTHRAZIT} stopOpacity="0" />
              <stop offset="10%" stopColor={ANTHRAZIT} stopOpacity="0.2" />
              <stop offset="48%" stopColor={ANTHRAZIT} stopOpacity="0.65" />
              <stop offset="52%" stopColor={ANTHRAZIT} stopOpacity="0.65" />
              <stop offset="90%" stopColor={ANTHRAZIT} stopOpacity="0.2" />
              <stop offset="100%" stopColor={ANTHRAZIT} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Linse: horizontal dünn → dicker → dünn */}
          <path
            d="M 0 6 C 80 2.8 180 2.2 300 3.5 C 420 2.2 520 2.8 600 6 C 520 9.2 420 9.8 300 8.5 C 180 9.8 80 9.2 0 6 Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      </div>
    </div>
  );
}
