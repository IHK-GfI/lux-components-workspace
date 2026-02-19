# LUX-Lookup-Combobox

![Beispielbild LUX-Lookup-Combobox](luxâ€lookupâ€combobox-v21-img.png)

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
| luxMultiple               | boolean                                                                                                                                              | ErmÃ¶glicht die Mehrfachauswahl in der Combobox.                                                                                                                                                                                                                                                                                              |
| luxEntryBlockSize         | number                                                                                                                                               | Bestimmt wie viele Elemente in der Selection-Box auf einmal angezeigt werden, fÃ¼r weitere Elemente kann der Anwender in dem Fenster herunterscrollen.                                                                                                                                                                                        |
| luxEnableFilter           | boolean                                                                                                                                              | Aktiviert ein Suchfeld im Dropdown-Panel. Die Filterung erfolgt rein clientseitig auf Basis der aktuell geladenen Lookup-Eintraege. Standardwert: `false`.                                                                                                                                                                                     |
| luxLookupId               | string                                                                                                                                               | EnthÃ¤lt die ID, die diese Lookup-Komponente kennzeichnet. Wichtig: Muss definiert sein, da der LuxLookupHandler das Laden der Daten hierÃ¼ber anstÃ¶ÃŸt.                                                                                                                                                                                        |
| luxTableNo                | number                                                                                                                                               | Bestimmt die SchlÃ¼sseltabelle, aus welcher die Daten geladen werden sollen. Kann einfach als Number-Wert Ã¼bergeben werden (z.B: 1032)                                                                                                                                                                                                        |
| luxRenderProp             | string \| Function                                                                                                                                   | EnthÃ¤lt die Property, welche fÃ¼r die Darstellung einzelnen SchlÃ¼sseltabelleneintrÃ¤ge genutzt wird. Wahlweise kann hier auch eine Funktion mitgegeben werden, welche als Parameter ein Objekt vom Typ LuxLookupTableEntry enthÃ¤lt und einen String als RÃ¼ckgabewert besitzt.                                                                  |
| renderPropNoPropertyLabel | string                                                                                                                                               | Dieses Label wird dargestellt, wenn ein Element nicht Ã¼ber das Property aus luxRenderProp (z.B. ableitungsText6) verfÃ¼gt.                                                                                                                                                                                                                    |
| luxCompareFn?             | LuxLookupCompareFn <br/><br/> (z.B. luxLookupCompareKeyFn, luxLookupCompareKurzTextFn, luxLookupCompareLangText1Fn oder luxLookupCompareLangText2Fn) | Bestimmt die Sortierreihenfolge der SchlÃ¼sseltabelleneintrÃ¤ge. Wenn keine Funktion Ã¼bergeben wird, werden die Optionen angezeigt, wie sie geladen wurden.                                                                                                                                                                                    |
| luxBehandlungUngueltige   | LuxBehandlungsOptionenUngueltige                                                                                                                     | Bestimmt wie mit ungÃ¼ltigen EintrÃ¤gen umgegangen wird. Kann dabei folgende Werte beinhalten: LuxBehandlungsOptionenUngueltige.ausgrauen = Deaktiviert die ungÃ¼ltigen EintrÃ¤ge LuxBehandlungsOptionenUngueltige.ausblenden = Blendet die ungÃ¼ltigen EintrÃ¤ge aus LuxBehandlungsOptionenUngueltige.anzeigen = Zeigt die ungÃ¼ltigen EintrÃ¤ge an |
| luxParameters             | LuxLookupParameters                                                                                                                                  | Beinhaltet die Parameter, welche fÃ¼r den Request Richtung Lookup-Service verwendet werden. Hier kÃ¶nnen die anzuzeigenden Felder, zu filternde Keys sowie die Option ob SchlÃ¼sselwerte mit fÃ¼hrenden Nullen (raw) geholt werden, eingestellt werden.                                                                                          |
| luxCustomStyles           | Object                                                                                                                                               | EnthÃ¤lt optional ein Objekt, welches Styles fÃ¼r die Darstellung der einzelnen SchlÃ¼sseltabelleneintrÃ¤gen enthÃ¤lt.                                                                                                                                                                                                                            |
| luxCustomInvalidStyles    | Object                                                                                                                                               | EnthÃ¤lt optional ein Objekt, welches Styles fÃ¼r die Darstellung von invaliden SchlÃ¼sseltabelleneintrÃ¤gen enthÃ¤lt. Voraussetzung dafÃ¼r ist allerdings, das die Behandlung der ungÃ¼ltigen EintrÃ¤ge auf "anzeigen" gesetzt ist.                                                                                                                 |
| luxValue                  | LuxLookupTableEntry \| LuxLookupTableEntry[]                                                                                                         | Beinhaltet den aktuellen Wert der Komponente, es ist ein Two-Way-Binding mÃ¶glich.                                                                                                                                                                                                                                                            |
| luxRequired               | boolean                                                                                                                                              | Bestimmt ob die Component ein Pflichtfeld ist oder nicht.                                                                                                                                                                                                                                                                                    |
| luxControlBinding         | string                                                                                                                                               | Das Controlbinding (z.B. firstname) verbindet das Formularelement mit einem Wert aus dem Modell. (!) Diese Eigenschaft kann nur verwendet werden, wenn das Element innerhalb eines Formulars verwendet wird.                                                                                                                                 |
| luxErrorMessage           | string                                                                                                                                               | Fehlertext, wenn das Formularelement nicht valide ist. Der Fehlertext ersetzt den Hinweistext, wenn es einen gibt. Ersetzt den luxErrorCallback, wenn gesetzt.                                                                                                                                                                               |
| luxDisabled               | boolean                                                                                                                                              | Bestimmt ob die Component deaktiviert ist oder nicht. Durch den Event-Emitter "luxDisabledChange" ist ein Two-Way-Binding mÃ¶glich.                                                                                                                                                                                                           |
| luxReadonly               | boolean                                                                                                                                              | Bestimmt ob sich das Feld im reinen Lese-Zustand befindet (Ã¤hnlich wie disabled, aber ohne die Auswirkungen auf Forms und andere visuelle Darstellung).                                                                                                                                                                                      |
| luxErrorCallback          | LuxErrorCallbackFnType                                                                                                                               | Callback-Funktion die aufgerufen wird nachdem die Validierung der Component stattgefunden hat. Hier kann dann entsprechend aus dem Ã¼bergebenen Errors-Objekt ein Fehler ausgelesen und die passende Fehlermeldung zurÃ¼ckgegeben werden. Liefert der Callback `undefined` zurÃ¼ck, wird die Defaultfehlermeldung ausgegeben.                   |
| luxControlValidators      | ValidatorFnType                                                                                                                                      | Validator-Funktion oder ein Array von Validator-Funktionen, die fÃ¼r diese Component hereingereicht werden kÃ¶nnen. Diese werden nur fÃ¼r nicht-ReactiveForms-Components angewendet und sollen so eine Validierung fÃ¼r "normale" Komponenten ermÃ¶glichen.                                                                                       |
| luxLabel                  | string                                                                                                                                               | Property welche ein Label oberhalb der FormComponent (Ausnahme: LuxToggle und LuxCheckbox, diese stellen das Label rechts von der SchaltflÃ¤che dar) darstellt.                                                                                                                                                                               |
| luxHint                   | string                                                                                                                                               | Property, welche einen Tipp/Text unterhalb der FormComponent darstellt.                                                                                                                                                                                                                                                                      |
| luxHintShowOnlyOnFocus    | boolean                                                                                                                                              | Gibt an, ob der Hinweis (siehe luxHint) nur angezeigt wird, wenn das Element den Fokus hat.                                                                                                                                                                                                                                                  |
| luxWithEmptyEntry         | boolean                                                                                                                                              | Bestimmt ob ein zusÃ¤tzlicher leerer Eintrag in der Auswahl angezeigt wird. Wert: `undefined`                                                                                                                                                                                                                                                 |
| luxLabelLongFormat        | boolean                                                                                                                                              | Bestimmt, ob das Label mehrzeilig sein kann. Nutzung nur in Spalten empfohlen, da die HÃ¶he des Formcontrols variieren kann. Dadurch kann die Ausrichtung an der Baseline nicht mehr gewÃ¤hrleistet werden.                                                                                                                                    |
| luxDense                  | boolean                                                                                                                                              | Property um die HÃ¶he der Komponente zu verringern. Diese Eigenschaft ist fÃ¼r den Einsatz in groÃŸen Formularen gedacht und soll nicht standardmÃ¤ÃŸig in einer Anwendung genutzt werden.                                                                                                                                                        |

