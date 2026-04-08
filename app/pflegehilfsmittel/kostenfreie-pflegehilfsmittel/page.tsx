import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { PFLEGEBOX_KONFIGURATOR_PAGE } from "@/lib/pflegebox-konfigurator-path";

export const metadata: Metadata = {
  title: "Kostenfreie Pflegehilfsmittel",
  description: `Kostenfreie Pflegehilfsmittel und Pflegebox – ${siteConfig.name}. Informationen zur Beantragung über die Pflegekasse und zur Zusammenstellung Ihrer Pflegebox im Konfigurator.`,
};

export default function KostenfreiePflegehilfsmittelPage() {
  return (
    <article className="py-10 sm:py-16 lg:py-20">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Kostenfreie Pflegehilfsmittel
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-neutral-600">
          Mit einer monatlichen Pauschale können Pflegebedürftige viele Verbrauchsmittel über die Pflegekasse
          beziehen. Unser Konfigurator hilft Ihnen, Ihre Pflegebox passend zusammenzustellen – einfach und
          verständlich.
        </p>
        <Link
          href={PFLEGEBOX_KONFIGURATOR_PAGE}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#F78F2E] px-6 py-3 text-base font-semibold text-white transition-colors hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
        >
          Konfigurator
        </Link>
      </Container>
    </article>
  );
}
