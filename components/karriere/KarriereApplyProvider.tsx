"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { BewerbungsWizardDialog } from "@/components/karriere/BewerbungsWizardDialog";

type KarriereApplyContextValue = {
  openBewerbungsWizard: (jobTitle: string) => void;
};

const KarriereApplyContext = createContext<KarriereApplyContextValue | null>(null);

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

export function KarriereApplyProvider({ children }: { children: ReactNode }) {
  const [wizardJobTitle, setWizardJobTitle] = useState<string | null>(null);

  const openBewerbungsWizard = useCallback((jobTitle: string) => {
    setWizardJobTitle(jobTitle);
  }, []);

  const closeWizard = useCallback(() => {
    setWizardJobTitle(null);
  }, []);

  const value = useMemo(() => ({ openBewerbungsWizard }), [openBewerbungsWizard]);

  return (
    <KarriereApplyContext.Provider value={value}>
      {children}
      {wizardJobTitle ? (
        <BewerbungsWizardDialog jobTitle={wizardJobTitle} onDismiss={closeWizard} />
      ) : null}
    </KarriereApplyContext.Provider>
  );
}
