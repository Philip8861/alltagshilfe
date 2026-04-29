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
    <div className="relative mt-6 rounded-2xl border border-neutral-200/95 bg-[linear-gradient(180deg,#fafcfc_0%,#ffffff_55%,#fbfbfb_100%)] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),0_1px_0_0_rgba(15,79,104,0.05)] md:p-6">
      <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#5a959e]">Ablauf in fünf Schritten</p>

      <ol className="space-y-0 md:hidden">
        {STEPS.map((s, i) => (
          <li key={s.n} className="relative flex gap-4 pb-8 last:pb-2">
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-[1.0625rem] top-10 bottom-[-0.5rem] w-px bg-gradient-to-b from-[#cfdfe3] via-neutral-300/90 to-transparent"
              />
            ) : null}
            <span className="relative z-[1] flex h-[2.375rem] w-[2.375rem] shrink-0 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(135deg,#ffffff_0%,#f3fbfb_100%)] text-[0.95rem] font-bold tabular-nums text-[#d97706] shadow-[0_2px_8px_rgba(247,143,46,0.18)] outline outline-[#F78F2E]/40">
              {s.n}
            </span>
            <div className="min-w-0 pt-1">
              <p className="font-semibold text-[#0F4F68]">{s.title}</p>
              <p className="mt-1.5 text-[1rem] leading-relaxed text-neutral-700">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="hidden md:block md:grid md:grid-cols-5 md:gap-x-4">
        {STEPS.map((s) => (
          <div key={s.n} className="relative z-[1] min-w-0 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[linear-gradient(135deg,#ffffff_20%,#f0fafa_100%)] text-[0.97rem] font-bold shadow-[0_4px_12px_-3px_rgba(15,79,104,0.2)] outline outline-[#0F4F68]/15">
              <span className="tabular-nums text-[#0F4F68]">{s.n}</span>
            </div>
            <p className="text-[0.9rem] font-semibold leading-snug text-[#0F4F68]">{s.title}</p>
            <p className="mx-auto mt-2 max-w-[11.5rem] text-[0.84rem] leading-snug text-neutral-700">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
