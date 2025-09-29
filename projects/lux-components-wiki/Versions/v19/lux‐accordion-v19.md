# LUX-Accordion

![Beispielbild LUX-Accordion](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img.png)

- [LUX-Accordion](#lux-accordion)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Components](#components)
    - [LuxPanelComponent](#luxpanelcomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [@Output](#output)
    - [LuxPanelHeaderTitleComponent](#luxpanelheadertitlecomponent)
      - [@Input](#input-2)
    - [LuxPanelHeaderDescriptionComponent](#luxpanelheaderdescriptioncomponent)
      - [@Input](#input-3)
    - [LuxPanelContentComponent](#luxpanelcontentcomponent)
    - [LuxPanelActionComponent](#luxpanelactioncomponent)
  - [Beispiele](#beispiele)
    - [1. Accordion](#1-accordion)
    - [2. Panel](#2-panel)
    - [3. Accordion mit Custom-Panel](#3-accordion-mit-custom-panel)
    - [4. Accordion mit verschiedenen Farben](#4-accordion-mit-verschiedenen-farben)
      - [4.1 Accordion mit der Farbe accent](#41-accordion-mit-der-farbe-accent)
      - [4.2 Accordion mit der Farbe warn](#42-accordion-mit-der-farbe-warn)
      - [4.3 Accordion mit der Farbe neutral](#43-accordion-mit-der-farbe-neutral)
    - [5. Accordion mit Toggle Icon links](#5-accordion-mit-toggle-icon-links)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name     | Beschreibung  |
| -------- | ------------- |
| selector | lux-accordion |

### @Input

| Name                     | Typ                                                              | Beschreibung                                                                                     |
| ------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| luxMode                  | LuxModeType (`default` \| `flat`)                                | Gibt an, ob es Abstände zwischen den Panels gibt. <br>`default` = mit Gap <br> `flat` = ohne Gap |
| luxMulti                 | boolean                                                          | Gibt an, ob mehrere Panels aufgeklappt sein können.                                              |
| luxHideToggle            | boolean                                                          | Gibt an, ob das Toggle-Icon ausgeblendet werden soll.                                            |
| luxDisabled              | boolean                                                          | Gibt an, ob das Accordion deaktiviert ist.                                                       |
| luxCollapsedHeaderHeight | string (z.B. `20px` oder `1em`)                                  | Gibt an, wie hoch die Panelheader im eingeklappten Zustand sind.                                 |
| luxExpandedHeaderHeight  | string (z.B. `20px` oder `1em`)                                  | Gibt an, wie hoch die Panelheader im ausgeklappten Zustand sind.                                 |
| luxDynamicHeaderHeight   | boolean                                                          | Gibt an, ob die Headerhöhe automatisch berechnet werden soll                                     |
| luxColor                 | LuxAccordionColor (`primary` \| `accent` \| `warn` \| `neutral`) | Gibt an, welche Farbe der Header haben soll.                                                     |
| luxTogglePosition        | LuxTogglePosition (`after` \| `before`)                          | Gibt an,ob das Toggle Icon rechts oder links angezeigt werden soll. Der Default ist rechts.      |

## Components

### LuxPanelComponent

Eine `LuxPanelComponent` stellt einen ein- und ausklappbaren Bereich dar. Es gibt einen Titel, einen Inhaltsbereich und eine Actionzeile (z.B. für Buttons).

#### Allgemein

| Name     | Beschreibung |
| -------- | ------------ |
| selector | lux-panel    |

#### @Input

| Name                     | Typ                                     | Beschreibung                                                                                |
| ------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------- |
| luxDisabled              | boolean                                 | Gibt an, ob das Panel deaktiviert ist.                                                      |
| luxExpanded              | boolean                                 | Gibt an, ob das Panel aufgeklappt ist. _(Two-Way-Binding möglich)_                          |
| luxHideToggle            | boolean                                 | Gibt an, ob das Toggle-Icon ausgeblendet werden soll.                                       |
| luxCollapsedHeaderHeight | string (z.B. `20px` oder `1em`)         | Gibt an, wie hoch der Header im eingeklappten Zustand ist.                                  |
| luxExpandedHeaderHeight  | string (z.B. `20px` oder `1em`)         | Gibt an, wie hoch der Header im ausgeklappten Zustand ist.                                  |
| luxDynamicHeaderHeight   | boolean                                                          | Gibt an, ob die Headerhöhe automatisch berechnet werden soll                                     |
| luxTogglePosition        | LuxTogglePosition (`after` \| `before`) | Gibt an,ob das Toggle Icon rechts oder links angezeigt werden soll. Der Default ist rechts. |

#### @Output

| Name              | Typ                      | Beschreibung                                                         |
| ----------------- | ------------------------ | -------------------------------------------------------------------- |
| luxOpened         | EventEmitter \<void\>    | Das Event wird geworfen, nachdem das Panel ausgeklappt wurde.        |
| luxClosed         | EventEmitter \<void\>    | Das Event wird geworfen, nachdem das Panel eingelappt wurde.         |
| luxExpandedChange | EventEmitter \<boolean\> | Das Event wird geworfen, wenn das Panel ein- oder ausgeklappt wurde. |

### LuxPanelHeaderTitleComponent

Diese Komponente enthält den Titel des Panels.

| Name     | Beschreibung           |
| -------- | ---------------------- |
| selector | lux-panel-header-title |

#### @Input

| Name                | Typ     | Beschreibung                                              |
| ------------------- | ------- | --------------------------------------------------------- |
| luxTruncated        | boolean | Gibt an, ob der Titel gekürzt wird.                       |
| luxTruncatedTooltip | string  | Der Tooltip wird angezeigt, wenn _luxTruncated=true_ ist. |

### LuxPanelHeaderDescriptionComponent

Diese Komponente kann einen beschreibenden Text rechts neben dem `LuxPanelHeaderTitle` darstellen.

| Name     | Beschreibung                 |
| -------- | ---------------------------- |
| selector | lux-panel-header-description |

#### @Input

| Name                | Typ     | Beschreibung                                              |
| ------------------- | ------- | --------------------------------------------------------- |
| luxTruncated        | boolean | Gibt an, ob der Titel gekürzt wird.                       |
| luxTruncatedTooltip | string  | Der Tooltip wird angezeigt, wenn _luxTruncated=true_ ist. |

### LuxPanelContentComponent

Diese Komponente enthält den Inhalt des Panels.
Der Inhalt wird nur dargestellt, wenn das Panel aufgeklappt ist.

| Name     | Beschreibung      |
| -------- | ----------------- |
| selector | lux-panel-content |

### LuxPanelActionComponent

Diese Komponente kann [Buttons](lux‐button-v19) oder [Links](lux‐link-v19) beinhalten,
die unterhalb des Inhalts angezeigt werden.

| Name     | Beschreibung     |
| -------- | ---------------- |
| selector | lux-panel-action |

## Beispiele

### 1. Accordion

![Beispielbild 01](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img-01.png)

Html

```html
<lux-accordion luxMode="default" [luxMulti]="true">
  <lux-panel>
    <lux-panel-header-title>Antrag 4711</lux-panel-header-title>
    <lux-panel-header-description
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr
    </lux-panel-header-description>
    <lux-panel-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
        elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
        aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
        dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
        est Lorem ipsum dolor sit amet.
      </p>
    </lux-panel-content>
    <lux-panel-action>
      <lux-button
        luxLabel="Details"
        luxColor="primary"
        [luxRaised]="true"
      ></lux-button>
    </lux-panel-action>
  </lux-panel>
  <lux-panel>
    <lux-panel-header-title>Antrag 2012</lux-panel-header-title>
    <lux-panel-header-description
      >Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
      suscipit</lux-panel-header-description
    >
    <lux-panel-content></lux-panel-content>
    <lux-panel-action>
      <lux-button
        luxLabel="Details"
        luxColor="primary"
        [luxRaised]="true"
      ></lux-button>
    </lux-panel-action>
  </lux-panel>
  <lux-panel [luxHideToggle]="true" [luxDisabled]="true">
    <lux-panel-header-title>Antrag 1234</lux-panel-header-title>
    <lux-panel-header-description
      >Duis autem vel eum iriure dolor in
      hendrerit</lux-panel-header-description
    >
    <lux-panel-content>Hier steht der Inhalt.</lux-panel-content>
  </lux-panel>
</lux-accordion>
```

### 2. Panel

![Beispielbild 02](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img-02.png)

Html

```html
<lux-panel>
  <lux-panel-header-title>Antrag 4711</lux-panel-header-title>
  <lux-panel-header-description
    >Lorem ipsum dolor sit amet, consetetur sadipscing elitr
  </lux-panel-header-description>
  <lux-panel-content>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
      diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
      diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
      rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
      dolor sit amet.
    </p>
  </lux-panel-content>
  <lux-panel-action>
    <lux-button
      luxLabel="Details"
      luxColor="primary"
      [luxRaised]="true"
    ></lux-button>
  </lux-panel-action>
</lux-panel>
```

### 3. Accordion mit Custom-Panel

![Beispielbild 03](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img-03.png)

Html - custom-panel.component.html

```html
<lux-panel>
  <lux-panel-header-title>{{title}}</lux-panel-header-title>
  <lux-panel-content>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
      est Lorem ipsum dolor sit amet.
    </p>
  </lux-panel-content>
</lux-panel>
```

Ts - custom-panel.component.ts

```ts
@Component({
  selector: 'app-custom-panel',
  templateUrl: './custom-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPanelComponent extends LuxPanelComponent {

  @ViewChild(LuxPanelComponent, { static: true }) luxPanel!: LuxPanelComponent;

  title = 'Lorem ipsum dolor sit amet';

  protected getMatExpansionPanel() {
    return this.luxPanel.matExpansionPanel;
  }
}
```

Html

```html
<lux-accordion luxMode="default" [luxMulti]="true">
  <app-custom-panel></app-custom-panel>
  <lux-panel>
    <lux-panel-header-title>Antrag 4711</lux-panel-header-title>
    <lux-panel-header-description
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr
    </lux-panel-header-description>
    <lux-panel-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua.
      </p>
    </lux-panel-content>
  </lux-panel>
  
</lux-accordion>
```

### 4. Accordion mit verschiedenen Farben

#### 4.1 Accordion mit der Farbe accent

![Beispielbild 04](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img-04.png)

Html

```html
<lux-accordion luxColor="accent" [luxMulti]="true">
  <lux-panel>
    <lux-panel-header-title>Antrag 4711</lux-panel-header-title>
    <lux-panel-header-description>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr
    </lux-panel-header-description>
    <lux-panel-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua.
      </p>
    </lux-panel-content>
    <lux-panel-action>
      <lux-button
        luxLabel="Details"
        luxColor="primary"
        [luxRaised]="true"
      ></lux-button>
    </lux-panel-action>
  </lux-panel>
  <lux-panel>
    <lux-panel-header-title>Antrag 2030</lux-panel-header-title>
    <lux-panel-header-description>
      Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
      suscipit
    </lux-panel-header-description>
    <lux-panel-content></lux-panel-content>
    <lux-panel-action>
      <lux-button
        luxLabel="Details"
        luxColor="primary"
        [luxRaised]="true"
      ></lux-button>
    </lux-panel-action>
  </lux-panel>
  <lux-panel [luxDisabled]="true">
    <lux-panel-header-title>Antrag 1234</lux-panel-header-title>
    <lux-panel-header-description>
      Duis autem vel eum iriure dolor in
      hendrerit
    </lux-panel-header-description>
    <lux-panel-content>Hier steht der Inhalt.</lux-panel-content>
  </lux-panel>
</lux-accordion>
```
#### 4.2 Accordion mit der Farbe warn

![Beispielbild 05](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img-05.png)

Html

```html
<lux-accordion luxColor="warn">
  <lux-panel>
    <lux-panel-header-title>Antrag 4711</lux-panel-header-title>
    <lux-panel-header-description>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr
    </lux-panel-header-description>
  </lux-panel>
  <lux-panel>
    <lux-panel-header-title>Antrag 2030</lux-panel-header-title>
    <lux-panel-header-description>
      Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
      suscipit
      </lux-panel-header-description>
  </lux-panel>
  <lux-panel [luxDisabled]="true">
    <lux-panel-header-title>Antrag 1234</lux-panel-header-title>
    <lux-panel-header-description>
      Duis autem vel eum iriure dolor in
      hendrerit
    </lux-panel-header-description>
    <lux-panel-content>Hier steht der Inhalt.</lux-panel-content>
  </lux-panel>
</lux-accordion>
```

#### 4.3 Accordion mit der Farbe neutral

![Beispielbild 06](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img-06.png)

Html

```html
<lux-accordion luxColor="neutral">
  <lux-panel>
    <lux-panel-header-title>Antrag 4711</lux-panel-header-title>
    <lux-panel-header-description
      >Lorem ipsum dolor sit amet, consetetur sadipscing elitr
    </lux-panel-header-description>
    <lux-panel-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua.
      </p>
    </lux-panel-content>
  </lux-panel>
  <lux-panel>
    <lux-panel-header-title>Antrag 2030</lux-panel-header-title>
    <lux-panel-header-description>
      Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
      suscipit
    </lux-panel-header-description>
  </lux-panel>
  <lux-panel [luxDisabled]="true">
    <lux-panel-header-title>Antrag 1234</lux-panel-header-title>
    <lux-panel-header-description>
      Duis autem vel eum iriure dolor in
      hendrerit
    </lux-panel-header-description>
    <lux-panel-content>Hier steht der Inhalt.</lux-panel-content>
  </lux-panel>
</lux-accordion>
```

### 5. Accordion mit Toggle Icon links

Die Position des Toggle Icons kann auch im Panel definiert werden. Priorität hat das Property im Panel.

![Beispielbild 07](https://raw.githubusercontent.com/wiki/IHK-GfI/lux-components-workspace/Versions/v19/lux‐accordion-v19-img-07.png)

Html

```html
<lux-accordion luxTogglePosition="before">
  <lux-panel>
    <lux-panel-header-title>Antrag 4711</lux-panel-header-title>
    <lux-panel-header-description>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr
    </lux-panel-header-description>
    <lux-panel-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua.
      </p>
    </lux-panel-content>
  </lux-panel>
  <lux-panel luxTogglePosition="after">
    <lux-panel-header-title>Antrag 2030</lux-panel-header-title>
    <lux-panel-header-description>
      Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper
      suscipit
      </lux-panel-header-description>
  </lux-panel>
  <lux-panel [luxDisabled]="true">
    <lux-panel-header-title>Antrag 1234</lux-panel-header-title>
    <lux-panel-header-description>
      Duis autem vel eum iriure dolor in
      hendrerit
    </lux-panel-header-description>
    <lux-panel-content>Hier steht der Inhalt.</lux-panel-content>
  </lux-panel>
</lux-accordion>
```


## Zusatzinformationen

Die `LuxAccordionComponent` bietet die Möglichkeit, mehrere `LuxPanelComponents` zusammenzufassen und zu steuern.
Die `LuxPanelComponents` sind auch alleinstehend funktionsfähig und benötigen kein umgebenes `LuxAccordion`.
