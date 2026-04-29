import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  intro: string;
};

export function BlogCategoryCard({ slug, title, intro }: Props) {
  return (
    <Link
      href={`/blog/kategorie/${slug}`}
      className="rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm transition hover:border-[#0F4F68]/28 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/35 focus:ring-offset-2"
    >
      <h2 className="font-heading text-base font-bold text-[#0F4F68] md:text-lg">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">{intro}</p>
      <span className="mt-4 inline-flex text-sm font-semibold text-[#F78F2E]">
        Zu den Artikeln <span aria-hidden className="ml-1">
          →
        </span>
      </span>
    </Link>
  );
}
