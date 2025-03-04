# LUX-Link

![Beispielbild LUX-Link](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐link-v14-img.png)

- [LUX-Link](#lux-link)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Normale Links](#1-normale-links)
    - [2. Raised Links](#2-raised-links)
    - [2. Links mit Icons](#2-links-mit-icons)
  - [Zusatzinformationen](#zusatzinformationen)
    - [Konfigurationsoptionen](#konfigurationsoptionen)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxActionModule |
| selector | lux-link        |

### @Input

| Name                  | Typ             | Beschreibung                                                                                                                                                                                     |
| --------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxHref               | string          | Der Href-Inhalt (z.B. [http://www.ihk-gfi.de](http://www.ihk-gfi.de)). Wenn der luxHref ohne http beginnt, navigiert der LuxLink innerhalb der Angular-Applikation (also auf andere Components). |
| luxBlank              | boolean         | Ermöglicht es, externe Links in einem neuen Tab zu öffnen.                                                                                                                                       |
| luxLabel              | string          | Bestimmt das Label, welches in dieser Component angezeigt werden soll.                                                                                                                           |
| luxColor              | LuxThemePalette | Diese Property definiert die Farben der Component.                                                                                                                                               |
| luxRaised             | boolean         | Gibt an, ob der Button hervorgehoben wird.                                                                                                                                                       |
| luxIconName           | string          | Name des Font-Awesome oder Material Icons.                                                                                                                                                       |
| luxIconShowRight      | boolean         | Gibt an, ob das Icon rechts angezeigt wird.                                                                                                                                                      |
| luxTagId              | string          | [LUX-Tag-Id](luxTagId-v14#direkte-konfiguration) für die automatischen Tests.                                                                                                                    |
| luxDisabled           | boolean         | Gibt an, ob das Element deaktiviert ist.                                                                                                                                                         |
| luxRounded            | boolean         | Gibt an, ob ein runder Button verwendet werden soll.                                                                                                                                             |
| luxIconAlignWithLabel | boolean         | Entfernt die vertikale Zentrierung des Icons, so dass es mit dem Label ausgerichtet ist.                                                                                                         |

### @Output

| Name       | Typ                   | Beschreibung                                                                                          |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| luxClicked | EventEmitter \<Event> | Event welches beim Klick auf den Button ausgelöst wird und einen Clicked-Event als Parameter enthält. |

## Beispiele

### 1. Normale Links

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐link-v14-img-01.png)

Html

```html
<lux-link
  [luxRaised]="false"
  luxLabel="Lorem ohne"
  luxHref="http://www.ihk-gfi.de"
></lux-link>
<lux-link
  [luxRaised]="false"
  luxLabel="Lorem primary"
  luxHref="http://www.ihk-gfi.de"
  luxColor="primary"
></lux-link>
<lux-link
  [luxRaised]="false"
  luxLabel="Lorem accent"
  luxHref="http://www.ihk-gfi.de"
  luxColor="accent"
></lux-link>
<lux-link
  [luxRaised]="false"
  luxLabel="Lorem warn"
  luxHref="http://www.ihk-gfi.de"
  luxColor="warn"
></lux-link>
```

### 2. Raised Links

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐link-v14-img-02.png)

Html

```html
<lux-link
  [luxRaised]="true"
  luxLabel="Lorem ohne"
  luxHref="http://www.ihk-gfi.de"
></lux-link>
<lux-link
  [luxRaised]="true"
  luxLabel="Lorem primary"
  luxHref="http://www.ihk-gfi.de"
  luxColor="primary"
></lux-link>
<lux-link
  [luxRaised]="true"
  luxLabel="Lorem accent"
  luxHref="http://www.ihk-gfi.de"
  luxColor="accent"
></lux-link>
<lux-link
  [luxRaised]="true"
  luxLabel="Lorem warn"
  luxHref="http://www.ihk-gfi.de"
  luxColor="warn"
></lux-link>
```

### 2. Links mit Icons

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v14/lux‐link-v14-img-03.png)

Html

```html
<lux-link
  [luxRaised]="true"
  luxIconName="fa-save"
  luxLabel="Lorem ohne"
  luxHref="http://www.ihk-gfi.de"
></lux-link>
<lux-link
  [luxRaised]="true"
  luxIconName="fa-save"
  luxLabel="Lorem primary"
  luxColor="primary"
  luxHref="http://www.ihk-gfi.de"
></lux-link>
<lux-link
  [luxRaised]="true"
  luxIconName="fa-save"
  luxLabel="Lorem warn"
  luxColor="warn"
  luxHref="http://www.ihk-gfi.de"
></lux-link>
<lux-link
  [luxRaised]="true"
  luxIconName="fa-save"
  luxLabel="Lorem accent"
  luxColor="accent"
  luxHref="http://www.ihk-gfi.de"
></lux-link>
```

## Zusatzinformationen

### Konfigurationsoptionen

Durch Nutzung der [LUX-Components-Config](config-v14) kann für diese Component bestimmt werden, dass der Text immer in Großbuchstaben ausgegeben wird.
Will man die LuxButtons als Ausnahmen für die Ausgabe in Großbuchstaben hinzufügen, muss der Selektor "lux-button" dem Config-Module übergeben werden.

Standardmäßig werden die Texte der Buttons immer in Großbuchstaben angezeigt.
