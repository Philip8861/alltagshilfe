"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
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
      className={cn("w-full text-xs font-medium text-white/95", hideStripOnMobile ? "hidden md:block" : "block")}
      style={{ backgroundColor: "#0F4F68", minHeight: "2.45rem" }}
    >
      <div className="flex w-full flex-row items-center justify-between gap-4 px-4 py-1.5 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <div className="flex min-w-0 flex-1 items-center justify-start gap-2 text-left sm:gap-2.5">
          <Link
            href="/"
            className="flex shrink-0 items-center focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68] rounded-sm"
            aria-label={`${siteConfig.name} – Startseite`}
          >
            <Image
              src="/images/logo_weiss.png"
              alt=""
              width={220}
              height={60}
              sizes="(max-width: 640px) 120px, 160px"
              className="h-[0.95rem] w-auto object-contain object-left sm:h-[1.08rem] md:h-[1.28rem]"
              priority
            />
          </Link>
          <span
            className="block min-w-0 truncate text-[0.7rem] leading-tight sm:text-xs md:text-sm md:font-semibold"
            aria-live="polite"
          >
            {TAGLINE.slice(0, taglineLength)}
            {taglineLength < TAGLINE.length && <span className="animate-pulse" aria-hidden>|</span>}
          </span>
        </div>

        <div className="flex shrink-0 items-center justify-end">
          <Link
            href={partnerLoginHref}
            className={cn(
              "inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-md py-0.5 text-sm font-bold text-white/95 no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68]",
              partnerActive && "text-white",
            )}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
