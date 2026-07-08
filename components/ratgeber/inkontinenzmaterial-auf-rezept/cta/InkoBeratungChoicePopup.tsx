"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { GtmKontaktNavLink, GtmPhoneLink, GtmWhatsappLink } from "@/components/analytics/GtmContactIntentLink";
import { InkoFloatingPromoShell } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-floating-promo-shell";
import {
  INKO_REZEPT_CTA_PHONE_DISPLAY,
  INKO_REZEPT_CTA_PHONE_HREF,
  INKO_REZEPT_CTA_WHATSAPP_HREF,
  INKO_REZEPT_KONTAKT_BAD_GROENENBACH_HREF,
} from "@/lib/ratgeber/inko-rezept-cta-config";
import { markInkoCtaClickedThisSession } from "@/lib/ratgeber/inko-rezept-cta-storage";
import type { InkoRezeptCtaEventName } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { trackInkoRezeptCtaEvent } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { cn } from "@/lib/utils";

const CHOICE_CTA_ID = "inko-rezept-beratung-choice";

type OpenChoiceOptions = {
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  onAfterOpen?: () => void;
  onAfterChoice?: () => void;
};

type InkoBeratungChoiceContextValue = {
  open: (options: OpenChoiceOptions) => void;
  close: () => void;
};

const InkoBeratungChoiceContext = createContext<InkoBeratungChoiceContextValue | null>(null);

export function useInkoBeratungChoice() {
  return useContext(InkoBeratungChoiceContext);
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function FormIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-11z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 9h8M8 12.5h5.5M8 16h3" strokeLinecap="round" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ChoiceCardProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconWrapClassName: string;
  href?: string;
  external?: boolean;
  dataCta: string;
  sourceComponent: string;
  onChoose: () => void;
  className?: string;
  children?: ReactNode;
};

