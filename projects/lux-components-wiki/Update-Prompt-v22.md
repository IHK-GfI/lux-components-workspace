# KI-Prompt für das Update auf Version 22

Dieser Prompt lässt einen KI-Assistenten (z.B. GitHub Copilot im Agent-Modus) die Schritte aus dem Abschnitt [Update](update-guide-v22#update) des [Update-Guides v22](update-guide-v22) ausführen.

- Er prüft zuerst die Vorbedingungen und zeigt, was er vorhat.
- Er empfiehlt die [Angular Agent Skills](https://angular.dev/ai/agent-skills) und richtet sie nach Rückfrage im Projekt ein (`npx skills add https://github.com/angular/skills`). Damit kennt der KI-Assistent die aktuellen Angular-Best-Practices.
- Vor dem globalen Installieren der Angular CLI, vor dem Löschen von Dateien und vor `ng update --force` fragt er jeweils nach.
- Node installiert er **nicht**. Passt die Node-Version nicht, meldet er das und hält an.
- Nach dem LUX-Components-Updater setzt er die Breaking Changes mit dem Prompt _.github/prompts/lux-update-22.prompt.md_ um, den der Updater anlegt.
- Zum Schluss prüft er, ob das Projekt dem aktuellen Angular-Standard entspricht, z.B. OnPush, Application Builder, Vitest, Standalone statt NgModules oder Playwright-Tests. Pro offenem Punkt bietet er eine optionale Migration an und setzt sie nur nach Zustimmung um.
- Er erstellt keine Commits.

Den [Update-Guide v22](update-guide-v22) sollte man trotzdem vorher lesen. Die Änderungen des Assistenten bitte prüfen.

## Verwendung

1. Im Anwendungsprojekt die Datei _.github/prompts/lux-update-22-ausfuehren.prompt.md_ anlegen und den Inhalt des Kastens unten hineinkopieren (über die Schaltfläche zum Kopieren oben rechts im Kasten).
2. In VS Code den Copilot-Chat im Agent-Modus öffnen und `/lux-update-22-ausfuehren` eingeben.
   Bei anderen KI-Assistenten den Inhalt der Datei als Anweisung übergeben.
3. Die Rückfragen beantworten.
4. Die Datei nach dem Update wieder löschen.

## Prompt

```markdown
---
description: 'Führt das Update auf LUX-Components 22 nach dem Update-Guide v22 aus (mit Rückfragen, ohne Node zu installieren).'
mode: agent
---

# Update auf LUX-Components 22 ausführen

Du führst in diesem Angular-Projekt das Update auf LUX-Components 22 (Angular 22) aus.
Grundlage ist der Abschnitt "Update" im [Update-Guide v22](https://github.com/IHK-GfI/lux-components-workspace/wiki/Update-Guide-v22#update).
Lies den Guide, wenn ein Schritt unklar ist oder ein Fehler auftritt.

## Rahmen

- Erstelle keine Commits.
- Installiere oder wechsle **niemals** Node.js. Prüfe die Version nur und melde, wenn sie nicht passt.
- Stelle die Change Detection der eigenen Komponenten in Phase 0 bis 2 **nicht** um. Ab Angular 22 ist OnPush der Standard, deshalb fügt `ng update` allen Komponenten `changeDetection: ChangeDetectionStrategy.Eager` hinzu, damit sie sich wie bisher verhalten. Entferne diese Angabe nicht und setz keine Komponente auf `ChangeDetectionStrategy.OnPush`. Das gilt auch für alle anderen Modernisierungen: Sie werden nur in Phase 3 angeboten und nur nach ausdrücklicher Zustimmung umgesetzt.
- Frag vor jedem Schritt, der mit "(fragen)" markiert ist, und führe ihn nur nach Zustimmung aus. Lehnt der Nutzer ab, halte an und frag, wie es weitergehen soll.
- Nenne vor jedem Befehl kurz, was er tut. Fasse danach das Ergebnis in ein bis zwei Sätzen zusammen.
- Schlägt ein Befehl fehl, halte an, nenne die Ursache aus der Ausgabe und frag, wie es weitergehen soll. Probiere keine eigenen Umgehungen (z.B. andere Versionen oder `--legacy-peer-deps`), ohne zu fragen.
- Verwende npm. Führe alle Befehle in der Projektwurzel aus (dort liegen `angular.json` und `package.json`).
- Verwende Löschbefehle passend zur Shell, z.B. PowerShell `Remove-Item -Recurse -Force node_modules` oder Bash `rm -rf node_modules`. Weise vor dem Löschen von `node_modules` darauf hin, dass ein laufendes `ng serve` oder ein Test-Watcher beendet sein muss.
- Sind die [Angular Agent Skills](https://angular.dev/ai/agent-skills) im Projekt installiert (siehe Phase 0), nutze den Skill `angular-developer` immer, wenn du Angular-Code änderst, z.B. bei den Breaking Changes und in Phase 3. Lädt dein Werkzeug den Skill nicht von selbst, lies `.agents/skills/angular-developer/SKILL.md` (bzw. `.claude/skills/...`) und die darin genannten Referenzen selbst. Bei Widersprüchen gelten die Regeln dieses Prompts und des LUX-Prompts `lux-update-22.prompt.md`, z.B. bleibt `ChangeDetectionStrategy.Eager` bis Phase 3 stehen, auch wenn der Skill OnPush empfiehlt.

## Phase 0: Vorbedingungen prüfen

In dieser Phase änderst du nichts.

1. Projektwurzel: Gibt es `angular.json` und `package.json`? Sonst nach dem richtigen Verzeichnis fragen.
2. Git: Ist der Arbeitsbaum sauber (`git status`)? Auf welchem Branch steht das Projekt? Steht es auf `develop`, `main` oder `master`, schlag einen eigenen Branch vor (z.B. `git switch -c update/lux-22`) und leg ihn nur nach Zustimmung an. Gibt es nicht committete Änderungen, frag, ob der Nutzer sie zuerst sichern möchte.
3. LUX-Version: `@ihk-gfi/lux-components` in der `package.json` muss auf `21.11.x` stehen. Ist die Version älter, brich ab: Zuerst müssen die Updates aus dem [Update-Guide v21](https://github.com/IHK-GfI/lux-components-workspace/wiki/Update-Guide-v21) ausgeführt werden.
4. Node: `node -v` muss im Bereich `^22.22.3 || ^24.15.0 || >=26.0.0` liegen, empfohlen ist Node 24 (mindestens 24.15.0). Liegt die Version außerhalb, melde das und halte an. Der Nutzer installiert Node selbst und startet den Prompt danach neu.
5. JAST-Projekte: Gibt es eine `pipeline.yaml`, nenne die Node-Images darin. Passen sie nicht zur Node-Version (z.B. `node:24-alpine`, `node-java-alpine:node24-java21`, `node-chromium:node-24`), biete die Anpassung an, ändere die Datei aber nur nach Zustimmung.
6. Angular CLI: Ermittle die global installierte Version mit `npm ls -g @angular/cli --depth=0`.
7. Angular Agent Skills: Gibt es `skills-lock.json` mit Einträgen aus `angular/skills` oder die Ordner `.agents/skills/angular-developer` bzw. `.claude/skills/angular-developer`?
8. Zeig eine kurze Zusammenfassung (Branch, LUX-Version, Node-Version, CLI-Version, `pipeline.yaml`, Angular Agent Skills) und die Schritte, die du ausführen wirst. Frag, ob es losgehen soll.

## Angular Agent Skills einrichten (fragen)

Die [Angular Agent Skills](https://angular.dev/ai/agent-skills) sind offizielle Anweisungen des Angular-Teams für KI-Assistenten (`angular-developer` für Code und Architektur, `angular-new-app` für neue Projekte). Sie helfen beim Umsetzen der Breaking Changes und der Migrationen in Phase 3. Empfiehl sie, bevor Phase 1 beginnt.

- Sind sie noch nicht installiert, frag, ob du sie einrichten sollst. Der Befehl hängt vom KI-Assistenten ab:
  - GitHub Copilot: `npx skills add https://github.com/angular/skills --skill '*' --agent github-copilot -y` (legt `.agents/skills/` an)
  - Claude Code: `npx skills add https://github.com/angular/skills --skill '*' --agent claude-code -y` (legt `.claude/skills/` an)
  - Beide oder ein anderer Assistent: mehrere Werte für `--agent` angeben bzw. `npx skills add https://github.com/angular/skills` ohne `--agent` und `-y` ausführen. Dann fragt das Werkzeug selbst; diese Auswahl trifft der Nutzer im Terminal.
- Sind sie schon installiert, biete an, sie mit `npx skills update -p -y` zu aktualisieren.
- Danach `skills-lock.json` und die Skill-Ordner nennen. Empfiehl, sie mit zu committen, damit das ganze Team dieselben Skills hat. Andere Teammitglieder stellen sie mit `npx skills experimental_install` wieder her.
- `npx skills` lädt die Skills von GitHub. Schlägt das fehl (z.B. wegen Proxy oder Firewall), melde es und mach ohne Skills mit Phase 1 weiter. Lehnt der Nutzer ab, mach ebenfalls ohne Skills weiter. Der Punkt erscheint dann in Phase 3 noch einmal.

## Phase 1: Update ausführen

1. **Angular CLI 22** (fragen): Ist global schon Version 22 installiert, überspring den Schritt. Sonst `npm install -g @angular/cli@22`.
2. **package-lock.json löschen** (fragen).
3. **Angular aktualisieren** (fragen): `ng update @angular/cli@22 @angular/core@22 @angular/material@22 angular-eslint@22 --force --allow-dirty`
   Nimm nur Pakete in den Befehl auf, die in der `package.json` stehen (z.B. `angular-eslint` weglassen, wenn es fehlt). Meldet npm fehlende Pakete, gilt die Regel "Fehlende Pakete" unten.
   Ändere vor diesem Schritt keine Versionen in der `package.json` von Hand (z.B. `ngx-cookie-service`, das setzt der LUX-Components-Updater). `ng update` prüft die installierten Pakete mit `npm list` und bricht mit `invalid: <paket>@<version>` ab, wenn die Version in der `package.json` nicht zur installierten passt. `--force` und `--allow-dirty` helfen dagegen nicht. Tritt die Meldung auf, nenne das Paket und schlag vor, die Version in der `package.json` auf die installierte zurückzusetzen.
   Setz für diesen Befehl die Umgebungsvariable `NG_FORCE_TTY=false` (PowerShell: `$env:NG_FORCE_TTY='false'; ng update ...`, Bash: `NG_FORCE_TTY=false ng update ...`). Dann fragt `ng update` nicht interaktiv nach optionalen Migrationen, sondern listet sie nur auf.
4. **Optionale Migrationen:** Führ nur die Builder-Migration aus: `ng update @angular/cli --name use-application-builder --allow-dirty`
   Die Migration `migrate-karma-to-vitest` führst du **nicht** aus, auch keine anderen optionalen Migrationen. Fragt `ng update` trotzdem interaktiv nach, wähl nur `use-application-builder` aus.
5. **LUX-Components-Updater installieren:** `npm install @ihk-gfi/lux-components-update@22 --save-dev --force`
   npm-Warnungen können ignoriert werden, Fehler nicht.
6. **LUX-Components-Updater ausführen:** `ng g @ihk-gfi/lux-components-update:update-22.0.0`
   Bricht der Updater bei der Prüfung von Node, Angular oder der LUX-Version ab, gib die Meldung weiter und halte an.
   Der Updater legt die Dateien `lux-update-22-bericht.md` und `.github/prompts/lux-update-22.prompt.md` an. Fasse den Bericht kurz zusammen (Anzahl Stellen je Kategorie).
7. **package-lock.json und node_modules löschen** (fragen).
8. **Abhängigkeiten installieren:** `npm install`
   Meldet npm fehlende Pakete, gilt die Regel "Fehlende Pakete" unten.
9. **Breaking Changes umsetzen** (fragen): Lies `.github/prompts/lux-update-22.prompt.md` und arbeite `lux-update-22-bericht.md` nach den Regeln dieser Datei ab. Deren Rückfragen gelten weiter, z.B. welcher Weg für die Datums- und Zeitwerte gilt. Möchte der Nutzer das später selbst erledigen, mach mit Phase 2 weiter.

### Fehlende Pakete

Meldet `ng update` oder `npm install`, dass ein Paket nicht gefunden wurde, liegt es oft am lokalen npm-Cache. Wird z.B. ein Nexus verwendet, speichert der Cache die erste negative Antwort für etwa 24 Stunden.
Erkläre das kurz und führe nach Zustimmung `npm cache clean --force` und danach `npm install` aus. Wiederhole dann den Schritt, der fehlgeschlagen ist. Schlägt er erneut fehl, halte an.
Details: [Fehlende Pakete bei "npm install"](https://github.com/IHK-GfI/lux-components-workspace/wiki/Update-Guide-v22#fehlende-pakete-bei-npm-install)

## Phase 2: Nach dem Update

1. Smoketest: Gibt es in der `package.json` das Skript `smoketest`, führ `npm run smoketest` aus. Sonst `ng build`, `ng lint` (falls eingerichtet) und `ng test`.
   Wenn Fehler auftreten und Phase 1, Schritt 9 noch nicht erledigt ist, weise darauf hin. Die meisten Fehler kommen dann aus den Breaking Changes.
2. Melde als offene Punkte, soweit sie zutreffen:
   - eigene Abhängigkeiten, die der Updater nicht aktualisiert hat (z.B. Pakete, die noch eine Angular-Version kleiner 22 verlangen)
   - die Anwendung vollständig manuell testen
   - bei JAST-Projekten die Node-Images in der `pipeline.yaml`, falls noch nicht angepasst
   - `lux-update-22-bericht.md` und die beiden Prompt-Dateien unter `.github/prompts/` löschen, sobald alles erledigt ist

## Phase 3: Projekt auf aktuellen Angular-Stand prüfen

Das Update selbst ist nach Phase 2 abgeschlossen. In dieser Phase prüfst du, ob das Projekt dem aktuellen Angular-Standard entspricht, und bietest pro Punkt eine **optionale** Migration an.

### Ablauf

1. Biete die Migrationen erst an, wenn Build und Tests aus Phase 2 grün sind. Sonst zeig nur das Ergebnis der Prüfung und weise darauf hin, dass zuerst die Fehler behoben werden sollten.
2. Prüfe alle Punkte unten, ohne etwas zu ändern. Zähl dabei die Fundstellen (z.B. "42 Komponenten mit `Eager`").
3. Zeig das Ergebnis mit diesem Einleitungssatz: "Das Update ist durchgeführt. Damit das Projekt auf einem aktuellen Angular-Stand ist, sollten noch folgende Punkte umgesetzt werden:"
   Danach eine Tabelle mit den offenen Punkten: Nr., Punkt, Befund, Aufwand (gering, mittel, hoch), Migration. Die erfüllten Punkte nennst du darunter kurz als "Bereits aktuell".
4. Empfiehl vor der ersten Migration, den Stand nach dem Update zu committen. Das macht der Nutzer selbst. So lässt sich jede Migration einzeln prüfen und zurücknehmen.
5. Biete die offenen Punkte **einzeln** in der Reihenfolge unten an: "jetzt umsetzen", "überspringen" oder "später". Fass nie mehrere Punkte zu einer Migration zusammen.
6. Nach jedem umgesetzten Punkt: `ng build`, `ng test` und `ng lint` (falls eingerichtet) ausführen. Fass die geänderten Dateien und das Ergebnis zusammen, bevor du den nächsten Punkt anbietest. Schlägt etwas fehl, frag, ob du die Fehler beheben oder die Änderungen dieses Punkts zurücknehmen sollst.
7. Fragt ein Schematic nach einem Pfad, schlag das ganze Projekt vor (`./`). Bei großen Projekten kann der Nutzer auch Ordner für Ordner vorgehen.

### Prüfpunkte

1. **Application Builder**
   - Prüfung: In der `angular.json` steht für `build` der Builder `@angular/build:application` und für `serve` `@angular/build:dev-server`. Steht dort `@angular-devkit/build-angular:browser` oder `:browser-esbuild`, ist der Punkt offen.
   - Migration: `ng update @angular/cli --name use-application-builder --allow-dirty`. Danach `@angular-devkit/build-angular` aus der `package.json` entfernen, falls es nirgends mehr verwendet wird. Pfade in der `angular.json` prüfen, die der neue Builder anders erwartet (z.B. `outputPath` mit Unterordner `browser`), und Deploy-Skripte darauf hinweisen.
   - Aufwand: gering.
2. **Vitest statt Karma**
   - Prüfung: Builder für `test` in der `angular.json` (`@angular/build:unit-test` ist aktuell, `:karma` nicht), `karma.conf.js`, `karma`/`jasmine-core` in den devDependencies.
   - Migration: Zuerst `ng update @angular/cli --name migrate-karma-to-vitest --allow-dirty` für Builder und Konfiguration. Danach den Spec-Code mit `ng g @schematics/angular:refactor-jasmine-vitest` umstellen (experimentell). Übrige Stellen von Hand nacharbeiten, z.B. `jasmine.createSpy` → `vi.fn()`, `spyOn` → `vi.spyOn`, `fakeAsync`/`tick` → `vi.useFakeTimers()` und `await vi.advanceTimersByTimeAsync()`. Die LUX-Test-Utilities (`LuxTestHelper.wait()`, `click()`, `setInputValue()`) mit `await` aufrufen.
   - Hinweis: Die Test-Utilities der LUX-Components funktionieren nur mit Vitest.
   - Aufwand: mittel bis hoch.
3. **Standalone statt NgModules**
   - Prüfung: `app.module.ts`, `bootstrapModule(` in der `main.ts`, weitere Klassen mit `@NgModule` (ohne reine Test-Hilfen).
   - Migration: `ng g @angular/core:standalone-migration` in drei Durchläufen, jeweils mit Build dazwischen: zuerst "Convert all components, directives and pipes to standalone", dann "Remove unnecessary NgModule classes", zuletzt "Bootstrap the application using standalone APIs". Danach liegen die Provider in der `app.config.ts`.
   - Aufwand: mittel.
4. **Moderne Template-Syntax**
   - Prüfung: `*ngIf`, `*ngFor`, `*ngSwitch`, `[ngClass]`, `[ngStyle]`, Importe von `CommonModule`, Komponenten-Tags ohne Inhalt, die nicht selbstschließend sind.
   - Migration, als einzelne Schritte nacheinander: `ng g @angular/core:control-flow-migration`, `ng g @angular/core:ngclass-to-class-migration`, `ng g @angular/core:ngstyle-to-style-migration`, `ng g @angular/core:common-to-standalone-migration`, `ng g @angular/core:self-closing-tags-migration`, zum Schluss `ng g @angular/core:cleanup-unused-imports`.
   - Aufwand: gering bis mittel.
5. **inject() statt Konstruktor-Injection**
   - Prüfung: Konstruktorparameter mit `private`, `protected`, `public` oder `readonly` in Komponenten, Direktiven, Pipes und Services.
   - Migration: `ng g @angular/core:inject-migration`.
   - Aufwand: gering.
6. **Signal-APIs für Inputs, Outputs und Queries**
   - Prüfung: `@Input(`, `@Output(`, `@ViewChild(`, `@ViewChildren(`, `@ContentChild(`, `@ContentChildren(`.
   - Migration: `ng g @angular/core:signals`. Stellen, die das Schematic nicht umstellen kann, markiert es mit einem TODO-Kommentar. Diese Stellen meldest du dem Nutzer.
   - Aufwand: mittel.
7. **Lazy Loading der Routen**
   - Prüfung: Routen mit `component:`, die Komponenten direkt importieren, statt `loadComponent`/`loadChildren`.
   - Migration: `ng g @angular/core:route-lazy-loading-migration`. Ob Startseite und Fehlerseite direkt geladen bleiben sollen, fragst du den Nutzer.
   - Aufwand: gering.
8. **RouterTestingModule in Tests**
   - Prüfung: `RouterTestingModule` in Specs.
   - Migration: `ng g @angular/core:router-testing-module-migration`.
   - Aufwand: gering.
9. **Strenge Template-Prüfung**
   - Prüfung: `"strictTemplates": false` in der `tsconfig.json`, die `ng update` gesetzt hat, wenn der Wert vorher fehlte. Außerdem abgeschaltete Extended Diagnostics `nullishCoalescingNotNullable` und `optionalChainNotNullable` sowie `$safeNavigationMigration(` in Templates.
   - Migration: `strictTemplates` auf `true` setzen und die gemeldeten Template-Fehler beheben. Die Diagnostics wieder einschalten. `$safeNavigationMigration(...)` erhält das alte Verhalten, bei dem `?.` im Template `null` statt `undefined` liefert. Entferne den Wrapper nur dort, wo das Ergebnis nicht zwischen `null` und `undefined` unterscheidet (z.B. in `@if`, mit `??` oder als Text im Template). Bei Inputs, Vergleichen mit `=== null` und Funktionsargumenten frag nach.
   - Aufwand: mittel.
10. **OnPush statt Eager**
    - Prüfung: Komponenten mit `ChangeDetectionStrategy.Eager` oder `ChangeDetectionStrategy.Default`. Ab Angular 22 ist OnPush der Standard, eine Komponente ohne Angabe ist also OnPush.
    - Migration: Dafür gibt es kein Schematic. Stell schrittweise um, beginnend mit Komponenten ohne eigene Kind-Komponenten, jeweils einen Ordner auf einmal. Pro Komponente:
      1. Zustand suchen, der sich ändert, ohne dass Angular davon erfährt:
         - Zuweisungen in `subscribe()`, `setTimeout()` und Promises
         - per `push()`/`splice()` veränderte Arrays und direkt veränderte Objekte
         - im Template gelesene `BehaviorSubject.value`
         - jede Fundstelle von `ChangeDetectorRef`, `markForCheck()` und `detectChanges()`
      2. Liest das Template diesen Zustand, wird er zum Signal. Das ist der von Angular empfohlene Weg für OnPush und zoneless, denn ein im Template gelesenes Signal markiert genau die Ansicht, die es liest. `markForCheck()` bzw. die `async`-Pipe funktionieren grundsätzlich auch, sind aber fehleranfälliger: An jeder asynchronen Stelle muss jemand daran denken, und ein vergessener Aufruf fällt in Unit-Tests mit manuellem `fixture.detectChanges()` nicht auf.
      3. Regeln für die Umstellung:
         - Arrays und Objekte ersetzen statt verändern (`set([...])`, `update(...)`).
         - Zwei-Wege-Bindungen auf Eigenschaften veränderlicher Objekte (`[(checked)]="config.value.x"`) durch einen Handler ersetzen.
         - BehaviorSubjects, die an Kind-Komponenten weitergereicht werden, dürfen bleiben. Die lesende Komponente spiegelt ihren Wert per Subscription in ein Signal, und das Template liest nur dieses Signal.
         - Abgeleiteten Zustand mit `computed()` bilden.
         - Ladezustände über eigene Flags führen. Arrays nicht auf truthy prüfen, denn `[]` ist truthy.
         - Konstante Konfigurationen (Button- und Dialog-Configs) und Felder, die das Template nicht liest, bleiben normale Felder.
      4. Danach die Angabe `changeDetection: ChangeDetectionStrategy.Eager` entfernen. Am Ende sollten `ChangeDetectorRef`, `markForCheck()` und `detectChanges()` im App-Code nicht mehr vorkommen.
    - Tests: Die Specs auf Signal-Aufrufe anpassen (`component.x()`, `component.x.set(...)`). Specs, die `fixture.detectChanges()` selbst aufrufen, decken diese Fehler nicht auf, sie zeigen sich nur in der echten App. Typisches Symptom: Die Oberfläche aktualisiert sich erst nach einem Klick, einem Tastendruck oder einem Fokuswechsel.
    - Nach jedem Ordner bauen (`ng build`, wegen der strengen Template-Prüfung) und testen. Dann den Nutzer bitten, die betroffenen Seiten im Browser zu prüfen, gezielt Stellen, an denen nach einem Backend-Aufruf etwas erscheinen oder verschwinden soll (Spinner, Hinweise, Listen, Häkchen). Dabei ausdrücklich darauf hinweisen, die Seite vor der Prüfung neu zu laden. Nach Template-Änderungen im laufenden `ng serve` tauscht HMR die Ansicht aus, ohne neu zu laden. Danach zeigt die Oberfläche genau das obige Symptom, obwohl der Code korrekt ist.
    - Aufwand: hoch.
11. **Zoneless**
    - Prüfung: `zone.js` in den `polyfills` der `angular.json` (build und test) oder `provideZoneChangeDetection(` in der `app.config.ts`.
    - Migration: Erst sinnvoll, wenn Punkt 10 erledigt ist. Ohne Zone.js zeichnet Angular nur noch nach einem Template-Event, einer Signal-Änderung, `markForCheck()` bzw. der `async`-Pipe oder einem geänderten Input neu. Zustand, der per Zuweisung in `subscribe()` oder `setTimeout()` gesetzt wird, bleibt sichtbar veraltet, wenn kein `markForCheck()` folgt. Vor dem Umstellen deshalb erneut nach `markForCheck(`, `ChangeDetectorRef` und Zuweisungen in `subscribe()` suchen und die Fundstellen nach Punkt 10 auf Signals umstellen. Danach `provideZoneChangeDetection(...)` durch `provideZonelessChangeDetection()` ersetzen, `zone.js` aus den `polyfills` entfernen und `npm uninstall zone.js` ausführen. Die LUX-Components funktionieren ohne Zone.js. Eigener Code, der sich auf Zone.js verlässt, muss angepasst werden, z.B. `NgZone.onStable`.
    - Danach gründlich im Browser testen, nach einem Neuladen der Seite (siehe HMR-Hinweis in Punkt 10), vor allem Seiten mit asynchron geladenen Inhalten. Unit-Tests reichen als Nachweis nicht.
    - Aufwand: hoch.
12. **@angular/animations**
    - Prüfung: `@angular/animations` in der `package.json`, `provideAnimations(`, `provideAnimationsAsync(`, `provideNoopAnimations(`, `BrowserAnimationsModule`, `NoopAnimationsModule`. Verwendet die Anwendung selbst Angular-Animationen (`trigger(`, `[@`, `(@`)?
    - Migration: Nur wenn die Anwendung keine eigenen Angular-Animationen verwendet: Provider und Module entfernen, danach `npm uninstall @angular/animations`. Die LUX-Components brauchen das Paket nicht mehr.
    - Aufwand: gering.
13. **Veraltete LUX-Namen mit "-ac"**
    - Prüfung: Kategorie "Komponenten ohne -ac" im `lux-update-22-bericht.md`, sonst Suche nach `<lux-...-ac` und `Lux...AcComponent` (außer `lux-app-header-ac`, `lux-tile-ac`, `lux-lang-select-ac`).
    - Migration: Selektoren und Klassennamen ohne "-ac" bzw. "Ac" verwenden (z.B. `lux-input-ac` → `lux-input`, `LuxInputAcComponent` → `LuxInputComponent`). Eigene CSS-Selektoren mit anpassen.
    - Aufwand: gering bis mittel.
14. **Veraltete Wert-Bindungen an Form-Komponenten**
    - Hintergrund: `[(luxValue)]`, `[(luxChecked)]` und `[(luxSelected)]` sind veraltet und entfallen mit der nächsten Major-Version. Ersetzt werden sie durch das Two-Way-Binding `[(value)]` bzw. `[(checked)]`. Das ist eine reine Umbenennung im Template. Es entsteht **kein** Formular: kein `FormGroup`, kein `form()`, kein `[formField]`, keine neuen Felder oder Signals in der Komponentenklasse. Der gebundene Ausdruck bleibt genau derselbe.
    - Prüfung: Suche in den Templates nach `luxValue`, `luxValueChange`, `luxChecked`, `luxCheckedChange`, `luxSelected` und `luxSelectedChange`, aber nur an diesen Form-Komponenten: `lux-input`, `lux-textarea`, `lux-datepicker`, `lux-timepicker`, `lux-autocomplete`, `lux-chips`, `lux-slider`, `lux-select`, `lux-radio`, `lux-checkbox`, `lux-toggle`, `lux-file-input`, `lux-file-list`, `lux-file-upload`, `lux-lookup-combobox` und `lux-lookup-autocomplete` (auch in der Schreibweise mit "-ac", z.B. `lux-input-ac`). Gleichnamige Inputs anderer Komponenten sind **nicht** veraltet und bleiben unverändert, z.B. `luxValue` an `lux-progress` oder `luxSelected` an `lux-button-toggle`, `lux-list`, `lux-table` und `lux-side-nav-item`.
    - Migration, nur das Attribut umbenennen:

      | Komponente                                                      | Bisher                                                    | Neu                                           |
      | --------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------- |
      | Eingabefelder, Datum, Zeit, Autocomplete, Chips, Slider, Lookup | `[(luxValue)]`, `[luxValue]`, `(luxValueChange)`          | `[(value)]`, `[value]`, `(valueChange)`       |
      | `lux-select`, `lux-radio`, Datei-Komponenten                    | `[(luxSelected)]`, `[luxSelected]`, `(luxSelectedChange)` | `[(value)]`, `[value]`, `(valueChange)`       |
      | `lux-checkbox`, `lux-toggle`                                    | `[(luxChecked)]`, `[luxChecked]`, `(luxCheckedChange)`    | `[(checked)]`, `[checked]`, `(checkedChange)` |

      Beispiel: `<lux-input [(luxValue)]="person.name" (luxValueChange)="onChange($event)" />` wird zu `<lux-input [(value)]="person.name" (valueChange)="onChange($event)" />`.

    - Nicht ändern:
      - Elemente mit `luxControlBinding`, `luxFormControl` oder in einem `[formGroup]`. Sie gehören zu Punkt 15.
      - `luxControlValidators`. Der Input wird bei `[(value)]` weiterhin gebraucht und ist nicht veraltet.
      - Den TypeScript-Code. Ausnahme: Code, der `luxValue()`, `luxChecked()` oder `luxSelected()` über eine Komponentenreferenz liest, liest stattdessen `value()` bzw. `checked()`.
    - Danach bauen und testen, und den Nutzer bitten, die betroffenen Masken im Browser zu prüfen.
    - Aufwand: gering.

15. **Signal Forms** (nur Hinweis)
    - Prüfung: Formulare mit `FormGroup`/`FormControl` und `luxControlBinding`, `luxFormControl` bzw. `luxFormGroup`.
    - Migration: Keine pauschale Migration anbieten. Die bisherigen Bindungen funktionieren weiter, sind aber veraltet und entfallen mit der nächsten Major-Version. Nenne die Anzahl der Formulare und biete an, auf Wunsch ein einzelnes Formular als Beispiel auf Signal Forms (`[formField]`) umzustellen. Freistehende Felder mit `[(luxValue)]` usw. gehören nicht dazu, sie werden in Punkt 14 umbenannt.
    - Aufwand: hoch.
16. **Linting**
    - Prüfung: Gibt es ein `lint`-Target in der `angular.json` und eine ESLint-Konfiguration (`eslint.config.js`) mit `angular-eslint`?
    - Migration: Fehlt beides, `ng add angular-eslint` anbieten. Danach `ng lint` ausführen und die Anzahl der Meldungen nennen, aber nicht ungefragt alle beheben.
    - Aufwand: gering, das Beheben der Meldungen mittel.
17. **Angular Agent Skills**
    - Prüfung: wie in Phase 0, Schritt 7. Der Punkt ist offen, wenn die Skills fehlen oder vor Phase 1 abgelehnt wurden.
    - Migration: einrichten wie im Abschnitt "Angular Agent Skills einrichten" beschrieben. Für weitere KI-Unterstützung kannst du zusätzlich auf den [Angular CLI MCP-Server](https://angular.dev/ai/mcp) hinweisen (`npx -y @angular/cli mcp`), aber nur als Hinweis, ohne ihn einzurichten.
    - Aufwand: gering.

## Abschluss

Fasse zusammen:

- welche Schritte ausgeführt wurden und mit welchem Ergebnis
- welche Schritte übersprungen oder abgelehnt wurden
- welche Punkte aus Phase 3 umgesetzt, übersprungen oder auf später verschoben wurden
- was noch offen ist

Weise darauf hin, dass nichts committet wurde.
```
