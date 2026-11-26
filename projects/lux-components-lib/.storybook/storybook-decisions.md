# Storybook-Integration: Entscheidungen und offene Fragen

Dieses Dokument hält die Entscheidungen fest, die bei der Einbindung von Storybook in `lux-components-lib` getroffen wurden, sowie offene Punkte, die ein Team-Entscheid benötigen.

## Entscheidungen

### 1. Framework: `@storybook/angular-vite`

- Gewählt wurde der Vite-basierte Angular-Framework-Adapter statt `@storybook/angular` (Webpack, Compodoc).
- Begründung: Storybook empfiehlt den Vite-Adapter für Angular 21+. Compodoc ist deprecated.
- Status des Adapters laut Storybook: **preview**. Das Verhalten kann sich bis zu einem stabilen Release noch ändern.
- Zusätzliche Dev-Abhängigkeiten: `@analogjs/vite-plugin-angular`, `vite` (8.x).

### 2. Angular-Upgrade auf 22.3

- `@storybook/angular` bzw. der Adapter hat Peer-Abhängigkeiten auf `@angular-devkit/build-angular` bzw. `@angular/compiler-cli` in der Version 22.3. Die bisher gepinnte Version 22.1.5 führte zu `ERESOLVE`-Konflikten.
- Alle Angular-Pakete im Root-`package.json` wurden auf `^22.3.0` angehoben, `package-lock.json` wurde neu erzeugt.
- Auswirkung: Der gesamte Workspace nutzt jetzt Angular 22.3. Die Builds und Tests der Library, des Demo-Apps und der Schematics sollten vor dem Merge erneut ausgeführt werden.

### 3. Theme in Storybook: vorkompiliertes CSS

- Die Theme-SCSS-Dateien lassen sich nicht mit `sass-embedded` (Vite) kompilieren. In `projects/lux-components-theme/src/base-templates/components/_luxMenu.scss` (Zeile 152) wird `url(luxicons.$checkmark)` verwendet, das `sass-embedded` ablehnt. Die Theme-CLI (`sass` 1.89) akzeptiert es.
- Storybook lädt daher `dist/theme/prebuilt-themes/luxtheme-authentic.css`. Die npm-Scripts `storybook` und `build-storybook` bauen das Theme vorher.
- Die Demo-App verwendet denselben Ansatz über die vorkompilierten CSS-Dateien.

### 4. Preview-Konfiguration

- `projects/lux-components-lib/.storybook/preview.ts` stellt `provideHttpClient()` und `provideLuxTranslocoTesting()` bereit. Letzteres lädt die echten Locale-Dateien `luxc-de.json` und `luxc-en.json`, damit Labels aus der Library korrekt angezeigt werden.
- `tags: ['autodocs']` ist global gesetzt, damit jede Komponente automatisch eine Docs-Seite erhält.
- Die Schrift-Icons werden über das CDN geladen (`projects/lux-components-lib/.storybook/storybook.scss`).

### 5. Ablage der Stories

- Stories liegen neben der Komponente als `*.stories.ts`. Sie werden über `projects/lux-components-lib/tsconfig.lib.json` (`exclude`) vom Library-Build ausgeschlossen und landen nicht im Paket.
- Titel-Schema: `<Ordner-Kategorie>/<komponenten-selektor>`, z. B. `Aktion/lux-button`.

### 6. Umfang der Stories

- Ziel ist eine Story-Datei für jede öffentlich nutzbare Komponente unter `projects/lux-components-lib/src/lib`.
- Die Stories zeigen die wichtigsten Inputs-Zustände. Vollständige Abdeckung aller Inputs ist nicht Ziel.

## Verwendung

```powershell
npm run storybook          # Dev-Server auf http://localhost:6006
npm run build-storybook    # statischer Build nach dist/storybook/lux-components-lib
```

## Offene Fragen

1. **Preview-Status des Adapters:** Soll Storybook zunächst als interne Dokumentation dienen, oder ist ein Einsatz als öffentliche Dokumentation geplant? Das bestimmt, wie stark wir auf Adapter-Änderungen reagieren müssen.
2. **Theme-Umschaltung:** Storybook lädt nur das Theme `authentic`. Soll ein Theme-Switcher (`authentic` / `green`) als Toolbar-Addon ergänzt werden?
3. **Sass-Kompatibilität:** Soll `_luxMenu.scss` so umgestellt werden, dass `sass-embedded` die Datei kompilieren kann? Bis dahin ist der Umweg über das vorkompilierte CSS nötig.
4. **Deployment:** Wo soll der statische Storybook-Build veröffentlicht werden (z. B. GitHub Pages, interner Server)? Aktuell wird nichts veröffentlicht.
5. **Accessibility-Tests:** Der Addon `@storybook/addon-a11y` ist aktiv. Die verpflichtenden axe-Tests bleiben in den Spec-Dateien (`LuxA11yTestHelper`). Soll zusätzlich ein Storybook-Test-Runner eingeführt werden?
6. **Allow-Scripts-Warnungen:** `npm install` meldet Warnungen zu `esbuild`, `@parcel/watcher`, `lmdb` und `msgpackr-extract`. Ob diese Build-Skripte freigegeben werden sollen, ist noch zu klären.
