"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/** Browser-Client: Login/Logout setzen Session-Cookies zuverlässig (Server-Action + redirect ist in Next.js oft unzuverlässig). */
export function createSupabaseBrowserClient() {
  const cfg = getSupabasePublicConfig();
  if (!cfg) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
  return createBrowserClient(cfg.url, cfg.anonKey);
}
