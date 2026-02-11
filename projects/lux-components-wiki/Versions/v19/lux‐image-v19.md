# LUX-Image

![Beispielbild LUX-Image](lux‐image-v19-img.png)

- [LUX-Image](#lux-image)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Pixel-Größen](#1-pixel-größen)
    - [2. Prozent-Größen](#2-prozent-größen)
    - [3. Raw Source](#3-raw-source)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-image     |

### @Input

| Name           | Typ     | Beschreibung                                                                                                                                                            |
| -------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxImageSrc    | string  | Pfad zur Bild-Datei, wenn es eine lokale Datei ist, muss das Bild unter dem Ordner /assets liegen. Beispiel: luxImageSrc="/assets/svgs/beispiel.svg"                    |
| luxImageWidth  | string  | Bestimmt die Breite des Bildes, hier können alle (CSS) bekannten Größen eingegeben werden. Beispiel: luxImageWidth="100%", luxImageWidth="10em", luxImageWidth="100px"  |
| luxImageHeight | boolean | Bestimmt die Höhe des Bildes, hier können alle (CSS) bekannten Größen eingegeben werden. Beispiel: luxImageHeight="100%", luxImageHeight="10em", luxImageHeight="100px" |
| luxRawSrc      | boolean | Deaktiviert wenn "true" jegliche Bearbeitung der luxImageSrc durch diese Component. Dadurch sind relativ liegende Image-Links erreichbar (z.B. /fb/test.png).           |
| luxAlt         | string  | Eine Bildbeschreibung.                                                                                                                                                  |

## Beispiele

### 1. Pixel-Größen

![Beispielbild 01](lux‐image-v19-img-01.png)

Html

```html
<div class="lux-flex lux-flex-wrap">
  <lux-image
    luxImageSrc="assets/svg/android.svg"
    luxImageWidth="10px"
    luxImageHeight="20px"
    class="lux-flex-none"
  ></lux-image>
  <lux-image
    luxImageSrc="assets/svg/android.svg"
    luxImageWidth="40px"
    luxImageHeight="40px"
    class="lux-flex-none"
  ></lux-image>
  <lux-image
    luxImageSrc="assets/svg/android.svg"
    luxImageWidth="80px"
    luxImageHeight="80px"
    class="lux-flex-none"
  ></lux-image>
  <lux-image
    luxImageSrc="assets/svg/android.svg"
    luxImageWidth="100px"
    luxImageHeight="150px"
    class="lux-flex-none"
  ></lux-image>
  <lux-image
    luxImageSrc="assets/svg/android.svg"
    luxImageWidth="200px"
    luxImageHeight="200px"
    class="lux-flex-none"
  ></lux-image>
</div>
```

### 2. Prozent-Größen

![Beispielbild 02](lux‐image-v19-img-02.png)

Html

```html
<lux-image
  luxImageSrc="assets/svg/box.svg"
  luxImageWidth="100%"
  luxImageHeight="100%"
></lux-image>
```

### 3. Raw Source

Html

```html
<lux-image [luxRawSrc]="true" luxImageSrc="/fb/myImage.png"></lux-image>
```
