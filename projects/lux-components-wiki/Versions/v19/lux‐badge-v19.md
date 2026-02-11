# LUX-Badge

![Beispielbild LUX-Badge](lux‐badge-v19-img.png)

- [LUX-Badge](#lux-badge)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
      - [ng-content](#ng-content)
  - [Beispiel](#beispiel)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| selector | lux-badge       |

### @Input

| Name         | Typ           | Beschreibung                                                                                                    |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------------- |
| luxUppercase | boolean       | Bestimmt ob der Text innerhalb der Badge nur mit Großbuchstaben dargestellt wird.                               |
| luxIconName  | string        | Enthält den Namen des Icons, welches für die Badge angezeigt werden soll (z.B. 'lux-interface-setting-menu-1'). |
| luxColor     | LuxBadgeColor | Bestimmt die Hintergrundfarbe und davon abhängig die Schrift- farbe des Badges.                                 |

#### ng-content

| Name                       | Typ | Beschreibung                |
| -------------------------- | --- | --------------------------- |
| [lux-label](lux‐label-v19) |     | Die Bezeichnung des Badges. |

## Beispiel

![Beispielbild 01](lux‐badge-v19-img-01.png)

Html

```html
<lux-badge luxIconName="lux-interface-user-single" luxColor="red">
  <lux-label luxId="Badge_red">Badge</lux-label>
</lux-badge>
<lux-badge luxIconName="lux-interface-user-single" luxColor="blue">
  <lux-label luxId="Badge_blue">Badge</lux-label>
</lux-badge>
<lux-badge luxIconName="lux-interface-user-single" luxColor="green">
  <lux-label luxId="Badge_green">Badge</lux-label>
</lux-badge>
<lux-badge luxIconName="lux-interface-user-single" luxColor="gray">
  <lux-label luxId="Badge_gray">Badge</lux-label>
</lux-badge>
<lux-badge luxIconName="lux-interface-user-single" luxColor="orange">
  <lux-label luxId="Badge_orange">Badge</lux-label>
</lux-badge>
<lux-badge luxIconName="lux-interface-user-single" luxColor="brown">
  <lux-label luxId="Badge_brown">Badge</lux-label>
</lux-badge>
<lux-badge luxIconName="lux-interface-user-single">
  <lux-label luxId="Badge_no_color">Badge ohne Farbe</lux-label>
</lux-badge>
<lux-badge luxColor="red" [luxUppercase]="false">
  <lux-label luxId="Badge_no_icon">Badge ohne Icon</lux-label>
</lux-badge>
```
