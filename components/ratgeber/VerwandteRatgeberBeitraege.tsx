import Image from "next/image";
import Link from "next/link";
import { getVerwandteRatgeberBeitraege } from "@/config/ratgeber-betraege";

type Props = {
  currentSlug: string;
};

export function VerwandteRatgeberBeitraege({ currentSlug }: Props) {
  const verwandte = getVerwandteRatgeberBeitraege(currentSlug, 4);
  if (verwandte.length === 0) return null;

  return (
    <section
      className="mt-12 rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#f8fcfd] via-white to-[#fff8f2] p-6 sm:p-8"
      aria-labelledby="verwandte-ratgeber-heading"
    >
      <h2 id="verwandte-ratgeber-heading" className="text-2xl font-bold text-[#0F4F68] sm:text-3xl">
        Verwandte Beiträge
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
        Weitere Ratgeber-Themen, die gut zu diesem Beitrag passen.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {verwandte.map((beitrag) => (
          <li key={beitrag.slug}>
            <Link
              href={`/ratgeber/${beitrag.slug}`}
              className="group flex gap-4 rounded-xl border border-[#0F4F68]/10 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F4F68]/25 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={beitrag.image}
                  alt={beitrag.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="128px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/75">Ratgeber</p>
                <p className="mt-1 text-base font-bold text-[#0F4F68] group-hover:underline">{beitrag.title}</p>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{beitrag.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6">
        <Link
          href="/ratgeber"
          className="inline-flex items-center text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
        >
          Alle Ratgeber-Beiträge
        </Link>
      </p>
    </section>
  );
}
