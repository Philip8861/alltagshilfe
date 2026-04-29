const STEPS = [
  {
    n: "1",
    title: "Antrag stellen",
    text: "Antrag bei der Pflegekasse einreichen.",
  },
  {
    n: "2",
    title: "Formular ausfüllen",
    text: "Angaben sorgfältig ergänzen und Unterlagen vorbereiten.",
  },
  {
    n: "3",
    title: "Begutachtung vorbereiten",
    text: "Hilfebedarf, Arztberichte und Alltag dokumentieren.",
  },
  {
    n: "4",
    title: "Termin wahrnehmen",
    text: "Begutachtung möglichst mit Angehörigen oder Vertrauensperson.",
  },
  {
    n: "5",
    title: "Bescheid prüfen",
    text: "Pflegegrad und Gutachten kontrollieren, bei Bedarf Widerspruch einlegen.",
  },
] as const;

export function PflegegradStepsTimeline() {
  return (
    <div className="relative mt-6">
      {/* vertikal mobile */}
      <ol className="space-y-0 md:hidden">
        {STEPS.map((s, i) => (
          <li key={s.n} className="relative flex gap-4 pb-8 last:pb-0">
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-[1.125rem] top-10 bottom-[-0.35rem] w-px bg-gradient-to-b from-neutral-300 to-transparent"
              />
            ) : null}
            <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#F78F2E]/45 bg-white text-sm font-bold text-[#F78F2E]">
              {s.n}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="font-semibold text-[#0F4F68]">{s.title}</p>
              <p className="mt-1 text-[1rem] leading-relaxed text-neutral-700">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* horizontal md+ */}
      <div className="hidden md:block">
        <div className="relative pb-6">
          <div
            aria-hidden
            className="absolute left-[4%] right-[4%] top-[21px] h-px bg-neutral-200"
          />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {STEPS.map((s) => (
            <div key={s.n} className="min-w-0 px-1 text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#F78F2E]/45 bg-white text-sm font-bold text-[#F78F2E]">
                {s.n}
              </div>
              <p className="text-sm font-semibold leading-snug text-[#0F4F68]">{s.title}</p>
              <p className="mt-2 text-[0.9rem] leading-snug text-neutral-700">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
