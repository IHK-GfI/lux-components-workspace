# luxTooltip

![Beispielbild LUX-Tooltip](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/luxTooltip-v22-img.png)

- [luxTooltip](#luxtooltip)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiele](#beispiele)
    - [1. Positionen und Verzögerungen](#1-positionen-und-verzögerungen)
    - [2. Tooltip nur bei abgeschnittenem Text](#2-tooltip-nur-bei-abgeschnittenem-text)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | luxTooltip   |

### @Input

| Name                  | Typ             | Beschreibung                                                                                                                                                                                                                                 |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTooltipDisabled    | boolean         | Bestimmt, ob der Tooltip deaktiviert ist oder nicht. Default: false.                                                                                                                                                                         |
| luxTooltipHideDelay   | number          | Bestimmt die zeitliche Verzögerung in ms, bis der Tooltip ausgeblendet wird. Default: 0.                                                                                                                                                     |
| luxTooltipShowDelay   | number          | Bestimmt die zeitliche Verzögerung in ms, bis der Tooltip eingeblendet wird. Default: 0.                                                                                                                                                     |
| luxTooltip            | string          | Beinhaltet den Text des Tooltips. Default: '???'.                                                                                                                                                                                            |
| luxTooltipPosition    | TooltipPosition | Bestimmt die Position des Tooltips im Verhältnis zum Host-Element. Mögliche Werte: 'below', 'after', 'left', 'right', 'before', 'above' Default: 'above'.                                                                                    |
| luxTooltipIfTruncated | boolean         | Aktiviert den Tooltip nur dann, wenn der Host-Text visuell gekürzt wird — horizontal (`scrollWidth > clientWidth`, z.B. `text-overflow: ellipsis`) oder vertikal (`scrollHeight > clientHeight`, z.B. `-webkit-line-clamp`). Default: false. |

## Beispiele

### 1. Positionen und Verzögerungen

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/luxTooltip-v22-img-01.png)

Html

```html
<div
  class="lux-flex lux-flex-col lux-gap-6 lux-items-center"
  style="margin: 50px"
>
  <div luxTooltip="Tooltip" luxTooltipPosition="above">Tooltip oben</div>
  <div luxTooltip="Tooltip" luxTooltipPosition="after">Tooltip after</div>
  <div luxTooltip="Tooltip" luxTooltipPosition="below">Tooltip unten</div>
  <div luxTooltip="Tooltip" luxTooltipPosition="before">Tooltip before</div>
  <div
    luxTooltip="Tooltip"
    luxTooltipPosition="above"
    [luxTooltipHideDelay]="2000"
  >
    Tooltip oben, Hide-Delay = 2s
  </div>
  <div
    luxTooltip="Tooltip"
    luxTooltipPosition="left"
    [luxTooltipShowDelay]="2000"
  >
    Tooltip links, Show-Delay = 2s
  </div>
  <div luxTooltip="Tooltip" [luxTooltipDisabled]="true">Tooltip disabled</div>
</div>
```

### 2. Tooltip nur bei abgeschnittenem Text

Wenn `luxTooltipIfTruncated` gesetzt ist, bleibt der Tooltip deaktiviert, solange der Text vollständig in den Host passt. Erst bei visuell abgeschnittenem Inhalt wird der Tooltip aktiviert.

Html

```html
<div
  luxTooltip="Langer Text für den Tooltip"
  [luxTooltipIfTruncated]="true"
  class="lux-truncated-demo"
  style="display: block; width: 180px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
>
  Langer Text für den Tooltip
</div>
```
