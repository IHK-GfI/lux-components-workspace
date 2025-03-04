# LUX-Html

![Beispielbild LUX-Html](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐html-v15-img.png)

- [LUX-Html](#lux-html)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@ViewChild](#viewchild)
  - [Classes / Interfaces](#classes--interfaces)
    - [LuxSanitizeConfig](#luxsanitizeconfig)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

Wichtig! Bevor die Komponente verwendet werden kann, muss die Dependency "dompurify" in der package.json hinzugefügt
werden.

| Name     | Beschreibung  |
| -------- | ------------- |
| import   | LuxHtmlModule |
| selector | lux-html      |

### @Input

| Name              | Typ               | Beschreibung                                                           |
| ----------------- | ----------------- | ---------------------------------------------------------------------- |
| luxData           | string            | Daten im Html-Format                                                   |
| luxSanitizeConfig | LuxSanitizeConfig | Über dieses Property kann das Sanitizing beeinflusst werden.           |
| luxFlex           | string            | Über dieses Property kann das FlexLayout-Verhalten beeinflusst werden. |
| luxStyle          | string            | Über dieses Property können CSS-Styles gesetzt werden.                 |
| luxClass          | string            | Über dieses Property können CSS-Klassen gesetzt werden.                |

### @ViewChild

| Name       | Typ        | Beschreibung                              |
| ---------- | ---------- | ----------------------------------------- |
| contentRef | ElementRef | Referenz auf das Div mit dem Html-Inhalt. |

## Classes / Interfaces

### LuxSanitizeConfig

Diese Klasse ermöglicht die Konfiguration beim Sanitizing.

| Name            | Typ      | Beschreibung                                                                                  |
| --------------- | -------- | --------------------------------------------------------------------------------------------- |
| allowedTags     | string[] | Ein Array mit erlaubten Tags.                                                                 |
| allowedAttrs    | string[] | Ein Array mit erlaubten Attributen                                                            |
| addAllowedTags  | string[] | Ein Array mit zusätzlich erlaubten Tags. D.h. Default-Tags plus die aus dem Array.            |
| addAllowedAttrs | string[] | Ein Array mit zusätzlich erlaubten Attributen. D.h. Default-Attribute plus die aus dem Array. |
| forbiddenTags   | string[] | Ein Array mit den verbotenen Tags.                                                            |
| forbiddenAttrs  | string[] | Ein Array mit den Verbotenden Attributen.                                                     |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v15/lux‐html-v15-img-01.png)

Ts

```typescript
htmlData = `<h1>Lorem ipsum</h1>
<p><b>Lorem ipsum</b> dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
   dolore magna aliquyam erat, sed diam voluptua.
   <script>alert('Unsicher!!!!')</script>
   At vero eos et accusam et justo duo dolores et ea rebum.</p>

<p>Stet clita kasd gubergren, no sea takimata sanctus est <span style="color: red">Lorem ipsum</span> dolor sit amet.
   Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
   magna aliquyam erat, sed diam voluptua.</p>

<p>Schau doch mal bei der <a href="https://www.ihk-gfi.de" target="_blank">IHK-Gfi</a> vorbei. </p>`;
```

Html

```html
<lux-card luxTitle="HTML">
  <lux-card-content>
    <lux-html [luxData]="htmlData"></lux-html>
  </lux-card-content>
</lux-card>
```
