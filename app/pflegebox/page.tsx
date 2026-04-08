import { redirect } from "next/navigation";
import { PFLEGEBOX_KONFIGURATOR_PAGE } from "@/lib/pflegebox-konfigurator-path";

/** Alte URL – Weiterleitung zur eigenständigen Seite unter Pflegehilfsmittel. */
export default function LegacyPflegeboxRedirect() {
  redirect(PFLEGEBOX_KONFIGURATOR_PAGE);
}
