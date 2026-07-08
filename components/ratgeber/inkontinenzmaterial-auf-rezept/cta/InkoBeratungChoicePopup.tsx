"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";

import { GtmPhoneLink, GtmWhatsappLink } from "@/components/analytics/GtmContactIntentLink";
import { InkoFloatingPromoShell } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-floating-promo-shell";
import { submitInkoCallback } from "@/lib/actions/inko-callback";
import {
  INKO_REZEPT_CTA_PHONE_DISPLAY,
  INKO_REZEPT_CTA_PHONE_HREF,
  INKO_REZEPT_CTA_WHATSAPP_HREF,
} from "@/lib/ratgeber/inko-rezept-cta-config";
import { markInkoCtaClickedThisSession } from "@/lib/ratgeber/inko-rezept-cta-storage";
import type { InkoRezeptCtaEventName } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { trackInkoRezeptCtaEvent } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { INKO_CALLBACK_TIME_SLOTS } from "@/lib/validations/inko-callback";
import { cn } from "@/lib/utils";

const CALLBACK_CTA_ID = "inko-ratgeber-callback-form";

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

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const FIELD_CLASS =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[0.9375rem] text-neutral-900 shadow-sm transition placeholder:text-neutral-400 focus:border-[#0F4F68]/45 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/20";

const LABEL_CLASS = "mb-1.5 block text-sm font-semibold text-neutral-800";

function DirectContactButton({
  href,
  title,
  subtitle,
  icon,
  iconWrapClassName,
  dataCta,
  sourceComponent,
  external,
  onChoose,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconWrapClassName: string;
  dataCta: string;
  sourceComponent: string;
  external?: boolean;
  onChoose: () => void;
}) {
  const className = cn(
    "group flex w-full items-center gap-3 rounded-xl border px-3 py-3 transition sm:gap-4 sm:px-4",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
    "border-[#0F4F68]/12 bg-white hover:border-[#0F4F68]/28 hover:bg-[#F2F9FA]",
  );

  const inner = (
    <>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11", iconWrapClassName)}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[0.9375rem] font-semibold text-[#0F4F68]">{title}</span>
        <span className="mt-0.5 block text-[0.8125rem] text-neutral-600">{subtitle}</span>
      </span>
    </>
  );

  if (external) {
    return (
      <GtmWhatsappLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cta={dataCta}
        sourceComponent={sourceComponent}
        service="inkontinenzversorgung"
        className={className}
        onClick={onChoose}
      >
        {inner}
      </GtmWhatsappLink>
    );
  }

  return (
    <GtmPhoneLink
      href={href}
      data-cta={dataCta}
      sourceComponent={sourceComponent}
      service="inkontinenzversorgung"
      className={className}
      onClick={onChoose}
    >
      {inner}
    </GtmPhoneLink>
  );
}

function InkoBeratungCallbackDialog({
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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!visible) {
      viewLogged.current = false;
      setPending(false);
      setError(null);
      setSubmitted(false);
      return;
    }
    if (viewLogged.current) return;
    viewLogged.current = true;
    trackInkoRezeptCtaEvent("inko_cta_choice_view", CALLBACK_CTA_ID, { source_cta: sourceCta });
  }, [visible, sourceCta]);

  const handleDirectContact = useCallback(
    (channel: "phone" | "whatsapp") => {
      markInkoCtaClickedThisSession();
      trackInkoRezeptCtaEvent(clickEvent, `${sourceCta}-direct-${channel}`, { choice_type: channel });
      onAfterChoice?.();
      onClose();
    },
    [clickEvent, onAfterChoice, onClose, sourceCta],
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("sourceCta", sourceCta);
      const result = await submitInkoCallback(formData);
      if (!result.success) {
        setError(result.error ?? "Die Anfrage konnte nicht gesendet werden.");
        return;
      }
      markInkoCtaClickedThisSession();
      trackInkoRezeptCtaEvent(clickEvent, `${sourceCta}-callback-submit`, { choice_type: "callback_form" });
      onAfterChoice?.();
      setSubmitted(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <InkoFloatingPromoShell
      id="inko-beratung-callback"
      dataCta={CALLBACK_CTA_ID}
      ariaLabel="Kostenlose Beratung und Testpaket anfragen"
      visible={visible}
      onClose={onClose}
      size="large"
      className="z-[50]"
    >
      {submitted ? (
        <div className="py-2 text-center sm:py-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e] sm:text-xs">
            Vielen Dank
          </p>
          <h2 className="mt-3 text-xl font-bold text-[#0F4F68] sm:text-2xl">Ihre Anfrage ist bei uns eingegangen</h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-700 sm:text-base">
            Wir melden uns innerhalb von <strong>24 Stunden</strong> bei Ihnen – per E-Mail oder Telefon, wie Sie es
            angegeben haben. Auf Wunsch besprechen wir auch ein kostenloses Testpaket.
          </p>
          <button
            type="button"
            className="mt-6 min-h-[2.75rem] rounded-lg border border-[#0F4F68]/20 px-5 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
            onClick={onClose}
          >
            Schließen
          </button>
        </div>
      ) : (
        <>
          <p className="pr-9 text-center text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#5a959e] sm:pr-10 sm:text-xs">
            Kostenlos & unverbindlich
          </p>
          <h2
            id="inko-callback-heading"
            className="mt-2.5 text-center text-lg font-bold leading-snug text-[#0F4F68] sm:mt-3 sm:text-xl md:text-2xl"
          >
            Kostenlos beraten lassen – Testpaket inklusive
          </h2>
          <p className="mt-2.5 text-center text-[0.875rem] leading-relaxed text-neutral-700 sm:mt-3 sm:text-base">
            Füllen Sie das kurze Formular aus. <strong>Wir melden uns innerhalb von 24 Stunden</strong> bei Ihnen und
            helfen Ihnen bei der passenden Inkontinenzversorgung.
          </p>

          <form className="mt-4 space-y-3.5 sm:mt-5" onSubmit={handleSubmit} noValidate>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="inko-cb-vorname" className={LABEL_CLASS}>
                  Vorname <span className="text-[#c45a20]">*</span>
                </label>
                <input id="inko-cb-vorname" name="vorname" type="text" required autoComplete="given-name" className={FIELD_CLASS} />
              </div>
              <div>
                <label htmlFor="inko-cb-nachname" className={LABEL_CLASS}>
                  Nachname <span className="text-[#c45a20]">*</span>
                </label>
                <input id="inko-cb-nachname" name="nachname" type="text" required autoComplete="family-name" className={FIELD_CLASS} />
              </div>
            </div>
            <div>
              <label htmlFor="inko-cb-email" className={LABEL_CLASS}>
                E-Mail
              </label>
              <input id="inko-cb-email" name="email" type="email" autoComplete="email" className={FIELD_CLASS} placeholder="name@beispiel.de" />
            </div>
            <div>
              <label htmlFor="inko-cb-phone" className={LABEL_CLASS}>
                Telefonnummer
              </label>
              <input id="inko-cb-phone" name="phone" type="tel" autoComplete="tel" className={FIELD_CLASS} placeholder="z. B. 08334 / 123456" />
              <p className="mt-1 text-xs text-neutral-500">Bitte E-Mail oder Telefonnummer angeben.</p>
            </div>
            <div>
              <label htmlFor="inko-cb-time" className={LABEL_CLASS}>
                Wann dürfen wir Sie am besten erreichen? <span className="text-[#c45a20]">*</span>
              </label>
              <select id="inko-cb-time" name="preferredTime" required defaultValue="" className={FIELD_CLASS}>
                <option value="" disabled>
                  Bitte wählen …
                </option>
                {INKO_CALLBACK_TIME_SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-2.5 text-sm leading-snug text-neutral-700">
              <input
                type="checkbox"
                name="datenschutz"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
              />
              <span>
                Ich habe die{" "}
                <Link href="/datenschutz" className="font-medium text-[#0F4F68] underline-offset-2 hover:underline" target="_blank">
                  Datenschutzerklärung
                </Link>{" "}
                gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung der Anfrage zu.{" "}
                <span className="text-[#c45a20]">*</span>
              </span>
            </label>
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="w-full min-h-[3rem] rounded-lg bg-[#F78F2E] px-4 py-3 text-[0.9375rem] font-extrabold text-white shadow-[0_3px_12px_-4px_rgba(180,90,10,0.32)] transition hover:bg-[#e8862a] disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:text-base"
            >
              {pending ? "Wird gesendet …" : "Rückruf anfordern"}
            </button>
          </form>

          <div className="mt-5 border-t border-neutral-200 pt-5">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
              Oder direkt kontaktieren
            </p>
            <div className="mt-3 flex flex-col gap-2.5">
              <DirectContactButton
                href={INKO_REZEPT_CTA_PHONE_HREF}
                title="Jetzt anrufen"
                subtitle={INKO_REZEPT_CTA_PHONE_DISPLAY}
                icon={<PhoneIcon className="h-5 w-5 text-[#F78F2E]" />}
                iconWrapClassName="bg-[#FFF4E8]"
                dataCta={`${sourceCta}-direct-phone`}
                sourceComponent="inko_ratgeber_callback_phone"
                onChoose={() => handleDirectContact("phone")}
              />
              <DirectContactButton
                href={INKO_REZEPT_CTA_WHATSAPP_HREF}
                title="Per WhatsApp schreiben"
                subtitle="Schnell & diskret – wir antworten zeitnah"
                icon={<WhatsappIcon className="h-5 w-5 text-white" />}
                iconWrapClassName="bg-[#25D366]"
                dataCta={`${sourceCta}-direct-whatsapp`}
                sourceComponent="inko_ratgeber_callback_whatsapp"
                external
                onChoose={() => handleDirectContact("whatsapp")}
              />
            </div>
          </div>
        </>
      )}
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
        <InkoBeratungCallbackDialog
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
