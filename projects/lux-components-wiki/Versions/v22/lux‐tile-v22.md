# LUX-Tile

![Beispielbild LUX-Tile](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tile-v22-img.png)

- [LUX-Tile](#lux-tile)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Styleguide](#styleguide)
  - [Beispiele](#beispiele)
    - [1. Kachel mit Icon](#1-kachel-mit-icon)
    - [2. Kachel mit Bild](#2-kachel-mit-bild)
    - [3. Kachel mit Marker](#3-kachel-mit-marker)
    - [4. Kachel mit Zahl](#4-kachel-mit-zahl)
    - [5. Kachel ohne Schatten](#5-kachel-ohne-schatten)

## Overview / API

### Allgemein

Kachel `lux-tile` (u.a. für das Theme Green). Die Variante für das Theme Authentic ist unter [lux-tile-ac](lux‐tile‐ac-v22) beschrieben.

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-tile     |

### @Input

| Name                         | Typ     | Beschreibung                                                                                                                                                   |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLabel                     | string  | Enthält das Label, welches unten im Tile angezeigt wird.                                                                                                       |
| luxLabelTruncateAfterOneLine | boolean | Gibt an, ob das _luxLabel_ nach der ersten Zeile abgeschnitten wird. Default: false. |
| luxLabelTruncateAfterTwoLines | boolean | Gibt an, ob das _luxLabel_ nach der zweiten Zeile abgeschnitten wird. Default: false. |
| luxTagId                     | string  | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                  |
| luxCounter                   | number  | Zeigt eine Zahl auf der rechten, oberen Seite des Tiles an.                                                                                                    |
| luxCounterCap | number | Die Obergrenze für den luxCounter. Wenn der luxCounter größer als der luxCounterCap ist, wird der luxCounterCap mit einem zusätzlichen '+'-Symbol dargestellt. Default: 10. |
| luxShowNotification          | boolean | Bestimmt, ob das Symbol für Notifikationen an der rechten, oberen Seite des Tiles dargestellt wird.                                                            |
| luxShowShadow | boolean | Bestimmt, ob ein Schatten um die Kachel angezeigt werden soll. Default: true. |

### @Output

| Name       | Typ   | Beschreibung                                              |
| ---------- | ----- | --------------------------------------------------------- |
| luxClicked | void | Event, das ausgelöst wird, wenn das Tile angeklickt wird. |

## Styleguide

Grundlegende Regeln zum Umgang mit Tiles sind:

- Die Überschriften bei den Tiles sind analog zur `lux-card` grundsätzlich links auszurichten.

## Beispiele

### 1. Kachel mit Icon

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tile-v22-img-01.png)

Html

```html
<lux-tile luxLabel="Kalender">
  <lux-icon luxIconName="lux-interface-calendar" luxIconSize="1x" />
</lux-tile>
```

### 2. Kachel mit Bild

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tile-v22-img-02.png)

Html

```html
<lux-tile luxLabel="Bild">
  <lux-image
    luxImageSrc="assets/svg/Example.svg"
    luxImageWidth="100%"
    luxImageHeight="100%"
  />
</lux-tile>
```

### 3. Kachel mit Marker

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tile-v22-img-03.png)

Html

```html
<lux-tile
  luxLabel="Counter & Notification"
  [luxShowNotification]="true"
>
  <lux-icon
    luxIconName="lux-interface-setting-hammer"
    luxIconSize="1x"
    luxColor="green"
    [luxRounded]="true"
  />
</lux-tile>
```

### 4. Kachel mit Zahl

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tile-v22-img-04.png)

Html

```html
<lux-tile
  luxLabel="Counter & Notification"
  [luxCounter]="20"
  [luxCounterCap]="15"
>
  <lux-icon
    luxIconName="lux-interface-setting-hammer"
    luxColor="green"
    [luxRounded]="true"
  />
</lux-tile>
```

### 5. Kachel ohne Schatten

![Beispielbild 05](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tile-v22-img-05.png)

Html

```html
<lux-tile luxLabel="Kalender" [luxShowShadow]="false">
  <lux-icon luxIconName="lux-interface-calendar" luxIconSize="1x" />
</lux-tile>
```
