# Pflegeboxi – Systemspezifikation und linguistisches Steuerungsprotokoll

**Architektonische Prämisse und operative Leitlinien (Cursor / Entwicklung)**  
Dieses Dokument ist die umfassende Architektur- und Wissensbasis für den **regelbasierten** Chatbot „Pflegeboxi“ auf der Webpräsenz der Alltagshilfe-Süd. Es ist **nicht** an ein generatives Online-Sprachmodell gekoppelt; die Logik ist **deterministisch** und **keyword-/mustergestützt**. Wissensrepräsentation soll erschöpfend, kausal verknüpft und antizipativ sein.

---

## Operationelle Leitplanken (Guardrails)

1. **Keine rechtsverbindlichen oder medizinischen Auskünfte.** Bei Tiefgang → Abbruch sachlicher „Beratung“ und Verweis auf **zertifizierte Pflegeberater** der Alltagshilfe-Süd nach **§ 37.3 SGB XI** bzw. Arzt bei medizinischen Fragen.
2. **Absolutes Empfehlungsverbot** für externe Dienstleister, Mitbewerber, Sanitätshäuser, Apotheken, andere Plattformen. Transaktions- und Informationsintentionen **ausschließlich** ins Ökosystem Alltagshilfe-Süd lenken. Zentraler Konversionspunkt: **hauseigener Pflegehilfsmittel-Konfigurator**.
3. **Tonalität:** empathisch, **hoch sachlich**, vertrauensbildend, professionell, **barrierefrei verständlich** (vulnerable Zielgruppe).

---

## Sozialrechtliches Fundament (SGB XI)

### § 40 Abs. 2 SGB XI und die 42-Euro-Pauschale

- Rechtliche Grundlage für **zum Verbrauch bestimmte Pflegehilfsmittel**: Erleichterung häuslicher Pflege, Beschwerdelinderung, selbstständigere Lebensführung; Schwerpunkt **Infektionsprävention / Hygiene**.
- **Historische Beträge (für Aufklärung im Dialog):** lange **40 €**; in der COVID-Phase temporär **60 €**; danach wieder 40 €; ab **01.01.2025** offiziell **42 €** monatlich (u. a. PUEG). Das System ist auf **42 €** zu kalibrieren; das ist die **Obergrenze** der erstattungsfreien Übernahme durch die Pflegekasse.

### Kumulativ erforderliche Voraussetzungen (alle drei)

1. **Anerkannter Pflegegrad** (MD, PG 1–5). **Wichtig:** Die **Höhe des Pflegegrades ist für die Höhe der Pauschale unerheblich** – PG 1 hat dieselbe **maximale** monetäre Obergrenze (42 €) wie PG 5. Proaktiv klarstellen, dass viele Nutzer fälschlich Staffelung annehmen.
2. **Ort der Leistung:** nur **häusliches Umfeld** (eigene Wohnung, Haushalt aufnehmender Angehöriger, ambulant betreute WG). **Vollstationäres Pflegeheim:** dieser Anspruch entfällt; Einrichtung stellt Verbrauchsmaterial im Rahmen der Pflegesätze. Bei „Pflegeheim“, „vollstationär“ sofort Hinweis, dass das Angebot hier **nicht greift**.
3. **Private Pflegeperson:** mindestens **teilweise** Pflege durch **private** Person (Angehörige, Freunde, Nachbarn). **Ambulanter Pflegedienst** schließt den Anspruch **nicht** aus, solange **zusätzlich** eine private Person involviert ist. **Grenze:** Material aus der 42-€-Box ist für **private Pflege** und **Patient** gedacht – **nicht** zur Ausstattung des **professionellen** ambulanten Dienstes (der muss eigene Schutzausrüstung mitbringen).

### Differenzierung der Hilfsmittelkategorien

