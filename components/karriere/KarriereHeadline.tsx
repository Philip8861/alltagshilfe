"use client";

import { useEffect, useState } from "react";

const LINES = ["Da wirken,", "wo", "Menschen", "zählen!"] as const;

const CHARS_PER_MS = 50;
const PAUSE_BETWEEN_LINES_MS = 520;

export function KarriereHeadline({ children }: { children?: React.ReactNode }) {
  const [visibleLengths, setVisibleLengths] = useState([0, 0, 0, 0]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleLengths(LINES.map((l) => l.length));
      setDone(true);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function typeLine(lineIndex: number) {
      if (lineIndex >= LINES.length) {
        setDone(true);
        return;
      }
      const line = LINES[lineIndex];
      let i = 0;
      const run = () => {
        if (i <= line.length) {
          setVisibleLengths((prev) => {
            const next = [...prev];
            next[lineIndex] = i;
            return next;
          });
          i++;
          timeouts.push(setTimeout(run, CHARS_PER_MS));
        } else {
          timeouts.push(setTimeout(() => typeLine(lineIndex + 1), PAUSE_BETWEEN_LINES_MS));
        }
      };
      run();
    }

    timeouts.push(setTimeout(() => typeLine(0), 400));

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <>
      <h1
        className="text-center text-2xl font-bold leading-tight tracking-tight text-[#4a4a4a] sm:text-3xl md:text-4xl lg:text-5xl"
        aria-live="polite"
      >
        <span className="block transition-opacity duration-300">{LINES[0].slice(0, visibleLengths[0])}</span>
        <span className="mt-1 block transition-opacity duration-300">{LINES[1].slice(0, visibleLengths[1])}</span>
        <span
          className="mt-1 block text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl transition-opacity duration-300"
          style={{ color: "#F78F2E" }}
        >
          {LINES[2].slice(0, visibleLengths[2])}
          {!done && visibleLengths[2] === LINES[2].length && visibleLengths[3] === 0 && (
            <span className="animate-pulse" aria-hidden>|</span>
          )}
        </span>
        <span className="mt-1 block transition-opacity duration-300">
          {LINES[3].slice(0, visibleLengths[3])}
          {!done && visibleLengths[3] < LINES[3].length && <span className="animate-pulse" aria-hidden>|</span>}
        </span>
      </h1>
      {done && (
        <div
          className="animate-fade-in-up"
          style={{ animationDuration: "0.6s", animationDelay: "0.25s", animationFillMode: "backwards" }}
        >
          {children}
        </div>
      )}
    </>
  );
}
