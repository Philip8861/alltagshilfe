import Link from "next/link";
import { PflegeboxConfiguratorIframe } from "@/app/pflegebox/PflegeboxConfiguratorIframe";

const KOSTENFREI_INFO = "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel";

export function PflegeboxKonfiguratorLanding() {
  return (
    <div className="bg-[#fafbfc] text-neutral-700 antialiased">
      <article className="scroll-mt-24">
        <section
          className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8"
          aria-labelledby="pflegebox-konfigurator-heading"
        >
          <p className="mb-2 inline-block rounded-full bg-[#F78F2E]/20 px-3 py-1 text-sm font-semibold text-[#0F4F68]">
            Pflegebox
          </p>
          <h1
            id="pflegebox-konfigurator-heading"
            className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-4xl lg:text-5xl"
          >
            Pflegebox-Konfigurator
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600">
            Wählen Sie Ihre Pflegehilfsmittel im Wert von 42&nbsp;€ – wir bereiten den Antrag für Ihre Pflegekasse vor.
            In wenigen Minuten fertig, ohne versteckte Kosten.
          </p>
          <p className="mt-4 text-sm text-neutral-600">
            <Link
              href={KOSTENFREI_INFO}
              className="font-semibold text-[#0F4F68] underline-offset-2 hover:underline"
            >
              Informationen zu kostenfreien Pflegehilfsmitteln
            </Link>
          </p>
        </section>

        <div id="pflegebox-root" className="min-w-0 w-full max-w-full bg-[#f1f9fb]">
          <PflegeboxConfiguratorIframe />
        </div>
      </article>
    </div>
  );
}
