import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
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
        <Container className="grid min-h-[3.75rem] grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 overflow-visible md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-7 lg:gap-x-8">
          <Link
            href="/"
            className="z-10 flex shrink-0 -translate-y-[5%] justify-self-start focus:outline-none rounded md:h-10 md:w-auto -ml-2 mr-3 sm:-ml-3 sm:mr-4 md:-ml-4 md:mr-6 lg:-ml-3 lg:mr-7"
            aria-label={`${siteConfig.name} – Startseite`}
          >
            <Image
              src="/images/alltagshilfe-logo.svg"
              alt={siteConfig.name}
              width={207}
              height={53}
              className="h-[34px] w-auto object-contain sm:h-[38px] md:h-9 lg:h-10"
              priority
            />
          </Link>
          <div className="min-w-0 flex items-center justify-end pl-1 md:justify-end md:pl-2 lg:pl-3">
            <HeaderNav />
          </div>
          <Link
            href="/kontakt"
            className="hidden shrink-0 items-center justify-self-end whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 md:inline-flex lg:px-3 xl:px-4 xl:py-2"
            style={{ backgroundColor: "#F78F2E", fontSize: "clamp(0.6875rem, 1.1vw, 1rem)" }}
          >
            Jetzt Kontakt aufnehmen
          </Link>
        </Container>
      </div>
    </header>
  );
}
