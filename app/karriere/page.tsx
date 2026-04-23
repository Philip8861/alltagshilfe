import type { Metadata } from "next";
import { KarriereApplyProvider } from "@/components/karriere/KarriereApplyProvider";
import { KarriereLanding } from "@/components/karriere/KarriereLanding";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Karriere",
  description: `Karriere und Stellenangebote – ${siteConfig.name}. Werden Sie Teil unseres Teams.`,
  alternates: { canonical: "/karriere" },
  openGraph: {
    title: `Karriere | ${siteConfig.name}`,
    description: "Karriere bei Alltagshilfe-Süd: offene Stellen, Bewerbung, Ansprechpartner.",
  },
};

export default function KarrierePage() {
  return (
    <KarriereApplyProvider>
      <KarriereLanding />
    </KarriereApplyProvider>
  );
}
