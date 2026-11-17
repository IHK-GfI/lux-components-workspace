---
description: 'Setzt die offenen Stellen aus dem Update auf LUX-Components 22 um (lux-update-22-bericht.md).'
mode: agent
---

# Update auf LUX-Components 22: offene Stellen umsetzen

Du hilfst beim Update einer Angular-Anwendung auf LUX-Components 22 (Angular 22).
Der LUX-Components-Updater (`ng g @ihk-gfi/lux-components-update:update-22.0.0`) ist bereits gelaufen, und `npm install` wurde ausgeführt.
Er hat die mechanischen Änderungen erledigt und alle übrigen Stellen in die Datei `lux-update-22-bericht.md` im Projektverzeichnis geschrieben.
Deine Aufgabe ist es, diese Stellen umzusetzen, bis Build, Lint und Tests wieder grün sind.

Maßgeblich ist der [Update-Guide v22](https://github.com/IHK-GfI/lux-components-workspace/wiki/Update-Guide-v22). Wenn etwas unklar ist oder diese Anleitung nicht ausreicht, lies dort nach.

## Rahmen

- Ändere nur, was der Bericht, der Compiler, der Linter oder die Tests verlangen. Kein Refactoring nebenbei, keine Formatierung ganzer Dateien.
- Erstelle keine Commits.
- Frag nach, bevor du fachliches Verhalten änderst (z.B. Datumswerte im Backend-Format) oder wenn eine Stelle mehrere sinnvolle Lösungen hat.
- Die Selektoren und Klassen mit "-ac" bzw. "Ac" (z.B. `lux-input-ac`, `LuxInputAcComponent`) funktionieren weiter. Benenne sie nur um, wenn der Nutzer das ausdrücklich möchte. Dann eigene CSS-Selektoren (z.B. `lux-input-ac { ... }`) mit anpassen.
- `luxControlBinding`, `[(luxValue)]`, `[(luxChecked)]` und `[(luxSelected)]` funktionieren weiter. Stelle Formulare nicht ungefragt auf Signal Forms um.
- Stelle die Change Detection der eigenen Komponenten **nicht** um. Ab Angular 22 ist OnPush der Standard, deshalb hat `ng update` allen Komponenten `changeDetection: ChangeDetectionStrategy.Eager` hinzugefügt, damit sie sich wie bisher verhalten. Entferne diese Angabe nicht und setz keine Komponente auf `ChangeDetectionStrategy.OnPush`, auch wenn das wie eine Verbesserung aussieht.
- Sind die [Angular Agent Skills](https://angular.dev/ai/agent-skills) installiert (`.agents/skills/angular-developer` bzw. `.claude/skills/angular-developer`), nutze den Skill `angular-developer` für Angular-Fragen. Bei Widersprüchen gelten die Regeln dieser Datei. Fehlen die Skills, empfiehl sie am Ende einmal: `npx skills add https://github.com/angular/skills`.

## Ablauf

1. Lies `lux-update-22-bericht.md`. Die Stellen sind nach Kategorien gruppiert, jede Kategorie verweist auf den passenden Abschnitt im Update-Guide.
2. Kläre zuerst mit dem Nutzer den Weg für die Datums- und Zeitwerte, falls der Bericht diese Kategorie enthält (siehe unten).
3. Arbeite die Kategorien der Reihe nach ab. Die Regeln dazu stehen unten.
4. Führe danach `ng build`, `ng lint` (falls eingerichtet) und `ng test` aus und behebe die Fehler. Viele Breaking Changes (z.B. Signal-Inputs) fallen erst dabei auf, weil der Updater sie nicht finden kann.
5. Fasse am Ende zusammen, was du geändert hast und was offen bleibt (z.B. Stellen, die der Nutzer fachlich entscheiden muss). Lösche `lux-update-22-bericht.md` erst, wenn der Nutzer zustimmt.

## Regeln

### Signal-Inputs und -Outputs

Die Inputs und Outputs der LUX-Components sind jetzt `input()`, `model()` und `output()`. Im Template ändert sich nichts.

- Über eine Komponentenreferenz (`viewChild()`, `@ViewChild`) wird ein Input als Funktion gelesen: `this.input.luxLabel()` statt `this.input.luxLabel`.
- Inputs können nicht mehr aus dem TypeScript-Code zugewiesen werden (`this.input.luxLabel = 'x'` geht nicht). Den Wert stattdessen im Template binden, z.B. über ein eigenes Signal: `[luxLabel]="label()"`.
- `subscribe()` auf einen Output liefert ein `OutputRefSubscription` (aus `@angular/core`) statt einer RxJS-`Subscription`. Typen von Feldern entsprechend anpassen.
- `LuxErrorStoreService`: `error`, `config` und `lastErrors` sind Signals (`errorStore.error()`). Statt `errorStore.error = fehler` wird `errorStore.setError(fehler)` aufgerufen.

### OnPush der LUX-Komponenten

Die LUX-Komponenten verwenden intern `ChangeDetectionStrategy.OnPush`. Das betrifft nur die Daten, die die Anwendung an LUX-Komponenten bindet, nicht die Change Detection der eigenen Komponenten (siehe Rahmen).

Ändere hier nur Stellen, an denen sich eine LUX-Komponente nachweislich nicht aktualisiert (z.B. ein fehlschlagender Test oder ein Hinweis des Nutzers). Stell nicht vorsorglich den ganzen Code um. Ursache ist dann meist ein gebundenes Objekt oder Array, das direkt verändert wird. Dann eine neue Referenz zuweisen:

```typescript
// Bisher
this.options.push(newOption);
this.config.label = 'Neu';

// Neu
this.options = [...this.options, newOption];
this.config = { ...this.config, label: 'Neu' };
```

### Konfiguration

`LuxComponentsConfigModule` entfällt. Der Updater hat `importProvidersFrom([LuxComponentsConfigModule.forRoot(config)])` bereits ersetzt. Übrige Stellen (NgModule-`imports`, TestBed, gemischtes `importProvidersFrom`) so umstellen:

```typescript
// Bisher
imports: [LuxComponentsConfigModule.forRoot(myConfiguration)];

// Neu (in providers, auch in TestBed.configureTestingModule)
providers: [provideLuxComponentsConfig(myConfiguration)];
```

### Formulare

- Code, der eine Form-Komponente als `LuxFormComponentBase` typisiert, auf die konkrete Komponente umstellen (z.B. `LuxInputComponent`). Die Form-Komponenten erben nicht mehr von dieser Klasse.
- `LuxFormCheckableBaseClass` entfällt.

### Datums- und Zeitwerte

`lux-datepicker` und `lux-timepicker` arbeiten ohne Zeitzone: `"2029-05-26"`, `"14:30"` bzw. bei gemeinsamem Wert `"2029-05-26T14:30"`. Werte im Format von Version 21 (`"2029-05-26T00:00:00.000Z"`) lehnen sie mit einem Validierungsfehler ab.

Frag den Nutzer **vor** jeder Änderung, welcher Weg gilt:

- **Weg 1: Backend umstellen.** Das Backend liefert und erwartet die neuen Formate (Java `LocalDate`/`LocalTime`/`LocalDateTime`, .NET `DateOnly`/`TimeOnly`). Im Frontend nur Typen und Testdaten anpassen.
- **Weg 2: Im Frontend umrechnen.** Beim Laden und Speichern im Service umrechnen, Komponenten bekommen nur die neuen Formate:

```typescript
// Laden
datum: LuxUtil.fromV21Date(dto.datum),
beginn: LuxUtil.fromV21Time(dto.beginn),
termin: LuxUtil.fromV21DateTime(dto.termin)

// Speichern
datum: LuxUtil.toV21Date(form.datum),
beginn: LuxUtil.toV21Time(form.beginn),
termin: LuxUtil.toV21DateTime(form.termin)
```

Unabhängig vom Weg:

- `luxMinDate`, `luxMaxDate`, `luxStartDate` nur noch als `"yyyy-MM-dd"`. `luxMinTime`, `luxMaxTime` nur noch als `"HH:mm"` mit zweistelliger Stunde (`"08:00"`). Werte in anderen Formaten werden ignoriert.
- `luxCustomFilter` erhält den Tag als String `"yyyy-MM-dd"` statt als `Date`: `(date: string) => boolean`. Den Wochentag liefert `LuxUtil.getDayOfWeek(date)`.
- Im Code erzeugte Werte: `LuxUtil.todayAsLocalDate()` statt `LuxUtil.newDateWithoutTime()`, `LuxUtil.toLocalDate(date)` bzw. `LuxUtil.toLocalTime(date)` statt `date.toISOString()`.
- `LuxUtil.parseISO8601AsUTC()`, `isISO8601WithoutTimezone()` und `ISO_8601_FULL` entfallen. Für die neuen Formate gibt es `LuxUtil.isLocalDate()` usw.
- `LuxDatepickerAdapter`, `LuxTimepickerAdapter` und `LuxDatetimepickerAdapter` werden nicht mehr exportiert.
- `lux-datetimepicker` (auch `-ac`) entfällt. Ersetzen durch `lux-datepicker` und `lux-timepicker`, entweder mit getrennten Feldern (`"2029-05-26"` und `"14:30"`, zusammenführen mit `LuxUtil.combineDateTime()`) oder mit gemeinsamem Feld:

```html
<lux-datepicker luxLabel="Datum" [formField]="form.termin" [luxReferenceControl]="timepicker" #datepicker />
<lux-timepicker luxLabel="Uhrzeit" [formField]="form.termin" [luxReferenceControl]="datepicker" #timepicker />
```

Mit Reactive Forms statt `[formField]` entsprechend `luxControlBinding`. Welche Variante passt, entscheidet der Nutzer: Getrennte Felder sind nötig, wenn erkennbar sein muss, ob eine Uhrzeit gewählt wurde.

- Grenzen aus Datum und Uhrzeit zusammen (z.B. "nicht vor dem 26.05.2029, 14:30") gibt es nicht mehr. Solche Stellen nicht selbst lösen, sondern dem Nutzer melden.
- Braucht das Backend einen echten Zeitpunkt (`Instant`, `OffsetDateTime`), rechnet die Anwendung mit `new Date(termin).toISOString()` bzw. `LuxUtil.toLocalDateTime(new Date(zeitpunkt))` um, **nicht** mit `toV21DateTime()`/`fromV21DateTime()`.

### Animationen

- Die Exporte `sideNavAnimation`, `sideNavOverlayAnimation` und `expansionAnim` entfallen. Verwendungen entfernen.
- Die LUX-Components brauchen `@angular/animations` nicht mehr. Wenn die Anwendung selbst keine Angular-Animationen (`trigger()`, `[@...]`) verwendet, können `provideAnimations()`, `provideAnimationsAsync()`, `provideNoopAnimations()`, `BrowserAnimationsModule` und `NoopAnimationsModule` entfernt werden, danach `npm uninstall @angular/animations`. Vorher den Nutzer fragen.
- In Specs mit Material-Overlays (z.B. `LuxDialogService`) die Material-Animationen bei Bedarf abschalten: `{ provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }`.

### Entfernte Optionen

- `luxIconName` an `lux-card` hatte keine Wirkung. Der Updater hat es in `.html`-Dateien entfernt. In Inline-Templates (`template:` in `.ts`) entfernen.
- `alignIconWithLabel` in `ILuxStepperButtonConfig` und `LuxStepperLargeButtonInfo` entfernen.
- Die Felder `luxButton`, `luxLink`, `luxLinkPlain`, `luxMenu`, `luxActionNav` und `luxActionNavAc` der `LuxTooltipDirective` entfallen. Zugriffe darauf (z.B. `tooltip.luxButton`) entfernen und stattdessen direkt die Komponente verwenden, auf der der Tooltip sitzt (z.B. per `viewChild()`). Unklare Fälle dem Nutzer melden.

### Styling

Das Theme verwendet kaum noch `!important`.

- Die Klassen `lux-bold`, `lux-uppercase`, `lux-lowercase` und `lux-vertical-align-baseline` setzen sich nicht mehr gegen spezifischere Regeln durch. Nur wenn die Darstellung sich dadurch ändert, die eigene Regel spezifischer machen oder einen eigenen Style setzen.
- Eigenes `!important`, das nur LUX-Styles übersteuern sollte, ist oft nicht mehr nötig. Nur entfernen, wenn klar ist, dass es nichts anderes übersteuert. Im Zweifel stehen lassen und melden.

### Test-Utilities

Die Test-Utilities aus `@ihk-gfi/lux-components/test-utils` setzen Vitest voraus.

- Verwendet das Projekt noch Karma/Jasmine, mit dem Nutzer klären, ob die Tests auf Vitest umgestellt werden (Angular bietet dafür eine Migration). Ohne Vitest funktionieren die LUX-Test-Utilities nicht.
- `LuxTestHelper.wait()`, `click()` und `setInputValue()` sind asynchron:

```typescript
// Bisher
it('sollte klicken', fakeAsync(() => {
  LuxTestHelper.click(fixture, button);
  LuxTestHelper.wait(fixture);
}));

// Neu
it('sollte klicken', async () => {
  await LuxTestHelper.click(fixture, button);
  await LuxTestHelper.wait(fixture);
});
```

- `wait()` erkennt Fake-Timer von Vitest (`vi.useFakeTimers()`) selbst. Wer Fake-Timer verwendet, setzt sie in `afterEach` mit `vi.useRealTimers()` zurück.
- `LuxA11yTestHelper` verwendet `axe-core` direkt, `jasmine-axe` kann entfernt werden.
