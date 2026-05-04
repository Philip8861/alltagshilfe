import { permanentRedirect } from "next/navigation";

/**
 * Ehemalige Einzelseite – Inhalt mit /pflegeshop zusammengeführt (SEO: 308 Permanent Redirect).
 */
export default function InkontinenzversorgungRedirectPage() {
  permanentRedirect("/pflegeshop");
}
