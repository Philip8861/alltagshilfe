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
    <header className="sticky top-0 z-50 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.07)]">
      <HeaderStrip nunitoClass={nunitoClass} balooClass={balooClass} />
      <div className="relative border-b border-[#0F4F68]/15 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="-ml-4 flex shrink-0 focus:outline-none rounded sm:-ml-6"
            aria-label={`${siteConfig.name} – Startseite`}
          >
            <Image
              src="/images/site/logo.png"
              alt={siteConfig.name}
              width={207}
              height={53}
              className="h-[42px] w-auto object-contain sm:h-[46px]"
              priority
            />
          </Link>
          <div className="hidden md:block min-w-0 flex-1">
            <HeaderNav />
          </div>
        </Container>
      </div>
    </header>
  );
}
