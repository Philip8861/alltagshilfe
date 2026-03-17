"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function HeaderNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdownHref, setOpenDropdownHref] = useState<string | null>(null);

  return (
    <>
      <nav
        className="hidden md:flex md:w-full md:flex-nowrap md:items-center md:justify-between md:gap-3 md:px-4 lg:gap-5 lg:px-6"
        aria-label="Hauptnavigation"
      >
        <div className="flex flex-1 flex-nowrap items-center justify-between gap-2 min-w-0 overflow-hidden lg:justify-evenly lg:gap-4">
          {navLinks.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative shrink-0 group"
                onMouseEnter={() => setOpenDropdownHref(item.href)}
                onMouseLeave={() => setOpenDropdownHref(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 whitespace-nowrap rounded px-2 py-1 text-base font-semibold text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2",
                    pathname === item.href && "text-neutral-900"
                  )}
                >
                  {item.label}
                  <svg
                    className={cn("h-4 w-4 transition-transform", openDropdownHref === item.href && "rotate-180")}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div
                  className={cn(
                    "absolute left-0 top-full pt-1 min-w-[220px] transition-opacity duration-150",
                    openDropdownHref === item.href ? "opacity-100 visible" : "invisible opacity-0 pointer-events-none"
                  )}
                >
                  <ul
                    className="rounded-lg border border-[#0F4F68]/15 bg-white py-2 shadow-lg"
                    role="menu"
                  >
                    {item.children.map((child) => (
                      <li key={child.href} role="none">
                        <Link
                          href={child.href}
                          role="menuitem"
                          className="block px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-inset"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded px-2 py-1 text-base font-semibold text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2",
                  pathname === item.href && "text-neutral-900"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
        <Link
          href="/kontakt"
          className="ml-3 shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-base font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 lg:ml-6"
          style={{ backgroundColor: "#F78F2E" }}
        >
          Jetzt Kontakt aufnehmen
        </Link>
      </nav>

      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
        >
          <span className="sr-only">{mobileOpen ? "Schließen" : "Menü"}</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "absolute left-0 right-0 top-16 border-b border-[#0F4F68]/15 bg-white md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        role="dialog"
        aria-label="Mobile Menü"
      >
        <nav
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Mobile Navigation"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <span className="block rounded-lg px-4 py-2 text-sm font-semibold text-neutral-500">
                      {item.label}
                    </span>
                    <ul className="ml-4 mt-1 flex flex-col gap-1 border-l border-[#0F4F68]/15 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "block rounded-lg px-4 py-3 text-base font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-inset",
                              pathname === child.href && "bg-neutral-50 text-neutral-900"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-base font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-inset",
                      pathname === item.href && "bg-neutral-50 text-neutral-900"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="mt-3 border-t border-[#0F4F68]/15 pt-3">
              <Link
                href="/kontakt"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-4 py-3 text-center text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "#F78F2E" }}
              >
                Jetzt Kontakt aufnehmen
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