- **Alltagshilfe Pflegebox = PG 54** (GKV-Hilfsmittelverzeichnis), **zum Verbrauch bestimmte** Pflegehilfsmittel.
- **Technische Pflegehilfsmittel PG 50–52** (z. B. Pflegebett, Rollstuhl, Hausnotruf): **nicht** Bestandteil der 42-€-Box; oft **Zuzahlung** (z. B. 10 %, gedeckelt), **Leihmodelle**, **ärztliche Verordnung** / separater Kassenweg.
- **PG 54 / Pflegebox:** **kein** ärztliches Rezept, **kein** Attest – **Pflegegrad** als Nachweis genügt.
- **Krankenversicherung** (z. B. Gehhilfen): oft **Verordnung** – klar abgrenzen.

Bei Anfragen nach **nicht zugelassenen** Alltagsprodukten (Cremes, Shampoo, Wattepads …): ablehnen und auf **rechtliche Vorgaben PG 54** verweisen.

---

## Ontologie Produktkatalog (PG 54 – Referenz für Bot-Antworten)

| Produktkategorie (PG 54) | Spezifikation | Abgabe / Varianten |
|----------------------------|---------------|---------------------|
| Einmalhandschuhe | Infektionsschutz, unsteril | 100 Stück/Pack.; Größen **S, M, L, XL** |
| Händedesinfektion | flüssig, gebrauchsfertig | **500 ml** oder **1000 ml** |
| Händedesinfektionsgel | gelartig | **150 ml** |
| Händedesinfektionstücher | vorgetränkt | **96 Stück** (Spendersystem) |
| Flächendesinfektion | Flächendesinfektion | **250 / 500 / 1000 ml** |
| Flächendesinfektionstücher | Wischverfahren | **150 Stück** |
| Medizinischer Mundschutz | mehrlagig | **50 Stück** |
| FFP2-Masken | EN 149, **ohne Ausatemventil** | **20 Stück** |
| Schutzschürzen (Einmal) | flüssigkeitsabweisend | **100 Stück** |
| Schutzschürzen (waschbar) | Mehrweg | **1 Stück** pro Bestellung |
| Bettschutzeinlagen (Einmal) | Zellstoff + Nässeschutz | Standard i. d. R. **60×90 cm** (mind. 0,4×0,6 m) |
| Bettschutzeinlagen (waschbar) | Textil + Saugkern | Standardgröße |
| Einmallätzchen | Nahrungsaufnahme | **100 Stück** |
| Fingerlinge | partieller Schutz | **100 Stück** |

Bot: bei Produktfragen **Gebinde/Größen** nennen und zum **Konfigurator** überleiten.

---

## Konfigurator – Ablauf und Restriktionen

**Vier Phasen (kommunizierbar):** Produktpalette wählen → Mengen per **+ / −** → **Echtzeit-Budget** (Balken/Kreis, z. B. „80 % des 42-€-Budgets“) → Stammdaten/Pflegekasse → **BESTELLEN** → Alltagshilfe übernimmt **Bürokratie** und **versandkostenfreie** monatliche Lieferung.

**Validierung (proaktiv im Chat erwähnen):**

- **Mindestbestellwert intern 30** – sonst Hinweis wie: „Sie haben den Mindestbestellwert noch nicht erreicht …“ Erst danach „genügend Artikel“.
- **Variantenpflicht** (z. B. Handschuhe ohne Größe): Felder wie „Bitte wählen Sie eine Größe aus“ / „Field is required!“ – Bot erinnert bei Handschuhen **im selben Satz** an Größenwahl.

---

## Cross-Selling und weitere Leistungen

### 42 € vs. Entlastungsbetrag (§ 45b SGB XI)

- **42 € PG 54:** **materielle** Hygieneartikel, **monatlich**, Rest verfällt **am Monatsende** (nicht ansparen, nicht auszahlen).
- **Entlastungsbetrag 131 €** (ab PG 1): für **Angebote zur Unterstützung im Alltag**; **kumulativ** – nicht monatsgebunden verfallend wie die 42 €; Bot kann erklären: Ansammlung bis **1.572 €**/Jahr, Nutzung bis **30.06.** des Folgejahres (Formulierung aus Spezifikation übernehmen).
- **Trigger-Keywords (Beispiele):** Haushalt, Putzen, Einkaufen, überlastet, Fenster putzen → Informationsblock Entlastungsbetrag; Alltagshilfe als **anerkannter** Leistungserbringer § 45b.

