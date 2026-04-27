"use client";

import type { EmailOtpType } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { safeAuthNextPath } from "@/lib/auth/safe-auth-next-path";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createBrowserClient } from "@supabase/ssr";

/**
 * Auth-Rückleitung nach E-Mail-Link (Partner-Login, Passwort-Reset).
 * Server-Route kann weder URL-Hashes lesen noch alle Supabase-Link-Varianten zuverlässig verarbeiten;
 * PKCE-Code, token_hash und Implicit-Fragment werden hier im Browser abgeschlossen.
 */
export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ranRef = useRef(false);
  const [hint, setHint] = useState("Anmeldung wird geprüft…");

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const cfg = getSupabasePublicConfig();
    if (!cfg) {
      router.replace("/partner/login?error=auth");
      return;
    }

    const next = safeAuthNextPath(searchParams.get("next"));
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    const supabase = createBrowserClient(cfg.url, cfg.anonKey);

    void (async () => {
      const fail = () => {
        setHint("");
        router.replace("/partner/login?error=auth");
      };

      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("[auth/callback] exchangeCodeForSession:", error.message);
            fail();
            return;
          }
          router.replace(next);
          return;
        }

        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as EmailOtpType,
          });
          if (error) {
            console.error("[auth/callback] verifyOtp:", error.message);
            fail();
            return;
          }
          router.replace(next);
          return;
        }

        if (typeof window !== "undefined" && window.location.hash?.length > 1) {
          const hp = new URLSearchParams(window.location.hash.slice(1));
          const access_token = hp.get("access_token");
          const refresh_token = hp.get("refresh_token");
          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({ access_token, refresh_token });
            if (error) {
              console.error("[auth/callback] setSession:", error.message);
              fail();
              return;
            }
            const clean = `${window.location.pathname}${window.location.search}`;
            window.history.replaceState(null, document.title, clean);
            router.replace(next);
            return;
          }
        }

        fail();
      } catch (e) {
        console.error("[auth/callback]", e);
        fail();
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-neutral-600">
      {hint}
    </div>
  );
}
