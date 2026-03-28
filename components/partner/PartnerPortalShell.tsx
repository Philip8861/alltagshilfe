"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";

type Props = {
  children: React.ReactNode;
};

const shell = "bg-[#F2F9FA]";

function iconButtonClass(active: boolean) {
  return [
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#0F4F68] transition-all duration-200 ease-out",
    active ? "bg-[#0F4F68]/12 ring-1 ring-[#0F4F68]/25 shadow-[0_2px_8px_rgba(15,79,104,0.12)]" : "hover:bg-[#0F4F68]/10",
    "motion-safe:hover:scale-110 motion-safe:active:scale-[0.94] motion-safe:hover:-translate-y-0.5",
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

export function PartnerPortalShell({ children }: Props) {
  const pathname = usePathname();
  const dashActive = pathname === "/partner/dashboard" || pathname === "/partner";
  const statActive = pathname === "/partner/statistik" || pathname.startsWith("/partner/statistik/");
  const settingsActive = pathname === "/partner/einstellungen" || pathname.startsWith("/partner/einstellungen/");

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC] md:flex-row">
      <aside
        className={`${shell} order-2 fixed bottom-0 left-0 right-0 z-40 flex flex-row items-center justify-between gap-2 border-t border-[#0F4F68]/12 px-2 py-2 shadow-[0_-10px_22px_rgba(15,79,104,0.2),0_-4px_12px_rgba(15,79,104,0.12)] md:order-1 md:sticky md:top-0 md:h-screen md:w-[4.5rem] md:shrink-0 md:flex-col md:justify-between md:border-r md:border-t-0 md:px-0 md:py-5 md:shadow-[4px_0_22px_rgba(15,79,104,0.2),2px_0_12px_rgba(15,79,104,0.12)]`}
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
        </nav>

        <div className="flex shrink-0 flex-row items-center gap-1 md:flex-col md:gap-2">
          <Link
            href="/partner/einstellungen"
            className={iconButtonClass(settingsActive)}
            aria-current={settingsActive ? "page" : undefined}
            title="Einstellungen"
          >
            <span className="sr-only">Einstellungen</span>
            <SettingsGearIcon />
          </Link>
          <PartnerLogoutButton variant="sidebar" />
        </div>
      </aside>

      <main className="order-1 min-w-0 flex-1 bg-[#FAFBFC] pb-[4.5rem] md:pb-0">
        <div className="mx-auto w-full max-w-[min(100%,96rem)] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
