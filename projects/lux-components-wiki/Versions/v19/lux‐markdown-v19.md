# LUX-Markdown

![Beispielbild LUX-Markdown](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐markdown-v19-img.png)

- [LUX-Markdown](#lux-markdown)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@ViewChild](#viewchild)
  - [Beispiel](#beispiel)

## Overview / API

Wichtig! Bevor die Komponente verwendet werden kann, muss die Dependency "marked" in der package.json hinzugefügt
werden.

### Allgemein

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-markdown      |
| import   | @ihk-gfi/lux-components/lux-markdown |

### @Input

| Name              | Typ                                                 | Beschreibung                                                 |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| luxData           | string                                              | Daten im Markdown-Format                                     |
| luxSanitizeConfig | [LuxSanitizeConfig](lux‐html-v19#LuxSanitizeConfig) | Über dieses Property kann das Sanitizing beeinflusst werden. |
| luxStyle          | string                                              | Über dieses Property können CSS-Styles gesetzt werden.       |
| luxClass          | string                                              | Über dieses Property können CSS-Klassen gesetzt werden.      |

### @ViewChild

| Name             | Typ                              | Beschreibung                                                                               |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| contentComponent | [LuxHtmlComponent](lux‐html-v19) | Die Markdown-Daten werden in HTML transformiert und über die LuxHtmlComponent dargestellt. |
| contentRef       | ElementRef                       | Die Markdown-Daten werden in HTML transformiert und über die LuxHtmlComponent dargestellt. |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐markdown-v19-img-01.png)

Ts

```typescript
markdownData = `# Title
## Subtitle
Show doch mal bei der [IHK-GfI](https://www.ihk-gfi.de) vorbei!

### Tabelle
| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-markdown      |

### Aufzählung
1. A
1. B
    1. B1
    1. B2
1. C`;
```

Html

```html
<lux-card luxTitle="Markdown">
  <lux-card-content>
    <lux-markdown [luxData]="markdownData"></lux-markdown>
  </lux-card-content>
</lux-card>
```
