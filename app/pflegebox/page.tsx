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
      className="block w-full max-w-full border-0"
      style={{
        /* Explizite Höhe: flex-1 auf iframe kollabiert oft → Footer-Welle überdeckt den Inhalt */
        height: "max(520px, calc(100dvh - 10.5rem))",
      }}
    />
  );
}
