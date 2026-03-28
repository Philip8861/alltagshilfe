"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";

type Props = {
  children: React.ReactNode;
};

const nav = [
  { href: "/partner/dashboard", label: "Übersicht" },
  { href: "/partner/einstellungen", label: "Einstellungen" },
  { href: "/partner/kontakt", label: "Kontakt" },
] as const;

function navClass(active: boolean) {
  return [
    "rounded-lg px-3 py-2 text-sm font-semibold transition",
    active
      ? "bg-[#0F4F68] text-white shadow-sm"
      : "text-[#0F4F68]/85 hover:bg-[#0F4F68]/10 hover:text-[#0F4F68]",
  ].join(" ");
}

export function PartnerPortalShell({ children }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-[70vh]">
      <header className="partner-dash-animate mb-8 border-b border-[#0F4F68]/10 pb-5 sm:mb-10 sm:pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-end gap-2 sm:order-2 sm:shrink-0">
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
            <PartnerLogoutButton />
          </div>
          <nav
            id="partner-nav-mobile"
            className={[
              "flex w-full flex-col gap-1 sm:order-1 sm:flex sm:flex-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-2",
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
        </div>
      </header>
      {children}
    </div>
  );
}