### @Output

| Name              | Typ                                                        | Beschreibung                                                                                               |
| ----------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| luxDataLoaded     | EventEmitter \<boolean>                                    | Output-Emitter, welcher mitteilt wenn Daten geladen wurden (true) oder ein Fehler aufgetreten ist (false). |
| luxValueChange    | EventEmitter \<LuxLookupTableEntry, LuxLookupTableEntry[]> | Output-Emitter, der bei neuen Werten der Komponente ein Event ausgibt.                                     |
| luxFocusIn        | EventEmitter \<FocusEvent>                                 | Event welches beim Fokussieren des Elements ausgelÃ¶st wird und ein Objekt vom Typ FocusEvent weitergibt.   |
| luxFocusOut       | EventEmitter \<FocusEvent>                                 | Event welches beim Fokusverlust des Elements ausgelÃ¶st wird und ein Objekt vom Typ FocusEvent weitergibt.  |
| luxDisabledChange | EventEmitter \<boolean>                                    | Event welches beim Disablen des Elements ausgelÃ¶st wird.                                                   |

## Services

### LuxLookupService

Der LuxLookupService dient den LuxLookupComponents dazu, auf die Lookup-Service Instanz der Backend-Seite zuzugreifen.

| Funktion                                                                                              | Beschreibung                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getLookupTable(tableNo: string, parameters: LuxLookupParameters): Observable <LuxLookupTableEntry[]>  | Ruft die gleichnamige Schnittstelle des Lookup-Services auf und gibt anschlieÃŸend Elemente mit den den Parametern entsprechenden Feldern wieder.                                                                                                                                              |
| getTableEntries(tableNo: string, parameters: LuxLookupParameters): Observable <LuxLookupTableEntry[]> | Ruft die gleichnamige Schnittstelle des Lookup-Services auf, filtert dabei nach den in den Parametern mitgegebenen "keys" und gibt anschlieÃŸend die Elemente wieder. Die FunktionalitÃ¤t ist prinzipiell dieselbe wie bei getLookupTable, nur das hier eine Filterung nach "keys" stattfindet. |

