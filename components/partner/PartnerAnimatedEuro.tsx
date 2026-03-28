"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  className?: string;
  durationMs?: number;
};

function formatEuro(n: number) {
  return n.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PartnerAnimatedEuro({ value, className = "", durationMs = 1450 }: Props) {
  const [display, setDisplay] = useState(0);
  const [highlight, setHighlight] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplay(0);
    setHighlight(false);

    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let cancelled = false;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(value * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
        setHighlight(true);
        timeoutRef.current = setTimeout(() => setHighlight(false), 900);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, durationMs]);

  return (
    <span
      className={[
        "tabular-nums transition-[text-shadow,color] duration-300",
        highlight ? "partner-euro-highlight" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {formatEuro(display)}
    </span>
  );
}
