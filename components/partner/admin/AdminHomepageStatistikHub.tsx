"use client";

import { useCallback, useState } from "react";
import { AdminContactKanalTagesverlaufPanel } from "@/components/partner/admin/AdminContactKanalTagesverlaufPanel";
import { AdminContactListenWochentagKreuzPanel } from "@/components/partner/admin/AdminContactListenWochentagKreuzPanel";
import { AdminConversionStatistikPanel } from "@/components/partner/admin/AdminConversionStatistikPanel";
import {
  AdminHomepageTrafficPanel,
  type HomepageTrafficSectionId,
} from "@/components/partner/admin/AdminHomepageTrafficPanel";
import { HomepageStatTileButton } from "@/components/partner/admin/HomepageStatTileButton";

export type HomepageStatistikQuadrant =
  | HomepageTrafficSectionId
  | "contacts_daily"
  | "contacts_listen"
  | "conversion";

type Props = { chartYear: number };

const TILES: { id: HomepageStatistikQuadrant; title: string; hint?: string }[] = [
  {
    id: "conversion",
    title: "Besucher & Conversion",
    hint: "Unique Visitors · Formulare · Prognose",
  },
  { id: "totals", title: "Aufrufe insgesamt", hint: "Alle Seiten im Verlauf" },
  { id: "device", title: "Aufrufe nach Gerät", hint: "Mobil · Tablet · Desktop" },
  { id: "paths", title: "Aufrufe je Seite", hint: "Top-URLs nach Pfad" },
  {
    id: "contacts_daily",
    title: "Anfragen nach Kanal",
    hint: "Kontakt · Finder · Karriere …",
  },
  {
    id: "contacts_listen",
    title: "Herkunft & Wochentage",
    hint: "Listen · Wochentage · Kreuztabellen",
  },
];

export function AdminHomepageStatistikHub({ chartYear }: Props) {
  const [open, setOpen] = useState<HomepageStatistikQuadrant | null>(null);

  const toggle = useCallback((id: HomepageStatistikQuadrant) => {
    setOpen((current) => (current === id ? null : id));
  }, []);

  const trafficSection: HomepageTrafficSectionId | null =
    open === "totals" || open === "device" || open === "paths" ? open : null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600">
        Sechs Überblicksfelder – standardmäßig nur diese Kacheln sichtbar. Zum Öffnen antippen, erneut antippen
        schließt; das Jahr gilt wie oben im Bereich „Statistik“. Nach dem Öffnen erscheint die Detailauswertung
        hierunter.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TILES.map((t) => (
          <HomepageStatTileButton
            key={t.id}
            presentation="labelOnly"
            title={t.title}
            subtitle={t.hint}
            selected={open === t.id}
            onClick={() => toggle(t.id)}
          />
        ))}
      </div>

      {open !== null ? (
        <div
          className="rounded-2xl border-2 border-[#0F4F68]/14 bg-white p-4 shadow-[0_8px_30px_-18px_rgba(15,79,104,0.28)] sm:p-6"
          role="region"
          aria-label="Details zur gewählten Homepage-Statistik"
        >
          {open === "conversion" ? <AdminConversionStatistikPanel chartYear={chartYear} /> : null}
          <AdminHomepageTrafficPanel chartYear={chartYear} activeSection={trafficSection} />
          {open === "contacts_daily" ? <AdminContactKanalTagesverlaufPanel chartYear={chartYear} /> : null}
          {open === "contacts_listen" ? <AdminContactListenWochentagKreuzPanel chartYear={chartYear} /> : null}
        </div>
      ) : null}
    </div>
  );
}
