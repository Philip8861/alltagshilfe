import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { HeaderNav } from "./HeaderNav";
import { HeaderStrip } from "./HeaderStrip";

type HeaderProps = {
  nunitoClass?: string;
  balooClass?: string;
};

export function Header({ nunitoClass = "", balooClass = "" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 overflow-visible shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.07)]">
      <HeaderStrip nunitoClass={nunitoClass} balooClass={balooClass} />
      <div className="relative overflow-visible border-b border-[#0F4F68]/15 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        {/* Gleiche horizontale Gutter wie HeaderStrip (kein max-w-7xl) → Logo bündig unter „Gemeinsam Stark im Alltag“ */}
        <div className="grid min-h-[4.375rem] w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 gap-y-2 overflow-visible px-4 sm:gap-x-3 sm:px-6 md:gap-x-4 lg:gap-x-5 lg:px-[var(--ahs-page-gutter)]">
          <div className="min-w-0 justify-self-start">
            <Link
              href="/"
              className="z-10 flex shrink-0 -translate-y-[5%] focus:outline-none rounded md:h-[34.63px] md:w-auto"
              aria-label={`${siteConfig.name} – Startseite`}
            >
              <Image
                src="/images/logo_header.webp?v=20260420"
                alt={siteConfig.name}
                width={370}
                height={96}
                sizes="(max-width: 640px) 130px, (max-width: 1024px) 148px, 185px"
                className="h-[32.72px] w-auto object-contain sm:h-[36.58px] md:h-[34.63px] lg:h-[38.5px]"
                priority
              />
            </Link>
          </div>
          <div className="flex min-w-0 max-w-[100vw] items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
            <HeaderNav />
            <Link
              href="/kontakt"
              className="hidden shrink-0 items-center whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 md:inline-flex lg:px-3 xl:px-4 xl:py-2"
              style={{ backgroundColor: "#F78F2E", fontSize: "clamp(0.6875rem, 1.1vw, 1rem)" }}
            >
              Jetzt Kontakt aufnehmen
            </Link>
          </div>
          <div className="min-w-0" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
