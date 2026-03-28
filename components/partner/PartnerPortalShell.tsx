"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";

type Props = {
  children: React.ReactNode;
  avatarGreen: string;
  avatarBlue: string;
};

const shell = "bg-[#F2F9FA]";

function iconButtonClass(active: boolean) {
  return [
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#0F4F68] transition",
    active ? "bg-[#0F4F68]/12 ring-1 ring-[#0F4F68]/25" : "hover:bg-[#0F4F68]/10",
  ].join(" ");
}

export function PartnerPortalShell({ children, avatarGreen, avatarBlue }: Props) {
  const pathname = usePathname();
  const dashActive = pathname === "/partner/dashboard" || pathname === "/partner";
  const statActive = pathname === "/partner/statistik" || pathname.startsWith("/partner/statistik/");
  const settingsActive = pathname === "/partner/einstellungen" || pathname.startsWith("/partner/einstellungen/");

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC] md:flex-row">
      <aside
        className={`${shell} order-2 fixed bottom-0 left-0 right-0 z-40 flex flex-row items-center justify-between gap-1 border-t border-[#0F4F68]/12 px-2 py-2 shadow-[0_-10px_22px_rgba(15,79,104,0.2),0_-4px_12px_rgba(15,79,104,0.12)] md:order-1 md:sticky md:top-0 md:h-screen md:w-[4.5rem] md:shrink-0 md:flex-col md:justify-between md:border-r md:border-t-0 md:px-0 md:py-5 md:shadow-[4px_0_22px_rgba(15,79,104,0.2),2px_0_12px_rgba(15,79,104,0.12)]`}
        aria-label="Partnerportal-Navigation"
      >
        <nav className="flex flex-1 flex-row items-center justify-center gap-1 sm:gap-2 md:flex-none md:flex-col md:justify-start md:gap-3">
          <Link
            href="/partner/dashboard"
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
            href="/partner/statistik"
            className={iconButtonClass(statActive)}
            aria-current={statActive ? "page" : undefined}
            title="Statistik"
          >
            <span className="sr-only">Statistik</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 19V5M10 19V9M16 19v-6M22 19V11" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/partner/dashboard?tip=1"
            className={iconButtonClass(false)}
            title="Tipp geben"
          >
            <span className="sr-only">Tipp geben</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/partner/dashboard#partner-statusliste"
            className={iconButtonClass(false)}
            title="Zur Statusliste"
          >
            <span className="sr-only">Statusliste</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href="/partner/einstellungen"
            className={iconButtonClass(settingsActive)}
            aria-current={settingsActive ? "page" : undefined}
            title="Einstellungen"
          >
            <span className="sr-only">Einstellungen</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="3" />
              <path
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </nav>

        <div className="flex shrink-0 flex-row items-center gap-2 pr-1 md:flex-col md:gap-3 md:pr-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d7a4f] text-xs font-bold text-white md:h-10 md:w-10 md:text-sm"
            title="Profil"
            aria-hidden
          >
            {avatarGreen.slice(0, 2)}
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3b82f6] text-xs font-bold text-white md:h-10 md:w-10 md:text-sm"
            title="Konto"
            aria-hidden
          >
            {avatarBlue.slice(0, 1)}
          </div>
          <PartnerLogoutButton variant="sidebar" />
        </div>
      </aside>

      <main className="order-1 min-w-0 flex-1 bg-[#FAFBFC] pb-[4.5rem] md:pb-0">
        <div className="mx-auto w-full max-w-[min(100%,96rem)] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
