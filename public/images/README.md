# Bilder – Übersicht

Alle Bilder für die Website liegen unter `public/images/`. Die Ordnerstruktur:

## Ordner

| Ordner | Zweck |
|--------|--------|
| **site/** | Bilder für die gesamte Website (Header-Logo, allgemeine Grafiken). |
| *(weitere Ordner nach Bedarf)* | z. B. `leistungen/`, `team/`, `referenzen/` für bereichsspezifische Bilder. |

## Aktuell in Verwendung

- **site/logo.png** – Logo im Header (Alltagshilfe-Süd)
- **Testbild.webp** – gemeinsames Betreuungs-Motiv (Standorte-Intro, Standort-Karten). Statt eines separaten `standort_gemeinsam.webp` immer **Testbild.webp** nutzen; der alte Dateiname ist in `.gitignore` und wird nicht eingecheckt.

Neue Website-Bilder am besten in `site/` oder in thematischen Unterordnern ablegen und im Code über `/images/ordner/dateiname.jpg` einbinden.
