"use client";

import { createContext, useContext } from "react";

export type PartnerNetworkViewportApi = {
  centerOnElement: (el: HTMLElement | null) => void;
};

export const PartnerNetworkTreeViewportContext = createContext<PartnerNetworkViewportApi | null>(null);

export function usePartnerNetworkViewport() {
  return useContext(PartnerNetworkTreeViewportContext);
}
