import Link from "next/link";

import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";
import {
  INKO_PRODUKT_RATGEBER_SLUG,
  INKO_REZEPT_RATGEBER_SLUG,
} from "@/lib/ratgeber/inko-rezept-cta-config";

const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

const PASSENDE_THEMEN_LINKS = [
  {
    slug: INKO_REZEPT_RATGEBER_SLUG,
    href: `/ratgeber/${INKO_REZEPT_RATGEBER_SLUG}`,
    label: "Inkontinenzmaterial auf Rezept: Anspruch, Kosten und Ablauf",
  },
  {
    slug: INKO_PRODUKT_RATGEBER_SLUG,
    href: `/ratgeber/${INKO_PRODUKT_RATGEBER_SLUG}`,
    label: "Einlagen, Vorlagen, Pants oder Windeln: Welches Inkontinenzmaterial passt zu mir?",
  },
  {
    slug: null,
    href: "/pflegeshop#qualitaetsversprechen-pflegeshop",
    label: "Inkontinenzversorgung auf Rezept",
  },
  {
    slug: null,
    href: "/pflegeshop",
    label: "Gratis Testpaket erhalten",
  },
  {
    slug: null,
    href: "/kontakt?thema=inkontinenzversorgung",
    label: "Kostenlose Beratung anfragen",
  },
] as const;

/** Einheitlicher Abschluss unter Quellen – Passende Themen + Verwandte Beiträge */
export function InkoRatgeberArticleFooter({ currentSlug }: { currentSlug: string }) {
  const themenLinks = PASSENDE_THEMEN_LINKS.filter((entry) => entry.slug !== currentSlug).slice(0, 4);

  return (
    <>
      <section className="mt-12 rounded-2xl border border-dashed border-neutral-200/95 bg-neutral-50/40 px-5 py-7 sm:px-7">
        <h2 className="text-lg font-semibold tracking-tight text-[#0F4F68]">Passende Themen</h2>
        <ul className="mt-5 list-none space-y-2.5 text-[1rem] text-neutral-800">
          {themenLinks.map((entry) => (
            <li key={entry.href}>
              <Link href={entry.href} className={LINK}>
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <VerwandteRatgeberBeitraege currentSlug={currentSlug} />
    </>
  );
}
