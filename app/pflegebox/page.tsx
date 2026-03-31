import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegebox",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

export default function PflegeboxPage() {
  return (
    <div className="w-full max-w-full pb-24 sm:pb-32">
      <iframe
        src="/konfigurator/index.html?embed=1&v=kfg-layout-7"
        title="Pflegebox-Konfigurator – Produkte auswählen"
        className="block w-full max-w-full border-0"
        style={{
          height: "max(520px, calc(100dvh - 10.5rem))",
          minHeight: "max(520px, calc(100dvh - 10.5rem))",
        }}
      />
    </div>
  );
}
