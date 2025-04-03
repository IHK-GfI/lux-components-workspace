# LUX-Textbox

![Beispielbild LUX-Textbox](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐textbox-v18-img.png)

- [LUX-Textbox](#lux-textbox)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Styleguide](#styleguide)
  - [Beispiele](#beispiele)
    - [1. Informationsbox mit einem Icon und einem Titel](#1-informationsbox-mit-einem-icon-und-einem-titel)
    - [2. Textbox mit dem Thema "Success"](#2-textbox-mit-dem-thema-success)
    - [3. Textbox mit dem Thema "Alert"](#3-textbox-mit-dem-thema-alert)
    - [4. Textbox mit dem Thema "Warning"](#4-textbox-mit-dem-thema-warning)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-textbox     |

### @Input

| Name     | Typ             | Beschreibung                                                                     |
| -------- | --------------- | -------------------------------------------------------------------------------- |
| luxTitel | string          | Enthält die optionale Überschrift für die Textbox.                               |
| luxIcon  | string          | Enthält den Iconnamen für ein optionales Icon.                                   |
| luxColor | LuxTextboxColor | Bestimmt das Farbthema der Box. Erlaubte Werte 'blue', 'green', 'yellow', 'red'. |

## Styleguide

Mit der lux-textbox können wichtige textuelle Hinweise innerhalb der Anwendung optisch hervorgehoben haben. Sie orientiert sich dabei an gängigen Themen wie Information, Tipp/Success, Hinweis/Alert und Warnung.
Das Thema wird über die Property luxColor gewählt, Vorschläge für entsprechende Icons sind hier oder in der Demo-Anwendung zu finden.
Die Breite der Textbox ist flexibel und sollte je nach Anwendungsfall mit einer passenenden "max-width" versehen werden.
Die Textboxen sollten gezielt eingesetzt werden, möglichst eine pro Seite.
Der eigentliche Inhalt der Box wird via Content-Projection hinzugefügt. Da es sich um eine reine Styling-Komponente handelt, sollten keine Funktionalitäten (Buttons, Tabs o.ä.) eingefügt werden.
Für Links empfehlen wir lux-link-plain zu verwenden.

## Beispiele

### 1. Informationsbox mit einem Icon und einem Titel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐textbox-v18-img-01.png)

Html

```html
<lux-textbox
  luxTitle="Information"
  luxIcon="lux-interface-alert-information-circle"
  luxColor="blue"
>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo itaque
    accusamus...
  </p>
</lux-textbox>
```

### 2. Textbox mit dem Thema "Success"

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐textbox-v18-img-02.png)

Html

```html
<lux-textbox
  luxTitle="Tipp"
  luxIcon="lux-interface-validation-check-circle"
  luxColor="green"
>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo itaque
    accusamus...
  </p>
</lux-textbox>
```

### 3. Textbox mit dem Thema "Alert"

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐textbox-v18-img-03.png)

Html

```html
<lux-textbox
  luxTitle="Hinweis"
  luxIcon="lux-interface-alert-warning-triangle"
  luxColor="yellow"
>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo itaque
    accusamus...
  </p>
</lux-textbox>
```

### 4. Textbox mit dem Thema "Warning"

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐textbox-v18-img-03.png)

Html

```html
<lux-textbox
  luxTitle="WARNUNG"
  luxIcon="lux-interface-alert-warning-diamond"
  luxColor="red"
>
  <p>
    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo itaque
    accusamus...
  </p>
</lux-textbox>
```