### LuxLookupHandlerService

Der LuxLookupHandlerService dient der aufrufenden Komponente dazu, das Laden von SchlÃ¼sseltabelleninformationen auszulÃ¶sen.

| Funktion                           | Beschreibung                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| reloadData(lookupId: string): void | Triggert das Laden von SchlÃ¼sseltabellendaten fÃ¼r eine LookupComponent, vorausgesetzt, die richtige lookupId wird mitgegeben. |

## Classes / Interfaces

### LuxLookupTableEntry

Klasse, die einen einzelnen Eintrag aus einer SchlÃ¼sseltabelle kennzeichnet.

| Name            | Typ            | Beschreibung                                          |
| --------------- | -------------- | ----------------------------------------------------- |
| key             | string         | Der einzigartige SchlÃ¼ssel dieses einzelnen Eintrags. |
| gueltigkeitBis  | string, number | Der Timestamp, bis zu dem dieser Eintrag gÃ¼ltig ist.  |
| gueltigkeitVon  | string, number | Der Timestamp, ab dem dieser Eintrag gÃ¼ltig ist.      |
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
| keys   | any[]            | Array mit den fachlichen SchlÃ¼ssel der gewÃ¼nschten TabelleneintrÃ¤ge.                                                         |
| fields | LuxFieldValues[] | EnthÃ¤lt die Felder, die in den Resultaten angezeigt werden sollen. MÃ¶gliche Werte sind in dem entsprechenden Enum zu finden. |
| raw    | boolean          | Schaltet das Normalisieren der zurÃ¼ckgegebenen Keys ein und aus (0012345 -> 12345)                                           |

