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

export function GoogleTranslateBootstrap() {
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement({ pageLanguage: "de", autoDisplay: false }, "google_translate_element_hidden");
    };
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element_hidden" className="hidden" aria-hidden />;
}
