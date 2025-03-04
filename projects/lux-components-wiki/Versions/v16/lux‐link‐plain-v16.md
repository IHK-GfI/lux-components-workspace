# LUX-Link-Plain

![Beispielbild LUX-Link-Plain](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐link‐plain-v16-img.png)

- [LUX-Link-Plain](#lux-link-plain)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Beispiele](#beispiele)
    - [1. Normale Links](#1-normale-links)
    - [2. Links mit Icons](#2-links-mit-icons)
    - [3. Links mit Custom-Class](#3-links-mit-custom-class)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxActionModule |
| selector | lux-link-plain  |

### @Input

| Name             | Typ     | Beschreibung                                                                                                                                                                                     |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxHref          | string  | Der Href-Inhalt (z.B. [http://www.ihk-gfi.de](http://www.ihk-gfi.de)). Wenn der luxHref ohne http beginnt, navigiert der LuxLink innerhalb der Angular-Applikation (also auf andere Components). |
| luxBlank         | boolean | Ermöglicht es, externe Links in einem neuen Tab zu öffnen.                                                                                                                                       |
| luxLabel         | string  | Bestimmt das Label, welches in dieser Component angezeigt werden soll.                                                                                                                           |
| luxIconName      | string  | Ein LUX-Iconname.                                                                                                                                                                                |
| luxIconShowRight | boolean | Gibt an, ob das Icon rechts angezeigt wird.                                                                                                                                                      |
| luxTagId         | string  | [LUX-Tag-Id](luxTagId-v16#direkte-konfiguration) für die automatischen Tests.                                                                                                                    |
| luxDisabled      | boolean | Gibt an, ob das Element deaktiviert ist.                                                                                                                                                         |
| luxCustomClass   | string  | Mit dieser Property kann ein individueller Klassename der Komponente mitgegeben werden.                                                                                                          |

### @Output

| Name       | Typ                   | Beschreibung                                                                                          |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| luxClicked | EventEmitter \<Event> | Event welches beim Klick auf den Button ausgelöst wird und einen Clicked-Event als Parameter enthält. |

## Beispiele

### 1. Normale Links

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐link‐plain-v16-img-01.png)

Html

```html
<p>
  Lorem ipsum dolor sit amet,
  <lux-link-plain
    luxLabel="consetetur"
    luxHref="http://www.ihk-gfi.de"
  ></lux-link-plain>
  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua.
</p>
```

### 2. Links mit Icons

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐link‐plain-v16-img-02.png)

Html

```html
<p>
  Lorem ipsum dolor sit amet, &nbsp;<lux-link-plain
    luxLabel="consetetur"
    luxHref="http://www.ihk-gfi.de"
    luxIconName="lux-interface-link"
  ></lux-link-plain>
  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua.
</p>
<p>
  Lorem ipsum dolor sit amet, &nbsp;<lux-link-plain
    luxLabel="consetetur"
    luxHref="http://www.ihk-gfi.de"
    luxIconName="lux-interface-link"
    [luxIconShowRight]="true"
  ></lux-link-plain>
  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua.
</p>
```

### 3. Links mit Custom-Class

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐link‐plain-v16-img-03.png)

Html

```html
Dies ist ein<lux-link-plain
  luxLabel="Beispiel-Link"
  luxHref="http://www.ihk-gfi.de"
  luxCustomClass="my-custom-class"
></lux-link-plain
>im Fließtext.
```

scss

```scss
.my-custom-class {
  color: var(--lux-theme-accent-color);
  font-weight: 600;
  font-size: larger;
  font-style: italic;
  font-family: Georgia, "Times New Roman", Times, serif;
  margin: 0 0.5em;
}
```
