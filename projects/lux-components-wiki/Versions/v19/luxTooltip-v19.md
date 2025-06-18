# luxTooltip

![Beispielbild LUX-Tooltip](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/luxTooltip-v19-img.png)

- [luxTooltip](#luxtooltip)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung        |
| -------- | ------------------- |

| selector | luxTooltip          |

### @Input

| Name                | Typ             | Beschreibung                                                                                                                            |
| ------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| luxTooltipDisabled  | boolean         | Bestimmt ob der Tooltip deaktiviert ist oder nicht.                                                                                     |
| luxTooltipHideDelay | number          | Bestimmt die zeitliche Verzögerung in ms bis der Tooltip ausgeblendet wird.                                                             |
| luxTooltipShowDelay | number          | Bestimmt die zeitliche Verzögerung in ms bis der Tooltip eingeblendet wird.                                                             |
| luxTooltip          | string          | Beinhaltet den Text des Tooltips.                                                                                                       |
| luxTooltipPosition  | TooltipPosition | Bestimmt die Position des Tooltips im Verhältnis zum Host-Element. Mögliche Werte: 'below', 'after', 'left', 'right', 'before', 'after' |
| luxTooltipDisabled  | boolean         | Bestimmt ob der Tooltip deaktiviert ist, oder nicht.                                                                                    |

## Beispiel

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/luxTooltip-v19-img-01.png)

Html

```html
<div
  class="lux-flex lux-flex-col lux-gap-6 lux-items-center"
  style="margin: 50px"
>
  <div luxTooltip="Tooltip" luxTooltipPosition="before">Tooltip before</div>
  <div luxTooltip="Tooltip" luxTooltipPosition="after">Tooltip after</div>
  <div luxTooltip="Tooltip" luxTooltipPosition="above">Tooltip oben</div>
  <div luxTooltip="Tooltip" luxTooltipPosition="below">Tooltip unten</div>
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
