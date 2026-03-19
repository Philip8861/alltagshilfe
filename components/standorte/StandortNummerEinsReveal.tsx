"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Blendet den Intro-Text neben dem Bild sanft von rechts ein (Richtung Bild links),
 * sobald der Bereich ins Sichtfeld kommt. Respektiert prefers-reduced-motion.
 */
export function StandortNummerEinsReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        "min-w-0 flex-1 space-y-3 text-left transition-[opacity,transform] duration-700 ease-out " +
        "motion-reduce:translate-x-0 motion-reduce:opacity-100 " +
        (visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8") +
        (className ? ` ${className}` : "")
      }
    >
      {children}
    </div>
  );
}
