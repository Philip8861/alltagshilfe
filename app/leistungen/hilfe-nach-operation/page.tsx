import type { Metadata } from "next";
import { HilfeNachOperationLanding } from "@/components/leistungen/HilfeNachOperationLanding";
import { siteConfig } from "@/config/site";

const PATH = "/leistungen/hilfe-nach-operation" as const;

export const metadata: Metadata = {
  title: "Hilfe nach Operation, Haushaltshilfe oder Schwangerschaft ganz in Ihrer Nähe",
  description: `Entlastung nach OP, Unfall oder Geburt: Haushalt, Betreuung, Begleitung – Kosten, Kasse, Entlastungsbetrag, Region. ${siteConfig.name} – jetzt unverbindlich anfragen.`,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Hilfe nach Operation, Haushaltshilfe oder Schwangerschaft | ${siteConfig.name}`,
    description:
      "Unterstützung in besonderen Lebenslagen: zuverlässig, mit Zulassung bei allen Kassen, feste Ansprechpartner – schnelle Terminvergabe.",
  },
};

export default function HilfeNachOperationPage() {
  return <HilfeNachOperationLanding />;
}
