import { GtmKontaktNavLink } from "@/components/analytics/GtmContactIntentLink";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

type CtaProps = {
  title: string;
  subtitle: string;
  button: string;
};

const ctaButton =
  "inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2";

export function Cta({ title, subtitle, button }: CtaProps) {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="cta-heading">
      <Container>
        <div className="rounded-2xl bg-neutral-900 px-6 py-16 text-center sm:px-12 sm:py-20">
          <h2
            id="cta-heading"
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-lg text-neutral-300">{subtitle}</p>
          <div className="mt-8">
            <GtmKontaktNavLink
              href="/kontakt"
              contactPath="homepage_cta_section_kontakt_nav"
              sourceComponent="cta_section_kontakt"
              className={cn(ctaButton)}
            >
              {button}
            </GtmKontaktNavLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
