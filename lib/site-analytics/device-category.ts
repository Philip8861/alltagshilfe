export type SiteTrafficDeviceCategory = "mobile" | "tablet" | "desktop" | "unknown";

/**
 * Grobe Geräteklasse aus User-Agent und optionalen Client Hints (kein Fingerprinting).
 * Tablet-Erkennung ist heuristisch (iPad, viele Android-Tablets ohne „Mobile“ im UA).
 */
export function deviceCategoryFromUserAgent(
  userAgent: string | null | undefined,
  secChUaMobile: string | null | undefined,
): SiteTrafficDeviceCategory {
  const ua = (userAgent ?? "").trim();
  const low = ua.toLowerCase();
  const chMobile = (secChUaMobile ?? "").trim();

  if (!ua && !chMobile) return "unknown";

  if (low.includes("ipad")) return "tablet";
  if (low.includes("tablet")) return "tablet";
  if (low.includes("android") && !low.includes("mobile")) return "tablet";

  if (chMobile === "?1") {
    if (low.includes("ipad")) return "tablet";
    return "mobile";
  }

  if (/iphone|ipod|android.*mobile|blackberry|iemobile|opera mini|mobile safari|webos/i.test(ua)) {
    return "mobile";
  }

  if (ua.length > 0) return "desktop";

  return "unknown";
}

export function deviceCategoryFromHeaders(headers: Headers): SiteTrafficDeviceCategory {
  return deviceCategoryFromUserAgent(headers.get("user-agent"), headers.get("sec-ch-ua-mobile"));
}

export function deviceCategoryLabelDe(cat: SiteTrafficDeviceCategory): string {
  switch (cat) {
    case "mobile":
      return "Mobil";
    case "tablet":
      return "Tablet";
    case "desktop":
      return "PC / Desktop";
    default:
      return "Unbekannt (Historie)";
  }
}
