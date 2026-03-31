import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PflegeboxConfiguratorIframe } from "./PflegeboxConfiguratorIframe";

export const metadata: Metadata = {
  title: "Pflegebox",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

export default function PflegeboxPage() {
  return (
    <div id="pflegebox-root" className="min-w-0 w-full max-w-full bg-[#f1f9fb]">
      <PflegeboxConfiguratorIframe />
    </div>
  );
}
