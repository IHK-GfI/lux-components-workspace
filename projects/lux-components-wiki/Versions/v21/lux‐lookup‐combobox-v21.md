# LUX-Lookup-Combobox

![Beispielbild LUX-Lookup-Combobox](lux‐lookup‐combobox-v21-img.png)

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
    - [1. Simple Lookup-Combobox](#1-simple-lookup-combobox)
    - [2. Custom Styling](#2-custom-styling)

## Overview / API

### Allgemein

| Name     | Beschreibung           |
| -------- | ---------------------- |
| selector | lux-lookup-combobox-ac |

### @Input

| Name                      | Typ                                                                                                                                                  | Beschreibung                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMultiple               | boolean                                                                                                                                              | Ermöglicht die Mehrfachauswahl in der Combobox.                                                                                                                                                                                                                                                                                              |
| luxEntryBlockSize         | number                                                                                                                                               | Bestimmt wie viele Elemente in der Selection-Box auf einmal angezeigt werden, für weitere Elemente kann der Anwender in dem Fenster herunterscrollen.                                                                                                                                                                                        |
| luxLookupId               | string                                                                                                                                               | Enthält die ID, die diese Lookup-Komponente kennzeichnet. Wichtig: Muss definiert sein, da der LuxLookupHandler das Laden der Daten hierüber anstößt.                                                                                                                                                                                        |
| luxTableNo                | number                                                                                                                                               | Bestimmt die Schlüsseltabelle, aus welcher die Daten geladen werden sollen. Kann einfach als Number-Wert übergeben werden (z.B: 1032)                                                                                                                                                                                                        |
| luxRenderProp             | string \| Function                                                                                                                                   | Enthält die Property, welche für die Darstellung einzelnen Schlüsseltabelleneinträge genutzt wird. Wahlweise kann hier auch eine Funktion mitgegeben werden, welche als Parameter ein Objekt vom Typ LuxLookupTableEntry enthält und einen String als Rückgabewert besitzt.                                                                  |
| renderPropNoPropertyLabel | string                                                                                                                                               | Dieses Label wird dargestellt, wenn ein Element nicht über das Property aus luxRenderProp (z.B. ableitungsText6) verfügt.                                                                                                                                                                                                                    |
| luxCompareFn?             | LuxLookupCompareFn <br/><br/> (z.B. luxLookupCompareKeyFn, luxLookupCompareKurzTextFn, luxLookupCompareLangText1Fn oder luxLookupCompareLangText2Fn) | Bestimmt die Sortierreihenfolge der Schlüsseltabelleneinträge. Wenn keine Funktion übergeben wird, werden die Optionen angezeigt, wie sie geladen wurden.                                                                                                                                                                                    |
| luxBehandlungUngueltige   | LuxBehandlungsOptionenUngueltige                                                                                                                     | Bestimmt wie mit ungültigen Einträgen umgegangen wird. Kann dabei folgende Werte beinhalten: LuxBehandlungsOptionenUngueltige.ausgrauen = Deaktiviert die ungültigen Einträge LuxBehandlungsOptionenUngueltige.ausblenden = Blendet die ungültigen Einträge aus LuxBehandlungsOptionenUngueltige.anzeigen = Zeigt die ungültigen Einträge an |
| luxParameters             | LuxLookupParameters                                                                                                                                  | Beinhaltet die Parameter, welche für den Request Richtung Lookup-Service verwendet werden. Hier können die anzuzeigenden Felder, zu filternde Keys sowie die Option ob Schlüsselwerte mit führenden Nullen (raw) geholt werden, eingestellt werden.                                                                                          |
| luxCustomStyles           | Object                                                                                                                                               | Enthält optional ein Objekt, welches Styles für die Darstellung der einzelnen Schlüsseltabelleneinträgen enthält.                                                                                                                                                                                                                            |
| luxCustomInvalidStyles    | Object                                                                                                                                               | Enthält optional ein Objekt, welches Styles für die Darstellung von invaliden Schlüsseltabelleneinträgen enthält. Voraussetzung dafür ist allerdings, das die Behandlung der ungültigen Einträge auf "anzeigen" gesetzt ist.                                                                                                                 |
| luxValue                  | LuxLookupTableEntry \| LuxLookupTableEntry[]                                                                                                         | Beinhaltet den aktuellen Wert der Komponente, es ist ein Two-Way-Binding möglich.                                                                                                                                                                                                                                                            |
| luxRequired               | boolean                                                                                                                                              | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                                    |
| luxControlBinding         | string                                                                                                                                               | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                 |
| luxErrorMessage           | string                                                                                                                                               | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                               |
| luxDisabled               | boolean                                                                                                                                              | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding möglich.                                                                                                                                                                                                           |
| luxReadonly               | boolean                                                                                                                                              | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (ähnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                                      |
| luxErrorCallback          | LuxErrorCallbackFnType                                                                                                                               | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem übergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurückgegeben werden. Liefert der Callback `undefined` zurück, wird die Defaultfehlermeldung ausgegeben.                   |
| luxControlValidators      | ValidatorFnType                                                                                                                                      | Validator-Funktion oder ein Array von Validator-Funktionen, die für diese Component hereingereicht werden können. Diese werden nur für nicht-ReactiveForms-Components angewendet und sollen so eine Validierung für "normale" Komponenten ermöglichen.                                                                                       |
| luxLabel                  | string                                                                                                                                               | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der Schaltfläche dar) darstellt.                                                                                                                                                                               |
| luxHint                   | string                                                                                                                                               | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt.                                                                                                                                                                                                                                                                      |
| luxHintShowOnlyOnFocus    | boolean                                                                                                                                              | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                  |
| luxWithEmptyEntry         | boolean                                                                                                                                              | Bestimmt ob ein zusätzlicher leerer Eintrag in der Auswahl angezeigt wird. Wert: `undefined`                                                                                                                                                                                                                                                 |
| luxLabelLongFormat        | boolean                                                                                                                                              | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die Höhe des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewährleistet werden.                                                                                                                                    |
| luxDense                  | boolean                                                                                                                                              | Property um die Höhe der Komponente zu verringern. Diese Eigenschaft ist für den Einsatz in großen Formularen gedacht und soll nicht standardmäßig in einer Anwendung genutzt werden.                                                                                                                                                        |

### @Output

| Name              | Typ                                                        | Beschreibung                                                                                               |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| luxDataLoaded     | EventEmitter \<boolean>                                    | Output-Emitter, welcher mitteilt wenn Daten geladen wurden (true) oder ein Fehler aufgetreten ist (false). |
| luxValueChange    | EventEmitter \<LuxLookupTableEntry, LuxLookupTableEntry[]> | Output-Emitter, der bei neuen Werten der Komponente ein Event ausgibt.                                     |
| luxFocusIn        | EventEmitter \<FocusEvent>                                 | Event welches beim Fokussieren des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.   |
| luxFocusOut       | EventEmitter \<FocusEvent>                                 | Event welches beim Fokusverlust des Elements ausgelöst wird und ein Objekt vom Typ FocusEvent weitergibt.  |
| luxDisabledChange | EventEmitter \<boolean>                                    | Event welches beim Disablen des Elements ausgelöst wird.                                                   |

## Services

### LuxLookupService

Der LuxLookupService dient den LuxLookupComponents dazu, auf die Lookup-Service Instanz der Backend-Seite zuzugreifen.

| Funktion                                                                                              | Beschreibung                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getLookupTable(tableNo: string, parameters: LuxLookupParameters): Observable <LuxLookupTableEntry[]>  | Ruft die gleichnamige Schnittstelle des Lookup-Services auf und gibt anschließend Elemente mit den den Parametern entsprechenden Feldern wieder.                                                                                                                                              |
| getTableEntries(tableNo: string, parameters: LuxLookupParameters): Observable <LuxLookupTableEntry[]> | Ruft die gleichnamige Schnittstelle des Lookup-Services auf, filtert dabei nach den in den Parametern mitgegebenen "keys" und gibt anschließend die Elemente wieder. Die Funktionalität ist prinzipiell dieselbe wie bei getLookupTable, nur das hier eine Filterung nach "keys" stattfindet. |

### LuxLookupHandlerService

Der LuxLookupHandlerService dient der aufrufenden Komponente dazu, das Laden von Schlüsseltabelleninformationen auszulösen.

| Funktion                           | Beschreibung                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| reloadData(lookupId: string): void | Triggert das Laden von Schlüsseltabellendaten für eine LookupComponent, vorausgesetzt, die richtige lookupId wird mitgegeben. |

## Classes / Interfaces

### LuxLookupTableEntry

Klasse, die einen einzelnen Eintrag aus einer Schlüsseltabelle kennzeichnet.

| Name            | Typ            | Beschreibung                                          |
| --------------- | -------------- | ----------------------------------------------------- |
| key             | string         | Der einzigartige Schlüssel dieses einzelnen Eintrags. |
| gueltigkeitBis  | string, number | Der Timestamp, bis zu dem dieser Eintrag gültig ist.  |
| gueltigkeitVon  | string, number | Der Timestamp, ab dem dieser Eintrag gültig ist.      |
| kurzText        | string         | Der Kurztext dieses Eintrags.                         |
| langText1       | string         | Der erste lange Text dieses Eintrags.                 |
| langText2       | string         | Der zweite lange Text dieses Eintrags.                |
| ableitungsText1 | string         | Der 1. Ableitungstext dieses Eintrags.                |
| ableitungsText2 | string         | Der 2. Ableitungstext dieses Eintrags.                |
| ableitungsText3 | string         | Der 3. Ableitungstext dieses Eintrags.                |
| ableitungsText4 | string         | Der 4. Ableitungstext dieses Eintrags.                |
| ableitungsText5 | string         | Der 5. Ableitungstext dieses Eintrags.                |
| ableitungsText6 | string         | Der 6. Ableitungstext dieses Eintrags.                |

### LuxLookupParameters

Klasse, die benutzt wird, um die Abfrage an den Lookup-Service im Backend zu modifizieren.

| Name   | Typ              | Beschreibung                                                                                                                 |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| knr    | number           | Eine 3-stellige Kammernummer (z.B. 101).                                                                                     |
| keys   | any[]            | Array mit den fachlichen Schlüssel der gewünschten Tabelleneinträge.                                                         |
| fields | LuxFieldValues[] | Enthält die Felder, die in den Resultaten angezeigt werden sollen. Mögliche Werte sind in dem entsprechenden Enum zu finden. |
| raw    | boolean          | Schaltet das Normalisieren der zurückgegebenen Keys ein und aus (0012345 -> 12345)                                           |

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

### 1. Simple Lookup-Combobox

![Beispielbild 01](lux‐lookup‐combobox-v21-img-01.png)

Ts

```typescript
selected: LuxLookupTableEntry | null = null;
/** Einstellungen für die Component vornehmen **/


// Ungültige Einträge werden angezeigt (andere Optionen wären ausblenden oder disabled darzustellen)
behandlungUngueltige: LuxBehandlungsOptionenUngueltige = LuxBehandlungsOptionenUngueltige.anzeigen;
// Die zu übergebenden http-Parameter konfigurieren
parameters: LuxLookupParameters = new LuxLookupParameters({
    knr: 101,
    raw: false,
    fields: [ LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2 ],
    keys: []
});

constructor(private lookupHandler: LuxLookupHandlerService) {
}

// Es ist möglich, einen Reload der Daten über den LookupHandler anzustoßen
reloadData() {
    // dafür muss die luxLookupId an den Service übergeben werden
    this.lookupHandler.reloadData('beispiel');
}
```

Html

```html
<lux-lookup-combobox-ac
  luxLabel="Beispiel"
  luxRenderProp="kurzText"
  [luxParameters]="parameters"
  [luxBehandlungUngueltige]="behandlungUngueltige"
  luxTableNo="1032"
  luxHint="Ich bin ein Hint"
  [(luxValue)]="selected"
  luxLookupId="beispiel"
>
</lux-lookup-combobox-ac>
```

### 2. Custom Styling

![Beispielbild 02](lux‐lookup‐combobox-v21-img-02.png)

Ts

```typescript
selected: LuxLookupTableEntry | null = null;
/** Einstellungen für die Component vornehmen **/

// Ungültige Einträge werden angezeigt (andere Optionen wären ausblenden oder disabled darzustellen)
behandlungUngueltige: LuxBehandlungsOptionenUngueltige = LuxBehandlungsOptionenUngueltige.anzeigen;
// Die zu übergebenden http-Parameter konfigurieren
parameters: LuxLookupParameters = new LuxLookupParameters({
    knr: 101,
    raw: false,
    fields: [ LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2 ],
    keys: []
});

customValidStyles = { 'text-decoration': 'underline', 'color': 'green' };
customInvalidStyles = { 'text-decoration': 'line-through', 'color': 'red' };
constructor(private lookupHandler: LuxLookupHandlerService) {
}

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
<lux-lookup-combobox-ac
  luxLabel="Beispiel"
  [luxParameters]="parameters"
  [luxBehandlungUngueltige]="behandlungUngueltige"
  luxTableNo="1032"
  luxHint="Ich bin ein Hint"
  [(luxValue)]="selected"
  luxLookupId="beispiel"
  [luxRenderProp]="customRenderFn"
  [luxCustomStyles]="customValidStyles"
  [luxCustomInvalidStyles]="customInvalidStyles"
>
</lux-lookup-combobox-ac>
```
