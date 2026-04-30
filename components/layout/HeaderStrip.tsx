"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";
import { cn } from "@/lib/utils";

export function HeaderStrip() {
  const pathname = usePathname();
  const hideStripOnMobile = isPflegeboxKonfiguratorPagePath(pathname);
  const partnerLoginHref = pathname.startsWith("/en") ? "/en/partner/login" : "/partner/login";
  const partnerActive = pathname.startsWith("/partner") || pathname.startsWith("/en/partner");

  return (
    <div
      className={cn("w-full text-xs font-medium text-white/95", hideStripOnMobile ? "hidden md:block" : "block")}
      style={{ backgroundColor: "#0F4F68", minHeight: "2.45rem" }}
    >
      <div className="flex w-full flex-row items-center justify-end gap-4 px-4 py-1.5 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <Link
          href={partnerLoginHref}
          className={cn(
            "inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-md py-0.5 text-sm font-bold text-white/95 no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68]",
            partnerActive && "text-white",
          )}
        >
          Partner Login
        </Link>
      </div>
    </div>
  );
}
