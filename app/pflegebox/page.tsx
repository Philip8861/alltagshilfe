import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegebox",
  description: `Pflegebox-Konfigurator – ${siteConfig.name}. Wählen Sie Ihre Produkte für die Pflegebox.`,
};

export default function PflegeboxPage() {
  return (
    <article className="min-h-[80vh] w-full">
      <iframe
        src="/konfigurator/index.html"
        title="Pflegebox-Konfigurator – Produkte auswählen"
        className="h-[calc(100vh-8rem)] min-h-[700px] w-full border-0"
      />
    </article>
  );
}
