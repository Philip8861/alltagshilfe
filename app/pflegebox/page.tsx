import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { PflegeboxConfiguratorFrame } from "./PflegeboxConfiguratorFrame";

export const metadata: Metadata = {
  title: "Pflegebox",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

export default function PflegeboxPage() {
  return (
    <div className="w-full max-w-full pb-24 sm:pb-32">
      <PflegeboxConfiguratorFrame />
    </div>
  );
}
