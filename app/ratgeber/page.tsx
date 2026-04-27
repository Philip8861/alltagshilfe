import type { Metadata } from "next";
import { RatgeberHub } from "@/components/ratgeber/RatgeberHub";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ratgeber",
  description: `Ratgeber zur Pflege – verständliche Artikel zu Leistungen, Pflegegraden, Entlastung und mehr. ${siteConfig.name}.`,
};

export default function RatgeberPage() {
  return (
    <article className="min-w-0 bg-[#FFFBF7] pb-16 pt-0 sm:pb-24">
      <RatgeberHub />
    </article>
  );
}
