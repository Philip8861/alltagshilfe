"use client";

import { createContext, useContext } from "react";

export const PartnerNetworkTreeLayoutContext = createContext<(() => void) | null>(null);

export function usePartnerNetworkTreeLayout() {
  return useContext(PartnerNetworkTreeLayoutContext);
}
