export type RatgeberArticleTocEntry = {
  id: string;
  label: string;
};

type RatgeberArticleDesktopSidebarProps = {
  tocEntries: readonly RatgeberArticleTocEntry[];
  tocLinkClassName: string;
};

/** Desktop-Sidebar (lg+) für Ratgeber-Artikel: Inhaltsverzeichnis scrollt mit dem Dokument. */
export function RatgeberArticleDesktopSidebar({ tocEntries, tocLinkClassName }: RatgeberArticleDesktopSidebarProps) {
  return (
    <aside className="hidden min-h-0 shrink-0 lg:block lg:w-[280px] lg:max-w-[280px]">
      <nav
        aria-label="Inhalt"
        className="relative sticky top-[var(--ahs-header-scroll-padding)] max-h-[min(70dvh,calc(100dvh-var(--ahs-header-scroll-padding)-2rem))] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200/95 bg-white px-4 py-4 shadow-[0_2px_16px_-10px_rgba(15,79,104,0.1)] [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable] sm:px-5 sm:py-5"
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0F4F68]/45 to-[#F78F2E]/35" />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Inhalt</p>
        <ol className="mt-3 space-y-2.5">
          {tocEntries.map((e, i) => (
            <li key={e.id} className="flex gap-1.5 text-sm leading-snug">
              <span className="w-7 shrink-0 font-semibold tabular-nums text-[#F78F2E]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a href={`#${e.id}`} className={tocLinkClassName}>
                {e.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
