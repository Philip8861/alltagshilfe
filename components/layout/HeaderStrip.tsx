"use client";

import { useEffect, useState } from "react";

const COLOR_NEW = "#0F4F68";
const COLOR_OLD = "#A9D5F0";
const STORAGE_KEY = "header-strip-color";

export function HeaderStrip() {
  const [color, setColor] = useState(COLOR_NEW);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === COLOR_OLD || saved === COLOR_NEW) setColor(saved);
    } catch {
      // ignore
    }
  }, []);

  function toggle() {
    const next = color === COLOR_NEW ? COLOR_OLD : COLOR_NEW;
    setColor(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  const isNew = color === COLOR_NEW;
  const buttonColor = isNew ? COLOR_OLD : COLOR_NEW;

  return (
    <div
      className="relative flex flex-wrap items-center justify-end gap-x-2 gap-y-1 px-4 py-2.5 pr-10 text-base font-semibold text-white sm:gap-x-3 sm:pr-12"
      style={{ backgroundColor: color, minHeight: "3.25rem" }}
    >
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
      <span className="whitespace-nowrap">Mo–Do 08:30–16:00 Uhr</span>
      <span className="whitespace-nowrap">Fr 08:30–12:00 Uhr</span>
      <button
        type="button"
        onClick={toggle}
        className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded opacity-60 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 transition-opacity"
        style={{ backgroundColor: buttonColor }}
        aria-label="Header-Farbe wechseln"
        title="Header-Streifen-Farbe wechseln"
      />
    </div>
  );
}
