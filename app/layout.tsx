import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { DEFAULT_OG_IMAGE_PATH, siteConfig } from "@/config/site";

/** Consent Mode v2 Stub – vor allen Google-Tags (next/script `beforeInteractive`). */
const ANALYTICS_CONSENT_BEFORE_INTERACTIVE_JS = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500,
});
`.trim();

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});


import { Header } from "@/components/layout/Header";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { ReadabilityZoomControls } from "@/components/accessibility/ReadabilityZoomControls";
import { GoogleTranslateBootstrap } from "@/components/layout/GoogleTranslateBootstrap";
import { LocalSiteTranslator } from "@/components/layout/LocalSiteTranslator";
import { SiteAnalyticsSpaNavigation } from "@/components/site-analytics/SiteAnalyticsSpaNavigation";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";

/** Google Search Console – Verifizierung per Meta-Tag (Wert aus Env). */
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  /** Öffentliche Marketing-Seiten: explizit indexierbar (private Routen setzen eigenes `robots` / Layout). */
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: "/images/Herz.webp",
  },
  verification: GOOGLE_SITE_VERIFICATION
    ? { google: GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
    images: [
      {
        url: DEFAULT_OG_IMAGE_PATH,
        alt: `${siteConfig.name} – Pflegeberatung, Haushaltshilfe und Betreuung`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className={`${nunitoSans.className} antialiased`}>
        {/* GTM ohne JS: iframe umgeht lokale Banner-Einwilligung – hier bewusst nicht eingebunden; siehe Projektzusammenfassung. */}
        <Script
          id="analytics-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: ANALYTICS_CONSENT_BEFORE_INTERACTIVE_JS }}
        />
        <OrganizationJsonLd />
        <a
          href="#main-content"
          className="absolute -left-[9999px] top-4 z-[110] rounded bg-white px-4 py-2 font-medium text-neutral-900 shadow-lg outline-none focus:left-4 focus:block focus:ring-2 focus:ring-neutral-900"
        >
          Zum Inhalt springen
        </a>
        <div id="app-shell" className="flex min-h-dvh min-h-screen flex-col">
          <div className="flex min-h-0 flex-1 flex-col">
            <Header />
            <main id="main-content" className="flex min-h-0 min-w-0 flex-1 flex-col">
              {children}
            </main>
          </div>
          <ConditionalFooter />
          <CookieBanner />
        </div>
        <GoogleTranslateBootstrap />
        <LocalSiteTranslator />
        <ReadabilityZoomControls />
        <SiteAnalyticsSpaNavigation />
        <GoogleTagManager />
      </body>
    </html>
  );
}
