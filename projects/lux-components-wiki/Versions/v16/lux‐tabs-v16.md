# LUX-Tabs

![Beispielbild LUX-Tabs](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐tabs-v16-img.png)

- [LUX-Tabs](#lux-tabs)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
    - [@Output](#output)
  - [Components](#components)
    - [LuxTabComponent](#luxtabcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
  - [Classes / Interfaces](#classes--interfaces)
  - [Beispiele](#beispiele)
    - [1. Simple Tabs](#1-simple-tabs)
    - [2. Tabs mit Zahl](#2-tabs-mit-zahl)
    - [3. Tabs mit großen deaktivierten Icons](#3-tabs-mit-großen-deaktivierten-icons)
    - [4. Tab in eigene Komponente auslagern](#4-tab-in-eigene-komponente-auslagern)

## Overview / API

### Allgemein

| Name     | Beschreibung    |
| -------- | --------------- |
| import   | LuxLayoutModule |
| selector | lux-tabs        |

### @Input

| Name                  | Typ     | Beschreibung                                                                                                                                   |
| --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTabAnimationActive | boolean | Bestimmt ob die Animation für das Ein- und Ausblenden der einzelnen Tab-Inhalte angezeigt wird.                                                |
| luxActiveTab          | number  | Bestimmt den Starttab, der immer angezeigt werden soll. Wenn der Wert größer als die maximale Anzahl an Tabs ist wird der letzte Tab genommen. |
| luxIconSize           | string  | Bestimmt die Größe der Icons innerhalb der Tab-Header, mögliche Werte analog zu denen der LuxIcons (1x,2x,3x,4x,5x).                           |
| luxTagId              | string  | [LUX-Tag-Id](luxTagId-v16#direkte-konfiguration) für die automatischen Tests.                                                                  |
| luxDisplayDivider     | boolean | Bestimmt, ob der Trennstrich angezeigt wird. Mit Version 1.7.8 wird er Standardwert auf true geändert.                                         |
| luxLazyLoading        | boolean | Bestimmt, ob die Tabs ihre Inhaltskomponenten direkt laden oder erst wenn ein Tab ausgewählt wird.                                             |

### @Output

| Name                | Typ                               | Beschreibung                                                                                                 |
| ------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| luxActiveTabChanged | EventEmitter \<MatTabChangeEvent> | Event das ausgegeben wird, wenn sich der aktive Tab ändert. Gibt die Nummer des Tabs und das Tab-Objekt mit. |

## Components

### LuxTabComponent

Diese Component stellt einen einzelnen Tab in der aktuellen LuxTabsComponent dar.
Sie besitzt einen Header- und Content-Bereich und ist auch in der Lage, den Content asynchron (also erst beim Ansteuern des jeweiligen Tabs) zu laden.

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-tab      |

#### @Input

| Name                | Typ                           | Beschreibung                                                                                                                                                                                                                              |
| ------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxTitle            | string                        | Property für den Text, der im Tab selbst angezeigt wird. Wird bei Smartphone-Ansichten (.sm) ausgeblendet.                                                                                                                                |
| luxIconName         | string                        | Property für das Icon, welches im Tab angezeigt wird.                                                                                                                                                                                     |
| luxImageSrc         | string                        | Property für das Bild, welches im Tab angezeigt wird. Wenn `luxIconName` gesetzt ist, wird diese Property ignoriert. D.h. es kann entweder `luxIconName` oder `luxImageSrc` verwendet werden, aber nicht beides.                          |
| luxImageAlign       | 'left' \| 'center' \| 'right' | Die Ausrichtung des Bildes (siehe luxImageSrc).                                                                                                                                                                                           |
| luxImageWidth       | string                        | Die Ausrichtung des Bildes (siehe luxImageSrc).                                                                                                                                                                                           |
| luxImageHeight      | string                        | Die Ausrichtung des Bildes (siehe luxImageSrc).                                                                                                                                                                                           |
| luxCounter          | number                        | Property für einen optionalen Counter, welcher rechts vom Text im Tab angezeigt wird. Wird bei Smartphone-Ansichten (.sm) ausgeblendet. (ab 1.7.14 wird der Counter auch in mobilen Ansichten angezeigt)                                  |
| luxCounterCap       | number                        | Property die bestimmt bis zu welcher Zahl der Counter angezeigt werden soll. Höhere Zahlen werden mithilfe eines "+"-Symbols dargestellt (z.B. counter = 100, counterCap = 99 ==> Ausgabe: 99+)                                           |
| luxShowNotification | boolean                       | Property die bestimmt ob und wie das Notifizierungssymbol angezeigt wird. Wenn der Wert true ist, wird ein aktives Symbol angezeigt, bei false ein ausgegrautes und bei undefined wird gar kein Symbol angezeigt. Default-Wert: undefined |
| luxDisabled         | boolean                       | Bestimmt ob der Tab deaktiviert ist oder nicht. Default-Wert: false                                                                                                                                                                       |
| luxTagIdHeader      | string                        | [LUX-Tag-Id](luxTagId-v16#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                             |
| luxTagIdContent     | string                        | [LUX-Tag-Id](luxTagId-v16#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                             |

## Classes / Interfaces

## Beispiele

### 1. Simple Tabs

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐tabs-v16-img-01.png)

Html

```html
<lux-tabs>
  <lux-tab luxTitle="Informationen" luxIconName="lux-info">
    <ng-template>
      <h2>Hier finden Sie alle Informationen</h2>
    </ng-template>
  </lux-tab>
  <lux-tab luxTitle="Lesezeichen" luxIconName="lux-interface-bookmark">
    <ng-template>
      <p>Lesezeichen hier</p>
    </ng-template>
  </lux-tab>
  <lux-tab
    luxTitle="Einstellungen"
    luxIconName="lux-interface-setting-tool-box"
  >
    <ng-template>
      <p>Einstellungen hier</p>
    </ng-template>
  </lux-tab>
</lux-tabs>
```

### 2. Tabs mit Zahl

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐tabs-v16-img-02.png)

Html

```html
<lux-tabs>
  <lux-tab
    luxTitle="Informationen"
    luxIconName="lux-info"
    [luxCounter]="10"
    [luxCounterCap]="20"
  >
    <ng-template>
      <h2>Hier finden Sie alle Informationen</h2>
    </ng-template>
  </lux-tab>
  <lux-tab
    luxTitle="Lesezeichen"
    luxIconName="lux-interface-bookmark"
    [luxCounter]="20"
    [luxCounterCap]="10"
  >
    <ng-template>
      <p>Lesezeichen hier</p>
    </ng-template>
  </lux-tab>
  <lux-tab
    luxTitle="Einstellungen"
    luxIconName="lux-interface-setting-tool-box"
    [luxCounter]="5"
    [luxShowNotification]="true"
  >
    <ng-template>
      <p>Einstellungen hier</p>
    </ng-template>
  </lux-tab>
</lux-tabs>
```

### 3. Tabs mit großen deaktivierten Icons

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐tabs-v16-img-03.png)

Html

```html
<lux-tabs luxIconSize="4x">
  <lux-tab luxTitle="Informationen" luxIconName="lux-info" [luxDisabled]="true">
    <ng-template>
      <h2>Hier finden Sie alle Informationen</h2>
    </ng-template>
  </lux-tab>
  <lux-tab
    luxTitle="Lesezeichen"
    luxIconName="lux-interface-bookmark"
    [luxDisabled]="true"
  >
    <ng-template>
      <p>Lesezeichen hier</p>
    </ng-template>
  </lux-tab>
  <lux-tab
    luxTitle="Einstellungen"
    luxIconName="lux-interface-setting-tool-box"
    [luxDisabled]="true"
  >
    <ng-template>
      <p>Einstellungen hier</p>
    </ng-template>
  </lux-tab>
</lux-tabs>
```

### 4. Tab in eigene Komponente auslagern

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components/Versions/v16/lux‐tabs-v16-img-04.png)

Html - Tabs

```html
<lux-tabs>
  <custom-tab></custom-tab>

  <lux-tab luxTitle="Lesezeichen" luxIconName="lux-interface-bookmark">
    <ng-template>
      <p>Lesezeichen</p>
    </ng-template>
  </lux-tab>

  <lux-tab
    luxTitle="Einstellungen"
    luxIconName="lux-interface-setting-tool-box"
  >
    <ng-template>
      <p>Einstellungen</p>
    </ng-template>
  </lux-tab>
</lux-tabs>
```

Html - Custom Tab

```html
<ng-template>
  <p>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
    voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
    nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
    diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet.
  </p>
</ng-template>
```

Ts - Custom Tab

```typescript
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";

@Component({
  selector: "custom-tab",
  templateUrl: "./custom-tab.component.html",
  styleUrls: ["./custom-tab.component.scss"],
  providers: [{ provide: LuxTabComponent, useExisting: CustomTabComponent }],
})
export class CustomTabComponent
  extends LuxTabComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(TemplateRef) myContentTemplate!: TemplateRef<any>;

  constructor(
    private cdr: ChangeDetectorRef,
    public elementRef: ElementRef,
  ) {
    super();
  }

  ngOnInit() {
    this.luxTitle = "Custom Tab";
    this.luxIconName = "lux-interface-user-single";
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.contentTemplate = this.myContentTemplate;
    });
  }
}
```
