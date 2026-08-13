# LUX-List

![Beispielbild LUX-List](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐list-v21-img.png)

- [LUX-List](#lux-list)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxListItemComponent](#luxlistitemcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [@Output](#output-1)
    - [LuxListItemIconComponent](#luxlistitemiconcomponent)
      - [Allgemein](#allgemein-2)
      - [ng-content](#ng-content)
    - [LuxListItemContentComponent](#luxlistitemcontentcomponent)
      - [Allgemein](#allgemein-3)
      - [ng-content](#ng-content-1)
  - [Tastaturnavigation](#tastaturnavigation)
    - [Listennavigation (Normal-Modus)](#listennavigation-normal-modus)
    - [Bearbeiten-Modus (Edit-Modus)](#bearbeiten-modus-edit-modus)
  - [Beispiele](#beispiele)
    - [1. Liste (gefüllt)](#1-liste-gefüllt)
    - [2. Liste (leer)](#2-liste-leer)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-list     |

### @Input

| Name                | Typ    | Beschreibung                                                                                       |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| luxEmptyIconName    | string | Bestimmt das Icon, welches angezeigt werden soll wenn keine Einträge in der Liste vorhanden sind.  |
| luxEmptyIconSize    | string | Bestimmt die Größe des Icons (reicht von 1x bis 5x).                                               |
| luxEmptyLabel       | string | Bestimmt das Label, welches angezeigt werden soll wenn keine Einträge in der Liste vorhanden sind. |
| luxLabel            | string | Bestimmt das Aria-Label, welches für die Barrierefreiheit verwendet wird.                          |
| luxSelectedPosition | number | Diese Property bestimmt das selektierte ListItem dieser Liste.                                     |

### @Output

| Name                      | Typ                                  | Beschreibung                                                                          |
| ------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| luxSelectedPositionChange | EventEmitter \<number>               | Dieser Output-Emitter gibt neue Positionen selektierter ListItems wieder.             |
| luxFocusedPositionChange  | EventEmitter \<number>               | Dieser Output-Emitter gibt neue Positionen fokussierter ListItems wieder.             |
| luxFocusedItemChange      | EventEmitter \<LuxListItemComponent> | Dieser Output-Emitter gibt bei Fokus-Änderungen das entsprechende LuxListItem wieder. |

## Components

### LuxListItemComponent

Die LuxListItemComponent entspricht einem einzelnen Eintrag in der Liste.

#### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-list-item |

#### @Input

| Name               | Typ     | Beschreibung                                                                                                                  |
| ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| luxTitle           | string  | Bestimmt den Titel dieses Listeneintrags. Dieser wird prominent in der primary-Farbe angezeigt.                               |
| luxTitleTooltip    | string  | Bestimmt den Titeltooltip dieses Listeneintrags.                                                                              |
| luxSubTitle        | string  | Bestimmt den Untertitel dieses Listeneintrags. Dieser wird unterhalb des Titels in leichtem Grau dargestellt.                 |
| luxSubTitleTooltip | string  | Bestimmt den Untertiteltooltipp dieses Listeneintrags.                                                                        |
| luxSelected        | boolean | Mit diesem Flag kann das Listenelement als selektiert gekennzeichnet und dargestellt werden.                                  |
| luxTitleLineBreak  | boolean | Definiert ob der Titel (wenn er zu lang ist) in eine zweite Zeile umbrechen kann oder über eine Ellipse (...) abgekürzt wird. |

#### @Output

| Name       | Typ                   | Beschreibung                                                   |
| ---------- | --------------------- | -------------------------------------------------------------- |
| luxClicked | EventEmitter \<Event> | Event, welches beim Klick auf das LuxListItem ausgegeben wird. |

### LuxListItemIconComponent

Das LuxListItemIconComponent nimmt [lux-icon](lux‐icon-v21) und [lux-image](lux‐image-v21) entgegen und stellt diese rechts vom Titel dar.

#### Allgemein

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-list-item-icon |

#### ng-content

| Name                       | Typ      | Beschreibung                      |
| -------------------------- | -------- | --------------------------------- |
| [lux-icon](lux‐icon-v21)   | Selector | Siehe [lux-icon](lux‐icon-v21).   |
| [lux-image](lux‐image-v21) | Selector | Siehe [lux-image](lux‐image-v21). |

### LuxListItemContentComponent

Diese Component umfasst den eigentlichen Inhalt des Listeneintrags.

#### Allgemein

| Name     | Beschreibung          |
| -------- | --------------------- |
| selector | lux-list-item-content |

#### ng-content

| Name | Typ | Beschreibung                                                          |
| ---- | --- | --------------------------------------------------------------------- |
| any  |     | Hier kann beliebiger Inhalt via Content-Projection eingesetzt werden. |

## Tastaturnavigation

Die `lux-list` implementiert das ARIA-Grid-Pattern (`role="grid"`). Jede Kachel hat die Rolle `row`, der innere Karteninhalt die Rolle `gridcell`.

### Listennavigation (Normal-Modus)

| Taste                    | Aktion                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| `Tab`                    | Fokus auf die Liste setzen bzw. verlassen                                                          |
| `ArrowUp` / `ArrowDown`  | Zwischen den Listeneinträgen navigieren                                                            |
| `Home`                   | Ersten Listeneintrag fokussieren                                                                   |
| `End`                    | Letzten Listeneintrag fokussieren                                                                  |
| `Enter` / `Space` / `F2` | Eintrag selektieren und Bearbeiten-Modus aktivieren (nur wenn interaktive Elemente vorhanden sind) |

### Bearbeiten-Modus (Edit-Modus)

Enthält der aktive Listeneintrag interaktive Elemente (z. B. Formularfelder, Buttons, Links), kann der Bearbeiten-Modus aktiviert werden. Im Bearbeiten-Modus verwaltet der Browser die Tab-Reihenfolge innerhalb der Kachel.

| Taste          | Aktion                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `Tab`          | Nächstes interaktives Element innerhalb der Kachel fokussieren                                                                            |
| `Shift+Tab`    | Vorheriges interaktives Element fokussieren; am Anfang zurück zur Zeile                                                                   |
| `Home` / `End` | Zeile wechseln (beendet den Bearbeiten-Modus für die aktuelle Kachel).                                                                    |
| `Escape`       | Bearbeiten-Modus beenden, Fokus zurück auf die Zeile. Ausnahme bei Elementen mit eigenem Escape-Handling (z.B. Autocomplete oder Select). |

> **Hinweis:** Bei einer großen Anzahl von Listeneinträgen mit vielen interaktiven Elementen kann der Bearbeiten-Modus die Performance beeinträchtigen.

## Beispiele

### 1. Liste (gefüllt)

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐list-v21-img-01.png)

Ts

```typescript
listItems: any[] = [
    {title: 'Title Item 0', subtitle: 'Subtitle Item 0', value: 0, selected: false},
    {title: 'Title Item 1', subtitle: 'Subtitle Item 1', value: 1, selected: true},
    {title: 'Title Item 2', subtitle: 'Subtitle Item 2', value: 2, selected: false},
];

onClick(that: any) {
    this.listItems.forEach((listItem: any) => listItem.selected = false);
    that.selected = true;
}
```

Html

```html
<lux-list luxLabel="Meine Liste">
  <ng-container *ngFor="let listItem of listItems">
    <lux-list-item
      [luxTitle]="listItem.title"
      [luxSubTitle]="listItem.subtitle"
      [luxSelected]="listItem.selected"
      (luxClicked)="onClick(listItem)"
    >
      <lux-list-item-icon>
        <lux-icon luxIconName="lux-cogs"></lux-icon>
      </lux-list-item-icon>
      <lux-list-item-content>
        Value: {{ listItem.value }}
      </lux-list-item-content>
    </lux-list-item>
  </ng-container>
</lux-list>
```

### 2. Liste (leer)

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐list-v21-img-02.png)

Ts

```typescript
listItems: any[] = [];
```

Html

```html
<lux-list
  luxEmptyIconName="lux-interface-delete-1"
  luxEmptyLabel="Keine Informationen gefunden."
  luxEmptyIconSize="2x"
  luxLabel="Meine Liste"
>
  <ng-container *ngFor="let listItem of listItems">
    <lux-list-item
      [luxTitle]="listItem.title"
      [luxSubTitle]="listItem.subtitle"
    >
      <lux-list-item-icon>
        <lux-icon luxIconName="lux-cogs"></lux-icon>
      </lux-list-item-icon>
      <lux-list-item-content>
        Value: {{ listItem.value }}
      </lux-list-item-content>
    </lux-list-item>
  </ng-container>
</lux-list>
```
