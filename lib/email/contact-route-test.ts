import {
  parseNotificationEmailList,
  resolveAnfragenmanagerRecipients,
  resolveKarriereRecipients,
  resolveRecipientsForKind,
  sendInternalMail,
} from "@/lib/email/internal-smtp";

const KOOPERATION_PORTAL_INBOX = "philip.sonntag@alltagshilfe-sued.de";
const DEFAULT_BETRIEBLICH_ANGEBOT_TO = "philip.sonntag@alltagshilfe-sued.de";

function resolveKarriereContactTopicRecipients(): string[] {
  const onlyContact = parseNotificationEmailList(process.env.NOTIFICATION_TO_CONTACT_TOPIC_KARRIERE);
  if (onlyContact.length > 0) return onlyContact;
  return resolveKarriereRecipients();
}

function resolveBetrieblichAngebotRecipients(): string[] {
  const fromEnv = parseNotificationEmailList(process.env.NOTIFICATION_TO_BETRIEBLICH_ANGEBOT);
  if (fromEnv.length > 0) return fromEnv;
  return [DEFAULT_BETRIEBLICH_ANGEBOT_TO];
}

export type ContactRouteTestCase = {
  id: string;
  label: string;
  to: string[];
  subject: string;
  kind: "contact" | "karriere" | "pflegebox";
};

export type ContactRouteTestResult = {
  id: string;
  label: string;
  ok: boolean;
  to: string;
  subject: string;
  error?: string;
};

/** Alle internen Kontakt-Routen (Empfänger + Betreff wie in Production). */
export function getContactRouteTestCases(): ContactRouteTestCase[] {
  return [
    {
      id: "kontakt",
      label: "Kontaktformular (allgemein)",
      to: resolveAnfragenmanagerRecipients(),
      subject: "Anfragenmanager: Kontakt – Routing-Test",
      kind: "contact",
    },
    {
      id: "ratgeber-kontakt",
      label: "Kontaktformular Ratgeber",
      to: resolveAnfragenmanagerRecipients(),
      subject: "Anfragenmanager: Ratgeber – Routing-Test",
      kind: "contact",
    },
    {
      id: "hilfefinder",
      label: "Hilfe-Finder",
      to: resolveAnfragenmanagerRecipients(),
      subject: "Anfragenmanager: Hilfe-Finder – Rückruf gewünscht (Routing-Test)",
      kind: "contact",
    },
    {
      id: "landingpage-social",
      label: "Social-Media-Landingpage",
      to: resolveAnfragenmanagerRecipients(),
      subject: "Anfragenmanager: Social-Media-Landingpage – Rückruf gewünscht (Routing-Test)",
      kind: "contact",
    },
    {
      id: "ratgeber-inko",
      label: "Ratgeber Inkontinenz-Rückruf",
      to: resolveAnfragenmanagerRecipients(),
      subject: "Anfragenmanager: Ratgeber – Inkontinenz-Rückruf (Routing-Test)",
      kind: "contact",
    },
    {
      id: "karriere-formular",
      label: "Karriere-Bewerbungsformular",
      to: resolveKarriereRecipients(),
      subject: "Karriere: Routing-Test – Test, Routing",
      kind: "karriere",
    },
    {
      id: "kontakt-karriere",
      label: "Kontaktformular Thema Karriere",
      to: resolveKarriereContactTopicRecipients(),
      subject: "Kontakt: Karriere",
      kind: "contact",
    },
    {
      id: "kooperation",
      label: "Kooperationsanfrage",
      to: [KOOPERATION_PORTAL_INBOX],
      subject: "Kontakt: Kooperation",
      kind: "contact",
    },
    {
      id: "betrieblich-angebot",
      label: "Betriebliche Pflegeberatung (Angebot-Popup)",
      to: resolveBetrieblichAngebotRecipients(),
      subject: "Anfrage: Betriebliche Pflegeberatung (Angebot)",
      kind: "contact",
    },
    {
      id: "pflegebox",
      label: "Pflegebox-Bestellung",
      to: resolveRecipientsForKind("pflegebox"),
      subject: "Pflegebox: Routing-Test – Testbestellung",
      kind: "pflegebox",
    },
  ];
}

function buildTestBody(route: ContactRouteTestCase, stamp: string): string {
  return [
    "[ROUTING-TEST – KEINE ECHTE ANFRAGE]",
    "",
    `Kanal: ${route.label}`,
    `Route-ID: ${route.id}`,
    `Zeitstempel: ${stamp}`,
    "",
    "Diese E-Mail dient ausschließlich der Prüfung des E-Mail-Routings.",
    "Sie wurde NICHT über ein Website-Formular ausgelöst und wird NICHT in der Statistik gezählt.",
    "",
    "Bitte nach dem Test wieder löschen.",
  ].join("\n");
}

/**
 * Sendet Test-Mails für alle Kontakt-Routen.
 * Kein recordContactSource – reine SMTP-/Routing-Prüfung.
 */
export async function sendAllContactRouteTestEmails(): Promise<ContactRouteTestResult[]> {
  const stamp = new Date().toISOString();
  const routes = getContactRouteTestCases();
  const results: ContactRouteTestResult[] = [];

  for (const route of routes) {
    const subject = `[ROUTING-TEST] ${route.subject}`;

    if (route.to.length === 0) {
      results.push({
        id: route.id,
        label: route.label,
        ok: false,
        to: "(kein Empfänger konfiguriert)",
        subject,
        error: "Empfängerliste leer (Env prüfen)",
      });
      continue;
    }

    const mailed = await sendInternalMail({
      kind: route.kind,
      toOverride: route.to,
      subject,
      text: buildTestBody(route, stamp),
    });

    results.push({
      id: route.id,
      label: route.label,
      ok: mailed.ok,
      to: route.to.join(", "),
      subject,
      error: mailed.ok ? undefined : mailed.code,
    });
  }

  return results;
}
