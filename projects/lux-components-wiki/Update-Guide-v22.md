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
        - [Neue Inputs statt automatischer Listener-Erkennung](#neue-inputs-statt-automatischer-listener-erkennung)
        - [Formulare und Signal Forms](#formulare-und-signal-forms)
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
- `lux-datetimepicker`
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

##### Neue Inputs statt automatischer Listener-Erkennung

Bisher haben einige Komponenten automatisch erkannt, ob auf ein Event reagiert wird, und sich entsprechend dargestellt. Mit den neuen Outputs ist das nicht mehr möglich. Stattdessen gibt es jetzt explizite Inputs:

| Komponente      | Event                                        | Neuer Input                 | Default | Hinweis                                                                          |
| --------------- | -------------------------------------------- | --------------------------- | ------- | -------------------------------------------------------------------------------- |
| lux-card        | luxClicked                                   | luxClickable                | false   | Steuert Mauszeiger und Tabindex.                                                 |
| lux-app-header  | luxClicked                                   | luxClickable                | false   | Steuert Mauszeiger, Rolle und Tabindex von App-Titel, App-Icon und App-Image.    |
| lux-image       | luxClicked                                   | luxClickable                | false   | **luxClicked wird nur noch ausgelöst, wenn luxClickable auf true gesetzt ist.**  |
| lux-table       | luxSelectedChange / luxSelectedAsArrayChange | luxShowSelectedChangeCursor | false   | Steuert den Mauszeiger bei Tabellen ohne Multiselect.                            |
| lux-table       | luxSingleClicked                             | luxShowSingleClickedCursor  | false   | Steuert den Mauszeiger bei Tabellen ohne Multiselect.                            |
| lux-table       | luxDoubleClicked                             | luxShowDoubleClickedCursor  | false   | Steuert den Mauszeiger und **deaktiviert die Selektion der Zeilen**.             |
| lux-filter-form | luxOnSave                                    | luxShowSaveAction           | true    | Die Aktion wird jetzt immer angezeigt. Zum Ausblenden explizit auf false setzen. |
| lux-filter-form | luxOnLoad                                    | luxShowLoadAction           | true    | Die Aktion wird jetzt immer angezeigt. Zum Ausblenden explizit auf false setzen. |

Beispiel:

```html
<lux-card luxTitle="Titel" [luxClickable]="true" (luxClicked)="onClick()" />
```

##### Formulare und Signal Forms

Die Form-Komponenten unterstützen jetzt [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (`[formField]`) sowie das Two-Way-Binding über `[(value)]` bzw. bei Checkbox und Toggle über `[(checked)]`.
Die bisherigen Bindungen (`luxControlBinding`, `[(luxValue)]`, `[(luxChecked)]` und `[(luxSelected)]`) funktionieren weiterhin, sind aber als veraltet markiert und entfallen mit der nächsten Major-Version.

Code, der eine Form-Komponente auf die Basisklasse `LuxFormComponentBase` typisiert, muss angepasst werden, da die Form-Komponenten nicht mehr von dieser Klasse erben.

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
- Wenn `luxClicked` bei `lux-image` nicht mehr ausgelöst wird, fehlt `[luxClickable]="true"` (siehe [Neue Inputs statt automatischer Listener-Erkennung](#neue-inputs-statt-automatischer-listener-erkennung)).

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
