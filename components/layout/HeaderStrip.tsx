"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";
import { cn } from "@/lib/utils";

/** Sichtbarer Markenname im Streifen (Leerzeichen vor „Süd“), nur mobil */
const STRIP_BRAND_DISPLAY = "Alltagshilfe Süd";
/** Desktop: Unterzeile unter der Marke (zentriert) */
const STRIP_DESKTOP_TAGLINE = "Ihr liebevoller Haushalts & Betreuungsdienst vor Ort.";
/** Nach „ - “; wird zeichenweise eingeblendet (nur mobil) */
const TAGLINE = "Gemeinsam stark im Alltag";
const TAGLINE_CHAR_MS = 55;

/** Marke und Tagline: identische Schriftgröße und -stärke */
const STRIP_TEXT_CLASS =
  "inline text-[0.68rem] font-medium leading-tight text-white/95 sm:text-[0.75rem] md:text-sm md:font-semibold";

const STRIP_DESKTOP_TAGLINE_CLASS =
  "mt-0.5 max-w-xl text-pretty text-center text-[0.62rem] font-medium leading-snug text-white/90 sm:text-[0.68rem] md:text-xs";

type HeaderStripProps = {
  nunitoClass?: string;
  balooClass?: string;
};

function isPartnerArea(pathname: string) {
  return pathname.startsWith("/partner") || pathname.startsWith("/en/partner");
}

export function HeaderStrip(_props: HeaderStripProps) {
  const pathname = usePathname();
  const hideStripOnMobile = isPflegeboxKonfiguratorPagePath(pathname);
  const partnerLoginHref = pathname.startsWith("/en") ? "/en/partner/login" : "/partner/login";
  const partnerActive = isPartnerArea(pathname);

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

  const partnerLogin = (
    <Link
      href={partnerLoginHref}
      className={cn(
        "inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-md py-0.5 text-sm font-bold text-white/95 no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68]",
        partnerActive && "text-white",
      )}
    >
      Login
    </Link>
  );

  return (
    <div
      className={cn(
        "min-h-[2.45rem] w-full text-xs font-medium text-white/95 md:min-h-[3.35rem]",
        hideStripOnMobile ? "hidden md:block" : "block",
      )}
      style={{ backgroundColor: "#0F4F68" }}
    >
      {/* Mobil: Marke – animierte Tagline | Login */}
      <div className="flex min-h-[2.45rem] w-full flex-row items-center justify-between gap-4 px-4 py-1.5 sm:px-6 md:hidden lg:px-[var(--ahs-page-gutter)]">
        <div className="flex min-w-0 flex-1 items-center justify-start gap-x-0 text-left">
          <Link
            href="/"
            className={`shrink-0 rounded-sm no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68] ${STRIP_TEXT_CLASS}`}
            aria-label={`${siteConfig.name} – Startseite`}
          >
            {STRIP_BRAND_DISPLAY}
          </Link>
          <span className={`shrink-0 whitespace-pre ${STRIP_TEXT_CLASS}`} aria-hidden>
            {" - "}
          </span>
          <span className={`min-w-0 truncate ${STRIP_TEXT_CLASS}`} aria-live="polite">
            {TAGLINE.slice(0, taglineLength)}
            {taglineLength < TAGLINE.length && <span className="animate-pulse" aria-hidden>|</span>}
          </span>
        </div>
        <div className="flex shrink-0 items-center justify-end">{partnerLogin}</div>
      </div>

      {/* Desktop: optisch zentrierte Marke + Untertitel, Login rechts (1fr | auto | 1fr) */}
      <div className="hidden min-h-[3.35rem] w-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-2 sm:px-6 md:grid lg:px-[var(--ahs-page-gutter)]">
        <span className="min-w-0" aria-hidden />
        <div className="flex flex-col items-center justify-center text-center">
          <Link
            href="/"
            className={`rounded-sm no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68] ${STRIP_TEXT_CLASS}`}
            aria-label={`${siteConfig.name} – Startseite`}
          >
            {siteConfig.name}
          </Link>
          <p className={STRIP_DESKTOP_TAGLINE_CLASS}>{STRIP_DESKTOP_TAGLINE}</p>
        </div>
        <div className="flex justify-end">{partnerLogin}</div>
      </div>
    </div>
  );
}