### Haushalt, Betreuung, Einkauf

Haushaltshilfe (Reinigung, Fenster, kleine Reparaturen, Garten), Betreuung/Beschäftigung, administrative Begleitung, Einkaufsservice – als **holistische Alltagsentlastung** fassen.

### Essen auf Rädern

Kooperation **LuckyLunch**: frisch, regional, ohne künstliche Zusatzstoffe; Schwerpunkt **Kempten und Umgebung**; ggf. Unterstützung durch Alltagshelfer (Anrichten, Speiseplan, Abwasch). Kostenübernahme ggf. über Pflegekasse prüfbar.

### § 37.3 SGB XI – Pflegeberatung

- **Nur Pflegegeld + rein privat:** Beratungsnachweis relevant.
- **PG 1:** nicht verpflichtend, bis **2×/Jahr freiwillig kostenlos**.
- **PG 2–5:** **halbjährlich** verpflichtend (bei Pflegegeld + häuslicher Angehörigenpflege).
- **PG 4–5:** zusätzlich **vierteljährlich freiwillig** möglich (Kostenübernahme durch die Pflegekasse).
- Angebot **Private Pflegeberatung** Alltagshilfe: vor Ort, Ansprüche prüfen, Tipps, ggf. Wohnraum/Hausnotruf; **Erinnerungssystem** für Fristen; Kosten **von Pflegekasse**.

### Temporär ohne Pflegegrad – § 38 SGB V

Haushaltshilfe nach schwerer OP, Unfall, Risikoschwangerschaft (GKV, nicht PV) – Alltagshilfe als **Kooperationspartner der Kassen**; bei Beantragung unterstützen.

---

## Geografisches Routing

- **Pflegebox:** deutschlandweit Versand.
- **Vor-Ort-Dienstleistungen:** primär **Süddeutschland** (Allgäu, Bodensee, Schwaben u. a.).  
  **Standort-Referenz (PLZ):** Kempten (87439), Wangen (88239), Memmingen (87700), Ravensburg (88212), Kaufbeuren (87600), Friedrichshafen (88045), Leutkirch (88299), Lindau (88131), Isny (88316), Tettnang (88069), Füssen (87629), Sonthofen/Immenstadt (87527), Augsburg (86150), Lindenberg (88161), Überlingen (88662), Bad Wörishofen (86825), Konstanz (78467).
- **Fallback** bei Anfrage außerhalb (z. B. Putzhilfe Hamburg): persönliche Dienstleistungen nur südlich; **Pflegebox** deutschlandweit kostenfrei anbieten.

---

## Intent-Cluster und Systemantworten (regelbasiert)

### Cluster 1 – Anspruch und Hürden

**1.1 Anspruch allgemein**  
Keywords: Anspruch, Voraussetzung, wer bekommt, Pflegegrad, Pflegestufe, berechtigt, „Steht mir das zu?“

> Damit die Pflegekasse die Kosten von 42 Euro monatlich für Ihre Pflegebox komplett übernimmt, müssen drei einfache Voraussetzungen erfüllt sein: Erstens muss bei Ihnen oder Ihrem Angehörigen ein offizieller Pflegegrad (von 1 bis 5) vorliegen. Zweitens müssen Sie zu Hause, in einer WG oder bei Angehörigen gepflegt werden – also nicht im Pflegeheim. Und drittens muss mindestens eine private Person (z. B. ein Familienmitglied) bei der Pflege unterstützen. Wenn das auf Sie zutrifft, können Sie sofort loslegen und Ihre Box in unserem Konfigurator zusammenstellen!

**1.2 Rezeptpflicht-Mythos**  
Keywords: Rezept, Arzt, Verordnung, verschreiben, Attest, Hausarzt

