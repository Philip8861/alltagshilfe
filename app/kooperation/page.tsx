import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Kooperation",
  description: `Kooperation und Partnerschaft – ${siteConfig.name}. Ihr starker Partner für Unternehmen und Teams.`,
};

export default function KooperationPage() {
  return (
    <article className="w-full" style={{ backgroundColor: "#fafbfc" }}>
      <section className="w-full pb-12 pt-0 sm:pb-16 lg:pb-20">
        <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex justify-end">
              <div className="relative ml-auto w-full max-w-[50rem] lg:mr-[calc((100vw-100%)/-2)]">
                <div className="w-full">
                  <Image
                    src="/images/kooperation.webp"
                    alt="Kooperation und verlässliche Partnerschaft im Alltag"
                    width={900}
                    height={700}
                    className="block h-auto w-full object-contain object-right [filter:drop-shadow(0_10px_22px_rgba(15,79,104,0.2))_drop-shadow(0_4px_12px_rgba(15,79,104,0.12))] [will-change:filter]"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <header
              className="relative z-10 mt-8 max-w-lg text-left sm:max-w-xl lg:absolute lg:left-0 lg:right-auto lg:top-[39%] lg:mt-0 lg:max-w-[min(26rem,42vw)] lg:-translate-y-1/2 xl:left-[min(0.25rem,1vw)] xl:max-w-[min(28rem,38vw)] 2xl:left-[min(0.5rem,2vw)] 2xl:max-w-[min(30rem,34vw)]"
            >
              <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-[#0F4F68] sm:text-4xl lg:text-[2.35rem] xl:text-[2.6rem]">
                Kooperation
              </h1>
              <p className="mt-4 text-pretty text-xl font-semibold leading-snug text-[#0F4F68] sm:text-2xl lg:text-[1.45rem]">
                Ihr starker Partner
              </p>
              <p className="mt-5 max-w-prose text-pretty text-base font-normal leading-relaxed text-neutral-600 sm:text-[1.05rem]">
                Informationen zu Kooperationen und Partnerschaften im Unternehmen folgen in Kürze.
              </p>
            </header>
          </div>
        </div>
      </section>
    </article>
  );
}
