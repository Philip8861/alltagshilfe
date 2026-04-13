"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ICON_WRAP =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white shadow-sm sm:h-14 sm:w-14";

/** Belegschaft / Pflege (Mehrpersonen + Bettkontext) */
function IconFactZweiteSchicht() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
    </svg>
  );
}

/** Psychische Belastung / Fehlzeiten (Puls / Belastung) */
function IconFactPflegebelastung() {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M22 12h-4l-3 9L9 3l-3 9H2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  icon,
  children,
}: {
  show: boolean;
  reducedMotion: boolean;
  from: "left" | "right";
  delayMs: number;
  icon: ReactNode;
  children: ReactNode;
}) {
  const fromLeft = from === "left";
  return (
    <div className="overflow-x-hidden py-1">
      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl flex-row items-center gap-4 sm:gap-5",
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
            <span className={ICON_WRAP} aria-hidden>
              {icon}
            </span>
            <div className="min-w-0 flex-1 text-pretty">{children}</div>
          </>
        ) : (
          <>
            <div className="min-w-0 flex-1 text-pretty">{children}</div>
            <span className={ICON_WRAP} aria-hidden>
              {icon}
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
      className="rounded-2xl border border-[#0F4F68]/12 bg-white/95 p-5 shadow-sm sm:p-8"
      role="region"
      aria-label="Fakten zur Pflegebelastung im Betrieb"
    >
      <div className="space-y-6 sm:space-y-8">
        <FactSlideRow show={show} reducedMotion={reducedMotion} from="left" delayMs={0} icon={<IconFactZweiteSchicht />}>
          <p className="text-lg font-bold leading-snug text-[#0F4F68] sm:text-xl">
            Wussten Sie, dass 10&nbsp;% Ihrer Belegschaft bereits jetzt eine „zweite Schicht“ am Krankenbett leisten?
          </p>
        </FactSlideRow>

        <FactSlideRow
          show={show}
          reducedMotion={reducedMotion}
          from="right"
          delayMs={220}
          icon={<IconFactPflegebelastung />}
        >
          <p className="text-base font-semibold leading-relaxed text-neutral-800 sm:text-[1.05rem]">
            Pflegebelastung ist der Treiber für psychische Erkrankungen – der zweithäufigste Grund für Fehltage in 2024.
          </p>
        </FactSlideRow>
      </div>
    </div>
  );
}
