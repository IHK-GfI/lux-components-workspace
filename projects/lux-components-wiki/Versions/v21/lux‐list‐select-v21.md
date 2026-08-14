# LUX-List-Select

![Beispielbild LUX-List-Select](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐list‐select-v21-img.png)

- [LUX-List-Select](#lux-list-select)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [Inputs](#inputs)
    - [Outputs](#outputs)
    - [ControlValueAccessor](#controlvalueaccessor)
  - [Components](#components)
    - [Eigener Item-Inhalt (Content-Projection)](#eigener-item-inhalt-content-projection)
  - [Beispiele](#beispiele)
    - [1. Multi-Select mit „Alle auswählen“](#1-multi-select-mit-alle-auswählen)
    - [2. Single-Select (Radio)](#2-single-select-radio)
    - [3. Paginierung, Infinite Scrolling und Fehlerzustand](#3-paginierung-infinite-scrolling-und-fehlerzustand)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-list-select |

`LuxListSelectComponent<T>` ist generisch. `T` ist der Typ der Objekte in `luxItems`.

### Inputs

| Name                 | Typ                          | Default                          | Beschreibung                                                                                                                       |
| -------------------- | ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| luxMode              | LuxListSelectMode (`'single'` \| `'multi'`) | `'multi'`         | Bestimmt, ob Mehrfachauswahl (Checkboxen) oder Einfachauswahl (Radio-Buttons) angeboten wird.                                                |
| luxItems             | T[]                           | `[]`                              | Die anzuzeigenden Listenelemente. Bei aktiver Paginierung oder Infinite-Scrolling liefert die aufrufende Seite bereits nur die aktuell sichtbare Seite bzw. den bisher geladenen Ausschnitt, die Komponente schneidet `luxItems` nicht selbst zu. |
| luxLabelProp         | string                        | `'label'`                         | Name der Property in `T`, aus der das Haupt-Label je Item gelesen wird.                                                                      |
| luxSubLabelProp      | string                        | `'subLabel'`                      | Name der Property in `T`, aus der das Sub-Label je Item gelesen wird.                                                                        |
| luxDisabledProp      | string                        | `'disabled'`                      | Name der Property in `T`, über die ein einzelnes Item deaktiviert wird (`true` deaktiviert das Item).                                        |
| luxCompareWith       | (a: T, b: T) => boolean       | `(a, b) => a === b`               | Vergleichsfunktion, mit der geprüft wird, ob ein Item in `luxSelected` enthalten ist. Bei Objektwerten aus einer API sollte hier üblicherweise über eine ID verglichen werden. |
| luxLabel             | string \| undefined           | `undefined`                       | Aria-Label für die Liste. Ohne Angabe wird ein übersetzter Standardtext verwendet.                                                           |
| luxDisabled          | boolean                       | `false`                           | Deaktiviert die gesamte Komponente (alle Items, „Alle auswählen“ und die Paginierung).                                                       |
| luxTagId             | string \| undefined           | `undefined`                       | Optionale Tag-ID für automatisierte Tests (`luxTagIdHandler`).                                                                               |
| luxShowDetailButton  | boolean                       | `false`                           | Zeigt je Item einen zusätzlichen Detail-Button an, der unabhängig von der Auswahl das Event `luxDetailClicked` auslöst.                      |
| luxDetailIconName    | string                        | `'lux-interface-arrows-expand-5'` | Icon-Name für den Detail-Button.                                                                                                              |
| luxTotalItems        | number \| null                | `null`                            | Gesamtzahl aller Elemente (über alle Seiten hinweg), z. B. für den Zähler und den Paginator. Ohne Angabe wird `luxItems().length` verwendet.  |
| luxSelectAllLabel    | string \| undefined           | `undefined`                       | Eigener Text für die „Alle auswählen“-Checkbox im Multi-Modus. Ohne Angabe wird ein übersetzter Standardtext verwendet.                       |
| luxShowCounter       | boolean                       | `true`                            | Zeigt den Zähler „X von Y ausgewählt“ an.                                                                                                     |
| luxShowPagination    | boolean                       | `false`                           | Aktiviert die Paginierung über `lux-paginator`. Schließt sich mit `luxInfiniteScroll` aus, siehe Hinweis unten.                               |
| luxPageSize          | number                        | `5`                                | Seitengröße für die Paginierung.                                                                                                              |
| luxInfiniteScroll    | boolean                       | `false`                           | Aktiviert das Nachladen weiterer Items beim Scrollen ans Ende der Liste. Schließt sich mit `luxShowPagination` aus, siehe Hinweis unten.      |
| luxIsLoading         | boolean                       | `false`                           | Zeigt beim Infinite Scrolling an, dass gerade nachgeladen wird, und unterdrückt währenddessen weitere `luxScrolled`-Events.                   |
| luxMaxHeight         | string \| null                | `null`                            | Maximale Höhe des Listenbereichs (z. B. `'420px'`), darüber hinaus wird gescrollt.                                                            |
| luxErrorMessage      | string \| null                | `null`                            | Fehlertext, der unterhalb der Liste als `lux-message-box` angezeigt wird. Ohne Angabe (bzw. `null`) wird keine Fehlermeldung angezeigt.       |

Hinweis: `luxShowPagination` und `luxInfiniteScroll` schließen sich gegenseitig aus. Sind beide `true`, gibt die Komponente eine `console.error`-Meldung aus und verwendet die Paginierung.

Hinweis: „Alle auswählen“ (nur im Multi-Modus) wirkt ausschließlich auf die nicht-disabled Items der aktuell in `luxItems` übergebenen Liste. Bei Paginierung oder Infinite Scrolling betrifft dies also nur die aktuell sichtbare bzw. geladene Seite, nicht alle Elemente über `luxTotalItems`. Eine bereits bestehende Selektion aus anderen Seiten bleibt dabei erhalten: Beim Anhaken werden die Items der aktuellen Seite zur bestehenden Selektion hinzugefügt, beim Abhaken werden nur die Items der aktuellen Seite wieder entfernt.

### Outputs

| Name              | Typ                    | Beschreibung                                                                                                       |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| luxSelectedChange | EventEmitter\<T[]>      | Emittiert die aktuelle Auswahl bei jeder Änderung, auch bei programmatischen Änderungen über `writeValue` (siehe [ControlValueAccessor](#controlvalueaccessor)). |
| luxPageChange     | EventEmitter\<LuxPageEvent> | Emittiert, wenn sich bei aktiver Paginierung die Seite ändert.                                                  |
| luxScrolled       | EventEmitter\<void>     | Emittiert bei aktivem Infinite Scrolling, wenn ans Ende der Liste gescrollt wurde und weitere Items nachgeladen werden sollen. |
| luxDetailClicked  | EventEmitter\<T>        | Emittiert das jeweilige Item, wenn bei `luxShowDetailButton` der Detail-Button geklickt wurde.                    |

`luxSelected` ist als `model<T[]>` implementiert und damit auch als Zwei-Weg-Bindung `[(luxSelected)]` nutzbar. `luxPageIndex` ist ebenfalls ein `model<number>` und kann analog per `[(luxPageIndex)]` gebunden werden.

### ControlValueAccessor

`lux-list-select` implementiert `ControlValueAccessor`. Der Formwert ist `T[]`, also identisch zum Typ von `luxSelected`.

Wichtiger Hinweis: `writeValue` setzt intern `luxSelected`, wodurch analog zu `lux-button-toggle` zusätzlich `luxSelectedChange` ausgelöst wird. Wer `[(luxSelected)]` und Reactive Forms gleichzeitig verwendet, sollte das bei der Verdrahtung berücksichtigen, da programmatische Formwert-Änderungen (z. B. `formControl.setValue(...)`) ebenfalls `luxSelectedChange` auslösen.

```typescript
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LuxListSelectComponent } from '@ihk-gfi/lux-components';

interface Adresse {
  label: string;
  subLabel: string;
}

@Component({
  selector: 'app-example',
  imports: [LuxListSelectComponent, ReactiveFormsModule],
  template: `
    <lux-list-select
      luxLabel="Adressen"
      [luxItems]="items"
      [formControl]="adressenControl"
    ></lux-list-select>
  `
})
export class ExampleComponent {
  items: Adresse[] = [
    { label: 'Anna Müller', subLabel: 'Berliner Str. 12, 10115 Berlin' },
    { label: 'Thomas Schmidt', subLabel: 'Hauptstr. 45, 80331 München' }
  ];

  adressenControl = new FormControl<Adresse[]>([]);
}
```

## Components

### Eigener Item-Inhalt (Content-Projection)

Der Inhalt eines Items (standardmäßig Titel und Untertitel aus `luxLabelProp`/`luxSubLabelProp`) kann über ein projiziertes `ng-template` vollständig ersetzt werden. Das Template erhält als Kontext das jeweilige Item (`$implicit`) und den aktuellen Auswahlstatus (`selected`):

```html
<lux-list-select [luxItems]="items" [(luxSelected)]="selected">
  <ng-template let-item let-selected="selected">
    <span class="lux-list-select-title">{{ item.label }}</span>
    @if (selected) {
      <lux-icon luxIconName="lux-interface-validation-check" luxIconSize="1x"></lux-icon>
    }
  </ng-template>
</lux-list-select>
```

## Beispiele

### 1. Multi-Select mit „Alle auswählen“

```html
<lux-list-select
  luxLabel="Adressen"
  [luxItems]="items"
  [(luxSelected)]="selected"
  luxSelectAllLabel="Alle Adressen"
></lux-list-select>
```

```typescript
import { Component, signal } from '@angular/core';
import { LuxListSelectComponent } from '@ihk-gfi/lux-components';

interface Adresse {
  label: string;
  subLabel: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-example',
  imports: [LuxListSelectComponent],
  template: `...`
})
export class ExampleComponent {
  items: Adresse[] = [
    { label: 'Anna Müller', subLabel: 'Berliner Str. 12, 10115 Berlin' },
    { label: 'Thomas Schmidt', subLabel: 'Hauptstr. 45, 80331 München' },
    { label: 'Markus Fischer', subLabel: 'Schillerplatz 3, 70173 Stuttgart', disabled: true }
  ];

  selected = signal<Adresse[]>([]);
}
```

### 2. Single-Select (Radio)

```html
<lux-list-select
  luxLabel="Ansprechpartner"
  luxMode="single"
  [luxItems]="items"
  [(luxSelected)]="selected"
></lux-list-select>
```

```typescript
import { Component, signal } from '@angular/core';
import { LuxListSelectComponent } from '@ihk-gfi/lux-components';

interface Person {
  label: string;
  subLabel: string;
}

@Component({
  selector: 'app-example',
  imports: [LuxListSelectComponent],
  template: `...`
})
export class ExampleComponent {
  items: Person[] = [
    { label: 'Anna Müller', subLabel: 'Berliner Str. 12, 10115 Berlin' },
    { label: 'Thomas Schmidt', subLabel: 'Hauptstr. 45, 80331 München' }
  ];

  selected = signal<Person[]>([]);
}
```

### 3. Paginierung, Infinite Scrolling und Fehlerzustand

Die Komponente paginiert bzw. begrenzt die angezeigten Items nicht selbst. Die aufrufende Seite berechnet den sichtbaren Ausschnitt (z. B. über `slice`) und übergibt ihn per `luxItems`, während `luxTotalItems` die Gesamtzahl für Zähler und Paginator liefert.

```html
<lux-list-select
  luxLabel="Adressen"
  [luxItems]="visibleItems()"
  [luxTotalItems]="filtered().length"
  [(luxSelected)]="selected"
  [luxShowPagination]="showPagination()"
  [luxPageSize]="pageSize"
  [(luxPageIndex)]="pageIndex"
  [luxInfiniteScroll]="infiniteScroll()"
  [luxMaxHeight]="'420px'"
  [luxErrorMessage]="errorMessage() || null"
  (luxPageChange)="onPageChange($event)"
  (luxScrolled)="onScrolled()"
></lux-list-select>
```

```typescript
import { Component, computed, signal } from '@angular/core';
import { LuxListSelectComponent } from '@ihk-gfi/lux-components';
import { LuxPageEvent } from '@ihk-gfi/lux-components/lux-paginator';

interface Adresse {
  label: string;
  subLabel: string;
}

@Component({
  selector: 'app-example',
  imports: [LuxListSelectComponent],
  template: `...`
})
export class ExampleComponent {
  alleAdressen: Adresse[] = [
    /* ... */
  ];

  showPagination = signal(true);
  infiniteScroll = signal(false);
  pageSize = 5;
  pageIndex = signal(0);
  loadedCount = signal(6);
  errorMessage = signal('');
  selected = signal<Adresse[]>([]);

  filtered = computed(() => this.alleAdressen);

  visibleItems = computed(() => {
    if (this.showPagination()) {
      const start = this.pageIndex() * this.pageSize;
      return this.filtered().slice(start, start + this.pageSize);
    }
    if (this.infiniteScroll()) {
      return this.filtered().slice(0, this.loadedCount());
    }
    return this.filtered();
  });

  onPageChange(event: LuxPageEvent): void {
    console.log('Page Index:', event.pageIndex);
  }

  onScrolled(): void {
    this.loadedCount.update((count) => Math.min(count + 3, this.filtered().length));
  }
}
```

Hinweis: `luxShowPagination` und `luxInfiniteScroll` schließen sich gegenseitig aus, siehe [Inputs](#inputs). Über `luxErrorMessage` lässt sich zusätzlich ein Fehlerzustand anzeigen, z. B. wenn das Laden der Adressen fehlgeschlagen ist.
