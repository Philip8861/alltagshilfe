import Image from "next/image";
import Link from "next/link";

import { RatgeberArticleImageBeratungCta } from "@/components/ratgeber/RatgeberArticleImageBeratungCta";
import { PflegegeldrechnerArticleMetaRow } from "@/components/ratgeber/pflegegeldrechner/PflegegeldrechnerArticleMetaRow";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";

export function PflegegeldrechnerHero() {
  return (
    <header className="border-b border-neutral-200 pb-8 pt-5 sm:pb-10 sm:pt-6">
      <nav aria-label="Brotkrumen" className={`${PROSE} text-sm text-neutral-600`}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="text-[#0F4F68] underline-offset-2 hover:underline">
              Startseite
            </Link>
          </li>
          <li aria-hidden className="text-neutral-400">
            /
          </li>
          <li>
            <Link href="/ratgeber" className="text-[#0F4F68] underline-offset-2 hover:underline">
              Ratgeber
            </Link>
          </li>
          <li aria-hidden className="text-neutral-400">
            /
          </li>
          <li className="font-medium text-neutral-900">Pflegegeldrechner</li>
        </ol>
      </nav>

      <div
        className="mt-7 h-[3px] w-28 max-w-[40%] rounded-full bg-gradient-to-r from-[#0F4F68]/90 via-[#4a93a8] to-[#F78F2E]/80 sm:w-24"
        aria-hidden
      />

      <div className="mt-8 lg:mt-9">
        <div className="flex w-full flex-col items-center gap-5 text-center sm:gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:text-left">
          <div className="order-2 flex min-w-0 w-full max-w-none flex-1 flex-col items-center lg:order-1 lg:max-w-[min(100%,42rem)] lg:items-start lg:pr-2">
            <p className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4F68]">
              Ratgeber
            </p>
            <h1
              id="ratgeber-artikel-heading"
              className="mt-4 max-w-[40rem] text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:max-w-none lg:text-[2.35rem] lg:leading-[1.2]"
            >
              Pflegegeldrechner 2026: So viel Pflegegeld steht Ihnen zu
            </h1>
            <p className={`${PROSE} mt-5 max-w-[40rem] text-center lg:mt-6 lg:text-left`}>
              Mit unserem Pflegegeldrechner sehen Sie den Regelbetrag je Pflegegrad sowie den anteiligen Betrag im Monat der
              Bewilligung (ab dem gewählten Tag bis Monatsende) und die Summe im Kalenderjahr der Bewilligung. Wählen Sie
              Pflegegrad und Bewilligungsdatum – die Werte aktualisieren sich sofort.
            </p>
          </div>

          <div className="order-1 flex w-full max-w-[21.9375rem] shrink-0 flex-col items-center sm:max-w-[25.59375rem] lg:order-2 lg:ml-auto lg:w-[min(43.875%,512px)] lg:max-w-[512px] lg:shrink-0">
            <div className="w-full">
              <div className="overflow-hidden rounded-2xl border border-neutral-100 shadow-[0_12px_40px_-28px_rgba(15,79,104,0.35)] ring-1 ring-[#0F4F68]/10">
                <Image
                  src="/images/Ratgeber/pflegegrad_rechner.webp"
                  alt="Symbolische Darstellung: Pflegegeld und Rechner – Orientierung zu Beträgen nach Pflegegrad"
                  width={1200}
                  height={780}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 512px"
                  priority
                />
              </div>
            </div>
            <RatgeberArticleImageBeratungCta
              contextNote="Ratgeber: Pflegegeldrechner (Artikelbild)"
              preselectedServices={["pflegegrad_beantrag_widerspruch"]}
            />
          </div>
        </div>
      </div>

      <PflegegeldrechnerArticleMetaRow />
      <div className="mt-6 border-t border-neutral-200" aria-hidden />
    </header>
  );
}
