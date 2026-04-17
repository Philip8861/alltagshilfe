import type { Metadata } from "next";
import { AlltagsbegleitungBetreuungLanding } from "@/components/leistungen/AlltagsbegleitungBetreuungLanding";
import { siteConfig } from "@/config/site";

const PATH = "/leistungen/alltagsbegleitung-betreuung" as const;

export const metadata: Metadata = {
  title: "Alltagsbegleitung und Betreuung ganz in Ihrer Nähe",
  description: `Alltagsbegleitung und Betreuung: gemeinsam im Alltag, regional bei ${siteConfig.name}. Kosten, Krankenkasse, Entlastungsbetrag. Jetzt unverbindlich anfragen.`,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Alltagsbegleitung und Betreuung | ${siteConfig.name}`,
    description:
      "Begleitung, Beschäftigung und Unterstützung im Alltag: zuverlässig, mit festen Bezugspersonen und Transparenz per App.",
  },
};

export default function AlltagsbegleitungBetreuungPage() {
  return <AlltagsbegleitungBetreuungLanding />;
}
