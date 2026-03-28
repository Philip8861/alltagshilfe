"use client";

import { useEffect } from "react";

type Props = {
  /** Nach fehlgeschlagenem GET /partner/sync-profile: kein Redirect, Hinweis + Link „Erneut versuchen“. */
  ensureFailed?: boolean;
  /** Kurzcode aus URL (?sync_reason=), nur bei ensureFailed */
  syncReason?: string;
};

const SYNC_REASON_HINT: Record<string, string> = {
  no_session:
    "Die Server-Anfrage hat keine gültige Supabase-Session gesehen (Cookies). Einmal abmelden, neu anmelden, oder den Link unten klicken.",
  no_service_role:
    "SUPABASE_SERVICE_ROLE_KEY fehlt oder ist auf dem Server nicht lesbar — obwohl die Verwaltung manchmal trotzdem klappt, prüfen Sie Vercel → Environment Variables → Production und Redeploy.",
  insert_failed:
    "Einfügen in partner_profiles wurde von der Datenbank abgelehnt (Migration, RLS oder Key zum falschen Projekt). Supabase → Logs prüfen.",
  verify_failed:
    "Nach dem Einfügen wurde die Zeile nicht gefunden — bitte Supabase Table Editor und Logs prüfen.",
  unknown: "Bitte erneut versuchen oder SQL-Fallback unten nutzen.",
};

/**
 * Leitet per vollem Seitenaufruf zu /partner/sync-profile weiter (zuverlässiger als Server Action aus useEffect).
 */
export function PartnerProfileEnsureClient({ ensureFailed = false, syncReason }: Props) {
  useEffect(() => {
    if (ensureFailed) return;
    window.location.replace("/partner/sync-profile");
  }, [ensureFailed]);

  if (ensureFailed) {
    const hint = (syncReason && SYNC_REASON_HINT[syncReason]) || SYNC_REASON_HINT.unknown;
    return (
      <div className="mt-4 space-y-3 text-sm" role="alert">
        <p className="font-medium text-red-900">Automatische Einrichtung ist fehlgeschlagen.</p>
        <p className="text-red-950/90">{hint}</p>
        <p>
          <a
            href="/partner/sync-profile"
            className="font-semibold text-[#0F4F68] underline underline-offset-2"
          >
            Erneut versuchen
          </a>{" "}
          oder SQL unten ausführen.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm font-medium text-[#0F4F68]" role="status">
        Weiterleitung zum Einrichten des Partnerprofils…
      </p>
      <p className="text-sm text-neutral-700">
        Wenn nichts passiert:{" "}
        <a
          href="/partner/sync-profile"
          className="font-semibold text-[#0F4F68] underline underline-offset-2"
        >
          Profil jetzt einrichten
        </a>{" "}
        (Link manuell öffnen).
      </p>
    </div>
  );
}
