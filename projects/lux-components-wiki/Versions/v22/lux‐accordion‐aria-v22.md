# LUX-Accordion (Angular Aria-basiert)

![Beispielbild LUX-Accordion-Aria](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img.png)

- [LUX-Accordion (Angular Aria-basiert)](#lux-accordion-angular-aria-basiert)
  - [Overview / API](#overview--api)
    - [Allgemein](#allgemein)
    - [@Input](#input)
  - [Components](#components)
    - [LuxPanelAriaComponent](#luxpanelariacomponent)
      - [Allgemein](#allgemein-1)
      - [@Input](#input-1)
      - [@Output](#output)
    - [LuxPanelAriaHeaderTitleComponent](#luxpanelariaheadertitlecomponent)
      - [@Input](#input-2)
    - [LuxPanelAriaHeaderDescriptionComponent](#luxpanelariaheaderdescriptioncomponent)
      - [@Input](#input-3)
    - [LuxPanelAriaContentComponent](#luxpanelariacontentcomponent)
    - [LuxPanelAriaActionComponent](#luxpanelariaactioncomponent)
    - [LuxPanelAriaHeaderCustomComponent](#luxpanelariaheadercustomcomponent)
  - [Beispiele](#beispiele)
    - [1. Accordion](#1-accordion)
    - [2. Panel](#2-panel)
    - [3. Accordion mit Custom-Header](#3-accordion-mit-custom-header)
    - [4. Accordion mit verschiedenen Farben](#4-accordion-mit-verschiedenen-farben)
      - [4.1 Accordion mit der Farbe accent](#41-accordion-mit-der-farbe-accent)
      - [4.2 Accordion mit der Farbe warn](#42-accordion-mit-der-farbe-warn)
      - [4.3 Accordion mit der Farbe neutral](#43-accordion-mit-der-farbe-neutral)
    - [5. Accordion mit Toggle Icon links](#5-accordion-mit-toggle-icon-links)
    - [6. Accordion mit Sticky-Headern](#6-accordion-mit-sticky-headern)
    - [7. Deaktiviertes Panel](#7-deaktiviertes-panel)
  - [Zusatzinformationen](#zusatzinformationen)

## Overview / API

### Allgemein

| Name     | Beschreibung                               |
| -------- | ------------------------------------------ |
| selector | lux-accordion-aria                         |
| import   | @ihk-gfi/lux-components/lux-accordion-aria |

### @Input

| Name                     | Typ                                                              | Beschreibung                                                                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxMode                  | LuxModeType (`default` \| `flat`)                                | Gibt an, ob es Abstände zwischen den Panels gibt. <br>`default` = mit Gap <br> `flat` = ohne Gap <br>Default: `default`.                                                           |
| luxMulti                 | boolean                                                          | Gibt an, ob mehrere Panels aufgeklappt sein können. Default: false.                                                                                                                |
| luxHideToggle            | boolean                                                          | Gibt an, ob das Toggle-Icon ausgeblendet werden soll.                                                                                                                              |
| luxDisabled              | boolean                                                          | Gibt an, ob das Accordion deaktiviert ist.                                                                                                                                         |
| luxCollapsedHeaderHeight | string (z.B. `20px` oder `1em`)                                  | Gibt an, wie hoch die Panelheader im eingeklappten Zustand sind. Ohne Angabe: `4em`.                                                                                               |
| luxExpandedHeaderHeight  | string (z.B. `20px` oder `1em`)                                  | Gibt an, wie hoch die Panelheader im ausgeklappten Zustand sind. Ohne Angabe: `4em`.                                                                                               |
| luxDynamicHeaderHeight   | boolean                                                          | Gibt an, ob die Headerhöhe automatisch berechnet werden soll                                                                                                                       |
| luxColor                 | LuxAccordionColor (`primary` \| `accent` \| `warn` \| `neutral`) | Gibt an, welche Farbe der Header haben soll. Default: `primary`.                                                                                                                   |
| luxTogglePosition        | LuxAriaTogglePosition (`after` \| `before`)                      | Gibt an, ob das Toggle-Icon rechts oder links angezeigt werden soll. Ohne Angabe wird es rechts angezeigt. Enthält ein Panel einen Custom-Header, ist die Position immer links.    |
| luxStickyHeader          | boolean                                                          | Gibt an, ob die Header geöffneter Panels beim Scrollen am oberen Rand des scrollbaren Bereichs kleben bleiben, solange der jeweilige Panelinhalt sichtbar ist.                     |
| luxStickyHeaderOffset    | string (z.B. `64px` oder `4em`)                                  | Gibt den Abstand des klebenden Headers zum oberen Rand an, falls dort weitere Sticky-Elemente (z.B. eine Action-Bar) kleben. Der Wert benötigt eine CSS-Einheit.                   |

Bis auf `luxMode` und `luxMulti` können alle oben genannten Properties auch je Panel individuell überschrieben werden (Priorität hat das Property im Panel).

## Components

### LuxPanelAriaComponent

Eine `LuxPanelAriaComponent` stellt einen ein- und ausklappbaren Bereich dar. Es gibt einen Titel, eine optionale Beschreibung, einen Inhaltsbereich, eine Actionzeile (z.B. für Buttons) sowie einen optionalen Custom-Header-Bereich.

#### Allgemein

| Name     | Beschreibung                               |
| -------- | ------------------------------------------ |
| selector | lux-panel-aria                             |
| import   | @ihk-gfi/lux-components/lux-accordion-aria |

#### @Input

| Name                     | Typ                                                              | Beschreibung                                                                                                                                                                                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| luxDisabled              | boolean                                                          | Gibt an, ob das Panel deaktiviert ist. Das Panel bleibt dabei fokussierbar (aria-disabled) und lässt sich nicht öffnen; ein Klick emittiert `luxClickNotAllowed`.                                                                                                                                                                       |
| luxExpanded              | boolean                                                          | Gibt an, ob das Panel aufgeklappt ist. Zusammen mit dem Output `luxExpandedChange` ist ein Two-Way-Binding über `[(luxExpanded)]` möglich. Default: false.                                                                                                                                                                              |
| luxHideToggle            | boolean                                                          | Gibt an, ob das Toggle-Icon ausgeblendet werden soll.                                                                                                                                                                                                                                                                                   |
| luxCollapsedHeaderHeight | string (z.B. `20px` oder `1em`)                                  | Gibt an, wie hoch der Header im eingeklappten Zustand ist.                                                                                                                                                                                                                                                                              |
| luxExpandedHeaderHeight  | string (z.B. `20px` oder `1em`)                                  | Gibt an, wie hoch der Header im ausgeklappten Zustand ist.                                                                                                                                                                                                                                                                              |
| luxDynamicHeaderHeight   | boolean                                                          | Gibt an, ob die Headerhöhe automatisch berechnet werden soll                                                                                                                                                                                                                                                                            |
| luxColor                 | LuxAccordionColor (`primary` \| `accent` \| `warn` \| `neutral`) | Gibt an, welche Farbe der Header haben soll.                                                                                                                                                                                                                                                                                            |
| luxTogglePosition        | LuxAriaTogglePosition (`after` \| `before`)                      | Gibt an, ob das Toggle-Icon rechts oder links angezeigt werden soll. Ohne Angabe gilt der Wert des Accordions, sonst rechts.                                                                                                                                                                                                           |
| luxStickyHeader          | boolean                                                          | Gibt an, ob der Header dieses Panels im geöffneten Zustand beim Scrollen am oberen Rand des scrollbaren Bereichs kleben bleibt, solange der Panelinhalt sichtbar ist.                                                                                                                                                                   |
| luxStickyHeaderOffset    | string (z.B. `64px` oder `4em`)                                  | Gibt den Abstand des klebenden Headers zum oberen Rand an, falls dort weitere Sticky-Elemente (z.B. eine Action-Bar) kleben. Der Wert benötigt eine CSS-Einheit.                                                                                                                                                                        |
| luxSecondRowForMobile    | boolean                                                          | Wenn `true`, wird der Custom-Header nur in der mobilen Ansicht in einer zweiten Zeile unter Titel und Beschreibung angezeigt. Buttons sollen in einem Menü zusammen gefasst werden, welches bei wenig platz automatisch kollabiert. Optional kann der CustomHeader, für die Mobile Ansicht, auch in den Panel Inhalt verschoben werden. |

#### @Output

| Name               | Typ     | Beschreibung                                                                                                                                                                         |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| luxOpened          | void    | Das Event wird geworfen, nachdem das Panel ausgeklappt wurde.                                                                                                                        |
| luxClosed          | void    | Das Event wird geworfen, nachdem das Panel eingeklappt wurde.                                                                                                                        |
| luxExpandedChange  | boolean | Das Event wird geworfen, wenn das Panel ein- oder ausgeklappt wurde.                                                                                                                 |
| luxClickNotAllowed | Event   | Das Event wird geworfen, wenn `luxDisabled === true` ist und der Panel-Header angeklickt wird (per Maus oder Tastatur). Statt des Öffnens wird ausschließlich dieses Event gesendet. |

### LuxPanelAriaHeaderTitleComponent

Diese Komponente enthält den Titel des Panels.

| Name     | Beschreibung                |
| -------- | --------------------------- |
| selector | lux-panel-aria-header-title |

#### @Input

| Name                | Typ     | Beschreibung                                                           |
| ------------------- | ------- | ---------------------------------------------------------------------- |
| luxTruncated        | boolean | Gibt an, ob der Titel gekürzt wird. Default: false.                    |
| luxTruncatedTooltip | string  | Der Tooltip wird angezeigt, wenn _luxTruncated=true_ ist. Default: ''. |

### LuxPanelAriaHeaderDescriptionComponent

Diese Komponente kann einen beschreibenden Text unterhalb des `LuxPanelAriaHeaderTitle` darstellen.

| Name     | Beschreibung                      |
| -------- | --------------------------------- |
| selector | lux-panel-aria-header-description |

#### @Input

| Name                | Typ     | Beschreibung                                                           |
| ------------------- | ------- | ---------------------------------------------------------------------- |
| luxTruncated        | boolean | Gibt an, ob die Beschreibung gekürzt wird. Default: false.             |
| luxTruncatedTooltip | string  | Der Tooltip wird angezeigt, wenn _luxTruncated=true_ ist. Default: ''. |

### LuxPanelAriaContentComponent

Diese Komponente enthält den Inhalt des Panels.
Der Inhalt wird nur dargestellt, wenn das Panel aufgeklappt ist.

| Name     | Beschreibung           |
| -------- | ---------------------- |
| selector | lux-panel-aria-content |

### LuxPanelAriaActionComponent

Diese Komponente kann [Buttons](lux‐button-v22) oder [Links](lux‐link-v22) beinhalten,
die unterhalb des Inhalts angezeigt werden.

| Name     | Beschreibung          |
| -------- | --------------------- |
| selector | lux-panel-aria-action |

### LuxPanelAriaHeaderCustomComponent

Diese Komponente kann beliebige Inhalte (z.B. [Buttons](lux‐button-v22), einen [Datepicker](lux‐datepicker-v22) oder ein [Menü](lux‐menu-v22)) im Header des Panels darstellen, z.B. für schnelle Aktionen, ohne das Panel aufklappen zu müssen.

| Name     | Beschreibung                 |
| -------- | ---------------------------- |
| selector | lux-panel-aria-header-custom |

Enthält ein Panel einen Custom-Header, wird die Toggle-Icon-Position automatisch auf `before` (links) gesetzt, damit der Custom-Header-Bereich rechts genug Platz hat.

## Beispiele

### 1. Accordion

![Beispielbild 08](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-08.png)

Html

```html
<lux-accordion-aria luxMode="default" [luxMulti]="true">
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
    <lux-panel-aria-header-description>Lorem ipsum dolor sit amet, consetetur sadipscing elitr </lux-panel-aria-header-description>
    <lux-panel-aria-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
        erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
        est Lorem ipsum dolor sit amet.
      </p>
    </lux-panel-aria-content>
    <lux-panel-aria-action>
      <lux-button luxLabel="Details" luxColor="primary" [luxRaised]="true" />
    </lux-panel-aria-action>
  </lux-panel-aria>
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 2012</lux-panel-aria-header-title>
    <lux-panel-aria-header-description
      >Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit</lux-panel-aria-header-description
    >
    <lux-panel-aria-content />
    <lux-panel-aria-action>
      <lux-button luxLabel="Details" luxColor="primary" [luxRaised]="true" />
    </lux-panel-aria-action>
  </lux-panel-aria>
  <lux-panel-aria [luxHideToggle]="true" [luxDisabled]="true">
    <lux-panel-aria-header-title>Antrag 1234</lux-panel-aria-header-title>
    <lux-panel-aria-header-description>Duis autem vel eum iriure dolor in hendrerit</lux-panel-aria-header-description>
    <lux-panel-aria-content>Hier steht der Inhalt.</lux-panel-aria-content>
  </lux-panel-aria>
</lux-accordion-aria>
```

### 2. Panel

![Beispielbild 01](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-01.png)

Html

```html
<lux-panel-aria>
  <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
  <lux-panel-aria-header-description>Lorem ipsum dolor sit amet, consetetur sadipscing elitr </lux-panel-aria-header-description>
  <lux-panel-aria-content>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
    </p>
  </lux-panel-aria-content>
  <lux-panel-aria-action>
    <lux-button luxLabel="Details" luxColor="primary" [luxRaised]="true" />
  </lux-panel-aria-action>
</lux-panel-aria>
```

### 3. Accordion mit Custom-Header

![Beispielbild 02](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-02.png)

Der Custom-Header eignet sich für schnelle Aktionen (z.B. Buttons oder ein Menü), die unabhängig vom Auf-/Zuklappen des Panels bedienbar sein sollen.

Html

```html
<lux-accordion-aria [luxMulti]="true">
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
    <lux-panel-aria-header-description>Lorem ipsum dolor sit amet, consetetur sadipscing elitr </lux-panel-aria-header-description>
    <lux-panel-aria-header-custom>
      <lux-button luxLabel="Speichern" [luxIconButton]="true" luxIconName="lux-save" />
      <lux-button luxLabel="Löschen" [luxIconButton]="true" luxIconName="lux-interface-delete-bin-2" />
    </lux-panel-aria-header-custom>
    <lux-panel-aria-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
        erat, sed diam voluptua.
      </p>
    </lux-panel-aria-content>
  </lux-panel-aria>
</lux-accordion-aria>
```

### 4. Accordion mit verschiedenen Farben

#### 4.1 Accordion mit der Farbe accent

![Beispielbild 03](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-03.png)

Html

```html
<lux-accordion-aria luxColor="accent" [luxMulti]="true">
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
    <lux-panel-aria-header-description> Lorem ipsum dolor sit amet, consetetur sadipscing elitr </lux-panel-aria-header-description>
    <lux-panel-aria-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
        erat, sed diam voluptua.
      </p>
    </lux-panel-aria-content>
    <lux-panel-aria-action>
      <lux-button luxLabel="Details" luxColor="primary" [luxRaised]="true" />
    </lux-panel-aria-action>
  </lux-panel-aria>
  <lux-panel-aria [luxDisabled]="true">
    <lux-panel-aria-header-title>Antrag 1234</lux-panel-aria-header-title>
    <lux-panel-aria-header-description> Duis autem vel eum iriure dolor in hendrerit </lux-panel-aria-header-description>
    <lux-panel-aria-content>Hier steht der Inhalt.</lux-panel-aria-content>
  </lux-panel-aria>
</lux-accordion-aria>
```

#### 4.2 Accordion mit der Farbe warn

![Beispielbild 04](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-04.png)

Html

```html
<lux-accordion-aria luxColor="warn">
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
    <lux-panel-aria-header-description> Lorem ipsum dolor sit amet, consetetur sadipscing elitr </lux-panel-aria-header-description>
    <lux-panel-aria-content><p>Hier steht der Inhalt.</p></lux-panel-aria-content>
  </lux-panel-aria>
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 1234</lux-panel-aria-header-title>
    <lux-panel-aria-header-description> Duis autem vel eum iriure dolor in hendrerit </lux-panel-aria-header-description>
    <lux-panel-aria-content><p>Hier steht der Inhalt.</p></lux-panel-aria-content>
  </lux-panel-aria>
</lux-accordion-aria>
```

#### 4.3 Accordion mit der Farbe neutral

![Beispielbild 05](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-05.png)

Html

```html
<lux-accordion-aria luxColor="neutral">
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
    <lux-panel-aria-header-description>Lorem ipsum dolor sit amet, consetetur sadipscing elitr </lux-panel-aria-header-description>
    <lux-panel-aria-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
        erat, sed diam voluptua.
      </p>
    </lux-panel-aria-content>
  </lux-panel-aria>
</lux-accordion-aria>
```

### 5. Accordion mit Toggle Icon links

![Beispielbild 06](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-06.png)

Die Position des Toggle Icons kann auch im Panel definiert werden. Priorität hat das Property im Panel.

Html

```html
<lux-accordion-aria luxTogglePosition="before">
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
    <lux-panel-aria-header-description> Lorem ipsum dolor sit amet, consetetur sadipscing elitr </lux-panel-aria-header-description>
    <lux-panel-aria-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
        erat, sed diam voluptua.
      </p>
    </lux-panel-aria-content>
  </lux-panel-aria>
  <lux-panel-aria luxTogglePosition="after">
    <lux-panel-aria-header-title>Antrag 2030</lux-panel-aria-header-title>
    <lux-panel-aria-header-description>
      Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit
    </lux-panel-aria-header-description>
    <lux-panel-aria-content>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
        erat, sed diam voluptua.
      </p>
    </lux-panel-aria-content>
  </lux-panel-aria>
</lux-accordion-aria>
```

### 6. Accordion mit Sticky-Headern

Bleibt der Header eines geöffneten Panels beim Scrollen sichtbar, kann der Abschnitt jederzeit erkannt und direkt wieder eingeklappt werden. Verlässt der Panelinhalt den sichtbaren Bereich, schiebt der untere Panelrand den Header automatisch hinaus; bei mehreren geöffneten Panels übernimmt der Header des nächsten Panels. Beide Properties können auch je Panel gesetzt werden; Priorität hat das Property im Panel.

Html

```html
<lux-accordion-aria [luxStickyHeader]="true" luxStickyHeaderOffset="64px" [luxMulti]="true">
  <lux-panel-aria>
    <lux-panel-aria-header-title>Antrag 4711</lux-panel-aria-header-title>
    <lux-panel-aria-content>
      <p>Langer Inhalt ...</p>
    </lux-panel-aria-content>
  </lux-panel-aria>
</lux-accordion-aria>
```

### 7. Deaktiviertes Panel

![Beispielbild 07](https://raw.githubusercontent.com/IHK-GfI/lux-components-workspace/main/projects/lux-components-wiki/Versions/v22/lux‐accordion‐aria-v22-img-07.png)

Ein deaktiviertes Panel lässt sich nicht öffnen, bleibt aber fokussierbar (aria-disabled statt native disabled). Ein Klick oder eine Bedienung per Tastatur (Enter/Leertaste) auf den Header emittiert `luxClickNotAllowed`, sodass die Anwendung z.B. einen Hinweis anzeigen kann.

Html

```html
<lux-panel-aria [luxDisabled]="true" (luxClickNotAllowed)="onPanelClickNotAllowed()">
  <lux-panel-aria-header-title>Antrag 1234</lux-panel-aria-header-title>
  <lux-panel-aria-header-description>Duis autem vel eum iriure dolor in hendrerit</lux-panel-aria-header-description>
  <lux-panel-aria-content>Hier steht der Inhalt.</lux-panel-aria-content>
</lux-panel-aria>
```

Ts

```typescript
private readonly snackbar = inject(LuxSnackbarService);

onPanelClickNotAllowed() {
  this.snackbar.open(3000, {
    text: 'Panel ist deaktiviert und kann nicht geöffnet werden.',
    iconName: 'lux-info'
  });
}
```

## Zusatzinformationen

Die `LuxAccordionAriaComponent` bietet die Möglichkeit, mehrere `LuxPanelAriaComponents` zusammenzufassen und zu steuern.
Die `LuxPanelAriaComponents` sind auch alleinstehend funktionsfähig und benötigen kein umgebenes `LuxAccordionAria`.

Im Gegensatz zur klassischen [LUX-Accordion](lux‐accordion-v22) basiert diese Variante auf den [Angular Aria](https://angular.dev)-Primitives (`@angular/aria/accordion`) statt auf `MatExpansionPanel` und ist dadurch headless/leichter anpassbar.

Alle Komponenten werden aus dem eigenen Einstiegspunkt `@ihk-gfi/lux-components/lux-accordion-aria` importiert:

```typescript
import {
  LuxAccordionAriaComponent,
  LuxPanelAriaActionComponent,
  LuxPanelAriaComponent,
  LuxPanelAriaContentComponent,
  LuxPanelAriaHeaderDescriptionComponent,
  LuxPanelAriaHeaderTitleComponent
} from '@ihk-gfi/lux-components/lux-accordion-aria';
```

**Hinweise zu `luxStickyHeader`:**

- Zwischen dem Panel und dem scrollbaren Container darf kein weiterer Scroll-Container liegen, sonst kann der Header nicht kleben. Ein Scroll-Container entsteht bei den `overflow`-Werten `auto`, `scroll` und `hidden` — nicht dagegen bei `visible` und `clip`. Eine `lux-card` schneidet ihren Inhalt deshalb mit `clip` ab und steht dem Kleben nicht im Weg; nur die Klasse `lux-card-scroll-content` macht sie wieder zum Scroll-Container (siehe [LUX-Card](lux‐card-v22#überbreiter-oder-zu-hoher-inhalt)).
- `luxStickyHeaderOffset` benötigt eine CSS-Länge mit Einheit. Ein Wert ohne Einheit (z.B. `50`) deaktiviert das Kleben.
- Ein klebender Header kann per Tastatur fokussierte Inhalte am oberen Rand überdecken. Bei sehr langen Formularen im Panelinhalt sollte das beim Einsatz der Option bedacht werden.

**Hinweise zu `luxDisabled`:**

- Ein deaktiviertes Panel wird über `aria-disabled` (nicht das native `disabled`-Attribut) markiert, bleibt also fokussierbar und für Screenreader wahrnehmbar. Anwendungen sollten auf `luxClickNotAllowed` reagieren und dem Nutzer einen Hinweis auf die fachliche Deaktivierung geben (z.B. per Snackbar), am besten sollte jedoch das deaktivieren vermieden werden und stattdessen das Panel ausgeblendet werden.
