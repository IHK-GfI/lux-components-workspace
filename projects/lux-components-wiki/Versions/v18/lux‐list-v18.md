# LUX-List

![Beispielbild LUX-List](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐list-v18-img.png)

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
  - [Beispiele](#beispiele)
    - [1. Liste (gefüllt)](#1-liste-gefüllt)
    - [2. Liste (leer)](#2-liste-leer)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxLayoutModule |
| selector | lux-list        |

### @Input

| Name                | Typ    | Beschreibung                                                                                       |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| luxEmptyIconName    | string | Bestimmt das Icon, welches angezeigt werden soll wenn keine Einträge in der Liste vorhanden sind.  |
| luxEmptyIconSize    | string | Bestimmt die Größe des Icons (reicht von 1x bis 5x).                                               |
| luxEmptyLabel       | string | Bestimmt das Label, welches angezeigt werden soll wenn keine Einträge in der Liste vorhanden sind. |
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

Das LuxListItemIconComponent nimmt [lux-icon](lux‐icon-v18) und [lux-image](lux‐image-v18) entgegen und stellt diese rechts vom Titel dar.

#### Allgemein

| Name     | Beschreibung       |
| -------- | ------------------ |
| selector | lux-list-item-icon |

#### ng-content

| Name                       | Typ      | Beschreibung                      |
| -------------------------- | -------- | --------------------------------- |
| [lux-icon](lux‐icon-v18)   | Selector | Siehe [lux-icon](lux‐icon-v18).   |
| [lux-image](lux‐image-v18) | Selector | Siehe [lux-image](lux‐image-v18). |

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

## Beispiele

### 1. Liste (gefüllt)

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐list-v18-img-01.png)

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
<lux-list>
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

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐list-v18-img-02.png)

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
