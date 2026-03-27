import type { Metadata } from "next";
import { Nunito_Sans, Baloo_2 } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const baloo2 = Baloo_2({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { ReadabilityZoomControls } from "@/components/accessibility/ReadabilityZoomControls";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: {
    icon: "/images/Herz.webp",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${nunitoSans.className} antialiased`}>
        <OrganizationJsonLd />
        <a
          href="#main-content"
          className="absolute -left-[9999px] top-4 z-[100] rounded bg-white px-4 py-2 font-medium text-neutral-900 shadow-lg outline-none focus:left-4 focus:block focus:ring-2 focus:ring-neutral-900"
        >
          Zum Inhalt springen
        </a>
        <div id="app-shell" className="flex min-h-screen flex-col">
          <div className="flex flex-1 flex-col">
            <Header nunitoClass={nunitoSans.className} balooClass={baloo2.className} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
          <Footer />
          <CookieBanner />
        </div>
        <ReadabilityZoomControls />
      </body>
    </html>
  );
}
