"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SystemAdminLogoutButton } from "@/components/partner/SystemAdminLogoutButton";

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

const BEREICHE = [
  { id: "auftraege", title: "Aufträge", href: "/partner/admin?bereich=auftraege" },
  { id: "aktive_unternehmen", title: "Aktive Unternehmen", href: "/partner/admin?bereich=aktive_unternehmen" },
  { id: "archiv", title: "Archiv", href: "/partner/admin?bereich=archiv" },
  { id: "anlegen", title: "Anlegen", href: "/partner/admin?bereich=anlegen" },
  { id: "liste", title: "Partnerliste", href: "/partner/admin?bereich=liste" },
  { id: "auszahlen", title: "Auszahlen", href: "/partner/admin?bereich=auszahlen" },
  { id: "statistik", title: "Statistik", href: "/partner/admin?bereich=statistik" },
] as const;

export function PartnerAdminShell({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const bereich = searchParams.get("bereich") ?? "auftraege";

  const isAdmin = pathname === "/partner/admin" || pathname.startsWith("/partner/admin/");

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFC] md:flex-row">
      <aside
        className={`partner-admin-print-aside ${shell} order-2 fixed bottom-0 left-0 right-0 z-40 flex flex-row items-center justify-between gap-1 border-t border-[#0F4F68]/12 px-1 py-2 shadow-[0_-10px_22px_rgba(15,79,104,0.2),0_-4px_12px_rgba(15,79,104,0.12)] sm:gap-2 md:order-1 md:sticky md:top-0 md:h-screen md:w-[4.5rem] md:shrink-0 md:flex-col md:justify-between md:border-r md:border-t-0 md:px-0 md:py-5 md:shadow-[4px_0_22px_rgba(15,79,104,0.2),2px_0_12px_rgba(15,79,104,0.12)]`}
        aria-label="Admin-Navigation"
      >
        <nav className="flex flex-1 flex-row items-center justify-center gap-0.5 overflow-x-auto px-1 sm:gap-1 md:flex-none md:flex-col md:justify-start md:gap-3 md:overflow-visible md:px-0">
          {BEREICHE.map((item) => {
            const active = isAdmin && bereich === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={iconButtonClass(active)}
                aria-current={active ? "page" : undefined}
                title={item.title}
              >
                <span className="sr-only">{item.title}</span>
                <AdminNavIcon kind={item.id} />
              </Link>
            );
          })}
          <Link
            href="/partner-demo/dashboard"
            className={iconButtonClass(pathname.startsWith("/partner-demo"))}
            title="Schulungsdemo (Beamer)"
          >
            <span className="sr-only">Schulungsdemo (Beamer)</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 21h8M12 17v4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/partner/admin/pdf-coords"
            className={iconButtonClass(
              pathname === "/partner/admin/pdf-coords" || pathname === "/partner/admin/pdf-layout-lab",
            )}
            title="PDF-Formularfelder"
          >
            <span className="sr-only">PDF-Formularfelder</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/partner/login"
            className={iconButtonClass(false)}
            title="Partnerportal (separate Anmeldung für Partner-Unternehmen)"
          >
            <span className="sr-only">Zum Partnerportal (Supabase-Anmeldung)</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <SystemAdminLogoutButton variant="sidebar" />
        </nav>
      </aside>

      <main className="partner-payout-print-main order-1 min-w-0 flex-1 bg-[#FAFBFC] pb-[4.5rem] md:pb-0">
        <div className="mx-auto w-full max-w-[min(100%,96rem)] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

function AdminNavIcon({ kind }: { kind: (typeof BEREICHE)[number]["id"] }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: "currentColor" as const, strokeWidth: 2, "aria-hidden": true as const };
  switch (kind) {
    case "auftraege":
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
        </svg>
      );
    case "aktive_unternehmen":
      return (
        <svg {...common}>
          <path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "archiv":
      return (
        <svg {...common}>
          <path d="M21 8v13H3V8M1 3h22v5H1V3zM10 12h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "anlegen":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "liste":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "auszahlen":
      return (
        <span className="text-[1.2rem] font-bold leading-none text-current" aria-hidden>
          €
        </span>
      );
    case "statistik":
      return (
        <svg {...common}>
          <path d="M4 19V5M10 19V9M16 19v-6M22 19V11" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
