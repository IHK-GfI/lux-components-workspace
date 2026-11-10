# LUX-Min-Max-Input

- [LUX-Min-Max-Input](#lux-min-max-input)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
    - [ControlValueAccessor](#controlvalueaccessor)
  - [Verhalten](#verhalten)
    - [Prüfung beim Verlassen eines Feldes](#prüfung-beim-verlassen-eines-feldes)
    - [Meldungen](#meldungen)
    - [Grenzen gesamt und je Seite](#grenzen-gesamt-und-je-seite)
    - [Vorbegrenzung durch das Nachbarfeld](#vorbegrenzung-durch-das-nachbarfeld)
    - [Wertabhängige Grenzen](#wertabhängige-grenzen)
    - [Zahlformat](#zahlformat)
  - [Barrierefreiheit](#barrierefreiheit)
  - [Beispiele](#beispiele)
    - [1. Zahl mit Einheit und unterer Grenze](#1-zahl-mit-einheit-und-unterer-grenze)
    - [2. Zeitraum, Bis höchstens 7 Tage nach Von](#2-zeitraum-bis-höchstens-7-tage-nach-von)
    - [3. In einem Reactive Form](#3-in-einem-reactive-form)

## Overview / API

### Allgemein

| Name     | Beschreibung                              |
| -------- | ----------------------------------------- |
| selector | lux-min-max-input                         |
| import   | @ihk-gfi/lux-components/lux-min-max-input |

`lux-min-max-input` ist eine Bereichseingabe "Von / Bis" mit zwei Feldern nebeneinander, auf schmalen Viewports untereinander. Je nach `luxType` sind es zwei Zahlenfelder (`lux-input-ac` mit `luxType="number"`) oder zwei Datepicker (`lux-datepicker-ac`). Die Komponente kümmert sich nur um die Bereichslogik:

- Ein leeres Feld bedeutet "keine Begrenzung" (im Wert fehlt der Schlüssel, nie `0` oder `''`).
- Von darf nicht größer als Bis sein.
- Grenzen gelten für beide Felder (`luxBounds`) oder zusätzlich je Seite (`luxMinFieldBounds`, `luxMaxFieldBounds`).
- Eine gemeinsame Meldung unter beiden Feldern nennt das Feld und den verletzten Grenzwert.
- Geprüft wird erst beim Verlassen eines Feldes, nicht beim Tippen.

Der Wert ist ein Objekt `{ min?: T; max?: T }`. Bei `luxType="number"` ist `T` eine Zahl, bei `luxType="date"` ein ISO-String (Kalendertag als UTC-Mitternacht, wie bei `lux-datepicker-ac`). Er ändert sich nur, wenn der Bereich gültig ist.

```typescript
export type LuxMinMaxType = 'number' | 'date';

export interface LuxMinMaxValue<T extends number | string = number> {
  min?: T;
  max?: T;
}

export type LuxMinMaxBounds<T extends number | string = number> = LuxMinMaxValue<T>;
```

### Inputs

| Name              | Typ                                | Default     | Beschreibung                                                                                                                                                                           |
| ----------------- | ---------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxType           | LuxMinMaxType                      | `'number'`  | Feldtyp beider Seiten: `'number'` (Zahlenfeld) oder `'date'` (Datepicker). Ein Wechsel zur Laufzeit leert Felder und Wert.                                                             |
| luxValue          | LuxMinMaxValue\<number \| string>  | `{}`        | Aktueller Bereich. `model`, also auch als `[(luxValue)]` nutzbar. Ändert sich nur bei gültigem Bereich. Ein von außen gesetzter Wert wird angezeigt, ohne `luxValueChange` auszulösen. |
| luxLabel          | string                             | `''`        | Sichtbare Legende der Gruppe (`fieldset`/`legend`). Ohne Angabe bleibt die Legende nur für Screenreader erhalten ("Wertebereich").                                                     |
| luxMinLabel       | string                             | `''`        | Label des Von-Felds. Standard ist die Übersetzung "Von".                                                                                                                               |
| luxMaxLabel       | string                             | `''`        | Label des Bis-Felds. Standard ist die Übersetzung "Bis".                                                                                                                               |
| luxUnit           | string                             | `''`        | Einheit als Suffix beider Zahlenfelder, z. B. `'kg'`. Bei `luxType="date"` ohne Wirkung.                                                                                               |
| luxBounds         | LuxMinMaxBounds\<number \| string> | `{}`        | Zulässiger Bereich für beide Felder. Werte außerhalb erzeugen eine Meldung, die den Bereich nennt, und werden nicht in den Wert übernommen.                                            |
| luxMinFieldBounds | LuxMinMaxBounds\<number \| string> | `undefined` | Zusätzliche Grenzen des Von-Felds. Je Seite gewinnt die engere Grenze (Schnittmenge mit `luxBounds`), siehe [Grenzen gesamt und je Seite](#grenzen-gesamt-und-je-seite).               |
| luxMaxFieldBounds | LuxMinMaxBounds\<number \| string> | `undefined` | Zusätzliche Grenzen des Bis-Felds, analog zu `luxMinFieldBounds`.                                                                                                                      |
| luxStep           | number                             | `1`         | Schrittweite der Zahlenfelder für Pfeiltasten und Spinner. Bei `luxType="date"` ohne Wirkung.                                                                                          |
| luxDisabled       | boolean                            | `false`     | Deaktiviert beide Felder. `model`, also auch als `[(luxDisabled)]` nutzbar. In Reactive Forms wird der Zustand mit `formControl.disable()`/`enable()` synchronisiert.                  |
| luxTagId          | string \| undefined                | `undefined` | Präfix für die Tag-Ids der beiden Felder (`luxTagIdHandler`). Die Felder erhalten die Suffixe `-min` und `-max`.                                                                       |
| luxId             | string \| undefined                | `undefined` | Präfix für die DOM-Ids. Ohne Angabe wird je Instanz eine eigene Id erzeugt. Die gemeinsame Meldung hat die Id `<luxId>-message`.                                                       |

### Outputs

| Name              | Typ                                                  | Beschreibung                                                                                                                  |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| luxValueChange    | OutputEmitterRef\<LuxMinMaxValue\<number \| string>> | Emittiert den neuen Bereich, sobald beide Felder gültig sind und sich der Bereich geändert hat. Gegenstück zu `[(luxValue)]`. |
| luxDisabledChange | OutputEmitterRef\<boolean>                           | Emittiert, wenn sich der Disabled-Zustand ändert, z. B. durch `formControl.disable()`. Gegenstück zu `[(luxDisabled)]`.       |

### ControlValueAccessor

`lux-min-max-input` implementiert `ControlValueAccessor` und funktioniert mit `formControlName`, `[formControl]` und `[(ngModel)]`. Der Formwert ist ein `LuxMinMaxValue`.

- Das FormControl erhält nur gültige Bereiche. Solange ein Feld einen Bereichs- oder Grenzfehler hat, behält das Control seinen letzten gültigen Wert.
- Ein von außen gesetzter Wert (`setValue()`, `patchValue()`) wird angezeigt, ohne das Control als "dirty" zu markieren. Eine stehende Meldung wird dabei gelöscht.
- Das Control gilt als "touched", sobald eines der beiden Felder verlassen wurde.
- Die Fehlerdarstellung übernimmt die Komponente selbst (gemeinsame Meldung). Eigene Validatoren am FormControl prüfen nur den übernommenen Bereich und zeigen keine Meldung in der Komponente an.

## Verhalten

### Prüfung beim Verlassen eines Feldes

Die Komponente prüft ein Feld erst, wenn es den Fokus verliert. Dadurch stören Zwischenzustände beim Tippen nicht (etwa "1" auf dem Weg zu "150"). Es gilt:

- Nur das zuletzt verlassene Feld wird geprüft und bei einem Fehler markiert (roter Rahmen, `aria-invalid="true"`). Das andere Feld wird nie markiert.
- Beim Tippen kann eine Meldung nur verschwinden, nie entstehen: Wird das markierte Feld geändert, ist die Prüfung bis zum nächsten Verlassen aufgehoben. Wird das Nachbarfeld so geändert, dass das Paar gültig wird, verschwindet die Meldung ebenfalls.
- Verlässt man ein fehlerfreies Feld, bleibt eine noch gültige Meldung des anderen Feldes stehen.
- Ein ungültiger Bereich wird nie in `luxValue` übernommen. Die Eingabe im Feld bleibt stehen, damit sie korrigiert werden kann.

### Meldungen

Die Meldung erscheint unter beiden Feldern und nennt das Feldlabel und den verletzten Grenzwert. Zahlen und Daten werden in der aktiven Sprache formatiert.

| Fall                                      | Meldung (deutsch)                       |
| ----------------------------------------- | --------------------------------------- |
| Von verlassen, Von größer als Bis         | Von darf nicht größer als 100 sein.     |
| Bis verlassen, Bis kleiner als Von        | Bis darf nicht kleiner als 200 sein.    |
| Wert außerhalb, nur untere Grenze gesetzt | Von: Der Wert muss mindestens 0 sein.   |
| Wert außerhalb, nur obere Grenze gesetzt  | Bis: Der Wert darf höchstens 100 sein.  |
| Wert außerhalb, beide Grenzen gesetzt     | Von: Zulässig sind Werte von 0 bis 100. |
| Datum nicht lesbar (`luxType="date"`)     | Von: Bitte ein gültiges Datum eingeben. |

Die Texte liegen unter den Schlüsseln `luxc.min-max-input.*` und lassen sich wie alle LUX-Texte über Transloco überschreiben.

### Grenzen gesamt und je Seite

`luxBounds` gilt für beide Felder. `luxMinFieldBounds` und `luxMaxFieldBounds` ergänzen je Seite weitere Grenzen. Die wirksame Grenze eines Feldes ist die Schnittmenge: je Seite gewinnt die engere Grenze.

Beispiel: `luxBounds = { min: 0, max: 100 }` und `luxMaxFieldBounds = { max: 150 }` ergeben für das Bis-Feld den Bereich 0 bis 100, weil 100 die engere obere Grenze ist. Mit `luxMaxFieldBounds = { min: 10, max: 20 }` wäre der Bereich 10 bis 20.

Ist die Schnittmenge leer (untere Grenze größer als obere), ist jeder Wert in diesem Feld ungültig.

### Vorbegrenzung durch das Nachbarfeld

Zusätzlich zur Prüfung ist jedes Feld durch den gültigen Wert des Nachbarfelds vorbegrenzt: Das Zahlenfeld erhält die Attribute `min` und `max` (wirkt auf Pfeiltasten und Spinner), der Kalender des Datepickers lässt nur Tage im zulässigen Bereich zu. Wird das Nachbarfeld geleert, entfällt die Sperre wieder. Grundlage ist immer `luxValue`, also nur übernommene gültige Werte, nicht der Tipp-Zustand.

Hinweis zu Datumsfeldern: Der Datepicker prüft seine Kalendergrenzen schon beim Tippen. Ein Datum außerhalb der Vorbegrenzung kann deshalb bereits vor dem Verlassen als ungültig markiert sein. Die gemeinsame Meldung erscheint trotzdem erst beim Verlassen.

### Wertabhängige Grenzen

Hängt eine Grenze vom Wert der anderen Seite ab (etwa "Bis höchstens 7 Tage nach Von"), rechnet die Anwendung die Grenze aus `luxValue` und übergibt sie als `luxMaxFieldBounds` bzw. `luxMinFieldBounds`, siehe [Beispiel 2](#2-zeitraum-bis-höchstens-7-tage-nach-von). Ein bereits übernommener Bereich kann durch eine neue Grenze nachträglich ungültig werden; in dem Fall setzt die Anwendung die betroffene Seite selbst zurück.

### Zahlformat

Die Zahlenfelder sind native Zahlenfelder (`<input type="number">`). Sie zeigen keine Tausendertrennzeichen, das Dezimaltrennzeichen richtet sich nach dem Browser. Die Werte in den Meldungen werden dagegen in der aktiven Sprache formatiert (z. B. "1.000,5").

## Barrierefreiheit

- Beide Felder liegen in einem `fieldset` mit `legend`. Ohne `luxLabel` ist die Legende nur für Screenreader vorhanden ("Wertebereich").
- Jedes Feld hat ein eigenes Label (Standard "Von" und "Bis"), die Tab-Reihenfolge ist Von, dann Bis.
- Die gemeinsame Meldung ist eine Live-Region (`role="status"`, `aria-live="polite"`) und über `aria-describedby` mit beiden Feldern verknüpft. Screenreader lesen sie beim Erscheinen und beim Fokussieren eines Feldes vor.
- Das geprüfte Feld mit Fehler trägt `aria-invalid="true"`.
- Farben und Kontraste kommen aus dem Theme (Fehlerfarbe und Disabled-Zustand wie bei den übrigen Formularfeldern).

## Beispiele

### 1. Zahl mit Einheit und unterer Grenze

Html

```html
<lux-min-max-input luxLabel="Mitarbeitende" luxUnit="Personen" [luxBounds]="{ min: 0 }" [(luxValue)]="mitarbeitende"></lux-min-max-input>
```

Ts

```typescript
mitarbeitende = signal<LuxMinMaxValue>({});
```

### 2. Zeitraum, Bis höchstens 7 Tage nach Von

Html

```html
<lux-min-max-input
  luxType="date"
  luxLabel="Zeitraum"
  [luxBounds]="{ min: '2026-01-01T00:00:00.000Z', max: '2026-12-31T00:00:00.000Z' }"
  [luxMaxFieldBounds]="bisGrenzen()"
  [(luxValue)]="zeitraum"
></lux-min-max-input>
```

Ts

```typescript
zeitraum = signal<LuxMinMaxValue<string>>({});

// Bis liegt höchstens 7 Tage nach Von; ohne Von gilt nur luxBounds.
bisGrenzen = computed<LuxMinMaxBounds<string> | undefined>(() => {
  const von = this.zeitraum().min;
  return von ? { min: von, max: new Date(Date.parse(von) + 7 * 24 * 60 * 60 * 1000).toISOString() } : undefined;
});
```

### 3. In einem Reactive Form

Html

```html
<form [formGroup]="form">
  <lux-min-max-input formControlName="preis" luxLabel="Preis" luxUnit="€" [luxBounds]="{ min: 0 }" [luxStep]="0.5"></lux-min-max-input>
</form>
```

Ts

```typescript
form = new FormGroup({
  preis: new FormControl<LuxMinMaxValue>({ min: 10, max: 50 }, { nonNullable: true })
});
```
