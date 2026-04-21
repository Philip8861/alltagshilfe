import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { navLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="site-footer" className="shrink-0 bg-neutral-50 leading-normal">
      {/* Unten in px: bei Lesbarkeits-Zoom (html font-size %) würden rem-Paddings extrem groß wirken */}
      <Container className="pt-12 sm:pt-16 pb-[max(8px,env(safe-area-inset-bottom,0px))]">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 justify-items-center gap-y-[3.125rem] text-center lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:justify-items-stretch lg:gap-x-[4.375rem] lg:gap-y-[3.125rem] lg:text-left xl:gap-x-20">
          <div className="flex min-w-0 max-w-md flex-col items-center justify-self-center text-center lg:max-w-lg lg:justify-self-start">
            <p className="text-sm font-semibold text-neutral-900">{siteConfig.name}</p>
            <p className="mt-2 max-w-sm text-balance text-pretty text-sm leading-relaxed text-neutral-600 sm:max-w-md">
              {siteConfig.description}
            </p>
          </div>
          <div className="min-w-0 text-center lg:justify-self-center lg:px-2 lg:text-center">
            <p className="text-sm font-semibold text-neutral-900">Navigation</p>
            <ul className="mt-3 flex flex-col items-center gap-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 max-w-md lg:max-w-none lg:justify-self-end">
            <p className="text-sm font-semibold text-neutral-900">Rechtliches</p>
            <ul className="mt-3 flex flex-col items-center gap-2 lg:items-start">
              <li>
                <Link
                  href="/impressum"
                  className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/barrierefreiheit"
                  className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded"
                >
                  Barrierefreie Homepage
                </Link>
              </li>
              <li>
                <Link
                  href="/partner/login"
                  className="text-sm text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 rounded"
                >
                  Partner-Login
                </Link>
              </li>
              <CookieSettingsLink />
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t border-[#0F4F68]/15 pt-3 pb-0">
          <p className="mb-0 text-center text-sm leading-snug text-neutral-500">
            © {currentYear} {siteConfig.name}. Alle Rechte vorbehalten.
          </p>
        </div>
      </Container>
    </footer>
  );
}