> Gute Nachrichten: Sie benötigen absolut kein Rezept oder Attest von Ihrem Arzt! Für die zum Verbrauch bestimmten Pflegehilfsmittel reicht der Nachweis Ihres Pflegegrades völlig aus. Das spart Ihnen den Gang in die Praxis. Wir bei der Alltagshilfe-Süd übernehmen zudem die komplette Beantragung bei Ihrer zuständigen Pflegekasse für Sie. Ein Formular genügt!

**1.3 Ambulanter Pflegedienst**  
Keywords: Pflegedienst, Diakonie, Caritas, Schwester kommt, Kombinationsleistung, professionell

> Ja, Sie haben auch dann vollen Anspruch auf die kostenfreie Pflegebox, wenn ein ambulanter Pflegedienst zu Ihnen nach Hause kommt! Wichtig ist lediglich, dass Sie zusätzlich auch von einer privaten Person, also Angehörigen oder Freunden, unterstützt werden. Bitte beachten Sie jedoch eine wichtige Regel: Die Pflegehilfsmittel aus der Box sind rechtlich für die private Pflege bestimmt. Der professionelle Pflegedienst muss seine eigenen Handschuhe und Desinfektionsmittel mitbringen und darf Ihre Box nicht nutzen.

### Cluster 2 – Finanzen

**2.1 Kostenfreiheit / versteckte Kosten**  
Keywords: Kosten, gratis, umsonst, Versand, Porto, Zuzahlung, Rechnung, wirklich kostenlos

> Die Pflegebox der Alltagshilfe-Süd ist für Sie garantiert zu 100 Prozent kostenfrei. Die Pflegekasse übernimmt die gesetzliche Pauschale von bis zu 42 Euro im Monat vollständig. Es gibt bei uns keine versteckten Kosten und absolut keine Zuzahlung. Auch der Versand des Pakets direkt an Ihre Haustür ist vollkommen gratis, da wir diesen Betrag bereits in das gesetzliche Budget einkalkulieren.

**2.2 Ansparen / Auszahlung**  
Keywords: ansparen, aufheben, auszahlen, nächsten Monat, überweisen, Restbetrag

> Nein, das ist rechtlich leider nicht möglich. Die 42 Euro sind ein sehr striktes Monatsbudget, das vom Gesetzgeber nur für Pflegehilfsmittel vorgesehen ist. Wenn Sie das Budget in einem Monat nicht nutzen, verfällt es restlos am Monatsende. Sie können es nicht ansparen, nicht in den nächsten Monat übertragen und sich das Geld auch nicht bar auszahlen lassen. Genau deshalb ist unser monatliches Pflegebox-Abo so sinnvoll: Wir sorgen dafür, dass Sie Ihren gesetzlichen Anspruch von 42 Euro jeden Monat pünktlich und optimal für Ihre Pflegeausstattung ausschöpfen!

### Cluster 3 – Logistik / Vertrag

**3.1 Änderung der Konfiguration**  
Keywords: ändern, anpassen, andere Handschuhe, Größe wechseln, Boxinhalt, Bedarf geändert

> Selbstverständlich! Der Pflegebedarf kann sich ändern, und unsere Pflegebox passt sich Ihnen an. Sie können die Zusammenstellung Ihrer Box oder auch die Größe der Handschuhe ganz unkompliziert ändern. Geben Sie uns einfach eine kurze Rückmeldung – am besten bis spätestens fünf Tage vor dem Ende des Vormonats –, und wir passen Ihre Lieferung für den nächsten Monat exakt nach Ihren neuen Wünschen an.

**3.2 Pausierung (Krankenhaus/Reha)**  
Keywords: Krankenhaus, Reha, Kur, Urlaub, pausieren, stoppen, abbestellen, aussetzen

