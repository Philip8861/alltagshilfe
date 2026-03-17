"use client";

import { useEffect, useState } from "react";

const COLOR_NEW = "#0F4F68";
const COLOR_OLD = "#A9D5F0";
const STORAGE_KEY_COLOR = "header-strip-color";
const STORAGE_KEY_FONT = "site-font";
const FONT_NUNITO = "nunito";
const FONT_BALOO = "baloo";

type HeaderStripProps = {
  nunitoClass?: string;
  balooClass?: string;
};

function applyFont(nunitoClass: string, balooClass: string, font: string) {
  if (typeof document === "undefined") return;
  document.body.classList.remove(nunitoClass, balooClass);
  document.body.classList.add(font === FONT_BALOO ? balooClass : nunitoClass);
}

export function HeaderStrip({ nunitoClass = "", balooClass = "" }: HeaderStripProps) {
  const [color, setColor] = useState(COLOR_NEW);
  const [font, setFont] = useState(FONT_NUNITO);

  useEffect(() => {
    try {
      const savedColor = localStorage.getItem(STORAGE_KEY_COLOR);
      if (savedColor === COLOR_OLD || savedColor === COLOR_NEW) setColor(savedColor);
      const savedFont = localStorage.getItem(STORAGE_KEY_FONT);
      if (savedFont === FONT_BALOO || savedFont === FONT_NUNITO) {
        setFont(savedFont);
        if (nunitoClass && balooClass) applyFont(nunitoClass, balooClass, savedFont);
      }
    } catch {
      // ignore
    }
  }, [nunitoClass, balooClass]);

  function toggleColor() {
    const next = color === COLOR_NEW ? COLOR_OLD : COLOR_NEW;
    setColor(next);
    try {
      localStorage.setItem(STORAGE_KEY_COLOR, next);
    } catch {
      // ignore
    }
  }

  function toggleFont() {
    const next = font === FONT_NUNITO ? FONT_BALOO : FONT_NUNITO;
    setFont(next);
    try {
      localStorage.setItem(STORAGE_KEY_FONT, next);
      if (nunitoClass && balooClass) applyFont(nunitoClass, balooClass, next);
    } catch {
      // ignore
    }
  }

  const isNewColor = color === COLOR_NEW;
  const buttonColor = isNewColor ? COLOR_OLD : COLOR_NEW;

  return (
    <div
      className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 pr-16 text-base font-semibold text-white sm:gap-x-6 sm:pr-20"
      style={{ backgroundColor: color, minHeight: "3.25rem" }}
    >
      <span className="whitespace-nowrap text-white/95">Ihr Begleiter im Alltag</span>
      <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:gap-x-3">
        <span className="whitespace-nowrap">
          Kostenlose Telefonnummer{" "}
        <a
          href="tel:+4983349893330"
          aria-label="Anrufen: 08334 9893330"
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded"
        >
          08334/9893330
        </a>
        </span>
      </div>
      <button
        type="button"
        onClick={toggleFont}
        className="absolute right-9 top-1/2 h-5 w-5 -translate-y-1/2 rounded border border-white/50 bg-white/20 text-[10px] font-bold opacity-70 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 transition-opacity sm:right-10"
        aria-label="Schrift wechseln (Baloo / Nunito)"
        title={font === FONT_BALOO ? "Schrift: Nunito Sans" : "Schrift: Baloo 2"}
      >
        Aa
      </button>
      <button
        type="button"
        onClick={toggleColor}
        className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded opacity-60 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 transition-opacity"
        style={{ backgroundColor: buttonColor }}
        aria-label="Header-Farbe wechseln"
        title="Header-Streifen-Farbe wechseln"
      />
    </div>
  );
}
