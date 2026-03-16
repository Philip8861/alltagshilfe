import homeContent from "@/content/home.json";
import { Hero } from "@/components/sections/Hero";
import { Leistungen } from "@/components/sections/Leistungen";
import { Trust } from "@/components/sections/Trust";
import { Referenzen } from "@/components/sections/Referenzen";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";

export default function HomePage() {
  const { hero, leistungen, trust, referenzen, faq, cta } = homeContent;
  return (
    <>
      <Hero
        title={hero.title}
        subtitle={hero.subtitle}
        ctaPrimary={hero.ctaPrimary}
        ctaSecondary={hero.ctaSecondary}
      />
      <Leistungen
        title={leistungen.title}
        subtitle={leistungen.subtitle}
        items={leistungen.items}
      />
      <Trust title={trust.title} items={trust.items} />
      <Referenzen
        title={referenzen.title}
        subtitle={referenzen.subtitle}
        items={referenzen.items}
      />
      <Faq title={faq.title} items={faq.items} />
      <Cta title={cta.title} subtitle={cta.subtitle} button={cta.button} />
    </>
  );
}
