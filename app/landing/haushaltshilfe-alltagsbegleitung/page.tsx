import type { Metadata } from "next";
import { HaushaltAlltagsFbLanding } from "@/components/landing/HaushaltAlltagsFbLanding";
import { siteConfig } from "@/config/site";

const PATH = "/landing/haushaltshilfe-alltagsbegleitung" as const;

export const metadata: Metadata = {
  title: "Haushaltshilfe & Alltagsbegleitung ganz in Ihrer Nähe",
  description: `Haushaltshilfe & Alltagsbegleitung in Ihrer Nähe: In 30 Sekunden zur passenden Hilfe. Kosten, Krankenkasse, feste Bezugsperson. ${siteConfig.name}.`,
  alternates: { canonical: PATH },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: `Haushaltshilfe & Alltagsbegleitung | ${siteConfig.name}`,
    description:
      "Haushaltshilfe und Alltagsbegleitung regional – in 30 Sekunden zur passenden Hilfe. Unverbindlich anfragen.",
  },
};

export default function HaushaltAlltagsFbLandingPage() {
  return <HaushaltAlltagsFbLanding />;
}
