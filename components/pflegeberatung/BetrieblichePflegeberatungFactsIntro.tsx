"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const FACT_ZEILE_KLASSE =
  "text-pretty text-lg font-semibold leading-relaxed text-[#0F4F68] sm:text-xl";

/** Natürliche Pixelmaße von public/images/statistik.webp */
const STATISTIK_IMG = { w: 307, h: 461 } as const;

/** Schatten nur entlang sichtbarer Bildpixel (Alpha), nicht um die Bounding-Box */
const STATISTIK_DROP_SHADOW =
  "[filter:drop-shadow(0_14px_28px_rgba(15,79,104,0.22))_drop-shadow(0_6px_14px_rgba(15,79,104,0.12))]";

/** Dekoratives oranges Ausrufezeichen neben den Faktenzeilen */
const FACT_AUSRUFE =
  "mt-0.5 inline-block shrink-0 select-none text-3xl font-black leading-none tracking-tight text-[#F78F2E] sm:mt-1 sm:text-4xl";

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
    <div className="overflow-x-hidden py-2 sm:py-2.5">
      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-row items-start gap-3 sm:gap-4 lg:mx-0 lg:max-w-none",
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
            <span className={FACT_AUSRUFE} aria-hidden>
              !
            </span>
            <div className="min-w-0 flex-1 text-pretty">{children}</div>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1 text-pretty">{children}</div>
            <span className={FACT_AUSRUFE} aria-hidden>
              !
            </span>
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
    <div
      ref={rootRef}
      className="relative mt-[calc(2rem+3cm)] sm:mt-[calc(2.5rem+3cm)]"
      role="region"
      aria-label="Fakten zur Pflegebelastung im Betrieb"
    >
      <div className="flex flex-col gap-12 sm:gap-14 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
        <div className="min-w-0 flex-1 space-y-12 sm:space-y-16">
          <FactSlideRow show={show} reducedMotion={reducedMotion} from="left" delayMs={0}>
            <p className={FACT_ZEILE_KLASSE}>
              Bereits heute ist etwa jede zehnte beschäftigte Person neben dem Beruf in eine Pflegesituation eingebunden.
            </p>
          </FactSlideRow>

          <FactSlideRow show={show} reducedMotion={reducedMotion} from="right" delayMs={220}>
            <p className={FACT_ZEILE_KLASSE}>
              Eine tägliche Pflegebelastung zählt seit 2024 zu den zweithäufigsten Ursachen für krankheitsbedingte
              Fehltage.
            </p>
          </FactSlideRow>
        </div>

        <aside
          className={cn(
            "mx-auto w-full max-w-[16.5rem] shrink-0 sm:max-w-[18rem] lg:mx-0 lg:max-w-[min(100%,15.5rem)] xl:max-w-[17rem]",
            reducedMotion
              ? "translate-y-0 opacity-100"
              : "transition-[transform,opacity] duration-[900ms] ease-out motion-reduce:transition-none",
            !reducedMotion && (show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
          )}
          style={reducedMotion || !show ? undefined : { transitionDelay: "380ms" }}
          aria-labelledby="betrieblich-statistik-heading"
        >
          <h2
            id="betrieblich-statistik-heading"
            className="text-center text-pretty text-lg font-extrabold tracking-tight text-[#0F4F68] sm:text-xl lg:text-left"
          >
            Statistik zeigt:
          </h2>
          <div className="mt-4 flex justify-center lg:justify-start">
            <Image
              src="/images/statistik.webp"
              alt="Grafik: Pflegebelastung und Fehltage im beruflichen Kontext"
              width={STATISTIK_IMG.w}
              height={STATISTIK_IMG.h}
              sizes="(max-width: 1023px) 288px, 248px"
              className={cn("h-auto w-full max-w-full rounded-sm", STATISTIK_DROP_SHADOW)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
