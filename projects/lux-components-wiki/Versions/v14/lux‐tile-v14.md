# LUX-Tile

![Beispielbild LUX-Tile](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐tile-v14-img.png)

- [LUX-Tile](#lux-tile)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Styleguide](#styleguide)
  - [Beispiele](#beispiele)
    - [1. Kachel mit Icon](#1-kachel-mit-icon)
    - [2. Kachel mit Bild](#2-kachel-mit-bild)
    - [3. Kachel mit Zahl und Marker](#3-kachel-mit-zahl-und-marker)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxLayoutModule |
| selector | lux-tile        |

### @Input

| Name                | Typ     | Beschreibung                                                                                                                                                   |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabel            | string  | Enthält das Label, welches unten links in dem Tile angezeigt wird.                                                                                             |
| luxTagId            | string  | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                  |
| luxCounter          | number  | Zeigt eine Zahl auf der rechten, oberen Seite des Tiles an.                                                                                                    |
| luxCounterCap       | number  | Die Obergrenze für den luxCounter. Wenn der luxCounter größer als der luxCounterCap ist, wird der luxCounterCap mit einem zusätzlichen '+'-Symbol dargestellt. |
| luxShowNotification | boolean | Bestimmt ob das Symbol für Notifikationen an der rechten, oberen Seite des Tiles dargestellt wird.                                                             |

### @Output

| Name       | Typ                   | Beschreibung                                               |
| ---------- | --------------------- | ---------------------------------------------------------- |
| luxClicked | EventEmitter \<Event> | Event das ausgestoßen wird, wenn das Tile angeklickt wird. |

## Styleguide

Grundlegende Regeln zum Umgang mit Tile's sind:

- Die Überschriften bei den Tile's sind analog zur lux-card grundsätzlich links auszurichten.

## Beispiele

### 1. Kachel mit Icon

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐tile-v14-img-01.png)

Html

```html
<lux-tile luxLabel="Kalender">
  <lux-icon luxIconName="fas fa-calendar" luxIconSize="3x"></lux-icon>
</lux-tile>
```

### 2. Kachel mit Bild

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐tile-v14-img-02.png)

Html

```html
<lux-tile luxLabel="Bild">
  <lux-image
    luxImageSrc="assets/svg/Example.svg"
    luxImageWidth="100%"
    luxImageHeight="100%"
  ></lux-image>
</lux-tile>
```

### 3. Kachel mit Zahl und Marker

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐tile-v14-img-03.png)

Html

```html
<lux-tile
  luxLabel="Counter & Notification"
  [luxCounter]="20"
  [luxCounterCap]="15"
  [luxShowNotification]="true"
>
  <lux-icon
    luxIconName="fas fa-cog"
    luxColor="green"
    [luxRounded]="true"
  ></lux-icon>
</lux-tile>
```
