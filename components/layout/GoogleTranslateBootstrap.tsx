"use client";

import { useEffect } from "react";

const STORAGE_KEY_SITE_LANG = "ahs_site_lang";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay?: boolean; includedLanguages?: string },
          id: string,
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateBootstrap() {
  useEffect(() => {
    const applyLanguage = (explicitLang?: "de" | "en") => {
      const storedLang = explicitLang ?? (window.localStorage.getItem(STORAGE_KEY_SITE_LANG) === "en" ? "en" : "de");
      const lang = storedLang === "en" ? "en" : "de";
      document.documentElement.lang = lang;
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (!combo) return false;
      combo.value = lang;
      combo.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    };

    const applyStoredLanguage = () => {
      let storedLang: string | null = null;
      try {
        storedLang = window.localStorage.getItem(STORAGE_KEY_SITE_LANG);
      } catch {
        storedLang = null;
      }
      const lang = storedLang === "en" ? "en" : "de";
      return applyLanguage(lang);
    };

    const onApplyLanguage = (event: Event) => {
      const custom = event as CustomEvent<{ lang?: "de" | "en" }>;
      applyLanguage(custom.detail?.lang === "en" ? "en" : "de");
    };
    window.addEventListener("ahs-apply-language", onApplyLanguage as EventListener);

    if (document.getElementById("google-translate-script")) {
      if (applyStoredLanguage()) return;
      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (applyStoredLanguage() || attempts >= 20) {
          window.clearInterval(timer);
        }
      }, 150);
      return;
    }
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "de", autoDisplay: false, includedLanguages: "de,en" },
        "google_translate_element_hidden",
      );
      if (applyStoredLanguage()) return;
      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (applyStoredLanguage() || attempts >= 20) {
          window.clearInterval(timer);
        }
      }, 150);
    };
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      window.dispatchEvent(new CustomEvent("ahs-translate-script-error"));
    };
    document.body.appendChild(script);

    return () => {
      window.removeEventListener("ahs-apply-language", onApplyLanguage as EventListener);
    };
  }, []);

  return <div id="google_translate_element_hidden" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden />;
}
