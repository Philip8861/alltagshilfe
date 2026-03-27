"use client";

import { useEffect, useState } from "react";
import { LanguageFlags } from "./LanguageFlags";

const TAGLINE = "Ihr Begleiter im Alltag";
const TAGLINE_CHAR_MS = 55;

type HeaderStripProps = {
  nunitoClass?: string;
  balooClass?: string;
};

export function HeaderStrip(_props: HeaderStripProps) {
  const [taglineLength, setTaglineLength] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTaglineLength(TAGLINE.length);
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTaglineLength(i);
      if (i >= TAGLINE.length) clearInterval(t);
    }, TAGLINE_CHAR_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-2.5 text-base font-semibold text-white md:justify-between sm:gap-x-4"
      style={{ backgroundColor: "#0F4F68", minHeight: "3.25rem" }}
    >
      <span className="hidden shrink-0 text-white/95 md:inline" aria-live="polite">
        {TAGLINE.slice(0, taglineLength)}
        {taglineLength < TAGLINE.length && <span className="animate-pulse" aria-hidden>|</span>}
      </span>
      <div className="flex flex-1 items-center justify-center md:justify-end">
        <div className="mr-3 hidden md:block">
          <LanguageFlags />
        </div>
        <span className="whitespace-nowrap text-center text-lg md:text-base">
          Kostenlose Telefonnummer{" "}
          <a
            href="tel:+4983349893330"
            aria-label="Anrufen: 08334 9893330"
            className="font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded text-[1.15rem] md:font-semibold md:text-inherit"
          >
            08334/9893330
          </a>
        </span>
      </div>
      <div className="md:hidden">
        <LanguageFlags />
      </div>
    </div>
  );
}
