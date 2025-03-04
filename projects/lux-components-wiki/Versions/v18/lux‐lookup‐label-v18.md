# LUX-Lookup-Label

![Beispielbild LUX-Lookup-label](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐lookup‐label-v18-img.png)

- [LUX-Lookup-Label](#lux-lookup-label)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung     |
| -------- | ---------------- |
| import   | LuxLookupModule  |
| selector | lux-lookup-label |

### @Input

| Name             | Typ      | Beschreibung                                                                                                                                                                      |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lux-lookup-label | Selector | Selector                                                                                                                                                                          |
| luxLookupKnr     | number   | Eine 3-stellige Kammernummer (z.B. 101)                                                                                                                                           |
| luxLookupUrl     | string   | Eine Url für den Lookup-Service.                                                                                                                                                  |
| luxLookupId      | string   | Enthält die ID, die diese Lookup-Komponente kennzeichnet. Wichtig: Muss definiert sein, da der LuxLookupHandler das Laden der Daten hierüber anstößt.                             |
| luxTableNo       | string   | Bestimmt die Schlüsseltabelle, aus welcher die Daten geladen werden sollen. Kann einfach als Number-Wert übergeben werden (z.B: 500211)                                           |
| luxTableKey      | string   | Bestimmt den Key des Schlüsseltabelleneintrags, dessen Bezeichnung im Label gezeigt werden soll.                                                                                  |
| luxBezeichnung   | string   | Bestimmt, ob die Lang- oder Kurzbezeichnung des Schlüsseltabelleneintrags gezeigt werden soll. 'kurz': Kurzbezeichung 'lang': Langbezeichnung (beiden Zeilen der Langbezeichnung) |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v18/lux‐lookup‐label-v18-img-01.png)

Html

```html
<lux-lookup-label
  luxLookupId="beispiel"
  [luxLookupKnr]="101"
  luxTableNo="1002"
  luxTableKey="4"
  luxBezeichnung="lang"
>
</lux-lookup-label>
```
