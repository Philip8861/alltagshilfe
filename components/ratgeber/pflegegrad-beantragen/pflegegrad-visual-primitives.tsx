import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const ACCENT = "#F78F2E";

/** Absatz mit orangefarbener Nr. + H2 – optional Kinder für den gesamten Abschnitt in einem gemeinsamen `<section id>`. */
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
  /** Abschnittstext nach der Überschrift */
  children?: ReactNode;
  className?: string;
  /** Erster Abschnitt im Artikel: ohne oberen Rand/Border */
  isFirst?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 border-t border-neutral-200/80 pt-11",
        isFirst ? "border-t-0 pt-0" : undefined,
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="text-sm font-semibold tabular-nums" style={{ color: ACCENT }}>
          {sectionNum}
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-[#0F4F68] sm:text-[1.65rem] sm:leading-snug">
          {heading}
        </h2>
      </div>
      {children ? <div className="mt-6 min-w-0">{children}</div> : null}
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
      ? "border-[#F78F2E]/35 bg-[#fffbf7]"
      : "border-[#0F4F68]/18 bg-[#f6fafb]";
  return (
    <aside
      className={cn("mt-6 rounded-xl border px-4 py-3 text-[1.0625rem] leading-relaxed text-neutral-700", tint)}
      aria-label={title}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/75">{title}</p>
      <div className="mt-1.5">{children}</div>
    </aside>
  );
}

export function DecorativeIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden />;
}
