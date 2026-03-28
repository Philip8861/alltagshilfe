"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TAGLINE = "Ihr Begleiter im Alltag";
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
      className="grid w-full grid-cols-1 items-center gap-y-2 px-4 py-2.5 text-base font-semibold text-white md:grid-cols-[1fr_auto_1fr] md:gap-x-4 md:gap-y-0"
      style={{ backgroundColor: "#0F4F68", minHeight: "3.25rem" }}
    >
      <span className="hidden text-white/95 md:block md:justify-self-start" aria-live="polite">
        {TAGLINE.slice(0, taglineLength)}
        {taglineLength < TAGLINE.length && <span className="animate-pulse" aria-hidden>|</span>}
      </span>

      <div className="flex justify-center md:col-start-2">
        <Link
          href={partnerLoginHref}
          className={cn(
            "inline-flex min-h-[40px] items-center justify-center whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68] sm:text-base",
            partnerActive
              ? "border-white bg-white/25 text-white"
              : "border-white/85 bg-white/10 text-white hover:bg-white/20",
          )}
        >
          Partner-Login
        </Link>
      </div>

      <div className="flex justify-center md:justify-end md:col-start-3">
        <span className="whitespace-nowrap text-center text-lg md:text-base">
          Kostenlose Telefonnummer{" "}
          <a
            href="tel:+4983349893330"
            aria-label="Anrufen: 08334 9893330"
            className="font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68] rounded text-[1.15rem] md:font-semibold md:text-inherit"
          >
            08334/9893330
          </a>
        </span>
      </div>
    </div>
  );
}
