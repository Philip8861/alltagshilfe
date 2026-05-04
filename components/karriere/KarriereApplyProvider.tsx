"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { BewerbungPlzVorabDialog } from "@/components/karriere/BewerbungPlzVorabDialog";
import { BewerbungsWizardDialog } from "@/components/karriere/BewerbungsWizardDialog";
import { KarriereApplyContext } from "@/components/karriere/karriereApplyContext";

export { useKarriereApply, useKarriereApplyOptional } from "@/components/karriere/karriereApplyContext";

export function KarriereApplyProvider({ children }: { children: ReactNode }) {
  const [gateJobTitle, setGateJobTitle] = useState<string | null>(null);
  const [wizardState, setWizardState] = useState<{
    jobTitle: string;
    initialPlz?: string;
  } | null>(null);
  const [pendingKarriereFiles, setPendingKarriereFilesState] = useState<File[]>([]);

  const openBewerbungsWizard = useCallback(
    (jobTitle: string, options?: { skipPlzGate?: boolean; initialPlz?: string }) => {
      if (options?.skipPlzGate) {
        setGateJobTitle(null);
        const p = options.initialPlz?.replace(/\D/g, "").slice(0, 5) ?? "";
        setWizardState({
          jobTitle,
          ...(p.length === 5 ? { initialPlz: p } : {}),
        });
        return;
      }
      setGateJobTitle(jobTitle);
    },
    [],
  );

  const closeWizard = useCallback(() => {
    setWizardState(null);
  }, []);

  const openInitiativWizardFromGate = useCallback((plz: string, sourceJobTitle: string) => {
    setGateJobTitle(null);
    const p = plz.replace(/\D/g, "").slice(0, 5);
    setWizardState({
      jobTitle: `Initiativbewerbung (vorab gewählt: ${sourceJobTitle})`,
      ...(p.length === 5 ? { initialPlz: p } : {}),
    });
  }, []);

  const handleAlltagshelferFromGate = useCallback((plz: string, jobTitle: string) => {
    setGateJobTitle(null);
    setWizardState({ jobTitle, initialPlz: plz });
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
      {gateJobTitle ? (
        <BewerbungPlzVorabDialog
          jobTitle={gateJobTitle}
          onDismiss={() => setGateJobTitle(null)}
          onAlltagshelferContinue={handleAlltagshelferFromGate}
          onInitiativOpenWizard={openInitiativWizardFromGate}
        />
      ) : null}
      {wizardState ? (
        <BewerbungsWizardDialog
          jobTitle={wizardState.jobTitle}
          initialPlz={wizardState.initialPlz}
          onDismiss={closeWizard}
        />
      ) : null}
    </KarriereApplyContext.Provider>
  );
}
