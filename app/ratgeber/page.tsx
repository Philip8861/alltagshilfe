import type { Metadata } from "next";
import { RatgeberHub } from "@/components/ratgeber/RatgeberHub";
import { siteConfig } from "@/config/site";
import { fetchRatgeberArticleViewTotals } from "@/lib/ratgeber/article-view-totals";

export const metadata: Metadata = {
  title: "Ratgeber",
  description: `Ratgeber zur Pflege – verständliche Artikel zu Leistungen, Pflegegraden, Entlastung und mehr. ${siteConfig.name}.`,
};

export default async function RatgeberPage() {
  const { bySlug, live } = await fetchRatgeberArticleViewTotals();

  return (
    <article className="min-w-0 bg-[#FAFBFC] pb-16 pt-0 sm:pb-24">
      <RatgeberHub initialArticleViewTotals={bySlug} articleViewsLive={live} />
    </article>
  );
}
