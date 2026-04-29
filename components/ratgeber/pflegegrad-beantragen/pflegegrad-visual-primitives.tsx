import type { ReactNode } from "react";

import { cn } from "@/lib/utils";


/** Größere Zwischenüberschrift (unterhalb von H2) mit dekorativer Linie — semantisches H3 */
export function ArticleSubtitle({
  id,
  eyebrow,
  children,
  className,
}: {
  id?: string;
  /** z. B. „Orientierung“, optional */
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("scroll-mt-28 pt-11 first:pt-6", className)}>
      {eyebrow ? (
        <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#5a959e]">{eyebrow}</p>
      ) : null}
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <h3
          id={id}
          className="text-[1.25rem] font-semibold leading-snug tracking-tight text-[#0F4F68] sm:text-[1.35rem]"
        >
          {children}
        </h3>
        <span
          className="h-px min-w-[3rem] flex-1 rounded-full bg-gradient-to-r from-[#F78F2E]/85 via-[#0F4F68]/35 to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );
}

/** Kleine Schritt-/Detailüberschrift (H3) mit Akzentstreifen links */
export function ArticleStepHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="mt-9 scroll-mt-28 border-l-[4px] border-[#F78F2E]/90 pl-[0.875rem] text-[1.0625rem] font-semibold leading-snug text-[#0F4F68] first:mt-2 sm:text-[1.09rem]"
    >
      {children}
    </h3>
  );
}

/** Absatz mit grafischer Hauptüberschrift (Nummer im Badge + Verlauf). */
export function ArticleSectionHeading({
  sectionNum,
  id,
  heading,
  children,
  className,
  isFirst,
}: {
  /** z. B. "01", "02" */
  sectionNum: string;
  id: string;
  heading: ReactNode;
  children?: ReactNode;
  className?: string;
  isFirst?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 border-t border-neutral-200/90 pt-[2.625rem]",
        isFirst ? "border-t-0 pt-0" : undefined,
        className,
      )}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
        <span
          className="inline-flex h-[2.5rem] min-w-[3.25rem] shrink-0 items-center justify-center rounded-xl border border-[#0F4F68]/22 bg-[#0f4f6810] text-[0.95rem] font-bold tabular-nums text-[PETROL]"
          aria-hidden
        >
          {sectionNum}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[1.45rem] font-semibold leading-snug tracking-tight text-[#0F4F68] sm:text-[1.7rem] sm:leading-[1.3]">
            {heading}
          </h2>
          <div
            className="mt-[0.55rem] h-[3px] w-[min(100%,14rem)] rounded-full bg-gradient-to-r from-[#0F4F68] via-[#3d8ea0] to-[#F78F2E]/90"
            aria-hidden
          />
        </div>
      </header>
      {children ? <div className={cn(isFirst ? "mt-8" : "mt-9", "min-w-0")}>{children}</div> : null}
    </section>
  );
}

export function PflegegradCallout({
  variant = "blue",
  title,
  children,
}: {
  variant?: "blue" | "orange";
  title: string;
  children: ReactNode;
}) {
  const tint =
    variant === "orange"
      ? "border-[#F78F2E]/38 bg-[linear-gradient(160deg,#fffdfb_0%,#fff8f4_55%,#fafafa_100%)]"
      : "border-[#0F4F68]/22 bg-[linear-gradient(160deg,#f9fcfc_0%,#f3f9fa_50%,#ffffff_100%)]";
  const stripe = variant === "orange" ? "from-[#F78F2E]" : "from-[#0F4F68]";
  return (
    <aside className={cn("relative mt-8 overflow-hidden rounded-xl border px-4 py-[0.95rem] pl-[1.125rem]", tint)} aria-label={title}>
      <div className={cn("absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b to-transparent opacity-90", stripe)} aria-hidden />
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e]">{title}</p>
      <div className="mt-2 text-[1.0625rem] leading-relaxed text-neutral-700">{children}</div>
    </aside>
  );
}

export function DecorativeIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden />;
}
