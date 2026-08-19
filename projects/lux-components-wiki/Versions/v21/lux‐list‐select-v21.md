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
  - [Client- und Server-Modus](#client--und-server-modus)
    - [Client-Modus (ohne luxHttpDao)](#client-modus-ohne-luxhttpdao)
    - [Server-Modus (mit luxHttpDao)](#server-modus-mit-luxhttpdao)
  - [Tastaturnavigation](#tastaturnavigation)
    - [Listennavigation (Normal-Modus)](#listennavigation-normal-modus)
    - [Bearbeiten-Modus (Edit-Modus)](#bearbeiten-modus-edit-modus)
  - [Beispiele](#beispiele)
    - [1. Multi-Select mit „Alle auswählen“](#1-multi-select-mit-alle-auswählen)
    - [2. Single-Select (Radio)](#2-single-select-radio)
    - [3. Suche, Paginierung, Infinite Scrolling und Fehlerzustand](#3-suche-paginierung-infinite-scrolling-und-fehlerzustand)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-list-select |

`LuxListSelectComponent<T>` ist generisch. `T` ist der Typ der Objekte in `luxItems` bzw. in den vom DAO gelieferten Items.

### Inputs

| Name                | Typ                                          | Default                           | Beschreibung                                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMode             | LuxListSelectMode (`'single'` \| `'multi'`)   | `'multi'`                          | Bestimmt, ob Mehrfachauswahl (Checkboxen) oder Einfachauswahl (Radio-Buttons) angeboten wird.                                                                                                                                      |
| luxItems            | T[]                                           | `[]`                                | Die anzuzeigenden Listenelemente im Client-Modus (ohne `luxHttpDao`). Die Komponente filtert (bei `luxShowSearch`) und schneidet bei aktiver Paginierung selbst auf die aktuelle Seite zu; bei aktivem Infinite Scrolling ohne DAO liefert weiterhin die aufrufende Seite einen wachsenden Ausschnitt über `luxItems`, siehe [Client- und Server-Modus](#client--und-server-modus). Ist `luxHttpDao` gesetzt, wird `luxItems` vollständig ignoriert. |
| luxLabelProp        | string                                        | `'label'`                          | Name der Property in `T`, aus der das Haupt-Label je Item gelesen wird. Wird auch für die interne Suche im Client-Modus verwendet.                                                                                                |
| luxSubLabelProp     | string                                        | `'subLabel'`                       | Name der Property in `T`, aus der das Sub-Label je Item gelesen wird. Wird auch für die interne Suche im Client-Modus verwendet.                                                                                                  |
| luxDisabledProp     | string                                        | `'disabled'`                       | Name der Property in `T`, über die ein einzelnes Item deaktiviert wird (`true` deaktiviert das Item).                                                                                                                              |
| luxCompareWith      | (a: T, b: T) => boolean                       | `(a, b) => a === b`                | Vergleichsfunktion, mit der geprüft wird, ob ein Item in `luxSelected` enthalten ist. Bei Objektwerten aus einer API sollte hier üblicherweise über eine ID verglichen werden.                                                    |
| luxLabel            | string \| undefined                           | `undefined`                        | Aria-Label für die Liste. Ohne Angabe wird ein übersetzter Standardtext verwendet.                                                                                                                                                 |
| luxDisabled         | boolean                                       | `false`                             | Deaktiviert die gesamte Komponente (Suchfeld, alle Items, „Alle auswählen“ und die Paginierung).                                                                                                                                   |
| luxTagId            | string \| undefined                           | `undefined`                        | Optionale Tag-ID für automatisierte Tests (`luxTagIdHandler`).                                                                                                                                                                     |
| luxShowDetailButton | boolean                                       | `false`                             | Zeigt je Item einen zusätzlichen Detail-Button an, der unabhängig von der Auswahl das Event `luxDetailClicked` auslöst.                                                                                                            |
| luxDetailIconName   | string                                        | `'lux-interface-arrows-expand-5'`  | Icon-Name für den Detail-Button.                                                                                                                                                                                                    |
| luxTotalItems       | number \| null                                | `null`                              | Gesamtzahl aller Elemente (über alle Seiten hinweg), z. B. für den Zähler und den Paginator. Ohne Angabe wird im Client-Modus die Anzahl der (ggf. gefilterten) Elemente aus `luxItems` verwendet. Im Server-Modus wird `luxTotalItems` ignoriert, hier zählt ausschließlich die vom DAO gelieferte `totalCount`. Ist `luxTotalItems` im Client-Modus gesetzt und gleichzeitig eine Suche aktiv, bleibt der Zähler bzw. Paginator auf der ungefilterten Gesamtmenge stehen, obwohl die Suche die angezeigten Elemente filtert. |
| luxSelectAllLabel   | string \| undefined                           | `undefined`                        | Eigener Text für die „Alle auswählen“-Checkbox im Multi-Modus. Ohne Angabe wird ein übersetzter Standardtext verwendet.                                                                                                            |
| luxShowCounter      | boolean                                       | `true`                              | Zeigt im Multi-Modus in der Kopfzeile den Zähler „X von Y ausgewählt“ an (Opt-out). Im Single-Modus gibt es keine Kopfzeile, `luxShowCounter` hat dort keine Wirkung.                                                             |
| luxShowPagination   | boolean                                       | `false`                             | Aktiviert die Paginierung über `lux-paginator`. Schließt sich mit `luxInfiniteScroll` aus, siehe Hinweis unten.                                                                                                                    |
| luxPageSize         | number                                        | `5`                                  | Seitengröße für die Paginierung bzw. Anzahl der pro Nachladeschritt geholten Elemente beim Infinite Scrolling.                                                                                                                     |
| luxInfiniteScroll   | boolean                                       | `false`                             | Aktiviert das Nachladen weiterer Items beim Scrollen ans Ende der Liste. Schließt sich mit `luxShowPagination` aus, siehe Hinweis unten.                                                                                          |
| luxIsLoading        | boolean                                       | `false`                             | Zeigt beim Infinite Scrolling im Client-Modus an, dass gerade nachgeladen wird, und unterdrückt währenddessen weitere `luxScrolled`-Events. Im Server-Modus (`luxHttpDao` gesetzt) verwaltet die Komponente den Ladezustand selbst, `luxIsLoading` wird dort nicht ausgewertet. |
| luxMaxHeight        | string \| null                                | `null`                              | Maximale Gesamthöhe der Komponente (z. B. `'420px'`), inklusive Suchfeld, Kopfzeile (nur im Multi-Modus) mit „Alle auswählen“/Zähler, Paginierung und Fehlermeldung. Die Komponente ist als Flex-Layout aufgebaut, sodass bei Platzmangel ausschließlich der Listenbereich schrumpft und scrollt, die übrigen Bereiche bleiben vollständig sichtbar. |
| luxErrorMessage     | string \| null                                | `null`                              | Fehlertext, der unterhalb der Liste als `lux-message-box` angezeigt wird. Ohne Angabe (bzw. `null`) wird keine Fehlermeldung angezeigt.                                                                                            |
| luxShowSearch       | boolean                                       | `false`                             | Zeigt ein Suchfeld oberhalb der Liste an. Im Client-Modus filtert die Komponente `luxItems` intern über `luxLabelProp`/`luxSubLabelProp`. Im Server-Modus wird der Suchbegriff als `filter` an `luxHttpDao` übergeben. Siehe [Client- und Server-Modus](#client--und-server-modus). |
| luxSearchDelay      | number                                        | `300`                                | Verzögerung in Millisekunden zwischen einer Eingabe im Suchfeld und der Anwendung der Suche (Debounce).                                                                                                                             |
| luxHttpDao          | ILuxListSelectHttpDao\<T> \| undefined        | `undefined`                         | Aktiviert den Server-Modus: Ist ein DAO gesetzt, lädt die Komponente ihre Daten ausschließlich selbst über dessen `loadData(...)`, `luxItems` wird ignoriert. Siehe [Client- und Server-Modus](#client--und-server-modus).        |

Hinweis: `luxShowPagination` und `luxInfiniteScroll` schließen sich gegenseitig aus. Sind beide `true`, gibt die Komponente eine `console.error`-Meldung aus und verwendet die Paginierung.

Hinweis: „Alle auswählen“ (nur im Multi-Modus) wirkt ausschließlich auf die nicht-disabled Items der aktuell angezeigten Seite (nach Filterung durch `luxShowSearch`). Im Client-Modus schneidet dabei nur bei aktiver `luxShowPagination` die Komponente selbst auf die aktuelle Seite zu; bei aktivem `luxInfiniteScroll` bestimmt weiterhin die aufrufende Seite über den Inhalt von `luxItems`, welche Elemente sichtbar sind. Im Server-Modus zählen die vom DAO gelieferten Items. Eine bereits bestehende Selektion aus anderen Seiten bleibt dabei erhalten: Beim Anhaken werden die Items der aktuellen Seite zur bestehenden Selektion hinzugefügt, beim Abhaken werden nur die Items der aktuellen Seite wieder entfernt.

### Outputs

| Name              | Typ                    | Beschreibung                                                                                                       |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| luxSelectedChange | EventEmitter\<T[]>      | Emittiert die aktuelle Auswahl bei jeder Änderung, auch bei programmatischen Änderungen über `writeValue` (siehe [ControlValueAccessor](#controlvalueaccessor)). |
| luxPageChange     | EventEmitter\<LuxPageEvent> | Emittiert, wenn sich bei aktiver Paginierung die Seite ändert.                                                  |
| luxScrolled       | EventEmitter\<void>     | Emittiert bei aktivem Infinite Scrolling, wenn ans Ende der Liste gescrollt wurde. Im Client-Modus muss die aufrufende Seite darauf mit weiteren Elementen in `luxItems` reagieren, im Server-Modus lädt die Komponente selbst nach. |
| luxDetailClicked  | EventEmitter\<T>        | Emittiert das jeweilige Item, wenn bei `luxShowDetailButton` der Detail-Button geklickt wurde.                    |

`luxSelected` ist als `model<T[]>` implementiert und damit auch als Zwei-Weg-Bindung `[(luxSelected)]` nutzbar. `luxPageIndex` ist ebenfalls ein `model<number>` und kann analog per `[(luxPageIndex)]` gebunden werden. `luxSearchValue` ist ebenfalls ein `model<string>` (`[(luxSearchValue)]`) und enthält den aktuell im Suchfeld eingegebenen Text, unabhängig vom Debounce über `luxSearchDelay`.

### ControlValueAccessor

`lux-list-select` implementiert `ControlValueAccessor`. Der Formwert ist `T[]`, also identisch zum Typ von `luxSelected`.

Wichtiger Hinweis: `writeValue` setzt intern `luxSelected`, wodurch analog zu `lux-button-toggle` zusätzlich `luxSelectedChange` ausgelöst wird. Wer `[(luxSelected)]` und Reactive Forms gleichzeitig verwendet, sollte das bei der Verdrahtung berücksichtigen, da programmatische Formwert-Änderungen (z. B. `formControl.setValue(...)`) ebenfalls `luxSelectedChange` auslösen. Im Single-Modus (`luxMode="single"`) normalisiert `writeValue` einen übergebenen Wert mit mehr als einem Element auf dessen erstes Element, sodass der Formwert immer konsistent zur Einfachauswahl bleibt.

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

Interaktive Elemente innerhalb dieses Templates (z. B. Links oder Buttons) werden von der Komponente automatisch in die Tab-Reihenfolge eingebunden, siehe [Tastaturnavigation](#tastaturnavigation).

## Client- und Server-Modus

`lux-list-select` kennt zwei Betriebsarten, die allein über das Vorhandensein von `luxHttpDao` gesteuert werden.

### Client-Modus (ohne luxHttpDao)

Die aufrufende Seite übergibt über `luxItems` die (vollständigen) Elemente. Ist `luxShowSearch` aktiv, filtert die Komponente intern über `luxLabelProp` und `luxSubLabelProp` (Groß-/Kleinschreibung wird ignoriert, leerer Suchbegriff zeigt alle Elemente).

Ist zusätzlich `luxShowPagination` aktiv, schneidet die Komponente die gefilterten Elemente auch selbst auf die aktuelle Seite zu (über `luxPageIndex`/`luxPageSize`); die aufrufende Seite übergibt hierfür weiterhin die vollständige Liste über `luxItems` und muss sie nicht mehr selbst zuschneiden. Eine Änderung des Suchbegriffs setzt `luxPageIndex` automatisch auf `0` zurück.

Bei aktivem `luxInfiniteScroll` ohne `luxHttpDao` schneidet die Komponente dagegen **nicht** selbst zu: Wie bisher liefert die aufrufende Seite bei jedem `luxScrolled`-Event einen um weitere Elemente erweiterten Ausschnitt über `luxItems` (client-seitiges Infinite Scrolling ist damit weiterhin ein reines Anzeigen dessen, was `luxItems` gerade enthält). Für serverseitig nachgeladenes Infinite Scrolling siehe den folgenden Abschnitt zum Server-Modus.

### Server-Modus (mit luxHttpDao)

Wird `luxHttpDao` gesetzt, wechselt die Komponente in den Server-Modus: `luxItems` wird vollständig ignoriert, die Komponente lädt ihre Daten ausschließlich selbst über das DAO. Das Interface im Wortlaut:

```typescript
export interface ILuxListSelectHttpDaoConf {
  page: number;
  pageSize: number;
  filter?: string;
}

export interface ILuxListSelectHttpDaoStructure<T = any> {
  items: T[];
  totalCount: number;
}

export interface ILuxListSelectHttpDao<T = any> {
  loadData(conf: ILuxListSelectHttpDaoConf): Observable<ILuxListSelectHttpDaoStructure<T>>;
}
```

Verhalten im Server-Modus:

- Beim (erstmaligen) Setzen bzw. Wechseln von `luxHttpDao` lädt die Komponente Seite `0` mit dem aktuell gültigen Suchbegriff.
- Bei aktiver Paginierung (`luxShowPagination`) ersetzt jede geladene Seite die bisher angezeigten Elemente.
- Bei aktivem Infinite Scrolling (`luxInfiniteScroll`) hängt die Komponente jede nachgeladene Seite an die bereits geladenen Elemente an, bis `totalCount` erreicht ist. Danach löst ein weiteres `luxScrolled` keinen zusätzlichen Request mehr aus.
- Eine Änderung des Suchbegriffs (nach Ablauf von `luxSearchDelay`) setzt `luxPageIndex` auf `0` zurück und lädt neu.
- Auch eine programmatische Änderung von `luxPageIndex` (z. B. `[(luxPageIndex)]` von außen gesetzt, nicht nur ein Klick im Paginator) lädt die neue Seite nach.
- Während ein Request läuft, zeigt die Komponente einen eigenen Lade-Spinner über der Liste an.
- Mehrere kurz aufeinanderfolgende Requests (z. B. schnelles Tippen im Suchfeld oder schnelles Blättern) werden intern über `switchMap` entkoppelt: Nur die Antwort des zuletzt gestarteten Requests wird übernommen, Antworten älterer, noch laufender Requests werden verworfen.

Da der DAO bei jedem Laden neue Objektinstanzen liefert, sollte `luxCompareWith` gesetzt werden (üblicherweise ein Vergleich über eine ID). Sonst erkennt die Komponente bereits selektierte Items nach einem Seitenwechsel nicht mehr als ausgewählt, da die Default-Vergleichsfunktion auf Objektidentität (`===`) prüft.

Beispiel-DAO mit Paginierung:

```typescript
import { ILuxListSelectHttpDao, ILuxListSelectHttpDaoConf, ILuxListSelectHttpDaoStructure } from '@ihk-gfi/lux-components';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Adresse {
  label: string;
  subLabel: string;
}

export class AdressenHttpDao implements ILuxListSelectHttpDao<Adresse> {
  constructor(private alleAdressen: Adresse[]) {}

  loadData(conf: ILuxListSelectHttpDaoConf): Observable<ILuxListSelectHttpDaoStructure<Adresse>> {
    let gefiltert = this.alleAdressen;

    if (conf.filter) {
      const term = conf.filter.toLowerCase();
      gefiltert = gefiltert.filter(
        (adresse) => adresse.label.toLowerCase().includes(term) || adresse.subLabel.toLowerCase().includes(term)
      );
    }

    const start = conf.page * conf.pageSize;
    const items = gefiltert.slice(start, start + conf.pageSize);

    return of({ items, totalCount: gefiltert.length }).pipe(delay(300));
  }
}
```

```html
<lux-list-select
  luxLabel="Adressen"
  [luxHttpDao]="httpDao"
  [luxShowSearch]="true"
  [luxShowPagination]="true"
  [luxPageSize]="5"
  [(luxPageIndex)]="pageIndex"
  [(luxSelected)]="selected"
></lux-list-select>
```

Beispiel-DAO mit Infinite Scrolling: Die `loadData`-Methode ist identisch zum Paginierungs-Beispiel (Request-Parameter `page`, `pageSize` und `filter` sind bei beiden Varianten gleich, das Anhängen bzw. Ersetzen der Elemente übernimmt die Komponente); lediglich `luxShowPagination` wird durch `luxInfiniteScroll` ersetzt:

```html
<lux-list-select
  luxLabel="Adressen"
  [luxHttpDao]="httpDao"
  [luxShowSearch]="true"
  [luxInfiniteScroll]="true"
  [luxPageSize]="20"
  [luxMaxHeight]="'420px'"
  [(luxSelected)]="selected"
></lux-list-select>
```

## Tastaturnavigation

`lux-list-select` implementiert, analog zu [lux-list](lux‐list-v21), das ARIA-Grid-Pattern (`role="grid"`). Jede Karte hat die Rolle `row`, ihr Inhalt (Checkbox-/Radio-Zelle, Titel/Untertitel bzw. projizierter Inhalt, ggf. Detail-Button) ist in `gridcell`-Bereiche unterteilt. Außerhalb des Bearbeiten-Modus ist die gesamte Liste ein einziger Tab-Stopp, die Navigation zwischen den Karten erfolgt über die Pfeiltasten.

### Listennavigation (Normal-Modus)

| Taste                   | Aktion                                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`                    | Fokus auf die Liste setzen bzw. verlassen (ein Tab-Stopp für die gesamte Liste)                                                                                  |
| `ArrowUp` / `ArrowDown`  | Zwischen den Karten navigieren                                                                                                                                   |
| `Home`                   | Erste Karte fokussieren                                                                                                                                          |
| `End`                    | Letzte Karte fokussieren                                                                                                                                         |
| `Space`                  | Auswahl der aktiven Karte umschalten (Checkbox bzw. Radio-Button)                                                                                                |
| `Enter`                  | Ohne `luxShowDetailButton`: Auswahl umschalten (wie `Space`). Mit `luxShowDetailButton`: Bearbeiten-Modus aktivieren.                                            |
| `F2`                     | Bearbeiten-Modus aktivieren (nur wenn die Karte interaktive innere Elemente besitzt, z. B. Detail-Button oder interaktive Elemente aus dem projizierten Inhalt) |

### Bearbeiten-Modus (Edit-Modus)

Besitzt die aktive Karte interaktive innere Elemente (Detail-Button, interaktive Elemente aus dem per `ng-template` projizierten Karteninhalt), kann der Bearbeiten-Modus aktiviert werden. Checkbox bzw. Radio-Button sind davon ausgenommen und bleiben dauerhaft kein eigener Tab-Stopp. Im Bearbeiten-Modus regelt der Browser die Tab-Reihenfolge innerhalb der Karte.

| Taste                            | Aktion                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`                             | Nächstes inneres interaktives Element fokussieren; vom letzten Element aus zurück zur Karte (Bearbeiten-Modus bleibt aktiv)                            |
| `Shift+Tab`                       | Vorheriges inneres interaktives Element fokussieren; von der Karte aus zum letzten Element                                                             |
| `ArrowUp` / `ArrowDown` / `Home` / `End` | Bearbeiten-Modus beenden und zur entsprechenden Karte wechseln (nur solange der Fokus auf der Karte selbst liegt, nicht auf einem inneren Element) |
| `Escape`                          | Bearbeiten-Modus beenden, Fokus zurück auf die Karte                                                                                                    |
| `F2`                              | Bearbeiten-Modus beenden, Fokus zurück auf die Karte                                                                                                    |

> **Hinweis:** Interaktive Elemente innerhalb eines per `ng-template` projizierten Karteninhalts (siehe [Eigener Item-Inhalt](#eigener-item-inhalt-content-projection)) werden automatisch verwaltet: Außerhalb des Bearbeiten-Modus erhalten sie `tabindex="-1"` und sind damit kein eigener Tab-Stopp, im Bearbeiten-Modus `tabindex="0"`.

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

### 3. Suche, Paginierung, Infinite Scrolling und Fehlerzustand

Im Client-Modus (ohne `luxHttpDao`) übergibt die aufrufende Seite bei aktiver Paginierung die vollständige Liste über `luxItems` (die Komponente schneidet sie selbst auf die aktuelle Seite zu). Bei aktivem Infinite Scrolling liefert die aufrufende Seite dagegen weiterhin einen wachsenden Ausschnitt über `luxItems` und erweitert ihn in `onScrolled()`, siehe [Client- und Server-Modus](#client--und-server-modus).

```html
<lux-list-select
  luxLabel="Adressen"
  [luxItems]="visibleItems()"
  [luxTotalItems]="alleAdressen.length"
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

  // Bei Paginierung slict die Komponente selbst (siehe luxItems), daher wird hier die
  // vollständige Liste übergeben. Bei Infinite Scrolling (ohne luxHttpDao) slict die Komponente
  // NICHT selbst, deshalb liefert visibleItems() weiterhin nur den bisher geladenen Ausschnitt.
  visibleItems = computed(() => {
    if (this.infiniteScroll()) {
      return this.alleAdressen.slice(0, this.loadedCount());
    }
    return this.alleAdressen;
  });

  onPageChange(event: LuxPageEvent): void {
    console.log('Page Index:', event.pageIndex);
  }

  onScrolled(): void {
    this.loadedCount.update((count) => Math.min(count + 3, this.alleAdressen.length));
  }
}
```

Hinweis: `luxShowPagination` und `luxInfiniteScroll` schließen sich gegenseitig aus, siehe [Inputs](#inputs). Über `luxErrorMessage` lässt sich zusätzlich ein Fehlerzustand anzeigen, z. B. wenn das Laden der Adressen fehlgeschlagen ist. Für Beispiele mit `luxShowSearch` sowie serverseitiger Filterung und Paginierung/Infinite Scrolling über ein DAO siehe [Client- und Server-Modus](#client--und-server-modus).
