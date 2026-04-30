"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";
import { cn } from "@/lib/utils";

type PartnerStripSession = {
  configured: boolean;
  authenticated: boolean;
  hasProfile: boolean;
  displayName: string | null;
  firstName: string | null;
};

const emptySession: PartnerStripSession = {
  configured: false,
  authenticated: false,
  hasProfile: false,
  displayName: null,
  firstName: null,
};

function stripGreetingName(firstName: string | null, displayName: string | null, maxLen = 26): string {
  const fn = firstName?.trim();
  if (fn) return fn.length > maxLen ? `${fn.slice(0, maxLen - 1).trimEnd()}…` : fn;
  const dn = displayName?.trim();
  if (!dn) return "Partner";
  if (dn.includes("@")) {
    const local = dn.split("@")[0]?.trim() ?? "Partner";
    return local.length > maxLen ? `${local.slice(0, maxLen - 1)}…` : local;
  }
  const firstWord = dn.split(/\s+/)[0] ?? dn;
  return firstWord.length > maxLen ? `${firstWord.slice(0, maxLen - 1)}…` : firstWord;
}

export function HeaderStrip() {
  const pathname = usePathname();
  const hideStripOnMobile = isPflegeboxKonfiguratorPagePath(pathname);
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const partnerLoginHref = en ? "/en/partner/login" : "/partner/login";
  const partnerDashboardHref = en ? "/en/partner/dashboard" : "/partner/dashboard";
  const partnerActive =
    pathname.startsWith("/partner") || pathname.startsWith("/en/partner");

  const [session, setSession] = useState<PartnerStripSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/partner/session", { credentials: "same-origin", cache: "no-store" });
        const json = (await res.json()) as Partial<PartnerStripSession>;
        if (cancelled) return;
        setSession({
          configured: Boolean(json.configured),
          authenticated: Boolean(json.authenticated),
          hasProfile: Boolean(json.hasProfile),
          displayName: typeof json.displayName === "string" ? json.displayName : null,
          firstName: typeof json.firstName === "string" ? json.firstName : null,
        });
      } catch {
        if (!cancelled) setSession(emptySession);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const configured = session?.configured ?? false;
  const loggedIn = configured && session?.authenticated && session?.hasProfile;
  const greeting = stripGreetingName(session?.firstName ?? null, session?.displayName ?? null);

  return (
    <div
      className={cn("w-full text-xs font-medium text-white/95", hideStripOnMobile ? "hidden md:block" : "block")}
      style={{ backgroundColor: "#0F4F68", minHeight: "2.45rem" }}
    >
      <div className="flex w-full flex-row items-center justify-end gap-4 px-4 py-1.5 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        {loggedIn ? (
          <Link
            href={partnerDashboardHref}
            aria-label={
              en
                ? `Partner area: Hello, ${greeting}`
                : `Partnerbereich: Hallo, ${greeting}`
            }
            className={cn(
              "inline-flex min-h-8 max-w-[min(100%,20rem)] items-center justify-end truncate rounded-md py-0.5 text-sm font-bold text-white/95 no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68]",
              partnerActive && "text-white",
            )}
            title={session?.displayName ?? undefined}
          >
            {en ? "Hello," : "Hallo,"}{" "}
            <span className="ml-1 truncate">{greeting}</span>
          </Link>
        ) : (
          <Link
            href={partnerLoginHref}
            className={cn(
              "inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-md py-0.5 text-sm font-bold text-white/95 no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68]",
              partnerActive && "text-white",
            )}
          >
            Partner Login
          </Link>
        )}
      </div>
    </div>
  );
}
