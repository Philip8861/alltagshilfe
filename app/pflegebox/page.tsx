import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegebox",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

export default function PflegeboxPage() {
  return (
    <iframe
      src="/konfigurator/index.html?embed=1"
      title="Pflegebox-Konfigurator – Produkte auswählen"
      className="block min-h-0 w-full min-w-0 flex-1 border-0"
    />
  );
}
