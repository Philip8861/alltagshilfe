import type { Metadata } from "next";
import { HaushaltshilfeLanding } from "@/components/leistungen/HaushaltshilfeLanding";
import { siteConfig } from "@/config/site";

const PATH = "/leistungen/haushaltshilfe" as const;

export const metadata: Metadata = {
  title: "Haushaltshilfe ganz in Ihrer Nähe",
  description: `Haushaltshilfe und haushaltsnahe Unterstützung regional und persönlich – ${siteConfig.name}. Jetzt unverbindlich anfragen.`,
  alternates: { canonical: PATH },
  openGraph: {
    title: `Haushaltshilfe ganz in Ihrer Nähe | ${siteConfig.name}`,
    description:
      "Haushaltshilfe und haushaltsnahe Unterstützung: regional, verlässlich und auf Ihren Alltag abgestimmt.",
  },
};

export default function HaushaltshilfePage() {
  return <HaushaltshilfeLanding />;
}
