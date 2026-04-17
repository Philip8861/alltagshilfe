import type { Metadata } from "next";
import { HaushaltshilfeLanding } from "@/components/leistungen/HaushaltshilfeLanding";
import { siteConfig } from "@/config/site";

const PATH = "/leistungen/haushaltshilfe" as const;

export const metadata: Metadata = {
  title: "Haushaltshilfe ganz in Ihrer Nähe",
  description: `Haushaltshilfe & haushaltsnahe Dienstleistungen: Kosten, Krankenkasse, Entlastungsbetrag, feste Bezugsperson, Region. ${siteConfig.name} – jetzt unverbindlich anfragen.`,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Haushaltshilfe ganz in Ihrer Nähe | ${siteConfig.name}`,
    description:
      "Haushaltshilfe regional: Reinigung, Wäsche, Mahlzeiten u. v. m. – mit Transparenz per App, Zulassung bei allen Kassen, schnelle Terminvergabe.",
  },
};

export default function HaushaltshilfePage() {
  return <HaushaltshilfeLanding />;
}
