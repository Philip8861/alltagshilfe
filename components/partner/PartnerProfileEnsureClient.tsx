"use client";

import type { ReactNode } from "react";

type Props = {
  /** Nach fehlgeschlagenem GET /partner/sync-profile: Hinweis + Button „Erneut versuchen“. */
  ensureFailed?: boolean;
  /** Kurzcode aus URL (?sync_reason=), nur bei ensureFailed */
  syncReason?: string;
};

const SYNC_REASON_HINT: Record<string, string> = {
  no_session:
    "Die Server-Anfrage hat keine gültige Supabase-Session gesehen (Cookies). Einmal abmelden, neu anmelden, oder den Button unten erneut nutzen.",
  no_service_role:
    "SUPABASE_SERVICE_ROLE_KEY fehlt oder ist auf dem Server nicht lesbar — obwohl die Verwaltung manchmal trotzdem klappt, prüfen Sie Vercel → Environment Variables → Production und Redeploy.",
  insert_failed:
    "Einfügen in partner_profiles wurde von der Datenbank abgelehnt (Migration, RLS oder Key zum falschen Projekt). Supabase → Logs prüfen.",
  verify_failed:
    "Nach dem Einfügen wurde die Zeile nicht gefunden — bitte Supabase Table Editor und Logs prüfen.",
  unknown: "Bitte erneut versuchen oder SQL-Fallback unten nutzen.",
};

const syncProfileHref = "/partner/sync-profile";

function SyncProfileButton({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 min-w-[12rem] cursor-pointer items-center justify-center rounded-xl border-0 bg-[#0F4F68] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3d52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
      aria-label={label}
      onClick={() => {
        window.location.assign(syncProfileHref);
      }}
    >
      {children}
    </button>
  );
}

/**
 * Kein automatischer Redirect mehr: Der wiederholte replace() hat bei fehlendem/verzögertem
 * Profil-Read (z. B. nach Redirect vom Dashboard) eine Reload-Schleife erzeugt und Klicks auf
 * Links überschrieben. Stattdessen: klarer Button mit vollem Seitenaufruf.
 */
export function PartnerProfileEnsureClient({ ensureFailed = false, syncReason }: Props) {
  if (ensureFailed) {
    const hint = (syncReason && SYNC_REASON_HINT[syncReason]) || SYNC_REASON_HINT.unknown;
    return (
      <div className="mt-4 space-y-3 text-sm" role="alert">
        <p className="font-medium text-red-900">Automatische Einrichtung ist fehlgeschlagen.</p>
        <p className="text-red-950/90">{hint}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <SyncProfileButton label="Profil-Sync erneut ausführen">Erneut versuchen</SyncProfileButton>
          <span className="text-neutral-700">oder SQL unten ausführen.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-neutral-800" role="status">
        Als Nächstes wird in <code className="rounded bg-white/80 px-1 text-xs">{syncProfileHref}</code> die
        Zeile in <code className="rounded bg-white/80 px-1 text-xs">partner_profiles</code> nachgetragen (Server
        mit Service-Role-Key).
      </p>
      <div className="relative z-20">
        <SyncProfileButton label="Partnerprofil jetzt einrichten (Seite aufrufen)">
          Profil jetzt einrichten
        </SyncProfileButton>
      </div>
      <p className="text-xs text-neutral-600">
        Startet einen vollen Seitenaufruf (Session-Cookies) — unabhängig von Übersetzungs-Widgets.
      </p>
    </div>
  );
}
