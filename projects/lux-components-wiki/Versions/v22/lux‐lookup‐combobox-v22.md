# LUX-Lookup-Combobox

![Beispielbild LUX-Lookup-Combobox](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐lookup‐combobox-v22-img.png)

- [LUX-Lookup-Combobox](#lux-lookup-combobox)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Services](#services)
    - [LuxLookupService](#luxlookupservice)
    - [LuxLookupHandlerService](#luxlookuphandlerservice)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxLookupTableEntry](#luxlookuptableentry)
    - [LuxLookupParameters](#luxlookupparameters)
    - [LuxFieldValues](#luxfieldvalues)
    - [LuxBehandlungsOptionenUngueltige](#luxbehandlungsoptionenungueltige)
  - [Beispiele](#beispiele)
    - [1. Signal Forms](#1-signal-forms)
    - [2. Simple Lookup-Combobox](#2-simple-lookup-combobox)
    - [3. Custom Styling](#3-custom-styling)
    - [4. Mit clientseitiger Filterung](#4-mit-clientseitiger-filterung)

## Overview / API

### Allgemein

| Name     | Beschreibung                                |
| -------- | ------------------------------------------- |
| selector | lux-lookup-combobox, lux-lookup-combobox-ac |

### @Input

| Name                         | Typ                                                                                                                                                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMultiple                  | boolean                                                                                                                                              | Ermöglicht die Mehrfachauswahl in der Combobox. Default: false.                                                                                                                                                                                                                                                                                                     |
| luxEntryBlockSize            | number                                                                                                                                               | Bestimmt, wie viele Elemente in der Selection-Box auf einmal angezeigt werden, für weitere Elemente kann der Anwender in dem Fenster herunterscrollen. Default: 25.                                                                                                                                                                                                 |
| luxVisibleOptionCount        | number                                                                                                                                               | Begrenzt die Anzahl der gleichzeitig sichtbaren Optionen im geöffneten Panel. Werte `<= 0`, `null` oder `undefined` deaktivieren das Override und verwenden die Standardhöhe. Hat keinen Einfluss auf das blockweise Nachladen über `luxEntryBlockSize`.                                                                                                            |
| luxEnableFilter              | boolean                                                                                                                                              | Aktiviert ein Suchfeld im Dropdown-Panel. Die Filterung erfolgt rein clientseitig auf Basis der aktuell geladenen Lookup-Eintraege. Standardwert: `false`.                                                                                                                                                                                                          |
| luxFilterPlaceholder         | string                                                                                                                                               | Platzhalter- und Aria-Label-Text des Filtereingabefeldes im Dropdown-Panel. Standardwert: `Filter`.                                                                                                                                                                                                                                                                 |
| luxFilterValue               | string                                                                                                                                               | Vorbelegter Wert des Filtereingabefeldes. Ein nicht-leerer Wert aktiviert die clientseitige Filterung direkt beim Öffnen. Standardwert: leerer String.                                                                                                                                                                                                              |
| luxFilterClearAriaLabel      | string                                                                                                                                               | Aria-Label der Schaltfläche zum Leeren des Filtereingabefeldes. Standardwert: `Clear filter`.                                                                                                                                                                                                                                                                       |
| luxLookupId                  | string                                                                                                                                               | Enthält die ID, die diese Lookup-Komponente kennzeichnet. Wichtig: Muss definiert sein, da der LuxLookupHandler das Laden der Daten hierüber anstößt. Default: ''.                                                                                                                                                                                                  |
| luxTableNo                   | string                                                                                                                                               | Bestimmt die Schlüsseltabelle, aus welcher die Daten geladen werden sollen (als String, z.B. '1032'). Default: ''.                                                                                                                                                                                                                                                  |
| luxRenderProp                | string \| Function                                                                                                                                   | Enthält die Property, welche für die Darstellung einzelnen Schlüsseltabelleneinträge genutzt wird. Wahlweise kann hier auch eine Funktion mitgegeben werden, welche als Parameter ein Objekt vom Typ LuxLookupTableEntry enthält und einen String als Rückgabewert besitzt.                                                                                         |
| luxRenderPropNoPropertyLabel | string                                                                                                                                               | Dieses Label wird dargestellt, wenn ein Element nicht über das Property aus luxRenderProp (z.B. ableitungsText6) verfügt. Default: '---'.                                                                                                                                                                                                                           |
| luxCompareFn                 | LuxLookupCompareFn <br/><br/> (z.B. luxLookupCompareKeyFn, luxLookupCompareKurzTextFn, luxLookupCompareLangText1Fn oder luxLookupCompareLangText2Fn) | Bestimmt die Sortierreihenfolge der Schlüsseltabelleneinträge. Wenn keine Funktion übergeben wird, werden die Optionen angezeigt, wie sie geladen wurden.                                                                                                                                                                                                           |
| luxBehandlungUngueltige      | LuxBehandlungsOptionenUngueltige                                                                                                                     | Bestimmt wie mit ungültigen Einträgen umgegangen wird. Kann dabei folgende Werte beinhalten: LuxBehandlungsOptionenUngueltige.ausgrauen = Deaktiviert die ungültigen Einträge LuxBehandlungsOptionenUngueltige.ausblenden = Blendet die ungültigen Einträge aus LuxBehandlungsOptionenUngueltige.anzeigen = Zeigt die ungültigen Einträge an. Default: `ausgrauen`. |
| luxParameters                | LuxLookupParameters                                                                                                                                  | Beinhaltet die Parameter, welche für den Request Richtung Lookup-Service verwendet werden. Hier können die anzuzeigenden Felder, zu filternde Keys sowie die Option ob Schlüsselwerte mit führenden Nullen (raw) geholt werden, eingestellt werden.                                                                                                                 |
| luxCustomStyles              | object                                                                                                                                               | Enthält optional ein Objekt, welches Styles für die Darstellung der einzelnen Schlüsseltabelleneinträgen enthält.                                                                                                                                                                                                                                                   |
| luxCustomInvalidStyles       | object                                                                                                                                               | Enthält optional ein Objekt, welches Styles für die Darstellung von invaliden Schlüsseltabelleneinträgen enthält. Voraussetzung dafür ist allerdings, das die Behandlung der ungültigen Einträge auf "anzeigen" gesetzt ist.                                                                                                                                        |
| formField                    | FieldTree\<T\>                                                                                                                                       | Bindet das Element an ein Feld eines [Angular Signal Forms](https://angular.dev/guide/forms/signals/overview) (Direktive `FormField` aus `@angular/forms/signals`). Pflichtfeld, Deaktivierung und Fehler werden aus dem Schema übernommen.                                                                                                                         |
| value                        | LuxLookupTableEntry \| LuxLookupTableEntry[] \| null                                                                                                 | Der Wert des Elements. Two-Way-Binding über `[(value)]`. Innerhalb eines Signal Forms wird stattdessen `[formField]` verwendet.                                                                                                                                                                                                                                     |
| luxValue                     | LuxLookupTableEntry \| LuxLookupTableEntry[] \| null                                                                                                 | **Veraltet**, stattdessen `[(value)]` bzw. `[formField]` verwenden. Beinhaltet den aktuellen Wert der Komponente, es ist ein Two-Way-Binding möglich.                                                                                                                                                                                                               |
| luxRequired                  | boolean                                                                                                                                              | Bestimmt, ob die Component ein Pflichtfeld ist oder nicht. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                                                                                                                             |
| luxControlBinding            | string                                                                                                                                               | **Veraltet**, stattdessen `[formField]` verwenden. Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                     |
| luxErrorMessage              | string                                                                                                                                               | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                                                      |
| luxDisabled                  | boolean                                                                                                                                              | Bestimmt, ob die Component deaktiviert ist oder nicht. Two-Way-Binding über `[(luxDisabled)]` möglich.                                                                                                                                                                                                                                                              |
| luxReadonly                  | boolean                                                                                                                                              | **Veraltet**, stattdessen `[readonly]` bzw. die `readonly()`-Regel im Signal-Forms-Schema verwenden. Bestimmt, ob sich das Feld im reinen Lese-Zustand befindet.                                                                                                                                                                                                    |
| luxErrorCallback             | LuxErrorCallbackFnType                                                                                                                               | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                                          |
| luxControlValidators         | ValidatorFnType                                                                                                                                      | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                                              |
| luxLabel                     | string                                                                                                                                               | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt. Technisch als `model()` umgesetzt; eine Two-Way-Bindung wird nicht benötigt.                                                                                                                         |
| luxHint                      | string                                                                                                                                               | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt.                                                                                                                                                                                                                                                                                             |
| luxHintShowOnlyOnFocus       | boolean                                                                                                                                              | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                                         |
| luxWithEmptyEntry            | boolean                                                                                                                                              | Bestimmt, ob ein zusätzlicher leerer Eintrag in der Auswahl angezeigt wird. Default: true.                                                                                                                                                                                                                                                                          |
| luxLabelLongFormat           | boolean                                                                                                                                              | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                                           |
| luxDense                     | boolean                                                                                                                                              | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                                               |
| luxPlaceholder               | string                                                                                                                                               | Text, der als Platzhalter dargestellt wird, solange kein Wert eingetragen ist.                                                                                                                                                                                                                                                                                      |
| luxTagId                     | string                                                                                                                                               | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                                                                                                                                       |
| luxNoLabels                  | boolean                                                                                                                                              | Kombination aus luxNoTopLabel und luxNoBottomLabel.                                                                                                                                                                                                                                                                                                                 |
| luxNoTopLabel                | boolean                                                                                                                                              | Blendet das obere Label nur visuell aus (der zugängliche Name bleibt erhalten).                                                                                                                                                                                                                                                                                     |
| luxNoBottomLabel             | boolean                                                                                                                                              | Entfernt den unteren Bereich (Hinweis, Fehlermeldung, Zähler).                                                                                                                                                                                                                                                                                                      |
| luxId                        | string                                                                                                                                               | Id des Formularelements. Ohne Angabe wird eine eindeutige Id generiert.                                                                                                                                                                                                                                                                                             |
| luxAriaLabel                 | string                                                                                                                                               | Setzt `aria-label` am Eingabeelement. Nur für Felder ohne sichtbares Label gedacht; ein abweichendes aria-label überschreibt ein sichtbares Label (WCAG 2.5.3).                                                                                                                                                                                                     |
| luxAriaLabelledby            | string                                                                                                                                               | Verweist per `aria-labelledby` auf ein externes Label-Element. Hat Vorrang vor luxAriaLabel und luxLabel.                                                                                                                                                                                                                                                           |
| luxFormGroup                 | FormGroup                                                                                                                                            | **Veraltet**, stattdessen `[formField]` verwenden. FormGroup, in der das luxControlBinding gesucht wird, wenn die Komponente nicht innerhalb von `[formGroup]` steht.                                                                                                                                                                                               |
| luxFormControl               | FormControl                                                                                                                                          | **Veraltet**, stattdessen `[formField]` verwenden. Direkt übergebenes FormControl.                                                                                                                                                                                                                                                                                  |

### @Output

| Name                 | Typ                                                  | Beschreibung                                                                                                                                |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| luxDataLoaded        | boolean                                              | Output, welcher mitteilt wenn Daten geladen wurden (true) oder ein Fehler aufgetreten ist (false).                                          |
| luxDataLoadedAsArray | LuxLookupTableEntry[]                                | Liefert nach dem Laden die geladenen Schlüsseltabelleneinträge als Array.                                                                   |
| luxValueChange       | LuxLookupTableEntry \| LuxLookupTableEntry[] \| null | Gehört zur veralteten `luxValue`-API, stattdessen `(valueChange)` verwenden. Output, der bei neuen Werten der Komponente ein Event ausgibt. |
| luxFocusIn           | FocusEvent                                           | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                    |
| luxFocusOut          | FocusEvent                                           | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.                                   |
| luxDisabledChange    | boolean                                              | Event welches beim Disablen des Elements ausgelöst wird.                                                                                    |
| valueChange          | LuxLookupTableEntry \| LuxLookupTableEntry[] \| null | Wird ausgelöst, wenn sich der Wert ändert (implizit aus dem `value`-Model, Grundlage von `[(value)]`).                                      |
| luxBlur              | FocusEvent                                           | Wird ausgelöst, wenn das Element selbst den Fokus verliert (Kindelemente werden nicht betrachtet).                                          |
| luxFocus             | FocusEvent                                           | Wird ausgelöst, wenn das Element selbst den Fokus erhält (Kindelemente werden nicht betrachtet).                                            |

## Services

### LuxLookupService

Der LuxLookupService dient den LuxLookupComponents dazu, auf die Lookup-Service Instanz der Backend-Seite zuzugreifen.

| Funktion                                                                                                          | Beschreibung                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getLookupTable(tableNo: string, parameters: LuxLookupParameters, url: string): Observable\<LuxLookupTableEntry[]> | Ruft die gleichnamige Schnittstelle des Lookup-Services unter der übergebenen URL auf und gibt die Elemente mit den den Parametern entsprechenden Feldern zurück (gefiltert nach den "keys" aus den Parametern, falls angegeben). |
| generateParameters(parameters: LuxLookupParameters): HttpParams                                                   | Erzeugt aus den LuxLookupParameters die HTTP-Parameter für den Request.                                                                                                                                                           |

### LuxLookupHandlerService

Der LuxLookupHandlerService dient der aufrufenden Komponente dazu, das Laden von Schlüsseltabelleninformationen auszulösen. Die übrigen öffentlichen Methoden des Services werden intern von den Lookup-Komponenten verwendet.

| Funktion                           | Beschreibung                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| reloadData(lookupId: string): void | Triggert das Laden von Schlüsseltabellendaten für eine LookupComponent, vorausgesetzt, die richtige lookupId wird mitgegeben. |

## Classes / Interfaces

### LuxLookupTableEntry

Klasse, die einen einzelnen Eintrag aus einer Schlüsseltabelle kennzeichnet. Der Konstruktor erwartet ein `Partial<LuxLookupTableEntry>` mit mindestens dem `key`.

| Name             | Typ    | Beschreibung                                          |
| ---------------- | ------ | ----------------------------------------------------- |
| key              | string | Der einzigartige Schlüssel dieses einzelnen Eintrags. |
| gueltigkeitBis?  | string | Der Timestamp, bis zu dem dieser Eintrag gültig ist.  |
| gueltigkeitVon?  | string | Der Timestamp, ab dem dieser Eintrag gültig ist.      |
| kurzText?        | string | Der Kurztext dieses Eintrags.                         |
| langText1?       | string | Der erste lange Text dieses Eintrags.                 |
| langText2?       | string | Der zweite lange Text dieses Eintrags.                |
| ableitungsText1? | string | Der 1. Ableitungstext dieses Eintrags.                |
| ableitungsText2? | string | Der 2. Ableitungstext dieses Eintrags.                |
| ableitungsText3? | string | Der 3. Ableitungstext dieses Eintrags.                |
| ableitungsText4? | string | Der 4. Ableitungstext dieses Eintrags.                |
| ableitungsText5? | string | Der 5. Ableitungstext dieses Eintrags.                |
| ableitungsText6? | string | Der 6. Ableitungstext dieses Eintrags.                |

### LuxLookupParameters

Klasse, die benutzt wird, um die Abfrage an den Lookup-Service im Backend zu modifizieren. Der Konstruktor erwartet ein Objekt `{ knr, keys?, fields?, raw? }`; nur `knr` ist Pflicht.

| Name   | Typ              | Beschreibung                                                                                                                                                          |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| knr    | number           | Eine 3-stellige Kammernummer (z.B. 101).                                                                                                                              |
| keys   | any[]            | Array mit den fachlichen Schlüssel der gewünschten Tabelleneinträge. Default: [].                                                                                     |
| fields | LuxFieldValues[] | Enthält die Felder, die in den Resultaten angezeigt werden sollen. Mögliche Werte sind in dem entsprechenden Enum zu finden. Default: alle Felder aus LuxFieldValues. |
| raw    | boolean          | Schaltet das Normalisieren der zurückgegebenen Keys ein und aus (0012345 -> 12345) Default: false.                                                                    |

### LuxFieldValues

Definiert welche Werte als "fields" übertragen werden können.

| Name            |
| --------------- |
| kurz            |
| lang1           |
| lang2           |
| gueltig_von     |
| gueltig_bis     |
| ableitungsText1 |
| ableitungsText2 |
| ableitungsText3 |
| ableitungsText4 |
| ableitungsText5 |
| ableitungsText6 |

### LuxBehandlungsOptionenUngueltige

Definiert welche Optionen es gibt, um ungültige Einträge zu behandeln.

| Name       |
| ---------- |
| anzeigen   |
| ausgrauen  |
| ausblenden |

## Beispiele

### 1. Signal Forms

Ab v22 lässt sich die Komponente über `[formField]` an ein [Angular Signal Form](https://angular.dev/guide/forms/signals/overview) binden. Pflichtfeld, Deaktivierung und Validierung werden im Schema von `form()` festgelegt. Ein dort hinterlegter `message`-Text wird als Fehlermeldung angezeigt (`luxErrorMessage` und `luxErrorCallback` haben Vorrang). Die Direktive `FormField` muss in den `imports` der Komponente stehen.

Ts

```typescript
import { FormField, form, required } from '@angular/forms/signals';

readonly parameters = new LuxLookupParameters({
  knr: 101,
  raw: false,
  fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2],
  keys: []
});

readonly model = signal<{ entry: LuxLookupTableEntry | null }>({ entry: null });
readonly lookupForm = form(this.model, (path) => {
  required(path.entry);
});
```

Html

```html
<lux-lookup-combobox
  luxLabel="Beispiel"
  luxRenderProp="kurzText"
  luxTableNo="1032"
  luxLookupId="beispiel"
  [luxParameters]="parameters"
  [formField]="lookupForm.entry"
/>
```

### 2. Simple Lookup-Combobox

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐lookup‐combobox-v22-img-01.png)

Ts

```typescript
readonly selected = signal<LuxLookupTableEntry | null>(null);

// Ungültige Einträge werden angezeigt (andere Optionen wären ausblenden oder disabled darzustellen)
readonly behandlungUngueltige = LuxBehandlungsOptionenUngueltige.anzeigen;
// Die zu übergebenden http-Parameter konfigurieren
readonly parameters = new LuxLookupParameters({
  knr: 101,
  raw: false,
  fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2],
  keys: []
});

private readonly lookupHandler = inject(LuxLookupHandlerService);

// Es ist möglich, einen Reload der Daten über den LookupHandler anzustoßen
reloadData() {
  // dafür muss die luxLookupId an den Service übergeben werden
  this.lookupHandler.reloadData('beispiel');
}
```

Html

```html
<lux-lookup-combobox
  luxLabel="Beispiel"
  luxRenderProp="kurzText"
  [luxParameters]="parameters"
  [luxBehandlungUngueltige]="behandlungUngueltige"
  luxTableNo="1032"
  luxHint="Ich bin ein Hint"
  [(value)]="selected"
  luxLookupId="beispiel"
/>
```

### 3. Custom Styling

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐lookup‐combobox-v22-img-02.png)

Ts

```typescript
readonly selected = signal<LuxLookupTableEntry | null>(null);

// Ungültige Einträge werden angezeigt (andere Optionen wären ausblenden oder disabled darzustellen)
readonly behandlungUngueltige = LuxBehandlungsOptionenUngueltige.anzeigen;
// Die zu übergebenden http-Parameter konfigurieren
readonly parameters = new LuxLookupParameters({
  knr: 101,
  raw: false,
  fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2],
  keys: []
});

readonly customValidStyles = { 'text-decoration': 'underline', 'color': 'green' };
readonly customInvalidStyles = { 'text-decoration': 'line-through', 'color': 'red' };

private readonly lookupHandler = inject(LuxLookupHandlerService);

// Es ist möglich, einen Reload der Daten über den LookupHandler anzustoßen
reloadData() {
  // dafür muss die luxLookupId an den Service übergeben werden
  this.lookupHandler.reloadData('beispiel');
}

// Die Render-Funktion, die die Darstellung der einzelnen Einträge modifiziert
customRenderFn(entry: LuxLookupTableEntry) {
  return '[RenderFn] ' + entry?.kurzText;
}
```

Html

```html
<lux-lookup-combobox
  luxLabel="Beispiel"
  [luxParameters]="parameters"
  [luxBehandlungUngueltige]="behandlungUngueltige"
  luxTableNo="1032"
  luxHint="Ich bin ein Hint"
  [(value)]="selected"
  luxLookupId="beispiel"
  [luxRenderProp]="customRenderFn"
  [luxCustomStyles]="customValidStyles"
  [luxCustomInvalidStyles]="customInvalidStyles"
/>
```

### 4. Mit clientseitiger Filterung

Ts

```typescript
readonly selected = signal<LuxLookupTableEntry | null>(null);
readonly parameters = new LuxLookupParameters({
  knr: 101,
  fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
});
```

Html

```html
<lux-lookup-combobox
  luxLabel="Beispiel"
  luxRenderProp="kurzText"
  [luxParameters]="parameters"
  luxTableNo="1032"
  [luxEnableFilter]="true"
  [(value)]="selected"
  luxLookupId="beispiel"
/>
```
