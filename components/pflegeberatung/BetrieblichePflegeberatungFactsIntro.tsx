"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Einheitliche Darstellung der beiden Fakten-Sätze (kursiv, leicht versetzt) */
const FACT_ZEILE_KLASSE =
  "text-pretty text-lg font-semibold italic leading-relaxed text-[#0F4F68] sm:text-xl";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function FactPopRow({
  show,
  reducedMotion,
  delayMs,
  indentClass,
  children,
}: {
  show: boolean;
  reducedMotion: boolean;
  delayMs: number;
  indentClass?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("overflow-x-hidden py-1", indentClass)}>
      <div
        className={cn(
          "mx-auto max-w-3xl will-change-transform transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none",
          reducedMotion || show
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.96] opacity-0",
        )}
        style={
          reducedMotion || !show
            ? undefined
            : { transitionDelay: `${delayMs}ms`, transitionProperty: "transform, opacity" }
        }
      >
        {children}
      </div>
    </div>
  );
}

export function BetrieblichePflegeberatungFactsIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reducedMotion) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion]);

  const show = reducedMotion || inView;

  return (
    <div ref={rootRef} className="relative mt-[3cm]" role="region" aria-label="Fakten zur Pflegebelastung im Betrieb">
      <div className="space-y-7 sm:space-y-9">
        <FactPopRow show={show} reducedMotion={reducedMotion} delayMs={0}>
          <p className={FACT_ZEILE_KLASSE}>
            Die Statistik zeigt: Bereits heute ist etwa jede zehnte beschäftigte Person neben dem Beruf in eine
            Pflegesituation eingebunden.
          </p>
        </FactPopRow>

        <FactPopRow show={show} reducedMotion={reducedMotion} delayMs={180} indentClass="pl-5 sm:pl-10 md:pl-14">
          <p className={FACT_ZEILE_KLASSE}>
            Eine tägliche Pflegebelastung zählt seit 2024 zu den zweithäufigsten Ursachen für krankheitsbedingte Fehltage.
          </p>
        </FactPopRow>
      </div>
    </div>
  );
}
