import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { RatgeberUebersicht } from "@/components/ratgeber/RatgeberUebersicht";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ratgeber",
  description: `Ratgeber zur Pflege – ${siteConfig.name}.`,
};

export default function RatgeberPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <section className="relative overflow-hidden rounded-3xl border border-[#0F4F68]/10 bg-gradient-to-br from-[#F2F9FA] via-white to-[#fffaf4] p-7 sm:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at 10% 20%, rgba(247,143,46,0.25), transparent 40%), radial-gradient(circle at 80% 30%, rgba(15,79,104,0.18), transparent 35%)",
            }}
          />

          <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
                  Ratgeber
                </h1>
                <p className="mt-4 max-w-3xl text-neutral-700">
                  Praxistipps, Erklärungen und konkrete Hilfen rund um Pflege, Betreuung und Entlastung im Alltag.
                </p>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/partner/dashboard?tip=1"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#0F4F68] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_10px_22px_rgba(15,79,104,0.2),0_4px_12px_rgba(15,79,104,0.12)] transition hover:bg-[#0c3d52] hover:shadow-[0_12px_26px_rgba(15,79,104,0.22),0_5px_14px_rgba(15,79,104,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                >
                  Tipp geben
                </Link>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#0F4F68]/15 bg-white/70 px-3 py-1 text-sm font-semibold text-[#0F4F68]">
                    Suche
                  </span>
                  <span className="rounded-full border border-[#0F4F68]/15 bg-white/70 px-3 py-1 text-sm font-semibold text-[#0F4F68]">
                    Übersicht
                  </span>
                  <span className="rounded-full border border-[#F78F2E]/25 bg-[#F78F2E]/10 px-3 py-1 text-sm font-semibold text-[#0F4F68]">
                    Beliebt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RatgeberUebersicht />
      </Container>
    </article>
  );
}
