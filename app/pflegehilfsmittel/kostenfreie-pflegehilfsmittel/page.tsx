import type { Metadata } from "next";
import { KostenfreiePflegehilfsmittelLanding } from "@/components/pflegehilfsmittel/KostenfreiePflegehilfsmittelLanding";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Kostenfreie Pflegehilfsmittel im Wert von 42€ | Direkt beantragen",
  description:
    "Sichern Sie sich Ihre kostenfreien Pflegehilfsmittel im Wert von 42€ pro Monat. Zuzahlungsfrei ab Pflegegrad 1. Wir übernehmen den Papierkram mit der Pflegekasse!",
  keywords: [
    "Pflegehilfsmittel",
    "42 Euro",
    "kostenfrei",
    "Pflegekasse",
    "Pflegegrad",
    "Pflegebox beantragen",
    "Bettschutzeinlagen",
    "Einmalhandschuhe",
  ],
  openGraph: {
    title: `Kostenfreie Pflegehilfsmittel im Wert von 42€ | ${siteConfig.name}`,
    description:
      "Sichern Sie sich Ihre kostenfreien Pflegehilfsmittel im Wert von 42€ pro Monat. Zuzahlungsfrei ab Pflegegrad 1.",
  },
};

export default function KostenfreiePflegehilfsmittelPage() {
  return <KostenfreiePflegehilfsmittelLanding />;
}
