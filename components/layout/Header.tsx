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
        <Container className="grid min-h-[3.75rem] grid-cols-[1fr_auto_1fr] items-center gap-2 overflow-visible md:grid-cols-[auto_1fr] md:gap-4 lg:gap-6">
          <Link
            href="/"
            className="z-10 flex shrink-0 -translate-y-[5%] -ml-2 justify-self-start focus:outline-none rounded sm:-ml-3 md:-ml-4 md:h-10 md:w-auto lg:-ml-3"
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
          <div className="min-w-0 pl-1 sm:pl-2 md:pl-3 lg:pl-4 flex items-center justify-center md:justify-end">
            <HeaderNav />
          </div>
          <div className="md:hidden" aria-hidden />
        </Container>
      </div>
    </header>
  );
}
