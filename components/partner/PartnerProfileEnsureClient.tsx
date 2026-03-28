"use client";

import { useEffect } from "react";

type Props = {
  /** Nach fehlgeschlagenem GET /partner/sync-profile: kein Redirect, Hinweis + Link „Erneut versuchen“. */
  ensureFailed?: boolean;
};

/**
 * Leitet per vollem Seitenaufruf zu /partner/sync-profile weiter (zuverlässiger als Server Action aus useEffect).
 */
export function PartnerProfileEnsureClient({ ensureFailed = false }: Props) {
  useEffect(() => {
    if (ensureFailed) return;
    window.location.replace("/partner/sync-profile");
  }, [ensureFailed]);

  if (ensureFailed) {
    return (
      <div className="mt-4 space-y-3 text-sm" role="alert">
        <p className="font-medium text-red-900">
          Automatische Einrichtung ist fehlgeschlagen — meist fehlt oder ist falsch der{" "}
          <code className="rounded bg-white/80 px-1">SUPABASE_SERVICE_ROLE_KEY</code> unter Vercel → Environment
          Variables → <strong>Production</strong> (derselbe Key wie in Supabase → Settings → API → service_role).
        </p>
        <p>
          <a
            href="/partner/sync-profile"
            className="font-semibold text-[#0F4F68] underline underline-offset-2"
          >
            Erneut versuchen
          </a>{" "}
          (nach dem Speichern der Variable: Redeploy), oder SQL unten ausführen.
        </p>
      </div>
    );
  }

  return (
    <p className="mt-4 text-sm font-medium text-[#0F4F68]" role="status">
      Weiterleitung zum Einrichten des Partnerprofils…
    </p>
  );
}
