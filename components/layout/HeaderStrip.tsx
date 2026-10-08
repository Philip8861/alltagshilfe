"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";
import { fetchPartnerSessionShared } from "@/lib/partner/partner-session-client";
import { ReadabilityHeaderLauncher } from "@/components/accessibility/ReadabilityHeaderLauncher";
import { cn } from "@/lib/utils";

type PartnerStripSession = {
  configured: boolean;
  authenticated: boolean;
  hasProfile: boolean;
  displayName: string | null;
  firstName: string | null;
  /** Betriebs-Login `/partner/admin-login` (Cookie, kein Supabase-Partner). */
  systemAdminSession: boolean;
};

const emptySession: PartnerStripSession = {
  configured: false,
  authenticated: false,
  hasProfile: false,
  displayName: null,
  firstName: null,
  systemAdminSession: false,
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
  const partnerAdminHref = en ? "/en/partner/admin" : "/partner/admin";
  const partnerActive =
    pathname.startsWith("/partner") || pathname.startsWith("/en/partner");

  const [session, setSession] = useState<PartnerStripSession | null>(null);

  const loadSession = useCallback((opts?: { force?: boolean }) => {
    void fetchPartnerSessionShared(opts).then((json) => {
      setSession({
        configured: json.configured,
        authenticated: json.authenticated,
        hasProfile: json.hasProfile,
        displayName: json.displayName,
        firstName: json.firstName,
        systemAdminSession: json.systemAdminSession,
      });
    }, () => setSession(emptySession));
  }, []);

  useEffect(() => {
    /** Navigation: frisch laden (Login/Logout können den Status geändert haben) — geteilt mit anderen Konsumenten. */
    loadSession({ force: true });
  }, [pathname, loadSession]);

  useEffect(() => {
    /** Tab-Rückkehr/Fokus: TTL-Cache reicht (vermeidet Request-Salven bei schnellem Hin- und Herwechseln). */
    const onResume = () => {
      if (document.visibilityState === "visible") loadSession();
    };
    const onFocus = () => loadSession();
    document.addEventListener("visibilitychange", onResume);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onResume);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadSession]);

  const configured = session?.configured ?? false;
  const loggedInPartner = configured && session?.authenticated && session?.hasProfile;
  const loggedInSystemAdmin = session?.systemAdminSession === true;
  const showPartnerStrip = loggedInPartner || loggedInSystemAdmin;
  const greeting = loggedInSystemAdmin
    ? "Admin"
    : stripGreetingName(session?.firstName ?? null, session?.displayName ?? null);
  const stripHref = loggedInSystemAdmin ? partnerAdminHref : partnerDashboardHref;

  return (
    <div
      className={cn("w-full text-xs font-medium text-white/95", hideStripOnMobile ? "hidden md:block" : "block")}
      style={{ backgroundColor: "#0F4F68" }}
    >
      <div className="flex min-h-[2.75rem] w-full flex-row items-center justify-between gap-3 px-4 py-1.5 sm:min-h-[3rem] sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <ReadabilityHeaderLauncher />
        <div className="flex min-w-0 flex-1 justify-end">
        {showPartnerStrip ? (
          <Link
            href={stripHref}
            aria-label={
              loggedInSystemAdmin
                ? en
                  ? "Admin area: Hello, Admin"
                  : "Verwaltung: Hallo, Admin"
                : en
                  ? `Partner area: Hello, ${greeting}`
                  : `Partnerbereich: Hallo, ${greeting}`
            }
            className={cn(
              "inline-flex min-h-8 max-w-[min(100%,20rem)] items-center justify-end truncate rounded-md py-0.5 text-sm font-bold text-white/95 no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-[#0F4F68]",
              partnerActive && "text-white",
            )}
            title={
              loggedInSystemAdmin
                ? en
                  ? "Partner administration"
                  : "Partner-Verwaltung (Betrieb)"
                : (session?.displayName ?? undefined)
            }
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
    </div>
  );
}