### LuxFieldValues

Definiert welche Werte als "fields" Ã¼bertragen werden kÃ¶nnen.

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

Definiert welche Optionen es gibt, um ungÃ¼ltige EintrÃ¤ge zu behandeln.

| Name       |
| ---------- |
| anzeigen   |
| ausgrauen  |
| ausblenden |

## Beispiele

### 1. Simple Lookup-Combobox

![Beispielbild 01](luxâ€lookupâ€combobox-v21-img-01.png)

Ts

```typescript
selected: LuxLookupTableEntry | null = null;
/** Einstellungen fÃ¼r die Component vornehmen **/


// UngÃ¼ltige EintrÃ¤ge werden angezeigt (andere Optionen wÃ¤ren ausblenden oder disabled darzustellen)
behandlungUngueltige: LuxBehandlungsOptionenUngueltige = LuxBehandlungsOptionenUngueltige.anzeigen;
// Die zu Ã¼bergebenden http-Parameter konfigurieren
parameters: LuxLookupParameters = new LuxLookupParameters({
    knr: 101,
    raw: false,
    fields: [ LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2 ],
    keys: []
});

constructor(private lookupHandler: LuxLookupHandlerService) {
}

// Es ist mÃ¶glich, einen Reload der Daten Ã¼ber den LookupHandler anzustoÃŸen
reloadData() {
    // dafÃ¼r muss die luxLookupId an den Service Ã¼bergeben werden
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

![Beispielbild 02](luxâ€lookupâ€combobox-v21-img-02.png)

Ts

```typescript
selected: LuxLookupTableEntry | null = null;
/** Einstellungen fÃ¼r die Component vornehmen **/

// UngÃ¼ltige EintrÃ¤ge werden angezeigt (andere Optionen wÃ¤ren ausblenden oder disabled darzustellen)
behandlungUngueltige: LuxBehandlungsOptionenUngueltige = LuxBehandlungsOptionenUngueltige.anzeigen;
// Die zu Ã¼bergebenden http-Parameter konfigurieren
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

// Es ist mÃ¶glich, einen Reload der Daten Ã¼ber den LookupHandler anzustoÃŸen
reloadData() {
    // dafÃ¼r muss die luxLookupId an den Service Ã¼bergeben werden
    this.lookupHandler.reloadData('beispiel');
}


// Die Render-Funktion, die die Darstellung der einzelnen EintrÃ¤ge modifiziert
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

### 3. Mit clientseitiger Filterung

Ts

```typescript
selected: LuxLookupTableEntry | null = null;
parameters: LuxLookupParameters = new LuxLookupParameters({
  knr: 101,
  fields: [LuxFieldValues.kurz, LuxFieldValues.lang1, LuxFieldValues.lang2]
});
```

Html

```html
<lux-lookup-combobox-ac
  luxLabel="Beispiel"
  luxRenderProp="kurzText"
  [luxParameters]="parameters"
  luxTableNo="1032"
  [luxEnableFilter]="true"
  [(luxValue)]="selected"
  luxLookupId="beispiel"
></lux-lookup-combobox-ac>
```


