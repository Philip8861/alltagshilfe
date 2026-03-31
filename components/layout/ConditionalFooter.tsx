"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

function hideMainFooter(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/pflegebox" || pathname.startsWith("/pflegebox/");
}

/** Auf `/pflegebox` zeigt der eingebettete Konfigurator einen eigenen Mini-Footer (rechtliche Links). */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (hideMainFooter(pathname)) return null;
  return <Footer />;
}
