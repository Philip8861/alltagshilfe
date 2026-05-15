import { HeaderNav } from "./HeaderNav";
import { HeaderStrip } from "./HeaderStrip";
import { GtmKontaktNavLink } from "@/components/analytics/GtmContactIntentLink";

export function Header() {
  return (
    <header className="sticky top-0 z-[100] overflow-visible shadow-[0_4px_6px_-1px_rgb(0_0_0/0.07),0_2px_4px_-2px_rgb(0_0_0/0.07)]">
      <HeaderStrip />
      <div className="relative overflow-visible border-b border-[#0F4F68]/15 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex min-h-[var(--ahs-header-white-min-height)] w-full flex-wrap items-center justify-center gap-x-3 gap-y-2 overflow-visible px-4 sm:gap-x-4 sm:px-6 lg:gap-x-5 lg:px-[var(--ahs-page-gutter)]">
          <div className="flex min-h-[var(--ahs-header-white-min-height)] min-w-0 max-w-[100vw] flex-1 items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6">
            <HeaderNav />
            <GtmKontaktNavLink
              href="/kontakt"
              contactPath="site_header_desktop_kontakt_nav"
              sourceComponent="header_desktop_kontakt_cta"
              className="hidden shrink-0 items-center whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 md:inline-flex lg:px-3 xl:px-4 xl:py-2"
              style={{ backgroundColor: "#F78F2E", fontSize: "clamp(0.6875rem, 1.1vw, 1rem)" }}
            >
              Jetzt Kontakt aufnehmen
            </GtmKontaktNavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
