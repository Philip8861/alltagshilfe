import Image from "next/image";
import Link from "next/link";

import { PflegegradArticleMetaRow } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradArticleMetaRow";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";

/** Hero nur für /ratgeber/pflegegrad-beantragen — weiß, kein rosè/farbige Hero-Box */
export function PflegegradRatgeberHero() {
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
          <li className="font-medium text-neutral-900">Pflegegrad beantragen</li>
        </ol>
      </nav>

      <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="min-w-0 max-w-xl flex-1">
          <p className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4F68]">
            Ratgeber
          </p>
          <h1
            id="ratgeber-artikel-heading"
            className="mt-4 text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[2.35rem] lg:leading-[1.2]"
          >
            Pflegegrad beantragen: So erhalten Sie Schritt für Schritt die richtige Unterstützung
          </h1>
          <p className={`${PROSE} mt-5 max-w-[40rem]`}>
            Ein Pflegegrad eröffnet Ihnen oder Ihren Angehörigen wichtige Leistungen der Pflegeversicherung. Hier erfahren
            Sie, wie der Antrag funktioniert, was begutachtet wird und welche Unterstützung Ihnen zusteht.
          </p>
        </div>

        <div className="relative w-full max-w-md shrink-0 overflow-hidden rounded-2xl border border-neutral-100 lg:max-w-[380px] xl:max-w-[420px]">
          <Image
            src="/images/Ratgeber/ratgeber.webp"
            alt="Pflegeberatung: Gespräch mit älterer Person in vertrautem Umfeld"
            width={840}
            height={560}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
            priority
          />
        </div>
      </div>

      <PflegegradArticleMetaRow />
      <div className="mt-6 border-t border-neutral-200" aria-hidden />
    </header>
  );
}
