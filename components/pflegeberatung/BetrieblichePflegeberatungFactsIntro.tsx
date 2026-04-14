"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const FACT_ZEILE_KLASSE =
  "text-pretty text-center text-lg font-semibold leading-relaxed text-[#0F4F68] sm:text-xl";

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
  children,
}: {
  show: boolean;
  reducedMotion: boolean;
  delayMs: number;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-hidden py-1">
      <div
        className={cn(
          "mx-auto max-w-3xl will-change-transform transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none",
          reducedMotion || show
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.98] opacity-0",
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

/** Oranges Ausrufezeichen als visuelle Brücke zwischen den beiden Fakten-Sätzen */
function OrangeAusrufKreativ() {
  return (
    <div className="flex justify-center py-2 sm:py-3" aria-hidden>
      <span
        className="relative inline-flex h-[3.25rem] w-[3.25rem] select-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#F78F2E] via-[#f67a14] to-[#e06512] font-black leading-none text-white shadow-[0_10px_28px_-8px_rgba(247,143,46,0.65),inset_0_1px_0_rgba(255,255,255,0.35)] ring-[3px] ring-[#F78F2E]/25 sm:h-14 sm:w-14 sm:text-[2.35rem] text-[2rem] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-105 motion-reduce:transition-none"
      >
        !
      </span>
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
    <div ref={rootRef} className="relative mt-8 sm:mt-10" role="region" aria-label="Fakten zur Pflegebelastung im Betrieb">
      <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-0">
        <FactPopRow show={show} reducedMotion={reducedMotion} delayMs={0}>
          <p className={FACT_ZEILE_KLASSE}>
            Die Statistik zeigt: Bereits heute ist etwa jede zehnte beschäftigte Person neben dem Beruf in eine
            Pflegesituation eingebunden.
          </p>
        </FactPopRow>

        <FactPopRow show={show} reducedMotion={reducedMotion} delayMs={120}>
          <OrangeAusrufKreativ />
        </FactPopRow>

        <FactPopRow show={show} reducedMotion={reducedMotion} delayMs={240}>
          <p className={FACT_ZEILE_KLASSE}>
            Eine tägliche Pflegebelastung zählt seit 2024 zu den zweithäufigsten Ursachen für krankheitsbedingte Fehltage.
          </p>
        </FactPopRow>
      </div>
    </div>
  );
}
