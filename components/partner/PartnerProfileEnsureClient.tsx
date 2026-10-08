"use client";

import type { ReactNode } from "react";

type Props = {
  /** Nach fehlgeschlagenem GET /partner/sync-profile: Hinweis + Button „Erneut versuchen“. */
  ensureFailed?: boolean;
  /** Kurzcode aus URL (?sync_reason=), nur bei ensureFailed */
  syncReason?: string;
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
export function PartnerProfileEnsureClient({ ensureFailed = false }: Props) {
  if (ensureFailed) {
    return (
      <div className="mt-4 space-y-3 text-sm" role="alert">
        <p className="font-medium text-red-900">Automatische Einrichtung ist fehlgeschlagen.</p>
        <p className="text-red-950/90">Bitte versuchen Sie es erneut. Falls das Problem bestehen bleibt, wenden Sie sich an unser Team.</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <SyncProfileButton label="Profil-Sync erneut ausführen">Erneut versuchen</SyncProfileButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-neutral-800" role="status">
        Vervollständigen Sie jetzt die Einrichtung Ihres Partnerzugangs.
      </p>
      <div className="relative z-20">
        <SyncProfileButton label="Partnerprofil jetzt einrichten (Seite aufrufen)">
          Profil jetzt einrichten
        </SyncProfileButton>
      </div>
      <p className="text-xs text-neutral-600">
        Anschließend gelangen Sie direkt zu Ihrer Übersicht.
      </p>
    </div>
  );
}