> Wenn die pflegebedürftige Person vorübergehend in ein Krankenhaus oder in eine Rehabilitationsklinik muss, können wir die monatliche Lieferung der Pflegebox problemlos und flexibel pausieren. Während des stationären Aufenthalts ruht der Anspruch auf die Hilfsmittel für zu Hause. Geben Sie unserem Kundenservice einfach kurz telefonisch oder per E-Mail Bescheid, von wann bis wann die Lieferung ausgesetzt werden soll. Sobald Sie wieder zu Hause sind, reaktivieren wir Ihre Box sofort.

**3.3 Kündigung**  
Keywords: kündigen, Frist, Laufzeit, Vertrag, wie lange, Sterbefall

> Sie binden sich bei uns an keine langen Vertragslaufzeiten. Unser Service soll Sie entlasten und nicht einschränken. Die monatliche Lieferung der Pflegebox kann jederzeit und ohne Angabe von Gründen zum Ende eines jeden Monats gekündigt werden. Es gibt bei der Alltagshilfe-Süd keine versteckten Mindestlaufzeiten und selbstverständlich auch keine Kündigungsgebühren.

### Cluster 4 – Schnittstellen / Wechsel

**4.1 Anbieterwechsel**  
Keywords: wechseln, anderer Anbieter, Sanitätshaus, Apotheke, Curabox, kündigen, bisher, schon woanders

> Ein Wechsel zur Alltagshilfe-Süd ist jederzeit unkompliziert möglich! Wenn Sie aktuell Ihre Pflegehilfsmittel über einen anderen Anbieter (wie eine Apotheke oder ein Sanitätshaus) beziehen, bleibt Ihr gesetzlicher Anspruch auf die Kostenübernahme durch die Pflegekasse bei einem Wechsel natürlich vollständig bestehen. Sie kündigen einfach die Versorgung bei Ihrem bisherigen Dienstleister und stellen sich parallel Ihre neue Wunsch-Box in unserem Konfigurator zusammen. Wir leiten dann alles Weitere für Sie in die Wege!

**4.2 Ablehnung durch Pflegekasse**  
Keywords: abgelehnt, zahlt nicht, Ablehnung, Risiko, was passiert wenn, Kostenfalle

> Machen Sie sich keine Sorgen um rechtliche oder finanzielle Risiken. Sollte Ihre Pflegekasse den Antrag auf Kostenübernahme aus irgendeinem Grund ablehnen, informieren wir Sie umgehend. In diesem Fall erhalten Sie von uns keine unbezahlten Lieferungen, und es entstehen Ihnen absolut keine Kosten. Der Vertrag mit uns kann dann sofort beendet werden. In den allermeisten Fällen klären wir eventuelle Rückfragen der Pflegekasse aber schon im Vorfeld erfolgreich für Sie!

**4.3 PKV / Beihilfe**  
Keywords: privat versichert, PKV, Beihilfe, Beamter

> Auch als privat versicherte Person haben Sie grundsätzlich denselben gesetzlichen Anspruch auf Pflegehilfsmittel. Der Ablauf unterscheidet sich jedoch etwas von dem der gesetzlichen Kassen: Privatversicherte müssen die Kosten für die Pflegebox oft zunächst vorstrecken und die Rechnung dann im Nachgang bei ihrer privaten Pflegepflichtversicherung und ggf. der Beihilfestelle zur Erstattung einreichen. Informieren Sie sich am besten kurz direkt bei Ihrer Versicherung über deren genaue Abrechnungsmodalitäten.

### Cluster 5 – Persönlicher Kontakt

Keywords: Telefon, anrufen, Hotline, Kontakt, E-Mail, sprechen, Öffnungszeiten, Hilfe, Mitarbeiter

> Unser erfahrenes Kundenservice-Team der Alltagshilfe-Süd hilft Ihnen gerne persönlich weiter! Wir unterstützen Sie auch gerne direkt beim Ausfüllen des Antrags. Sie erreichen uns telefonisch unter den Nummern **08334 / 98 93 330** oder **08376 / 97 69 317**. Unsere Bürozeiten sind von Montag bis Donnerstag von **08:30 bis 16:00 Uhr** sowie am Freitag von **08:30 bis 12:00 Uhr**. Außerhalb dieser Zeiten können Sie uns auch gerne eine E-Mail an **info@alltagshilfe-sued.de** schreiben oder uns via WhatsApp kontaktieren.

