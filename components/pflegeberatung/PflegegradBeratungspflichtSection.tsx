/**
 * §37.3 SGB XI: Pflicht vs. freiwillige Beratung nach Pflegegrad – kompakte Übersicht.
 */
const PFLICHT_ITEMS = [
  {
    grad: "Pflegegrad 2 und 3",
    text: "Beratungseinsätze sind halbjährlich verpflichtend.",
  },
  {
    grad: "Pflegegrad 4 und 5",
    text: "Beratungseinsätze sind vierteljährlich verpflichtend.",
  },
] as const;

const FREIWILLIG_ITEMS = [
  {
    grad: "Pflegegrad 1",
    text: "Beratung ist nicht verpflichtend – Sie dürfen sie jedoch bis zu zweimal im Jahr kostenlos in Anspruch nehmen.",
  },
  {
    grad: "Pflegesachleistungen",
    text: "Beziehen Sie Leistungen eines ambulanten Pflegedienstes, gilt die freiwillige Beratung ebenfalls bis zu zweimal jährlich – ohne Zusatzkosten für Sie.",
  },
] as const;

const SECTION_TITLE_CLASS = "text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl";

export function PflegegradBeratungspflichtSection() {
  return (
    <section
      className="border-y border-[#0F4F68]/10 bg-white py-14 sm:py-16"
      aria-labelledby="pg-beratungspflicht-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-[var(--ahs-page-gutter)]">
        <h2 id="pg-beratungspflicht-heading" className={SECTION_TITLE_CLASS}>
          Pflegegrad 1–5: Wann Beratung Pflicht ist – und wann nicht
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          Die gesetzlichen Regelungen nach §37.3 SGB XI sind eindeutig. Hier die Übersicht – die Kosten trägt in diesen
          Fällen immer Ihre Pflegekasse.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#F78F2E]/25 bg-gradient-to-br from-[#FFF8F0] via-white to-[#F2F9FA]/40 p-6 shadow-[0_12px_40px_rgba(247,143,46,0.12)] sm:p-8">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#F78F2E]/15 blur-2xl"
              aria-hidden
            />
            <p className="text-xs font-bold uppercase tracking-wider text-[#F78F2E]">Pflicht</p>
            <h3 className="mt-2 text-xl font-extrabold text-[#0F4F68] sm:text-2xl">Beratung ist verbindlich vorgeschrieben</h3>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              Wenn Sie <strong className="font-semibold text-[#0F4F68]">Pflegegeld</strong> beziehen und zu Hause von
              Angehörigen gepflegt werden, gelten folgende Abstände:
            </p>
            <ul className="mt-6 space-y-4">
              {PFLICHT_ITEMS.map((row) => (
                <li
                  key={row.grad}
                  className="flex gap-4 rounded-2xl border border-[#0F4F68]/10 bg-white/80 px-4 py-3.5 backdrop-blur-sm"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F78F2E] text-white"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-[#0F4F68]">{row.grad}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">{row.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#0F4F68]/15 bg-gradient-to-br from-[#F2F9FA]/80 via-white to-white p-6 shadow-[0_12px_40px_rgba(15,79,104,0.08)] sm:p-8">
            <div
              className="pointer-events-none absolute -left-6 bottom-0 h-28 w-28 rounded-full bg-[#0F4F68]/10 blur-2xl"
              aria-hidden
            />
            <p className="text-xs font-bold uppercase tracking-wider text-[#0F4F68]/80">Freiwillig</p>
            <h3 className="mt-2 text-xl font-extrabold text-[#0F4F68] sm:text-2xl">Beratung ohne Pflicht – aber mit Anspruch</h3>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              Auch ohne gesetzliche Pflicht können Sie unsere Beratung nutzen – völlig kostenfrei über die Pflegekasse:
            </p>
            <ul className="mt-6 space-y-4">
              {FREIWILLIG_ITEMS.map((row) => (
                <li
                  key={row.grad}
                  className="flex gap-4 rounded-2xl border border-[#0F4F68]/10 bg-white/90 px-4 py-3.5"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] text-white"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-[#0F4F68]">{row.grad}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-700 sm:text-[0.95rem]">{row.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl border border-dashed border-[#0F4F68]/20 bg-[#F2F9FA]/50 px-4 py-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              <strong className="font-semibold text-[#0F4F68]">Hinweis:</strong> Ab Pflegegrad 1 steht Ihnen zudem der
              Entlastungsbetrag (aktuell 131&nbsp;€ monatlich) für unterstützende Leistungen zu – unabhängig von der
              Beratungspflicht.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
