"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RatgeberBeitragMeta } from "@/config/ratgeber-betraege";
import { primaryCategoryLabel } from "@/config/ratgeber-betraege";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

const NAVY = "#0F4F68";

type Props = {
  beitraege: RatgeberBeitragMeta[];
  getViews: (b: RatgeberBeitragMeta) => number;
};

function MiniCard({
  beitrag,
  getViews,
}: {
  beitrag: RatgeberBeitragMeta;
  getViews: (b: RatgeberBeitragMeta) => number;
}) {
  return (
    <Link
      href={`/ratgeber/${beitrag.slug}`}
      className="group flex h-full w-[17.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_10px_32px_-14px_rgba(15,79,104,0.22)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_-14px_rgba(15,79,104,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:w-[18.75rem]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
        <Image
          src={beitrag.image}
          alt={beitrag.imageAlt}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="300px"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] text-neutral-600 sm:text-xs">
          <span className="font-semibold text-[#0F4F68]">{primaryCategoryLabel(beitrag)}</span>
          <span className="flex items-center gap-0.5">
            <EyeIcon className="text-neutral-400" aria-hidden />
            <span>{getViews(beitrag).toLocaleString("de-DE")}</span>
            <span className="sr-only">Aufrufe</span>
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm font-bold leading-snug" style={{ color: NAVY }}>
          {beitrag.title}
        </p>
      </div>
    </Link>
  );
}

/**
 * Alle Beiträge in einem endlosen Laufband (rechts → links). Bei „Reduzierte Bewegung“ horizontales Scrollen.
 */
export function RatgeberMarquee({ beitraege, getViews }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const listener = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  if (beitraege.length === 0) return null;

  const duplicated = [...beitraege, ...beitraege];

  return (
    <div
      className="relative rounded-2xl border border-neutral-100 bg-gradient-to-br from-[#FDFEFE] via-white to-[#F2F9FA]/50 py-5 pl-1 pr-1 sm:py-6"
      aria-label="Alle Ratgeber-Beiträge – Laufband"
    >
      <p className="mb-4 px-2 text-xs text-neutral-500 sm:px-3">
        Überblick: alle Beiträge ziehen langsam vorbei. Anhalten: Cursor auf die Karten. Bei reduzierter Bewegung: seitlich scrollen.
      </p>
      {reduceMotion ? (
        <div className="flex gap-5 overflow-x-auto pb-3 pl-2 pr-2 [-webkit-overflow-scrolling:touch]" tabIndex={0}>
          {beitraege.map((b) => (
            <MiniCard key={b.slug} beitrag={b} getViews={getViews} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="flex w-max animate-ratgeber-marquee gap-6 hover:[animation-play-state:paused]">
            {duplicated.map((b, idx) => (
              <MiniCard key={`${b.slug}-${idx}`} beitrag={b} getViews={getViews} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
