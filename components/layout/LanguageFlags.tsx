"use client";

const STORAGE_KEY_SITE_LANG = "ahs_site_lang";

function setTranslateCookie(lang: "de" | "en") {
  const value = `/de/${lang}`;
  document.cookie = `googtrans=${value};path=/`;
  document.cookie = `googtrans=${value};domain=${window.location.hostname};path=/`;
}

export function LanguageFlags() {
  const switchLang = (lang: "de" | "en") => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY_SITE_LANG, lang);
    setTranslateCookie(lang);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => switchLang("de")}
        className="inline-flex h-7 w-10 items-center justify-center rounded-md border border-[#0F4F68]/30 bg-white text-lg"
        aria-label="Sprache Deutsch"
        title="Deutsch"
      >
        🇩🇪
      </button>
      <button
        type="button"
        onClick={() => switchLang("en")}
        className="inline-flex h-7 w-10 items-center justify-center rounded-md border border-[#0F4F68]/30 bg-white text-lg"
        aria-label="Language English"
        title="English"
      >
        🇬🇧
      </button>
    </div>
  );
}
