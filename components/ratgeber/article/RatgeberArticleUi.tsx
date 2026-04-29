import type { ReactNode } from "react";

/** Standard-Überschrift H2 für Ratgeber-Abschnitte. */
export function RatArtH2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-28 text-2xl font-bold tracking-tight text-[#0F4F68] sm:text-[1.65rem] sm:leading-snug">
      {children}
    </h2>
  );
}

export function RatArtH3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3
      {...(id ? { id } : {})}
      className="scroll-mt-28 text-xl font-bold tracking-tight text-[#0F4F68] sm:text-[1.25rem]"
    >
      {children}
    </h3>
  );
}

/** Kurzantwort direkt unter dem Hero. */
export function RatQuickAnswerBox({
  title,
  children,
  note,
}: {
  title: string;
  children: ReactNode;
  note?: ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border border-[#0F4F68]/14 bg-[#F8FCFD] p-6 shadow-sm sm:p-8"
      aria-labelledby="kurzantwort-heading"
    >
      <div className="flex gap-3">
        <span
          className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68]/10 text-[#0F4F68]"
          aria-hidden
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <div className="min-w-0">
          <p id="kurzantwort-heading" className="text-base font-bold text-[#0F4F68]">
            {title}
          </p>
          <div className="mt-3 space-y-3 text-[1.0625rem] leading-relaxed text-neutral-800">{children}</div>
          {note ? (
            <div className="mt-5 rounded-xl border border-amber-200/80 bg-[#fff8ee] px-4 py-3 text-sm leading-relaxed text-neutral-800">
              {note}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Key-Facts und kompakte Tabellen (2+ Spalten; erste Spalte als Zeilenkopf). */
export function RatResponsiveTable({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: readonly string[];
  rows: readonly (readonly string[])[];
}) {
  const colCount = head.length;
  if (colCount < 2) {
    throw new Error("RatResponsiveTable: mindestens zwei Spalten (head).");
  }
  const minWClass = colCount >= 3 ? "min-w-[min(100%,48rem)]" : "min-w-[min(100%,36rem)]";
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#0F4F68]/12 bg-white shadow-sm">
      <table className={`w-full ${minWClass} text-left text-[1.0625rem] leading-relaxed`}>
        <caption className="border-b border-[#0F4F68]/08 bg-[#f7fbfc] px-4 py-3 text-left text-sm font-bold text-[#0F4F68]">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-[#0F4F68]/10 bg-[#fafcfb]">
            {head.map((h, hi) => (
              <th
                key={`${h}-${hi}`}
                scope="col"
                className="px-4 py-3 font-semibold text-[#0F4F68]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]/90"}>
              {row.map((cell, ci) =>
                ci === 0 ? (
                  <th key={`${i}-${ci}`} scope="row" className="align-top px-4 py-3 font-medium text-neutral-800">
                    {cell}
                  </th>
                ) : (
                  <td key={`${i}-${ci}`} className="align-top px-4 py-3 text-neutral-800">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Mehrspaltige Leistungs-Tabelle (horizontal scrollbar auf schmalen Viewports). */
export function RatBenefitsTable({
  caption,
  head,
  body,
}: {
  caption: string;
  head: string[];
  body: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#0F4F68]/12 bg-white shadow-md">
      <table className="w-full min-w-[52rem] border-collapse text-center text-[0.9375rem] leading-snug sm:text-[1rem]">
        <caption className="border-b border-[#0F4F68]/08 bg-[#f7fbfc] px-3 py-3 text-left text-sm font-bold text-[#0F4F68] sm:px-4">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-[#0F4F68]/12 bg-[#eaf4f8]">
            {head.map((h, i) => (
              <th
                key={h}
                scope="col"
                className={`px-2 py-3 font-bold text-[#0F4F68] ${i === 0 ? "text-left pl-4" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#fafcfb]"}>
              {row.map((cell, ci) =>
                ci === 0 ? (
                  <th
                    key={`${ri}-${ci}`}
                    scope="row"
                    className="border-r border-neutral-100 px-4 py-3 text-left font-semibold text-[#0F4F68]"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={`${ri}-${ci}`} className="px-2 py-3 font-medium text-neutral-800">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Info / Hinweis / Warnung — optisch zurückhaltend */
export function RatInfoBox({
  tone = "blue",
  title,
  children,
}: {
  tone?: "blue" | "amber" | "green";
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    blue: "border-sky-200/90 bg-[#f0f7fb]",
    amber: "border-amber-200/90 bg-[#fff8ee]",
    green: "border-emerald-200/80 bg-[#f3fbf7]",
  } as const;
  const bar = {
    blue: "bg-[#0F4F68]/85",
    amber: "bg-[#ea8c36]",
    green: "bg-emerald-700/80",
  } as const;
  return (
    <aside className={`relative overflow-hidden rounded-2xl border ${tones[tone]} p-5 shadow-sm sm:p-6`}>
      <span className={`absolute left-0 top-0 block h-full w-1 rounded-l-2xl ${bar[tone]}`} aria-hidden />
      <div className="pl-3">
        {title ? <p className="text-sm font-bold text-[#0F4F68]">{title}</p> : null}
        <div className={title ? "mt-2 text-[1.0625rem] leading-relaxed text-neutral-800" : "text-[1.0625rem] leading-relaxed text-neutral-800"}>
          {children}
        </div>
      </div>
    </aside>
  );
}

/** Nummerierter Schritt */
export function RatStepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start gap-4">
        <span
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F4F68] text-lg font-black text-white"
          aria-hidden
        >
          {step}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold tracking-tight text-[#0F4F68] sm:text-[1.25rem]">
            Schritt {step}: {title}
          </h3>
          <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-neutral-800">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function RatQuoteBox({ children }: { children: ReactNode }) {
  return (
    <blockquote className="rounded-2xl border border-[#0F4F68]/14 bg-[#fafcfb] px-5 py-4 text-[1.05rem] font-medium italic leading-relaxed text-[#284e60] sm:px-6">
      {children}
    </blockquote>
  );
}

export function RatProseParagraph({ children }: { children: ReactNode }) {
  return <p className="text-[1.0625rem] leading-[1.77] text-neutral-800">{children}</p>;
}

export function RatServiceCtaSection({
  children,
  labelledBy = "ahs-service-rat-heading",
}: {
  children: ReactNode;
  /** ID der sichtbaren Abschnittsüberschrift (RatArt-H2); Standard für bestehende Seiten */
  labelledBy?: string;
}) {
  return (
    <section
      className="rounded-[1.35rem] border border-[#0F4F68]/14 bg-gradient-to-br from-[#fafcfb] via-white to-[#fff8f2] px-6 py-8 shadow-md sm:px-10 sm:py-10"
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  );
}

export function RatChecklistCard({ items }: { items: string[] }) {
  return (
    <div className="rounded-2xl border border-[#0F4F68]/12 bg-[#fafcfb] p-6 shadow-inner sm:p-8">
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-[1.0625rem] leading-relaxed text-neutral-800">
            <span
              className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#0F4F68]/35 bg-white text-xs font-bold text-[#0F4F68]"
              aria-hidden
            >
              ☐
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RatSourcesFooter({
  updatedLabel,
  children,
  suppressBuiltinTitle = false,
}: {
  updatedLabel: string;
  children: ReactNode;
  /** Wenn z. B. bereits eine eigene H2 („Quellen“) gesetzt wird. */
  suppressBuiltinTitle?: boolean;
}) {
  return (
    <footer className="rounded-2xl border border-neutral-200/90 bg-neutral-50/80 px-5 py-6 text-sm leading-relaxed text-neutral-700 sm:px-7">
      {suppressBuiltinTitle ? null : (
        <p className="font-semibold text-neutral-800">Quellen und Stand</p>
      )}
      <p className="mt-2">
        <strong className="text-[#0F4F68]">Stand dieses Ratgebers:</strong> {updatedLabel}
      </p>
      <div className="mt-4 space-y-3">{children}</div>
    </footer>
  );
}

export function RatExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[#0F4F68] underline decoration-[#0F4F68]/35 underline-offset-2 transition hover:text-[#0a3e52]"
    >
      {children}
    </a>
  );
}

/** natives <details> – ohne Client-JS nutzbar */
export function RatFaqAccordion({ items }: { items: { id: string; q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          className="group rounded-2xl border border-[#0F4F68]/11 bg-white shadow-sm transition open:border-[#0F4F68]/22 open:shadow-md"
          name="ratgeber-faq"
        >
          <summary className="cursor-pointer select-none list-none px-5 py-4 pr-12 text-[1.05rem] font-semibold leading-snug text-[#0F4F68] marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="relative block">{item.q}</span>
          </summary>
          <div className="border-t border-[#0F4F68]/08 px-5 pb-5 pt-4 text-[1.0625rem] leading-relaxed text-neutral-800">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}

export function RatTocNav({ entries }: { entries: { id: string; label: string }[] }) {
  return (
    <nav aria-labelledby="rat-toc-heading" className="text-sm leading-snug text-neutral-700">
      <p id="rat-toc-heading" className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0F4F68]">
        Inhalt
      </p>
      <ol className="mt-3 max-h-[min(70vh,28rem)] space-y-2 overflow-y-auto pr-1 text-[0.9rem] sm:text-[0.9375rem]">
        {entries.map((e, i) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className="flex gap-2 rounded-lg px-2 py-1.5 text-left font-medium text-[#284e60] underline-offset-[0.2rem] hover:bg-[#F2F9FA] hover:text-[#0F4F68] hover:underline"
            >
              <span className="mt-px shrink-0 font-semibold text-[#F78F2E]" aria-hidden>
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{e.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
