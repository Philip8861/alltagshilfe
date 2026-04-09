import { PflegeboxConfiguratorIframe } from "@/app/pflegebox/PflegeboxConfiguratorIframe";

export function PflegeboxKonfiguratorLanding() {
  return (
    <div className="bg-[#fafbfc] text-neutral-700 antialiased">
      <article className="scroll-mt-24" aria-label="Pflegebox-Konfigurator">
        <div id="pflegebox-root" className="min-w-0 w-full max-w-full bg-[#f1f9fb] pt-4 sm:pt-6">
          <PflegeboxConfiguratorIframe />
        </div>
      </article>
    </div>
  );
}
