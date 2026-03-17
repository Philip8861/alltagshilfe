import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { StandortFinderPopup } from "@/components/contact/StandortFinderPopup";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontaktieren Sie uns – ${siteConfig.name}.`,
};

export default function KontaktPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container className="flex justify-center">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="flex flex-col items-center order-2 lg:order-1">
            <div className="w-full max-w-xl rounded-2xl bg-[#F2F9FA] p-6 sm:p-8 lg:p-10">
              <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
                Kontakt
              </h1>
              <p
                className="mt-4 opacity-0 text-neutral-600 animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                Schreiben Sie uns – wir melden uns zeitnah bei Ihnen.
              </p>
              <div
                className="mt-10 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <ContactForm />
              </div>
              <p
                className="mt-8 text-sm text-neutral-500 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.35s" }}
              >
                Weitere Informationen zur Datenverarbeitung finden Sie in unserer{" "}
                <Link href="/datenschutz" className="underline hover:text-neutral-700">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 text-center order-1 lg:order-2">
            <div className="flex w-full flex-col items-center">
              <div
                className="relative aspect-[4/3] w-[80%] max-w-[80%] overflow-visible opacity-0 animate-fade-in-up lg:max-w-[80%]"
                style={{ animationDelay: "0.15s" }}
              >
                <Image
                  src="/images/Kontakt_Bild.webp"
                  alt="Kontakt – Alltagshilfe-Süd"
                  fill
                  className="object-contain drop-shadow-[0_4px_20px_rgba(15,79,104,0.18)]"
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  priority
                />
              </div>
              <div
                className="relative z-10 -mt-10 w-[63%] min-w-[200px] rounded-xl bg-[#F2F9FA] px-6 py-3 text-center text-lg font-semibold text-[#0F4F68] sm:-mt-12 sm:py-4 sm:text-xl"
                style={{ boxShadow: "0 -2px 12px rgba(15, 79, 104, 0.15)" }}
              >
                Wir freuen uns über Ihren Anruf!
              </div>
            </div>
            <div
              className="mx-auto w-full max-w-md opacity-0 animate-fade-in-up text-lg sm:text-xl"
              style={{ animationDelay: "0.25s" }}
            >
              <p className="font-semibold text-[#0F4F68]">
                Kostenlose Telefonnummer{" "}
                <a
                  href="tel:+4983349893330"
                  className="inline-flex items-center gap-1.5 font-bold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                  aria-label="Anrufen: 08334 9893330"
                >
                  <svg className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden style={{ color: "#F78F2E" }}>
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  08334/9893330
                </a>
              </p>
              <p className="mt-3 text-neutral-700">Mo–Do 08:30–16:00 Uhr</p>
              <p className="mt-1 text-neutral-700">Fr 08:30–12:00 Uhr</p>

              <section
                className="mt-8 pt-6 opacity-0 animate-fade-in-up border-t border-neutral-200"
                style={{ animationDelay: "0.4s" }}
                aria-labelledby="whatsapp-heading"
              >
                <h2 id="whatsapp-heading" className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
                  Oder schreiben Sie uns bequem
                  <br />
                  per Whatsapp
                </h2>
                <p className="mt-3 text-sm text-neutral-700">
                  Einfach den QR Code mit der Kamera scannen oder auf den Button klicken und Sie können uns ganz einfach eine Nachricht per Whatsapp schicken.
                </p>
                <div className="mt-4 flex justify-center">
                  <a
                    href="https://wa.me/4983349893330"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#25D366]"
                    style={{ backgroundColor: "#25D366" }}
                    aria-label="Per WhatsApp schreiben"
                  >
                    <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
                <div className="mt-4 flex w-full justify-center">
                  <Image
                    src="/images/QR_Code.webp"
                    alt="WhatsApp QR-Code – zum Scannen für Chat"
                    width={202}
                    height={202}
                    className="mx-auto h-[118px] w-[118px] object-contain sm:h-[141px] sm:w-[141px]"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </Container>
      <StandortFinderPopup />
    </article>
  );
}
