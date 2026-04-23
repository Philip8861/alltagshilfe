"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINE1 = "Starte jetzt deine neue Karriere";
const LINE2 = "bei der Alltagshilfe-Süd";
const SR_HEADLINE = `${LINE1} ${LINE2}`;

/** Sehr schnelles „Tippen“ (ms pro Zeichen). */
const CHAR_MS = 13;
const PAUSE_AFTER_LINE1_MS = 70;
const BUTTON_DELAY_MS = 360;

const H1_CLASS =
  "text-balance text-3xl font-bold leading-snug tracking-tight text-[#0F4F68] sm:text-4xl md:text-5xl lg:text-[clamp(2rem,1.05rem+1.85vw,2.85rem)] xl:text-[clamp(2.15rem,1.15rem+1.7vw,3.05rem)]";

export function KarriereHeroTypewriter() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setLine1(LINE1);
      setLine2(LINE2);
      const t = window.setTimeout(() => setShowButton(true), 120);
      return () => window.clearTimeout(t);
    }

    let cancelled = false;

    const runLine1 = (idx: number) => {
      if (cancelled) return;
      if (idx <= LINE1.length) {
        setLine1(LINE1.slice(0, idx));
        window.setTimeout(() => runLine1(idx + 1), CHAR_MS);
      } else {
        window.setTimeout(runLine2, PAUSE_AFTER_LINE1_MS, 1);
      }
    };

    const runLine2 = (idx: number) => {
      if (cancelled) return;
      if (idx <= LINE2.length) {
        setLine2(LINE2.slice(0, idx));
        window.setTimeout(() => runLine2(idx + 1), CHAR_MS);
      } else {
        window.setTimeout(() => {
          if (!cancelled) setShowButton(true);
        }, BUTTON_DELAY_MS);
      }
    };

    runLine1(1);
    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  return (
    <>
      <h1 id="karriere-hero-heading" className={H1_CLASS}>
        <span className="sr-only">{SR_HEADLINE}</span>
        <span aria-hidden className="block min-h-[1.2em]">
          {line1}
        </span>
        <span aria-hidden className="mt-1 block min-h-[1.2em] sm:mt-1.5">
          {line2}
        </span>
      </h1>
      <div
        className={cn(
          "mt-5 transition-all duration-500 ease-out sm:mt-6",
          showButton ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <Link
          href="#bewerbung"
          className="inline-flex w-full min-h-[2.75rem] transform items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-2.5 text-sm font-semibold leading-snug text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:min-h-[2.85rem] sm:w-auto sm:max-w-[min(100%,22rem)] sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-3.5 md:text-lg"
        >
          Bewirb dich jetzt in 1 Minute
        </Link>
      </div>
    </>
  );
}
