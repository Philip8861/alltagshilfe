"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { savePartnerPortalPreferencesAction, type PortalPrefsState } from "@/lib/actions/partner-portal-preferences";
import {
  DEFAULT_PORTAL_PREFERENCES,
  type PartnerPortalPreferences,
  type PartnerPortalTableColumns,
} from "@/lib/partner/portal-preferences";

type Props = {
  initial: PartnerPortalPreferences;
};

const COL_DEFS: { key: keyof PartnerPortalTableColumns; label: string }[] = [
  { key: "vorname", label: "Vorname" },
  { key: "nachname", label: "Nachname" },
  { key: "firma", label: "Firma (wo vorgesehen)" },
  { key: "datum", label: "Datum" },
  { key: "status", label: "Status" },
  { key: "betrag", label: "Betrag" },
  { key: "notiz", label: "Notiz" },
  { key: "archivButton", label: "Schaltfläche „Mein Archiv“" },
  { key: "typ", label: "Typ (Leistung)" },
];

export function PartnerPortalPreferencesForm({ initial }: Props) {
  const router = useRouter();
  const [prefs, setPrefs] = useState<PartnerPortalPreferences>(initial);
  const [msg, setMsg] = useState<PortalPrefsState | null>(null);
  const [pending, startTransition] = useTransition();

  const setCol = (key: keyof PartnerPortalTableColumns, v: boolean) => {
    setPrefs((p) => ({ ...p, columns: { ...p.columns, [key]: v } }));
  };

  const save = () => {
    setMsg(null);
    const fd = new FormData();
    fd.set("preferences_json", JSON.stringify(prefs));
    startTransition(async () => {
      const r = await savePartnerPortalPreferencesAction(null, fd);
      setMsg(r);
      if (r.ok) router.refresh();
    });
  };

  const resetDefaults = () => {
    setPrefs({ ...DEFAULT_PORTAL_PREFERENCES, columns: { ...DEFAULT_PORTAL_PREFERENCES.columns } });
  };

  return (
    <div className="space-y-6">
      {msg ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
          role="status"
        >
          {msg.message}
        </p>
      ) : null}

      <fieldset className="space-y-3" disabled={pending}>
        <legend className="text-sm font-bold text-[#0F4F68]">Statuslisten auf der Übersicht</legend>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200/80 bg-[#F2F9FA]/40 px-4 py-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
            checked={prefs.showListMonatlich}
            onChange={(e) => setPrefs((p) => ({ ...p, showListMonatlich: e.target.checked }))}
          />
          <span>
            <span className="font-semibold text-neutral-900">Monatliche Tippgeberprovision</span>
            <span className="mt-0.5 block text-xs text-neutral-600">Betriebliche Pflegeberatung (monatliche Liste).</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200/80 bg-[#F2F9FA]/40 px-4 py-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
            checked={prefs.showListEinmal}
            onChange={(e) => setPrefs((p) => ({ ...p, showListEinmal: e.target.checked }))}
          />
          <span>
            <span className="font-semibold text-neutral-900">Einmalprovision</span>
            <span className="mt-0.5 block text-xs text-neutral-600">Übrige Leistungen mit Einmalprovision.</span>
          </span>
        </label>
        <p className="text-xs text-neutral-500">
          Sie können beide Listen ausblenden; die Übersicht zeigt dann nur noch die Kacheln. Ihr Archiv bleibt unter
          Einstellungen → Statuslisten einstellen erreichbar.
        </p>
      </fieldset>

      <fieldset className="space-y-3" disabled={pending}>
        <legend className="text-sm font-bold text-[#0F4F68]">Archiv</legend>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200/80 px-4 py-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
            checked={prefs.showArchivOnDashboard}
            onChange={(e) => setPrefs((p) => ({ ...p, showArchivOnDashboard: e.target.checked }))}
          />
          <span>
            <span className="font-semibold text-neutral-900">„Mein Archiv“ auch auf der Übersicht anzeigen</span>
            <span className="mt-0.5 block text-xs text-neutral-600">
              Ausgeblendete Einträge finden Sie zusätzlich weiter unten auf derselben Seite („Mein Archiv“).
            </span>
          </span>
        </label>
      </fieldset>

      <fieldset className="space-y-3" disabled={pending}>
        <legend className="text-sm font-bold text-[#0F4F68]">Tabellenspalten in allen Statuslisten</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {COL_DEFS.map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200/90 bg-white px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
                checked={prefs.columns[key]}
                onChange={(e) => setCol(key, e.target.checked)}
              />
              <span className="text-neutral-800">{label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-neutral-500">Mindestens eine Spalte muss sichtbar sein.</p>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60"
        >
          {pending ? "Speichern…" : "Anzeige speichern"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={resetDefaults}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
        >
          Standard wiederherstellen
        </button>
      </div>
    </div>
  );
}
