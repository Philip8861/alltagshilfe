"use client";

import Link from "next/link";
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
      <Link
        href={`/kontakt?betreff=Bewerbung%20${encodeURIComponent(jobTitle)}`}
        className={className}
      >
        Jetzt bewerben
      </Link>
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
