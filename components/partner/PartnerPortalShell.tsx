"use client";

import Link from "next/link";
import "./partner-portal.css";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PartnerInitialPasswordPrompt } from "@/components/partner/PartnerInitialPasswordPrompt";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";
import { PartnerTutorialOverlay } from "@/components/partner/PartnerTutorialOverlay";

type Props = {
  children: React.ReactNode;
  /** Server: Hinweis zum ersten Passwortwechsel anzeigen (ohne Session-Dismiss / ohne DB-Unterdrückung). */
  initialPasswordChangePrompt?: boolean;
  /** Server: Partner-Rundgang nach Login automatisch anbieten (solange nicht „Tutorial ausblenden“). */
  tutorialAutoShow?: boolean;
  /** Werbe-Netzwerk nur bei betrieblicher Pflegeberatung. */
  showNetworkNav?: boolean;
  /** Freigeschaltete Leistungsbereiche (für den programmabhängigen Rundgang). */
  responsibilityAreaSlugs?: string[];
};


function NetworkNavIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function iconButtonClass(active: boolean) {
  return [
    "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition-colors md:w-full md:flex-none md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 md:text-sm",
    active ? "bg-white text-[#0F4F68] shadow-[0_4px_12px_rgba(15,79,104,0.12)] ring-1 ring-[#c7dfe7]" : "text-[#647984] hover:bg-[#f2f6f8] hover:text-[#0F4F68]",
  ].join(" ");
}

/** Klassisches Zahnrad (ohne strahlenförmige „Sonnen“-Optik). */
function SettingsGearIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87l.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.132a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992.004.085.004.17 0 .255-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.132a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124l-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87l-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.132a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.132a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124l.22-.128c.332-.183.582-.495.644-.869l.214-1.281z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function PartnerPortalShell({
  children,
  initialPasswordChangePrompt = false,
  tutorialAutoShow = true,
  showNetworkNav = false,
  responsibilityAreaSlugs,
}: Props) {
  const pathname = usePathname();
  const [passwordPromptGateBlocked, setPasswordPromptGateBlocked] = useState(
    () => Boolean(initialPasswordChangePrompt),
  );
  const onPasswordPromptGateChange = useCallback((blocked: boolean) => {
    setPasswordPromptGateBlocked(blocked);
  }, []);

  useEffect(() => {
    if (!initialPasswordChangePrompt) {
      setPasswordPromptGateBlocked(false);
    }
  }, [initialPasswordChangePrompt]);

  const dashActive = pathname === "/partner/dashboard" || pathname === "/partner";
  const statActive = pathname === "/partner/statistik" || pathname.startsWith("/partner/statistik/");
  const settingsActive = pathname === "/partner/einstellungen" || pathname.startsWith("/partner/einstellungen/");
  const networkActive = pathname === "/partner/team" || pathname.startsWith("/partner/team/");

  return (
    <div className="partner-portal flex min-h-dvh flex-col md:flex-row">
      <aside
        className="fixed inset-x-0 bottom-0 z-40 order-2 flex items-center gap-1 border-t border-[#cce2e8] bg-[#edf7f9] px-2 shadow-[3px_0_18px_-8px_rgba(15,79,104,0.25)] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 md:sticky md:top-0 md:order-1 md:h-dvh md:w-56 md:shrink-0 md:flex-col md:items-stretch md:border-r md:border-t-0 md:p-4"
        aria-label="Partnerportal-Navigation"
      >
        <Link href="/partner/dashboard" aria-label="Partnerportal: zur Übersicht" className="mb-8 mt-4 hidden rounded-lg px-3 md:block">
          <span className="block text-lg font-semibold tracking-tight text-[#0F4F68]">Partnerportal</span>
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-1 md:flex-none md:flex-col md:items-stretch md:gap-2">
          <Link
            href="/partner/dashboard"
            className={iconButtonClass(dashActive)}
            aria-current={dashActive ? "page" : undefined}
            title="Übersicht"
          >
            
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-8H9v8H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round" />
            </svg><span>Übersicht</span>
          </Link>
          {showNetworkNav ? (
            <Link
              href="/partner/team"
              data-tutorial="partner-nav-netzwerk"
              className={iconButtonClass(networkActive)}
              aria-current={networkActive ? "page" : undefined}
              title="Werbe-Netzwerk"
            >
              
              <NetworkNavIcon /><span className="md:hidden">Netzwerk</span><span className="hidden md:inline">Werbe-Netzwerk</span>
            </Link>
          ) : null}
          <Link
            href="/partner/statistik"
            data-tutorial="partner-nav-statistik"
            className={iconButtonClass(statActive)}
            aria-current={statActive ? "page" : undefined}
            title="Statistik"
          >
            
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 19V5M10 19V9M16 19v-6M22 19V11" strokeLinecap="round" />
            </svg><span>Statistik</span>
          </Link>
          <Link
            href="/partner/einstellungen"
            data-tutorial="partner-nav-einstellungen"
            className={iconButtonClass(settingsActive)}
            aria-current={settingsActive ? "page" : undefined}
            title="Einstellungen"
          >
            
            <SettingsGearIcon /><span>Einstellungen</span>
          </Link>
        </nav>
        <div className="md:mt-auto md:border-t md:border-[#e0e8ed] md:pt-4">
          <PartnerLogoutButton variant="sidebar" />
        </div>
      </aside>

      <div className="order-1 min-w-0 flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-[#d6e8ed] bg-gradient-to-r from-white to-[#f0f8fa] px-5 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold text-[#315363]">Partnerportal <span className="mx-2 text-[#a4b5be]" aria-hidden>/</span> <span className="text-[#6b7f89]">{pathname === "/partner/kontakt" ? "Kontakt" : settingsActive ? "Einstellungen" : networkActive ? "Werbe-Netzwerk" : statActive ? "Statistik" : "Übersicht"}</span></p>
          <Link href="/partner/kontakt" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-semibold text-[#476877] hover:text-[#0F4F68]">Hilfe & Kontakt <span aria-hidden>↗</span></Link>
        </header>
        <div className="mx-auto w-full max-w-[96rem] px-4 py-6 sm:px-8 lg:px-10 lg:py-9">{children}</div>
        <footer className="flex flex-wrap justify-end gap-x-5 gap-y-2 px-5 pb-6 text-xs text-[#637782] sm:px-8 lg:px-10">
          <span>Alltagshilfe Süd</span>
          <Link href="/datenschutz" className="underline-offset-4 hover:underline">Datenschutz</Link>
          <Link href="/impressum" className="underline-offset-4 hover:underline">Impressum</Link>
        </footer>
      </div>

      {initialPasswordChangePrompt ? (
        <PartnerInitialPasswordPrompt
          shouldPrompt={initialPasswordChangePrompt}
          onGateChange={onPasswordPromptGateChange}
        />
      ) : null}

      <PartnerTutorialOverlay
        tutorialAutoShow={tutorialAutoShow}
        passwordPromptGateBlocked={passwordPromptGateBlocked}
        responsibilityAreaSlugs={responsibilityAreaSlugs}
      />
    </div>
  );
}
