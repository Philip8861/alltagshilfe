"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: { pageLanguage: string; autoDisplay?: boolean }, id: string) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const STORAGE_KEY_SITE_LANG = "ahs_site_lang";

function setTranslateCookie(lang: "de" | "en") {
  const value = `/de/${lang}`;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};domain=${window.location.hostname};path=/`;
}

export function LanguageFlags() {
  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>("#google-translate-script");
    if (!existingScript) {
      window.googleTranslateElementInit = () => {
        if (!window.google?.translate?.TranslateElement) return;
        new window.google.translate.TranslateElement(
          { pageLanguage: "de", autoDisplay: false },
          "google_translate_element_hidden",
        );
      };
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const switchLang = (lang: "de" | "en") => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_SITE_LANG, lang);
    setTranslateCookie(lang);
    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_element_hidden" className="hidden" aria-hidden />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => switchLang("de")}
          className="inline-flex h-7 w-10 items-center justify-center rounded-md border border-white/40 bg-white/10 text-lg"
          aria-label="Sprache Deutsch"
          title="Deutsch"
        >
          🇩🇪
        </button>
        <button
          type="button"
          onClick={() => switchLang("en")}
          className="inline-flex h-7 w-10 items-center justify-center rounded-md border border-white/40 bg-white/10 text-lg"
          aria-label="Language English"
          title="English"
        >
          🇬🇧
        </button>
      </div>
    </>
  );
}
