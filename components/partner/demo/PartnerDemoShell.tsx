"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function iconButtonClass(active: boolean) {
  return [
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#0F4F68] transition-all duration-200 ease-out",
    active ? "bg-[#0F4F68]/12 ring-1 ring-[#0F4F68]/25 shadow-[0_2px_8px_rgba(15,79,104,0.12)]" : "hover:bg-[#0F4F68]/10",
    "motion-safe:hover:scale-110 motion-safe:active:scale-[0.94]",
  ].join(" ");
}

export function PartnerDemoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashActive = pathname === "/partner-demo/dashboard" || pathname === "/partner-demo";
  const teamActive = pathname === "/partner-demo/team" || pathname.startsWith("/partner-demo/team/");

  return (
    <div className="flex min-h-[calc(100vh-3rem)] flex-col bg-[#FAFBFC] md:flex-row">
      <aside
        className="order-2 fixed bottom-0 left-0 right-0 z-40 flex flex-row items-center justify-between gap-2 border-t border-[#0F4F68]/12 bg-[#F2F9FA] px-2 py-2 shadow-[0_-10px_22px_rgba(15,79,104,0.2)] md:order-1 md:sticky md:top-[3.25rem] md:h-[calc(100vh-3.25rem)] md:w-[4.5rem] md:shrink-0 md:flex-col md:justify-between md:border-r md:border-t-0 md:px-0 md:py-5"
        aria-label="Demo-Navigation"
      >
        <nav className="flex flex-1 flex-row items-center justify-center gap-1 sm:gap-2 md:flex-none md:flex-col md:justify-start md:gap-3">
          <Link
            href="/partner-demo/dashboard"
            className={iconButtonClass(dashActive)}
            aria-current={dashActive ? "page" : undefined}
            title="Übersicht"
          >
            <span className="sr-only">Übersicht</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-8H9v8H4a1 1 0 01-1-1V9.5z" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/partner-demo/team"
            className={iconButtonClass(teamActive)}
            aria-current={teamActive ? "page" : undefined}
            title="Werbe-Netzwerk"
          >
            <span className="sr-only">Werbe-Netzwerk</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path
                d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </nav>
        <div className="hidden md:flex md:flex-col md:items-center md:gap-2 md:px-1">
          <p className="text-center text-[0.55rem] font-bold uppercase leading-tight tracking-wide text-[#0F4F68]/70">
            Demo
          </p>
        </div>
      </aside>

      <main className="order-1 min-w-0 flex-1 pb-[4.5rem] md:pb-0">
        <div className="mx-auto w-full max-w-[min(100%,96rem)] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
