import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

/** Session/Cookies — niemals statisch cachen */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kooperationspartner",
  description: "Geschützter Bereich für Kooperationspartner von Alltagshilfe-Süd.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="notranslate min-h-[60vh] bg-[#f7fafb]" data-no-local-translate>
      <Container className="max-w-none px-4 sm:px-6 lg:px-10 xl:px-12 py-10 sm:py-14">{children}</Container>
    </div>
  );
}
