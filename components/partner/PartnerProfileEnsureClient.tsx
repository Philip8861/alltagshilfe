"use client";

import { useEffect, useState } from "react";
import { ensurePartnerProfileForSessionAction } from "@/lib/actions/partner-auth";

const ENSURE_TIMEOUT_MS = 25_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("TIMEOUT")), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

/**
 * Versucht fehlende partner_profiles-Zeile per Server-Action nachzutragen (Service Role).
 */
export function PartnerProfileEnsureClient() {
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await withTimeout(ensurePartnerProfileForSessionAction(), ENSURE_TIMEOUT_MS);
        if (cancelled) return;
        if (r.ok) {
          if (typeof window !== "undefined") {
            window.location.assign("/partner/dashboard");
          }
          return;
        }
        setStatus("error");
        setMessage(r.message);
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          e instanceof Error && e.message === "TIMEOUT"
            ? "Zeitüberschreitung. Prüfen Sie die Netzwerkverbindung und ob SUPABASE_SERVICE_ROLE_KEY auf dem Server gesetzt ist."
            : "Unerwarteter Fehler. Bitte Seite neu laden oder erneut anmelden.",
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "working") {
    return (
      <p className="mt-4 text-sm font-medium text-[#0F4F68]" role="status">
        Partnerprofil wird eingerichtet…
      </p>
    );
  }
  if (message) {
    return (
      <p className="mt-4 text-sm text-red-800" role="alert">
        Automatische Einrichtung nicht möglich: {message} Sie können weiterhin die manuelle SQL-Zeile nutzen oder den
        Support informieren.
      </p>
    );
  }
  return null;
}