function ChoiceCard({
  title,
  subtitle,
  icon,
  iconWrapClassName,
  href,
  external,
  dataCta,
  sourceComponent,
  onChoose,
  className,
  children,
}: ChoiceCardProps) {
  const inner = (
    <>
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
          iconWrapClassName,
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[0.9375rem] font-semibold leading-snug text-[#0F4F68] sm:text-[1.0625rem]">
          {title}
        </span>
        <span className="mt-0.5 block text-[0.8125rem] leading-snug text-neutral-600 sm:text-sm">{subtitle}</span>
      </span>
      <ChevronIcon />
    </>
  );

  const cardClass = cn(
    "group flex w-full items-center gap-3 rounded-xl border px-3 py-3.5 transition sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-4",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
    className,
  );

  if (href && !children) {
    const linkProps = {
      "data-cta": dataCta,
      className: cardClass,
      onClick: onChoose,
    };

    if (external) {
      return (
        <GtmWhatsappLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          sourceComponent={sourceComponent}
          service="inkontinenzversorgung"
          {...linkProps}
        >
          {inner}
        </GtmWhatsappLink>
      );
    }

    if (href.startsWith("tel:")) {
      return (
        <GtmPhoneLink href={href} sourceComponent={sourceComponent} service="inkontinenzversorgung" {...linkProps}>
          {inner}
        </GtmPhoneLink>
      );
    }

    return (
      <GtmKontaktNavLink
        href={href}
        sourceComponent={sourceComponent}
        contactPath="inko_rezept_ratgeber_kontakt"
        service="inkontinenzversorgung"
        {...linkProps}
      >
        {inner}
      </GtmKontaktNavLink>
    );
  }

  return (
    <button type="button" data-cta={dataCta} className={cardClass} onClick={onChoose}>
      {inner}
    </button>
  );
}

function InkoBeratungChoiceDialog({
  visible,
  sourceCta,
  clickEvent,
  onClose,
  onAfterChoice,
}: {
  visible: boolean;
  sourceCta: string;
  clickEvent: InkoRezeptCtaEventName;
  onClose: () => void;
  onAfterChoice?: () => void;
}) {
  const viewLogged = useRef(false);

  useEffect(() => {
    if (!visible) {
      viewLogged.current = false;
      return;
    }
    if (viewLogged.current) return;
    viewLogged.current = true;
    trackInkoRezeptCtaEvent("inko_cta_choice_view", CHOICE_CTA_ID, { source_cta: sourceCta });
  }, [visible, sourceCta]);

  const handleChoice = useCallback(
    (choice: "phone" | "kontakt" | "whatsapp") => {
      markInkoCtaClickedThisSession();
      trackInkoRezeptCtaEvent(clickEvent, `${sourceCta}-choice-${choice}`, { choice_type: choice });
      onAfterChoice?.();
      onClose();
    },
    [clickEvent, onAfterChoice, onClose, sourceCta],
  );

  return (
    <InkoFloatingPromoShell
      id="inko-beratung-choice"
      dataCta={CHOICE_CTA_ID}
      ariaLabel="Wie möchten Sie uns erreichen?"
      visible={visible}
      onClose={onClose}
      size="large"
      className="z-[50]"
    >
      <p className="pr-9 text-center text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e] sm:pr-10 sm:text-xs md:text-sm">
        Kostenlos & unverbindlich
      </p>
      <h2
        id="inko-choice-heading"
        className="mt-2.5 text-center text-lg font-semibold leading-snug text-[#0F4F68] sm:mt-4 sm:text-2xl md:text-[1.65rem] md:leading-tight"
      >
        Wie möchten Sie uns am liebsten erreichen?
      </h2>
      <p className="mt-2.5 text-center text-[0.875rem] leading-relaxed text-neutral-700 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
        Unsere Experten beraten Sie persönlich zur Inkontinenzversorgung auf Rezept – wählen Sie den Weg, der für Sie
        passt.
      </p>

      <div className="mt-4 flex flex-col gap-2.5 sm:mt-7 sm:gap-3.5" role="list">
        <div role="listitem">
          <ChoiceCard
            title="Direkt anrufen"
            subtitle={INKO_REZEPT_CTA_PHONE_DISPLAY}
            icon={<PhoneIcon className="h-6 w-6 text-[#F78F2E]" />}
            iconWrapClassName="bg-[#FFF4E8]"
            href={INKO_REZEPT_CTA_PHONE_HREF}
            dataCta={`${sourceCta}-choice-phone`}
            sourceComponent="inko_rezept_choice_phone"
            onChoose={() => handleChoice("phone")}
            className="border-[#0F4F68]/12 bg-[#fafcfc] hover:border-[#0F4F68]/28 hover:bg-[#F2F9FA] hover:shadow-[0_8px_24px_-12px_rgba(15,79,104,0.22)]"
          />
        </div>
        <div role="listitem">
          <ChoiceCard
            title="Per Kontaktformular"
            subtitle="Zum Kontaktformular Bad Grönenbach"
            icon={<FormIcon className="h-6 w-6 text-[#0F4F68]" />}
            iconWrapClassName="bg-[#E8F4F7]"
            href={INKO_REZEPT_KONTAKT_BAD_GROENENBACH_HREF}
            dataCta={`${sourceCta}-choice-kontakt`}
            sourceComponent="inko_rezept_choice_kontakt"
            onChoose={() => handleChoice("kontakt")}
            className="border-[#0F4F68]/12 bg-white hover:border-[#0F4F68]/28 hover:bg-[#F2F9FA] hover:shadow-[0_8px_24px_-12px_rgba(15,79,104,0.22)]"
          />
        </div>
        <div role="listitem">
          <ChoiceCard
            title="Per WhatsApp"
            subtitle="Schnell schreiben – wir antworten zeitnah"
            icon={<WhatsappIcon className="h-6 w-6 text-white" />}
            iconWrapClassName="bg-[#25D366]"
            href={INKO_REZEPT_CTA_WHATSAPP_HREF}
            external
            dataCta={`${sourceCta}-choice-whatsapp`}
            sourceComponent="inko_rezept_choice_whatsapp"
            onChoose={() => handleChoice("whatsapp")}
            className="border-[#25D366]/25 bg-[#f6fdf8] hover:border-[#25D366]/45 hover:bg-[#eefbf2] hover:shadow-[0_8px_24px_-12px_rgba(37,211,102,0.28)]"
          />
        </div>
      </div>

      <p className="mt-4 text-center text-[0.75rem] leading-relaxed text-neutral-500 sm:mt-6 sm:text-sm">
        Rezeptabrechnung möglich · Diskrete Lieferung · Testpaket auf Wunsch
      </p>
    </InkoFloatingPromoShell>
  );
}

export function InkoBeratungChoiceProvider({ children }: { children: ReactNode }) {
  const [openState, setOpenState] = useState<OpenChoiceOptions | null>(null);

  const close = useCallback(() => setOpenState(null), []);

  const open = useCallback((options: OpenChoiceOptions) => {
    options.onAfterOpen?.();
    setOpenState(options);
  }, []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <InkoBeratungChoiceContext.Provider value={value}>
      {children}
      {openState && (
        <InkoBeratungChoiceDialog
          visible
          sourceCta={openState.dataCta}
          clickEvent={openState.clickEvent}
          onClose={close}
          onAfterChoice={openState.onAfterChoice}
        />
      )}
    </InkoBeratungChoiceContext.Provider>
  );
}
