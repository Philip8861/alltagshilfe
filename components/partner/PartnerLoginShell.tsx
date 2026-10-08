import "./partner-portal.css";
import Link from "next/link";

/** Kompakter Partnerzugang in der Farb- und Formensprache der Homepage. */
export function PartnerLoginShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="partner-login relative isolate flex min-h-dvh items-center justify-center overflow-x-clip bg-[#f8fbfc] text-[#0F4F68]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_20%,#e7f3f5_0%,transparent_52%),radial-gradient(ellipse_at_85%_85%,#fff2e2_0%,transparent_45%)]" />
      <div className="w-full max-w-[34rem] px-5 py-6 sm:py-9">
        <Link href="/" className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#527580] transition hover:text-[#0F4F68]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden><path d="m10 5-7 7 7 7M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Zur Homepage
        </Link>
        <div className="rounded-[1.75rem] border border-[#d4e6e9] bg-gradient-to-br from-white via-white to-[#f0f8f9] px-6 py-7 shadow-[0_18px_50px_-15px_rgba(15,79,104,0.22),0_3px_12px_rgba(15,79,104,0.04)] sm:p-8">
          <div aria-hidden className="mb-4 h-1 w-10 rounded-full bg-[#F78F2E]" />
          {children}
        </div>
        <footer className="mt-4 flex flex-wrap items-center justify-center gap-x-5 text-xs text-[#53717b]">
          <span>Alltagshilfe-Süd</span>
          <Link href="/datenschutz" className="inline-flex min-h-11 items-center rounded underline-offset-4 hover:underline">Datenschutz</Link>
          <Link href="/impressum" className="inline-flex min-h-11 items-center rounded underline-offset-4 hover:underline">Impressum</Link>
        </footer>
      </div>
    </div>
  );
}
