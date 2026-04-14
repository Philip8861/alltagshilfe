"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const FACT_ZEILE_KLASSE =
  "text-pretty text-lg font-semibold leading-relaxed text-[#0F4F68] sm:text-xl";

const BULLET_DOT =
  "mt-2 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#F78F2E] sm:mt-2.5 sm:h-3 sm:w-3";

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

function FactSlideRow({
  show,
  reducedMotion,
  from,
  delayMs,
  children,
}: {
  show: boolean;
  reducedMotion: boolean;
  from: "left" | "right";
  delayMs: number;
  children: ReactNode;
}) {
  const fromLeft = from === "left";
  return (
    <div className="overflow-x-hidden py-1">
      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-row items-start gap-3 sm:gap-4",
          "will-change-transform",
          reducedMotion
            ? "translate-x-0 opacity-100"
            : cn(
                "transition-[transform,opacity] duration-[900ms] ease-out motion-reduce:transition-none",
                show ? "translate-x-0 opacity-100" : "opacity-0",
                show ? undefined : fromLeft ? "-translate-x-[115%]" : "translate-x-[115%]",
              ),
        )}
        style={reducedMotion || !show ? undefined : { transitionDelay: `${delayMs}ms` }}
      >
        {fromLeft ? (
          <>
            <span className={BULLET_DOT} aria-hidden />
            <div className="min-w-0 flex-1 text-pretty">{children}</div>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1 text-pretty">{children}</div>
            <span className={BULLET_DOT} aria-hidden />
          </>
        )}
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
    <div ref={rootRef} className="relative mt-8 sm:mt-10" role="region" aria-label="Fakten zur Pflegebelastung im Betrieb">
      <div className="space-y-6 sm:space-y-8">
        <FactSlideRow show={show} reducedMotion={reducedMotion} from="left" delayMs={0}>
          <p className={FACT_ZEILE_KLASSE}>
            Die Statistik zeigt: Bereits heute ist etwa jede zehnte beschäftigte Person neben dem Beruf in eine
            Pflegesituation eingebunden.
          </p>
        </FactSlideRow>

        <FactSlideRow show={show} reducedMotion={reducedMotion} from="right" delayMs={220}>
          <p className={FACT_ZEILE_KLASSE}>
            Eine tägliche Pflegebelastung zählt seit 2024 zu den zweithäufigsten Ursachen für krankheitsbedingte Fehltage.
          </p>
        </FactSlideRow>
      </div>
    </div>
  );
}
