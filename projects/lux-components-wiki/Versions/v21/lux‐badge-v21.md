# LUX-Badge

![Beispielbild LUX-Badge](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐badge-v21-img.png)

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

| Name         | Typ           | Beschreibung                                                                                                                                     |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxUppercase | boolean       | Bestimmt, ob der Text innerhalb der Badge nur mit Großbuchstaben dargestellt wird.                                                               |
| luxIconName  | string        | Enthält den Namen des Icons, welches für die Badge angezeigt werden soll (z.B. 'lux-interface-setting-menu-1').                                  |
| luxColor     | LuxBadgeColor | Bestimmt die Hintergrundfarbe und abhängig davon die Schriftfarbe des Badges.                                                                    |
| luxMuted     | boolean       | Aktiviert die Muted-Darstellung: heller Hintergrund (Fill) mit farbigem Rahmen (Stroke). Konform mit WCAG AAA.                                   |
| luxSize      | LuxBadgeSize  | Setzt die Schriftgröße des Badges: 'small' (12px), 'medium' (16px), 'large' (20px). Ohne Angabe wird die Schriftgröße vom Parent-Element geerbt. |

#### ng-content

| Name                       | Typ | Beschreibung                |
| -------------------------- | --- | --------------------------- |
| [lux-label](lux‐label-v21) |     | Die Bezeichnung des Badges. |

## Beispiel - normal

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐badge-v21-img-01.png)

Html

```html
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="small">
    <lux-label luxId="Badge_blue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="small">
    <lux-label luxId="Badge_green">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="small">
    <lux-label luxId="Badge_red">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="small">
    <lux-label luxId="Badge_orange">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="small">
    <lux-label luxId="Badge_yellow">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="small">
    <lux-label luxId="Badge_lightblue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="small">
    <lux-label luxId="Badge_pink">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="small">
    <lux-label luxId="Badge_gray">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="small">
    <lux-label luxId="Badge_black">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="small">
    <lux-label luxId="Badge_purple">Badge</lux-label>
  </lux-badge>
</div>
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="medium">
    <lux-label luxId="Badge_blue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="medium">
    <lux-label luxId="Badge_green">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="medium">
    <lux-label luxId="Badge_red">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="medium">
    <lux-label luxId="Badge_orange">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="medium">
    <lux-label luxId="Badge_yellow">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="medium">
    <lux-label luxId="Badge_lightblue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="medium">
    <lux-label luxId="Badge_pink">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="medium">
    <lux-label luxId="Badge_gray">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="medium">
    <lux-label luxId="Badge_black">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="medium">
    <lux-label luxId="Badge_purple">Badge</lux-label>
  </lux-badge>
</div>
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" luxSize="large">
    <lux-label luxId="Badge_blue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" luxSize="large">
    <lux-label luxId="Badge_green">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" luxSize="large">
    <lux-label luxId="Badge_red">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" luxSize="large">
    <lux-label luxId="Badge_orange">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" luxSize="large">
    <lux-label luxId="Badge_yellow">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" luxSize="large">
    <lux-label luxId="Badge_lightblue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" luxSize="large">
    <lux-label luxId="Badge_pink">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" luxSize="large">
    <lux-label luxId="Badge_gray">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" luxSize="large">
    <lux-label luxId="Badge_black">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" luxSize="large">
    <lux-label luxId="Badge_purple">Badge</lux-label>
  </lux-badge>
</div>
```

## Beispiel - muted

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v21/lux‐badge-v21-img-02.png)

Html

```html
<div class="lux-flex lux-gap-4 lux-m-8">
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="blue" [luxMuted]="true">
    <lux-label luxId="Badge_blue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="green" [luxMuted]="true">
    <lux-label luxId="Badge_green">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="red" [luxMuted]="true">
    <lux-label luxId="Badge_red">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="orange" [luxMuted]="true">
    <lux-label luxId="Badge_orange">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="yellow" [luxMuted]="true">
    <lux-label luxId="Badge_yellow">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="lightblue" [luxMuted]="true">
    <lux-label luxId="Badge_lightblue">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="pink" [luxMuted]="true">
    <lux-label luxId="Badge_pink">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="gray" [luxMuted]="true">
    <lux-label luxId="Badge_gray">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="black" [luxMuted]="true">
    <lux-label luxId="Badge_black">Badge</lux-label>
  </lux-badge>
  <lux-badge luxIconName="lux-interface-user-single" [luxUppercase]="false" luxColor="purple" [luxMuted]="true">
    <lux-label luxId="Badge_purple">Badge</lux-label>
  </lux-badge>
</div>
```
