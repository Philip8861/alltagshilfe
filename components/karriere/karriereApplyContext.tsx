"use client";

import { createContext, useContext } from "react";

export type KarriereApplyContextValue = {
  openBewerbungsWizard: (jobTitle: string) => void;
  pendingKarriereFiles: File[];
  setPendingKarriereFiles: (files: File[]) => void;
  clearPendingKarriereFiles: () => void;
};

export const KarriereApplyContext = createContext<KarriereApplyContextValue | null>(null);

export function useKarriereApplyOptional() {
  return useContext(KarriereApplyContext);
}

export function useKarriereApply() {
  const v = useContext(KarriereApplyContext);
  if (!v) {
    throw new Error("useKarriereApply muss innerhalb von KarriereApplyProvider verwendet werden.");
  }
  return v;
}
