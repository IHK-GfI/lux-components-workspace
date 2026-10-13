# LUX-Components

- [LUX-Components](#lux-components)
  - [Demo](#demo)
  - [Visual Regression Tests](#visual-regression-tests)
  - [Release](#release)
    - [Ablauf](#ablauf)
    - [Was die Skripte tun](#was-die-skripte-tun)
  - [Dokumentation](#dokumentation)
  - [Aktualisierung](#aktualisierung)
  - [Autoren](#autoren)
  - [Lizenztext - Icons](#lizenztext---icons)
  - [Lizenztext - Fonts](#lizenztext---fonts)

Die _LUX-Components_ bestehen aus einer Sammlung von _Angular Material_-Komponenten, die speziell für den _JAST_-Stack (**J**ava **A**ngular **S**QL **T**omcat)
entwickelt wurden. Es gibt grundlegende Komponenten wie z.B. _lux-input_, _lux-checkbox_, etc. und komplexere Komponenten wie z.B. _lux-master-detail_ oder _lux-stepper_.
Alle _LUX-Components_ sind einfach zu verwenden und können mit den LUX-Themes _authentic_ und _green_ eingesetzt werden, um eine App-übergreifende User Experience zu gewährleisten.

Aus technischer Sicht handelt es sich bei den _LUX-Components_ um eine
_Angular_-Klassenbibliothek, die via NPM in das eigene Projekt eingebunden wird.

## Demo

Live-Demo (_develop_-Branch):

- [https://lux-demo-dev.gfi.ihk.de](https://lux-demo-dev.gfi.ihk.de)

Live-Demo (_main_-Branch):

- [https://lux-demo.gfi.ihk.de](https://lux-demo.gfi.ihk.de)

Die Demo lokal starten:

- Die _LUX-Components_ via Git klonen.
  
  _Bitte unter Windows sicherstellen, dass lange Dateipfade unterstützt werden:_<br>
  `git config --global core.longpaths true`
- In das entsprechende Verzeichnis wechseln.
- `npm install` ausführen.
- `npm run start:demo` ausführen.
- [http://localhost:4200/](http://localhost:4200/) im Browser öffnen.
- Ausprobieren!

## Visual Regression Tests

Unter `e2e/` liegen [Playwright](https://playwright.dev)-Tests für die Demo:

- `e2e/visual` (Projekt `chromium-authentic`): Screenshots jeder Beispielseite (`/components-overview/example/*`) und der Baseline-Seite (`/baseline`), inklusive der Zustände Fehler, Disabled, Readonly und Dense der Form-Controls (Baseline-Seite und je Form-Control auf dessen Beispielseite). Sie werden mit den eingecheckten Referenzbildern (`e2e/visual/__screenshots__`) verglichen. Neue Beispielseiten werden automatisch aus `components-overview.routes.ts` übernommen.
- `e2e/form` (Projekt `form`): Verhaltenstests der Form-Controls (Werte, Required, Disabled, Readonly, Fehlermeldungen, Tastatur, axe-Scans nach WCAG 2.2 AA) auf deren Beispielseiten. Die Tests für Datepicker, Datetimepicker und Timepicker laufen zusätzlich in den Zeitzonen UTC-12 und UTC+14 (Projekte `form-tz-*`). Die Selektoren auf die Demo liegen gebündelt in `e2e/form/support/form-example.ts`, die erwarteten Fehlermeldungen kommen aus der Übersetzungsdatei der LUX-Components. Bekannte Fehler sind per `test.fail()` markiert und schlagen Alarm, sobald sie behoben sind.

Da sich das Schriftrendering zwischen Betriebssystemen unterscheidet, laufen die Tests immer im offiziellen Playwright-Container – lokal über _podman_ (alternativ `VRT_CONTAINER_ENGINE=docker`), in der CI im Workflow _e2e (Playwright)_ (Pull Requests auf `develop` und manuell vor einem Release). Der Workflow baut die Demo einmal und verteilt die Tests auf vier parallele Jobs; schlägt ein Test fehl, steht der zusammengeführte HTML-Report (inkl. Diff-Bildern) als Artefakt _playwright-report_ am Workflow-Lauf.

- `npm run vrt:build` – Theme, LUX-Components und Demo bauen.
- `npm run vrt` – alle Tests ausführen (weitere Playwright-Argumente nach `--`, z. B. `npm run vrt -- -g datepicker` oder `npm run vrt -- --project=form`).
- `npm run vrt:update` – Referenzbilder neu erzeugen. Die geänderten PNGs vor dem Commit bitte bewusst prüfen.
- `npm run vrt:report` – HTML-Report mit den Abweichungen im Browser öffnen.

Die Version von `@playwright/test` in `e2e/package.json` muss zum Image-Tag in `.github/workflows/visual-regression.yml` passen. Bei einem Playwright-Update müssen alle Referenzbilder neu erzeugt werden.

## Release

### Ablauf

1. Auf dem `develop`-Branch oder einem Pflege-Branch (z.B. `v19.x`):

   Wenn man keinen Container (z.B. Podman) eingerichtet hat, kann man die Option `--container` weglassen.

   ```bash
   npm run release:prepare -- 21.10.0 --container
   ```

2. Changelog-Einträge (siehe `CHANGELOG.md`) prüfen und ggf. Hinweise im Update Guide (siehe `Update-Guide-v21.md`) ergänzen.
3. Committen und pushen:

   ```bash
   git add --all && git commit -m "Release v21.10.0" && git push
   ```

4. Sobald die [Actions](https://github.com/IHK-GfI/lux-components-workspace/actions) zum Release-Commit (die Smoketests) grün sind:

   ```bash
   npm run release:finish
   ```

   Das Skript zeigt die Release-Notes an und fragt vor dem Merge nach `main`, dem Push und dem Anlegen des GitHub-Releases einmal nach (mit `--yes` automatisch bestätigt). Bei „Nein“ wird nichts gepusht.

5. Die Publish-Workflows unter [Actions](https://github.com/IHK-GfI/lux-components-workspace/actions) abwarten.

Optionen immer nach `--` angeben, sonst fängt `npm` sie ab:

| Befehl            | Option                                      | Wirkung                                                         |
| ----------------- | ------------------------------------------- | --------------------------------------------------------------- |
| `release:prepare` | `--dry-run`                                 | zeigt nur an, was geändert würde                                |
|                   | `--with-theme` / `--skip-theme`             | Theme-Release erzwingen bzw. auslassen                          |
|                   | `--no-fresh`                                | `node_modules` und `package-lock.json` behalten                 |
|                   | `--skip-tests`                              | Smoketest überspringen                                          |
|                   | `--container`                               | zusätzlich Demo-Image mit _podman_ bauen und mit _trivy_ prüfen |
| `release:finish`  | `--yes`                                     | Rückfragen automatisch bestätigen                               |
| `release:updater` | `--dry-run`, `--with-theme`, `--skip-theme` | wie bei `release:prepare`                                       |

Einen Updater mit eigenen Migrationen legt `npm run release:updater -- 21.10.0` schon während der Entwicklung an.

### Was die Skripte tun

- **`release:prepare`**:
  - Hebt die Versionen an (alle `package.json` sowie den Footer der Demo) und legt den Updater `update-<version>` an.
  - Ergänzt Changelogs und Update Guide (auf einem Pflege-Branch nur die Changelogs).
  - Installiert frisch gegen die öffentliche npm-Registry und startet den Smoketest.
  - Kann mehrfach laufen: Vorhandene Changelog-Einträge, Updater und Wiki-Abschnitte bleiben erhalten, fehlende Issues werden ergänzt.
- **`release:finish`**:
  - Prüft Release-Commit, Versionen und „- TODO“ in den Changelogs und wartet auf alle CI-Workflows, die der Release-Commit auslöst (die Smoketests laufen nur bei Änderungen in ihren Pfaden).
  - Bringt `main` nach einer Rückfrage per Fast-Forward auf `develop` und legt das GitHub-Release an. Die Release-Notes kommen aus dem Abschnitt _Issues_ des Lib-Changelogs.
- **Theme**:
  - Wird nur veröffentlicht, wenn sich Dateien unter `projects/lux-components-theme` seit dem letzten Theme-Release geändert haben; sonst bleibt seine Version unverändert.
  - Als npm-Workspace wird es lokal verlinkt und muss nicht vorab veröffentlicht werden.
- **Workflows** (`publish-*.yml`, gemeinsame Schritte in `.github/actions/`):
  - Starten durch das GitHub-Release und veröffentlichen nur, wenn das Tag auf `main` liegt.
  - Pre-Releases und Versionen mit Suffix (z.B. `22.0.0-rc.1`) werden nicht veröffentlicht.
  - Der Updater wartet auf LUX-Components und Theme, das Wiki auf den Updater.
  - Bereits veröffentlichte Versionen werden übersprungen, ein fehlgeschlagener Workflow kann einfach neu gestartet werden.
  - Manuell auf `main` lassen sie sich mit _dry_run_ testen, ohne etwas zu veröffentlichen.
- **Pflege-Branches** `v<major>.x` (z.B. `v21.x`, wenn 22 auf main liegt; vom letzten Tag der Hauptversion abzweigen):
  - Auf dem Pflege-Branch wird gearbeitet und direkt veröffentlicht, der Ablauf oben gilt unverändert (ohne Merge nach `main`).
  - Erlaubt sind nur Versionen dieser Hauptversion; die Pakete erhalten das npm-Tag `v<major>-lts`, das GitHub-Release ist nicht „Latest“.
  - Das Wiki wird nicht auf dem Pflege-Branch gepflegt, siehe **Wiki**. Ein Pflege-Release lässt das Wiki aus, auch `release:prepare` legt dort keinen Abschnitt im Update Guide an. Den Abschnitt `### Version <version>` in `Update-Guide-v<major>.md` auf `develop` nachtragen (`release:prepare` gibt eine Vorlage aus), ebenso Doku zu neuen Funktionen. Ins Wiki kommt das mit dem nächsten Release von `main`.
- **Wiki**: Es gibt nur ein Wiki. Die Doku aller Hauptversionen (`Versions/v<major>/`, `Update-Guide-v<major>.md`) wird zentral auf `develop` gepflegt und nur aus Releases von `main` veröffentlicht (Bilder verlinken auf `main`).
- **Tests**: `npm run test:release-scripts` (auch in `test:all` und im Workflow _smoketest - release-scripts_).

## Dokumentation

Eine ausführliche Dokumentation der _LUX-Components_ befindet sich [hier](https://github.com/IHK-GfI/lux-components-workspace/wiki).

## Aktualisierung

Für jede Version ist im dazugehörigen Update Guide (siehe [Dokumentation](https://github.com/IHK-GfI/lux-components-workspace/wiki)) dokumentiert, wie eine Aktualisierung durchgeführt werden kann.

## Autoren

- Thomas Dickhut (IHK-GfI)
- Helena Majorek (IHK-GfI)
- Dimitrij Ron (S&N)

## Lizenztext - Icons

In dieser Anwendung werden Streamline-Icons über das Github-Projekt "lux-components-icons-and-fonts" (https://github.com/IHK-GfI/lux-components-icons-and-fonts) der IHK-GfI mbH eingebunden. Die verwendeten Icons laufen unter der Lizenz CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/) und der Urheber ist „streamlinehq.com“ ("Streamline Icons Core Line free Copyright © by streamlinehq.com“).
Bezugsquelle: „[Core Line - Free – Free Icons Set - 1000 customizable PNGs, SVGs, PDFs (streamlinehq.com)](https://www.streamlinehq.com/icons/core-line-free)".
Die Lizensierungsinformationen „[CC BY 4.0“ sind zu finden unter „[Streamline Free License | Streamline Help center (intercom.help)](https://intercom.help/streamlinehq/en/articles/5354376-streamline-free-license)“.
Die Icons aus dem o.a. Iconset wurden durch die IHK-GfI mbH nicht verändert. Es wurden jedoch eigene Icons im selben Stil erstellt und unserer Sammlung unter gleicher Lizenz hinzugefügt.

## Lizenztext - Fonts

Diese Anwendung verwendet die Schriftarten "Source Sans Pro" designed by Paul D. Hunt (Lizensiert unter SIL 1.1 Open Font License / https://github.com/IHK-GfI/lux-components-icons-and-fonts/blob/master/assets/fonts/Source%20Sans%20Pro/SIL%20Open%20Font%20License%20V1.1.md) sowie "BloggerSans" (Lizenz: https://www.fontsquirrel.com/license/blogger-sans) created by Sergiy Tkachenko (Lizensiert unter Creative Commons 4.0 / https://creativecommons.org/licenses/by/4.0/).

> **Note:** Bei der Entwicklung einer Applikation auf Basis der LUX-Components sowie unter Nutzung der Schriftart "Source Sans Pro" ist zwingend die Lizenzdatei "SIL Open Font License V1.1.md" in die GUI der Applikation einzubinden. Bei Nutzung der Schriftart "BloggerSans" ist ein Verweis auf die Lizenz unter https://www.fontsquirrel.com/license/blogger-sans erforderlich.
