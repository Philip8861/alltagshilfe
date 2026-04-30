import { RatgeberSidebarBeratungTeaser } from "@/components/ratgeber/RatgeberBeratungDialog";
import type { HilfefinderServiceKey } from "@/config/hilfefinder-services";

export type RatgeberArticleTocEntry = {
  id: string;
  label: string;
};

type RatgeberArticleDesktopSidebarProps = {
  tocEntries: readonly RatgeberArticleTocEntry[];
  tocLinkClassName: string;
  supportLine: string;
  preselectedServices?: HilfefinderServiceKey[];
  contextNote: string;
};

/**
 * Desktop-Sidebar (lg+) für Ratgeber-Artikel: Inhaltsverzeichnis scrollt mit dem Dokument,
 * der Beratungs-/Teaser-Kasten bleibt unter dem Header klebend (position: sticky).
 */
export function RatgeberArticleDesktopSidebar({
  tocEntries,
  tocLinkClassName,
  supportLine,
  preselectedServices,
  contextNote,
}: RatgeberArticleDesktopSidebarProps) {
  const sectionIds = tocEntries.map((e) => e.id);

  return (
    <aside className="hidden min-h-0 shrink-0 lg:block lg:w-[280px] lg:max-w-[280px]">
      <nav
        aria-label="Inhalt"
        className="relative max-h-[min(70dvh,calc(100dvh-var(--ahs-header-scroll-padding)-10rem))] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200/95 bg-white px-4 py-4 shadow-[0_2px_16px_-10px_rgba(15,79,104,0.1)] [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable] sm:px-5 sm:py-5"
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

      <div className="sticky top-[var(--ahs-header-scroll-padding)] z-10 mt-5 min-w-0 self-start">
        <div className="max-h-[calc(100dvh-var(--ahs-header-scroll-padding)-max(26vh,13rem))] overflow-y-auto overflow-x-hidden overscroll-contain [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable] pr-0.5">
          <RatgeberSidebarBeratungTeaser
            supportLine={supportLine}
            preselectedServices={preselectedServices}
            contextNote={contextNote}
            articleSectionIds={sectionIds}
          />
        </div>
      </div>
    </aside>
  );
}
