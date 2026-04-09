"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";
import { cn } from "@/lib/utils";

const TAGLINE = "Gemeinsam Stark im Alltag";
const TAGLINE_CHAR_MS = 55;

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

  return (
    <div
      className={cn(
        "flex w-full flex-col items-stretch gap-2 px-4 py-2.5 text-sm font-medium text-white/95 md:flex-row md:items-center md:justify-between md:gap-4",
        hideStripOnMobile ? "hidden md:flex" : "flex",
      )}
      style={{ backgroundColor: "#0F4F68", minHeight: "3.25rem" }}
    >
      <span className="text-center md:text-left md:text-base md:font-semibold" aria-live="polite">
        {TAGLINE.slice(0, taglineLength)}
        {taglineLength < TAGLINE.length && <span className="animate-pulse" aria-hidden>|</span>}
      </span>

      <div className="flex justify-center md:justify-end">
        <Link
          href={partnerLoginHref}
          className={cn(
            "inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-md px-2 py-1 text-sm font-normal text-white/85 underline decoration-white/35 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68]",
            partnerActive && "font-medium text-white decoration-white/55",
          )}
        >
          Login
        </Link>
      </div>
    </div>
  );
}
