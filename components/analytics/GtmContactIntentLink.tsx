"use client";

import type { ComponentProps, ComponentPropsWithoutRef, MouseEvent } from "react";
import Link from "next/link";
import {
  trackContactNavClick,
  trackEmailClick,
  trackPhoneClick,
  trackWhatsappClick,
} from "@/lib/analytics/gtm-data-layer";

type AnchorOmit = Omit<ComponentPropsWithoutRef<"a">, "onClick">;

export type GtmPhoneLinkProps = AnchorOmit & {
  sourceComponent: string;
  contactPath?: string;
  plz?: string;
  service?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function GtmPhoneLink({
  sourceComponent,
  contactPath,
  plz,
  service,
  onClick,
  ...rest
}: GtmPhoneLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackPhoneClick({
          source_component: sourceComponent,
          contact_path: contactPath,
          plz,
          service,
        });
        onClick?.(e);
      }}
    />
  );
}

export type GtmMailtoLinkProps = GtmPhoneLinkProps;

export function GtmMailtoLink({
  sourceComponent,
  contactPath,
  plz,
  service,
  onClick,
  ...rest
}: GtmMailtoLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEmailClick({
          source_component: sourceComponent,
          contact_path: contactPath,
          plz,
          service,
        });
        onClick?.(e);
      }}
    />
  );
}

export type GtmWhatsappLinkProps = GtmPhoneLinkProps;

export function GtmWhatsappLink({
  sourceComponent,
  contactPath,
  plz,
  service,
  onClick,
  ...rest
}: GtmWhatsappLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackWhatsappClick({
          source_component: sourceComponent,
          contact_path: contactPath,
          plz,
          service,
        });
        onClick?.(e);
      }}
    />
  );
}

export type GtmKontaktNavLinkProps = Omit<ComponentProps<typeof Link>, "href" | "onClick"> & {
  href?: string;
  sourceComponent: string;
  /** Semantischer Tracking-Schlüsssel (nicht die Ziel-URL). */
  contactPath: string;
  service?: string;
  plz?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

export function GtmKontaktNavLink({
  sourceComponent,
  contactPath,
  href = "/kontakt",
  service,
  plz,
  onClick,
  ...rest
}: GtmKontaktNavLinkProps) {
  return (
    <Link
      {...rest}
      href={href}
      onClick={(e) => {
        trackContactNavClick({
          source_component: sourceComponent,
          contact_path: contactPath,
          service,
          plz,
        });
        onClick?.(e);
      }}
    />
  );
}
