import type { Metadata } from "next";
import { BlogOverview } from "@/components/blog/BlogOverview";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflege-Blog: Ratgeber für Angehörige",
  description:
    "Pflegegrad, Begutachtung, Leistungen und Alltag – ausführliche Ratgeber ohne dünne Keyword-Seiten. " + siteConfig.name + ".",
};

export default function BlogIndexPage() {
  return <BlogOverview />;
}
