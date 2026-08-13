# LUX-Paginator

![Beispielbild LUX-Paginator](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐paginator-v21-img.png)

- [LUX-Paginator](#lux-paginator)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
    - [Signals](#signals)
      - [LuxPageEvent Struktur](#luxpageevent-struktur)
    - [Öffentliche Methoden](#öffentliche-methoden)
  - [Beispiele](#beispiele)
    - [Einfacher Paginator](#einfacher-paginator)
    - [Ohne Seitengrößenauswahl](#ohne-seitengrößenauswahl)
    - [Mit Template Reference und Methodenaufrufen](#mit-template-reference-und-methodenaufrufen)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-paginator |

### Inputs

| Name                    | Typ                          | Default           | Beschreibung                                                                       |
| ----------------------- | ---------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| luxLength               | number                       | 0                 | Die Gesamtzahl der Elemente, die paginiert werden                                  |
| luxPageSize             | number                       | 50                | Anzahl der Elemente pro Seite                                                      |
| luxPageSizeOptions      | number[]                     | [10, 25, 50, 100] | Verfügbare Optionen für die Seitengröße                                            |
| luxPageIndex            | number                       | 0                 | Der aktuelle Seitenindex (0-basiert). Zwei-Weg-Bindung möglich: `[(luxPageIndex)]` |
| luxShowFirstLastButtons | boolean                      | true              | Zeige Buttons für erste und letzte Seite                                           |
| luxHidePageSize         | boolean                      | false             | Verstecke die Seitengrößen-Auswahl                                                 |
| luxDisabled             | boolean                      | false             | Deaktiviere den Paginator                                                          |
| luxDense                | boolean                      | true              | Reduziert die Höhe der Komponente (kompakter Modus)                                |
| luxNoWrap               | boolean                      | false             | Verhindert einen Umbruch innerhalb des Paginators                                  |
| luxItemsPerPageLabel    | string \| undefined          | undefined         | Optionales Override für das Label der Seitengrößen-Auswahl                         |
| luxNextPageLabel        | string \| undefined          | undefined         | Optionales Override für das Label des Nächste-Seite-Buttons                        |
| luxPreviousPageLabel    | string \| undefined          | undefined         | Optionales Override für das Label des Vorherige-Seite-Buttons                      |
| luxFirstPageLabel       | string \| undefined          | undefined         | Optionales Override für das Label des Erste-Seite-Buttons                          |
| luxLastPageLabel        | string \| undefined          | undefined         | Optionales Override für das Label des Letzte-Seite-Buttons                         |
| luxGetRangeLabel        | LuxRangeLabelFn \| undefined | undefined         | Optionales Override für die Anzeige des Bereichslabels                             |

### Outputs

| Name          | Typ          | Beschreibung                                                     |
| ------------- | ------------ | ---------------------------------------------------------------- |
| luxPageChange | LuxPageEvent | Emittiert, wenn sich die Seitengröße oder der Seitenindex ändert |

### Signals

| Signal         | Typ              | Beschreibung                                                                |
| -------------- | ---------------- | --------------------------------------------------------------------------- |
| luxInitialized | Signal\<boolean> | Signal, das `true` ist, wenn die Komponente vollständig initialisiert wurde |

#### LuxPageEvent Struktur

| Property          | Typ               | Beschreibung                |
| ----------------- | ----------------- | --------------------------- |
| pageIndex         | number            | Der neue Seitenindex        |
| pageSize          | number            | Die neue Seitengröße        |
| length            | number            | Die Gesamtzahl der Elemente |
| previousPageIndex | number\|undefined | Der vorherige Seitenindex   |

### Öffentliche Methoden

| Methode            | Rückgabewert | Beschreibung                              |
| ------------------ | ------------ | ----------------------------------------- |
| firstPage()        | void         | Navigiere zur ersten Seite                |
| lastPage()         | void         | Navigiere zur letzten Seite               |
| nextPage()         | void         | Gehe zur nächsten Seite, wenn vorhanden   |
| previousPage()     | void         | Gehe zur vorherigen Seite, wenn vorhanden |
| getNumberOfPages() | number       | Berechne die Gesamtzahl der Seiten        |
| hasNextPage()      | boolean      | Prüfe, ob es eine nächste Seite gibt      |
| hasPreviousPage()  | boolean      | Prüfe, ob es eine vorherige Seite gibt    |

## Beispiele

### Einfacher Paginator

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐paginator-v21-img-01.png)

```html
<lux-paginator
  [luxLength]="100"
  [luxPageSize]="10"
  [luxPageSizeOptions]="[5, 10, 25, 50]"
  (luxPageChange)="onPageChange($event)">
</lux-paginator>
```

TypeScript:

```typescript
import { Component } from '@angular/core';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';

@Component({
  selector: 'app-example',
  template: `...`
})
export class ExampleComponent {
  onPageChange(event: LuxPageEvent): void {
    console.log('Page Index:', event.pageIndex);
    console.log('Page Size:', event.pageSize);
  }
}
```

### Ohne Seitengrößenauswahl

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐paginator-v21-img-02.png)

```html
<lux-paginator
  [luxLength]="100"
  [luxPageSize]="25"
  [luxHidePageSize]="true"
  (luxPageChange)="onPageChange($event)">
</lux-paginator>
```

### Mit Template Reference und Methodenaufrufen

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐paginator-v21-img-03.png)

```html
<lux-paginator 
  #paginator 
  [luxPageSize]="25" 
  [luxLength]="100" 
  (luxPageChange)="onPageChange($event)">
  </lux-paginator>

<lux-button luxLabel="Erste Seite" (luxClicked)="paginator.firstPage()"></lux-button>
<lux-button luxLabel="Nächste Seite" (luxClicked)="paginator.nextPage()"></lux-button>
<lux-button luxLabel="Vorherige Seite" (luxClicked)="paginator.previousPage()"></lux-button>
<lux-button luxLabel="Letzte Seite" (luxClicked)="paginator.lastPage()"></lux-button>

@if (paginator.luxInitialized()) {
  <p>Insgesamt {{ paginator.getNumberOfPages() }} Seiten</p>
}
```
