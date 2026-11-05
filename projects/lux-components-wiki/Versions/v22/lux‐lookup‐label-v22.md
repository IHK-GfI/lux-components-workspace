# LUX-Lookup-Label

![Beispielbild LUX-Lookup-Label](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐lookup‐label-v22-img.png)

- [LUX-Lookup-Label](#lux-lookup-label)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung     |
| -------- | ---------------- |
| selector | lux-lookup-label |

### @Input

| Name           | Typ              | Beschreibung                                                                                                                                                                                        |
| -------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxLookupKnr   | number           | Eine 3-stellige Kammernummer (z.B. 101)                                                                                                                                                             |
| luxLookupUrl   | string           | Eine Url für den Lookup-Service. Default: '/lookup/'.                                                                                                                                               |
| luxLookupId    | string           | Enthält die ID, die diese Lookup-Komponente kennzeichnet. Wichtig: Muss definiert sein, da der LuxLookupHandler das Laden der Daten hierüber anstößt. Default: ''.                                  |
| luxTableNo     | string           | Bestimmt die Schlüsseltabelle, aus welcher die Daten geladen werden sollen (als String, z.B. '500211').                                                                                             |
| luxTableKey    | string           | Bestimmt den Key des Schlüsseltabelleneintrags, dessen Bezeichnung im Label gezeigt werden soll.                                                                                                    |
| luxFields      | LuxFieldValues[] | Enthält die Felder, die in den Resultaten angezeigt werden sollen. Mögliche Werte sind in dem entsprechenden Enum (siehe _LuxLookupParameters_) zu finden.                                          |
| luxBezeichnung | string           | Bestimmt, ob die Lang- oder Kurzbezeichnung des Schlüsseltabelleneintrags gezeigt werden soll. 'kurz': Kurzbezeichnung 'lang': Langbezeichnung (beiden Zeilen der Langbezeichnung) Default: 'kurz'. |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐lookup‐label-v22-img-01.png)

Html

```html
<lux-lookup-label
  luxLookupId="beispiel"
  [luxLookupKnr]="101"
  luxTableNo="1002"
  luxTableKey="4"
  luxBezeichnung="lang"
/>
```
