"use client";

import Link from "next/link";
import { useKarriereApplyOptional } from "@/components/karriere/karriereApplyContext";
import { cn } from "@/lib/utils";

type InitiativBewerbenLandingButtonProps = {
  className?: string;
};

/** Startet den 8-Schritte-Bewerbungsdialog ohne PLZ-Vorfrage (Karriereseite, Bereich unter den Stellen). */
export function InitiativBewerbenLandingButton({ className }: InitiativBewerbenLandingButtonProps) {
  const ctx = useKarriereApplyOptional();

  if (!ctx) {
    return (
      <Link
        href="#bewerbung-form"
        title="Zum Bewerbungsformular"
        className={className}
      >
        Jetzt initiativ bewerben
      </Link>
    );
  }

  return (
    <button
      type="button"
      title="Initiativbewerbung im Kurzcheck starten"
      className={cn(className)}
      onClick={() =>
        ctx.openBewerbungsWizard("Initiativbewerbung (allgemein)", { skipPlzGate: true })
      }
    >
      Jetzt initiativ bewerben
    </button>
  );
}
