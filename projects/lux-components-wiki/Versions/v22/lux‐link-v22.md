# LUX-Link

![Beispielbild LUX-Link](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐link-v22-img.png)

- [LUX-Link](#lux-link)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Normale Links](#1-normale-links)
    - [2. Flat Links](#2-flat-links)
    - [3. Links mit Icons](#3-links-mit-icons)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-link     |

### @Input

| Name             | Typ             | Beschreibung                                                                                                                                                                                                  |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxHref          | string          | Der Href-Inhalt (z.B. [http://www.ihk-gfi.de](http://www.ihk-gfi.de)). Wenn der luxHref ohne http beginnt, navigiert der LuxLink innerhalb der Angular-Applikation (also auf andere Components). Default: ''. |
| luxBlank         | boolean         | Ermöglicht es, externe Links in einem neuen Tab zu öffnen. Neue Tabs werden aus Sicherheitsgründen (Reverse Tabnabbing) immer mit noopener,noreferrer geöffnet. Default: false.                               |
| luxLabel         | string          | Bestimmt das Label, welches in dieser Component angezeigt werden soll. Default: ''.                                                                                                                           |
| luxColor         | LuxThemePalette | Diese Property definiert die Farben der Component.                                                                                                                                                            |
| luxRaised        | boolean         | Gibt an, ob der Button hervorgehoben wird. Default: false.                                                                                                                                                    |
| luxFlat          | boolean         | Gibt an, ob der Link als flacher, gefüllter Button dargestellt wird (nur zusammen mit `luxColor`). Default: false.                                                                                            |
| luxStroked       | boolean         | Gibt an, ob der Link als Button mit Rahmen dargestellt wird. Default: false.                                                                                                                                  |
| luxIconName      | string          | Ein LUX-Iconname.                                                                                                                                                                                             |
| luxIconShowRight | boolean         | Gibt an, ob das Icon rechts angezeigt wird. Default: false.                                                                                                                                                   |
| luxTagId         | string          | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                 |
| luxDisabled      | boolean         | Gibt an, ob das Element deaktiviert ist. Default: false.                                                                                                                                                      |
| luxRounded       | boolean         | Gibt an, ob ein runder Button verwendet werden soll. Default: false.                                                                                                                                          |

### @Output

| Name       | Typ   | Beschreibung                                                                                          |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------- |
| luxClicked | Event | Event welches beim Klick auf den Button ausgelöst wird und einen Clicked-Event als Parameter enthält. |

## Beispiele

### 1. Normale Links

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐link-v22-img-01.png)

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-link luxLabel="Lorem ohne" luxHref="http://www.ihk-gfi.de" />
  <lux-link
    luxLabel="Lorem primary"
    luxHref="http://www.ihk-gfi.de"
    luxColor="primary"
  />
  <lux-link
    luxLabel="Lorem accent"
    luxHref="http://www.ihk-gfi.de"
    luxColor="accent"
  />
  <lux-link
    luxLabel="Lorem warn"
    luxHref="http://www.ihk-gfi.de"
    luxColor="warn"
  />
</div>
```

### 2. Flat Links

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐link-v22-img-02.png)

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem ohne"
    luxHref="http://www.ihk-gfi.de"
  />
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem primary"
    luxHref="http://www.ihk-gfi.de"
    luxColor="primary"
  />
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem accent"
    luxHref="http://www.ihk-gfi.de"
    luxColor="accent"
  />
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem warn"
    luxHref="http://www.ihk-gfi.de"
    luxColor="warn"
  />
</div>
```

### 3. Links mit Icons

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐link-v22-img-03.png)

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem ohne"
    luxHref="http://www.ihk-gfi.de"
  />
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem primary"
    luxColor="primary"
    luxHref="http://www.ihk-gfi.de"
  />
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem warn"
    luxColor="warn"
    luxHref="http://www.ihk-gfi.de"
  />
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem accent"
    luxColor="accent"
    luxHref="http://www.ihk-gfi.de"
  />
</div>
```

## Zusatzinformationen

### Konfigurationsoptionen

Standardmäßig werden die Texte der Links **nicht** in Großbuchstaben angezeigt.

Über die [LUX-Components-Config](config-v22) (`labelConfiguration.allUppercase: true` in `provideLuxComponentsConfig()`) kann festgelegt werden, dass die Texte in Großbuchstaben ausgegeben werden.
Will man die LuxLinks davon ausnehmen, muss der Selektor "lux-link" in `labelConfiguration.notAppliedTo` eingetragen werden.
