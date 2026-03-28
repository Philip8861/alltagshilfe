"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { navLinks } from "@/config/navigation";
import { cn } from "@/lib/utils";

function isPartnerLoginActive(pathname: string) {
  return (
    pathname.startsWith("/partner") ||
    pathname.startsWith("/en/partner")
  );
}

export function HeaderNav() {
  const pathname = usePathname();
  const partnerActive = isPartnerLoginActive(pathname);
  const partnerLoginHref = pathname.startsWith("/en") ? "/en/partner/login" : "/partner/login";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdownHref, setOpenDropdownHref] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <nav
        className="hidden md:flex md:w-full md:min-w-0 md:items-center md:justify-end md:gap-1 lg:gap-2 xl:gap-3"
        aria-label="Hauptnavigation"
      >
        <div className="flex min-w-0 flex-1 flex-nowrap items-center justify-center gap-x-1 lg:justify-end lg:gap-x-2 xl:gap-x-3">
          {navLinks.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative shrink-0 group"
                onMouseEnter={() => setOpenDropdownHref(item.href)}
                onMouseLeave={() => setOpenDropdownHref(null)}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openDropdownHref === item.href}
                  onFocus={() => setOpenDropdownHref(item.href)}
                  onBlur={() => setOpenDropdownHref(null)}
                  onClick={() => {
                    setOpenDropdownHref((prev) => (prev === item.href ? null : item.href));
                  }}
                  className={cn(
                    "inline-flex items-center gap-0.5 whitespace-nowrap rounded px-1 py-0.5 font-semibold text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 lg:gap-1 lg:px-1.5 xl:px-2",
                    (pathname === item.href || pathname.startsWith(`${item.href}/`)) && "text-neutral-900"
                  )}
                  style={{ fontSize: "clamp(0.6875rem, 1.1vw, 1rem)" }}
                >
                  {item.label}
                  <svg
                    className={cn("shrink-0 transition-transform", openDropdownHref === item.href && "rotate-180")}
                    style={{ width: "clamp(0.75rem, 1.2vw, 1rem)", height: "clamp(0.75rem, 1.2vw, 1rem)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
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
                  "shrink-0 whitespace-nowrap rounded px-1 py-0.5 font-semibold text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 lg:px-1.5 xl:px-2",
                  pathname === item.href && "text-neutral-900"
                )}
                style={{ fontSize: "clamp(0.6875rem, 1.1vw, 1rem)" }}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
        <Link
          href={partnerLoginHref}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-lg border px-2 py-1.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 lg:px-3 xl:px-4 xl:py-2",
            partnerActive
              ? "border-[#0F4F68] bg-[#F2F9FA] text-[#0F4F68]"
              : "border-[#0F4F68]/30 bg-white text-[#0F4F68] hover:border-[#0F4F68]/55 hover:bg-[#F2F9FA]/60"
          )}
          style={{ fontSize: "clamp(0.6875rem, 1.1vw, 1rem)" }}
        >
          Partner-Login
        </Link>
        <Link
          href="/kontakt"
          className="shrink-0 whitespace-nowrap rounded-lg px-2 py-1.5 font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 lg:px-3 xl:px-4 xl:py-2"
          style={{ backgroundColor: "#F78F2E", fontSize: "clamp(0.6875rem, 1.1vw, 1rem)" }}
        >
          Jetzt Kontakt aufnehmen
        </Link>
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <Link
          href={partnerLoginHref}
          className={cn(
            "min-h-[44px] shrink-0 whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2",
            partnerActive
              ? "border-[#0F4F68] bg-[#F2F9FA] text-[#0F4F68]"
              : "border-[#0F4F68]/30 text-[#0F4F68] hover:bg-[#F2F9FA]/60"
          )}
        >
          Partner-Login
        </Link>
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

      {/* Backdrop per Portal unter body: liegt garantiert über dem Seiteninhalt (z-[45] unter Header z-50), nur mobil */}
      {mounted &&
        mobileOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 top-16 left-0 right-0 bottom-0 z-[45] bg-black/60 md:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />,
          document.body
        )}
      <div
        id="mobile-menu"
        className={cn(
          "absolute left-0 right-0 top-16 z-50 border-b border-[#0F4F68]/15 bg-white md:hidden",
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
                    <button
                      type="button"
                      onClick={() => setOpenMobileDropdown((open) => (open === item.href ? null : item.href))}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-base font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-inset"
                      aria-expanded={openMobileDropdown === item.href}
                      aria-controls={`mobile-submenu-${item.href.replace(/\//g, "-")}`}
                      id={`mobile-trigger-${item.href.replace(/\//g, "-")}`}
                    >
                      {item.label}
                      <svg
                        className={cn("h-5 w-5 shrink-0 transition-transform", openMobileDropdown === item.href && "rotate-180")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <ul
                      id={`mobile-submenu-${item.href.replace(/\//g, "-")}`}
                      role="region"
                      aria-labelledby={`mobile-trigger-${item.href.replace(/\//g, "-")}`}
                      className={cn(
                        "flex flex-col gap-1 border-l-2 border-[#0F4F68]/20 pl-4 ml-4 overflow-hidden transition-[height] duration-200",
                        openMobileDropdown === item.href ? "visible max-h-96 opacity-100" : "invisible max-h-0 opacity-0"
                      )}
                    >
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => {
                              setMobileOpen(false);
                              setOpenMobileDropdown(null);
                            }}
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
            <li className="mt-2">
              <Link
                href={partnerLoginHref}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg border px-4 py-3 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-inset",
                  partnerActive
                    ? "border-[#0F4F68] bg-[#F2F9FA] text-[#0F4F68]"
                    : "border-[#0F4F68]/30 text-[#0F4F68] hover:bg-[#F2F9FA]/50"
                )}
              >
                Partner-Login
              </Link>
            </li>
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
