import { redirect } from "next/navigation";
import { PFLEGEBOX_KONFIGURATOR_PAGE } from "@/lib/pflegebox-konfigurator-path";

/** Kanonische URL ist `/pflegehilfsmittel/kostenfreie-pflegehilfsmittel`. */
export default function PflegeboxRedirectPage() {
  redirect(PFLEGEBOX_KONFIGURATOR_PAGE);
}
