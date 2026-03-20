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
        <Container className="grid min-h-16 grid-cols-[1fr_auto_1fr] md:grid-cols-[auto_1fr] items-center gap-2 overflow-visible pr-3 sm:pr-4 md:gap-4 lg:gap-6 lg:pr-6">
          <Link
            href="/"
            className="-ml-4 flex shrink-0 focus:outline-none rounded sm:-ml-6 md:h-10 md:w-auto"
            aria-label={`${siteConfig.name} – Startseite`}
          >
            <Image
              src="/images/alltagshilfe-logo.svg"
              alt={siteConfig.name}
              width={207}
              height={53}
              className="h-9 w-auto object-contain sm:h-10 md:h-[38px] lg:h-[42px]"
              priority
            />
          </Link>
          <div className="min-w-0 flex items-center justify-center md:justify-end">
            <HeaderNav />
          </div>
          <div className="md:hidden" aria-hidden />
        </Container>
      </div>
    </header>
  );
}
