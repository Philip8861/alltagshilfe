"use client";

import { clearConsent } from "@/lib/consent";

export function CookieSettingsLink() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearConsent();
    window.dispatchEvent(new CustomEvent("cookie-banner-show"));
  };

  return (
    <li>
      <button
        type="button"
        onClick={handleClick}
        className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded"
      >
        Cookie-Einstellungen
      </button>
    </li>
  );
}
