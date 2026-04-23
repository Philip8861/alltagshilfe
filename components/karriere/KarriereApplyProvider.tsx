"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { BewerbungsWizardDialog } from "@/components/karriere/BewerbungsWizardDialog";
import { KarriereApplyContext } from "@/components/karriere/karriereApplyContext";

export { useKarriereApply, useKarriereApplyOptional } from "@/components/karriere/karriereApplyContext";

export function KarriereApplyProvider({ children }: { children: ReactNode }) {
  const [wizardJobTitle, setWizardJobTitle] = useState<string | null>(null);
  const [pendingKarriereFiles, setPendingKarriereFilesState] = useState<File[]>([]);

  const openBewerbungsWizard = useCallback((jobTitle: string) => {
    setWizardJobTitle(jobTitle);
  }, []);

  const closeWizard = useCallback(() => {
    setWizardJobTitle(null);
  }, []);

  const setPendingKarriereFiles = useCallback((files: File[]) => {
    setPendingKarriereFilesState(files);
  }, []);

  const clearPendingKarriereFiles = useCallback(() => {
    setPendingKarriereFilesState([]);
  }, []);

  const value = useMemo(
    () => ({
      openBewerbungsWizard,
      pendingKarriereFiles,
      setPendingKarriereFiles,
      clearPendingKarriereFiles,
    }),
    [openBewerbungsWizard, pendingKarriereFiles, setPendingKarriereFiles, clearPendingKarriereFiles],
  );

  return (
    <KarriereApplyContext.Provider value={value}>
      {children}
      {wizardJobTitle ? (
        <BewerbungsWizardDialog jobTitle={wizardJobTitle} onDismiss={closeWizard} />
      ) : null}
    </KarriereApplyContext.Provider>
  );
}
