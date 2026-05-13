"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { HomepageStatTileButton } from "@/components/partner/admin/HomepageStatTileButton";

export type PartnerProgrammStatistikTeil = "kennzahlen" | "verlauf" | "jePartner";

type Props = {
  chartYear: number;
  kennzahlen: ReactNode;
  verlauf: ReactNode;
  jePartner: ReactNode;
};

export function AdminPartnerProgrammStatistikHub({
  chartYear,
  kennzahlen,
  verlauf,
  jePartner,
}: Props) {
  const [open, setOpen] = useState<PartnerProgrammStatistikTeil | null>(null);

  const toggle = useCallback((id: PartnerProgrammStatistikTeil) => {
    setOpen((current) => (current === id ? null : id));
  }, []);

  const tiles = useMemo(
    () =>
      [
        {
          id: "kennzahlen" as const,
          title: "Kennzahlen im Überblick",
          hint: "Profile, Tipps, Status, Pflegebox",
        },
        {
          id: "verlauf" as const,
          title: "Verlauf und Diagramme",
          hint: `Jahresverläufe · Jahr ${chartYear}`,
        },
        {
          id: "jePartner" as const,
          title: "Je Partner – Detailtabelle",
          hint: "Tipps & Konfigurator je Profil",
        },
      ] as const,
    [chartYear],
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600">
        Drei Überblicksfelder – zuerst nur die Quadrate. Zum Öffnen antippen, erneut antippen schließt. Das Jahr oben
        gilt für die Diagramme.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((t) => (
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
          aria-label="Details Partner-Programm-Statistik"
        >
          {open === "kennzahlen" ? kennzahlen : null}
          {open === "verlauf" ? verlauf : null}
          {open === "jePartner" ? jePartner : null}
        </div>
      ) : null}
    </div>
  );
}
