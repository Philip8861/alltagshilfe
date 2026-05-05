import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technischer Test",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">Test OK</h1>
      <p>Wenn Sie das lesen, funktioniert die Seite. Der Fehler liegt dann an der Startseite.</p>
    </div>
  );
}
