"use client";

import { usePathname } from "next/navigation";
import { isPflegeboxKonfiguratorPagePath } from "@/lib/pflegebox-konfigurator-path";
import { Footer } from "./Footer";

function hideMainFooter(pathname: string | null) {
  return isPflegeboxKonfiguratorPagePath(pathname);
}

/** Auf der Konfigurator-Seite zeigt der eingebettete Konfigurator einen eigenen Mini-Footer (rechtliche Links). */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (hideMainFooter(pathname)) return null;
  return <Footer />;
}
