"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/** Für spätere Client-Komponenten / App; Login läuft über Server Actions. */
export function createSupabaseBrowserClient() {
  const cfg = getSupabasePublicConfig();
  if (!cfg) {
    throw new Error("Supabase ist nicht konfiguriert.");
  }
  return createBrowserClient(cfg.url, cfg.anonKey);
}
