import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { HeaderNav } from "./HeaderNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.07)]">
      <div
        className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 px-4 py-2.5 text-sm font-bold text-white sm:gap-x-3"
        style={{ backgroundColor: "#0F4F68", minHeight: "3rem" }}
      >
        <span className="whitespace-nowrap">
          Kostenlose Telefonnummer{" "}
          <a
            href="tel:+4983349893330"
            aria-label="Anrufen: 08334 9893330"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68] rounded"
          >
            08334/9893330
          </a>
        </span>
        <span className="whitespace-nowrap">Mo–Do 08:30–16:00 Uhr</span>
        <span className="whitespace-nowrap">Fr 08:30–12:00 Uhr</span>
      </div>
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
