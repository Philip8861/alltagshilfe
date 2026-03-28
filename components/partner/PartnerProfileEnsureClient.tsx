"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ensurePartnerProfileForSessionAction } from "@/lib/actions/partner-auth";

/**
 * Versucht fehlende partner_profiles-Zeile per Server-Action nachzutragen (Service Role).
 */
export function PartnerProfileEnsureClient() {
  const router = useRouter();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await ensurePartnerProfileForSessionAction();
      if (cancelled) return;
      if (r.ok) {
        router.refresh();
        router.replace("/partner/dashboard");
        return;
      }
      setStatus("error");
      setMessage(r.message);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

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
