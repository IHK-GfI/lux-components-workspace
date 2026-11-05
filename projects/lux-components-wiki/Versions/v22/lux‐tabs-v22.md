# LUX-Tabs

![Beispielbild LUX-Tabs](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tabs-v22-img.png)

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
    - [LuxBadgeNotificationColor](#luxbadgenotificationcolor)
  - [Beispiele](#beispiele)
    - [1. Simple Tabs](#1-simple-tabs)
    - [2. Tabs mit Zahl](#2-tabs-mit-zahl)
    - [3. Tabs mit großen deaktivierten Icons](#3-tabs-mit-großen-deaktivierten-icons)
    - [4. Tab in eigene Komponente (mit Lazy-Loading) auslagern](#4-tab-in-eigene-komponente-mit-lazy-loading-auslagern)

## Overview / API

### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-tabs     |

### @Input

| Name              | Typ     | Beschreibung                                                                                                                                    |
| ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| luxActiveTab | number | Bestimmt den aktiven Tab (Index). Wenn der Wert größer als die maximale Anzahl an Tabs ist, wird der letzte Tab genommen. Two-Way-Binding über `[(luxActiveTab)]` möglich. Default: 0. |
| luxIconSize | string | Bestimmt die Größe der Icons innerhalb der Tab-Header, mögliche Werte analog zu denen der LuxIcons (1x,2x,3x,4x,5x). Default: '2x'. |
| luxTagId          | string  | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                   |
| luxDisplayDivider | boolean | Bestimmt, ob der Trennstrich angezeigt wird. Default: true. |
| luxLazyLoading | boolean | Bestimmt, ob die Tabs ihre Inhaltskomponenten direkt laden oder erst wenn ein Tab ausgewählt wird. Default: false. |
| luxShowBorder | boolean | Zeigt einen Rahmen um die Tabs an. Default: false. |

### @Output

| Name                | Typ               | Beschreibung                                                                                                 |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------ |
| luxActiveTabChanged | MatTabChangeEvent | Event das ausgegeben wird, wenn sich der aktive Tab ändert. Gibt die Nummer des Tabs und das Tab-Objekt mit. |
| luxActiveTabChange | number | Wird ausgelöst, wenn sich luxActiveTab ändert (Grundlage von `[(luxActiveTab)]`). |

## Components

### LuxTabComponent

Diese Component stellt einen einzelnen Tab in der aktuellen LuxTabsComponent dar.
Sie besitzt einen Header- und Content-Bereich und ist auch in der Lage, den Content asynchron (also erst beim Ansteuern des jeweiligen Tabs) zu laden.
`luxTitle`, `luxTagIdHeader` und `luxTagIdContent` sind als `model()` umgesetzt, damit abgeleitete Tab-Komponenten sie per `set()` setzen können (siehe Beispiel 4).

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-tab      |

#### @Input

| Name                 | Typ                           | Beschreibung                                                                                                                                                                                                                                           |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxTitle | string | Property für den Text, der im Tab selbst angezeigt wird. Wird bei Smartphone-Ansichten (.sm) ausgeblendet. Default: ''. |
| luxIconName          | string                        | Property für das Icon, welches im Tab angezeigt wird.                                                                                                                                                                                                  |
| luxImageSrc          | string                        | Property für das Bild, welches im Tab angezeigt wird. Wenn `luxIconName` gesetzt ist, wird diese Property ignoriert. D.h. es kann entweder `luxIconName` oder `luxImageSrc` verwendet werden, aber nicht beides.                                       |
| luxImageAlign | 'left' \| 'center' \| 'right' | Die Ausrichtung des Bildes (siehe luxImageSrc). Default: 'center'. |
| luxImageWidth        | string                        | Die Breite des Bildes (siehe luxImageSrc). Default-Wert: '36px'                                                                                                                                                                                        |
| luxImageHeight       | string                        | Die Höhe des Bildes (siehe luxImageSrc). Default-Wert: '36px'                                                                                                                                                                                          |
| luxCounter | number | Property für einen optionalen Counter, welcher rechts vom Text im Tab angezeigt wird (auch in mobilen Ansichten). |
| luxCounterCap | number | Property die bestimmt bis zu welcher Zahl der Counter angezeigt werden soll. Höhere Zahlen werden mithilfe eines "+"-Symbols dargestellt (z.B. counter = 100, counterCap = 99 ==> Ausgabe: 99+) Default: 10. |
| luxShowNotification  | boolean                       | Property die bestimmt, ob und wie das Notifizierungssymbol angezeigt wird. Wenn der Wert true ist, wird ein aktives Symbol angezeigt, bei false wird das Symbol ausgeblendet und bei undefined wird gar kein Symbol angezeigt. Default-Wert: undefined |
| luxNotificationColor | LuxBadgeNotificationColor     | Bestimmt die Farbe des Notifizierungssymbols. Standardwerte: 'primary', 'warn', 'accent', 'default'. Wird nur berücksichtigt, wenn luxShowNotification true ist. Default-Wert: 'accent'                                                                |
| luxDisabled          | boolean                       | Bestimmt, ob der Tab deaktiviert ist oder nicht. Default-Wert: false                                                                                                                                                                                   |
| luxTagIdHeader       | string                        | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                          |
| luxTagIdContent      | string                        | [LUX-Tag-Id](luxTagId-v22#direkte-konfiguration) für die automatischen Tests.                                                                                                                                                                          |

## Classes / Interfaces

### LuxBadgeNotificationColor

Typ aus `lux-badge-notification.directive.ts`. Wird für `luxNotificationColor` verwendet.

```typescript
export type LuxBadgeNotificationColor = 'primary' | 'warn' | 'accent' | 'default' | string;
```

## Beispiele

### 1. Simple Tabs

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tabs-v22-img-01.png)

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

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tabs-v22-img-02.png)

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
    luxNotificationColor="warn"
  >
    <ng-template>
      <p>Einstellungen hier</p>
    </ng-template>
  </lux-tab>
</lux-tabs>
```

### 3. Tabs mit großen deaktivierten Icons

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tabs-v22-img-03.png)

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

### 4. Tab in eigene Komponente (mit Lazy-Loading) auslagern

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐tabs-v22-img-04.png)

Html - Tabs

```html
<lux-tabs>
  <lux-tab luxTitle="Lesezeichen" luxIconName="lux-interface-bookmark">
    <ng-template>
      <p>Lesezeichen</p>
    </ng-template>
  </lux-tab>

  <app-custom-tab luxIconName="lux-interface-user-single" />

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
  @if (isLoaded()) {
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
  } @else {
    <div>Daten werden geladen...</div>
  }
</ng-template>
```

Ts - Custom Tab

```typescript
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, signal, viewChild } from '@angular/core';
import { LuxTabComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-custom-tab',
  templateUrl: './custom-tab.component.html',
  styleUrls: ['./custom-tab.component.scss'],
  providers: [{ provide: LuxTabComponent, useExisting: CustomTabComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTabComponent extends LuxTabComponent implements OnInit {
  readonly myContentTemplate = viewChild.required(TemplateRef);

  readonly isLoaded = signal(false);

  ngOnInit() {
    // Die Tab-Komponente selbst wird sofort beim Aufbau der Tabs erzeugt (auch wenn der Tab noch nicht aktiv ist),
    // daher läuft ngOnInit bereits dann. Code, der erst beim Aktivieren des Tabs laufen soll, gehört in onTabActivated().
    this.luxTitle.set('Custom Tab');
    this.luxTagIdHeader.set('tab-custom-header');
    this.luxTagIdContent.set('tab-custom-content');
  }

  override getContentTemplate() {
    return this.myContentTemplate();
  }

  override onTabActivated() {
    if (!this.isLoaded()) {
      this.loadData();
    }
  }

  private loadData() {
    // Simuliere einen Backend-Aufruf
    setTimeout(() => {
      this.isLoaded.set(true);
    }, 5000);
  }
}
```
