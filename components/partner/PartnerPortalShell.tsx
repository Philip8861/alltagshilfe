"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";

type Props = {
  welcomeLine: string;
  children: React.ReactNode;
};

const nav = [
  { href: "/partner/dashboard", label: "Übersicht" },
  { href: "/partner/einstellungen", label: "Einstellungen" },
] as const;

function navClass(active: boolean) {
  return [
    "rounded-lg px-3 py-2 text-sm font-semibold transition",
    active
      ? "bg-[#0F4F68] text-white shadow-sm"
      : "text-[#0F4F68]/85 hover:bg-[#0F4F68]/10 hover:text-[#0F4F68]",
  ].join(" ");
}

export function PartnerPortalShell({ welcomeLine, children }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-[70vh]">
      <header className="mb-6 flex flex-col gap-4 border-b border-[#0F4F68]/10 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
        <div className="flex items-start justify-between gap-3 sm:block">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0F4F68]/65">Kooperationspartner</p>
            <p className="mt-1 text-lg font-bold text-[#0F4F68] sm:text-xl">Partnerportal</p>
            <p className="mt-0.5 text-sm font-medium text-neutral-700">{welcomeLine}</p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#0F4F68]/20 text-[#0F4F68] sm:hidden"
            aria-expanded={menuOpen}
            aria-controls="partner-nav-mobile"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">Menü</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <nav
            id="partner-nav-mobile"
            className={[
              "flex flex-col gap-1 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-1",
              menuOpen ? "flex" : "hidden sm:flex",
            ].join(" ")}
            aria-label="Partnerbereich"
          >
            {nav.map(({ href, label }) => {
              const active =
                href === "/partner/dashboard"
                  ? pathname === "/partner/dashboard" || pathname === "/partner"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} className={navClass(active)} onClick={() => setMenuOpen(false)}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <PartnerLogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
