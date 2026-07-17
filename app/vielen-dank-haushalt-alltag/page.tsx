import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { GtmPhoneLink } from "@/components/analytics/GtmContactIntentLink";
import { siteConfig } from "@/config/site";

const PATH = "/vielen-dank-haushalt-alltag" as const;
const ZENTRALE_TELEFON = "08334 / 9893330";
const ZENTRALE_TELEFON_HREF = "tel:+4983349893330";

export const metadata: Metadata = {
  title: "Anfrage eingegangen",
  description: `Ihre Anfrage wurde erfolgreich übermittelt – ${siteConfig.name}.`,
  alternates: { canonical: PATH },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function VielenDankHaushaltAlltagPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl bg-[#F2F9FA] p-8 sm:p-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl">
              Vielen Dank für Ihre Anfrage!
            </h1>
            <p className="mt-4 text-lg text-neutral-700">
              Ihre Anfrage wurde erfolgreich übermittelt.
              <br />
              Unser Team prüft Ihre Angaben und meldet sich persönlich bei Ihnen zurück.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#0F4F68]/12 bg-white p-6 sm:p-8">
            <p className="text-base font-semibold text-[#0F4F68] sm:text-lg">
              Sie möchten direkt mit uns sprechen?
            </p>
            <GtmPhoneLink
              href={ZENTRALE_TELEFON_HREF}
              sourceComponent="fb_landing_haushalt_alltags_danke_tel"
              className="mt-3 inline-flex min-h-[48px] items-center justify-center gap-2 text-2xl font-bold tabular-nums text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:text-3xl"
              aria-label={`Anrufen: ${ZENTRALE_TELEFON.replace(/\s/g, " ")}`}
            >
              <svg
                className="h-7 w-7 shrink-0 sm:h-8 sm:w-8"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
                style={{ color: "#F78F2E" }}
              >
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span>{ZENTRALE_TELEFON}</span>
            </GtmPhoneLink>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#0F4F68] px-8 py-3 font-semibold text-white transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:flex-none"
            >
              Zur Startseite
            </Link>
            <Link
              href="/leistungen/haushaltshilfe"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-[#0F4F68]/30 px-8 py-3 font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:flex-none"
            >
              Mehr über Haushaltshilfe & Alltagsbegleitung
            </Link>
          </div>
        </div>
      </Container>
    </article>
  );
}
