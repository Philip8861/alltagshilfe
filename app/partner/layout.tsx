import type { Metadata } from "next";

/** Session/Cookies — niemals statisch cachen */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kooperationspartner",
  description: "Geschützter Bereich für Kooperationspartner von Alltagshilfe-Süd.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="notranslate min-h-[60vh] bg-[#eef1f3]" data-no-local-translate>
      {children}
    </div>
  );
}
