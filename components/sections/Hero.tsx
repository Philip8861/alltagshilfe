import Link from "next/link";
import { GtmKontaktNavLink } from "@/components/analytics/GtmContactIntentLink";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

type HeroProps = {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const ctaBase =
  "inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[200px]";

export function Hero({ title, subtitle, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section
      className="relative py-16 sm:py-24 lg:py-32"
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="hero-heading"
            className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
          >
            {title}
          </h1>
          <p className="mt-4 text-lg text-neutral-600 sm:text-xl">
            {subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GtmKontaktNavLink
              href="/kontakt"
              contactPath="homepage_hero_primary_kontakt_nav"
              sourceComponent="hero_primary_kontakt"
              className={cn(
                ctaBase,
                "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900"
              )}
            >
              {ctaPrimary}
            </GtmKontaktNavLink>
            <Link
              href="/#unsere-leistungen"
              className={cn(
                ctaBase,
                "border border-[#0F4F68]/25 bg-white text-neutral-900 hover:bg-neutral-50 focus:ring-1 focus:ring-[#0F4F68]"
              )}
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
