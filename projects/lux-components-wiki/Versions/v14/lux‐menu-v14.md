# LUX-Menu

![Beispielbild LUX-Menu](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐menu-v14-img.png)

- [LUX-Menu](#lux-menu)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Components](#components)
    - [LuxMenuItemComponent](#luxmenuitemcomponent)
      - [@Input](#input-1)
      - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Einfaches Menü](#1-einfaches-menü)
    - [2. Extendedmenü (linksbündig)](#2-extendedmenü-linksbündig)
    - [3. Extendedmenü (rechtsbündig)](#3-extendedmenü-rechtsbündig)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxActionModule |
| Selector | lux-menu        |

### @Input

| Name                        | Typ                     | Beschreibung                                                                                                                                                                                                                    |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMenuIconName             | string                  | Ein Iconname (z.B. "fa-user" - [fontawesome](http://fontawesome.io/icons/) oder "android" [material](https://material.io/icons/)                                                                                                |
| luxTagId                    | string                  | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                   |
| luxDisplayMenuLeft          | boolean                 | Bestimmt ob das ausgeklappte Menu links bzw. rechts von der (optionalen) horizontalen Navigation dargestellt wird.                                                                                                              |
| luxDisplayExtended          | boolean                 | Bestimmt ob nicht nur das normale Menu (ausklappbar über einen Button), sondern auch eine horizontale Navigation angeboten wird.                                                                                                |
| luxMaximumExtended          | number                  | Bestimmt wie viele Elemente maximal in der horizontalen Navigation dargestellt werden können.                                                                                                                                   |
| luxMenuItems                | LuxMenuItemComponents[] | Ein Array mit LuxMenuItemComponents, welche dann dargestellt werden. Entspricht einer alternativen Darstellungsweise, wenn über 2 Unterkomponenten hinweg Content-Projection stattfindet.                                       |
| luxClassName                | string                  | Ermöglicht es, dem Menu eigene CSS-Klassen mitzugeben (nützlich, wenn man das Styling nachträglich anpassen möchte).                                                                                                            |
| luxHidden                   | boolean                 | Gibt an, ob ein Menüitem ausgeblendet werden soll.                                                                                                                                                                              |
| luxAriaMenuTriggerLabel     | string                  | Arialabel für den Menütriggerbutton.                                                                                                                                                                                            |
| luxMenuLabel                | string                  | Label für den Menütriggerbutton. Tipp, man kann das Icon mit 'luxMenuIconName=""' ausblenden, damit nur das Label sichtbar ist.                                                                                                 |
| luxMenuTriggerIconShowRight | boolean                 |                                                                                                                                                                                                                                 |
| luxMenuItemFixWidth         | number                  | Über diese Property kann die Menüitembreite fix gesetzt werden. Normalerweise wird die Breite dynamisch berechnet, aber wenn z.B. das Menü ausschließlich aus einheitlichen Buttons besteht, kann man die Berechnung einsparen. |

## Components

### LuxMenuItemComponent

#### @Input

| Name                   | Typ             | Beschreibung                                                                                                                                                                                     |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| lux-menu-item          | Selector        | Selector                                                                                                                                                                                         |
| luxAlwaysVisible       | boolean         | Bestimmt dass das Element unabhängig von Weight-Wert, maximal-erlaubten Elementen und Screen-Size in der horizontalen Navigation dargestellt werden soll.                                        |
| luxHideLabelIfExtended | boolean         | Über dieses Flag ist es möglich das Label des MenuItems im "ausgeklappten" Zustand zu verstecken.                                                                                                |
| luxLabel               | string          | Bestimmt das Label, welches in dieser Component angezeigt werden soll.                                                                                                                           |
| luxColor               | LuxThemePalette | Diese Property definiert die Farben der Component.                                                                                                                                               |
| luxRaised              | boolean         | Gibt an, ob der Button hervorgehoben wird.                                                                                                                                                       |
| luxIconName            | string          | Name des Font-Awesome oder Material Icons.                                                                                                                                                       |
| luxTagId               | string          | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                                                    |
| luxDisabled            | boolean         | Gibt an, ob das Element deaktiviert ist.                                                                                                                                                         |
| luxRounded             | boolean         | Gibt an, ob ein runder Button verwendet werden soll.                                                                                                                                             |
| luxIconAlignWithLabel  | boolean         | Entfernt die vertikale Zentrierung des Icons, so dass es mit dem Label ausgerichtet ist.                                                                                                         |
| luxButtonTooltip       | string          | Tooltip für das Element. Der Tooltip wird aber nur angezeigt, wenn das Element als Button außerhalb des Menüs dargestellt wird.                                                                  |
| luxMenuTooltip         | string          | Tooltip für das Element. Der Tooltip wird aber nur angezeigt, wenn das Element als Button innerhalb des Menüs dargestellt wird.                                                                  |
| luxPrio                | number          | Über die Priorität kann die Anzeigereihenfolge beeinflusst werden.                                                                                                                               |
| luxButtonBadge         | string          | Text der in einer Badge hinter dem Label in einem Lux-Button angezeigt werden kann. Die maximale Länge beträgt vier Zeichen und wird bei Überlänge automatisch mit Ellipsis '...' abgeschnitten. |
| luxButtonBadgeColor    | LuxThemePalette | Farbe der ButtonBadge, die analog zur Button-Farbe gewählt werden kann. Mögliche Werte: "primary", "accent", "warn".                                                                             |

#### @Output

| Name       | Typ                   | Beschreibung                                                                                          |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| luxClicked | EventEmitter \<Event> | Event welches beim Klick auf den Button ausgelöst wird und einen Clicked-Event als Parameter enthält. |

## Beispiele

### 1. Einfaches Menü

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐menu-v14-img-01.png)

Ts

```typescript
log(msg: string) {
    console.log(msg);
}
```

Html

```html
<lux-menu luxIconName="menu" [luxDisplayExtended]="false">
  <lux-menu-item
    luxLabel="Menu-Item 0"
    luxIconName="fas fa-address-book"
    (luxClicked)="log('Item 0 click')"
  ></lux-menu-item>
  <lux-menu-item
    luxLabel="Menu-Item 1"
    luxIconName="fas fa-address-card"
    (luxClicked)="log('Item 1 click')"
  ></lux-menu-item>
  <lux-menu-item
    luxLabel="Menu-Item 2"
    luxIconName="fas fa-id-card"
    (luxClicked)="log('Item 2 click')"
  ></lux-menu-item>
</lux-menu>
```

### 2. Extendedmenü (linksbündig)

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐menu-v14-img-02.png)

Ts

```typescript
log(msg: string) {
    console.log(msg);
}
```

Html

```html
<lux-menu
  luxIconName="menu"
  [luxDisplayExtended]="true"
  [luxDisplayMenuLeft]="true"
  [luxMaximumExtended]="2"
>
  <lux-menu-item
    luxLabel="Menu-Item 0"
    luxIconName="fas fa-address-book"
    (luxClicked)="log('Item 0 click')"
  ></lux-menu-item>
  <lux-menu-item
    luxLabel="Menu-Item 1"
    luxIconName="fas fa-address-card"
    (luxClicked)="log('Item 1 click')"
  ></lux-menu-item>
  <lux-menu-item
    luxLabel="Menu-Item 2"
    luxIconName="fas fa-id-card"
    (luxClicked)="log('Item 2 click')"
  ></lux-menu-item>
</lux-menu>
```

### 3. Extendedmenü (rechtsbündig)

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐menu-v14-img-03.png)

Ts

```typescript
log(msg: string) {
    console.log(msg);
}
```

Html

```html
<lux-menu
  luxIconName="menu"
  [luxDisplayExtended]="true"
  [luxDisplayMenuLeft]="false"
  [luxMaximumExtended]="2"
>
  <lux-menu-item
    luxLabel="Menu-Item 0"
    luxIconName="fas fa-address-book"
    (luxClicked)="log('Item 0 click')"
  ></lux-menu-item>
  <lux-menu-item
    luxLabel="Menu-Item 1"
    luxIconName="fas fa-address-card"
    (luxClicked)="log('Item 1 click')"
  ></lux-menu-item>
  <lux-menu-item
    luxLabel="Menu-Item 2"
    luxIconName="fas fa-id-card"
    (luxClicked)="log('Item 2 click')"
  ></lux-menu-item>
</lux-menu>
```

## Zusatzinformationen

### Konfigurationsoptionen

Durch Nutzung der [LUX-Components-Config](config-v14) kann für diese Component bestimmt werden, dass der Text immer in Großbuchstaben ausgegeben wird.
Will man die LuxButtons als Ausnahmen für die Ausgabe in Großbuchstaben hinzufügen, muss der Selektor "lux-button" dem Config-Module übergeben werden.

Standardmäßig werden die Texte der Buttons immer in Großbuchstaben angezeigt.
