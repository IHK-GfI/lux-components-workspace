# Update Guide 22

In diesem Update-Guide wird beschrieben, wie man die LUX-Components aktualisieren kann. Es handelt sich um inkrementelle Updates. Das heißt: Alle Updates müssen in der korrekten Reihenfolge (Beispiel: 22.0.0 -> 22.0.1 -> 22.1.0 -> 22.1.1 -> ...) ausgeführt werden. Es darf kein Update übersprungen werden, da jedes Update neben der Versionsaktualisierung in der `package.json` auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

- [Update Guide 22](#update-guide-22)
  - [Änderungen](#änderungen)
  - [Local Storage](#local-storage)
    - [lux-theme](#lux-theme)
    - [lux-tour-hint](#lux-tour-hint)
    - [lux-table](#lux-table)
    - [lux-session-timer](#lux-session-timer)
  - [Versionen](#versionen)
    - [Version 22.0.0](#version-2200)
      - [Allgemein](#allgemein)
      - [Vor dem Update](#vor-dem-update)
      - [Breaking Changes](#breaking-changes)
        - [Komponenten ohne "-ac"](#komponenten-ohne--ac)
        - [Signal-Inputs und -Outputs](#signal-inputs-und--outputs)
        - [OnPush-Change-Detection](#onpush-change-detection)
        - [Formulare und Signal Forms](#formulare-und-signal-forms)
        - [Datums- und Zeitwerte ohne Zeitzone](#datums--und-zeitwerte-ohne-zeitzone)
      - [Update](#update)
      - [Nach dem Update](#nach-dem-update)
      - [Troubleshooting](#troubleshooting)
      - [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)
      - [Weiterführende Verweise bei Interesse oder Problemen](#weiterführende-verweise-bei-interesse-oder-problemen)
      - [Fehlende Pakete bei "npm install"](#fehlende-pakete-bei-npm-install)

## Änderungen

**Wichtig!** Bitte alle Änderungen in der [CHANGELOG.md](https://github.com/IHK-GfI/lux-components-workspace/blob/main/projects/lux-components-lib/CHANGELOG.md) durchlesen.

## Local Storage

Folgende Komponenten nutzen den Local Storage des Browsers. Die verwendeten Keys müssen in der Einwilligung (siehe [lux-consent](lux‐consent-v22)) berücksichtigt werden.

### lux-theme

Das LUX-Theme nutzt den Local Storage, um zu speichern, welches Theme ausgewählt wurde.

|            |                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------- |
| Key        | "lux.app.theme.name"                                                                      |
| Key-Präfix | ---                                                                                       |
| Wert       | "green" oder "authentic"                                                                  |
| Beispiel   | lux.app.theme.name="authentic"                                                            |
| Auswirkung | Das Theme wird nicht gespeichert und die Anwendung startet immer mit dem authentic-Theme. |

### lux-tour-hint

Der LUX-Tour-Hinweis nutzt den Local Storage, um zu speichern, ob ein Hinweis nicht erneut angezeigt werden soll.

|            |                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Key        | Legt die Fachanwendung fest                                                                                                     |
| Key-Präfix | "[lux-tour-hint-dsa] "                                                                                                          |
| Wert       | boolean                                                                                                                         |
| Beispiel   | \[lux-tour-hint-dsa\] Hint_001=true                                                                                             |
| Auswirkung | Die Checkbox "Nicht wieder anzeigen" in den Hinweisen hat keine Auswirkung mehr und die Hinweise werden immer wieder angezeigt. |

### lux-table

Die LUX-Table nutzt den Local Storage, um zu speichern, welche Spalten ausgeblendet wurden, aber nur, wenn das Feature "Spalten ausblenden" (siehe Property "luxShowColumnSelector") verwendet wird.

|            |                                                                                                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Key        | Legt die Fachanwendung fest                                                                                                                                                                                                                                                          |
| Key-Präfix | Wird von der Fachanwendung festgelegt über die Property "luxColumnStorageKey"                                                                                                                                                                                                        |
| Wert       | String-Array mit den Spalten-Ids                                                                                                                                                                                                                                                     |
| Beispiel   | lux-demo-table-example=\["name", "symbol"\]                                                                                                                                                                                                                                          |
| Auswirkung | Hat nur Auswirkungen, wenn die Tabelle das Feature "Spalten ausblenden" (siehe Property "luxShowColumnSelector") verwendet. Wenn der Local Storage nicht mehr verwendet werden darf, werden die ausgeblendeten Spalten nach jedem Neuladen der Tabellen-Komponente wieder angezeigt. |

### lux-session-timer

Der LUX-Session-Timer nutzt den Local Storage, um die berechnete Endzeit der aktuellen Session zu speichern.

|            |                                                                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Key        | "lux-components-session-endtime" (kann über die Config-Property _sessionTimerConfig.localStorageKeyName_ angepasst werden)                                                             |
| Key-Präfix | ---                                                                                                                                                                                    |
| Wert       | Timestamp (Endzeit der Session in Millisekunden)                                                                                                                                       |
| Beispiel   | lux-components-session-endtime=1716390000000                                                                                                                                           |
| Auswirkung | Wenn der Local Storage nicht verwendet werden darf, kann der Session-Timer die verbleibende Sessiondauer nicht korrekt berechnen und die Anzeige der Restzeit funktioniert nicht mehr. |

## Versionen

In diesem Abschnitt wird beschrieben, wie man die LUX-Components aktualisieren kann. Alle Updates sind inkrementelle Updates. Das heißt, alle Updates müssen in der korrekten Reihenfolge ausgeführt werden und **_es darf kein Update übersprungen werden_**, da jedes Update neben der Versionsaktualisierung in der `package.json` auch potenziell weitere wichtige Änderungen enthalten kann, die sonst fehlen würden.

### Version 22.0.0

#### Allgemein

Bitte zuerst die vollständige Anleitung lesen und danach mit dem Update beginnen. Das Update sollte auf einem separaten Branch durchgeführt werden und nicht direkt auf dem Develop-Branch.

#### Vor dem Update

1. **Wichtig!** Bitte alle Änderungen in der [CHANGELOG.md](https://github.com/IHK-GfI/lux-components-workspace/blob/main/projects/lux-components-lib/CHANGELOG.md) und die [Breaking Changes](#breaking-changes) durchlesen.
1. LUX-Components auf die letzte Version `21.x.x` (siehe [Version 21.x.x](update-guide-v21)) aktualisieren.
1. Node auf 22 (mindestens 22.22.3) oder 24 (mindestens 24.15.0, empfohlen) aktualisieren. Node 20 wird von Angular 22 nicht mehr unterstützt (siehe auch [Ergänzung für JAST-Projekte](#ergänzung-für-jast-projekte)).
1. `@jsverse/transloco` mindestens auf die Version `^8.3.0` aktualisieren. Ab dieser Version steht `TranslocoService.activeLang` als Signal zur Verfügung, damit übersetzte Texte der LUX-Components einem Sprachwechsel zur Laufzeit folgen.

#### Breaking Changes

##### Komponenten ohne "-ac"

Die Komponenten mit dem Suffix "-ac" wurden umbenannt: Selektor und Klassenname haben kein "-ac" bzw. "Ac" mehr (z.B. `lux-input` statt `lux-input-ac` und `LuxInputComponent` statt `LuxInputAcComponent`).
Die alten Selektoren und Klassennamen funktionieren weiterhin, sind aber **deprecated** und werden in einer zukünftigen Major-Version entfernt.

Betroffen sind:

- `lux-autocomplete`
- `lux-checkbox`
- `lux-checkbox-container`
- `lux-chips`, `lux-chip`, `lux-chip-group`
- `lux-datepicker`
- `lux-file-input`
- `lux-input`, `lux-input-prefix`, `lux-input-suffix`
- `lux-lookup-autocomplete`
- `lux-lookup-combobox`
- `lux-master-detail`, `lux-master-list`, `lux-master-header`, `lux-master-header-content`, `lux-master-footer`, `lux-detail-view`, `lux-detail-header`, `lux-detail-wrapper`
- `lux-radio`
- `lux-select`
- `lux-slider`
- `lux-textarea`
- `lux-toggle`

`lux-app-header-ac` und `lux-tile-ac` behalten ihren Namen, da es mit `lux-app-header` und `lux-tile` bereits eigenständige Komponenten gibt.

##### Signal-Inputs und -Outputs

Die Inputs und Outputs der LUX-Components wurden auf die Signal-APIs von Angular (`input()`, `model()` und `output()`) umgestellt. Für die Verwendung im Template ändert sich nichts.

Wird im TypeScript-Code über eine Komponentenreferenz (z.B. `viewChild()` oder `@ViewChild`) auf einen Input zugegriffen, muss der Wert jetzt als Funktion gelesen werden:

```typescript
// Bisher
const label = this.input.luxLabel;

// Neu
const label = this.input.luxLabel();
```

Inputs können nicht mehr per Zuweisung aus dem TypeScript-Code gesetzt werden. Die Werte bitte über das Template binden.

Wer einen Output programmatisch per `subscribe()` abonniert, erhält jetzt ein `OutputRefSubscription` (aus `@angular/core`) statt einer RxJS-`Subscription`.

##### OnPush-Change-Detection

Alle Komponenten verwenden jetzt `ChangeDetectionStrategy.OnPush`. Objekte und Arrays, die an einen Input gebunden sind, sollten deshalb nicht mehr direkt verändert werden (z.B. `this.options.push(...)` oder `this.config.label = ...`), da sich die Anzeige sonst ggf. nicht aktualisiert. Stattdessen immer eine neue Referenz zuweisen:

```typescript
// Bisher
this.options.push(newOption);

// Neu
this.options = [...this.options, newOption];
```

##### Formulare und Signal Forms

Die Form-Komponenten unterstützen jetzt [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (`[formField]`) sowie das Two-Way-Binding über `[(value)]` bzw. bei Checkbox und Toggle über `[(checked)]`.
Die bisherigen Bindungen (`luxControlBinding`, `[(luxValue)]`, `[(luxChecked)]` und `[(luxSelected)]`) funktionieren weiterhin, sind aber als veraltet markiert und entfallen mit der nächsten Major-Version.

Code, der eine Form-Komponente auf die Basisklasse `LuxFormComponentBase` typisiert, muss angepasst werden, da die Form-Komponenten nicht mehr von dieser Klasse erben.

##### Datums- und Zeitwerte ohne Zeitzone

`lux-datepicker` und `lux-timepicker` speichern ihre Werte jetzt ohne Zeitzone. Bisher waren es UTC-Zeitpunkte.
Ein Tag oder eine Uhrzeit ist aber kein Zeitpunkt. Je nach Zeitzone konnte deshalb ein anderer Tag erscheinen, und an den Tagen der Zeitumstellung gab es Fehler.

| Verwendung                                     | Bis Version 21               | Ab Version 22        |
| ---------------------------------------------- | ---------------------------- | -------------------- |
| `lux-datepicker`                               | `"2029-05-26T00:00:00.000Z"` | `"2029-05-26"`       |
| `lux-timepicker`                               | `"1970-01-01T14:30:00.000Z"` | `"14:30"`            |
| Datepicker und Timepicker mit gemeinsamem Wert | `"2029-05-26T14:30:00.000Z"` | `"2029-05-26T14:30"` |

Die neuen Formate entsprechen Java `LocalDate`, `LocalTime` und `LocalDateTime` bzw. .NET `DateOnly` und `TimeOnly`.
Beim Einlesen sind Sekunden `:00` erlaubt (`"14:30:00"`), weil Java und .NET Uhrzeiten mit Sekunden ausgeben. Der Datepicker nimmt außerdem Mitternacht ohne Zeitzone an (`"2029-05-26T00:00:00"`).

Werte in einem anderen Format, auch im Format von Version 21, lehnen die Komponenten mit einem Validierungsfehler ab. Im Dev-Modus erscheint zusätzlich eine Warnung in der Konsole.

Für die Umstellung gibt es zwei Wege.

###### Weg 1 (empfohlen): Backend umstellen

Das Backend liefert und erwartet die neuen Formate. Java mit Jackson (bei Spring Boot ohne weitere Einstellungen):

```java
public class TerminDto {
  private LocalDate datum;
  private LocalTime beginn;
  private LocalDateTime erinnerung;
}
```

.NET mit System.Text.Json:

```csharp
public class TerminDto
{
    public DateOnly? Datum { get; set; }
    public TimeOnly? Beginn { get; set; }
}
```

Statt `LocalDate` & Co. kann das Backend auch einfache Strings verwenden, z.B. wenn es die Werte nur speichert und durchreicht. Entscheidend ist nur das Format im JSON.
Die Datumstypen sind trotzdem die bessere Wahl, weil das Backend ungültige Werte (z.B. `"2029-02-30"`) dann selbst ablehnt und mit den Werten rechnen kann.

Jackson und System.Text.Json lesen Uhrzeiten auch ohne Sekunden (`"14:30"`). Ein OpenAPI-Validator mit `format: time` kann `"14:30"` dagegen ablehnen, weil RFC 3339 Sekunden verlangt.
Welcher Typ zu welcher Komponente passt und warum Werte wie `LocalDateTime.now()` vorher auf Minuten gekürzt werden müssen, steht beim [LUX-Timepicker](lux‐timepicker-v22#zusatzinformationen).

Bestehende Daten werden so umgerechnet:

- Datumswerte, die LUX gespeichert hat (`...T00:00:00.000Z`): der UTC-Tag.
- Werte von Timepicker und Datetimepicker: die UTC-Werte, weil diese Komponenten die UTC-Uhrzeit angezeigt haben.
- Lokale Mitternacht, die die Anwendung selbst erzeugt hat (z.B. `...T22:00:00.000Z`): der Tag in `Europe/Berlin`.
- Datumswerte, die zwischen 21.5.0 und 21.8.0 gespeichert wurden, auf einen Versatz von einem Tag prüfen (siehe [Version 21.5.0](update-guide-v21#version-2150)).

###### Weg 2: Im Frontend umrechnen

Kann das Backend nicht sofort umgestellt werden, rechnet die Anwendung beim Laden und Speichern um. Dafür gibt es in `LuxUtil` Funktionen für beide Richtungen (siehe [Util](util-v22#datums--und-zeitwerte-ohne-zeitzone)):

```ts
export class TerminService {
  private readonly http = inject(HttpClient);

  loadTermin(id: string): Observable<TerminDto> {
    return this.http.get<TerminDto>(`/api/termine/${id}`).pipe(
      map((termin) => ({
        ...termin,
        datum: LuxUtil.fromV21Date(termin.datum),
        beginn: LuxUtil.fromV21Time(termin.beginn)
      }))
    );
  }

  saveTermin(id: string, termin: TerminDto): Observable<void> {
    return this.http.put<void>(`/api/termine/${id}`, {
      ...termin,
      datum: LuxUtil.toV21Date(termin.datum),
      beginn: LuxUtil.toV21Time(termin.beginn)
    });
  }
}
```

Die Funktionen nehmen nur genau das Format von Version 21 an. Einen Wert, der nicht passt, geben sie unverändert zurück. Die Komponente zeigt ihn dann als Fehler an, und im Dev-Modus warnt die Konsole. So fällt ein vergessenes Feld oder ein falsch gespeicherter Wert sofort auf.
Bei Uhrzeiten ignoriert `fromV21Time()` den Datumsteil, und `toV21Time()` gibt immer `1970-01-01` aus. Der Timepicker hat den Datumsteil bisher erhalten.

###### Was Version 21.9.0 noch angenommen hat und Version 22 ablehnt

| Wert                                                | Beispiel                                                               | Ersatz                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------- |
| Format von Version 21                               | `"2029-05-26T00:00:00.000Z"`, `"1970-01-01T14:30:00.000Z"`             | Weg 1 oder 2                                      |
| Datum mit einer Uhrzeit ungleich 00:00 (Datepicker) | `"2027-03-13T23:30:00"`                                                | reines Datum `"2027-03-13"`                       |
| Lokale Mitternacht                                  | `"2027-03-12T23:00:00.000Z"` aus `new Date(2027, 2, 13).toISOString()` | reines Datum `"2027-03-13"`                       |
| Zeitpunkt mit Uhrzeit (Datepicker)                  | `"2020-05-28T14:15:00.000Z"`                                           | reines Datum `"2020-05-28"`                       |
| ISO-String mit Offset                               | `"2027-03-13T10:00:00+01:00"`                                          | reines Datum `"2027-03-13"`                       |
| Date-Objekt                                         | `new Date(2027, 2, 13)`                                                | `LuxUtil.toLocalDate(date)`                       |
| Date-Objekt (Timepicker)                            | `new Date(2027, 2, 13, 14, 30)`                                        | `LuxUtil.toLocalTime(date)`                       |
| Uhrzeit mit Sekunden ungleich 00                    | `"14:30:15"`                                                           | `"14:30"`                                         |
| Uhrzeit mit einstelliger Stunde                     | `"8:30"`                                                               | `"08:30"`                                         |

###### Datetimepicker entfällt

`lux-datetimepicker` (auch `lux-datetimepicker-ac`) entfällt. Für Datum und Uhrzeit gibt es zwei Wege mit `lux-datepicker` und `lux-timepicker` (siehe [LUX-Timepicker](lux‐timepicker-v22#5-datum-und-uhrzeit)):

- **Getrennte Werte:** Datepicker und Timepicker haben jeweils ein eigenes Feld (`"2029-05-26"` und `"14:30"`). Zusammengeführt wird bei Bedarf mit `LuxUtil.combineDateTime()`. Dieser Weg ist nötig, wenn erkennbar sein muss, ob eine Uhrzeit gewählt wurde.
- **Gemeinsamer Wert:** Beide teilen sich ein Feld mit `"2029-05-26T14:30"` und werden über `luxReferenceControl` verknüpft. Das entspricht dem bisherigen Wert des Datetimepickers. Werte im Format von Version 21 (`"2029-05-26T14:30:00.000Z"`) rechnet `LuxUtil.fromV21DateTime()` um.

```html
<lux-datepicker luxLabel="Datum" [formField]="terminForm.termin" [luxReferenceControl]="timepicker" #datepicker />
<lux-timepicker luxLabel="Uhrzeit" [formField]="terminForm.termin" [luxReferenceControl]="datepicker" #timepicker />
```

Der gemeinsame Wert ist eine lokale Zeit und kein Zeitpunkt. Datepicker und Timepicker nehmen bewusst keine Zeitpunkte an:
`"2029-05-26T12:30:00Z"` ist das Format von Version 21 und meinte dort meist die angezeigte Uhrzeit (12:30). Als Zeitpunkt gelesen, würden bestehende Anwendungen ohne jeden Fehler eine um ein bis zwei Stunden verschobene Uhrzeit anzeigen.
Außerdem kennt nur die Anwendung die gemeinte Zeitzone und weiß, wie sie mit der Zeitumstellung und mit Sekunden umgehen will.
Die Anwendung rechnet deshalb beim Laden und Speichern selbst um.

Braucht das Backend einen echten Zeitpunkt (z.B. Java `Instant` oder `OffsetDateTime`), rechnet die Anwendung mit der Zeitzone des Nutzers um:

```ts
// In Deutschland ergibt "2029-05-26T14:30" den Zeitpunkt "2029-05-26T12:30:00.000Z"
const zeitpunkt = new Date(termin).toISOString();
```

Dafür eignet sich `LuxUtil.toV21DateTime()` nicht. Die Funktion übernimmt die Uhrzeit unverändert (`"2029-05-26T14:30:00.000Z"`), weil sie das Format von Version 21 erzeugt.

Umgekehrt rechnet die Anwendung einen Zeitpunkt aus dem Backend vor der Anzeige in die Zeitzone des Nutzers um:

```ts
// In Deutschland ergibt "2029-05-26T12:30:00Z" den Wert "2029-05-26T14:30"
const termin = LuxUtil.toLocalDateTime(new Date(zeitpunkt));
```

Dafür eignet sich `LuxUtil.fromV21DateTime()` nicht. Die Funktion übernimmt die UTC-Uhrzeit unverändert (`"2029-05-26T12:30"`), weil sie das Format von Version 21 liest.
Ein vollständiges Beispiel und Hinweise zu Sekunden, Zeitumstellung und einer festen Zeitzone stehen beim [LUX-Timepicker](lux‐timepicker-v22#7-zeitpunkte-aus-dem-backend).

`luxMinDate` und `luxMaxDate` des Datetimepickers konnten auch eine Uhrzeit enthalten (`"02.02.2000, 14:30"`). Das gibt es bei `lux-datepicker` und `lux-timepicker` nicht mehr: `luxMinDate` und `luxMaxDate` prüfen nur den Tag, `luxMinTime` und `luxMaxTime` nur die Uhrzeit, und zwar an jedem Tag. Eine Grenze wie "nicht vor dem 26.05.2029, 14:30" setzt die Anwendung selbst um, entweder mit einer Uhrzeit-Grenze abhängig vom gewählten Tag oder mit einem eigenen Validator (siehe [LUX-Timepicker](lux‐timepicker-v22#6-grenzen-aus-datum-und-uhrzeit)).

###### Geänderte und entfallene API

| Bisher                                                                                                                               | Ab Version 22                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `luxMinDate`, `luxMaxDate`, `luxStartDate` als ISO-String oder `dd.MM.yyyy`                                                          | nur `"yyyy-MM-dd"`                                                                                                                   |
| `luxMinTime`, `luxMaxTime` auch als ISO-String oder mit einstelliger Stunde (`8:00`)                                                 | nur `"HH:mm"` mit zweistelliger Stunde (`"08:00"`)                                                                                   |
| `luxCustomFilter` bzw. `LuxDateFilterFn` mit `(date: Date \| null) => boolean`                                                       | `(date: string) => boolean`, Wochentag über `LuxUtil.getDayOfWeek(date)`                                                             |
| Texteingabe in allen Formaten unabhängig von der Sprache (`25/09/2026` wurde als MM/dd gelesen), zweistellige Jahre                  | Reihenfolge nach der aktiven Sprache, Jahr vierstellig                                                                               |
| Fehlerdaten von `matDatepickerMin`/`-Max` und `matTimepickerMin`/`-Max` mit `Date`-Objekten                                          | Strings, z.B. `{ min: '2029-05-01', actual: '2029-04-30' }`                                                                          |
| `LuxReferenceControl` mit `lastValue` und `formControl`, `lastValue` an Datepicker und Timepicker                                    | `LuxReferenceControl` mit `luxReferenceControl` und `luxDefaultTime`, `lastValue` entfällt                                           |
| `updateOn: 'blur'` beim gemeinsamen Wert von Datepicker und Timepicker                                                               | nicht mehr nötig                                                                                                                     |
| `LuxTimepickerComponent.onTimeOptionSelected()`                                                                                      | entfällt, eine Auswahl läuft über `(valueChange)`                                                                                    |
| `LuxDatepickerAdapter` (`LuxDatepickerAcAdapter`), `LuxTimepickerAdapter`, `LuxDatetimepickerAdapter` (`LuxDateTimePickerAcAdapter`) | nicht mehr exportiert                                                                                                                |
| `LuxUtil.parseISO8601AsUTC()`, `LuxUtil.isISO8601WithoutTimezone()`, `LuxUtil.ISO_8601_FULL`                                         | entfallen, für Werte ohne Zeitzone gibt es `LuxUtil.isLocalDate()` usw. (siehe [Util](util-v22#datums--und-zeitwerte-ohne-zeitzone)) |
| `LuxUtil.newDateWithoutTime()`                                                                                                       | `LuxUtil.todayAsLocalDate()` bzw. `LuxUtil.toLocalDate(date)`                                                                        |
| Übersetzungen `luxc.datetimepicker.*`                                                                                                | entfallen                                                                                                                            |

`luxMinDate`, `luxMaxDate`, `luxMinTime` und `luxMaxTime` in einem anderen Format werden ignoriert, die Grenze gilt dann nicht. Das fällt nur im Dev-Modus über eine Warnung in der Konsole auf, deshalb sollten diese Werte beim Update geprüft werden.

Neu sind die Signal-Forms-Validatoren `luxDateValue()`, `luxTimeValue()` und `luxDateTimeValue()`. Sie prüfen Format und Grenzen auch im Signal Form, denn einen Wert im falschen Format oder außerhalb der Grenzen können die Komponenten dort nicht selbst ungültig machen. Eine ungültige Texteingabe melden sie dagegen selbst an das Feld.

##### Dialog-Aktionen

`lux-dialog-actions` ist jetzt ein Flex-Container, der die Schaltflächen zentriert, umbricht und per `gap` einen Abstand von 16px zwischen ihnen setzt. Eigene Margins zwischen den Schaltflächen (z.B. `class="lux-mr-4"`) bitte entfernen, sonst verdoppelt sich der Abstand. Eigene Klassen am Element (z.B. `lux-gap-2`) haben weiterhin Vorrang.
Mit der neuen Klasse `lux-dialog-actions-stacked` stehen die Schaltflächen auf kleinen Bildschirmen untereinander und nutzen die volle Breite (siehe [lux-dialog](lux‐dialog-v22)).

#### Update

1. Node 24 installieren.

1. `npm install -g @angular/cli@22`

1. Die Datei _package-lock.json_ löschen.

1. Die Abhängigkeit _ngx-cookie-service_ in der _package.json_ auf die Version _^22.0.0_ setzen, aber **ohne** ein `npm install` auszuführen.

1. `ng update @angular/cli@22 @angular/core@22 @angular/material@22 angular-eslint@22 --force --allow-dirty`

   Bei fehlenden NPM-Paketen siehe [hier](#fehlende-pakete-bei-npm-install).

1. `npm install @ihk-gfi/lux-components-update@22 --save-dev --force`

   Die _NPM_-Warnungen in der Console können ignoriert werden.

1. `ng g @ihk-gfi/lux-components-update:update-22.0.0`

1. Die Datei _package-lock.json_ und den Ordner _node_modules_ löschen.

1. `npm install`

   Bei fehlenden NPM-Paketen siehe [hier](#fehlende-pakete-bei-npm-install).

1. Die [Breaking Changes](#breaking-changes) im eigenen Code umsetzen.

1. Fertig!

#### Nach dem Update

- Falls es eigene Abhängigkeiten im Projekt gibt, die nicht über den LUX-Components-Updater aktualisiert wurden, sollten diese jetzt ebenfalls aktualisiert werden.
- Einen Smoketest (build, lint und test) ausführen:

  `npm run smoketest`

- Anwendung vollständig testen.
- Fertig!

#### Troubleshooting

- Bei fehlenden NPM-Paketen siehe [hier](#fehlende-pakete-bei-npm-install).
- Wenn sich die Anzeige einer LUX-Komponente nach einer Änderung nicht aktualisiert, wurde vermutlich ein gebundenes Objekt oder Array direkt verändert (siehe [OnPush-Change-Detection](#onpush-change-detection)).

#### Ergänzung für JAST-Projekte

- Falls eine neue Node-Version installiert wurde, muss diese auch in die zentralen Builds eingetragen werden.<br>
  Das heißt, in der _pipeline.yaml_ muss z.B. auf _node:24-alpine_, _node-java-alpine:node24-java21_ und _node-chromium:node-24_ umgestellt werden.

#### Weiterführende Verweise bei Interesse oder Problemen

- [Angular Update Guide von v21 nach v22](https://angular.dev/update-guide?v=21.0-22.0&l=3)
- [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview)

#### Fehlende Pakete bei "npm install"

Am Ende führen die Angular-Updateskripte ("ng update") automatisch ein "npm install" aus. Sollte dabei der Fehler auftreten, dass ein Paket nicht gefunden wird, sind folgende Schritte notwendig:

`npm cache clean --force`

`npm install`

Jetzt kann man mit dem Update fortfahren.

**Hinweis**: _Wenn beispielsweise ein Nexus verwendet wird, kann es vorkommen, dass beim ersten Versuch gemeldet wird, das Paket sei nicht gefunden worden. Im Hintergrund wird das Paket jedoch in den Nexus geladen. Leider speichert der lokale NPM-Cache diese erste (negative) Antwort für etwa 24 Stunden zwischen, sodass weitere Anfragen ebenfalls fehlschlagen. Deshalb ist es wichtig, in diesem Fall den lokalen NPM-Cache zu leeren._
