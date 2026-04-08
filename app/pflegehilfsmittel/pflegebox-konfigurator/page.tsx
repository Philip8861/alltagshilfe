import type { Metadata } from "next";
import { PflegeboxKonfiguratorLanding } from "@/components/pflegehilfsmittel/PflegeboxKonfiguratorLanding";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegebox-Konfigurator | Wunschbox zusammenstellen",
  description:
    "Stellen Sie Ihre kostenfreie Pflegebox zusammen: Handschuhe, Desinfektion, Bettschutz und mehr. Wir kümmern uns um die Abrechnung mit Ihrer Pflegekasse.",
  keywords: [
    "Pflegebox",
    "Konfigurator",
    "Pflegehilfsmittel",
    "42 Euro",
    "Pflegekasse",
    "SGB XI",
  ],
  openGraph: {
    title: `Pflegebox-Konfigurator | ${siteConfig.name}`,
    description:
      "Stellen Sie Ihre kostenfreie Pflegebox zusammen – wir übernehmen die Kommunikation mit der Pflegekasse.",
  },
};

export default function PflegeboxKonfiguratorPage() {
  return <PflegeboxKonfiguratorLanding />;
}
