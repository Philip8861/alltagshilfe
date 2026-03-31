import type { Metadata } from "next";
import { PflegeboxConfiguratorIframe } from "@/components/pflegebox/PflegeboxConfiguratorIframe";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegebox",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

export default function PflegeboxPage() {
  return (
    <div className="w-full max-w-full">
      <PflegeboxConfiguratorIframe
        src="/konfigurator/index.html?embed=1&v=kfg-layout-9"
        title="Pflegebox-Konfigurator – Produkte auswählen"
      />
    </div>
  );
}
