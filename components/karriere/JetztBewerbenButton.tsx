"use client";

import { GtmKontaktNavLink } from "@/components/analytics/GtmContactIntentLink";
import { useKarriereApplyOptional } from "@/components/karriere/karriereApplyContext";
import { cn } from "@/lib/utils";

type JetztBewerbenButtonProps = {
  jobTitle: string;
  className?: string;
};

export function JetztBewerbenButton({ jobTitle, className }: JetztBewerbenButtonProps) {
  const ctx = useKarriereApplyOptional();

  if (!ctx) {
    return (
      <GtmKontaktNavLink
        href={`/kontakt?betreff=Bewerbung%20${encodeURIComponent(jobTitle)}`}
        contactPath="karriere_job_listing_bewerben_nav"
        sourceComponent="karriere_jetzt_bewerben_link"
        service="karriere"
        className={className}
      >
        Jetzt bewerben
      </GtmKontaktNavLink>
    );
  }

  return (
    <button
      type="button"
      className={cn(className)}
      onClick={() => ctx.openBewerbungsWizard(jobTitle)}
    >
      Jetzt bewerben
    </button>
  );
}
