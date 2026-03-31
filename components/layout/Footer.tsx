import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { navLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-neutral-50">
      <div
        className="absolute left-0 right-0 top-0 z-0 h-12 w-full sm:h-16"
        style={{ marginTop: "-1px" }}
        aria-hidden
      >
        <svg
          className="absolute bottom-0 block h-full w-full"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="footer-mountain-gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fafafa" />
            </linearGradient>
          </defs>
          <path
            fill="url(#footer-mountain-gradient)"
            d="M0,160 L0,95 L120,60 L260,85 L380,45 L500,75 L620,40 L740,68 L860,38 L980,62 L1100,50 L1200,75 L1200,160 Z"
          />
          <path
            fill="url(#footer-mountain-gradient)"
            d="M0,160 L0,115 L180,80 L360,105 L540,70 L720,100 L900,75 L1080,95 L1200,70 L1200,160 Z"
          />
          <path
            fill="url(#footer-mountain-gradient)"
            d="M0,160 L0,135 L300,100 L600,125 L900,105 L1200,130 L1200,160 Z"
          />
        </svg>
      </div>
      {/* Unten in px: bei Lesbarkeits-Zoom (html font-size %) würden rem-Paddings extrem groß wirken */}
      <Container className="relative z-10 pt-12 sm:pt-16 pb-[max(8px,env(safe-area-inset-bottom,0px))]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {siteConfig.name}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {siteConfig.description}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Navigation</p>
            <ul className="mt-3 space-y-2">
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
          <div>
            <p className="text-sm font-semibold text-neutral-900">Rechtliches</p>
            <ul className="mt-3 space-y-2">
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
