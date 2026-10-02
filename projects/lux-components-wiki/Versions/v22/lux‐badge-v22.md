# LUX-Badge

![Beispielbild LUX-Badge](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐badge-v22-img.png)

- [LUX-Badge](#lux-badge)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
      - [ng-content](#ng-content)
  - [Beispiel - normal](#beispiel---normal)
  - [Beispiel - muted](#beispiel---muted)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-badge    |

### @Input

| Name         | Typ           | Beschreibung                                                                                                                                                                                               |
| ------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxUppercase | boolean       | Bestimmt, ob der Text innerhalb der Badge nur mit Großbuchstaben dargestellt wird. Default: true.                                                                                                          |
| luxIconName  | string        | Enthält den Namen des Icons, welches für die Badge angezeigt werden soll (z.B. 'lux-interface-setting-menu-1').                                                                                            |
| luxColor     | LuxBadgeColor | Bestimmt die Hintergrundfarbe und abhängig davon die Schriftfarbe des Badges. Mögliche Werte: `blue`, `green`, `red`, `orange`, `yellow`, `lightblue`, `pink`, `gray`, `black`, `purple`. Default: `gray`. |
| luxMuted     | boolean       | Aktiviert die Muted-Darstellung: heller Hintergrund (Fill) mit farbigem Rahmen (Stroke). Konform mit WCAG AAA. Default: false.                                                                             |
| luxSize      | LuxBadgeSize  | Setzt die Schriftgröße des Badges: 'small' (12px), 'medium' (16px), 'large' (20px). Ohne Angabe wird die Schriftgröße vom Parent-Element geerbt. Default: '' (Schriftgröße wird geerbt).                   |

#### ng-content

| Name                       | Typ | Beschreibung                |
| -------------------------- | --- | --------------------------- |
| [lux-label](lux‐label-v22) |     | Die Bezeichnung des Badges. |

## Beispiel - normal

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐badge-v22-img-01.png)

Html

```html
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="small">
    <lux-label luxId="Badge_blue_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="small">
    <lux-label luxId="Badge_green_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="small">
    <lux-label luxId="Badge_red_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="small">
    <lux-label luxId="Badge_orange_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="small">
    <lux-label luxId="Badge_yellow_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="small">
    <lux-label luxId="Badge_lightblue_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="small">
    <lux-label luxId="Badge_pink_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="small">
    <lux-label luxId="Badge_gray_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="small">
    <lux-label luxId="Badge_black_small">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="small">
    <lux-label luxId="Badge_purple_small">Badge</lux-label>
  </lux-badge>
</div>
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="medium">
    <lux-label luxId="Badge_blue_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="medium">
    <lux-label luxId="Badge_green_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="medium">
    <lux-label luxId="Badge_red_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="medium">
    <lux-label luxId="Badge_orange_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="medium">
    <lux-label luxId="Badge_yellow_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="medium">
    <lux-label luxId="Badge_lightblue_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="medium">
    <lux-label luxId="Badge_pink_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="medium">
    <lux-label luxId="Badge_gray_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="medium">
    <lux-label luxId="Badge_black_medium">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="medium">
    <lux-label luxId="Badge_purple_medium">Badge</lux-label>
  </lux-badge>
</div>
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="large">
    <lux-label luxId="Badge_blue_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="large">
    <lux-label luxId="Badge_green_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="large">
    <lux-label luxId="Badge_red_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="large">
    <lux-label luxId="Badge_orange_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="large">
    <lux-label luxId="Badge_yellow_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="large">
    <lux-label luxId="Badge_lightblue_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="large">
    <lux-label luxId="Badge_pink_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="large">
    <lux-label luxId="Badge_gray_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="large">
    <lux-label luxId="Badge_black_large">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="large">
    <lux-label luxId="Badge_purple_large">Badge</lux-label>
  </lux-badge>
</div>
```

## Beispiel - muted

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐badge-v22-img-02.png)

Html

```html
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_blue_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_green_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_red_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_orange_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_yellow_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_lightblue_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_pink_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_gray_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_black_small_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="small" [luxMuted]="true">
    <lux-label luxId="Badge_purple_small_muted">Badge</lux-label>
  </lux-badge>
</div>
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_blue_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_green_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_red_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_orange_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_yellow_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_lightblue_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_pink_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_gray_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_black_medium_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="medium" [luxMuted]="true">
    <lux-label luxId="Badge_purple_medium_muted">Badge</lux-label>
  </lux-badge>
</div>
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_blue_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_green_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_red_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_orange_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_yellow_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_lightblue_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_pink_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_gray_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_black_large_muted">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="large" [luxMuted]="true">
    <lux-label luxId="Badge_purple_large_muted">Badge</lux-label>
  </lux-badge>
</div>
```
