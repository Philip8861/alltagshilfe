import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

export const maxDuration = 120;

export default function OrientierungskursLayout({ children }: { children: React.ReactNode }) {
  return children;
}
