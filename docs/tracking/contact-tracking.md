# Contact-Tracking für Google Tag Manager (`contact_intent`)

Zentrales `dataLayer`-Event: **`contact_intent`** (nur bei Einwilligung **Statistik** oder **Marketing**, analog zur GTM-Ladelogik).

## Wann `trackContactIntent` nutzen?

In der Regel **nicht** direkt aufrufen. Stattdessen die **Helper** in `lib/analytics/gtm-data-layer.ts` verwenden (`trackPhoneClick`, `trackFormSuccess`, …). Direktes `trackContactIntent` nur, wenn kein Helper passt und dieselben Parameterregeln eingehalten werden.

## Pflichtparameter (Data Layer)

| Feld | Beschreibung |
|------|----------------|
| `event` | immer `contact_intent` |
| `contact_type` | Art des Kontakts (siehe erlaubte Werte) |
| `contact_path` | logischer Pfad / Kontext (kein PII) |
| `source_component` | stabile ID der UI-Quelle (z. B. `kontakt_page_whatsapp`) |
| `status` | `click` \| `started` \| `step_completed` \| `success` |
| `page_path` | aktueller Pfad (automatisch) |
| `page_location` | aktuelle URL (automatisch) |
| `page_title` | `document.title` (automatisch) |

Optional (ohne PII):

- **`service`**: z. B. Komma-getrennte Finder-Service-Keys oder Formular-Thema (Freitext-Themen nur wenn fachlich unkritisch; bevorzugt Enum/Key).
- **`plz`**: nur **5 Ziffern**; wird serverseitig/clientseitig über `sanitizeTrackingPlz` begrenzt.

## `contact_type` (erlaubt)

- `phone` — `tel:`-Klick
- `email` — `mailto:`-Klick (keine Adresse ins Data Layer)
- `whatsapp` — WhatsApp-/wa.me-Link
- `form` — Kontaktformular (Start / Erfolg)
- `hilfefinder` — mehrstufiger Hilfe-Finder (Startseite, Ratgeber-Dialog, …)
- `standort_finder` — PLZ-Standort-Popup
- `nav` — Klick auf Navigation/Link zur Kontaktseite (`/kontakt`, inkl. Query wie `betreff`)

## `contact_path` (Empfehlungen)

Freier String ohne persönliche Daten, z. B.:

- `tel`, `mailto`, `whatsapp`
- `website_contact` — generisches Website-Kontaktformular
- Semantische Keys für **Navigation zu /kontakt**, z. B. `site_header_desktop_kontakt_nav`, `haushaltshilfe_landing_hero_kontakt_nav` (über `GtmKontaktNavLink` / `trackContactNavClick`; **nicht** die vollständige Ziel-URL)
- `hilfefinder_home`, `hilfefinder_home/step/3`, `hilfefinder_home/complete`
- `ratgeber_beratung`, `ratgeber_beratung/step/2`, …
- `standort_finder`, `standort_finder/step/1`

## `status`

| Wert | Bedeutung |
|------|-----------|
| `click` | sofortiger Klick (Telefon, Mail, WhatsApp, Link zu /kontakt) |
| `started` | Finder/Flow gestartet oder Formular erstmals bedient |
| `step_completed` | Finder-Schritt abgeschlossen |
| `success` | **Konversion**: Formular erfolgreich (z. B. Danke-Seite), Finder komplett abgeschickt |

**Hinweis:** In GTM/GA4 Konversionen typischerweise nur bei **`status === "success"`** auswerten (und Consent beachten).

## Beispiele (Konfiguration in GTM)

**Telefon-Klick**

- Trigger: Custom Event `contact_intent` mit `contact_type` equals `phone` und `status` equals `click`.

**E-Mail-Klick**

- `contact_type` equals `email`, `status` equals `click`.

**Formular-Erfolg**

- `contact_type` equals `form`, `status` equals `success` (z. B. `source_component` `kontakt_form_danke`).
- Hinweis: Das frühere separate Event `contact_form_submit` auf der Danke-Seite wurde zugunsten von **`contact_intent`** entfernt; bestehende GTM-Trigger ggf. umstellen.

**Finder-Erfolg (Hilfe-Finder Startseite)**

- `contact_type` equals `hilfefinder`, `status` equals `success`, `contact_path` enthält oft `complete`.

## Kein PII an GTM

Niemals senden: Namen, E-Mail-Inhalte, Telefonnummern, Nachrichtentexte, Freitext aus Formularfeldern. `mailto:`/`tel:`-Ziele nicht als Parameter spiegeln — nur `contact_type` und generische `contact_path`-Labels.

## Entwickler: neue Formulare / Finder

1. **Klick-Kanäle:** `GtmPhoneLink`, `GtmMailtoLink`, `GtmWhatsappLink` oder `trackPhoneClick` / … in `components/analytics/GtmContactIntentLink.tsx` bzw. `gtm-data-layer.ts`.
2. **Link zur Kontaktseite:** `GtmKontaktNavLink` mit eindeutigem `sourceComponent`, semantischem `contactPath` (kein vollständiges `href` als `contact_path`), optional `service` / `plz`.
3. **Formular „gestartet“:** einmalig z. B. bei erstem `change` `trackFormStarted({ source_component: "…", contact_path: "<pathname oder slug>" })`.
4. **Formular „Erfolg“:** nur nach serverseitigem Erfolg bzw. auf der Danke-Route `trackFormSuccess(…)`.
5. **Finder:** `trackFinderStarted` beim Öffnen, `trackFinderStepCompleted` pro abgeschlossenem Schritt (sinnvolle `step_completed`-Nummer), `trackFinderSuccess` wenn die Anfrage erfolgreich gesendet wurde.
