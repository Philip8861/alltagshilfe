import {
  RATGEBER_BYLINE_AUTHOR_TEXT,
  RATGEBER_BYLINE_REVIEWER_TEXT,
} from "@/config/ratgeber-article-byline";

export type RatgeberArticleQualityLinesProps = {
  reviewerText?: string;
  authorText?: string;
};

function IconShield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z" />
    </svg>
  );
}

function IconPen({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
      />
    </svg>
  );
}

/** Fachprüfung + Autorenzeile unter dem Ratgeber-Hero (Pflegegrad-Artikel & Co.) */
export function RatgeberArticleQualityLines({
  reviewerText = RATGEBER_BYLINE_REVIEWER_TEXT,
  authorText = RATGEBER_BYLINE_AUTHOR_TEXT,
}: RatgeberArticleQualityLinesProps = {}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:gap-2.5">
      <p className="flex min-w-0 items-start gap-2 text-sm leading-snug text-neutral-600">
        <IconShield className="mt-0.5 shrink-0 text-neutral-500" />
        <span>{reviewerText}</span>
      </p>
      <p className="flex min-w-0 items-start gap-2 text-sm leading-snug text-neutral-600">
        <IconPen className="mt-0.5 shrink-0 text-neutral-500" />
        <span>{authorText}</span>
      </p>
    </div>
  );
}