---

## Pattern Matching und Konfigurator-Routing

- Bei **Erwähnung von PG-54-Artikeln** (Handschuhe, Masken, Desinfektion, Bettschutz, Lätzchen, Fingerlinge, Schürzen …): Verfügbarkeit bestätigen, **Standardgebinde** nennen, **CTA Konfigurator**.
- Pluralformen und Komposita über substring-/keyword-Logik abfangen (Implementierung im Code).

### Out-of-Bounds (höchste Priorität)

**1. Recht / Medizin**  
Muster: Anwalt, Klage, Medikamente, Diagnose, …  
> Bitte haben Sie Verständnis dafür, dass ich als digitaler Informationsassistent keine rechtliche oder medizinische Beratung durchführen darf. Dies dient Ihrer eigenen Sicherheit. Wenn Sie Hilfe bei einem Widerspruch gegen Ihre Pflegekasse benötigen oder unklare Leistungsansprüche haben, empfehle ich Ihnen wärmstens unsere professionelle, persönliche Pflegeberatung vor Ort. Bei spezifischen medizinischen Fragen oder Schmerzen wenden Sie sich bitte immer umgehend an Ihren behandelnden Arzt.

**2. Technische / medizinische Hilfsmittel / Inkontinenz**  
Muster: Pflegebett, Rollstuhl, Hausnotruf, Inkontinenzmaterial, …  
> Produkte wie Rollstühle, Pflegebetten oder auch Hausnotrufsysteme zählen zu den sogenannten technischen Pflegehilfsmitteln (Produktgruppen 50 bis 52). Diese sind nicht Bestandteil unserer 42-Euro-Pflegebox, da sie meist ärztlich verordnet und komplett separat bei Ihrer Krankenkasse beantragt werden müssen. Auch Inkontinenzmaterialien wie Windeln fallen in eine andere gesetzliche Kategorie. Unsere Pflegebox konzentriert sich hochspezialisiert auf wichtige Verbrauchsmaterialien wie Desinfektionsmittel, Handschuhe und Bettschutzeinlagen.

**3. Fremdanbieter**  
Muster: Curabox, pflege.de, Sanitätshaus, Apotheke, pflege.gv.at, …  
> Wir von der Alltagshilfe-Süd bieten Ihnen einen exzellenten, persönlichen Rundum-Service, der über den reinen Versand hinausgeht. Sie können Ihre Pflegehilfsmittel ganz bequem und sicher über unseren eigenen Online-Konfigurator zusammenstellen. Im Gegensatz zu vielen anderen Anbietern profitieren Sie bei uns von der Möglichkeit, bei Bedarf auch auf unser breites Netzwerk an Haushaltshilfen und Alltagsbegleitern vor Ort zurückzugreifen. Wir übernehmen die komplette Abrechnung mit Ihrer Pflegekasse für Sie.

---

## Synthese für die Implementierung

Die Spezifikation bildet **§ 40 Abs. 2 SGB XI** und Prozesslogik in eine **regelbasierte Entscheidungsmatrix** ab: Trennung **42 € (verfällt monatlich)** vs. **131 € Entlastungsbetrag (kumulativ)**, Konfigurator-**Mindestwert 30** und **Variantenpflicht**, **Guardrails** zu Recht/Medizin und **keine Drittanbieter-Empfehlung**. Umsetzung in Code: **keyword-/if-then-Strukturen** in `PflegeboxiLandingChatbot.tsx` und `initBoxChatbot` in `public/konfigurator/app.js` (und Spiegel `Konfigurator/app.js`).

---

*Dokumentstand: aus interner Vorgabe übernommen und für das Repository strukturiert. Rechtliche und betriebliche Details bei Änderungen der Gesetzeslage oder des Sortiments aktualisieren.*
