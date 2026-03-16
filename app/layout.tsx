import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
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
      <body className="antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>
        <OrganizationJsonLd />
        <a
          href="#main-content"
          className="absolute -left-[9999px] top-4 z-[100] rounded bg-white px-4 py-2 font-medium text-neutral-900 shadow-lg outline-none focus:left-4 focus:block focus:ring-2 focus:ring-neutral-900"
        >
          Zum Inhalt springen
        </a>
        <div className="flex min-h-screen flex-col">
          <div className="flex flex-1 flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
          <Footer />
        </div>
        <CookieBanner />
      </body>
    </html>
  );
}
