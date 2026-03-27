"use client";

import { useState } from "react";

const STORAGE_KEY_SITE_LANG = "ahs_site_lang";

function setTranslateCookie(lang: "de" | "en") {
  const value = `/de/${lang}`;
  const host = window.location.hostname;
  document.cookie = `googtrans=${value};path=/;max-age=31536000`;
  if (host.includes(".")) {
    document.cookie = `googtrans=${value};domain=.${host};path=/;max-age=31536000`;
  }
}

function dispatchNativeChange(el: HTMLSelectElement) {
  el.dispatchEvent(new Event("change", { bubbles: true }));
  const ev = document.createEvent("HTMLEvents");
  ev.initEvent("change", true, true);
  el.dispatchEvent(ev);
}

function setGoogleCombo(lang: "de" | "en") {
  const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!combo) return false;
  combo.value = lang;
  dispatchNativeChange(combo);
  return true;
}

function applyLanguage(lang: "de" | "en") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SITE_LANG, lang);
  } catch {
    // ignore storage errors
  }
  setTranslateCookie(lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new CustomEvent("ahs-apply-language", { detail: { lang } }));

  if (setGoogleCombo(lang)) return;
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (setGoogleCombo(lang) || attempts >= 20) {
      window.clearInterval(timer);
      if (attempts >= 20) {
        window.location.assign(window.location.pathname + window.location.search + window.location.hash);
      }
    }
  }, 150);
}

export function LanguageFlags() {
  const [isSwitching, setIsSwitching] = useState(false);
  const switchLang = (lang: "de" | "en") => {
    setIsSwitching(true);
    try {
      applyLanguage(lang);
    } finally {
      window.setTimeout(() => setIsSwitching(false), 900);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${isSwitching ? "opacity-70" : ""}`}>
      <button
        type="button"
        onClick={() => switchLang("de")}
        className="inline-flex h-7 w-10 items-center justify-center rounded-md border border-[#0F4F68]/30 bg-white text-lg"
        aria-label="Sprache Deutsch"
        title="Deutsch"
      >
        <svg viewBox="0 0 24 16" className="h-4 w-6 rounded-[2px] shadow-sm" aria-hidden>
          <rect width="24" height="16" fill="#000000" />
          <rect y="5.33" width="24" height="5.34" fill="#DD0000" />
          <rect y="10.67" width="24" height="5.33" fill="#FFCE00" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => switchLang("en")}
        className="inline-flex h-7 w-10 items-center justify-center rounded-md border border-[#0F4F68]/30 bg-white text-lg"
        aria-label="Language English"
        title="English"
      >
        <svg viewBox="0 0 24 16" className="h-4 w-6 rounded-[2px] shadow-sm" aria-hidden>
          <rect width="24" height="16" fill="#012169" />
          <path d="M0 0l24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="3.2" />
          <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.4" />
          <rect x="10" width="4" height="16" fill="#FFFFFF" />
          <rect y="6" width="24" height="4" fill="#FFFFFF" />
          <rect x="10.7" width="2.6" height="16" fill="#C8102E" />
          <rect y="6.7" width="24" height="2.6" fill="#C8102E" />
        </svg>
      </button>
    </div>
  );
}
