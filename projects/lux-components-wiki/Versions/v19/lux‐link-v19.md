# LUX-Link

![Beispielbild LUX-Link](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐link-v18-img.png)

- [LUX-Link](#lux-link)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Normale Links](#1-normale-links)
    - [2. Flat Links](#2-flat-links)
    - [2. Links mit Icons](#2-links-mit-icons)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-link        |

### @Input

| Name                  | Typ             | Beschreibung                                                                                                                                                                                     |
| --------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxHref               | string          | Der Href-Inhalt (z.B. [http://www.ihk-gfi.de](http://www.ihk-gfi.de)). Wenn der luxHref ohne http beginnt, navigiert der LuxLink innerhalb der Angular-Applikation (also auf andere Components). |
| luxBlank              | boolean         | Ermöglicht es, externe Links in einem neuen Tab zu öffnen.                                                                                                                                       |
| luxLabel              | string          | Bestimmt das Label, welches in dieser Component angezeigt werden soll.                                                                                                                           |
| luxColor              | LuxThemePalette | Diese Property definiert die Farben der Component.                                                                                                                                               |
| luxRaised             | boolean         | Gibt an, ob der Button hervorgehoben wird.                                                                                                                                                       |
| luxIconName           | string          | Ein LUX-Iconname.                                                                                                                                                                                |
| luxIconShowRight      | boolean         | Gibt an, ob das Icon rechts angezeigt wird.                                                                                                                                                      |
| luxTagId              | string          | [LUX-Tag-Id](luxTagId-v18#direkte-konfiguration) für die automatischen Tests.                                                                                                                    |
| luxDisabled           | boolean         | Gibt an, ob das Element deaktiviert ist.                                                                                                                                                         |
| luxRounded            | boolean         | Gibt an, ob ein runder Button verwendet werden soll.                                                                                                                                             |
| luxIconAlignWithLabel | boolean         | Entfernt die vertikale Zentrierung des Icons, so dass es mit dem Label ausgerichtet ist.                                                                                                         |

### @Output

| Name       | Typ                   | Beschreibung                                                                                          |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| luxClicked | EventEmitter \<Event> | Event welches beim Klick auf den Button ausgelöst wird und einen Clicked-Event als Parameter enthält. |

## Beispiele

### 1. Normale Links

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐link-v18-img-01.png)

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-link luxLabel="Lorem ohne" luxHref="http://www.ihk-gfi.de"></lux-link>
  <lux-link
    luxLabel="Lorem primary"
    luxHref="http://www.ihk-gfi.de"
    luxColor="primary"
  ></lux-link>
  <lux-link
    luxLabel="Lorem accent"
    luxHref="http://www.ihk-gfi.de"
    luxColor="accent"
  ></lux-link>
  <lux-link
    luxLabel="Lorem warn"
    luxHref="http://www.ihk-gfi.de"
    luxColor="warn"
  ></lux-link>
</div>
```

### 2. Flat Links

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐link-v18-img-02.png)

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem ohne"
    luxHref="http://www.ihk-gfi.de"
  ></lux-link>
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem primary"
    luxHref="http://www.ihk-gfi.de"
    luxColor="primary"
  ></lux-link>
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem accent"
    luxHref="http://www.ihk-gfi.de"
    luxColor="accent"
  ></lux-link>
  <lux-link
    [luxFlat]="true"
    luxLabel="Lorem warn"
    luxHref="http://www.ihk-gfi.de"
    luxColor="warn"
  ></lux-link>
</div>
```

### 2. Links mit Icons

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐link-v18-img-03.png)

Html

```html
<div class="lux-flex lux-gap-4">
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem ohne"
    luxHref="http://www.ihk-gfi.de"
  ></lux-link>
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem primary"
    luxColor="primary"
    luxHref="http://www.ihk-gfi.de"
  ></lux-link>
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem warn"
    luxColor="warn"
    luxHref="http://www.ihk-gfi.de"
  ></lux-link>
  <lux-link
    [luxFlat]="true"
    luxIconName="lux-save"
    luxLabel="Lorem accent"
    luxColor="accent"
    luxHref="http://www.ihk-gfi.de"
  ></lux-link>
</div>
```

## Zusatzinformationen

### Konfigurationsoptionen

Durch Nutzung der [LUX-Components-Config](config-v18) kann für diese Component bestimmt werden, dass der Text immer in Großbuchstaben ausgegeben wird.
Will man die LuxButtons als Ausnahmen für die Ausgabe in Großbuchstaben hinzufügen, muss der Selektor "lux-button" dem Config-Module übergeben werden.

Standardmäßig werden die Texte der Buttons immer in Großbuchstaben angezeigt.
